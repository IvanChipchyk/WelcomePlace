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
    return null;
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

      // Persist student to Turso SQLite cloud database
      if (typeof SqliteService !== 'undefined') {
        SqliteService.saveStudent(studentObj).catch(err => {
          console.warn('Failed to save student to Turso SQLite:', err);
        });
      }
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
      if (typeof SqliteService !== 'undefined') {
        SqliteService.saveStudent(studentObj).catch(() => {});
      }
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
    return [];
  },

  logoutStudent() {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_STUDENT);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  deleteStudentAccount(nickname) {
    try {
      const clean = (nickname || '').toLowerCase().trim();
      let list = this.getRegisteredStudents();
      list = list.filter(s => (s.nickname || '').toLowerCase().trim() !== clean);
      localStorage.setItem(STORAGE_KEYS.STUDENT_ACCOUNTS, JSON.stringify(list));
      
      const active = this.getActiveStudent();
      if (active && (active.nickname || '').toLowerCase().trim() === clean) {
        this.logoutStudent();
      }

      // Also purge evaluation metrics for this deleted student
      try {
        const data = localStorage.getItem(STORAGE_KEYS.METRICS_LOGS);
        if (data) {
          const metrics = JSON.parse(data);
          const filtered = metrics.filter(m => {
            const mName = (m.studentName || '').toLowerCase().trim();
            return mName !== clean && !mName.startsWith(clean + ' ');
          });
          localStorage.setItem(STORAGE_KEYS.METRICS_LOGS, JSON.stringify(filtered));
        }
      } catch (err) {}

      // Also delete from Turso SQLite database
      if (typeof SqliteService !== 'undefined') {
        SqliteService.deleteStudent(clean).catch(() => {});
      }

      return list;
    } catch (e) {
      return [];
    }
  },

  // ==========================================
  // Turso SQLite Cloud Synchronization (Serverless SQLite)
  // ==========================================
  async syncWithSqlite() {
    if (typeof SqliteService === 'undefined') return false;

    try {
      const [students, teachers, metrics] = await Promise.all([
        SqliteService.fetchStudents(),
        SqliteService.fetchTeachers(),
        SqliteService.fetchMetrics()
      ]);

      if (Array.isArray(students)) {
        localStorage.setItem(STORAGE_KEYS.STUDENT_ACCOUNTS, JSON.stringify(students));
        
        // Keep active student profile in sync if currently logged in
        const active = this.getActiveStudent();
        if (active && active.isLoggedIn) {
          const match = students.find(s => s.nickname.toLowerCase() === active.nickname.toLowerCase());
          if (match) {
            localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT, JSON.stringify({
              ...active,
              avatarId: match.avatarId || active.avatarId,
              password: match.password || active.password
            }));
          }
        }
      }

      if (Array.isArray(teachers) && teachers.length > 0) {
        localStorage.setItem(STORAGE_KEYS.TEACHER_ACCOUNTS, JSON.stringify(teachers));
      }

      if (Array.isArray(metrics)) {
        localStorage.setItem(STORAGE_KEYS.METRICS_LOGS, JSON.stringify(metrics));
      }

      return true;
    } catch (err) {
      console.warn('Could not sync with Turso SQLite:', err);
      return false;
    }
  },

  exportDatabaseJson() {
    const db = {
      engine: 'Turso SQLite',
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      students: this.getRegisteredStudents(),
      teachers: this.getTeacherAccounts(),
      metrics: this.getAllMetrics()
    };
    return JSON.stringify(db, null, 2);
  },

  importDatabaseJson(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.students)) {
        localStorage.setItem(STORAGE_KEYS.STUDENT_ACCOUNTS, JSON.stringify(data.students));
        if (typeof SqliteService !== 'undefined') {
          data.students.forEach(s => SqliteService.saveStudent(s).catch(() => {}));
        }
      }
      if (Array.isArray(data.teachers)) {
        localStorage.setItem(STORAGE_KEYS.TEACHER_ACCOUNTS, JSON.stringify(data.teachers));
        if (typeof SqliteService !== 'undefined') {
          data.teachers.forEach(t => SqliteService.saveTeacher(t).catch(() => {}));
        }
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

    if (typeof SqliteService !== 'undefined') {
      SqliteService.saveTeacher(newTeacher).catch(() => {});
    }

    return { success: true, teacher: newTeacher };
  },

  deleteTeacherAccount(id) {
    let list = this.getTeacherAccounts();
    list = list.filter(t => t.id !== id);
    this.saveTeacherAccounts(list);

    if (typeof SqliteService !== 'undefined') {
      SqliteService.deleteTeacher(id).catch(() => {});
    }

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
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(m => m && !String(m.id || '').startsWith('METRIC_SEED_'));
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

    // Automatically sync to Turso SQLite database
    if (typeof SqliteService !== 'undefined') {
      SqliteService.saveMetric(newRecord).catch(err => {
        console.warn('Could not save metric to SQLite:', err);
      });
    }

    return newRecord;
  },

  deleteMetric(id) {
    let all = this.getAllMetrics();
    all = all.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.METRICS_LOGS, JSON.stringify(all));

    // Delete from Turso SQLite database
    if (typeof SqliteService !== 'undefined') {
      SqliteService.deleteMetric(id).catch(() => {});
    }
    return all;
  },

  clearAllMetrics() {
    localStorage.setItem(STORAGE_KEYS.METRICS_LOGS, JSON.stringify([]));

    // Clear all in Turso SQLite database
    if (typeof SqliteService !== 'undefined') {
      SqliteService.clearAllMetrics().catch(() => {});
    }
  }
};

if (typeof window !== 'undefined') {
  window.StorageService = StorageService;
}
