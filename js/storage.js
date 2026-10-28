/**
 * WelcomePlace - Offline Storage Engine
 * Manages student attempts, logs, and settings using LocalStorage with IndexedDB readiness.
 */

const STORAGE_KEYS = {
  CURRENT_USER: 'wp_current_user',
  CURRENT_ROLE: 'wp_current_role',
  ACTIVE_STUDENT: 'wp_active_student',
  STUDENT_ACCOUNTS: 'wp_student_accounts',
  ACTIVE_TEACHER: 'wp_active_teacher',
  TEACHER_ACCOUNTS: 'wp_teacher_accounts',
  METRICS_LOGS: 'wp_metrics_logs',
  SETTINGS: 'wp_settings'
};

const StorageService = {
  // Current Student Account Management
  getActiveStudent() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && parsed.nickname) return parsed;
      }
    } catch (e) {}

    // Initial default student if first launch
    const initial = {
      nickname: 'Fatima',
      password: '123',
      avatarId: 'avatar_hijab_teal',
      isLoggedIn: true
    };
    return initial;
  },

  isStudentLoggedIn() {
    const s = this.getActiveStudent();
    return !!(s && s.isLoggedIn && s.nickname);
  },

  authenticateStudent(nickname, password, avatarId) {
    const cleanNick = (nickname || '').trim();
    const cleanPass = (password || '').trim();
    if (!cleanNick) {
      return { success: false, error: 'Please enter a student nickname.' };
    }

    const registered = this.getRegisteredStudents();
    const existing = registered.find(s => s.nickname.toLowerCase() === cleanNick.toLowerCase());

    if (existing) {
      if (existing.password && existing.password !== cleanPass) {
        return { 
          success: false, 
          error: `Incorrect password for student "${cleanNick}". Please check your password or use a different nickname.` 
        };
      }
      const updated = {
        ...existing,
        password: cleanPass || existing.password || '123',
        avatarId: avatarId || existing.avatarId || 'avatar_hijab_teal',
        isLoggedIn: true
      };
      this.setActiveStudent(updated);
      return { success: true, student: updated, isNew: false };
    } else {
      const newStudent = {
        nickname: cleanNick,
        password: cleanPass || '123',
        avatarId: avatarId || 'avatar_hijab_teal',
        isLoggedIn: true,
        createdAt: new Date().toISOString()
      };
      this.setActiveStudent(newStudent);
      return { success: true, student: newStudent, isNew: true };
    }
  },

  setActiveStudent(studentObj) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT, JSON.stringify(studentObj));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, studentObj.nickname);
    this.addStudentToRegistry(studentObj);
    return studentObj;
  },

  addStudentToRegistry(studentObj) {
    try {
      let list = this.getRegisteredStudents();
      const idx = list.findIndex(s => s.nickname.toLowerCase() === (studentObj.nickname || '').toLowerCase());
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...studentObj, isLoggedIn: false };
      } else {
        list.push({ ...studentObj, isLoggedIn: false });
      }
      localStorage.setItem(STORAGE_KEYS.STUDENT_ACCOUNTS, JSON.stringify(list));
    } catch (e) {}
  },

  saveRegisteredStudent(studentObj) {
    try {
      let list = this.getRegisteredStudents();
      const idx = list.findIndex(s => s.nickname.toLowerCase() === (studentObj.nickname || '').toLowerCase());
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...studentObj, isLoggedIn: false };
      } else {
        list.push({ ...studentObj, isLoggedIn: false });
      }
      localStorage.setItem(STORAGE_KEYS.STUDENT_ACCOUNTS, JSON.stringify(list));
      return list;
    } catch (e) {
      return [];
    }
  },

  getRegisteredStudents() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENT_ACCOUNTS);
      if (data !== null) return JSON.parse(data);
    } catch (e) {}
    // Initial fallback from project data/database.json
    return [
      {
        nickname: 'Test_Student',
        password: '123',
        avatarId: 'avatar_boy_caucasian',
        createdAt: '2026-10-28T01:13:00.000Z'
      }
    ];
  },

  logoutStudent() {
    const student = this.getActiveStudent();
    if (student) {
      student.isLoggedIn = false;
      localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT, JSON.stringify(student));
    }
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  deleteStudentAccount(nickname) {
    try {
      let list = this.getRegisteredStudents();
      list = list.filter(s => s.nickname.toLowerCase() !== (nickname || '').toLowerCase());
      localStorage.setItem(STORAGE_KEYS.STUDENT_ACCOUNTS, JSON.stringify(list));
      
      const active = this.getActiveStudent();
      if (active && active.nickname.toLowerCase() === (nickname || '').toLowerCase()) {
        this.logoutStudent();
      }
      return list;
    } catch (e) {
      return [];
    }
  },

  // ==========================================
  // File-Based JSON Database (Zero Server, Git Tracked)
  // ==========================================
  DATABASE_FILE: 'data/database.json',

  async loadDatabaseFromFile() {
    try {
      const res = await fetch(this.DATABASE_FILE + '?v=' + Date.now());
      if (!res.ok) return false;
      const db = await res.json();
      if (!db) return false;

      // Initialize students if not already customized in localStorage
      const localStudents = localStorage.getItem(STORAGE_KEYS.STUDENT_ACCOUNTS);
      if (localStudents === null && Array.isArray(db.students)) {
        localStorage.setItem(STORAGE_KEYS.STUDENT_ACCOUNTS, JSON.stringify(db.students));
      }

      // Initialize teachers if not already customized in localStorage
      const localTeachers = localStorage.getItem(STORAGE_KEYS.TEACHER_ACCOUNTS);
      if (localTeachers === null && Array.isArray(db.teachers)) {
        localStorage.setItem(STORAGE_KEYS.TEACHER_ACCOUNTS, JSON.stringify(db.teachers));
      }

      return db;
    } catch (err) {
      console.warn('Could not load data/database.json:', err);
      return false;
    }
  },

  exportDatabaseJson() {
    const db = {
      version: '1.0.0',
      updatedAt: new Date().toISOString(),
      students: this.getRegisteredStudents(),
      teachers: this.getTeacherAccounts()
    };
    return JSON.stringify(db, null, 2);
  },

  importDatabaseJson(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.students)) {
        localStorage.setItem(STORAGE_KEYS.STUDENT_ACCOUNTS, JSON.stringify(data.students));
      }
      if (Array.isArray(data.teachers)) {
        localStorage.setItem(STORAGE_KEYS.TEACHER_ACCOUNTS, JSON.stringify(data.teachers));
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // ==========================================
  // Teacher Accounts (Personalized & Admin Managed)
  // ==========================================
  getTeacherAccounts() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEACHER_ACCOUNTS);
      if (data) return JSON.parse(data);
    } catch (e) {}

    // Initial default personalized teacher accounts
    const seed = [
      {
        id: 'TCH_1',
        name: 'Sarah Jenkins',
        username: 'sarah.j',
        password: 'teacher123',
        specialization: 'ESL Digital Literacy Specialist',
        createdAt: new Date().toISOString()
      },
      {
        id: 'TCH_2',
        name: 'Marc Tremblay',
        username: 'marc.t',
        password: 'teacher456',
        specialization: 'Computer Skills & Canadian Integration',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.TEACHER_ACCOUNTS, JSON.stringify(seed));
    return seed;
  },

  saveTeacherAccounts(list) {
    localStorage.setItem(STORAGE_KEYS.TEACHER_ACCOUNTS, JSON.stringify(list));
  },

  createTeacherAccount(teacherData) {
    const list = this.getTeacherAccounts();
    const cleanUser = (teacherData.username || '').trim().toLowerCase();
    const cleanName = (teacherData.name || '').trim();
    const cleanPass = (teacherData.password || '').trim();

    if (!cleanName || !cleanUser || !cleanPass) {
      return { success: false, error: 'Name, Username, and Password are all required.' };
    }

    if (list.some(t => t.username.toLowerCase() === cleanUser)) {
      return { success: false, error: `A teacher with username "${cleanUser}" already exists.` };
    }

    const newTeacher = {
      id: 'TCH_' + Date.now(),
      name: cleanName,
      username: cleanUser,
      password: cleanPass,
      specialization: (teacherData.specialization || 'Literacy Instructor').trim(),
      createdAt: new Date().toISOString()
    };

    list.push(newTeacher);
    this.saveTeacherAccounts(list);
    return { success: true, teacher: newTeacher };
  },

  deleteTeacherAccount(id) {
    let list = this.getTeacherAccounts();
    list = list.filter(t => t.id !== id);
    this.saveTeacherAccounts(list);

    const active = this.getActiveTeacher();
    if (active && active.id === id) {
      this.logoutTeacher();
    }
    return list;
  },

  getActiveTeacher() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_TEACHER);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return null;
  },

  setActiveTeacher(teacherObj) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TEACHER, JSON.stringify(teacherObj));
    return teacherObj;
  },

  logoutTeacher() {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_TEACHER);
  },

  authenticateTeacher(loginIdentifier, password) {
    const cleanId = (loginIdentifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // Check against registered personalized teacher accounts
    const list = this.getTeacherAccounts();
    const found = list.find(t => 
      t.username.toLowerCase() === cleanId || 
      t.name.toLowerCase() === cleanId
    );

    if (found) {
      if (found.password === cleanPass) {
        this.setActiveTeacher(found);
        return { success: true, teacher: found };
      } else {
        return { success: false, error: 'Incorrect teacher password.' };
      }
    }

    // Fallback: master teacher PIN 1234
    if (cleanPass === '1234' || cleanId === '1234') {
      const fallbackTeacher = {
        id: 'TCH_MASTER',
        name: 'Lead Instructor',
        username: 'instructor',
        specialization: 'General Digital Literacy'
      };
      this.setActiveTeacher(fallbackTeacher);
      return { success: true, teacher: fallbackTeacher };
    }

    return { success: false, error: 'Teacher account not found. Please check your username or contact Administrator.' };
  },

  getCurrentUser() {
    const s = this.getActiveStudent();
    return s && s.isLoggedIn && s.nickname ? s.nickname : 'Guest Learner';
  },

  setCurrentUser(name) {
    const cleaned = (name || '').trim() || 'Student_01';
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, cleaned);
    const s = this.getActiveStudent();
    if (s) {
      s.nickname = cleaned;
      localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT, JSON.stringify(s));
    }
    return cleaned;
  },

  // Active Role: 'student' | 'teacher' | 'admin'
  getCurrentRole() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE) || 'student';
  },

  setCurrentRole(role) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, role);
  },

  // PIN codes
  getTeacherPin() {
    return '1234';
  },

  getAdminPin() {
    return '9999';
  },

  // Metrics & Quiz Attempts
  getAllMetrics() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.METRICS_LOGS);
      return data ? JSON.parse(data) : this.getSeedMetrics();
    } catch (e) {
      console.error('Failed to load metrics from storage', e);
      return [];
    }
  },

  getMetricsForStudent(studentName) {
    if (!studentName) return [];
    const clean = studentName.trim().toLowerCase();
    return this.getAllMetrics().filter(m => (m.studentName || '').trim().toLowerCase() === clean);
  },

  GOOGLE_SHEET_URL_DEFAULT: 'https://script.google.com/macros/s/AKfycby6obZ7Pd_SmruIZVn29bUEDpMRLcm3-1WVFMY7bzjTCso8rrtDdmSDdjJcgcyHRC-y/exec',

  getGoogleSheetUrl() {
    return localStorage.getItem('wp_google_sheet_url') || this.GOOGLE_SHEET_URL_DEFAULT;
  },

  setGoogleSheetUrl(url) {
    if (!url) {
      localStorage.removeItem('wp_google_sheet_url');
    } else {
      localStorage.setItem('wp_google_sheet_url', url.trim());
    }
  },

  async syncMetricToGoogleSheet(record) {
    const url = this.getGoogleSheetUrl();
    if (!url) return false;
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(record),
        mode: 'no-cors'
      });
      return true;
    } catch (err) {
      console.warn('Could not sync metric to Google Sheet:', err);
      return false;
    }
  },

  async fetchMetricsFromGoogleSheet() {
    const url = this.getGoogleSheetUrl();
    if (!url) return { success: false, error: 'No URL configured' };
    try {
      const res = await fetch(url, { redirect: 'follow' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const records = await res.json();
      if (Array.isArray(records)) {
        // 1. Synchronize registered students from cloud if available
        const studentSyncRecords = records
          .filter(r => r.moduleId === 'SYSTEM_ACCOUNTS' && Array.isArray(r.details))
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        if (studentSyncRecords.length > 0) {
          const latestStudents = studentSyncRecords[0].details;
          localStorage.setItem(STORAGE_KEYS.STUDENT_ACCOUNTS, JSON.stringify(latestStudents));
        }

        // 2. Synchronize metrics (excluding internal SYSTEM_ACCOUNTS sync records)
        const local = this.getAllMetrics();
        let addedCount = 0;
        records.forEach(remote => {
          if (!remote.studentName) return;
          if (remote.moduleId === 'SYSTEM_ACCOUNTS') return; // Do not display internal sync records in quiz logs

          const exists = local.some(l => 
            l.timestamp === remote.timestamp && 
            l.studentName === remote.studentName &&
            l.moduleId === remote.moduleId
          );
          if (!exists) {
            local.push({
              id: 'METRIC_SHEET_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
              ...remote
            });
            addedCount++;
          }
        });
        local.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        localStorage.setItem(STORAGE_KEYS.METRICS_LOGS, JSON.stringify(local));
        return { success: true, count: records.length, added: addedCount, records: local };
      }
      return { success: true, count: 0, added: 0, records: this.getAllMetrics() };
    } catch (err) {
      console.error('Failed to fetch from Google Sheet:', err);
      return { success: false, error: err.message };
    }
  },

  saveMetric(record) {
    const all = this.getAllMetrics();
    // Add unique ID and timestamp if not present
    const newRecord = {
      id: 'METRIC_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      ...record
    };
    all.unshift(newRecord);
    localStorage.setItem(STORAGE_KEYS.METRICS_LOGS, JSON.stringify(all));

    // Automatically sync to Google Sheet in the background
    this.syncMetricToGoogleSheet(newRecord);

    return newRecord;
  },

  deleteMetric(id) {
    let all = this.getAllMetrics();
    all = all.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.METRICS_LOGS, JSON.stringify(all));
    return all;
  },

  clearAllMetrics() {
    localStorage.setItem(STORAGE_KEYS.METRICS_LOGS, JSON.stringify([]));
  },

  // Seed sample data for demonstration so Admin dashboard looks populated immediately
  getSeedMetrics() {
    const seed = [
      {
        id: 'METRIC_SEED_1',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        studentName: 'Fatima Jama',
        moduleId: 'mod_mouse',
        moduleTitle: 'Mouse & Touchpad Basics',
        durationSeconds: 245,
        scorePercent: 100,
        correctCount: 4,
        totalQuestions: 4,
        status: 'PASSED',
        details: [
          { qId: 'q1', type: 'radio', prompt: 'Which button do you use for normal clicking?', userAnswer: 'Left Button', isCorrect: true, duration: 8 },
          { qId: 'q2', type: 'radio', prompt: 'How do you open an application icon on desktop?', userAnswer: 'Double Click (Two fast taps)', isCorrect: true, duration: 12 },
          { qId: 'q3', type: 'checkbox', prompt: 'Select ALL things you can do with a mouse:', userAnswer: ['Move cursor', 'Click links', 'Scroll page'], isCorrect: true, duration: 25 },
          { qId: 'q4', type: 'radio', prompt: 'What does the mouse scroll wheel do?', userAnswer: 'Moves the page up and down', isCorrect: true, duration: 15 }
        ]
      },
      {
        id: 'METRIC_SEED_2',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        studentName: 'Hassan Abdi',
        moduleId: 'mod_keyboard',
        moduleTitle: 'Keyboard & Typing Essentials',
        durationSeconds: 410,
        scorePercent: 75,
        correctCount: 3,
        totalQuestions: 4,
        status: 'PASSED',
        details: [
          { qId: 'q1', type: 'radio', prompt: 'Which key moves down to a new line or submits?', userAnswer: 'Enter / Return key', isCorrect: true, duration: 14 },
          { qId: 'q2', type: 'radio', prompt: 'How do you erase a letter if you made a mistake?', userAnswer: 'Backspace key', isCorrect: true, duration: 9 },
          { qId: 'q3', type: 'checkbox', prompt: 'Choose keys that help type CAPITAL letters:', userAnswer: ['Shift key', 'Caps Lock key'], isCorrect: true, duration: 32 },
          { qId: 'q4', type: 'radio', prompt: 'How does a Canadian Postal Code look?', userAnswer: '12345 (5 numbers only)', isCorrect: false, duration: 45 }
        ]
      }
    ];
    localStorage.setItem(STORAGE_KEYS.METRICS_LOGS, JSON.stringify(seed));
    return seed;
  }
};

if (typeof window !== 'undefined') {
  window.StorageService = StorageService;
}
