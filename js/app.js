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
  currentSlideIndex: 0,
  pendingRoleSwitch: null,
  selectedAvatarId: 'avatar_hijab_teal',
  adminActiveTab: 'metrics', // 'metrics' | 'teachers' | 'students'
  adminStudentAvatarId: 'avatar_hijab_teal',
  adminMetricFilterStudent: 'ALL',
  adminMetricFilterType: 'ALL',
  adminMetricFilterStatus: 'ALL',
  adminMetricSearchQuery: '',

  init() {
    this.currentRole = StorageService.getCurrentRole();
    const student = StorageService.getActiveStudent();
    if (student && student.avatarId) {
      this.selectedAvatarId = student.avatarId;
    }
    this.setupEventListeners();
    this.updateRoleUI();
    this.render();
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
  },

  // ==========================================
  // Student Profile, Login & Avatar Selection
  // ==========================================
  handleUserBadgeClick() {
    if (this.currentRole === 'student') {
      this.openStudentLoginModal();
    }
  },

  openStudentLoginModal() {
    const modal = document.getElementById('student-login-modal');
    if (!modal) return;

    const student = (typeof StorageService !== 'undefined') 
      ? StorageService.getActiveStudent() 
      : { nickname: 'Student_01', password: '123', avatarId: 'avatar_hijab_teal' };

    const nickField = document.getElementById('student-nickname-field');
    const passField = document.getElementById('student-password-field');

    if (nickField) nickField.value = student.nickname || '';
    if (passField) passField.value = student.password || '';
    this.selectedAvatarId = student.avatarId || 'avatar_hijab_teal';

    this.renderAvatarPicker();
    this.renderRecentStudentsList();

    modal.classList.add('open');
    if (nickField) setTimeout(() => nickField.focus(), 100);
  },

  closeStudentLoginModal() {
    const modal = document.getElementById('student-login-modal');
    if (modal) modal.classList.remove('open');
  },

  renderAvatarPicker() {
    const grid = document.getElementById('avatar-picker-grid');
    if (!grid) return;

    const avatars = (typeof AvatarsService !== 'undefined') ? AvatarsService.getAll() : [];
    let html = '';

    avatars.forEach(av => {
      const isSelected = av.id === this.selectedAvatarId;
      const svgIcon = (typeof AvatarsService !== 'undefined') ? AvatarsService.getSvgHtml(av.id, 54) : '';
      html += `
        <div 
          class="avatar-card-radio ${isSelected ? 'selected' : ''}" 
          id="avatar-card-${av.id}"
          onclick="App.selectAvatar('${av.id}')"
          title="${av.name}"
        >
          ${svgIcon}
          <span class="avatar-title-label">${av.name}</span>
        </div>
      `;
    });

    grid.innerHTML = html;
  },

  selectAvatar(avatarId) {
    this.selectedAvatarId = avatarId;
    document.querySelectorAll('.avatar-card-radio').forEach(card => {
      card.classList.remove('selected');
    });
    const chosen = document.getElementById(`avatar-card-${avatarId}`);
    if (chosen) chosen.classList.add('selected');
  },

  renderRecentStudentsList() {
    const section = document.getElementById('recent-students-section');
    const container = document.getElementById('recent-students-chips');
    if (!section || !container) return;

    const registered = (typeof StorageService !== 'undefined') 
      ? StorageService.getRegisteredStudents() 
      : [];

    if (!registered || registered.length === 0) {
      section.style.display = 'none';
      return;
    }

    section.style.display = 'block';
    let html = '';
    registered.forEach(st => {
      const iconSvg = (typeof AvatarsService !== 'undefined')
        ? AvatarsService.getSvgHtml(st.avatarId || 'avatar_hijab_teal', 20)
        : '';
      html += `
        <button type="button" class="recent-student-pill" onclick="App.quickSelectStudent('${st.nickname}')">
          ${iconSvg}
          <span>${st.nickname}</span>
        </button>
      `;
    });
    container.innerHTML = html;
  },

  quickSelectStudent(nickname) {
    const list = StorageService.getRegisteredStudents();
    const found = list.find(s => s.nickname.toLowerCase() === nickname.toLowerCase());
    if (found) {
      const nickField = document.getElementById('student-nickname-field');
      const passField = document.getElementById('student-password-field');
      if (nickField) nickField.value = found.nickname;
      if (passField) passField.value = found.password || '123';
      this.selectAvatar(found.avatarId || 'avatar_hijab_teal');
    }
  },

  submitStudentLogin() {
    const nickField = document.getElementById('student-nickname-field');
    const passField = document.getElementById('student-password-field');

    const nickname = (nickField ? nickField.value : '').trim();
    const password = (passField ? passField.value : '').trim();
    const avatarId = this.selectedAvatarId || 'avatar_hijab_teal';

    const authRes = StorageService.authenticateStudent(nickname, password, avatarId);
    if (!authRes.success) {
      alert(authRes.error);
      if (passField) {
        passField.value = '';
        passField.focus();
      }
      return;
    }

    this.closeStudentLoginModal();
    this.updateRoleUI();
    this.render();
  },

  logoutStudent() {
    if (confirm('Log out of this student account? This prevents unauthorized users from accessing your records.')) {
      StorageService.logoutStudent();
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
      this.setRole('student');
      return;
    }

    if (targetRole === 'teacher') {
      const activeTeacher = StorageService.getActiveTeacher();
      if (activeTeacher) {
        this.setRole('teacher');
      } else {
        this.openTeacherLoginModal();
      }
      return;
    }

    if (targetRole === 'admin') {
      this.pendingRoleSwitch = 'admin';
      this.openPinModal('admin');
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
      this.setRole('student');
    }
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
    const student = StorageService.getActiveStudent();
    const isStudentLogged = StorageService.isStudentLoggedIn();
    const activeTeacher = StorageService.getActiveTeacher();

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
        if (badgeText) badgeText.innerHTML = `👤 Learner: <em>Not Logged In</em>`;
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
        const teacherName = activeTeacher ? activeTeacher.name : 'Instructor';
        badgeText.innerHTML = `🧑‍🏫 Teacher: <strong>${teacherName}</strong>`;
      }
      if (logoutBtn) {
        logoutBtn.style.display = 'inline-flex';
        logoutBtn.innerHTML = '<span>🚪</span><span>Log Out (Teacher)</span>';
        logoutBtn.onclick = () => App.logoutTeacher();
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
        logoutBtn.onclick = () => App.setRole('student');
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
      this.cleanupLabs();
      this.renderAdminDashboard(mainContainer);
    } else if (this.activeLab === 'mouse') {
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
    if (this.currentRole === 'student' && !StorageService.isStudentLoggedIn()) {
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
    if (this.currentRole === 'student' && !StorageService.isStudentLoggedIn()) {
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
  // View 1: Modules Catalog List
  // ==========================================
  renderModulesList(container = document.getElementById('app-main-content')) {
    this.currentModule = null;

    const isTeacher = this.currentRole === 'teacher';
    const isStudentLogged = StorageService.isStudentLoggedIn();
    const student = StorageService.getActiveStudent();

    let heroHtml = '';

    if (isTeacher) {
      heroHtml = `
        <div class="welcome-hero" style="background: linear-gradient(135deg, #7c2d12 0%, #9a3412 50%, #c2410c 100%);">
          <div class="welcome-hero-content">
            <h2>🧑‍🏫 Teacher Portal: Literacy Curriculum</h2>
            <p>
              Preview learning modules with integrated pedagogical methodology notes and classroom guides.
            </p>
          </div>
        </div>
      `;
    } else if (isStudentLogged) {
      heroHtml = `
        <div class="welcome-hero">
          <div class="welcome-hero-content">
            <h2>👋 Welcome, ${student.nickname || 'Learner'}!</h2>
            <p>
              Learn computer essentials at your own pace with interactive slides, videos, pronunciation audio, and quizzes.
            </p>
            
            <div class="student-identity-bar" style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
              <div style="display: flex; align-items: center; gap: 0.85rem;">
                ${AvatarsService.getSvgHtml(student.avatarId || 'avatar_hijab_teal', 52)}
                <div>
                  <div style="font-size: 1.1rem; font-weight: 800; color: white;">
                    ${student.nickname || 'Student'}
                  </div>
                  <div style="font-size: 0.82rem; color: #bae6fd;">
                    Active Student Profile (Protected)
                  </div>
                </div>
              </div>

              <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
                <button 
                  type="button" 
                  class="btn-secondary" 
                  style="padding: 0.55rem 1rem; border-radius: var(--radius-full); font-size: 0.88rem;"
                  onclick="App.openStudentLoginModal()"
                >
                  <span>⚙️ Switch / Edit Profile</span>
                </button>
                <button 
                  type="button" 
                  class="btn-danger" 
                  style="padding: 0.55rem 1rem; border-radius: var(--radius-full); font-size: 0.88rem; background: #fee2e2; border-color: #fca5a5;"
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
      // Logged out student state - protects account
      heroHtml = `
        <div class="welcome-hero" style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%);">
          <div class="welcome-hero-content">
            <h2>🔒 Student Profile Locked</h2>
            <p>
              Please sign in with your nickname and password to access your modules, take quizzes, and protect your personal learning records.
            </p>
            
            <div style="margin-top: 1.25rem;">
              <button 
                type="button" 
                class="download-txt-cta" 
                style="max-width: 320px; background: #38bdf8; color: #0f172a; font-weight: 800;"
                onclick="App.openStudentLoginModal()"
              >
                <span>🔑 Sign In / Choose Avatar</span>
                <span>➜</span>
              </button>
            </div>
          </div>
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
          Interactive motor skills & typing muscle memory simulators
        </span>
      </div>

      <div class="practice-labs-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem; margin-bottom: 2.25rem;">
        <!-- Mouse Practice Lab Card -->
        <div class="module-card practice-lab-card" style="border: 2px solid #bfdbfe; background: linear-gradient(180deg, #ffffff 0%, #f0f7ff 100%); cursor: pointer;" onclick="App.openMouseTrainer()">
          <div class="module-card-header">
            <div class="module-icon-large" style="background: #dbeafe; color: #1d4ed8;">🖱️</div>
            <span class="module-badge" style="background: #2563eb; color: #ffffff;">Precision Simulator</span>
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
          <button class="module-footer-btn" style="background: #2563eb; color: #ffffff; border-color: #1d4ed8;">
            <span>${isStudentLogged || isTeacher ? 'Launch Mouse Lab' : 'Sign In to Launch Lab'}</span>
            <span>➜</span>
          </button>
        </div>

        <!-- Keyboard Typing Lab Card -->
        <div class="module-card practice-lab-card" style="border: 2px solid #bbf7d0; background: linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%); cursor: pointer;" onclick="App.openTypingTrainer()">
          <div class="module-card-header">
            <div class="module-icon-large" style="background: #dcfce7; color: #15803d;">⌨️</div>
            <span class="module-badge" style="background: #16a34a; color: #ffffff;">Stamina Simulator</span>
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
          <button class="module-footer-btn" style="background: #16a34a; color: #ffffff; border-color: #15803d;">
            <span>${isStudentLogged || isTeacher ? 'Launch Typing Lab' : 'Sign In to Launch Lab'}</span>
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
          ${isStudentLogged || isTeacher ? 'Select any module to start learning' : 'Sign in above to unlock module tests'}
        </span>
      </div>

      <div class="modules-grid">
    `;

    MODULES_DATA.forEach(mod => {
      const chips = (mod.tags || []).map(t => `<span class="chip">🏷️ ${t}</span>`).join('');
      
      html += `
        <div class="module-card" onclick="App.openModule('${mod.id}')">
          <div class="module-card-header">
            <div class="module-icon-large">${mod.icon}</div>
            <span class="module-badge">${mod.badge}</span>
          </div>

          <h3 class="module-title">${mod.title}</h3>
          <p class="module-desc">${mod.subtitle}</p>

          <div class="module-features-chips">
            ${chips}
            <span class="chip">📊 ${mod.quiz.questions.length} Quiz Questions</span>
          </div>

          <button class="module-footer-btn">
            <span>${isTeacher ? 'Inspect Module & Teacher Notes' : 'Start Learning Module'}</span>
            <span>➜</span>
          </button>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  },

  openModule(moduleId) {
    if (this.currentRole === 'student' && !StorageService.isStudentLoggedIn()) {
      this.openStudentLoginModal();
      return;
    }
    this.cleanupLabs();
    this.activeLab = null;
    const found = MODULES_DATA.find(m => m.id === moduleId);
    if (!found) return;
    this.currentModule = found;
    this.activeLessonTab = 'presentation';
    this.currentSlideIndex = 0;
    this.render();
  },

  // ==========================================
  // View 2: Detailed Lesson View (5 Tabs)
  // ==========================================
  renderLessonView(container = document.getElementById('app-main-content')) {
    const mod = this.currentModule;
    const isTeacher = this.currentRole === 'teacher';

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

        <!-- Teacher Alert Banner (Visible when Teacher Mode is active) -->
        ${isTeacher ? `
          <div class="teacher-mode-banner">
            <div class="teacher-mode-icon">🧑‍🏫</div>
            <div class="teacher-mode-text">
              <h3>Instructor Mode Active: ${mod.title}</h3>
              <p>You can review all student material slots as well as pedagogical recommendations and offline exercises.</p>
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
    this.activeLessonTab = tabKey;
    document.querySelectorAll('.lesson-tab-btn').forEach(b => b.classList.remove('active'));
    this.renderActiveTabContent();
  },

  renderActiveTabContent() {
    const viewport = document.getElementById('lesson-content-viewport');
    if (!viewport) return;

    const mod = this.currentModule;

    switch (this.activeLessonTab) {
      case 'presentation':
        this.renderPresentationSlot(viewport, mod.presentation);
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
      case 'quiz':
        QuizEngine.init(mod, viewport);
        break;
      case 'teacher_notes':
        this.renderTeacherNotesSlot(viewport, mod.teacherNotes);
        break;
    }
  },

  // Slot 1: Presentation Carousel
  renderPresentationSlot(container, slides = []) {
    if (!slides.length) {
      container.innerHTML = '<p>No slides available yet.</p>';
      return;
    }

    const currentSlide = slides[this.currentSlideIndex] || slides[0];

    let dotsHtml = slides.map((s, idx) => `
      <div 
        class="slide-dot ${idx === this.currentSlideIndex ? 'active' : ''}" 
        onclick="App.goToSlide(${idx})"
        title="Slide ${idx + 1}"
      ></div>
    `).join('');

    container.innerHTML = `
      <div class="presentation-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
            Interactive Slide Carousel
          </span>
          <span style="font-size: 0.85rem; font-weight: 700; background: var(--surface-muted); padding: 3px 10px; border-radius: var(--radius-full);">
            Slide ${this.currentSlideIndex + 1} of ${slides.length}
          </span>
        </div>

        <div class="slide-viewport">
          <div class="slide-content-icon">${currentSlide.icon || '💻'}</div>
          <h2 class="slide-title">${currentSlide.title}</h2>
          <p class="slide-text">${currentSlide.text}</p>
          ${currentSlide.tip ? `
            <div style="margin-top: 1.25rem; font-size: 0.95rem; color: #1e40af; background: #eff6ff; padding: 0.6rem 1.2rem; border-radius: var(--radius-full); font-weight: 600;">
              ${currentSlide.tip}
            </div>
          ` : ''}
        </div>

        <div class="presentation-nav">
          <button class="slide-nav-btn" ${this.currentSlideIndex === 0 ? 'disabled' : ''} onclick="App.prevSlide()">
            <span>◀</span>
            <span>Previous</span>
          </button>

          <div class="slide-indicators">
            ${dotsHtml}
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

  // Slot 2: Text Reading
  renderTextSlot(container, textData) {
    if (!textData) return;

    let sectionsHtml = (textData.sections || []).map(sec => `
      <div style="margin-bottom: 1.75rem;">
        <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.4rem;">
          ${sec.subheading}
        </h4>
        <p style="font-size: 1.05rem; color: var(--text-muted); line-height: 1.6;">
          ${sec.body}
        </p>
      </div>
    `).join('');

    const downloadBannerHtml = textData.downloadUrl ? `
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 1px solid #bfdbfe; padding: 1.15rem 1.35rem; border-radius: var(--radius-md); margin-bottom: 2rem;">
        <div style="display: flex; align-items: center; gap: 0.85rem;">
          <span style="font-size: 2.2rem;">📕</span>
          <div>
            <div style="font-size: 1.05rem; font-weight: 800; color: #1e3a8a;">Student Companion Handbook (PDF)</div>
            <div style="font-size: 0.88rem; color: #1e40af; margin-top: 0.15rem;">
              ${textData.downloadLabel || 'Download complete illustrated companion handbook with diagrams'}
            </div>
          </div>
        </div>
        <a 
          href="${textData.downloadUrl}" 
          download 
          target="_blank" 
          class="download-txt-cta" 
          style="padding: 0.6rem 1.25rem; font-size: 0.9rem; text-decoration: none;"
        >
          <span>📥 Download PDF</span>
          <span>➜</span>
        </a>
      </div>
    ` : '';

    container.innerHTML = `
      <div class="presentation-card" style="padding: 2.25rem;">
        <span style="font-size: 0.8rem; font-weight: 700; color: var(--brand-blue); text-transform: uppercase;">
          Reading & Visual Guide
        </span>
        <h2 style="font-size: 1.65rem; font-weight: 800; margin: 0.5rem 0 0.75rem;">
          ${textData.heading}
        </h2>
        <p style="font-size: 1.1rem; color: var(--text-main); background: #f8fafc; padding: 1rem 1.25rem; border-left: 4px solid var(--brand-blue); border-radius: 4px; margin-bottom: 1.75rem;">
          ${textData.summary}
        </p>

        ${downloadBannerHtml}

        <div class="text-sections-container">
          ${sectionsHtml}
        </div>
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
            <div class="video-placeholder-icon" onclick="alert('Video slot ready: In this slot, the custom MP4 video or interactive player will play.')">
              ▶
            </div>
            <p style="font-size: 1.1rem; font-weight: 700;">Click to Play Step-by-Step Demonstration</p>
            <p style="font-size: 0.85rem; color: #94a3b8; margin-top: 0.25rem;">
              [Video Slot ready for local .mp4 files or embedded demonstrations]
            </p>
          </div>
        `}
      </div>
    `;
  },

  // Slot 4: Audio Player & Web Speech Pronunciation
  renderAudioSlot(container, audioData) {
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
            <span>Play Speech Voice</span>
          </button>
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

  // Slot 6: Teacher Notes (Methodology)
  renderTeacherNotesSlot(container, teacherData) {
    if (!teacherData) return;

    let tipsHtml = (teacherData.methodologyTips || []).map(t => `<li>${t}</li>`).join('');
    let exercisesHtml = (teacherData.classroomExercises || []).map(e => `<li>${e}</li>`).join('');

    let downloadsHtml = '';
    if (teacherData.downloads && teacherData.downloads.length > 0) {
      downloadsHtml = `
        <div style="background: #ffffff; border: 1px solid #fed7aa; border-radius: 8px; padding: 1.25rem; margin-bottom: 1.75rem; box-shadow: var(--shadow-sm);">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #9a3412; margin-bottom: 0.75rem;">
            📂 Download Classroom & Teaching Materials
          </h4>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            ${teacherData.downloads.map(d => `
              <a 
                href="${d.file}" 
                download 
                class="btn-secondary" 
                style="padding: 0.55rem 1rem; font-size: 0.88rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; background: #fff7ed; border-color: #fdba74; color: #9a3412;"
              >
                <span>${d.icon || '📄'}</span>
                <span>${d.title}</span>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }

    let quotesHtml = '';
    if (teacherData.verbatimScriptHighlights && teacherData.verbatimScriptHighlights.length > 0) {
      quotesHtml = `
        <div style="margin-bottom: 1.75rem;">
          <h3 style="font-size: 1.2rem; font-weight: 800; color: #9a3412; margin-bottom: 0.75rem;">💬 Verbatim Teaching Script Highlights</h3>
          <div style="display: grid; gap: 0.75rem;">
            ${teacherData.verbatimScriptHighlights.map(q => `
              <div style="background: #fffaf0; border-left: 3px solid #f97316; padding: 0.85rem 1rem; border-radius: 4px;">
                <strong style="color: #c2410c; font-size: 0.88rem; display: block; margin-bottom: 0.25rem;">${q.block}</strong>
                <p style="font-size: 0.95rem; font-style: italic; color: #431407; margin: 0;">${q.quote}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="presentation-card">
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem;">
          <span style="font-size: 2rem;">🧑‍🏫</span>
          <div>
            <h2 style="font-size: 1.5rem; font-weight: 800; color: #9a3412;">Teacher & Instructor Guide</h2>
            <p style="color: #7c2d12; font-size: 0.95rem;">Methodological, psychological, and classroom facilitation guide for ESL/CLB learners</p>
          </div>
        </div>

        <div style="background: #fff7ed; border-left: 4px solid #ea580c; padding: 1.25rem; border-radius: 4px; margin-bottom: 1.75rem;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #9a3412; margin-bottom: 0.35rem;">🎯 Core Learning Objective</h4>
          <p style="color: #7c2d12; font-size: 0.98rem; line-height: 1.5;">${teacherData.learningGoal}</p>
        </div>

        ${downloadsHtml}

        <div style="margin-bottom: 1.75rem;">
          <h3 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 0.75rem;">💡 Key Pedagogical Rules & Techniques</h3>
          <ul class="teacher-tips-list" style="line-height: 1.6;">
            ${tipsHtml}
          </ul>
        </div>

        ${quotesHtml}

        <div>
          <h3 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 0.75rem;">📋 Block-by-Block Class Schedule & Drills</h3>
          <ul class="teacher-tips-list" style="line-height: 1.6;">
            ${exercisesHtml}
          </ul>
        </div>
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
              </div>
            </td>
          </tr>
        `;
      });
    }

    return `
      <!-- Google Sheets Cloud Sync Banner -->
      <div class="google-sync-card" style="display: flex; align-items: center; justify-content: space-between; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--radius-md); padding: 0.85rem 1.25rem; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div style="font-size: 1.6rem; background: #dcfce7; padding: 0.4rem 0.6rem; border-radius: 8px;">📊</div>
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <strong style="color: #166534; font-size: 0.98rem;">Google Sheets Live Sync Connected</strong>
              <span style="background: #22c55e; color: white; font-size: 0.7rem; font-weight: 800; padding: 2px 7px; border-radius: 999px;">ACTIVE</span>
            </div>
            <div style="font-size: 0.82rem; color: #15803d; margin-top: 2px;">
              Every student quiz & lab attempt automatically streams to your private Google Drive spreadsheet
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
          <button 
            type="button" 
            class="btn-secondary" 
            style="padding: 0.45rem 0.95rem; font-size: 0.85rem; font-weight: 700; background: #ffffff; color: #166534; border-color: #86efac;" 
            onclick="App.syncWithGoogleSheet()"
            title="Fetch and merge latest student records from your Google Sheet"
          >
            <span id="sync-btn-text">🔄 Sync with Google Sheet</span>
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
              <button 
                class="btn-danger" 
                style="padding: 0.35rem 0.75rem; font-size: 0.82rem;"
                onclick="App.deleteTeacher('${t.id}', '${encodeURIComponent(t.name)}')"
                title="Delete this teacher account"
              >
                🗑️ Delete
              </button>
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

        <button 
          class="download-txt-cta" 
          style="max-width: 260px; padding: 0.75rem 1.25rem;"
          onclick="App.openCreateStudentModal()"
        >
          <span>➕ Create Student Profile</span>
        </button>
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
    const nick = document.getElementById('new-student-nick').value;
    const pass = document.getElementById('new-student-pass').value;
    const avatar = this.adminStudentAvatarId || 'avatar_hijab_teal';

    const res = StorageService.authenticateStudent(nick, pass, avatar);
    if (!res.success) {
      alert(res.error);
      return;
    }

    this.closeCreateStudentModal();
    this.renderAdminDashboard();
  },

  deleteStudent(encodedNick) {
    const nick = decodeURIComponent(encodedNick);
    if (confirm(`Are you sure you want to delete student account "${nick}"?`)) {
      StorageService.deleteStudentAccount(nick);
      this.renderAdminDashboard();
    }
  },

  downloadSingleTxt(logId) {
    const logs = StorageService.getAllMetrics();
    const log = logs.find(l => l.id === logId);
    if (!log) return;

    const reportTxt = TxtReportGenerator.generateReportText(log);
    const fileName = TxtReportGenerator.generateFileName(log.studentName, log.moduleId);
    TxtReportGenerator.downloadFile(fileName, reportTxt);
  },

  async syncWithGoogleSheet() {
    const btn = document.getElementById('sync-btn-text');
    if (btn) btn.textContent = '⏳ Syncing...';
    try {
      const res = await StorageService.fetchMetricsFromGoogleSheet();
      if (res && res.success) {
        alert(`🎉 Google Sheet synchronized successfully!\nTotal records loaded: ${res.count} (${res.added} new added).`);
        this.renderAdminDashboard();
      } else {
        alert('⚠️ Could not sync with Google Sheet: ' + (res?.error || 'Unknown error'));
        if (btn) btn.textContent = '🔄 Sync with Google Sheet';
      }
    } catch (err) {
      alert('⚠️ Error syncing with Google Sheet: ' + err.message);
      if (btn) btn.textContent = '🔄 Sync with Google Sheet';
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
