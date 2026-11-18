/**
 * WelcomePlace - Interactive Keyboard Typing Simulator
 * Inspired by Stamina, TypingClub, and Keybr.
 * Tailored for Canadian newcomers learning digital literacy.
 *
 * Features:
 *  - Interactive QWERTY keyboard with tactile F/J markers
 *  - Real-time key highlight & finger recommendation
 *  - Audio feedback via Web Audio API (zero external files)
 *  - Live WPM, CPM, Accuracy %, and Error counting
 *  - Canadian newcomer lessons (Home row, Common words, Shift/Capitals, Emergency numbers, Postal codes)
 *  - Offline .txt report generation & StorageService integration
 */

const TypingTrainer = {
  activeLessonIndex: 0,
  targetText: '',
  currentIndex: 0,
  mistakes: 0,
  totalKeystrokes: 0,
  startTime: null,
  timerInterval: null,
  elapsedSeconds: 0,
  soundEnabled: true,
  audioCtx: null,
  isFinished: false,
  isFullscreen: false,
  boundKeyHandler: null,
  autoAdvanceTimer: null,
  autoAdvanceInterval: null,

  lessons: [
    {
      id: 'lesson_home_row',
      title: '1. Home Row Basics',
      description: 'Master the anchor keys: A S D F (left hand) and J K L ; (right hand)',
      fingerFocus: 'Rest your index fingers on F and J bumps!',
      text: 'asdf jkl; asdf jkl; a s d f j k l ; ff jj dd kk ss ll aa ;; asdf jkl;'
    },
    {
      id: 'lesson_extended_home',
      title: '2. Extended Home Row (G & H)',
      description: 'Reach inward with index fingers to type G and H',
      fingerFocus: 'Left index reaches for G, right index reaches for H',
      text: 'fg hj asdfg hjkl; gaga haha flag flash glad half fall salad dash glass'
    },
    {
      id: 'lesson_top_row',
      title: '3. Top Row Vowels & Keys',
      description: 'Reach up to type E, R, T, U, I, O, P',
      fingerFocus: 'Keep thumbs rested lightly on the spacebar',
      text: 'are you out top trip root port part step tree wire write true power quite'
    },
    {
      id: 'lesson_bottom_row',
      title: '4. Bottom Row Keys',
      description: 'Reach down to type Z, X, C, V, B, N, M',
      fingerFocus: 'Practice gentle downward taps with wrists steady',
      text: 'can man box van car bank cab main zoom back map milk name calm book'
    },
    {
      id: 'lesson_canadian_words',
      title: '5. Everyday Canadian Words',
      description: 'Common vocabulary for newcomers navigating Canada',
      fingerFocus: 'Type smooth rhythms word by word',
      text: 'welcome canada hello please thank you library clinic school bus subway permit safe home'
    },
    {
      id: 'lesson_shift_capitals',
      title: '6. Shift Key & Proper Names',
      description: 'Use the Shift key for capital letters and cities',
      fingerFocus: 'Hold Opposite Shift: Right Shift for left hand letters, Left Shift for right hand',
      text: 'Canada Ottawa Ontario Toronto Montreal Vancouver Calgary Edmonton English French'
    },
    {
      id: 'lesson_emergency_numbers',
      title: '7. Numbers & Emergency Contacts',
      description: 'Crucial Canadian phone hotlines and numbers',
      fingerFocus: 'Look at the top number row guide',
      text: 'Call 911 in emergency. Dial 211 for community help. Call 311 for city services. 811 for health. 416-555-0199.'
    },
    {
      id: 'lesson_postal_codes',
      title: '8. Canadian Postal Codes & Email',
      description: 'Letter-Number-Letter Canadian postal format and email addresses',
      fingerFocus: 'Alternate between letters, numbers, and space bar',
      text: 'K1A 0B1 M5V 2T6 T2P 1J9 V6B 2W9 info@welcomeplace.ca www.canada.ca'
    }
  ],

  // Finger assignment map for standard QWERTY
  fingerMap: {
    '1': 'Left Pinky', 'q': 'Left Pinky', 'a': 'Left Pinky', 'z': 'Left Pinky', '`': 'Left Pinky', '~': 'Left Pinky', 'Q': 'Left Pinky', 'A': 'Left Pinky', 'Z': 'Left Pinky',
    '2': 'Left Ring', 'w': 'Left Ring', 's': 'Left Ring', 'x': 'Left Ring', '@': 'Left Ring', 'W': 'Left Ring', 'S': 'Left Ring', 'X': 'Left Ring',
    '3': 'Left Middle', 'e': 'Left Middle', 'd': 'Left Middle', 'c': 'Left Middle', '#': 'Left Middle', 'E': 'Left Middle', 'D': 'Left Middle', 'C': 'Left Middle',
    '4': 'Left Index', 'r': 'Left Index', 'f': 'Left Index', 'v': 'Left Index', '$': 'Left Index', 'R': 'Left Index', 'F': 'Left Index', 'V': 'Left Index',
    '5': 'Left Index', 't': 'Left Index', 'g': 'Left Index', 'b': 'Left Index', '%': 'Left Index', 'T': 'Left Index', 'G': 'Left Index', 'B': 'Left Index',
    '6': 'Right Index', 'y': 'Right Index', 'h': 'Right Index', 'n': 'Right Index', '^': 'Right Index', 'Y': 'Right Index', 'H': 'Right Index', 'N': 'Right Index',
    '7': 'Right Index', 'u': 'Right Index', 'j': 'Right Index', 'm': 'Right Index', '&': 'Right Index', 'U': 'Right Index', 'J': 'Right Index', 'M': 'Right Index',
    '8': 'Right Middle', 'i': 'Right Middle', 'k': 'Right Middle', ',': 'Right Middle', '*': 'Right Middle', 'I': 'Right Middle', 'K': 'Right Middle', '<': 'Right Middle',
    '9': 'Right Ring', 'o': 'Right Ring', 'l': 'Right Ring', '.': 'Right Ring', '(': 'Right Ring', 'O': 'Right Ring', 'L': 'Right Ring', '>': 'Right Ring',
    '0': 'Right Pinky', 'p': 'Right Pinky', ';': 'Right Pinky', '/': 'Right Pinky', ')': 'Right Pinky', 'P': 'Right Pinky', ':': 'Right Pinky', '?': 'Right Pinky',
    '-': 'Right Pinky', '_': 'Right Pinky', '=': 'Right Pinky', '+': 'Right Pinky', '[': 'Right Pinky', '{': 'Right Pinky', ']': 'Right Pinky', '}': 'Right Pinky',
    '\'': 'Right Pinky', '"': 'Right Pinky',
    ' ': 'Thumb (Left or Right)'
  },

  init(containerElement, lessonIndex = 0) {
    this.cleanup();
    this.activeLessonIndex = lessonIndex;
    const lesson = this.lessons[this.activeLessonIndex] || this.lessons[0];
    this.targetText = lesson.text;
    this.currentIndex = 0;
    this.mistakes = 0;
    this.totalKeystrokes = 0;
    this.elapsedSeconds = 0;
    this.startTime = null;
    this.isFinished = false;

    this.renderSimulator(containerElement);
    this.setupListeners();
  },

  cleanup() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.autoAdvanceTimer) {
      clearTimeout(this.autoAdvanceTimer);
      this.autoAdvanceTimer = null;
    }
    if (this.autoAdvanceInterval) {
      clearInterval(this.autoAdvanceInterval);
      this.autoAdvanceInterval = null;
    }
    if (this.boundKeyHandler) {
      window.removeEventListener('keydown', this.boundKeyHandler);
      this.boundKeyHandler = null;
    }
  },

  cleanupTimers() {
    if (this.autoAdvanceTimer) {
      clearTimeout(this.autoAdvanceTimer);
      this.autoAdvanceTimer = null;
    }
    if (this.autoAdvanceInterval) {
      clearInterval(this.autoAdvanceInterval);
      this.autoAdvanceInterval = null;
    }
  },

  nextLesson() {
    this.cleanupTimers();
    if (this.activeLessonIndex < this.lessons.length - 1) {
      this.init(null, this.activeLessonIndex + 1);
    }
  },

  toggleFullscreen() {
    if (this.isFullscreen) this.exitFullscreen();
    else this.enterFullscreen();
  },

  enterFullscreen() {
    this.isFullscreen = true;
    this.syncFullscreenUI();
    if (typeof document !== 'undefined' && document.documentElement && document.documentElement.requestFullscreen && !document.fullscreenElement) {
      try {
        const res = document.documentElement.requestFullscreen();
        if (res && res.catch) res.catch(() => {});
      } catch (e) {}
    }
  },

  exitFullscreen() {
    this.isFullscreen = false;
    this.syncFullscreenUI();
    if (typeof document !== 'undefined' && document.fullscreenElement && document.exitFullscreen) {
      try {
        const res = document.exitFullscreen();
        if (res && res.catch) res.catch(() => {});
      } catch (e) {}
    }
  },

  syncFullscreenUI() {
    if (typeof document === 'undefined') return;
    const root = document.getElementById('typing-lab-root');
    const btn = document.getElementById('typing-fullscreen-btn');
    if (root) root.classList.toggle('lab-fullscreen-active', this.isFullscreen);
    if (document.body && document.body.classList) {
      document.body.classList.toggle('lab-body-fullscreen', this.isFullscreen);
    }
    if (btn) {
      btn.classList.toggle('is-active', this.isFullscreen);
      btn.innerHTML = this.isFullscreen ? '⤓ Exit Fullscreen' : '⛶ Fullscreen';
      btn.setAttribute('aria-pressed', this.isFullscreen ? 'true' : 'false');
    }
  },

  exitLab() {
    this.exitFullscreen();
    this.cleanup();
    this.containerEl = null;
    if (typeof App !== 'undefined') {
      App.activeLab = null;
      App.renderModulesList();
    }
  },

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    const btn = document.getElementById('typing-sound-btn');
    if (btn) {
      btn.innerHTML = this.soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
      btn.classList.toggle('active', this.soundEnabled);
    }
  },

  getFingerName(char) {
    if (char === ' ') return 'Thumbs (Space)';
    const lower = char.toLowerCase();
    const map = {
      // Left pinky
      '1': 'Left Pinky', '!': 'Left Pinky', 'q': 'Left Pinky', 'a': 'Left Pinky', 'z': 'Left Pinky', '`': 'Left Pinky', '~': 'Left Pinky',
      // Left ring
      '2': 'Left Ring', '@': 'Left Ring', 'w': 'Left Ring', 's': 'Left Ring', 'x': 'Left Ring',
      // Left middle
      '3': 'Left Middle', '#': 'Left Middle', 'e': 'Left Middle', 'd': 'Left Middle', 'c': 'Left Middle',
      // Left index
      '4': 'Left Index', '$': 'Left Index', '5': 'Left Index', '%': 'Left Index',
      'r': 'Left Index', 't': 'Left Index', 'f': 'Left Index (Anchor •)', 'g': 'Left Index', 'v': 'Left Index', 'b': 'Left Index',
      // Right index
      '6': 'Right Index', '^': 'Right Index', '7': 'Right Index', '&': 'Right Index',
      'y': 'Right Index', 'u': 'Right Index', 'h': 'Right Index', 'j': 'Right Index (Anchor •)', 'n': 'Right Index', 'm': 'Right Index',
      // Right middle
      '8': 'Right Middle', '*': 'Right Middle', 'i': 'Right Middle', 'k': 'Right Middle', ',': 'Right Middle', '<': 'Right Middle',
      // Right ring
      '9': 'Right Ring', '(': 'Right Ring', 'o': 'Right Ring', 'l': 'Right Ring', '.': 'Right Ring', '>': 'Right Ring',
      // Right pinky
      '0': 'Right Pinky', ')': 'Right Pinky', '-': 'Right Pinky', '_': 'Right Pinky', '=': 'Right Pinky', '+': 'Right Pinky',
      'p': 'Right Pinky', '[': 'Right Pinky', '{': 'Right Pinky', ']': 'Right Pinky', '}': 'Right Pinky',
      ';': 'Right Pinky', ':': 'Right Pinky', '\'': 'Right Pinky', '"': 'Right Pinky', '/': 'Right Pinky', '?': 'Right Pinky'
    };
    return map[lower] || 'Index Finger';
  },


  playKeySound(isError = false) {
    if (!this.soundEnabled) return;
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      if (isError) {
        // Soft error buzz
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.12);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.12);
      } else {
        // Crisp typewriter mechanical click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.05);
      }
    } catch {
      // Audio fallback silent
    }
  },

  startTimer() {
    if (this.timerInterval) return;
    this.startTime = Date.now();
    this.timerInterval = setInterval(() => {
      this.elapsedSeconds = Math.max(1, Math.floor((Date.now() - this.startTime) / 1000));
      this.updateStatsUI();
    }, 1000);
  },

  updateStatsUI() {
    const wpmEl = document.getElementById('typing-wpm');
    const accEl = document.getElementById('typing-acc');
    const timeEl = document.getElementById('typing-time');
    const mistakesEl = document.getElementById('typing-mistakes');
    const progressEl = document.getElementById('typing-progress-bar');

    const accuracy = this.calculateAccuracy();
    const wpm = this.calculateWpm();

    if (wpmEl) wpmEl.textContent = `${wpm} WPM`;
    if (accEl) accEl.textContent = `${accuracy}% Acc`;
    if (mistakesEl) mistakesEl.textContent = `❌ ${this.mistakes} errors`;
    if (timeEl) {
      const m = Math.floor(this.elapsedSeconds / 60);
      const s = this.elapsedSeconds % 60;
      timeEl.textContent = `⏱️ ${m}:${s < 10 ? '0' : ''}${s}`;
    }
    if (progressEl) {
      const pct = Math.round((this.currentIndex / this.targetText.length) * 100);
      progressEl.style.width = `${pct}%`;
    }
  },

  calculateWpm() {
    if (this.elapsedSeconds <= 0) return 0;
    const minutes = this.elapsedSeconds / 60;
    const wordsTyped = this.currentIndex / 5;
    return Math.round(wordsTyped / minutes) || 0;
  },

  calculateAccuracy() {
    if (this.totalKeystrokes === 0) return 100;
    const acc = Math.round(((this.totalKeystrokes - this.mistakes) / this.totalKeystrokes) * 100);
    return Math.max(0, Math.min(100, acc));
  },

  setupListeners() {
    this.boundKeyHandler = (e) => this.handleKeyDown(e);
    window.addEventListener('keydown', this.boundKeyHandler);
  },

  handleKeyDown(e) {
    if (e.key === 'Escape') {
      if (this.isFullscreen) this.exitFullscreen();
      return;
    }

    if (this.isFinished) return;

    // Ignore modifier keys by themselves
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) {
      this.highlightPhysicalKey(e.code, true);
      setTimeout(() => this.highlightPhysicalKey(e.code, false), 150);
      return;
    }

    // Prevent default scroll on Space
    if (e.key === ' ') {
      e.preventDefault();
    }

    if (!this.startTime) {
      this.startTimer();
    }

    this.totalKeystrokes++;
    const expectedChar = this.targetText[this.currentIndex];

    // Visual flash of the key on keyboard
    this.highlightPhysicalKey(e.code, true);
    setTimeout(() => this.highlightPhysicalKey(e.code, false), 150);

    if (e.key === expectedChar) {
      // Correct!
      this.playKeySound(false);
      this.currentIndex++;
      this.renderPromptText();
      this.updateActiveKeyHighlight();
      this.updateStatsUI();

      if (this.currentIndex >= this.targetText.length) {
        this.finishLesson();
      }
    } else {
      // Mistake
      this.mistakes++;
      this.playKeySound(true);
      this.flashWrongKey(e.code);
      this.updateStatsUI();
    }
  },

  highlightPhysicalKey(code, isActive) {
    const keyEl = document.querySelector(`.v-key[data-code="${code}"]`);
    if (keyEl) {
      if (isActive) keyEl.classList.add('v-key-pressed');
      else keyEl.classList.remove('v-key-pressed');
    }
  },

  flashWrongKey(code) {
    const promptBox = document.getElementById('typing-prompt-box');
    if (promptBox) {
      promptBox.classList.add('prompt-shake-error');
      setTimeout(() => promptBox.classList.remove('prompt-shake-error'), 250);
    }
    const keyEl = document.querySelector(`.v-key[data-code="${code}"]`);
    if (keyEl) {
      keyEl.classList.add('v-key-wrong');
      setTimeout(() => keyEl.classList.remove('v-key-wrong'), 300);
    }
  },

  finishLesson() {
    this.isFinished = true;
    if (this.timerInterval) clearInterval(this.timerInterval);

    const duration = Math.max(1, this.elapsedSeconds);
    const accuracy = this.calculateAccuracy();
    const wpm = this.calculateWpm();
    const activeStudent = StorageService.getActiveStudent();
    const activeTeacher = StorageService.getActiveTeacher ? StorageService.getActiveTeacher() : null;
    const studentName = activeStudent
      ? (activeStudent.nickname || 'Student')
      : (activeTeacher ? `${activeTeacher.name} (Instructor)` : 'Student');
    const avatarId = (activeStudent && activeStudent.avatarId) ? activeStudent.avatarId : 'avatar_hijab_teal';
    const lesson = this.lessons[this.activeLessonIndex];

    // Record Metric
    const metricRecord = {
      studentName: studentName,
      avatarId: avatarId,
      moduleId: `lab_typing_${lesson.id}`,
      moduleCode: 'LAB_KEYBOARD_STAMINA',
      moduleTitle: `Keyboard Lab: ${lesson.title}`,
      durationSeconds: duration,
      scorePercent: accuracy,
      correctCount: this.currentIndex,
      totalQuestions: this.totalKeystrokes,
      status: accuracy >= 70 ? 'PASSED' : 'NEEDS_PRACTICE',
      details: [
        { qId: 'wpm', type: 'speed', prompt: 'Typing Speed', userAnswer: `${wpm} WPM`, isCorrect: true },
        { qId: 'acc', type: 'precision', prompt: 'Keystroke Accuracy', userAnswer: `${accuracy}%`, isCorrect: accuracy >= 70 },
        { qId: 'err', type: 'errors', prompt: 'Mistakes Count', userAnswer: `${this.mistakes} errors`, isCorrect: this.mistakes < 10 },
        { qId: 'keys', type: 'volume', prompt: 'Total Keystrokes', userAnswer: `${this.totalKeystrokes} keys`, isCorrect: true }
      ]
    };

    // Silently save metrics for Administrator & Instructor review
    StorageService.saveMetric(metricRecord);

    // Render completion celebration
    const container = document.getElementById('typing-simulator-container');
    if (container) {
      container.innerHTML = `
        <div class="quiz-results-banner">
          <div class="results-icon-celebration">🎉 ⌨️ 🌟</div>
          <h2>Congratulations, ${studentName}!</h2>
          <p class="results-lead">🌟 You completed: ${lesson.title}!</p>

          <div class="typing-results-grid">
            <div class="typing-result-metric">
              <div class="typing-result-label">SPEED</div>
              <div class="typing-result-val">${wpm} <span class="text-sm">WPM</span></div>
            </div>
            <div class="typing-result-metric">
              <div class="typing-result-label">ACCURACY</div>
              <div class="typing-result-val ${accuracy >= 85 ? 'score-pass' : 'score-fail'}">${accuracy}%</div>
            </div>
            <div class="typing-result-metric">
              <div class="typing-result-label">TIME</div>
              <div class="typing-result-val">${duration}s</div>
            </div>
          </div>

          <div class="results-score-badge ${accuracy >= 70 ? 'passed' : 'failed'}">
            ${accuracy >= 70 ? '🎉 Excellent Muscle Memory & Rhythm!' : '⚠️ Good effort! Try once more for higher accuracy!'}
          </div>

          ${this.activeLessonIndex < this.lessons.length - 1 ? `
            <div class="auto-advance-badge" id="typing-auto-advance-badge">
              <span>⏳ Switching to next lesson in <strong id="typing-countdown-display">2</strong>s...</span>
            </div>
          ` : ''}

          <div class="results-actions">
            ${this.activeLessonIndex < this.lessons.length - 1 ? `
              <button class="btn-primary is-success" onclick="TypingTrainer.nextLesson()">
                <span>Next Lesson (${this.activeLessonIndex + 2}) ➜</span>
              </button>
            ` : ''}
            <button class="btn-secondary" onclick="TypingTrainer.init(null, ${this.activeLessonIndex})">
              <span>🔄 Retry Lesson</span>
            </button>
            <button class="btn-secondary" onclick="TypingTrainer.exitLab()">
              <span>← Return to Curriculum</span>
            </button>
          </div>
        </div>
      `;

      if (this.activeLessonIndex < this.lessons.length - 1) {
        let countdown = 2;
        this.autoAdvanceInterval = setInterval(() => {
          countdown--;
          const el = document.getElementById('typing-countdown-display');
          if (el) el.textContent = countdown;
          if (countdown <= 0) {
            if (this.autoAdvanceInterval) {
              clearInterval(this.autoAdvanceInterval);
              this.autoAdvanceInterval = null;
            }
          }
        }, 1000);

        this.autoAdvanceTimer = setTimeout(() => {
          this.nextLesson();
        }, 2200);
      }
    }
  },

  renderSimulator(container) {
    const parent = container || this.containerEl || document.getElementById('lesson-content-viewport') || document.getElementById('app-main-content');
    if (!parent) return;
    this.containerEl = parent;

    const lesson = this.lessons[this.activeLessonIndex];

    parent.innerHTML = `
      <div id="typing-lab-root" class="typing-lab-wrapper ${this.isFullscreen ? 'lab-fullscreen-active' : ''}">
        <!-- Studio Command Header -->
        <div class="lab-header-banner">
          <div class="lab-header-main">
            <div class="lab-eyebrow-row">
              <span class="lab-studio-badge">⌨️ Keyboard Typing Studio • 8 Lessons</span>
              <span class="lab-track-meta">${lesson.fingerFocus || 'Stamina & Keybr Inspired'}</span>
            </div>
            <h2 class="lab-header-title">
              <span>${lesson.title}</span>
            </h2>
            <p class="lab-header-objective">
              ${lesson.description}
            </p>
          </div>

          <div class="lab-actions-group">
            <button id="typing-sound-btn" class="btn-secondary btn-sm" onclick="TypingTrainer.toggleSound()">
              ${this.soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF'}
            </button>
            <button class="btn-secondary btn-sm" onclick="TypingTrainer.init(null, ${this.activeLessonIndex})">
              🔄 Reset
            </button>
            <button
              id="typing-fullscreen-btn"
              type="button"
              class="btn-secondary btn-sm btn-fullscreen-lab ${this.isFullscreen ? 'is-active' : ''}"
              aria-pressed="${this.isFullscreen ? 'true' : 'false'}"
              onclick="TypingTrainer.toggleFullscreen()"
            >
              ${this.isFullscreen ? '⤓ Exit Fullscreen' : '⛶ Fullscreen'}
            </button>
            <button class="btn-secondary btn-sm" onclick="TypingTrainer.exitLab()">
              ✕ Exit Lab
            </button>
          </div>
        </div>

        <!-- Lesson Selector Stepper -->
        <div class="typing-lesson-pills-bar">
          ${this.lessons.map((l, idx) => `
            <button class="lesson-pill-btn ${idx === this.activeLessonIndex ? 'active' : ''}" onclick="TypingTrainer.init(null, ${idx})">
              <span class="lesson-pill-num">0${idx + 1}</span>
              <span>${l.title.split('. ')[1] || l.title}</span>
            </button>
          `).join('')}
        </div>

        <!-- Live Telemetry HUD Bar -->
        <div class="typing-stats-bar">
          <div class="stat-pill" id="typing-wpm">0 WPM</div>
          <div class="stat-pill" id="typing-acc">100% Acc</div>
          <div class="stat-pill" id="typing-mistakes">❌ 0 errors</div>
          <div class="stat-pill" id="typing-time">⏱️ 0:00</div>
          <div class="typing-finger-hint" id="typing-finger-hint">
            <span>🖐️ Next Finger:</span>
            <strong id="finger-name-display">-</strong>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="typing-progress-track">
          <div class="typing-progress-fill" id="typing-progress-bar" style="width: 0%;"></div>
        </div>

        <!-- Interactive Simulator Core -->
        <div id="typing-simulator-container" class="typing-simulator-card">
          <!-- Text Prompt Display -->
          <div class="typing-prompt-wrapper" id="typing-prompt-box">
            <div id="typing-prompt-inner" class="typing-prompt-inner">
              <!-- Dynamically populated -->
            </div>
          </div>

          <!-- Virtual Keyboard Display -->
          <div class="virtual-keyboard-container">
            ${this.renderVirtualKeyboardHtml()}
          </div>
        </div>
      </div>
    `;

    this.syncFullscreenUI();
    this.renderPromptText();
    this.updateActiveKeyHighlight();
    this.updateStatsUI();
  },

  renderPromptText() {
    const inner = document.getElementById('typing-prompt-inner');
    if (!inner) return;

    let html = '';
    for (let i = 0; i < this.targetText.length; i++) {
      const char = this.targetText[i];
      const displayChar = char === ' '
        ? (i === this.currentIndex ? '␣' : '&nbsp;')
        : char;

      if (i < this.currentIndex) {
        html += `<span class="t-char t-char-correct">${displayChar}</span>`;
      } else if (i === this.currentIndex) {
        html += `<span class="t-char t-char-current">${displayChar}</span>`;
      } else {
        html += `<span class="t-char t-char-pending">${displayChar}</span>`;
      }
    }
    inner.innerHTML = html;
  },

  updateActiveKeyHighlight() {
    // 1. Remove keyboard highlights
    document.querySelectorAll('.v-key-target').forEach(el => el.classList.remove('v-key-target'));
    document.querySelectorAll('.v-key-shift-required').forEach(el => el.classList.remove('v-key-shift-required'));

    if (this.currentIndex >= this.targetText.length) return;

    const char = this.targetText[this.currentIndex];
    const fingerName = this.getFingerName(char);

    // 2. Update top live metrics strip
    const fingerDisplay = document.getElementById('finger-name-display');
    if (fingerDisplay) {
      fingerDisplay.textContent = fingerName;
    }

    // 3. Highlight virtual keyboard target key & shift key if needed
    const keyInfo = this.charToKeyCode(char);
    if (keyInfo.code) {
      const keyEl = document.querySelector(`.v-key[data-code="${keyInfo.code}"]`);
      if (keyEl) keyEl.classList.add('v-key-target');
    }
    if (keyInfo.needsShift) {
      const shiftCode = keyInfo.isRightHand ? 'ShiftLeft' : 'ShiftRight';
      const shiftEl = document.querySelector(`.v-key[data-code="${shiftCode}"]`);
      if (shiftEl) shiftEl.classList.add('v-key-shift-required');
    }
  },

  charToKeyCode(char) {
    if (char === ' ') return { code: 'Space', needsShift: false, isRightHand: false };

    // Digits
    if (char >= '0' && char <= '9') {
      const isRight = parseInt(char, 10) >= 6 || char === '0';
      return { code: `Digit${char}`, needsShift: false, isRightHand: isRight };
    }

    // Uppercase letters
    if (char >= 'A' && char <= 'Z') {
      const lower = char.toLowerCase();
      const isRight = 'yuiophjklbnm'.includes(lower);
      return { code: `Key${char}`, needsShift: true, isRightHand: isRight };
    }

    // Lowercase letters
    if (char >= 'a' && char <= 'z') {
      const upper = char.toUpperCase();
      const isRight = 'yuiophjklbnm'.includes(char);
      return { code: `Key${upper}`, needsShift: false, isRightHand: isRight };
    }

    // Symbols
    const symbolMap = {
      ';': { code: 'Semicolon', needsShift: false, isRightHand: true },
      ':': { code: 'Semicolon', needsShift: true, isRightHand: true },
      ',': { code: 'Comma', needsShift: false, isRightHand: true },
      '<': { code: 'Comma', needsShift: true, isRightHand: true },
      '.': { code: 'Period', needsShift: false, isRightHand: true },
      '>': { code: 'Period', needsShift: true, isRightHand: true },
      '/': { code: 'Slash', needsShift: false, isRightHand: true },
      '?': { code: 'Slash', needsShift: true, isRightHand: true },
      '-': { code: 'Minus', needsShift: false, isRightHand: true },
      '_': { code: 'Minus', needsShift: true, isRightHand: true },
      '=': { code: 'Equal', needsShift: false, isRightHand: true },
      '+': { code: 'Equal', needsShift: true, isRightHand: true },
      '\'': { code: 'Quote', needsShift: false, isRightHand: true },
      '"': { code: 'Quote', needsShift: true, isRightHand: true },
      '@': { code: 'Digit2', needsShift: true, isRightHand: false },
      '#': { code: 'Digit3', needsShift: true, isRightHand: false },
      '$': { code: 'Digit4', needsShift: true, isRightHand: false },
      '%': { code: 'Digit5', needsShift: true, isRightHand: false },
      '&': { code: 'Digit7', needsShift: true, isRightHand: true },
      '(': { code: 'Digit9', needsShift: true, isRightHand: true },
      ')': { code: 'Digit0', needsShift: true, isRightHand: true }
    };

    if (symbolMap[char]) return symbolMap[char];

    return { code: null, needsShift: false, isRightHand: false };
  },

  renderVirtualKeyboardHtml() {
    const rows = [
      // Row 1: Numbers & symbols
      [
        { code: 'Backquote', label: '~<br>`', finger: 'f-lp' },
        { code: 'Digit1', label: '!<br>1', finger: 'f-lp' },
        { code: 'Digit2', label: '@<br>2', finger: 'f-lr' },
        { code: 'Digit3', label: '#<br>3', finger: 'f-lm' },
        { code: 'Digit4', label: '$<br>4', finger: 'f-li' },
        { code: 'Digit5', label: '%<br>5', finger: 'f-li' },
        { code: 'Digit6', label: '^<br>6', finger: 'f-ri' },
        { code: 'Digit7', label: '&<br>7', finger: 'f-ri' },
        { code: 'Digit8', label: '*<br>8', finger: 'f-rm' },
        { code: 'Digit9', label: '(<br>9', finger: 'f-rr' },
        { code: 'Digit0', label: ')<br>0', finger: 'f-rp' },
        { code: 'Minus', label: '_<br>-', finger: 'f-rp' },
        { code: 'Equal', label: '+<br>=', finger: 'f-rp' },
        { code: 'Backspace', label: 'Backspace ⌫', width: 'v-key-wide-2', finger: 'f-rp' }
      ],
      // Row 2: QWERTY
      [
        { code: 'Tab', label: 'Tab ⇥', width: 'v-key-wide-1-5', finger: 'f-lp' },
        { code: 'KeyQ', label: 'Q', finger: 'f-lp' },
        { code: 'KeyW', label: 'W', finger: 'f-lr' },
        { code: 'KeyE', label: 'E', finger: 'f-lm' },
        { code: 'KeyR', label: 'R', finger: 'f-li' },
        { code: 'KeyT', label: 'T', finger: 'f-li' },
        { code: 'KeyY', label: 'Y', finger: 'f-ri' },
        { code: 'KeyU', label: 'U', finger: 'f-ri' },
        { code: 'KeyI', label: 'I', finger: 'f-rm' },
        { code: 'KeyO', label: 'O', finger: 'f-rr' },
        { code: 'KeyP', label: 'P', finger: 'f-rp' },
        { code: 'BracketLeft', label: '{<br>[', finger: 'f-rp' },
        { code: 'BracketRight', label: '}<br>]', finger: 'f-rp' },
        { code: 'Backslash', label: '|<br>\\', width: 'v-key-wide-1-5', finger: 'f-rp' }
      ],
      // Row 3: ASDF & Home row bumps
      [
        { code: 'CapsLock', label: 'Caps Lock', width: 'v-key-wide-1-75', finger: 'f-lp' },
        { code: 'KeyA', label: 'A', finger: 'f-lp' },
        { code: 'KeyS', label: 'S', finger: 'f-lr' },
        { code: 'KeyD', label: 'D', finger: 'f-lm' },
        { code: 'KeyF', label: 'F <span class="tactile-bump">•</span>', finger: 'f-li', tactile: true },
        { code: 'KeyG', label: 'G', finger: 'f-li' },
        { code: 'KeyH', label: 'H', finger: 'f-ri' },
        { code: 'KeyJ', label: 'J <span class="tactile-bump">•</span>', finger: 'f-ri', tactile: true },
        { code: 'KeyK', label: 'K', finger: 'f-rm' },
        { code: 'KeyL', label: 'L', finger: 'f-rr' },
        { code: 'Semicolon', label: ':<br>;', finger: 'f-rp' },
        { code: 'Quote', label: '"<br>\'', finger: 'f-rp' },
        { code: 'Enter', label: 'Enter ↵', width: 'v-key-wide-2-25', finger: 'f-rp' }
      ],
      // Row 4: ZXCVB & Shift
      [
        { code: 'ShiftLeft', label: 'Shift ⇧', width: 'v-key-wide-2-25', finger: 'f-lp' },
        { code: 'KeyZ', label: 'Z', finger: 'f-lp' },
        { code: 'KeyX', label: 'X', finger: 'f-lr' },
        { code: 'KeyC', label: 'C', finger: 'f-lm' },
        { code: 'KeyV', label: 'V', finger: 'f-li' },
        { code: 'KeyB', label: 'B', finger: 'f-li' },
        { code: 'KeyN', label: 'N', finger: 'f-ri' },
        { code: 'KeyM', label: 'M', finger: 'f-ri' },
        { code: 'Comma', label: '<<br>,', finger: 'f-rm' },
        { code: 'Period', label: '><br>.', finger: 'f-rr' },
        { code: 'Slash', label: '?<br>/', finger: 'f-rp' },
        { code: 'ShiftRight', label: 'Shift ⇧', width: 'v-key-wide-2-75', finger: 'f-rp' }
      ],
      // Row 5: Space
      [
        { code: 'ControlLeft', label: 'Ctrl', width: 'v-key-wide-1-5', finger: 'f-lp' },
        { code: 'AltLeft', label: 'Alt', width: 'v-key-wide-1-25', finger: 'f-thumb' },
        { code: 'Space', label: 'Space Bar', width: 'v-key-spacebar', finger: 'f-thumb' },
        { code: 'AltRight', label: 'Alt', width: 'v-key-wide-1-25', finger: 'f-thumb' },
        { code: 'ControlRight', label: 'Ctrl', width: 'v-key-wide-1-5', finger: 'f-rp' }
      ]
    ];

    return `
      <div class="v-keyboard">
        ${rows.map(row => `
          <div class="v-keyboard-row">
            ${row.map(k => `
              <div class="v-key ${k.width || ''} ${k.finger || ''} ${k.tactile ? 'v-key-tactile' : ''}" data-code="${k.code}">
                ${k.label}
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>

      <!-- Finger Color Legend -->
      <div class="v-keyboard-legend">
        <span class="legend-chip"><span class="legend-dot f-lp-bg"></span> L. Pinky (A)</span>
        <span class="legend-chip"><span class="legend-dot f-lr-bg"></span> L. Ring (S)</span>
        <span class="legend-chip"><span class="legend-dot f-lm-bg"></span> L. Middle (D)</span>
        <span class="legend-chip"><span class="legend-dot f-li-bg"></span> L. Index (F •)</span>
        <span class="legend-chip"><span class="legend-dot f-thumb-bg"></span> Thumbs (Space)</span>
        <span class="legend-chip"><span class="legend-dot f-ri-bg"></span> R. Index (J •)</span>
        <span class="legend-chip"><span class="legend-dot f-rm-bg"></span> R. Middle (K)</span>
        <span class="legend-chip"><span class="legend-dot f-rr-bg"></span> R. Ring (L)</span>
        <span class="legend-chip"><span class="legend-dot f-rp-bg"></span> R. Pinky (;)</span>
      </div>
    `;
  }
};

if (typeof window !== 'undefined') {
  window.TypingTrainer = TypingTrainer;
}

