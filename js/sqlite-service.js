/**
 * WelcomePlace - Turso SQLite Client (Serverless Cloud SQLite)
 * High-performance, zero-maintenance database engine powered by LibSQL/SQLite.
 * Synchronizes accounts, teachers, and evaluation metrics in real time.
 */

const TURSO_CONFIG = {
  ENDPOINT: 'https://welcomeplace-benedict16.aws-ca-central-1.turso.io/v2/pipeline',
  TOKEN: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTMxNTUzMzUsImlkIjoiMDFhMTgwNjItNmEwMS03NGIwLWJiYTktYjI2YzNkNzE0NDAwIiwia2lkIjoiVDI4T09yVkFjU1I0SHgtRzZ2WlJzbDNURnFJaFpOVng4YTd2dUhrdXVFSSIsInJpZCI6ImY0MWFjZDZkLThhMWUtNDdlZS1hNWIwLTYzYTBlNjk2OTBhMyJ9.ymDrD31D7xh4vUk00c3MWSHMW88l0Od82qtaUBLYvXKdw-429aXo9XNm-AhujaORCRRpKr4wsLvQQTv2qoP3Bw'
};

const SqliteService = {
  async execute(sql, args = []) {
    try {
      const typedArgs = args.map(arg => {
        if (typeof arg === 'number') {
          return Number.isInteger(arg) 
            ? { type: 'integer', value: String(arg) } 
            : { type: 'float', value: arg };
        }
        if (arg === null || arg === undefined) {
          return { type: 'null' };
        }
        return { type: 'text', value: String(arg) };
      });

      const res = await fetch(TURSO_CONFIG.ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TURSO_CONFIG.TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requests: [
            { type: 'execute', stmt: { sql, args: typedArgs } }
          ]
        })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();
      const firstResult = data.results && data.results[0];
      if (!firstResult) return { rows: [], affectedRowCount: 0 };
      if (firstResult.type === 'error') {
        throw new Error(firstResult.error ? firstResult.error.message : 'SQLite Execution Error');
      }

      const execResult = firstResult.response.result;
      const cols = (execResult.cols || []).map(c => c.name);
      const rows = (execResult.rows || []).map(r => {
        const rowObj = {};
        r.forEach((cell, i) => {
          rowObj[cols[i]] = cell.type === 'null' ? null : cell.value;
        });
        return rowObj;
      });

      return {
        rows,
        affectedRowCount: execResult.affected_row_count || 0,
        lastInsertRowid: execResult.last_insert_rowid
      };
    } catch (err) {
      console.warn('Turso SQLite execute error:', err);
      return null;
    }
  },

  // ------------------------------------------
  // Student Accounts in SQLite
  // ------------------------------------------
  async fetchStudents() {
    const res = await this.execute(
      'SELECT nickname, password, avatar_id, created_at FROM students ORDER BY created_at DESC;'
    );
    if (!res) return null; // network offline, caller will use local cache
    return res.rows.map(r => ({
      nickname: r.nickname,
      password: r.password || '123',
      avatarId: r.avatar_id || 'avatar_hijab_teal',
      createdAt: r.created_at || new Date().toISOString()
    }));
  },

  async saveStudent(student) {
    if (!student || !student.nickname) return false;
    const nick = student.nickname.trim();
    const pass = (student.password || '123').trim();
    const avatar = student.avatarId || 'avatar_hijab_teal';
    const createdAt = student.createdAt || new Date().toISOString();

    const res = await this.execute(
      'INSERT INTO students (nickname, password, avatar_id, created_at) VALUES (?, ?, ?, ?) ' +
      'ON CONFLICT(nickname) DO UPDATE SET password = excluded.password, avatar_id = excluded.avatar_id;',
      [nick, pass, avatar, createdAt]
    );
    return !!res;
  },

  async deleteStudent(nickname) {
    if (!nickname) return false;
    const clean = nickname.trim();
    const res = await this.execute(
      'DELETE FROM students WHERE LOWER(nickname) = LOWER(?);',
      [clean]
    );
    // Also delete any metrics for this student
    await this.execute(
      'DELETE FROM metrics WHERE LOWER(student_name) = LOWER(?);',
      [clean]
    );
    return !!res;
  },

  // ------------------------------------------
  // Teacher Accounts in SQLite
  // ------------------------------------------
  async fetchTeachers() {
    const res = await this.execute(
      'SELECT id, name, username, password, specialization, created_at FROM teachers ORDER BY created_at ASC;'
    );
    if (!res) return null;
    return res.rows.map(r => ({
      id: r.id,
      name: r.name,
      username: r.username,
      password: r.password,
      specialization: r.specialization,
      createdAt: r.created_at
    }));
  },

  async saveTeacher(teacher) {
    if (!teacher || !teacher.username) return false;
    const res = await this.execute(
      'INSERT INTO teachers (id, name, username, password, specialization, created_at) VALUES (?, ?, ?, ?, ?, ?) ' +
      'ON CONFLICT(username) DO UPDATE SET name = excluded.name, password = excluded.password, specialization = excluded.specialization;',
      [
        teacher.id || ('TCH_' + Date.now()),
        teacher.name,
        teacher.username.trim(),
        teacher.password,
        teacher.specialization || 'ESL Digital Literacy Specialist',
        teacher.createdAt || new Date().toISOString()
      ]
    );
    return !!res;
  },

  async deleteTeacher(id) {
    if (!id) return false;
    const res = await this.execute('DELETE FROM teachers WHERE id = ?;', [id]);
    return !!res;
  },

  // ------------------------------------------
  // Evaluation Metrics in SQLite
  // ------------------------------------------
  async fetchMetrics() {
    const res = await this.execute(
      'SELECT id, student_name, module_id, module_title, module_code, score_percent, correct_count, total_questions, duration_seconds, status, details_json, timestamp ' +
      'FROM metrics ORDER BY timestamp DESC;'
    );
    if (!res) return null;
    return res.rows.map(r => {
      let details = [];
      try {
        if (r.details_json) details = JSON.parse(r.details_json);
      } catch (e) {}

      return {
        id: r.id,
        studentName: r.student_name,
        moduleId: r.module_id,
        moduleTitle: r.module_title,
        moduleCode: r.module_code,
        scorePercent: Number(r.score_percent) || 0,
        correctCount: Number(r.correct_count) || 0,
        totalQuestions: Number(r.total_questions) || 0,
        durationSeconds: Number(r.duration_seconds) || 0,
        status: r.status,
        details,
        timestamp: r.timestamp
      };
    });
  },

  async saveMetric(metric) {
    if (!metric) return false;
    const id = metric.id || ('METRIC_' + Date.now() + '_' + Math.floor(Math.random() * 1000));
    const studentName = metric.studentName || 'Student';
    const moduleId = metric.moduleId || 'module';
    const moduleTitle = metric.moduleTitle || 'Evaluation';
    const moduleCode = metric.moduleCode || '';
    const scorePercent = Number(metric.scorePercent) || 0;
    const correctCount = Number(metric.correctCount) || 0;
    const totalQuestions = Number(metric.totalQuestions) || 0;
    const durationSeconds = Number(metric.durationSeconds) || 0;
    const status = metric.status || (scorePercent >= 70 ? 'PASSED' : 'REVIEW');
    const detailsJson = JSON.stringify(metric.details || []);
    const timestamp = metric.timestamp || new Date().toISOString();

    const res = await this.execute(
      'INSERT INTO metrics (id, student_name, module_id, module_title, module_code, score_percent, correct_count, total_questions, duration_seconds, status, details_json, timestamp) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
      [
        id, studentName, moduleId, moduleTitle, moduleCode,
        scorePercent, correctCount, totalQuestions, durationSeconds,
        status, detailsJson, timestamp
      ]
    );
    return !!res;
  },

  async deleteMetric(id) {
    if (!id) return false;
    const res = await this.execute('DELETE FROM metrics WHERE id = ?;', [id]);
    return !!res;
  },

  async clearAllMetrics() {
    const res = await this.execute('DELETE FROM metrics;');
    return !!res;
  }
};

if (typeof window !== 'undefined') {
  window.SqliteService = SqliteService;
}
