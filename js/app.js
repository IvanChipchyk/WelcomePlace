/**
 * WelcomePlace - Core Application Controller
 * Handles 3 Profiles (Student, Teacher, Admin), PIN authentication,
 * Lesson Navigation (Presentation, Text, Video, Audio, Quiz), and Admin Metrics Dashboard.
 */

const App = {
  currentRole: 'student',
  currentModule: null,
  activeLab: null, // 'mouse' | 'typing' | null
  activeLessonTab: 'presentation',
  presentationViewMode: 'deck', // 'deck' | 'pdf'
  currentSlideIndex: 0,
  pendingRoleSwitch: null,
  isAdminAuthenticated: false,
  selectedAvatarId: 'avatar_hijab_teal',
  adminActiveTab: 'metrics', // 'metrics' | 'teachers' | 'students'
  adminStudentAvatarId: 'avatar_hijab_teal',
  adminEditStudentAvatarId: 'avatar_hijab_teal',
  adminMetricFilterStudent: 'ALL',
  adminMetricFilterType: 'ALL',
  adminMetricFilterStatus: 'ALL',
  adminMetricSearchQuery: '',

  isTeacherAuthenticated() {
    return this.currentRole === 'teacher' && Boolean(StorageService.getActiveTeacher());
  },

  isUserAuthenticated() {
    if (this.currentRole === 'admin') return this.isAdminAuthenticated;
    if (this.currentRole === 'teacher') return Boolean(StorageService.getActiveTeacher());
    return StorageService.isStudentLoggedIn();
  },

  async init() {
    this.currentRole = StorageService.getCurrentRole();
    // Enforce authentication on fresh page load: never auto-enter Admin without PIN or Teacher without session
    if (this.currentRole === 'admin' && !this.isAdminAuthenticated) {
      this.currentRole = 'student';
      StorageService.setCurrentRole('student');
    }
    if (this.currentRole === 'teacher' && !StorageService.getActiveTeacher()) {
      this.currentRole = 'student';
      StorageService.setCurrentRole('student');
    }

    const student = StorageService.getActiveStudent();
    if (student && student.avatarId) {
      this.selectedAvatarId = student.avatarId;
    }
    this.setupEventListeners();
    this.updateRoleUI();
    this.render();

    // 1. Synchronize with Turso SQLite cloud database
    const sqliteSynced = await StorageService.syncWithSqlite();
    if (sqliteSynced) {
      this.updateRoleUI();
      this.render();
    }
  },

  setupEventListeners() {
    // Role switcher buttons
    document.querySelectorAll('[data-role-target]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetRole = btn.getAttribute('data-role-target');
        this.requestRoleChange(targetRole);
      });
    });

    // Close PIN modal on background click
    const pinModal = document.getElementById('pin-modal');
    if (pinModal) {
      pinModal.addEventListener('click', (e) => {
        if (e.target === pinModal) this.closePinModal();
      });
    }

    // Close Student Login modal on background click
    const studentModal = document.getElementById('student-login-modal');
    if (studentModal) {
      studentModal.addEventListener('click', (e) => {
        if (e.target === studentModal) this.closeStudentLoginModal();
      });
    }

    // Close Teacher Login modal on background click
    const teacherModal = document.getElementById('teacher-login-modal');
    if (teacherModal) {
      teacherModal.addEventListener('click', (e) => {
        if (e.target === teacherModal) this.closeTeacherLoginModal();
      });
    }

    // Close Admin Create Teacher modal
    const createTeacherModal = document.getElementById('admin-create-teacher-modal');
    if (createTeacherModal) {
      createTeacherModal.addEventListener('click', (e) => {
        if (e.target === createTeacherModal) this.closeCreateTeacherModal();
      });
    }

    // Close Admin Create Student modal
    const createStudentModal = document.getElementById('admin-create-student-modal');
    if (createStudentModal) {
      createStudentModal.addEventListener('click', (e) => {
        if (e.target === createStudentModal) this.closeCreateStudentModal();
      });
    }

    // Close Admin Edit Student modal
    const editStudentModal = document.getElementById('admin-edit-student-modal');
    if (editStudentModal) {
      editStudentModal.addEventListener('click', (e) => {
        if (e.target === editStudentModal) this.closeEditStudentModal();
      });
    }

    // Close Admin Edit Teacher modal
    const editTeacherModal = document.getElementById('admin-edit-teacher-modal');
    if (editTeacherModal) {
      editTeacherModal.addEventListener('click', (e) => {
        if (e.target === editTeacherModal) this.closeEditTeacherModal();
      });
    }

    // Keyboard navigation for Presentation slides
    document.addEventListener('keydown', (e) => {
      if (
        this.currentModule &&
        this.activeLessonTab === 'presentation' &&
        this.presentationViewMode === 'deck' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target && e.target.tagName) || '')
      ) {
        if (e.key === 'ArrowRight') this.nextSlide();
        if (e.key === 'ArrowLeft') this.prevSlide();
      }
    });
  },

  togglePasswordVisibility(inputId, btnEl) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    if (btnEl) btnEl.textContent = isHidden ? '🙈' : '👁️';
  },

  // ==========================================
  // Student Profile & Sign In (Admin-Created Only)
  // ==========================================
  handleUserBadgeClick() {
    if (this.currentRole === 'student') {
      this.openStudentLoginModal();
    }
  },

  openStudentLoginModal() {
    const modal = document.getElementById('student-login-modal');
    if (!modal) return;

    const student = (typeof StorageService !== 'undefined' && StorageService.isStudentLoggedIn())
      ? StorageService.getActiveStudent()
      : null;

    const nickField = document.getElementById('student-nickname-field');
    const passField = document.getElementById('student-password-field');
    const previewEl = document.getElementById('student-login-avatar-preview');

    if (nickField) nickField.value = student ? (student.nickname || '') : '';
    if (passField) {
      passField.value = '';
      passField.type = 'password';
    }
    if (previewEl) {
      if (student && typeof AvatarsService !== 'undefined') {
        previewEl.innerHTML = `${AvatarsService.getSvgHtml(student.avatarId || 'avatar_hijab_teal', 32)} <span>Signing in as <strong>${student.nickname}</strong></span>`;
        previewEl.style.display = 'flex';
      } else {
        previewEl.style.display = 'none';
      }
    }

    this.renderRecentStudentsList();

    modal.classList.add('open');
    if (nickField) setTimeout(() => nickField.focus(), 100);
  },

  closeStudentLoginModal() {
    const modal = document.getElementById('student-login-modal');
    if (modal) modal.classList.remove('open');
  },

  renderRecentStudentsList() {
    const section = document.getElementById('recent-students-section');
    const container = document.getElementById('recent-students-chips');
    if (!section || !container) return;

    const registered = (typeof StorageService !== 'undefined')
      ? StorageService.getRegisteredStudents()
      : [];

    if (!registered || registered.length === 0) {
      section.style.display = 'block';
      container.innerHTML = '<span style="font-size: 0.82rem; color: var(--text-light);">No student profiles registered yet. Ask the Administrator to create your account.</span>';
      return;
    }

    section.style.display = 'block';
    let html = '';
    registered.forEach(st => {
      const iconSvg = (typeof AvatarsService !== 'undefined')
        ? AvatarsService.getSvgHtml(st.avatarId || 'avatar_hijab_teal', 20)
        : '';
      const safeNick = encodeURIComponent(st.nickname || '');
      html += `
        <button type="button" class="recent-student-pill" onclick="App.quickSelectStudent(decodeURIComponent('${safeNick}'))">
          ${iconSvg}
          <span>${st.nickname}</span>
        </button>
      `;
    });
    container.innerHTML = html;
  },

  quickSelectStudent(nickname) {
    const list = StorageService.getRegisteredStudents();
    const found = list.find(s => (s.nickname || '').toLowerCase() === (nickname || '').toLowerCase());
    if (found) {
      const nickField = document.getElementById('student-nickname-field');
      const passField = document.getElementById('student-password-field');
      const previewEl = document.getElementById('student-login-avatar-preview');
      if (nickField) nickField.value = found.nickname;
      if (passField) {
        passField.value = '';
        passField.focus();
      }
      if (previewEl && typeof AvatarsService !== 'undefined') {
        previewEl.innerHTML = `${AvatarsService.getSvgHtml(found.avatarId || 'avatar_hijab_teal', 32)} <span>Selected profile: <strong>${found.nickname}</strong> — enter your password</span>`;
        previewEl.style.display = 'flex';
      }
    }
  },

  submitStudentLogin() {
    const nickField = document.getElementById('student-nickname-field');
    const passField = document.getElementById('student-password-field');

    const nickname = (nickField ? nickField.value : '').trim();
    const password = (passField ? passField.value : '').trim();

    const authRes = StorageService.authenticateStudent(nickname, password);
    if (!authRes.success) {
      alert(authRes.error);
      if (passField) {
        passField.value = '';
        passField.focus();
      }
      return;
    }

    this.closeStudentLoginModal();
    this.setRole('student');
  },

  logoutStudent() {
    if (confirm('Log out of this student account? This prevents unauthorized users from accessing your records.')) {
      StorageService.logoutStudent();
      this.cleanupLabs();
      this.currentModule = null;
      this.activeLab = null;
      this.updateRoleUI();
      this.render();
    }
  },

  // ==========================================
  // Role Authentication & Switching
  // ==========================================
  requestRoleChange(targetRole) {
    if (targetRole === this.currentRole) return;

    if (targetRole === 'student') {
      if (this.currentRole === 'admin') {
        this.isAdminAuthenticated = false;
      }
      this.setRole('student');
      return;
    }

    if (targetRole === 'teacher') {
      if (this.currentRole === 'admin') {
        this.isAdminAuthenticated = false;
      }
      const activeTeacher = StorageService.getActiveTeacher();
      if (activeTeacher) {
        this.setRole('teacher');
      } else {
        this.openTeacherLoginModal();
      }
      return;
    }

    if (targetRole === 'admin') {
      if (this.isAdminAuthenticated) {
        this.setRole('admin');
      } else {
        this.pendingRoleSwitch = 'admin';
        this.openPinModal('admin');
      }
      return;
    }
  },

  // ==========================================
  // Teacher Login Flow (Personalized Accounts)
  // ==========================================
  openTeacherLoginModal() {
    const modal = document.getElementById('teacher-login-modal');
    if (!modal) return;

    const userField = document.getElementById('teacher-username-field');
    const passField = document.getElementById('teacher-password-field');
    if (userField) userField.value = '';
    if (passField) passField.value = '';

    // Render registered teacher quick chips
    this.renderRegisteredTeachersList();

    modal.classList.add('open');
    if (userField) setTimeout(() => userField.focus(), 100);
  },

  closeTeacherLoginModal() {
    const modal = document.getElementById('teacher-login-modal');
    if (modal) modal.classList.remove('open');
  },

  renderRegisteredTeachersList() {
    const container = document.getElementById('registered-teachers-chips');
    const section = document.getElementById('registered-teachers-section');
    if (!container) return;

    const teachers = StorageService.getTeacherAccounts();
    if (!teachers || teachers.length === 0) {
      if (section) section.style.display = 'none';
      return;
    }

    if (section) section.style.display = 'block';
    let html = '';
    teachers.forEach(t => {
      html += `
        <button type="button" class="recent-student-pill" onclick="App.quickSelectTeacher('${t.username}')">
          <span>🧑‍🏫</span>
          <span>${t.name} (@${t.username})</span>
        </button>
      `;
    });
    container.innerHTML = html;
  },

  quickSelectTeacher(username) {
    const userField = document.getElementById('teacher-username-field');
    const passField = document.getElementById('teacher-password-field');
    if (userField) userField.value = username;
    if (passField) {
      passField.value = '';
      passField.focus();
    }
  },

  submitTeacherLogin() {
    const userField = document.getElementById('teacher-username-field');
    const passField = document.getElementById('teacher-password-field');

    const username = (userField ? userField.value : '').trim();
    const password = (passField ? passField.value : '').trim();

    const authRes = StorageService.authenticateTeacher(username, password);
    if (!authRes.success) {
      alert(authRes.error);
      if (passField) {
        passField.value = '';
        passField.focus();
      }
      return;
    }

    this.closeTeacherLoginModal();
    this.setRole('teacher');
  },

  logoutTeacher() {
    if (confirm('Log out of this personalized teacher account?')) {
      StorageService.logoutTeacher();
      this.cleanupLabs();
      this.currentModule = null;
      this.activeLab = null;
      this.setRole('student');
    }
  },

  exitAdmin() {
    this.isAdminAuthenticated = false;
    this.setRole('student');
  },

  openPinModal(role) {
    const modal = document.getElementById('pin-modal');
    const title = document.getElementById('pin-modal-title');
    const hint = document.getElementById('pin-modal-hint');
    const pinInput = document.getElementById('pin-input');

    if (!modal) return;

    title.textContent = '🛡️ Administrator Access';
    hint.innerHTML = 'Enter 4-digit Admin Master PIN (Default demo PIN: <strong>9999</strong>)';

    pinInput.value = '';
    modal.classList.add('open');
    setTimeout(() => pinInput.focus(), 100);
  },

  closePinModal() {
    const modal = document.getElementById('pin-modal');
    if (modal) modal.classList.remove('open');
    this.pendingRoleSwitch = null;
  },

  verifyPin() {
    const pinInput = document.getElementById('pin-input');
    const pin = (pinInput ? pinInput.value : '').trim();

    if (this.pendingRoleSwitch === 'admin') {
      if (pin === StorageService.getAdminPin()) {
        this.isAdminAuthenticated = true;
        this.setRole('admin');
        this.closePinModal();
      } else {
        alert('Incorrect Administrator PIN. (Hint: 9999)');
        pinInput.value = '';
        pinInput.focus();
      }
    }
  },

  setRole(role) {
    this.cleanupLabs();
    this.activeLab = null;
    this.currentModule = null;
    this.activeLessonTab = 'presentation';
    this.currentRole = role;
    StorageService.setCurrentRole(role);
    this.updateRoleUI();
    this.render();
  },

  updateRoleUI() {
    document.querySelectorAll('[data-role-target]').forEach(btn => {
      const r = btn.getAttribute('data-role-target');
      if (r === this.currentRole) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const badgeText = document.getElementById('active-role-text');
    const avatarSlot = document.getElementById('header-avatar-slot');
    const logoutBtn = document.getElementById('student-logout-header-btn');
    const labsNav = document.getElementById('header-labs-nav');
    const student = StorageService.getActiveStudent();
    const isStudentLogged = StorageService.isStudentLoggedIn();
    const activeTeacher = StorageService.getActiveTeacher();
    const isAuth = this.isUserAuthenticated();

    if (labsNav) {
      labsNav.style.display = (isAuth && this.currentRole !== 'admin') ? 'flex' : 'none';
    }

    if (this.currentRole === 'student') {
      if (isStudentLogged) {
        if (badgeText) badgeText.innerHTML = `Learner: <strong>${student.nickname || 'Student'}</strong>`;
        if (avatarSlot) {
          avatarSlot.innerHTML = AvatarsService.getSvgHtml(student.avatarId || 'avatar_hijab_teal', 26);
          avatarSlot.style.display = 'flex';
        }
        if (logoutBtn) {
          logoutBtn.style.display = 'inline-flex';
          logoutBtn.innerHTML = '<span>🚪</span><span>Log Out</span>';
          logoutBtn.onclick = () => App.logoutStudent();
        }
      } else {
        if (badgeText) badgeText.innerHTML = `🔒 Learner: <em>Not Signed In</em>`;
        if (avatarSlot) avatarSlot.style.display = 'none';
        if (logoutBtn) {
          logoutBtn.style.display = 'inline-flex';
          logoutBtn.innerHTML = '<span>🔑</span><span>Sign In</span>';
          logoutBtn.onclick = () => App.openStudentLoginModal();
        }
      }
    } else if (this.currentRole === 'teacher') {
      if (avatarSlot) avatarSlot.style.display = 'none';
      if (badgeText) {
        const teacherName = activeTeacher ? activeTeacher.name : 'Not Signed In';
        badgeText.innerHTML = `🧑‍🏫 Teacher: <strong>${teacherName}</strong>`;
      }
      if (logoutBtn) {
        logoutBtn.style.display = 'inline-flex';
        logoutBtn.innerHTML = activeTeacher ? '<span>🚪</span><span>Log Out (Teacher)</span>' : '<span>🔑</span><span>Teacher Sign In</span>';
        logoutBtn.onclick = () => activeTeacher ? App.logoutTeacher() : App.openTeacherLoginModal();
      }
    } else {
      // Administrator
      if (avatarSlot) avatarSlot.style.display = 'none';
      if (badgeText) {
        badgeText.innerHTML = '🛡️ Profile: <strong>Administrator</strong>';
      }
      if (logoutBtn) {
        logoutBtn.style.display = 'inline-flex';
        logoutBtn.innerHTML = '<span>🚪</span><span>Exit Admin</span>';
        logoutBtn.onclick = () => App.exitAdmin();
      }
    }
  },

  // ==========================================
  // Render Router
  // ==========================================
  render() {
    const mainContainer = document.getElementById('app-main-content');
    if (!mainContainer) return;

    if (this.currentRole === 'admin') {
      if (!this.isAdminAuthenticated) {
        this.currentRole = 'student';
        StorageService.setCurrentRole('student');
        this.updateRoleUI();
        this.renderModulesList(mainContainer);
        return;
      }
      this.cleanupLabs();
      this.renderAdminDashboard(mainContainer);
      return;
    }

    if (!this.isUserAuthenticated()) {
      this.cleanupLabs();
      this.activeLab = null;
      this.currentModule = null;
      this.renderModulesList(mainContainer);
      return;
    }

    if (this.activeLab === 'mouse') {
      if (typeof MouseTrainer !== 'undefined') MouseTrainer.init(mainContainer);
    } else if (this.activeLab === 'typing') {
      if (typeof TypingTrainer !== 'undefined') TypingTrainer.init(mainContainer, 0);
    } else if (this.currentModule) {
      this.cleanupLabs();
      this.renderLessonView(mainContainer);
    } else {
      this.cleanupLabs();
      this.renderModulesList(mainContainer);
    }
  },

  cleanupLabs() {
    if (typeof TypingTrainer !== 'undefined') {
      if (TypingTrainer.cleanup) TypingTrainer.cleanup();
      if (TypingTrainer.cleanupTimers) TypingTrainer.cleanupTimers();
    }
    if (typeof MouseTrainer !== 'undefined') {
      if (MouseTrainer.stopTimer) MouseTrainer.stopTimer();
      if (MouseTrainer.cleanupTimers) MouseTrainer.cleanupTimers();
    }
  },

  openMouseTrainer() {
    if (!this.isUserAuthenticated()) {
      this.openStudentLoginModal();
      return;
    }
    this.cleanupLabs();
    this.currentModule = null;
    this.activeLab = 'mouse';
    const container = document.getElementById('app-main-content');
    if (container && typeof MouseTrainer !== 'undefined') {
      MouseTrainer.init(container);
    }
  },

  openTypingTrainer(lessonIdx = 0) {
    if (!this.isUserAuthenticated()) {
      this.openStudentLoginModal();
      return;
    }
    this.cleanupLabs();
    this.currentModule = null;
    this.activeLab = 'typing';
    const container = document.getElementById('app-main-content');
    if (container && typeof TypingTrainer !== 'undefined') {
      TypingTrainer.init(container, lessonIdx);
    }
  },

  // ==========================================
  // View 1: Modules Catalog & Media Hub
  // ==========================================
  renderModulesList(container = document.getElementById('app-main-content')) {
    this.currentModule = null;

    const isTeacher = this.isTeacherAuthenticated();
    const isStudentLogged = this.currentRole === 'student' && StorageService.isStudentLoggedIn();
    const isAuth = this.isUserAuthenticated();
    const student = StorageService.getActiveStudent();
    const activeTeacher = StorageService.getActiveTeacher();

    let heroHtml = '';

    if (isTeacher) {
      heroHtml = `
        <div class="welcome-hero welcome-hero-teacher">
          <div class="welcome-hero-content">
            <div class="hero-pill">🧑‍🏫 Authenticated Instructor Session</div>
            <h2>Welcome, ${activeTeacher.name}!</h2>
            <p>
              Full access to all learning modules, classroom presentations, student media, and your <strong>Teacher-Exclusive Lesson Plan & Verbatim Teaching Script</strong>.
            </p>
            <div class="student-identity-bar">
              <div style="display: flex; align-items: center; gap: 0.85rem;">
                <div class="hero-teacher-avatar">🧑‍🏫</div>
                <div>
                  <div style="font-size: 1.08rem; font-weight: 800; color: white;">
                    ${activeTeacher.name} (@${activeTeacher.username})
                  </div>
                  <div style="font-size: 0.82rem; color: #fed7aa;">
                    ${activeTeacher.specialization || 'Digital Literacy Instructor'} • Teacher Guide Unlocked
                  </div>
                </div>
              </div>
              <button 
                type="button" 
                class="btn-secondary" 
                style="padding: 0.55rem 1.1rem; border-radius: var(--radius-full); font-size: 0.86rem;"
                onclick="App.openModule('mod_mouse', 'teacher_notes')"
              >
                <span>📖 Open Teacher Script & Plan</span>
              </button>
            </div>
          </div>
        </div>
      `;
    } else if (isStudentLogged) {
      heroHtml = `
        <div class="welcome-hero">
          <div class="welcome-hero-content">
            <div class="hero-pill">🇨🇦 WelcomePlace Canada • Classroom Unlocked</div>
            <h2>👋 Welcome back, ${student.nickname || 'Learner'}!</h2>
            <p>
              Explore interactive presentations, step-by-step videos, illustrated PDF guides, hands-on practice labs, and quizzes at your own pace.
            </p>
            
            <div class="student-identity-bar" style="justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 0.85rem;">
                ${AvatarsService.getSvgHtml(student.avatarId || 'avatar_hijab_teal', 52)}
                <div>
                  <div style="font-size: 1.1rem; font-weight: 800; color: white;">
                    ${student.nickname || 'Student'}
                  </div>
                  <div style="font-size: 0.82rem; color: #bae6fd;">
                    Signed-In Student Profile • All Materials Unlocked
                  </div>
                </div>
              </div>

              <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
                <button 
                  type="button" 
                  class="btn-secondary" 
                  style="padding: 0.55rem 1rem; border-radius: var(--radius-full); font-size: 0.86rem;"
                  onclick="App.openModule('mod_mouse', 'presentation', 'deck')"
                >
                  <span>📊 Open Presentation</span>
                </button>
                <button 
                  type="button" 
                  class="btn-danger" 
                  style="padding: 0.55rem 1rem; border-radius: var(--radius-full); font-size: 0.86rem; background: #fee2e2; border-color: #fca5a5;"
                  onclick="App.logoutStudent()"
                >
                  <span>🚪 Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      // Unauthenticated visitor — strict access lock
      heroHtml = `
        <div class="welcome-hero welcome-hero-locked">
          <div class="welcome-hero-content">
            <div class="hero-pill">🔒 Protected Classroom Access</div>
            <h2>Welcome to WelcomePlace Canada</h2>
            <p>
              Presentations, classroom files, video lessons, and interactive practice labs are available <strong>only to signed-in users</strong>. Student and teacher accounts are created exclusively by the Administrator.
            </p>
            
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1.25rem;">
              <button 
                type="button" 
                class="download-txt-cta" 
                style="width: auto; padding: 0.85rem 1.5rem; background: #38bdf8; color: #0f172a; font-weight: 800;"
                onclick="App.openStudentLoginModal()"
              >
                <span>🔑 Student Sign In</span>
                <span>➜</span>
              </button>
              <button 
                type="button" 
                class="btn-secondary" 
                style="padding: 0.85rem 1.35rem; background: rgba(255,255,255,0.14); color: #ffffff; border-color: rgba(255,255,255,0.35);"
                onclick="App.requestRoleChange('teacher')"
              >
                <span>🧑‍🏫 Teacher Sign In</span>
              </button>
              <button 
                type="button" 
                class="btn-secondary" 
                style="padding: 0.85rem 1.35rem; background: rgba(255,255,255,0.08); color: #e2e8f0; border-color: rgba(255,255,255,0.22);"
                onclick="App.requestRoleChange('admin')"
              >
                <span>🛡️ Admin Portal</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }

    // Build Media & Presentations Library section ONLY for authenticated users
    let mediaHubHtml = '';
    if (isAuth && MODULES_DATA.length > 0) {
      const mod = MODULES_DATA[0];
      const materials = mod.studentMaterials || [];
      const teacherExclusiveDoc = (isTeacher && mod.teacherNotes && mod.teacherNotes.teacherExclusiveDoc)
        ? mod.teacherNotes.teacherExclusiveDoc
        : null;

      mediaHubHtml = `
        <div class="section-title-wrap" style="margin-top: 2.25rem;">
          <h2 class="section-title">
            <span>📂</span>
            <span>Presentations & Classroom Media Library</span>
          </h2>
          <span style="font-size: 0.88rem; color: var(--text-muted); font-weight: 600;">
            ${isTeacher ? 'Student materials + Teacher-Exclusive Lesson Script' : 'Unlocked for signed-in users'}
          </span>
        </div>

        <div class="media-files-grid">
          ${materials.map(item => `
            <div class="media-file-card">
              <div class="media-file-top">
                <div class="media-file-icon">${item.icon}</div>
                <span class="media-file-badge">${item.badge}</span>
              </div>
              <h3 class="media-file-title">${item.title}</h3>
              <p class="media-file-desc">${item.description}</p>
              <div class="media-file-meta">📦 Size: ${item.size}</div>
              <div class="media-file-actions">
                <button
                  type="button"
                  class="btn-primary-sm"
                  onclick="App.openModule('${mod.id}', '${item.previewTab || 'presentation'}', '${item.previewMode || 'deck'}')"
                >
                  <span>👁️ Open in App</span>
                </button>
                <a
                  href="${item.file}"
                  download
                  class="btn-secondary"
                  style="padding: 0.45rem 0.85rem; font-size: 0.82rem; text-decoration: none;"
                >
                  <span>📥 Download</span>
                </a>
              </div>
            </div>
          `).join('')}

          ${teacherExclusiveDoc ? `
            <div class="media-file-card teacher-exclusive-card">
              <div class="media-file-top">
                <div class="media-file-icon" style="background: #ffedd5; color: #c2410c;">🔒</div>
                <span class="media-file-badge" style="background: #9a3412; color: #ffffff;">${teacherExclusiveDoc.badge}</span>
              </div>
              <h3 class="media-file-title" style="color: #7c2d12;">${teacherExclusiveDoc.title}</h3>
              <p class="media-file-desc" style="color: #9a3412;">
                Full 75–90 min verbatim instructor script (Blocks 1–5), Say-Show-Do methodology, Color-Dot technique, and MS Paint offline drills. Visible only to signed-in Teachers.
              </p>
              <div class="media-file-meta" style="color: #9a3412;">📦 Size: ${teacherExclusiveDoc.size} • Teacher Only</div>
              <div class="media-file-actions">
                <button
                  type="button"
                  class="btn-primary-sm"
                  style="background: #9a3412;"
                  onclick="App.openModule('${mod.id}', 'teacher_notes')"
                >
                  <span>🧑‍🏫 View Teacher Guide</span>
                </button>
                <a
                  href="${teacherExclusiveDoc.file}"
                  download
                  class="btn-secondary"
                  style="padding: 0.45rem 0.85rem; font-size: 0.82rem; text-decoration: none; border-color: #fdba74; color: #9a3412;"
                >
                  <span>📥 Download .DOCX</span>
                </a>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    } else if (!isAuth) {
      mediaHubHtml = `
        <div class="locked-media-callout">
          <div style="font-size: 2rem;">🔐</div>
          <div>
            <h3>Presentations, PDFs & Video Files Are Protected</h3>
            <p>
              Sign in with your Student or Teacher account to view interactive slide presentations, download the 15-page Visual Primer PDF, watch the lesson video, and practice in the labs.
            </p>
          </div>
          <button type="button" class="btn-primary-sm" onclick="App.openStudentLoginModal()">
            <span>🔑 Sign In Now</span>
          </button>
        </div>
      `;
    }

    let html = `
      <!-- Welcome Hero -->
      ${heroHtml}

      <!-- Interactive Practice Labs Section (Mouse & Keyboard Simulators) -->
      <div class="section-title-wrap" style="margin-top: 1.5rem;">
        <h2 class="section-title">
          <span>⚡</span>
          <span>Hands-on Practice Labs (Mouse & Keyboard)</span>
        </h2>
        <span style="font-size: 0.9rem; color: var(--text-muted); font-weight: 600;">
          ${isAuth ? 'Interactive motor skills & typing muscle memory simulators' : '🔒 Sign in required to launch labs'}
        </span>
      </div>

      <div class="practice-labs-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem; margin-bottom: 2.25rem;">
        <!-- Mouse Practice Lab Card -->
        <div class="module-card practice-lab-card ${!isAuth ? 'module-card-locked' : ''}" style="border: 2px solid #bfdbfe; background: linear-gradient(180deg, #ffffff 0%, #f0f7ff 100%); cursor: pointer;" onclick="App.openMouseTrainer()">
          <div class="module-card-header">
            <div class="module-icon-large" style="background: #dbeafe; color: #1d4ed8;">🖱️</div>
            <span class="module-badge" style="background: ${isAuth ? '#2563eb' : '#475569'}; color: #ffffff;">
              ${isAuth ? 'Precision Simulator' : '🔒 Sign In Required'}
            </span>
          </div>
          <h3 class="module-title">Mouse & Trackpad Precision Lab</h3>
          <p class="module-desc">Inspired by <strong>mouse.techlit.tools</strong>. 6 core skills with 24 interactive gamified levels: Coin Chase clicking, Double-Click treasure unlock, Right-Click menus, Apple Picker drag-and-drop, <strong>Text Selection & Highlighting</strong>, and Scavenger Hunt scrolling!</p>
          <div class="module-features-chips">
            <span class="chip">🎯 Giant Target Popping</span>
            <span class="chip">🪙 Coin Chase</span>
            <span class="chip">🍎 Apple Picker Drag & Drop</span>
            <span class="chip">✍️ Text Selection & Highlighting</span>
            <span class="chip">⚡ Double-Click Speed</span>
            <span class="chip">📜 Scavenger Hunt Scrolling</span>
          </div>
          <button class="module-footer-btn" style="background: ${isAuth ? '#2563eb' : '#475569'}; color: #ffffff;">
            <span>${isAuth ? 'Launch Mouse Lab' : '🔒 Sign In to Launch Lab'}</span>
            <span>➜</span>
          </button>
        </div>

        <!-- Keyboard Typing Lab Card -->
        <div class="module-card practice-lab-card ${!isAuth ? 'module-card-locked' : ''}" style="border: 2px solid #bbf7d0; background: linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%); cursor: pointer;" onclick="App.openTypingTrainer()">
          <div class="module-card-header">
            <div class="module-icon-large" style="background: #dcfce7; color: #15803d;">⌨️</div>
            <span class="module-badge" style="background: ${isAuth ? '#16a34a' : '#475569'}; color: #ffffff;">
              ${isAuth ? 'Stamina Simulator' : '🔒 Sign In Required'}
            </span>
          </div>
          <h3 class="module-title">Keyboard Typing Trainer</h3>
          <p class="module-desc">Inspired by <strong>Stamina, Keybr & TypingClub</strong>. Interactive QWERTY keyboard with tactile bumps, live WPM, accuracy %, sound feedback, and 8 Canadian newcomer lessons.</p>
          <div class="module-features-chips">
            <span class="chip">🖐️ Home Row Foundations</span>
            <span class="chip">🇨🇦 Canadian Words & Capitals</span>
            <span class="chip">🚨 911 & 211 Hotlines</span>
            <span class="chip">📮 Canadian Postal Codes</span>
            <span class="chip">📈 Live WPM & Audio Clicks</span>
          </div>
          <button class="module-footer-btn" style="background: ${isAuth ? '#16a34a' : '#475569'}; color: #ffffff;">
            <span>${isAuth ? 'Launch Typing Lab' : '🔒 Sign In to Launch Lab'}</span>
            <span>➜</span>
          </button>
        </div>
      </div>

      <!-- Modules Catalog -->
      <div class="section-title-wrap">
        <h2 class="section-title">
          <span>📚</span>
          <span>Curriculum Learning Modules (${MODULES_DATA.length})</span>
        </h2>
        <span style="font-size: 0.9rem; color: var(--text-muted); font-weight: 600;">
          ${isAuth ? 'Select any module to access slides, guides, videos & quizzes' : '🔒 Sign in above to unlock modules & files'}
        </span>
      </div>

      <div class="modules-grid">
    `;

    MODULES_DATA.forEach(mod => {
      const chips = (mod.tags || []).map(t => `<span class="chip">🏷️ ${t}</span>`).join('');
      
      html += `
        <div class="module-card ${!isAuth ? 'module-card-locked' : ''}" onclick="App.openModule('${mod.id}')">
          <div class="module-card-header">
            <div class="module-icon-large">${mod.icon}</div>
            <span class="module-badge">${isAuth ? mod.badge : '🔒 Locked'}</span>
          </div>

          <h3 class="module-title">${mod.title}</h3>
          <p class="module-desc">${mod.subtitle}</p>

          <div class="module-features-chips">
            ${chips}
            <span class="chip">🖼️ ${mod.presentation.length} Slides</span>
            <span class="chip">📊 ${mod.quiz.questions.length} Quiz Questions</span>
          </div>

          <button class="module-footer-btn" style="${!isAuth ? 'background: #475569;' : ''}">
            <span>${!isAuth ? '🔒 Sign In to Open Module' : (isTeacher ? 'Inspect Module & Teacher Guide' : 'Start Learning Module')}</span>
            <span>➜</span>
          </button>
        </div>
      `;
    });

    html += `</div>${mediaHubHtml}`;
    container.innerHTML = html;
  },

  openModule(moduleId, initialTab = 'presentation', presMode = 'deck') {
    if (!this.isUserAuthenticated()) {
      this.openStudentLoginModal();
      return;
    }
    if (initialTab === 'teacher_notes' && !this.isTeacherAuthenticated()) {
      initialTab = 'presentation';
    }
    this.cleanupLabs();
    this.activeLab = null;
    const found = MODULES_DATA.find(m => m.id === moduleId);
    if (!found) return;
    this.currentModule = found;
    this.activeLessonTab = initialTab;
    this.presentationViewMode = presMode || 'deck';
    this.currentSlideIndex = 0;
    this.render();
  },

  // ==========================================
  // View 2: Detailed Lesson View (6 Student Tabs + Teacher-Only Tab)
  // ==========================================
  renderLessonView(container = document.getElementById('app-main-content')) {
    if (!this.isUserAuthenticated()) {
      this.renderModulesList(container);
      return;
    }

    const mod = this.currentModule;
    const isTeacher = this.isTeacherAuthenticated();

    // Never allow non-teacher to stay on teacher_notes tab
    if (this.activeLessonTab === 'teacher_notes' && !isTeacher) {
      this.activeLessonTab = 'presentation';
    }

    let html = `
      <div class="lesson-container">
        <!-- Top Navigation -->
        <div class="lesson-top-nav">
          <button class="back-btn" onclick="App.renderModulesList()">
            <span>←</span>
            <span>All Modules</span>
          </button>

          <div class="lesson-tabs">
            <button class="lesson-tab-btn ${this.activeLessonTab === 'presentation' ? 'active' : ''}" onclick="App.switchTab('presentation')">
              <span>🖼️ Presentation</span>
            </button>
            <button class="lesson-tab-btn ${this.activeLessonTab === 'text' ? 'active' : ''}" onclick="App.switchTab('text')">
              <span>📖 Text Guide</span>
            </button>
            <button class="lesson-tab-btn ${this.activeLessonTab === 'video' ? 'active' : ''}" onclick="App.switchTab('video')">
              <span>🎬 Video</span>
            </button>
            <button class="lesson-tab-btn ${this.activeLessonTab === 'audio' ? 'active' : ''}" onclick="App.switchTab('audio')">
              <span>🎧 Audio</span>
            </button>
            <button class="lesson-tab-btn ${this.activeLessonTab === 'files' ? 'active' : ''}" onclick="App.switchTab('files')">
              <span>📂 Files & Media</span>
            </button>
            <button class="lesson-tab-btn ${this.activeLessonTab === 'quiz' ? 'active' : ''}" onclick="App.switchTab('quiz')">
              <span>📝 Quiz & TXT Export</span>
            </button>
            ${isTeacher ? `
              <button class="lesson-tab-btn ${this.activeLessonTab === 'teacher_notes' ? 'active' : ''}" onclick="App.switchTab('teacher_notes')" style="color: #9a3412;">
                <span>🧑‍🏫 Teacher Guide</span>
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Teacher Alert Banner (Visible ONLY when Teacher Mode is active) -->
        ${isTeacher ? `
          <div class="teacher-mode-banner">
            <div class="teacher-mode-icon">🧑‍🏫</div>
            <div class="teacher-mode-text">
              <h3>Instructor Mode Active: ${mod.title}</h3>
              <p>You have full access to all learner materials plus the <strong>Teacher-Exclusive Lesson Plan & Verbatim Script</strong>.</p>
            </div>
          </div>
        ` : ''}

        <!-- Active Tab Viewport -->
        <div id="lesson-content-viewport"></div>
      </div>
    `;

    container.innerHTML = html;
    this.renderActiveTabContent();
  },

  switchTab(tabKey) {
    if (tabKey === 'teacher_notes' && !this.isTeacherAuthenticated()) {
      return;
    }
    this.activeLessonTab = tabKey;
    this.renderLessonView();
  },

  switchPresentationMode(mode) {
    this.presentationViewMode = mode === 'pdf' ? 'pdf' : 'deck';
    this.renderActiveTabContent();
  },

  renderActiveTabContent() {
    if (!this.isUserAuthenticated()) return;

    const viewport = document.getElementById('lesson-content-viewport');
    if (!viewport) return;

    const mod = this.currentModule;

    if (this.activeLessonTab === 'teacher_notes' && !this.isTeacherAuthenticated()) {
      this.activeLessonTab = 'presentation';
    }

    switch (this.activeLessonTab) {
      case 'presentation':
        this.renderPresentationSlot(viewport, mod.presentation, mod.presentationMeta);
        break;
      case 'text':
        this.renderTextSlot(viewport, mod.textLesson);
        break;
      case 'video':
        this.renderVideoSlot(viewport, mod.videoLesson);
        break;
      case 'audio':
        this.renderAudioSlot(viewport, mod.audioLesson);
        break;
      case 'files':
        this.renderFilesSlot(viewport, mod);
        break;
      case 'quiz':
        QuizEngine.init(mod, viewport);
        break;
      case 'teacher_notes':
        if (this.isTeacherAuthenticated()) {
          this.renderTeacherNotesSlot(viewport, mod.teacherNotes);
        }
        break;
    }
  },

  // Slot 1: Presentation Carousel + Visual Primer PDF Viewer
  renderPresentationSlot(container, slides = [], meta = {}) {
    if (!slides.length && !meta.pdfUrl) {
      container.innerHTML = '<p>No presentations available yet.</p>';
      return;
    }

    const mode = this.presentationViewMode || 'deck';

    const modeBarHtml = `
      <div class="presentation-toolbar">
        <div class="presentation-mode-switcher">
          <button
            type="button"
            class="pres-mode-btn ${mode === 'deck' ? 'active' : ''}"
            onclick="App.switchPresentationMode('deck')"
          >
            <span>📊 Interactive Slide Deck</span>
            <span class="pres-mode-count">${slides.length} Slides</span>
          </button>
          ${meta.pdfUrl ? `
            <button
              type="button"
              class="pres-mode-btn ${mode === 'pdf' ? 'active' : ''}"
              onclick="App.switchPresentationMode('pdf')"
            >
              <span>📕 Visual Primer Presentation (PDF)</span>
              <span class="pres-mode-count">${meta.pdfPages || 15} Pages</span>
            </button>
          ` : ''}
        </div>

        <div class="presentation-download-actions">
          ${meta.pptxUrl ? `
            <a href="${meta.pptxUrl}" download class="btn-secondary" style="padding: 0.45rem 0.9rem; font-size: 0.82rem; text-decoration: none;">
              <span>📥 Download .PPTX</span>
            </a>
          ` : ''}
          ${meta.pdfUrl ? `
            <a href="${meta.pdfUrl}" download class="btn-secondary" style="padding: 0.45rem 0.9rem; font-size: 0.82rem; text-decoration: none;">
              <span>📥 Download .PDF</span>
            </a>
          ` : ''}
        </div>
      </div>
    `;

    if (mode === 'pdf' && meta.pdfUrl) {
      container.innerHTML = `
        <div class="presentation-card">
          ${modeBarHtml}
          <div class="pdf-viewer-header">
            <div>
              <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800;">📕 ${meta.pdfLabel || 'Illustrated Visual Primer (PDF)'}</h3>
              <p style="margin: 0.2rem 0 0; font-size: 0.85rem; color: var(--text-muted);">
                Browse all ${meta.pdfPages || 15} visual slides directly below or open in a new tab.
              </p>
            </div>
            <a href="${meta.pdfUrl}" target="_blank" class="btn-primary-sm" style="text-decoration: none;">
              <span>↗️ Open Full Screen</span>
            </a>
          </div>
          <div class="pdf-embed-container">
            <iframe src="${meta.pdfUrl}#view=FitH" title="Computer Basics & Mouse Mastery Presentation PDF"></iframe>
          </div>
        </div>
      `;
      return;
    }

    const currentSlide = slides[this.currentSlideIndex] || slides[0];
    const progressPct = Math.round(((this.currentSlideIndex + 1) / slides.length) * 100);
    const speakPayload = encodeURIComponent(
      `${currentSlide.title}. ${currentSlide.text} ${(currentSlide.bullets || []).join('. ')}`
    );

    const bulletsHtml = (currentSlide.bullets && currentSlide.bullets.length > 0)
      ? `<ul class="slide-bullets-list">
          ${currentSlide.bullets.map(b => `<li>${b}</li>`).join('')}
        </ul>`
      : '';

    const thumbnailsHtml = slides.map((s, idx) => `
      <button
        type="button"
        class="slide-thumb-pill ${idx === this.currentSlideIndex ? 'active' : ''}"
        onclick="App.goToSlide(${idx})"
        title="Slide ${idx + 1}: ${s.title}"
      >
        <span>${idx + 1}</span>
      </button>
    `).join('');

    container.innerHTML = `
      <div class="presentation-card">
        ${modeBarHtml}

        <div class="slide-progress-track">
          <div class="slide-progress-fill" style="width: ${progressPct}%;"></div>
        </div>

        <div class="slide-stage">
          <div class="slide-stage-top">
            <span class="slide-category-pill">${currentSlide.category || 'Lesson Presentation'}</span>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <button
                type="button"
                class="slide-audio-btn"
                onclick="App.playAudioPrompt('${speakPayload}')"
                title="Listen to this slide read aloud"
              >
                <span>🔊 Read Slide</span>
              </button>
              <span class="slide-counter-badge">
                Slide ${this.currentSlideIndex + 1} / ${slides.length}
              </span>
            </div>
          </div>

          <div class="slide-stage-body">
            <div class="slide-content-icon">${currentSlide.icon || '💻'}</div>
            <h2 class="slide-title">${currentSlide.title}</h2>
            <p class="slide-text">${currentSlide.text}</p>
            ${bulletsHtml}
            ${currentSlide.tip ? `
              <div class="slide-tip-callout">
                ${currentSlide.tip}
              </div>
            ` : ''}
          </div>
        </div>

        <div class="presentation-nav">
          <button class="slide-nav-btn" ${this.currentSlideIndex === 0 ? 'disabled' : ''} onclick="App.prevSlide()">
            <span>◀</span>
            <span>Previous</span>
          </button>

          <div class="slide-thumb-strip">
            ${thumbnailsHtml}
          </div>

          <button class="slide-nav-btn" ${this.currentSlideIndex === slides.length - 1 ? 'disabled' : ''} onclick="App.nextSlide()">
            <span>Next</span>
            <span>▶</span>
          </button>
        </div>
      </div>
    `;
  },

  nextSlide() {
    if (this.currentModule && this.currentSlideIndex < this.currentModule.presentation.length - 1) {
      this.currentSlideIndex++;
      this.renderActiveTabContent();
    }
  },

  prevSlide() {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
      this.renderActiveTabContent();
    }
  },

  goToSlide(idx) {
    this.currentSlideIndex = idx;
    this.renderActiveTabContent();
  },

  // Slot 2: Text Reading & Master Visual Cheat Sheet
  renderTextSlot(container, textData) {
    if (!textData) return;

    let sectionsHtml = (textData.sections || []).map(sec => {
      const formattedBody = (sec.body || '').replace(/\n/g, '<br>');
      return `
        <div class="text-guide-card">
          <div class="text-guide-card-head">
            <span class="text-guide-icon">${sec.icon || '📘'}</span>
            <h4>${sec.subheading}</h4>
          </div>
          <p>${formattedBody}</p>
        </div>
      `;
    }).join('');

    let cheatSheetHtml = '';
    if (Array.isArray(textData.cheatSheet) && textData.cheatSheet.length > 0) {
      cheatSheetHtml = `
        <div class="cheat-sheet-wrap">
          <h3 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 0.75rem;">
            📋 Master Visual Cheat Sheet — Quick Review
          </h3>
          <div class="table-card">
            <table class="metrics-table cheat-sheet-table">
              <thead>
                <tr>
                  <th>Physical Action</th>
                  <th>Action Name</th>
                  <th>What It Does on Screen</th>
                </tr>
              </thead>
              <tbody>
                ${textData.cheatSheet.map(row => `
                  <tr>
                    <td><strong>${row.physical}</strong></td>
                    <td><span class="cheat-name-pill">${row.name}</span></td>
                    <td>${row.intent}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    const downloadBannerHtml = textData.downloadUrl ? `
      <div class="handbook-download-banner">
        <div style="display: flex; align-items: center; gap: 0.85rem;">
          <span style="font-size: 2.2rem;">📕</span>
          <div>
            <div style="font-size: 1.05rem; font-weight: 800; color: #1e3a8a;">Illustrated Student Handbook & Review Sheet</div>
            <div style="font-size: 0.88rem; color: #1e40af; margin-top: 0.15rem;">
              ${textData.downloadLabel || 'Download complete illustrated companion handbook with diagrams'}
            </div>
          </div>
        </div>
        <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
          <button
            type="button"
            class="btn-secondary"
            style="padding: 0.6rem 1rem; font-size: 0.86rem;"
            onclick="App.openModule(App.currentModule.id, 'presentation', 'pdf')"
          >
            <span>👁️ View 15-Page PDF</span>
          </button>
          <a 
            href="${textData.downloadUrl}" 
            download 
            target="_blank" 
            class="btn-primary-sm" 
            style="padding: 0.6rem 1.1rem; font-size: 0.86rem; text-decoration: none;"
          >
            <span>📥 Download PDF</span>
          </a>
          ${textData.reviewDocUrl ? `
            <a 
              href="${textData.reviewDocUrl}" 
              download 
              class="btn-secondary" 
              style="padding: 0.6rem 1rem; font-size: 0.86rem; text-decoration: none;"
            >
              <span>📝 Review Quiz (.DOCX)</span>
            </a>
          ` : ''}
        </div>
      </div>
    ` : '';

    container.innerHTML = `
      <div class="presentation-card" style="padding: 2.25rem;">
        <span style="font-size: 0.8rem; font-weight: 700; color: var(--brand-blue); text-transform: uppercase;">
          Reading & Illustrated Visual Guide
        </span>
        <h2 style="font-size: 1.65rem; font-weight: 800; margin: 0.5rem 0 0.75rem;">
          ${textData.heading}
        </h2>
        <p style="font-size: 1.05rem; color: var(--text-main); background: #f8fafc; padding: 1rem 1.25rem; border-left: 4px solid var(--brand-blue); border-radius: 6px; margin-bottom: 1.75rem;">
          ${textData.summary}
        </p>

        ${downloadBannerHtml}

        <div class="text-guide-grid">
          ${sectionsHtml}
        </div>

        ${cheatSheetHtml}
      </div>
    `;
  },

  // Slot 3: Video Player
  renderVideoSlot(container, videoData) {
    if (!videoData) return;
    const hasVideo = Boolean(videoData.videoUrl);

    container.innerHTML = `
      <div class="media-section-card">
        <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; margin-bottom: 1.25rem;">
          <div>
            <h3 style="font-size: 1.35rem; font-weight: 800; margin-bottom: 0.35rem;">${videoData.title}</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem;">${videoData.description || ''}</p>
          </div>
          <span style="font-size: 0.85rem; font-weight: 700; background: var(--surface-muted); padding: 4px 12px; border-radius: var(--radius-full);">
            ⏱️ Duration: ${videoData.duration || 'N/A'}
          </span>
        </div>

        ${hasVideo ? `
          <div class="video-player-wrapper" style="position: relative; border-radius: var(--radius-lg); overflow: hidden; background: #000; box-shadow: var(--shadow-md); margin-bottom: 1rem;">
            <video 
              controls 
              preload="metadata" 
              style="width: 100%; display: block; max-height: 520px; aspect-ratio: 16/9; background: #000;"
            >
              <source src="${videoData.videoUrl}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; background: var(--surface-muted); padding: 0.85rem 1.25rem; border-radius: var(--radius-md);">
            <div style="font-size: 0.88rem; color: var(--text-muted);">
              ✅ High Quality Video Walkthrough • Step-by-Step Pace for Beginners
            </div>
            <a 
              href="${videoData.videoUrl}" 
              download 
              class="btn-secondary" 
              style="padding: 0.45rem 0.9rem; font-size: 0.85rem; text-decoration: none;"
            >
              <span>📥 Download MP4 Video</span>
            </a>
          </div>
        ` : `
          <div class="video-frame-container">
            <div class="video-placeholder-icon">▶</div>
            <p style="font-size: 1.1rem; font-weight: 700;">Video demonstration slot</p>
          </div>
        `}
      </div>
    `;
  },

  // Slot 4: Audio Player & Vocabulary Pronunciation
  renderAudioSlot(container, audioData) {
    if (!audioData) return;

    const vocabHtml = (audioData.vocabulary || []).length > 0 ? `
      <div style="margin-top: 1.75rem;">
        <h4 style="font-size: 1.05rem; font-weight: 800; margin-bottom: 0.75rem;">
          🗣️ Click Any Word to Hear Clear Canadian Pronunciation
        </h4>
        <div class="audio-vocab-grid">
          ${audioData.vocabulary.map(v => `
            <button
              type="button"
              class="vocab-speak-card"
              onclick="App.playAudioPrompt('${encodeURIComponent(v.word + '. ' + v.meaning)}')"
            >
              <div class="vocab-word-top">
                <strong>${v.word}</strong>
                <span>🔊</span>
              </div>
              <div class="vocab-phonetic">/${v.phonetic}/</div>
              <div class="vocab-meaning">${v.meaning}</div>
            </button>
          `).join('')}
        </div>
      </div>
    ` : '';

    container.innerHTML = `
      <div class="media-section-card">
        <h3>${audioData.title}</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem;">
          Auditory comprehension and clear English pronunciation for computer terms.
        </p>

        <div class="audio-player-box">
          <button class="audio-play-circle" id="speech-play-btn" onclick="App.playAudioPrompt('${encodeURIComponent(audioData.speechPrompt)}')">
            🔊
          </button>
          
          <div class="audio-track-info">
            <div class="audio-track-title">Listen & Repeat: Spoken Audio Guidance</div>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.45rem;">
              ${audioData.transcription}
            </div>
            <div class="audio-waveform-bar">
              <div class="audio-waveform-progress"></div>
            </div>
          </div>

          <button class="btn-secondary" onclick="App.playAudioPrompt('${encodeURIComponent(audioData.speechPrompt)}')">
            <span>Play Full Guidance</span>
          </button>
        </div>

        ${vocabHtml}
      </div>
    `;
  },

  // Slot 5: Files, Presentations & Media Hub (Teacher doc hidden from Students!)
  renderFilesSlot(container, mod) {
    const materials = mod.studentMaterials || [];
    const isTeacher = this.isTeacherAuthenticated();
    const teacherDoc = (isTeacher && mod.teacherNotes && mod.teacherNotes.teacherExclusiveDoc)
      ? mod.teacherNotes.teacherExclusiveDoc
      : null;

    container.innerHTML = `
      <div class="presentation-card">
        <div style="margin-bottom: 1.5rem;">
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--brand-blue); text-transform: uppercase;">
            Classroom Media & Presentations
          </span>
          <h2 style="font-size: 1.55rem; font-weight: 800; margin: 0.35rem 0 0.4rem;">
            📂 Files, Presentations & Video Materials
          </h2>
          <p style="color: var(--text-muted); font-size: 0.95rem;">
            All lesson presentations, illustrated PDF handbooks, quick review quizzes, and video guides in one place.
          </p>
        </div>

        <div class="media-files-grid">
          ${materials.map(item => `
            <div class="media-file-card">
              <div class="media-file-top">
                <div class="media-file-icon">${item.icon}</div>
                <span class="media-file-badge">${item.badge}</span>
              </div>
              <h3 class="media-file-title">${item.title}</h3>
              <p class="media-file-desc">${item.description}</p>
              <div class="media-file-meta">📦 File Size: ${item.size}</div>
              <div class="media-file-actions">
                <button
                  type="button"
                  class="btn-primary-sm"
                  onclick="App.openModule('${mod.id}', '${item.previewTab || 'presentation'}', '${item.previewMode || 'deck'}')"
                >
                  <span>👁️ Preview</span>
                </button>
                <a
                  href="${item.file}"
                  download
                  class="btn-secondary"
                  style="padding: 0.45rem 0.85rem; font-size: 0.82rem; text-decoration: none;"
                >
                  <span>📥 Download</span>
                </a>
              </div>
            </div>
          `).join('')}

          ${teacherDoc ? `
            <div class="media-file-card teacher-exclusive-card">
              <div class="media-file-top">
                <div class="media-file-icon" style="background: #ffedd5; color: #c2410c;">🔒</div>
                <span class="media-file-badge" style="background: #9a3412; color: #ffffff;">${teacherDoc.badge}</span>
              </div>
              <h3 class="media-file-title" style="color: #7c2d12;">${teacherDoc.title}</h3>
              <p class="media-file-desc" style="color: #9a3412;">
                Exclusive instructor manual with complete verbatim script, classroom timings, and offline MS Paint drills.
              </p>
              <div class="media-file-meta" style="color: #9a3412;">📦 Size: ${teacherDoc.size} • Visible Only to Teachers</div>
              <div class="media-file-actions">
                <button
                  type="button"
                  class="btn-primary-sm"
                  style="background: #9a3412;"
                  onclick="App.switchTab('teacher_notes')"
                >
                  <span>🧑‍🏫 Open Script</span>
                </button>
                <a
                  href="${teacherDoc.file}"
                  download
                  class="btn-secondary"
                  style="padding: 0.45rem 0.85rem; font-size: 0.82rem; text-decoration: none; border-color: #fdba74; color: #9a3412;"
                >
                  <span>📥 Download .DOCX</span>
                </a>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  playAudioPrompt(encodedText) {
    const text = decodeURIComponent(encodedText);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85; // Slower rate for ESL learners
      utterance.lang = 'en-CA'; // Canadian English
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech audio: ' + text);
    }
  },

  // Slot 7: Teacher-Exclusive Notes & Full Verbatim Script
  renderTeacherNotesSlot(container, teacherData) {
    if (!this.isTeacherAuthenticated()) {
      container.innerHTML = `
        <div class="presentation-card" style="text-align: center; padding: 3rem;">
          <div style="font-size: 3rem; margin-bottom: 0.75rem;">🔒</div>
          <h3>Teacher-Exclusive Document</h3>
          <p style="color: var(--text-muted);">Only signed-in Teachers can view the Lesson Plan and Teaching Script.</p>
        </div>
      `;
      return;
    }
    if (!teacherData) return;

    const exclusiveDoc = teacherData.teacherExclusiveDoc;
    const courseInfo = teacherData.courseInfo || {};
    let tipsHtml = (teacherData.methodologyTips || []).map(t => `<li>${t}</li>`).join('');

    let exclusiveDocBanner = exclusiveDoc ? `
      <div class="teacher-exclusive-banner">
        <div style="display: flex; align-items: center; gap: 0.9rem;">
          <div style="font-size: 2.3rem;">📝</div>
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <strong style="font-size: 1.08rem; color: #7c2d12;">${exclusiveDoc.title}</strong>
              <span style="background: #9a3412; color: #fff; font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 999px;">
                ${exclusiveDoc.badge}
              </span>
            </div>
            <div style="font-size: 0.86rem; color: #9a3412; margin-top: 0.2rem;">
              Original instructor document (${exclusiveDoc.size}) — hidden from student accounts.
            </div>
          </div>
        </div>
        <a 
          href="${exclusiveDoc.file}" 
          download 
          class="btn-primary-sm" 
          style="background: #9a3412; text-decoration: none; padding: 0.65rem 1.2rem;"
        >
          <span>📥 Download Teaching Script (.DOCX)</span>
        </a>
      </div>
    ` : '';

    let courseMetaHtml = courseInfo.audience ? `
      <div class="course-meta-grid">
        <div class="course-meta-item"><strong>👥 Audience</strong><span>${courseInfo.audience}</span></div>
        <div class="course-meta-item"><strong>⏱️ Duration</strong><span>${courseInfo.duration}</span></div>
        <div class="course-meta-item"><strong>🗣️ Language Level</strong><span>${courseInfo.languageLevel}</span></div>
        <div class="course-meta-item"><strong>🧰 Equipment</strong><span>${courseInfo.equipment}</span></div>
      </div>
    ` : '';

    let scriptBlocksHtml = (teacherData.scriptBlocks || []).length > 0 ? `
      <div style="margin-bottom: 1.75rem;">
        <h3 style="font-size: 1.25rem; font-weight: 800; color: #9a3412; margin-bottom: 0.85rem;">
          🎙️ Block-by-Block Verbatim Teaching Script
        </h3>
        <div class="script-blocks-stack">
          ${teacherData.scriptBlocks.map(b => `
            <div class="script-block-card">
              <div class="script-block-head">
                <strong>${b.title}</strong>
                <span class="script-duration-pill">⏱️ ${b.duration}</span>
              </div>
              <div class="script-objective"><strong>Objective:</strong> ${b.objective}</div>
              <div class="script-quote-box">${b.script}</div>
              ${(b.teacherActions && b.teacherActions.length > 0) ? `
                <div class="script-actions-box">
                  <strong>Teacher Actions & Red Flags:</strong>
                  <ul>
                    ${b.teacherActions.map(a => `<li>${a}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    ` : '';

    let tracksHtml = (teacherData.practiceTracks && teacherData.practiceTracks.length > 0) ? `
      <div style="margin-top: 1.75rem;">
        <h3 style="font-size: 1.2rem; font-weight: 800; color: #9a3412; margin-bottom: 0.75rem;">
          🎮 Online & Offline Practice Tracks (Block 4)
        </h3>
        <div class="table-card">
          <table class="metrics-table">
            <thead>
              <tr>
                <th>Track</th>
                <th>Software / Tool</th>
                <th>Primary Skill</th>
                <th>Instructional Focus</th>
              </tr>
            </thead>
            <tbody>
              ${teacherData.practiceTracks.map(tr => `
                <tr>
                  <td><strong>${tr.track}</strong></td>
                  <td>${tr.tool}</td>
                  <td>${tr.skill}</td>
                  <td>${tr.focus}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : '';

    container.innerHTML = `
      <div class="presentation-card">
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem;">
          <span style="font-size: 2rem;">🧑‍🏫</span>
          <div>
            <h2 style="font-size: 1.5rem; font-weight: 800; color: #9a3412;">Teacher & Instructor Guide</h2>
            <p style="color: #7c2d12; font-size: 0.95rem;">Methodological, psychological, and classroom facilitation guide for ESL/CLB learners</p>
          </div>
        </div>

        ${exclusiveDocBanner}
        ${courseMetaHtml}

        <div style="background: #fff7ed; border-left: 4px solid #ea580c; padding: 1.25rem; border-radius: 6px; margin-bottom: 1.75rem;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #9a3412; margin-bottom: 0.35rem;">🎯 Core Learning Objective</h4>
          <p style="color: #7c2d12; font-size: 0.98rem; line-height: 1.5;">${teacherData.learningGoal}</p>
        </div>

        <div style="margin-bottom: 1.75rem;">
          <h3 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 0.75rem;">💡 Key Pedagogical Rules & Techniques</h3>
          <ul class="teacher-tips-list" style="line-height: 1.6;">
            ${tipsHtml}
          </ul>
        </div>

        ${scriptBlocksHtml}
        ${tracksHtml}
      </div>
    `;
  },

  // ==========================================
  // View 3: Administrator Dashboard & Management
  // ==========================================
  switchAdminTab(tabName) {
    this.adminActiveTab = tabName;
    this.renderAdminDashboard();
  },

  renderAdminDashboard(container = document.getElementById('app-main-content')) {
    if (!container) return;

    const logs = StorageService.getAllMetrics();
    const teachers = StorageService.getTeacherAccounts();
    const students = StorageService.getRegisteredStudents();

    let tabContentHtml = '';

    if (this.adminActiveTab === 'metrics') {
      tabContentHtml = this.renderAdminMetricsTab(logs);
    } else if (this.adminActiveTab === 'teachers') {
      tabContentHtml = this.renderAdminTeachersTab(teachers);
    } else if (this.adminActiveTab === 'students') {
      tabContentHtml = this.renderAdminStudentsTab(students);
    }

    container.innerHTML = `
      <div class="admin-container">
        <!-- Header Strip -->
        <div class="admin-header-strip">
          <div>
            <h2 style="font-size: 1.55rem; font-weight: 800; display: flex; align-items: center; gap: 0.6rem;">
              <span>🛡️</span>
              <span>Administrator Center</span>
            </h2>
            <p style="color: var(--text-muted); font-size: 0.95rem;">
              Manage evaluation metrics, personalized teacher accounts, and registered student profiles
            </p>
          </div>

          <!-- Top Navigation Tabs inside Admin -->
          <div class="admin-tabs-nav">
            <button 
              type="button" 
              class="admin-tab-btn ${this.adminActiveTab === 'metrics' ? 'active' : ''}" 
              onclick="App.switchAdminTab('metrics')"
            >
              <span>📊 Quiz Metrics</span>
              <span class="badge-count">${logs.length}</span>
            </button>
            <button 
              type="button" 
              class="admin-tab-btn ${this.adminActiveTab === 'teachers' ? 'active' : ''}" 
              onclick="App.switchAdminTab('teachers')"
            >
              <span>🧑‍🏫 Teacher Accounts</span>
              <span class="badge-count">${teachers.length}</span>
            </button>
            <button 
              type="button" 
              class="admin-tab-btn ${this.adminActiveTab === 'students' ? 'active' : ''}" 
              onclick="App.switchAdminTab('students')"
            >
              <span>👥 Student Accounts</span>
              <span class="badge-count">${students.length}</span>
            </button>
          </div>
        </div>

        <!-- Dynamic Admin Tab Content -->
        ${tabContentHtml}
      </div>
    `;
  },

  renderAdminMetricsTab(allLogs) {
    const studentsList = StorageService.getRegisteredStudents();
    const uniqueStudentNames = Array.from(new Set([
      ...studentsList.map(s => s.nickname),
      ...allLogs.map(l => l.studentName).filter(Boolean)
    ])).sort();

    // Filter logs according to active admin filters
    let filteredLogs = allLogs.filter(log => {
      if (this.adminMetricFilterStudent !== 'ALL' && (log.studentName || '').toLowerCase() !== this.adminMetricFilterStudent.toLowerCase()) {
        return false;
      }
      if (this.adminMetricFilterType === 'practice_mouse' && log.moduleId !== 'lab_mouse' && log.moduleCode !== 'LAB_MOUSE_PRECISION') {
        return false;
      }
      if (this.adminMetricFilterType === 'practice_typing' && !String(log.moduleId || '').startsWith('lab_typing') && log.moduleCode !== 'LAB_KEYBOARD_STAMINA') {
        return false;
      }
      if (this.adminMetricFilterType === 'quiz' && (log.moduleId === 'lab_mouse' || String(log.moduleId || '').startsWith('lab_typing') || log.moduleCode?.startsWith('LAB_'))) {
        return false;
      }
      if (this.adminMetricFilterStatus === 'PASSED' && (log.scorePercent || 0) < 70) {
        return false;
      }
      if (this.adminMetricFilterStatus === 'REVIEW' && (log.scorePercent || 0) >= 70) {
        return false;
      }
      if (this.adminMetricSearchQuery) {
        const q = this.adminMetricSearchQuery.toLowerCase();
        const matchesName = (log.studentName || '').toLowerCase().includes(q);
        const matchesMod = (log.moduleTitle || '').toLowerCase().includes(q);
        if (!matchesName && !matchesMod) return false;
      }
      return true;
    });

    const totalAttempts = filteredLogs.length;
    const avgScore = totalAttempts > 0 
      ? Math.round(filteredLogs.reduce((sum, item) => sum + (item.scorePercent || 0), 0) / totalAttempts)
      : 0;
    const passedCount = filteredLogs.filter(item => (item.scorePercent || 0) >= 70).length;

    let rowsHtml = '';
    if (filteredLogs.length === 0) {
      rowsHtml = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-light); padding: 2.5rem 1rem;">
            <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">🔍</div>
            <strong style="color: var(--text-main);">No evaluation records match the active filters.</strong>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.25rem 0 0 0;">
              Try resetting the student or activity filters above.
            </p>
          </td>
        </tr>
      `;
    } else {
      filteredLogs.forEach((log) => {
        const isPassed = (log.scorePercent || 0) >= 70;
        const statusBadge = isPassed 
          ? `<span style="background: #ecfdf5; color: #059669; font-weight: 700; padding: 3px 8px; border-radius: 999px; font-size: 0.75rem;">PASSED</span>`
          : `<span style="background: #fef2f2; color: #dc2626; font-weight: 700; padding: 3px 8px; border-radius: 999px; font-size: 0.75rem;">REVIEW</span>`;

        const dateStr = new Date(log.timestamp).toLocaleString('en-CA', {
          dateStyle: 'short',
          timeStyle: 'short'
        });

        const studentAvatarSvg = typeof AvatarsService !== 'undefined'
          ? AvatarsService.getSvgHtml(log.avatarId || 'avatar_hijab_teal', 28)
          : '';

        rowsHtml += `
          <tr style="cursor: pointer;" onclick="if(event.target.tagName !== 'BUTTON') App.inspectMetric('${log.id}')">
            <td>
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                ${studentAvatarSvg}
                <div>
                  <strong class="student-tag">${log.studentName}</strong>
                </div>
              </div>
            </td>
            <td>
              <strong>${log.moduleTitle}</strong>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${log.moduleCode || log.moduleId || 'Evaluation'}</div>
            </td>
            <td>${dateStr}</td>
            <td>
              <span style="font-weight: 800; color: ${isPassed ? '#059669' : '#dc2626'};">${log.scorePercent}%</span>
              <span style="font-size: 0.8rem; color: var(--text-muted);">(${log.correctCount}/${log.totalQuestions})</span>
            </td>
            <td>${Math.floor((log.durationSeconds || 0) / 60)}m ${(log.durationSeconds || 0) % 60}s</td>
            <td>${statusBadge}</td>
            <td>
              <div style="display: flex; gap: 0.35rem; align-items: center;">
                <button 
                  class="btn-secondary" 
                  style="padding: 0.35rem 0.65rem; font-size: 0.8rem; font-weight: 700; color: #1d4ed8; background: #eff6ff; border-color: #bfdbfe;" 
                  onclick="event.stopPropagation(); App.inspectMetric('${log.id}')"
                  title="View detailed questions and answers on screen"
                >
                  👁️ Inspect
                </button>
                <button 
                  class="btn-secondary" 
                  style="padding: 0.35rem 0.6rem; font-size: 0.8rem;" 
                  onclick="event.stopPropagation(); App.downloadSingleTxt('${log.id}')"
                  title="Download .txt report for this attempt"
                >
                  📄 .TXT
                </button>
                <button 
                  class="btn-secondary" 
                  style="padding: 0.35rem 0.55rem; font-size: 0.8rem; color: #dc2626; border-color: #fca5a5;" 
                  onclick="event.stopPropagation(); App.deleteMetric('${log.id}')"
                  title="Delete this evaluation record"
                >
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        `;
      });
    }

    return `
      <!-- Turso SQLite Cloud Database Banner -->
      <div class="google-sync-card" style="display: flex; align-items: center; justify-content: space-between; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--radius-md); padding: 0.85rem 1.25rem; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div style="font-size: 1.6rem; background: #dcfce7; padding: 0.4rem 0.6rem; border-radius: 8px;">🗄️</div>
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <strong style="color: #166534; font-size: 0.98rem;">Turso SQLite Database Connected</strong>
              <span style="background: #22c55e; color: white; font-size: 0.7rem; font-weight: 800; padding: 2px 7px; border-radius: 999px;">LIVE SQLITE</span>
            </div>
            <div style="font-size: 0.82rem; color: #15803d; margin-top: 2px;">
              Serverless SQLite database active (Montreal, Canada) • Real-time synchronization across all devices
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
          <button 
            type="button" 
            class="btn-secondary" 
            style="padding: 0.45rem 0.95rem; font-size: 0.85rem; font-weight: 700; background: #ffffff; color: #166534; border-color: #86efac;" 
            onclick="App.syncWithSqlite()"
            title="Fetch latest student records and metrics directly from Turso SQLite"
          >
            <span id="sync-btn-text">🔄 Refresh from SQLite</span>
          </button>
          <button 
            type="button" 
            class="btn-secondary" 
            style="padding: 0.45rem 0.95rem; font-size: 0.85rem; font-weight: 700; background: #ffffff; color: #1e3a8a; border-color: #bfdbfe;" 
            onclick="App.printAdminReport()"
            title="Print this student report on A4 paper or save as PDF"
          >
            <span>🖨️ Print Report</span>
          </button>
        </div>
      </div>

      <!-- Comprehensive Metrics Toolbar -->
      <div style="background: var(--bg-card); padding: 1rem 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-light); box-shadow: var(--shadow-sm); margin-bottom: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.85rem;">
          <!-- Filter Controls -->
          <div style="display: flex; gap: 0.6rem; flex-wrap: wrap; align-items: center;">
            <!-- Filter by Student -->
            <div style="display: flex; align-items: center; gap: 0.35rem;">
              <label style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted);">👤 Student:</label>
              <select 
                class="admin-filter-select" 
                onchange="App.setMetricFilter('student', this.value)"
                style="padding: 0.45rem 0.65rem; border-radius: 8px; border: 1px solid var(--border-light); font-size: 0.85rem; font-weight: 600; background: var(--bg-page); color: var(--text-color);"
              >
                <option value="ALL" ${this.adminMetricFilterStudent === 'ALL' ? 'selected' : ''}>All Students (${uniqueStudentNames.length})</option>
                ${uniqueStudentNames.map(name => `
                  <option value="${name}" ${this.adminMetricFilterStudent.toLowerCase() === name.toLowerCase() ? 'selected' : ''}>${name}</option>
                `).join('')}
              </select>
            </div>

            <!-- Filter by Activity Type -->
            <div style="display: flex; align-items: center; gap: 0.35rem;">
              <label style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted);">🎯 Activity:</label>
              <select 
                class="admin-filter-select" 
                onchange="App.setMetricFilter('type', this.value)"
                style="padding: 0.45rem 0.65rem; border-radius: 8px; border: 1px solid var(--border-light); font-size: 0.85rem; font-weight: 600; background: var(--bg-page); color: var(--text-color);"
              >
                <option value="ALL" ${this.adminMetricFilterType === 'ALL' ? 'selected' : ''}>All Activities</option>
                <option value="quiz" ${this.adminMetricFilterType === 'quiz' ? 'selected' : ''}>Curriculum Quizzes</option>
                <option value="practice_mouse" ${this.adminMetricFilterType === 'practice_mouse' ? 'selected' : ''}>🖱️ Mouse Lab</option>
                <option value="practice_typing" ${this.adminMetricFilterType === 'practice_typing' ? 'selected' : ''}>⌨️ Typing Lab</option>
              </select>
            </div>

            <!-- Filter by Pass Status -->
            <div style="display: flex; align-items: center; gap: 0.35rem;">
              <label style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted);">Status:</label>
              <select 
                class="admin-filter-select" 
                onchange="App.setMetricFilter('status', this.value)"
                style="padding: 0.45rem 0.65rem; border-radius: 8px; border: 1px solid var(--border-light); font-size: 0.85rem; font-weight: 600; background: var(--bg-page); color: var(--text-color);"
              >
                <option value="ALL" ${this.adminMetricFilterStatus === 'ALL' ? 'selected' : ''}>All Statuses</option>
                <option value="PASSED" ${this.adminMetricFilterStatus === 'PASSED' ? 'selected' : ''}>Passed (≥70%)</option>
                <option value="REVIEW" ${this.adminMetricFilterStatus === 'REVIEW' ? 'selected' : ''}>Needs Review (<70%)</option>
              </select>
            </div>

            <!-- Search Query Input -->
            <input 
              type="text" 
              placeholder="🔍 Search student or module..." 
              value="${this.adminMetricSearchQuery || ''}"
              oninput="App.setMetricSearch(this.value)"
              style="padding: 0.45rem 0.75rem; border-radius: 8px; border: 1px solid var(--border-light); font-size: 0.85rem; background: var(--bg-page); color: var(--text-color); min-width: 170px;"
            />
          </div>

          <!-- Export & Clear Actions -->
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
            ${this.adminMetricFilterStudent !== 'ALL' ? `
              <button 
                class="btn-primary" 
                style="padding: 0.5rem 0.95rem; font-size: 0.85rem; font-weight: 700; background: #0284c7; border-color: #0369a1;"
                onclick="App.downloadStudentLifetimeTxt('${encodeURIComponent(this.adminMetricFilterStudent)}')"
                title="Download all lifetime metrics for ${this.adminMetricFilterStudent} (.txt)"
              >
                <span>📥 All Metrics: ${this.adminMetricFilterStudent} (.TXT)</span>
              </button>
            ` : ''}
            <button class="btn-secondary" style="padding: 0.5rem 0.85rem; font-size: 0.85rem;" onclick="App.exportMasterAuditTxt()">
              <span>📥 Export Master .TXT (${allLogs.length})</span>
            </button>
            <button class="btn-danger" style="padding: 0.5rem 0.75rem; font-size: 0.85rem;" onclick="App.confirmClearLogs()">
              <span>🗑️ Clear</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Metric Stat Cards -->
      <div class="admin-stats-row">
        <div class="stat-metric-card">
          <div class="stat-icon" style="background: #eff6ff; color: #1e40af;">👥</div>
          <div>
            <div class="stat-value">${totalAttempts}</div>
            <div class="stat-label">Displayed Evaluations</div>
          </div>
        </div>

        <div class="stat-metric-card">
          <div class="stat-icon" style="background: #ecfdf5; color: #059669;">📈</div>
          <div>
            <div class="stat-value">${avgScore}%</div>
            <div class="stat-label">Average Cohort Score</div>
          </div>
        </div>

        <div class="stat-metric-card">
          <div class="stat-icon" style="background: #fef3c7; color: #d97706;">🏆</div>
          <div>
            <div class="stat-value">${passedCount}</div>
            <div class="stat-label">Successful Passes (≥70%)</div>
          </div>
        </div>
      </div>

      <!-- Metrics Table Card -->
      <div class="table-card">
        <div style="padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <h3 style="font-size: 1.15rem; font-weight: 800; margin: 0;">Student Evaluation Records</h3>
            <span style="font-size: 0.82rem; color: var(--text-light);">Click any row or 'Inspect' to view detailed answers on screen</span>
          </div>
          ${this.adminMetricFilterStudent !== 'ALL' ? `
            <span class="badge" style="background: #e0f2fe; color: #0369a1; font-weight: 700; padding: 4px 10px;">
              Filtered by: ${this.adminMetricFilterStudent}
            </span>
          ` : ''}
        </div>

        <div style="overflow-x: auto;">
          <table class="metrics-table">
            <thead>
              <tr>
                <th>Student Profile</th>
                <th>Module / Lab</th>
                <th>Date & Time</th>
                <th>Score</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderAdminTeachersTab(teachers) {
    let rows = '';
    if (!teachers || teachers.length === 0) {
      rows = `
        <tr>
          <td colspan="6" style="text-align: center; color: var(--text-light); padding: 2rem;">
            No teacher accounts created yet. Click "+ Create New Teacher" above.
          </td>
        </tr>
      `;
    } else {
      teachers.forEach((t, idx) => {
        const dateStr = t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-CA') : 'Active';
        rows += `
          <tr>
            <td>
              <div style="display: flex; align-items: center; gap: 0.65rem;">
                <span style="font-size: 1.4rem;">🧑‍🏫</span>
                <div>
                  <strong style="color: var(--text-main); font-size: 0.98rem;">${t.name}</strong>
                  <div style="font-size: 0.8rem; color: var(--text-light);">${t.specialization || 'Instructor'}</div>
                </div>
              </div>
            </td>
            <td><code style="background: var(--surface-muted); padding: 3px 8px; border-radius: 4px; font-weight: 700;">@${t.username}</code></td>
            <td>
              <span style="background: #fef3c7; color: #92400e; padding: 3px 9px; border-radius: 4px; font-family: var(--font-mono); font-weight: 700;">
                ${t.password}
              </span>
            </td>
            <td>${dateStr}</td>
            <td>
              <div style="display: flex; gap: 0.45rem; flex-wrap: wrap;">
                <button 
                  class="btn-secondary" 
                  style="padding: 0.35rem 0.7rem; font-size: 0.82rem; font-weight: 700;"
                  onclick="App.openEditTeacherModal('${t.id}')"
                  title="Edit teacher or reset password"
                >
                  🔑 Edit / Reset
                </button>
                <button 
                  class="btn-danger" 
                  style="padding: 0.35rem 0.75rem; font-size: 0.82rem;"
                  onclick="App.deleteTeacher('${t.id}', '${encodeURIComponent(t.name)}')"
                  title="Delete this teacher account"
                >
                  🗑️ Delete
                </button>
              </div>
            </td>
          </tr>
        `;
      });
    }

    return `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h3 style="font-size: 1.3rem; font-weight: 800;">Personalized Teacher Accounts</h3>
          <p style="font-size: 0.9rem; color: var(--text-muted);">
            Teachers log in with their personal username and password set by the administrator.
          </p>
        </div>

        <button 
          class="download-txt-cta" 
          style="max-width: 260px; padding: 0.75rem 1.25rem; background: #9a3412;"
          onclick="App.openCreateTeacherModal()"
        >
          <span>➕ Create New Teacher</span>
        </button>
      </div>

      <div class="table-card">
        <div style="overflow-x: auto;">
          <table class="metrics-table">
            <thead>
              <tr>
                <th>Teacher Full Name</th>
                <th>Username</th>
                <th>Assigned Password</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderAdminStudentsTab(students) {
    let rows = '';
    if (!students || students.length === 0) {
      rows = `
        <tr>
          <td colspan="4" style="text-align: center; color: var(--text-light); padding: 2rem;">
            No student accounts registered yet. Click "+ Create New Student Profile" above.
          </td>
        </tr>
      `;
    } else {
      students.forEach(s => {
        const avatarSvg = typeof AvatarsService !== 'undefined'
          ? AvatarsService.getSvgHtml(s.avatarId || 'avatar_hijab_teal', 36)
          : '';

        const studentMetrics = StorageService.getMetricsForStudent(s.nickname);
        const attemptCount = studentMetrics.length;
        const avgScore = attemptCount > 0 
          ? Math.round(studentMetrics.reduce((sum, r) => sum + (r.scorePercent || 0), 0) / attemptCount)
          : null;

        rows += `
          <tr>
            <td>
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                ${avatarSvg}
                <div>
                  <strong style="font-size: 1rem; color: var(--text-main);">${s.nickname}</strong>
                  <div style="font-size: 0.8rem; color: var(--text-muted);">
                    ${attemptCount > 0 ? `Completed ${attemptCount} test(s) • Avg: ${avgScore}%` : 'No tests recorded yet'}
                  </div>
                </div>
              </div>
            </td>
            <td>
              <span style="background: #f1f5f9; color: var(--text-muted); padding: 3px 8px; border-radius: 4px; font-family: var(--font-mono); font-weight: 700;">
                ${s.password || '123'}
              </span>
            </td>
            <td>
              <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                <span style="font-size: 0.85rem; color: #059669; font-weight: 700;">✓ Active Learner</span>
                <span class="badge" style="font-size: 0.75rem; background: #e0f2fe; color: #0369a1; padding: 2px 6px; width: fit-content;">
                  ${attemptCount} attempt(s)
                </span>
              </div>
            </td>
            <td>
              <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                <button 
                  class="btn-secondary" 
                  style="padding: 0.35rem 0.65rem; font-size: 0.8rem; color: #0284c7; border-color: #bae6fd; background: #f0f9ff; font-weight: 700;"
                  onclick="App.viewStudentMetrics('${encodeURIComponent(s.nickname)}')"
                  title="View this student's evaluations on screen in Metrics tab"
                >
                  👁️ View Metrics (${attemptCount})
                </button>
                <button 
                  class="btn-secondary" 
                  style="padding: 0.35rem 0.65rem; font-size: 0.8rem; font-weight: 700; color: #047857; border-color: #a7f3d0; background: #ecfdf5;"
                  onclick="App.downloadStudentLifetimeTxt('${encodeURIComponent(s.nickname)}')"
                  title="Download complete lifetime metrics report for ${s.nickname} (.txt)"
                >
                  📥 All-Time .TXT
                </button>
                <button 
                  class="btn-secondary" 
                  style="padding: 0.35rem 0.65rem; font-size: 0.8rem; font-weight: 700;"
                  onclick="App.openEditStudentModal('${encodeURIComponent(s.nickname)}')"
                  title="Reset password or update student avatar"
                >
                  🔑 Reset Pass
                </button>
                <button 
                  class="btn-danger" 
                  style="padding: 0.35rem 0.65rem; font-size: 0.8rem;"
                  onclick="App.deleteStudent('${encodeURIComponent(s.nickname)}')"
                  title="Delete this student account"
                >
                  🗑️ Delete
                </button>
              </div>
            </td>
          </tr>
        `;
      });
    }

    return `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h3 style="font-size: 1.3rem; font-weight: 800;">Registered Student Accounts</h3>
          <p style="font-size: 0.9rem; color: var(--text-muted);">
            Manage student profiles, passwords, and assigned diverse avatars.
          </p>
        </div>

        <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
          <button 
            type="button"
            class="btn-secondary" 
            style="padding: 0.6rem 1.1rem; font-size: 0.88rem; font-weight: 700; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.4rem; background: #f0fdf4; border-color: #86efac; color: #15803d;"
            onclick="App.downloadDatabaseJson()"
            title="Export full database backup as JSON"
          >
            <span>💾 Backup SQLite (.json)</span>
          </button>
          <label 
            class="btn-secondary" 
            style="padding: 0.6rem 1.1rem; font-size: 0.88rem; font-weight: 700; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.4rem; cursor: pointer;"
            title="Import and restore database backup JSON"
          >
            <span>📂 Restore SQLite (.json)</span>
            <input type="file" accept=".json" style="display: none;" onchange="App.handleImportDatabase(event)" />
          </label>
          <button 
            type="button"
            class="download-txt-cta" 
            style="max-width: 240px; padding: 0.6rem 1.15rem;"
            onclick="App.openCreateStudentModal()"
          >
            <span>➕ Create Student</span>
          </button>
        </div>
      </div>

      <div class="table-card">
        <div style="overflow-x: auto;">
          <table class="metrics-table">
            <thead>
              <tr>
                <th>Student Profile & Avatar</th>
                <th>Student Password</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // ==========================================
  // Admin Teacher Account CRUD Handlers
  // ==========================================
  openCreateTeacherModal() {
    const modal = document.getElementById('admin-create-teacher-modal');
    if (!modal) return;
    document.getElementById('new-teacher-name').value = '';
    document.getElementById('new-teacher-username').value = '';
    document.getElementById('new-teacher-password').value = '';
    document.getElementById('new-teacher-spec').value = '';
    modal.classList.add('open');
    setTimeout(() => document.getElementById('new-teacher-name').focus(), 100);
  },

  closeCreateTeacherModal() {
    const modal = document.getElementById('admin-create-teacher-modal');
    if (modal) modal.classList.remove('open');
  },

  submitAdminCreateTeacher() {
    const name = document.getElementById('new-teacher-name').value;
    const username = document.getElementById('new-teacher-username').value;
    const password = document.getElementById('new-teacher-password').value;
    const spec = document.getElementById('new-teacher-spec').value;

    const res = StorageService.createTeacherAccount({
      name: name,
      username: username,
      password: password,
      specialization: spec
    });

    if (!res.success) {
      alert(res.error);
      return;
    }

    this.closeCreateTeacherModal();
    this.renderAdminDashboard();
  },

  deleteTeacher(id, encodedName) {
    const name = decodeURIComponent(encodedName);
    if (confirm(`Are you sure you want to delete teacher account "${name}"? They will no longer be able to log in.`)) {
      StorageService.deleteTeacherAccount(id);
      this.renderAdminDashboard();
    }
  },

  openEditTeacherModal(id) {
    const list = StorageService.getTeacherAccounts();
    const teacher = list.find(t => t.id === id);
    if (!teacher) return;
    const modal = document.getElementById('admin-edit-teacher-modal');
    if (!modal) return;

    document.getElementById('edit-teacher-id').value = teacher.id;
    document.getElementById('edit-teacher-name').value = teacher.name || '';
    document.getElementById('edit-teacher-username').value = teacher.username || '';
    document.getElementById('edit-teacher-password').value = teacher.password || '';
    document.getElementById('edit-teacher-spec').value = teacher.specialization || '';
    modal.classList.add('open');
  },

  closeEditTeacherModal() {
    const modal = document.getElementById('admin-edit-teacher-modal');
    if (modal) modal.classList.remove('open');
  },

  submitAdminEditTeacher() {
    const id = document.getElementById('edit-teacher-id').value;
    const res = StorageService.updateTeacherAccount(id, {
      name: document.getElementById('edit-teacher-name').value,
      username: document.getElementById('edit-teacher-username').value,
      password: document.getElementById('edit-teacher-password').value,
      specialization: document.getElementById('edit-teacher-spec').value
    });
    if (!res.success) {
      alert(res.error);
      return;
    }
    this.closeEditTeacherModal();
    this.renderAdminDashboard();
  },

  // ==========================================
  // Admin Student Account CRUD Handlers
  // ==========================================
  openCreateStudentModal() {
    const modal = document.getElementById('admin-create-student-modal');
    if (!modal) return;
    document.getElementById('new-student-nick').value = '';
    document.getElementById('new-student-pass').value = '';
    this.adminStudentAvatarId = 'avatar_hijab_teal';

    this.renderAdminStudentAvatarPicker();
    modal.classList.add('open');
    setTimeout(() => document.getElementById('new-student-nick').focus(), 100);
  },

  closeCreateStudentModal() {
    const modal = document.getElementById('admin-create-student-modal');
    if (modal) modal.classList.remove('open');
  },

  renderAdminStudentAvatarPicker() {
    const grid = document.getElementById('admin-student-avatar-grid');
    if (!grid) return;

    const avatars = typeof AvatarsService !== 'undefined' ? AvatarsService.getAll() : [];
    let html = '';
    avatars.forEach(av => {
      const isSelected = av.id === this.adminStudentAvatarId;
      html += `
        <div 
          class="avatar-card-radio ${isSelected ? 'selected' : ''}" 
          id="admin-avatar-card-${av.id}"
          onclick="App.selectAdminStudentAvatar('${av.id}')"
          title="${av.name}"
        >
          ${AvatarsService.getSvgHtml(av.id, 50)}
          <span class="avatar-title-label">${av.name}</span>
        </div>
      `;
    });
    grid.innerHTML = html;
  },

  selectAdminStudentAvatar(avatarId) {
    this.adminStudentAvatarId = avatarId;
    document.querySelectorAll('#admin-student-avatar-grid .avatar-card-radio').forEach(card => {
      card.classList.remove('selected');
    });
    const chosen = document.getElementById(`admin-avatar-card-${avatarId}`);
    if (chosen) chosen.classList.add('selected');
  },

  submitAdminCreateStudent() {
    const nick = (document.getElementById('new-student-nick').value || '').trim();
    const pass = (document.getElementById('new-student-pass').value || '').trim();
    const avatar = this.adminStudentAvatarId || 'avatar_hijab_teal';

    const res = StorageService.createStudentAccount({
      nickname: nick,
      password: pass || '123',
      avatarId: avatar
    });
    if (!res.success) {
      alert(res.error);
      return;
    }

    this.closeCreateStudentModal();
    this.renderAdminDashboard();
  },

  openEditStudentModal(encodedNick) {
    const nick = decodeURIComponent(encodedNick);
    const list = StorageService.getRegisteredStudents();
    const student = list.find(s => (s.nickname || '').toLowerCase() === nick.toLowerCase());
    if (!student) return;

    const modal = document.getElementById('admin-edit-student-modal');
    if (!modal) return;

    document.getElementById('edit-student-original-nick').value = student.nickname;
    document.getElementById('edit-student-nick').value = student.nickname;
    document.getElementById('edit-student-pass').value = student.password || '123';
    this.adminEditStudentAvatarId = student.avatarId || 'avatar_hijab_teal';

    this.renderAdminEditStudentAvatarPicker();
    modal.classList.add('open');
  },

  closeEditStudentModal() {
    const modal = document.getElementById('admin-edit-student-modal');
    if (modal) modal.classList.remove('open');
  },

  renderAdminEditStudentAvatarPicker() {
    const grid = document.getElementById('admin-edit-student-avatar-grid');
    if (!grid) return;
    const avatars = typeof AvatarsService !== 'undefined' ? AvatarsService.getAll() : [];
    grid.innerHTML = avatars.map(av => {
      const isSelected = av.id === this.adminEditStudentAvatarId;
      return `
        <div 
          class="avatar-card-radio ${isSelected ? 'selected' : ''}" 
          id="admin-edit-avatar-card-${av.id}"
          onclick="App.selectAdminEditStudentAvatar('${av.id}')"
          title="${av.name}"
        >
          ${AvatarsService.getSvgHtml(av.id, 50)}
          <span class="avatar-title-label">${av.name}</span>
        </div>
      `;
    }).join('');
  },

  selectAdminEditStudentAvatar(avatarId) {
    this.adminEditStudentAvatarId = avatarId;
    document.querySelectorAll('#admin-edit-student-avatar-grid .avatar-card-radio').forEach(card => {
      card.classList.remove('selected');
    });
    const chosen = document.getElementById(`admin-edit-avatar-card-${avatarId}`);
    if (chosen) chosen.classList.add('selected');
  },

  submitAdminEditStudent() {
    const origNick = document.getElementById('edit-student-original-nick').value;
    const pass = document.getElementById('edit-student-pass').value;
    const res = StorageService.updateStudentAccount(origNick, {
      password: pass,
      avatarId: this.adminEditStudentAvatarId
    });
    if (!res.success) {
      alert(res.error);
      return;
    }
    this.closeEditStudentModal();
    this.renderAdminDashboard();
  },

  deleteStudent(encodedNick) {
    const nick = decodeURIComponent(encodedNick);
    if (confirm(`Are you sure you want to delete student account "${nick}"?`)) {
      StorageService.deleteStudentAccount(nick);
      this.renderAdminDashboard();
    }
  },

  downloadDatabaseJson() {
    const jsonStr = StorageService.exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `welcomeplace_sqlite_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  handleImportDatabase(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const res = StorageService.importDatabaseJson(content);
      if (res.success) {
        alert('🎉 SQLite backup restored successfully! Database updated.');
        this.renderAdminDashboard();
      } else {
        alert('⚠️ Error importing backup file: ' + res.error);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  },

  downloadSingleTxt(logId) {
    const logs = StorageService.getAllMetrics();
    const log = logs.find(l => l.id === logId);
    if (!log) return;

    const reportTxt = TxtReportGenerator.generateReportText(log);
    const fileName = TxtReportGenerator.generateFileName(log.studentName, log.moduleId);
    TxtReportGenerator.downloadFile(fileName, reportTxt);
  },

  async syncWithSqlite() {
    const btn = document.getElementById('sync-btn-text');
    if (btn) btn.textContent = '⏳ Syncing SQLite...';
    try {
      const ok = await StorageService.syncWithSqlite();
      if (ok) {
        if (btn) btn.textContent = '✅ SQLite Synced!';
        this.renderAdminDashboard();
        setTimeout(() => {
          if (btn) btn.textContent = '🔄 Refresh from SQLite';
        }, 2000);
      } else {
        alert('⚠️ Could not connect to Turso SQLite. Please check your internet connection.');
        if (btn) btn.textContent = '🔄 Refresh from SQLite';
      }
    } catch (err) {
      alert('⚠️ SQLite Sync Error: ' + err.message);
      if (btn) btn.textContent = '🔄 Refresh from SQLite';
    }
  },

  printAdminReport() {
    window.print();
  },

  exportMasterAuditTxt() {
    const logs = StorageService.getAllMetrics();
    if (logs.length === 0) {
      alert('No metric logs to export.');
      return;
    }
    const masterTxt = TxtReportGenerator.generateMasterExport(logs);
    const fileName = `WELCOMEPLACE_MASTER_AUDIT_${new Date().toISOString().slice(0, 10)}.txt`;
    TxtReportGenerator.downloadFile(fileName, masterTxt);
  },

  confirmClearLogs() {
    if (confirm('Are you sure you want to clear all evaluation records? This cannot be undone.')) {
      StorageService.clearAllMetrics();
      this.render();
    }
  },

  deleteMetric(metricId) {
    if (confirm('Are you sure you want to delete this evaluation record?')) {
      StorageService.deleteMetric(metricId);
      this.render();
    }
  },

  // ==========================================
  // On-Screen Metric Inspection Modal
  // ==========================================
  inspectMetric(metricId) {
    const all = StorageService.getAllMetrics();
    const item = all.find(m => m.id === metricId);
    if (!item) return;

    const modal = document.getElementById('admin-metric-details-modal');
    if (!modal) return;

    const avatarSlot = document.getElementById('modal-metric-avatar-slot');
    const titleEl = document.getElementById('metric-details-title');
    const subEl = document.getElementById('metric-details-subtitle');
    const bodyEl = document.getElementById('modal-metric-body');
    const dlBtn = document.getElementById('modal-metric-download-btn');

    if (avatarSlot && typeof AvatarsService !== 'undefined') {
      avatarSlot.innerHTML = AvatarsService.getSvgHtml(item.avatarId || 'avatar_hijab_teal', 42);
    }

    if (titleEl) {
      titleEl.innerHTML = `${item.studentName} <span style="font-weight: 500; font-size: 0.95rem; color: var(--text-muted);">— ${item.moduleTitle}</span>`;
    }

    const dateStr = new Date(item.timestamp).toLocaleString('en-CA');
    const min = Math.floor((item.durationSeconds || 0) / 60);
    const sec = (item.durationSeconds || 0) % 60;
    const isPassed = (item.scorePercent || 0) >= 70;

    if (subEl) {
      subEl.innerHTML = `
        <strong>${item.scorePercent}% Score</strong> (${item.correctCount}/${item.totalQuestions}) • 
        ⏱️ ${min}m ${sec}s • 📅 ${dateStr} • 
        <span style="color: ${isPassed ? '#059669' : '#dc2626'}; font-weight: 700;">${isPassed ? 'PASSED' : 'NEEDS REVIEW'}</span>
      `;
    }

    if (dlBtn) {
      dlBtn.onclick = () => App.downloadSingleTxt(item.id);
    }

    let bodyHtml = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; margin-bottom: 1.25rem;">
        <div style="background: var(--bg-surface); padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border-color); text-align: center;">
          <div style="font-size: 0.75rem; color: var(--text-muted);">FINAL SCORE</div>
          <div style="font-size: 1.4rem; font-weight: 800; color: ${isPassed ? '#059669' : '#dc2626'};">${item.scorePercent}%</div>
        </div>
        <div style="background: var(--bg-surface); padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border-color); text-align: center;">
          <div style="font-size: 0.75rem; color: var(--text-muted);">CORRECT / TOTAL</div>
          <div style="font-size: 1.4rem; font-weight: 800; color: var(--text-main);">${item.correctCount} / ${item.totalQuestions}</div>
        </div>
        <div style="background: var(--bg-surface); padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border-color); text-align: center;">
          <div style="font-size: 0.75rem; color: var(--text-muted);">TIME SPENT</div>
          <div style="font-size: 1.4rem; font-weight: 800; color: var(--brand-blue);">${min}m ${sec}s</div>
        </div>
      </div>

      <h4 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 0.75rem; color: var(--text-main);">
        📋 Detailed Questions & Answers Breakdown:
      </h4>
    `;

    if (Array.isArray(item.details) && item.details.length > 0) {
      bodyHtml += `<div style="display: flex; flex-direction: column; gap: 0.85rem;">`;
      item.details.forEach((det, idx) => {
        let answerStr = det.userAnswer;
        if (Array.isArray(answerStr)) answerStr = answerStr.join(', ');
        if (!answerStr) answerStr = '<em style="color: var(--text-muted);">No answer provided</em>';

        bodyHtml += `
          <div style="padding: 0.85rem 1rem; border-radius: 8px; border: 1px solid ${det.isCorrect ? '#bbf7d0' : '#fecaca'}; background: ${det.isCorrect ? '#f0fdf4' : '#fef2f2'};">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.4rem;">
              <span style="font-size: 0.88rem; font-weight: 700; color: var(--text-main);">
                #${idx + 1}. ${det.prompt || 'Question'}
              </span>
              <span style="font-size: 0.75rem; font-weight: 800; padding: 2px 7px; border-radius: 4px; background: ${det.isCorrect ? '#10b981' : '#ef4444'}; color: #ffffff;">
                ${det.isCorrect ? '✓ CORRECT' : '✗ REVIEW'}
              </span>
            </div>

            <div style="font-size: 0.85rem; color: var(--text-main); margin-bottom: 0.25rem;">
              <strong>Learner Response:</strong> <span style="font-family: inherit;">${answerStr}</span>
            </div>

            ${det.explanation ? `
              <div style="font-size: 0.8rem; color: var(--text-muted); background: rgba(255,255,255,0.7); padding: 0.4rem 0.6rem; border-radius: 4px; margin-top: 0.35rem;">
                💡 <strong>Guidance note:</strong> ${det.explanation}
              </div>
            ` : ''}
          </div>
        `;
      });
      bodyHtml += `</div>`;
    } else {
      bodyHtml += `
        <div style="padding: 1.5rem; text-align: center; color: var(--text-muted); background: var(--bg-surface); border-radius: 8px;">
          Overall evaluation result: ${item.scorePercent}% (${item.correctCount}/${item.totalQuestions} items verified).
        </div>
      `;
    }

    if (bodyEl) bodyEl.innerHTML = bodyHtml;
    modal.classList.add('open');
  },

  closeMetricDetailsModal() {
    const modal = document.getElementById('admin-metric-details-modal');
    if (modal) modal.classList.remove('open');
  },

  // ==========================================
  // Student Lifetime Metrics Export & Filtering
  // ==========================================
  downloadStudentLifetimeTxt(encodedNick) {
    const studentName = decodeURIComponent(encodedNick);
    const records = StorageService.getMetricsForStudent(studentName);
    if (!records || records.length === 0) {
      alert(`No evaluation records found yet for student "${studentName}".`);
      return;
    }
    const reportTxt = TxtReportGenerator.generateStudentLifetimeReport(studentName, records);
    const fileName = TxtReportGenerator.generateStudentLifetimeFileName(studentName);
    TxtReportGenerator.downloadFile(fileName, reportTxt);
  },

  viewStudentMetrics(encodedNick) {
    const studentName = decodeURIComponent(encodedNick);
    this.adminActiveTab = 'metrics';
    this.adminMetricFilterStudent = studentName;
    this.renderAdminDashboard();
  },

  setMetricFilter(filterKey, value) {
    if (filterKey === 'student') this.adminMetricFilterStudent = value;
    else if (filterKey === 'type') this.adminMetricFilterType = value;
    else if (filterKey === 'status') this.adminMetricFilterStatus = value;
    this.renderAdminDashboard();
  },

  setMetricSearch(query) {
    this.adminMetricSearchQuery = (query || '').trim();
    this.renderAdminDashboard();
  }
};

if (typeof window !== 'undefined') {
  window.App = App;
}

// Initialize app when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  App.init();
});
