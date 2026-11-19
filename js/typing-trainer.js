/**
 * WelcomePlace - TypingClub-Style Interactive Keyboard Typing Studio
 * Inspired by TypingClub.com (Typing Jungle):
 *  - Clean white prompt canvas with green / yellow-corrected / sky-cursor / coral-error highlights
 *  - White sculpted QWERTY keyboard with translucent anatomical SVG hands overlaid & reaching per key
 *  - 20 progressive lessons grouped into 5 Units (Home Row F/J -> Top -> Bottom -> Shift/Canada -> Numbers)
 *  - Lesson Map with persistent 5-star ratings, WPM & Platinum badges + Teacher-safe StorageService metrics
 */

const TypingTrainer = {
  activeLessonIndex: 0,
  targetText: '',
  currentIndex: 0,
  mistakes: 0,
  totalKeystrokes: 0,
  streak: 0,
  bestStreak: 0,
  startTime: null,
  timerInterval: null,
  elapsedSeconds: 0,
  soundEnabled: true,
  showHands: true,
  showKeyboard: true,
  viewMode: 'practice', // 'practice' | 'map'
  charStatuses: [],
  currentHasError: false,
  audioCtx: null,
  isFinished: false,
  isFullscreen: false,
  boundKeyHandler: null,
  autoAdvanceTimer: null,
  autoAdvanceInterval: null,
  containerEl: null,

  lessons: [
    // Unit 1: Home Row Foundations
    {
      id: 'tc_01_fj',
      unit: 'Unit 1 • Home Row Foundations',
      title: '1. Meet F & J',
      badge: 'Intro',
      keysBadge: 'f  j',
      keysList: ['F', 'J'],
      targetWpm: 15,
      description: 'Rest your index fingers on the tactile bumps on F and J',
      fingerFocus: 'Index fingers stay anchored on F • and J • bumps',
      text: 'fff jjj fjf jfj ff jj fj jf ff jj fjf jfj'
    },
    {
      id: 'tc_02_fj_space',
      unit: 'Unit 1 • Home Row Foundations',
      title: '2. F, J & Spacebar',
      badge: 'Practice',
      keysBadge: 'f  j  ␣',
      keysList: ['F', 'J', 'Space'],
      targetWpm: 18,
      description: 'Tap the spacebar lightly with your thumb between rhythms',
      fingerFocus: 'Keep your eyes on the screen and use either thumb for Space',
      text: 'f j f j ff jj fj jf fff jjj fjf jfj fj jf'
    },
    {
      id: 'tc_03_dk',
      unit: 'Unit 1 • Home Row Foundations',
      title: '3. Add D & K',
      badge: 'Intro',
      keysBadge: 'd  k',
      keysList: ['D', 'K'],
      targetWpm: 18,
      description: 'Introduce your middle fingers on D (left) and K (right)',
      fingerFocus: 'Left middle taps D, right middle taps K',
      text: 'ddd kkk dkd kdk dd kk df jk fd kj df jk dk kd'
    },
    {
      id: 'tc_04_review_fjdk',
      unit: 'Unit 1 • Home Row Foundations',
      title: '4. Review: F J D K',
      badge: 'Review',
      keysBadge: 'f j d k',
      keysList: ['D', 'F', 'J', 'K'],
      targetWpm: 20,
      description: 'Build smooth alternating coordination across F, J, D, and K',
      fingerFocus: 'Return gently to your home row resting keys',
      text: 'df jk fd kj dfjk kjfd ffdd jjkk dfj kjd fjdk'
    },
    {
      id: 'tc_05_sl',
      unit: 'Unit 1 • Home Row Foundations',
      title: '5. Add S & L',
      badge: 'Intro',
      keysBadge: 's  l',
      keysList: ['S', 'L'],
      targetWpm: 20,
      description: 'Train your ring fingers on S (left) and L (right)',
      fingerFocus: 'Left ring taps S, right ring taps L',
      text: 'sss lll sls lsl ss ll sd kl ds lk asdf jkl; sdlk'
    },
    {
      id: 'tc_06_review_sdfjkl',
      unit: 'Unit 1 • Home Row Foundations',
      title: '6. Review: S D F J K L',
      badge: 'Review',
      keysBadge: 's d f j k l',
      keysList: ['S', 'D', 'F', 'J', 'K', 'L'],
      targetWpm: 22,
      description: 'Combine six home row keys in steady rhythmic patterns',
      fingerFocus: 'Keep wrists relaxed and avoid looking down at your hands',
      text: 'sdf jkl fds lkj sdlk lkjf dsf jlk fls kjd'
    },
    {
      id: 'tc_07_a_semi',
      unit: 'Unit 1 • Home Row Foundations',
      title: '7. Add A & ;',
      badge: 'Intro',
      keysBadge: 'a  ;',
      keysList: ['A', ';'],
      targetWpm: 22,
      description: 'Activate your left and right pinky fingers on A and ;',
      fingerFocus: 'Pinkies rest on A and Semicolon (;)',
      text: 'aaa ;;; a;a ;a; aa ;; asdf jkl; ;lkj fdsa ask all fall'
    },
    {
      id: 'tc_08_home_mastery',
      unit: 'Unit 1 • Home Row Foundations',
      title: '8. Home Row Mastery',
      badge: 'Practice',
      keysBadge: 'a–;',
      keysList: ['A', 'S', 'D', 'F', 'J', 'K', 'L', ';'],
      targetWpm: 24,
      description: 'Type real words built strictly on the home row',
      fingerFocus: 'Keep all eight fingers gently curved on home row',
      text: 'as ask dad lad sad fall salad flask; a sad dad; all fall;'
    },
    {
      id: 'tc_09_gh',
      unit: 'Unit 1 • Home Row Foundations',
      title: '9. Reach for G & H',
      badge: 'Intro',
      keysBadge: 'g  h',
      keysList: ['G', 'H'],
      targetWpm: 24,
      description: 'Stretch your index fingers inward to hit G and H, then snap back',
      fingerFocus: 'Left index F->G, right index J->H',
      text: 'fgf jhj fg hj gh hg glad half flag dash sash hash ash'
    },
    {
      id: 'tc_10_home_sentences',
      unit: 'Unit 1 • Home Row Foundations',
      title: '10. Home Row Phrases',
      badge: 'Speed',
      keysBadge: 'a–; + gh',
      keysList: ['G', 'H', 'Home Row'],
      targetWpm: 25,
      description: 'Boost speed and rhythm across the full home row',
      fingerFocus: 'Light touches! Return index fingers to F and J anchors',
      text: 'a lad had a glass; glad dads ask half a flask; ash falls'
    },

    // Unit 2: Top Row Reach
    {
      id: 'tc_11_ei',
      unit: 'Unit 2 • Top Row Reach',
      title: '11. Top Row E & I',
      badge: 'Intro',
      keysBadge: 'e  i',
      keysList: ['E', 'I'],
      targetWpm: 25,
      description: 'Reach up with middle fingers from D->E and K->I',
      fingerFocus: 'Middle fingers reach straight up to E and I',
      text: 'ded kik de ki ei ie see side life file like desk sail'
    },
    {
      id: 'tc_12_ru',
      unit: 'Unit 2 • Top Row Reach',
      title: '12. Top Row R & U',
      badge: 'Intro',
      keysBadge: 'r  u',
      keysList: ['R', 'U'],
      targetWpm: 25,
      description: 'Reach up with index fingers from F->R and J->U',
      fingerFocus: 'Index fingers reach upward to R and U',
      text: 'frf juj fr ju ru ur fur sure rule user ride fire full'
    },
    {
      id: 'tc_13_ty',
      unit: 'Unit 2 • Top Row Reach',
      title: '13. Inner Reach T & Y',
      badge: 'Intro',
      keysBadge: 't  y',
      keysList: ['T', 'Y'],
      targetWpm: 26,
      description: 'Stretch index fingers up and inward for T and Y',
      fingerFocus: 'Left index reaches T, right index reaches Y',
      text: 'ftf jyj ft jy ty yt try yet day stay city east they that'
    },
    {
      id: 'tc_14_woqp',
      unit: 'Unit 2 • Top Row Reach',
      title: '14. Full Top Row (Q W O P)',
      badge: 'Intro',
      keysBadge: 'q w o p',
      keysList: ['Q', 'W', 'O', 'P'],
      targetWpm: 26,
      description: 'Use ring and pinky fingers for Q, W, O, and P',
      fingerFocus: 'Upper reaches for outer left and right fingers',
      text: 'work word port power quick quiet help people step write type'
    },

    // Unit 3: Bottom Row Keys
    {
      id: 'tc_15_cvbnm',
      unit: 'Unit 3 • Bottom Row Keys',
      title: '15. Bottom Row (C V B N M)',
      badge: 'Intro',
      keysBadge: 'c v b n m',
      keysList: ['C', 'V', 'B', 'N', 'M', ','],
      targetWpm: 26,
      description: 'Curved downward reaches to C, V, B, N, M, and Comma',
      fingerFocus: 'Curl downward without moving your whole wrist',
      text: 'can man van cab main calm name bank, come home, climb'
    },
    {
      id: 'tc_16_xz_punct',
      unit: 'Unit 3 • Bottom Row Keys',
      title: '16. X, Z, Period & Slash',
      badge: 'Review',
      keysBadge: 'z x . /',
      keysList: ['Z', 'X', '.', '/'],
      targetWpm: 28,
      description: 'Complete the entire alphabet plus period and slash',
      fingerFocus: 'Left pinky Z, left ring X, right ring period',
      text: 'zoom exact size box prize fix. max next zone. zero exit.'
    },

    // Unit 4: Canadian Words & Shift Capitals
    {
      id: 'tc_17_canadian_words',
      unit: 'Unit 4 • Everyday Canada & Shift',
      title: '17. Everyday Canadian Words',
      badge: 'Practice',
      keysBadge: 'a–z',
      keysList: ['All Letters', 'Space'],
      targetWpm: 28,
      description: 'Smooth flow typing common newcomer vocabulary',
      fingerFocus: 'Keep a steady beat between words and spaces',
      text: 'welcome canada hello please thank you library clinic school bus subway safe home'
    },
    {
      id: 'tc_18_shift_capitals',
      unit: 'Unit 4 • Everyday Canada & Shift',
      title: '18. Shift Key & Canadian Cities',
      badge: 'Shift',
      keysBadge: '⇧ A–Z',
      keysList: ['Left Shift', 'Right Shift'],
      targetWpm: 28,
      description: 'Hold the opposite pinky on Shift to capitalize Canadian cities',
      fingerFocus: 'Opposite Shift rule: Right Shift for left-hand letters, Left Shift for right-hand',
      text: 'Canada Ottawa Ontario Toronto Montreal Vancouver Calgary Edmonton English French'
    },

    // Unit 5: Numbers & Digital Life
    {
      id: 'tc_19_hotlines',
      unit: 'Unit 5 • Numbers & Digital Life',
      title: '19. Numbers & Canadian Hotlines',
      badge: 'Numbers',
      keysBadge: '911 / 211',
      keysList: ['1–9', '0', 'Period'],
      targetWpm: 26,
      description: 'Essential Canadian emergency and city support numbers',
      fingerFocus: 'Reach smoothly to the top number row and back to home row',
      text: 'Call 911 in emergency. Dial 211 for help. Call 311 for city services. 811 for health.'
    },
    {
      id: 'tc_20_postal_email',
      unit: 'Unit 5 • Numbers & Digital Life',
      title: '20. Postal Codes & Email',
      badge: 'Mastery',
      keysBadge: 'K1A 0B1',
      keysList: ['Shift', 'Digits', '@'],
      targetWpm: 28,
      description: 'Canadian Letter-Number-Letter postal formats and web addresses',
      fingerFocus: 'Coordinate Shift, digits, @ and dots with confidence',
      text: 'K1A 0B1 M5V 2T6 T2P 1J9 V6B 2W9 info@welcomeplace.ca www.canada.ca'
    }
  ],

  init(containerElement, lessonIdx = 0) {
    this.cleanup();
    const safeIdx = Math.max(0, Math.min(lessonIdx, this.lessons.length - 1));
    this.activeLessonIndex = safeIdx;
    this.viewMode = 'practice';
    this.targetText = this.lessons[safeIdx].text;
    this.charStatuses = new Array(this.targetText.length).fill('pending');
    this.currentHasError = false;
    this.currentIndex = 0;
    this.mistakes = 0;
    this.totalKeystrokes = 0;
    this.streak = 0;
    this.bestStreak = 0;
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
    this.cleanupTimers();
    if (this.boundKeyHandler && typeof window !== 'undefined' && window.removeEventListener) {
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

  openLessonMap() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.viewMode = 'map';
    this.renderSimulator(this.containerEl);
  },

  selectLesson(idx) {
    this.init(this.containerEl, idx);
  },

  toggleHands() {
    this.showHands = !this.showHands;
    const sim = document.getElementById('typing-simulator-container');
    const btn = document.getElementById('typing-hands-btn');
    if (sim) sim.classList.toggle('tc-hands-hidden', !this.showHands);
    if (btn) btn.classList.toggle('is-on', this.showHands);
  },

  toggleKeyboard() {
    this.showKeyboard = !this.showKeyboard;
    const sim = document.getElementById('typing-simulator-container');
    const btn = document.getElementById('typing-kbd-btn');
    if (sim) sim.classList.toggle('tc-kbd-hidden', !this.showKeyboard);
    if (btn) btn.classList.toggle('is-on', this.showKeyboard);
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
      btn.innerHTML = this.soundEnabled ? '🔊 Sound' : '🔇 Muted';
      btn.classList.toggle('is-on', this.soundEnabled);
    }
  },

  // ---------- Persistent 5-Star Course Progress ----------
  getProgressStorageKey() {
    const activeStudent = (typeof StorageService !== 'undefined' && StorageService.getActiveStudent)
      ? StorageService.getActiveStudent()
      : null;
    const activeTeacher = (typeof StorageService !== 'undefined' && StorageService.getActiveTeacher)
      ? StorageService.getActiveTeacher()
      : null;
    const owner = activeStudent
      ? `student_${activeStudent.nickname || 'default'}`
      : (activeTeacher ? `teacher_${activeTeacher.id || activeTeacher.name}` : 'guest');
    return `wp_typingclub_progress_${owner}`;
  },

  loadLessonProgress() {
    try {
      if (typeof localStorage === 'undefined') return {};
      const raw = localStorage.getItem(this.getProgressStorageKey());
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  },

  saveLessonProgress(lessonId, stars, wpm, accuracy, score) {
    try {
      if (typeof localStorage === 'undefined') return;
      const map = this.loadLessonProgress();
      const prev = map[lessonId] || {};
      map[lessonId] = {
        stars: Math.max(prev.stars || 0, stars),
        wpm: Math.max(prev.wpm || 0, wpm),
        accuracy: Math.max(prev.accuracy || 0, accuracy),
        score: Math.max(prev.score || 0, score),
        updatedAt: Date.now()
      };
      localStorage.setItem(this.getProgressStorageKey(), JSON.stringify(map));
    } catch {
      // Safe fallback when storage is unavailable
    }
  },

  calculateStars(wpm, accuracy) {
    const lesson = this.lessons[this.activeLessonIndex] || { targetWpm: 20 };
    const goal = lesson.targetWpm || 20;
    const platinum = accuracy === 100 && wpm >= goal;

    let stars = 1;
    if (accuracy >= 98 && wpm >= goal) stars = 5;
    else if (accuracy >= 94 && wpm >= Math.max(12, Math.floor(goal * 0.78))) stars = 4;
    else if (accuracy >= 88 && wpm >= Math.max(8, Math.floor(goal * 0.55))) stars = 3;
    else if (accuracy >= 75) stars = 2;

    const score = Math.max(100, Math.round(accuracy * 18 + wpm * 24 + this.bestStreak * 15 - this.mistakes * 20));
    return { stars, platinum, score };
  },

  renderStarsHtml(count) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      html += `<span class="${i <= count ? 'star-earned' : 'star-empty'}">★</span>`;
    }
    return html;
  },

  // ---------- Finger Assignment & Key Reach Helpers ----------
  getFingerName(char) {
    if (char === ' ') return 'Thumbs (Space)';
    const lower = char.toLowerCase();
    const map = {
      '1': 'Left Pinky', '!': 'Left Pinky', 'q': 'Left Pinky', 'a': 'Left Pinky', 'z': 'Left Pinky', '`': 'Left Pinky', '~': 'Left Pinky',
      '2': 'Left Ring', '@': 'Left Ring', 'w': 'Left Ring', 's': 'Left Ring', 'x': 'Left Ring',
      '3': 'Left Middle', '#': 'Left Middle', 'e': 'Left Middle', 'd': 'Left Middle', 'c': 'Left Middle',
      '4': 'Left Index', '$': 'Left Index', '5': 'Left Index', '%': 'Left Index',
      'r': 'Left Index', 't': 'Left Index', 'f': 'Left Index (Anchor •)', 'g': 'Left Index', 'v': 'Left Index', 'b': 'Left Index',
      '6': 'Right Index', '^': 'Right Index', '7': 'Right Index', '&': 'Right Index',
      'y': 'Right Index', 'u': 'Right Index', 'h': 'Right Index', 'j': 'Right Index (Anchor •)', 'n': 'Right Index', 'm': 'Right Index',
      '8': 'Right Middle', '*': 'Right Middle', 'i': 'Right Middle', 'k': 'Right Middle', ',': 'Right Middle', '<': 'Right Middle',
      '9': 'Right Ring', '(': 'Right Ring', 'o': 'Right Ring', 'l': 'Right Ring', '.': 'Right Ring', '>': 'Right Ring',
      '0': 'Right Pinky', ')': 'Right Pinky', '-': 'Right Pinky', '_': 'Right Pinky', '=': 'Right Pinky', '+': 'Right Pinky',
      'p': 'Right Pinky', '[': 'Right Pinky', '{': 'Right Pinky', ']': 'Right Pinky', '}': 'Right Pinky',
      ';': 'Right Pinky', ':': 'Right Pinky', '\'': 'Right Pinky', '"': 'Right Pinky', '/': 'Right Pinky', '?': 'Right Pinky'
    };
    return map[lower] || 'Left Index';
  },

  getFingerDetails(char) {
    const keyInfo = this.charToKeyCode(char);
    const fingerName = this.getFingerName(char);
    const codeMap = {
      'Left Pinky': 'f-lp',
      'Left Ring': 'f-lr',
      'Left Middle': 'f-lm',
      'Left Index': 'f-li',
      'Left Index (Anchor •)': 'f-li',
      'Thumbs (Space)': 'f-thumb',
      'Right Index': 'f-ri',
      'Right Index (Anchor •)': 'f-ri',
      'Right Middle': 'f-rm',
      'Right Ring': 'f-rr',
      'Right Pinky': 'f-rp'
    };
    const fingerCode = codeMap[fingerName] || 'f-li';
    const shiftFingerCode = keyInfo.needsShift ? (keyInfo.isRightHand ? 'f-lp' : 'f-rp') : null;
    let action = '';
    if (char === ' ') {
      action = 'Press Spacebar with either thumb';
    } else if (keyInfo.needsShift) {
      const shiftSide = keyInfo.isRightHand ? 'Left Shift' : 'Right Shift';
      action = `Hold ${shiftSide} + tap ${fingerName} for "${char}"`;
    } else {
      action = `Tap "${char}" with ${fingerName}`;
    }
    return {
      fingerCode,
      fingerName,
      action,
      needsShift: !!keyInfo.needsShift,
      shiftFingerCode
    };
  },

  getKeyReachOffset(code) {
    if (!code) return { x: 0, y: 0 };
    if (code === 'Space') return { x: 0, y: 8 };
    if (code === 'ShiftLeft') return { x: -16, y: 18 };
    if (code === 'ShiftRight') return { x: 24, y: 18 };

    const innerLeft = { Digit5: { x: 24, y: -36 }, KeyT: { x: 22, y: -20 }, KeyG: { x: 24, y: -4 }, KeyB: { x: 24, y: 18 } };
    const innerRight = { Digit6: { x: -24, y: -36 }, KeyY: { x: -22, y: -20 }, KeyH: { x: -24, y: -4 }, KeyN: { x: -24, y: 18 } };
    if (innerLeft[code]) return innerLeft[code];
    if (innerRight[code]) return innerRight[code];

    const numRow = ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal'];
    const topRow = ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight'];
    const bottomRow = ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyM', 'Comma', 'Period', 'Slash'];

    if (numRow.includes(code)) return { x: 0, y: -36 };
    if (topRow.includes(code)) return { x: -6, y: -20 };
    if (bottomRow.includes(code)) return { x: 6, y: 18 };
    return { x: 0, y: -5 };
  },

  playKeySound(isError = false) {
    if (!this.soundEnabled) return;
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.audioCtx = new AudioContext();
      }
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      if (isError) {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.11);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.11);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, this.audioCtx.currentTime + 0.035);
        gain.gain.setValueAtTime(0.035, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.04);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.04);
      }
    } catch {
      // Silent fallback in restricted environments
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
    const streakEl = document.getElementById('typing-streak');
    const progressEl = document.getElementById('typing-progress-bar');

    const accuracy = this.calculateAccuracy();
    const wpm = this.calculateWpm();

    if (wpmEl) wpmEl.textContent = `${wpm} WPM`;
    if (accEl) accEl.textContent = `${accuracy}% Acc`;
    if (mistakesEl) mistakesEl.textContent = `❌ ${this.mistakes}`;
    if (streakEl) {
      streakEl.textContent = `🔥 ${this.streak} Streak`;
      streakEl.classList.toggle('streak-hot', this.streak >= 5);
    }
    if (timeEl) {
      const m = Math.floor(this.elapsedSeconds / 60);
      const s = this.elapsedSeconds % 60;
      timeEl.textContent = `⏱️ ${m}:${s < 10 ? '0' : ''}${s}`;
    }
    if (progressEl && this.targetText.length > 0) {
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

    if (this.viewMode === 'map') return;

    if (this.isFinished) {
      if (e.key === 'Enter' && this.activeLessonIndex < this.lessons.length - 1) {
        if (e.preventDefault) e.preventDefault();
        this.nextLesson();
      }
      return;
    }

    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) {
      this.highlightPhysicalKey(e.code, true);
      setTimeout(() => this.highlightPhysicalKey(e.code, false), 140);
      return;
    }

    if (e.key === 'Backspace') {
      if (e.preventDefault) e.preventDefault();
      if (this.currentHasError) {
        this.currentHasError = false;
        this.renderPromptText();
      } else if (this.currentIndex > 0) {
        this.currentIndex--;
        this.charStatuses[this.currentIndex] = 'pending';
        this.renderPromptText();
        this.updateActiveKeyHighlight();
        this.updateStatsUI();
      }
      return;
    }

    if (e.key === ' ' && e.preventDefault) {
      e.preventDefault();
    }

    if (e.key && e.key.length > 1) return;

    if (!this.startTime) {
      this.startTimer();
    }

    this.totalKeystrokes++;
    const expectedChar = this.targetText[this.currentIndex];

    this.highlightPhysicalKey(e.code, true);
    setTimeout(() => this.highlightPhysicalKey(e.code, false), 140);

    if (e.key === expectedChar) {
      this.charStatuses[this.currentIndex] = this.currentHasError ? 'corrected' : 'correct';
      this.currentHasError = false;
      this.playKeySound(false);
      this.currentIndex++;
      this.streak++;
      if (this.streak > this.bestStreak) this.bestStreak = this.streak;
      this.renderPromptText();
      this.updateActiveKeyHighlight();
      this.updateStatsUI();

      if (this.currentIndex >= this.targetText.length) {
        this.finishLesson();
      }
    } else {
      this.currentHasError = true;
      this.mistakes++;
      this.streak = 0;
      this.playKeySound(true);
      this.flashWrongKey(e.code);
      this.renderPromptText();
      this.updateStatsUI();
    }
  },

  highlightPhysicalKey(code, isActive) {
    const keyEl = document.querySelector(`.v-key[data-code="${code}"]`);
    if (keyEl) {
      keyEl.classList.toggle('v-key-pressed', !!isActive);
    }
  },

  flashWrongKey(code) {
    const promptBox = document.getElementById('typing-prompt-box');
    if (promptBox) {
      promptBox.classList.add('prompt-shake-error');
      setTimeout(() => promptBox.classList.remove('prompt-shake-error'), 220);
    }
    const keyEl = document.querySelector(`.v-key[data-code="${code}"]`);
    if (keyEl) {
      keyEl.classList.add('v-key-wrong');
      setTimeout(() => keyEl.classList.remove('v-key-wrong'), 280);
    }
  },

  finishLesson() {
    this.isFinished = true;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    const duration = Math.max(1, this.elapsedSeconds);
    const accuracy = this.calculateAccuracy();
    const wpm = this.calculateWpm();
    const rating = this.calculateStars(wpm, accuracy);
    const activeStudent = (typeof StorageService !== 'undefined' && StorageService.getActiveStudent)
      ? StorageService.getActiveStudent()
      : null;
    const activeTeacher = (typeof StorageService !== 'undefined' && StorageService.getActiveTeacher)
      ? StorageService.getActiveTeacher()
      : null;
    const studentName = activeStudent
      ? (activeStudent.nickname || 'Student')
      : (activeTeacher ? `${activeTeacher.name} (Instructor)` : 'Student');
    const avatarId = (activeStudent && activeStudent.avatarId) ? activeStudent.avatarId : 'avatar_hijab_teal';
    const lesson = this.lessons[this.activeLessonIndex];

    this.saveLessonProgress(lesson.id, rating.stars, wpm, accuracy, rating.score);

    const metricRecord = {
      studentName,
      avatarId,
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
        { qId: 'stars', type: 'rating', prompt: 'TypingClub Stars', userAnswer: `${rating.stars} / 5 Stars`, isCorrect: rating.stars >= 3 },
        { qId: 'streak', type: 'streak', prompt: 'Best Keystroke Streak', userAnswer: `${this.bestStreak} keys`, isCorrect: true }
      ]
    };

    if (typeof StorageService !== 'undefined' && StorageService.saveMetric) {
      StorageService.saveMetric(metricRecord);
    }

    const container = document.getElementById('typing-simulator-container');
    if (!container) return;

    const r = 36;
    const circ = 2 * Math.PI * r;
    const accOffset = Math.round(circ * (1 - Math.min(100, accuracy) / 100));
    const wpmRatio = Math.min(1, wpm / Math.max(15, lesson.targetWpm * 1.35));
    const wpmOffset = Math.round(circ * (1 - wpmRatio));

    let starsShowcase = '';
    for (let s = 1; s <= 5; s++) {
      starsShowcase += `<span class="tc-star-icon ${s <= rating.stars ? 'lit' : ''}">★</span>`;
    }

    container.innerHTML = `
      <div class="tc-results-card">
        <div class="tc-stars-showcase" aria-label="${rating.stars} out of 5 stars">
          ${starsShowcase}
        </div>
        ${rating.platinum ? '<div class="tc-platinum-pill">💎 PLATINUM 100% ACCURACY</div>' : ''}
        <h2 class="tc-results-heading">Lesson Complete, ${studentName}!</h2>
        <p class="tc-results-sub">${lesson.title} • Score: <strong>${rating.score} pts</strong></p>

        <div class="tc-rings-row">
          <div class="tc-ring-card">
            <svg class="tc-ring-svg" viewBox="0 0 92 92">
              <circle class="tc-ring-bg" cx="46" cy="46" r="${r}" />
              <circle class="tc-ring-arc" cx="46" cy="46" r="${r}" stroke="#10b981" stroke-dasharray="${circ}" stroke-dashoffset="${accOffset}" />
            </svg>
            <div class="tc-ring-val">${accuracy}%</div>
            <div class="tc-ring-label">Accuracy</div>
          </div>

          <div class="tc-ring-card">
            <svg class="tc-ring-svg" viewBox="0 0 92 92">
              <circle class="tc-ring-bg" cx="46" cy="46" r="${r}" />
              <circle class="tc-ring-arc" cx="46" cy="46" r="${r}" stroke="#0ea5e9" stroke-dasharray="${circ}" stroke-dashoffset="${wpmOffset}" />
            </svg>
            <div class="tc-ring-val">${wpm} WPM</div>
            <div class="tc-ring-label">Goal: ${lesson.targetWpm} WPM</div>
          </div>
        </div>

        <div class="tc-meta-strip">
          <span class="stat-pill">🔥 Best Streak: ${this.bestStreak}</span>
          <span class="stat-pill">❌ Errors: ${this.mistakes}</span>
          <span class="stat-pill">⏱️ Time: ${duration}s</span>
        </div>

        <div class="tc-results-actions">
          ${this.activeLessonIndex < this.lessons.length - 1 ? `
            <button type="button" class="btn-primary is-success" onclick="TypingTrainer.nextLesson()">
              <span>Next Lesson (${this.activeLessonIndex + 2}) ➜</span>
            </button>
          ` : ''}
          <button type="button" class="btn-secondary" onclick="TypingTrainer.init(null, ${this.activeLessonIndex})">
            <span>↺ Try Again</span>
          </button>
          <button type="button" class="btn-secondary" onclick="TypingTrainer.openLessonMap()">
            <span>☰ Lessons Map</span>
          </button>
          <button type="button" class="btn-secondary" onclick="TypingTrainer.exitLab()">
            <span>← Curriculum</span>
          </button>
        </div>
        ${this.activeLessonIndex < this.lessons.length - 1 ? '<div class="text-xs text-light">Tip: Press <strong>Enter</strong> to jump straight to the next lesson.</div>' : ''}
      </div>
    `;
  },

  renderLessonMapHtml() {
    const progressMap = this.loadLessonProgress();
    const totalStarsEarned = this.lessons.reduce((sum, l) => sum + ((progressMap[l.id] && progressMap[l.id].stars) || 0), 0);
    const maxStars = this.lessons.length * 5;

    const unitNames = [];
    this.lessons.forEach(l => {
      if (!unitNames.includes(l.unit)) unitNames.push(l.unit);
    });

    const unitsHtml = unitNames.map(unitName => {
      const unitLessons = this.lessons
        .map((lesson, idx) => ({ lesson, idx }))
        .filter(item => item.lesson.unit === unitName);

      const completedInUnit = unitLessons.filter(item => progressMap[item.lesson.id] && progressMap[item.lesson.id].stars > 0).length;

      return `
        <div class="tc-unit-section">
          <div class="tc-unit-header">
            <span>${unitName}</span>
            <span class="tc-unit-count">${completedInUnit} / ${unitLessons.length} completed</span>
          </div>
          <div class="tc-lessons-grid">
            ${unitLessons.map(({ lesson, idx }) => {
              const p = progressMap[lesson.id];
              const stars = p ? (p.stars || 0) : 0;
              const isCurrent = idx === this.activeLessonIndex;
              const isCompleted = stars > 0;
              return `
                <button
                  type="button"
                  class="tc-lesson-tile ${isCompleted ? 'is-completed' : ''} ${isCurrent ? 'is-current' : ''}"
                  onclick="TypingTrainer.selectLesson(${idx})"
                >
                  <div class="tc-tile-top">
                    <span class="tc-tile-num">#${String(idx + 1).padStart(2, '0')}</span>
                    <span class="tc-tile-badge">${lesson.badge}</span>
                  </div>
                  <div class="tc-tile-keys">${lesson.keysBadge}</div>
                  <div class="tc-tile-title">${lesson.title.replace(/^\d+\.\s*/, '')}</div>
                  <div class="tc-tile-footer">
                    <span class="tc-tile-stars">${this.renderStarsHtml(stars)}</span>
                    ${p && p.wpm ? `<span class="tc-tile-wpm">${p.wpm} WPM</span>` : ''}
                  </div>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="tc-map-shell">
        <div class="tc-map-header">
          <div>
            <h2 class="tc-map-title">🌴 Typing Jungle • Canada Edition (20 Lessons)</h2>
            <p class="tc-map-sub">Click any lesson tile to practice touch typing, earn 5 stars, and master Canadian digital skills.</p>
          </div>
          <div class="tc-course-meter">
            <span>★ ${totalStarsEarned} / ${maxStars} Stars</span>
          </div>
        </div>
        ${unitsHtml}
      </div>
    `;
  },

  renderSimulator(container) {
    const parent = container || this.containerEl || document.getElementById('lesson-content-viewport') || document.getElementById('app-main-content');
    if (!parent) return;
    this.containerEl = parent;

    const lesson = this.lessons[this.activeLessonIndex];
    const keysTagsHtml = (lesson.keysList || [])
      .map(k => `<span class="tc-keycap-tag">${k}</span>`)
      .join(' ');

    parent.innerHTML = `
      <div id="typing-lab-root" class="typing-lab-wrapper ${this.isFullscreen ? 'lab-fullscreen-active' : ''}">
        <!-- TypingClub Clean Top Toolbar -->
        <div class="tc-topbar">
          <div class="tc-topbar-left">
            <button
              type="button"
              id="typing-map-toggle-btn"
              class="tc-nav-map-btn ${this.viewMode === 'map' ? 'active' : ''}"
              onclick="${this.viewMode === 'map' ? `TypingTrainer.selectLesson(${this.activeLessonIndex})` : 'TypingTrainer.openLessonMap()'}"
            >
              <span>${this.viewMode === 'map' ? '⌨️ Back to Practice' : '☰ Lessons'}</span>
            </button>

            <div class="tc-lesson-badge">
              <span class="tc-lesson-badge-num">Lesson ${this.activeLessonIndex + 1}/${this.lessons.length}</span>
              <span>${lesson.title.replace(/^\d+\.\s*/, '')}</span>
            </div>
          </div>

          <div class="tc-telemetry-row">
            <div class="stat-pill" id="typing-wpm">0 WPM</div>
            <div class="stat-pill" id="typing-acc">100% Acc</div>
            <div class="stat-pill" id="typing-mistakes">❌ 0</div>
            <div class="stat-pill" id="typing-streak">🔥 0 Streak</div>
            <div class="stat-pill" id="typing-time">⏱️ 0:00</div>
          </div>

          <div class="tc-toolbar-actions">
            <button type="button" id="typing-sound-btn" class="tc-tool-btn ${this.soundEnabled ? 'is-on' : ''}" onclick="TypingTrainer.toggleSound()">
              ${this.soundEnabled ? '🔊 Sound' : '🔇 Muted'}
            </button>
            <button type="button" id="typing-hands-btn" class="tc-tool-btn ${this.showHands ? 'is-on' : ''}" onclick="TypingTrainer.toggleHands()">
              👐 Hands
            </button>
            <button type="button" id="typing-kbd-btn" class="tc-tool-btn ${this.showKeyboard ? 'is-on' : ''}" onclick="TypingTrainer.toggleKeyboard()">
              ⌨️ Keys
            </button>
            <button type="button" class="tc-tool-btn" onclick="TypingTrainer.init(null, ${this.activeLessonIndex})">
              ↺ Reset
            </button>
            <button
              id="typing-fullscreen-btn"
              type="button"
              class="tc-tool-btn ${this.isFullscreen ? 'is-active' : ''}"
              aria-pressed="${this.isFullscreen ? 'true' : 'false'}"
              onclick="TypingTrainer.toggleFullscreen()"
            >
              ${this.isFullscreen ? '⤓ Exit Fullscreen' : '⛶ Fullscreen'}
            </button>
            <button type="button" class="tc-tool-btn" onclick="TypingTrainer.exitLab()">
              ✕ Exit
            </button>
          </div>
        </div>

        <!-- Thin Progress Line -->
        <div class="typing-progress-track">
          <div class="typing-progress-fill" id="typing-progress-bar" style="width: 0%;"></div>
        </div>

        ${this.viewMode === 'map' ? this.renderLessonMapHtml() : `
          <div id="typing-simulator-container" class="tc-stage-card ${!this.showHands ? 'tc-hands-hidden' : ''} ${!this.showKeyboard ? 'tc-kbd-hidden' : ''}">
            <!-- Lesson Focus Strip -->
            <div class="tc-intro-strip">
              <div class="tc-intro-keys">
                <span>Focus Keys:</span>
                ${keysTagsHtml}
                <span>• ${lesson.description}</span>
              </div>
              <div class="typing-finger-hint" id="typing-finger-hint">
                <span>👆</span>
                <strong id="finger-name-display">-</strong>
              </div>
            </div>

            <!-- White Typing Canvas -->
            <div class="typing-prompt-wrapper" id="typing-prompt-box">
              <div id="typing-prompt-inner" class="typing-prompt-inner"></div>
            </div>

            <!-- White Keyboard + Overlaid Translucent SVG Hands -->
            <div class="virtual-keyboard-container">
              <div class="tc-keyboard-stage">
                ${this.renderVirtualKeyboardHtml()}
                ${this.renderHandsGuideHtml()}
              </div>
              ${this.renderLegendHtml()}
            </div>
          </div>
        `}
      </div>
    `;

    this.syncFullscreenUI();
    if (this.viewMode === 'practice') {
      this.renderPromptText();
      this.updateActiveKeyHighlight();
      this.updateStatsUI();
    }
  },

  renderPromptText() {
    const inner = document.getElementById('typing-prompt-inner');
    if (!inner) return;

    let html = '';
    for (let i = 0; i < this.targetText.length; i++) {
      const char = this.targetText[i];
      const status = this.charStatuses[i] || 'pending';
      const displayChar = char === ' '
        ? (i === this.currentIndex ? '␣' : '<span class="t-space-glyph">·</span>')
        : char;

      if (i < this.currentIndex) {
        const cls = status === 'corrected' ? 't-char-corrected' : 't-char-correct';
        html += `<span class="t-char ${cls}">${displayChar}</span>`;
      } else if (i === this.currentIndex) {
        const errCls = this.currentHasError ? ' t-char-error' : '';
        html += `<span class="t-char t-char-current${errCls}">${displayChar}</span>`;
      } else {
        html += `<span class="t-char t-char-pending">${displayChar}</span>`;
      }
    }
    inner.innerHTML = html;
  },

  setFingerReach(el, x, y) {
    if (!el || !el.style) return;
    if (typeof el.style.setProperty === 'function') {
      el.style.setProperty('--reach-x', `${x}px`);
      el.style.setProperty('--reach-y', `${y}px`);
    } else {
      el.style['--reach-x'] = `${x}px`;
      el.style['--reach-y'] = `${y}px`;
    }
  },

  updateActiveKeyHighlight() {
    document.querySelectorAll('.v-key-target').forEach(el => el.classList.remove('v-key-target'));
    document.querySelectorAll('.v-key-shift-required').forEach(el => el.classList.remove('v-key-shift-required'));
    document.querySelectorAll('.hand-finger').forEach(el => {
      el.classList.remove('finger-active');
      el.classList.remove('finger-shift-active');
      this.setFingerReach(el, 0, 0);
    });

    if (this.currentIndex >= this.targetText.length) return;

    const char = this.targetText[this.currentIndex];
    const details = this.getFingerDetails(char);

    const fingerDisplay = document.getElementById('finger-name-display');
    if (fingerDisplay) {
      fingerDisplay.textContent = details.action;
    }

    const keyInfo = this.charToKeyCode(char);
    if (keyInfo.code) {
      const keyEl = document.querySelector(`.v-key[data-code="${keyInfo.code}"]`);
      if (keyEl) keyEl.classList.add('v-key-target');
    }

    const shiftCode = keyInfo.needsShift ? (keyInfo.isRightHand ? 'ShiftLeft' : 'ShiftRight') : null;
    if (shiftCode) {
      const shiftEl = document.querySelector(`.v-key[data-code="${shiftCode}"]`);
      if (shiftEl) shiftEl.classList.add('v-key-shift-required');
    }

    const reach = this.getKeyReachOffset(keyInfo.code);
    document.querySelectorAll(`.hand-finger[data-finger="${details.fingerCode}"]`).forEach(el => {
      el.classList.add('finger-active');
      this.setFingerReach(el, reach.x, reach.y);
    });

    if (details.shiftFingerCode && shiftCode) {
      const shiftReach = this.getKeyReachOffset(shiftCode);
      document.querySelectorAll(`.hand-finger[data-finger="${details.shiftFingerCode}"]`).forEach(el => {
        el.classList.add('finger-shift-active');
        this.setFingerReach(el, shiftReach.x, shiftReach.y);
      });
    }
  },

  renderHandsGuideHtml() {
    return `
      <div class="tc-hands-overlay" aria-hidden="true">
        <svg class="hands-svg" viewBox="0 0 720 156" xmlns="http://www.w3.org/2000/svg">
          <!-- LEFT HAND OVERLAY -->
          <g id="svg-left-hand">
            <rect class="hand-palm" x="72" y="92" width="180" height="58" rx="28" />
            <rect class="hand-finger f-lp" data-finger="f-lp" x="66" y="42" width="24" height="62" rx="12" />
            <rect class="hand-finger f-lr" data-finger="f-lr" x="116" y="22" width="26" height="78" rx="13" />
            <rect class="hand-finger f-lm" data-finger="f-lm" x="166" y="12" width="27" height="86" rx="13" />
            <rect class="hand-finger f-li" data-finger="f-li" x="218" y="24" width="27" height="76" rx="13" />
            <rect class="hand-finger f-thumb" data-finger="f-thumb" x="266" y="88" width="52" height="25" rx="12" transform="rotate(-16 292 100)" />
          </g>

          <!-- RIGHT HAND OVERLAY -->
          <g id="svg-right-hand">
            <rect class="hand-palm" x="454" y="92" width="180" height="58" rx="28" />
            <rect class="hand-finger f-thumb" data-finger="f-thumb" x="396" y="88" width="52" height="25" rx="12" transform="rotate(16 422 100)" />
            <rect class="hand-finger f-ri" data-finger="f-ri" x="452" y="24" width="27" height="76" rx="13" />
            <rect class="hand-finger f-rm" data-finger="f-rm" x="504" y="12" width="27" height="86" rx="13" />
            <rect class="hand-finger f-rr" data-finger="f-rr" x="554" y="22" width="26" height="78" rx="13" />
            <rect class="hand-finger f-rp" data-finger="f-rp" x="604" y="42" width="24" height="62" rx="12" />
          </g>
        </svg>
      </div>
    `;
  },

  charToKeyCode(char) {
    if (char === ' ') return { code: 'Space', needsShift: false, isRightHand: false };

    if (char >= '0' && char <= '9') {
      const isRight = parseInt(char, 10) >= 6 || char === '0';
      return { code: `Digit${char}`, needsShift: false, isRightHand: isRight };
    }

    if (char >= 'A' && char <= 'Z') {
      const lower = char.toLowerCase();
      const isRight = 'yuiophjklbnm'.includes(lower);
      return { code: `Key${char}`, needsShift: true, isRightHand: isRight };
    }

    if (char >= 'a' && char <= 'z') {
      const upper = char.toUpperCase();
      const isRight = 'yuiophjklbnm'.includes(char);
      return { code: `Key${upper}`, needsShift: false, isRightHand: isRight };
    }

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
      '!': { code: 'Digit1', needsShift: true, isRightHand: false },
      '@': { code: 'Digit2', needsShift: true, isRightHand: false },
      '#': { code: 'Digit3', needsShift: true, isRightHand: false },
      '$': { code: 'Digit4', needsShift: true, isRightHand: false },
      '%': { code: 'Digit5', needsShift: true, isRightHand: false },
      '^': { code: 'Digit6', needsShift: true, isRightHand: true },
      '&': { code: 'Digit7', needsShift: true, isRightHand: true },
      '*': { code: 'Digit8', needsShift: true, isRightHand: true },
      '(': { code: 'Digit9', needsShift: true, isRightHand: true },
      ')': { code: 'Digit0', needsShift: true, isRightHand: true }
    };

    if (symbolMap[char]) return symbolMap[char];
    return { code: null, needsShift: false, isRightHand: false };
  },

  renderVirtualKeyboardHtml() {
    const rows = [
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
        { code: 'Backspace', label: '⌫', width: 'v-key-wide-2', finger: 'f-rp' }
      ],
      [
        { code: 'Tab', label: 'Tab', width: 'v-key-wide-1-5', finger: 'f-lp' },
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
      [
        { code: 'CapsLock', label: 'Caps', width: 'v-key-wide-1-75', finger: 'f-lp' },
        { code: 'KeyA', label: 'A', finger: 'f-lp' },
        { code: 'KeyS', label: 'S', finger: 'f-lr' },
        { code: 'KeyD', label: 'D', finger: 'f-lm' },
        { code: 'KeyF', label: 'F<span class="tactile-bump">—</span>', finger: 'f-li', tactile: true },
        { code: 'KeyG', label: 'G', finger: 'f-li' },
        { code: 'KeyH', label: 'H', finger: 'f-ri' },
        { code: 'KeyJ', label: 'J<span class="tactile-bump">—</span>', finger: 'f-ri', tactile: true },
        { code: 'KeyK', label: 'K', finger: 'f-rm' },
        { code: 'KeyL', label: 'L', finger: 'f-rr' },
        { code: 'Semicolon', label: ':<br>;', finger: 'f-rp' },
        { code: 'Quote', label: '"<br>\'', finger: 'f-rp' },
        { code: 'Enter', label: 'Enter ↵', width: 'v-key-wide-2-25', finger: 'f-rp' }
      ],
      [
        { code: 'ShiftLeft', label: 'Shift', width: 'v-key-wide-2-25', finger: 'f-lp' },
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
        { code: 'ShiftRight', label: 'Shift', width: 'v-key-wide-2-75', finger: 'f-rp' }
      ],
      [
        { code: 'ControlLeft', label: 'Ctrl', width: 'v-key-wide-1-5', finger: 'f-lp' },
        { code: 'AltLeft', label: 'Alt', width: 'v-key-wide-1-25', finger: 'f-thumb' },
        { code: 'Space', label: 'Space', width: 'v-key-spacebar', finger: 'f-thumb' },
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
    `;
  },

  renderLegendHtml() {
    return `
      <div class="v-keyboard-legend">
        <span class="legend-chip"><span class="legend-dot f-lp-bg"></span> L. Pinky</span>
        <span class="legend-chip"><span class="legend-dot f-lr-bg"></span> L. Ring</span>
        <span class="legend-chip"><span class="legend-dot f-lm-bg"></span> L. Middle</span>
        <span class="legend-chip"><span class="legend-dot f-li-bg"></span> L. Index (F)</span>
        <span class="legend-chip"><span class="legend-dot f-thumb-bg"></span> Thumbs</span>
        <span class="legend-chip"><span class="legend-dot f-ri-bg"></span> R. Index (J)</span>
        <span class="legend-chip"><span class="legend-dot f-rm-bg"></span> R. Middle</span>
        <span class="legend-chip"><span class="legend-dot f-rr-bg"></span> R. Ring</span>
        <span class="legend-chip"><span class="legend-dot f-rp-bg"></span> R. Pinky</span>
      </div>
    `;
  }
};

if (typeof window !== 'undefined') {
  window.TypingTrainer = TypingTrainer;
}
