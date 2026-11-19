/**
 * WelcomePlace - TypingClub-Style Interactive Keyboard Typing Studio
 * Combines TypingClub's clean UI, natural anatomical Bezier SVG hands,
 * progressive Typing Jungle 20-lesson path, and embedded arcade games starting at Lesson 4.
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
  mapFilter: 'all', // 'all' | 'games' | 'practice'
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
    // Unit 1: Home Row Foundations + Early Arcade Games (starting at Lesson 4!)
    {
      id: 'tc_01_fj',
      type: 'practice',
      unit: 'Unit 1 • Home Row Foundations',
      title: '1. Meet F & J',
      badge: 'Intro',
      keysBadge: 'f  j',
      keysList: ['F', 'J'],
      targetWpm: 15,
      description: 'Rest your index fingers gently on the tactile bumps on F and J',
      fingerFocus: 'Index fingers stay anchored on F and J bumps',
      text: 'fff jjj fjf jfj ff jj fj jf ff jj fjf jfj'
    },
    {
      id: 'tc_02_fj_space',
      type: 'practice',
      unit: 'Unit 1 • Home Row Foundations',
      title: '2. F, J & Spacebar',
      badge: 'Practice',
      keysBadge: 'f  j  ␣',
      keysList: ['F', 'J', 'Space'],
      targetWpm: 18,
      description: 'Tap the spacebar lightly with your thumb between letter groups',
      fingerFocus: 'Keep your eyes up and strike Space with your thumb',
      text: 'f j f j ff jj fj jf fff jjj fjf jfj fj jf'
    },
    {
      id: 'tc_03_dk',
      type: 'practice',
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
      id: 'tc_04_balloon_fjdk',
      type: 'game_balloon',
      unit: 'Unit 1 • Home Row Foundations',
      title: '4. Balloon Valley: F J D K',
      badge: '🎮 Game',
      keysBadge: '🎈 f j d k',
      keysList: ['F', 'J', 'D', 'K'],
      targetWpm: 20,
      goal: 16,
      pool: ['f', 'j', 'd', 'k', 'fj', 'dk', 'fd', 'jk', 'fjd', 'kdf'],
      description: 'Pop 16 floating balloons by typing their letters before they float away!',
      fingerFocus: 'Quick reflexes using your index & middle fingers',
      text: ''
    },
    {
      id: 'tc_05_sl',
      type: 'practice',
      unit: 'Unit 1 • Home Row Foundations',
      title: '5. Add S & L',
      badge: 'Intro',
      keysBadge: 's  l',
      keysList: ['S', 'L'],
      targetWpm: 20,
      description: 'Train your ring fingers on S (left) and L (right)',
      fingerFocus: 'Left ring taps S, right ring taps L',
      text: 'sss lll sls lsl ss ll sd kl ds lk sldk klds'
    },
    {
      id: 'tc_06_frog_sdfjkl',
      type: 'game_frog',
      unit: 'Unit 1 • Home Row Foundations',
      title: '6. Jungle Frog Jump: Home Row',
      badge: '🎮 Game',
      keysBadge: '🐸 s d f j k l',
      keysList: ['S', 'D', 'F', 'J', 'K', 'L'],
      targetWpm: 22,
      goal: 10,
      pool: ['sad', 'lad', 'dad', 'all', 'ask', 'fall', 'flask', 'salad', 'skid', 'add'],
      description: 'Type each lily-pad word quickly to hop your frog safely across the river!',
      fingerFocus: 'Smooth rhythm keeps the frog jumping forward',
      text: ''
    },
    {
      id: 'tc_07_a_semi',
      type: 'practice',
      unit: 'Unit 1 • Home Row Foundations',
      title: '7. Add A & ;',
      badge: 'Intro',
      keysBadge: 'a  ;',
      keysList: ['A', ';'],
      targetWpm: 22,
      description: 'Activate your left and right pinky fingers on A and ;',
      fingerFocus: 'Pinkies rest lightly on A and Semicolon (;)',
      text: 'aaa ;;; a;a ;a; aa ;; asdf jkl; ;lkj fdsa ask all fall'
    },
    {
      id: 'tc_08_falling_home',
      type: 'game_falling',
      unit: 'Unit 1 • Home Row Foundations',
      title: '8. Falling Meteors: Home Row',
      badge: '🎮 Game',
      keysBadge: '☄️ a–;',
      keysList: ['A', 'S', 'D', 'F', 'J', 'K', 'L', ';'],
      targetWpm: 24,
      goal: 16,
      pool: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', 'as', 'df', 'jk', 'la', 'ask', 'dad', 'fall'],
      description: 'Zap 16 falling meteors before they strike your sky shield!',
      fingerFocus: 'Stay centered on the home row to intercept fast blocks',
      text: ''
    },
    {
      id: 'tc_09_gh',
      type: 'practice',
      unit: 'Unit 1 • Home Row Foundations',
      title: '9. Reach for G & H',
      badge: 'Intro',
      keysBadge: 'g  h',
      keysList: ['G', 'H'],
      targetWpm: 24,
      description: 'Stretch index fingers inward for G and H, then return to F and J',
      fingerFocus: 'Left index reaches F -> G, right index reaches J -> H',
      text: 'fgf jhj fg hj gh hg glad half flag dash sash hash ash'
    },
    {
      id: 'tc_10_defense_home',
      type: 'game_defense',
      unit: 'Unit 1 • Home Row Foundations',
      title: '10. Orchard Defense: Home Words',
      badge: '🎮 Game',
      keysBadge: '🦝 a–; + g h',
      keysList: ['G', 'H', 'Home Row'],
      targetWpm: 25,
      goal: 12,
      pool: ['glad', 'half', 'flag', 'dash', 'glass', 'flash', 'hall', 'salad', 'ask', 'ash'],
      description: 'Protect the apple orchard by typing the words above approaching critters!',
      fingerFocus: 'Lock onto the closest critter first and complete its word',
      text: ''
    },

    // Unit 2: Top Row Reach
    {
      id: 'tc_11_ei',
      type: 'practice',
      unit: 'Unit 2 • Top Row Reach',
      title: '11. Top Row E & I',
      badge: 'Intro',
      keysBadge: 'e  i',
      keysList: ['E', 'I'],
      targetWpm: 25,
      description: 'Reach straight up with middle fingers from D -> E and K -> I',
      fingerFocus: 'Left middle reaches E, right middle reaches I',
      text: 'ded kik de ki ei ie see side life file like desk sail'
    },
    {
      id: 'tc_12_balloon_top',
      type: 'game_balloon',
      unit: 'Unit 2 • Top Row Reach',
      title: '12. Sky Words: E I R U',
      badge: '🎮 Game',
      keysBadge: '🎈 e i r u',
      keysList: ['E', 'I', 'R', 'U'],
      targetWpm: 26,
      goal: 14,
      pool: ['see', 'side', 'life', 'like', 'fire', 'rule', 'sure', 'leaf', 'ride', 'desk', 'user', 'full'],
      description: 'Pop 14 top-row word balloons gliding across the Canadian sky!',
      fingerFocus: 'Reach up cleanly to E, I, R, U without lifting your palms',
      text: ''
    },
    {
      id: 'tc_13_top_full',
      type: 'practice',
      unit: 'Unit 2 • Top Row Reach',
      title: '13. Full Top Row (T Y Q W O P)',
      badge: 'Intro',
      keysBadge: 'q w t y o p',
      keysList: ['Q', 'W', 'T', 'Y', 'O', 'P'],
      targetWpm: 26,
      description: 'Coordinate all upper-row letters for smooth everyday words',
      fingerFocus: 'Outer fingers reach smoothly up for Q, W, O, P',
      text: 'ftf jyj try stay city work word port power quick quiet help type'
    },
    {
      id: 'tc_14_frog_top',
      type: 'game_frog',
      unit: 'Unit 2 • Top Row Reach',
      title: '14. River Sprint: Top Row',
      badge: '🎮 Game',
      keysBadge: '🐸 top row',
      keysList: ['Top Row', 'Home Row'],
      targetWpm: 27,
      goal: 10,
      pool: ['work', 'word', 'city', 'stay', 'open', 'help', 'step', 'type', 'write', 'power'],
      description: 'Hop across 10 rapid lily pads using top & home row mastery!',
      fingerFocus: 'Keep a steady cadence word after word',
      text: ''
    },

    // Unit 3: Bottom Row Keys
    {
      id: 'tc_15_bottom_row',
      type: 'practice',
      unit: 'Unit 3 • Bottom Row Keys',
      title: '15. Bottom Row (Z X C V B N M)',
      badge: 'Intro',
      keysBadge: 'z x c v b n m',
      keysList: ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '.'],
      targetWpm: 27,
      description: 'Curl your fingers gently downward to complete the full alphabet',
      fingerFocus: 'Avoid shifting wrists downward — curl individual fingers cleanly',
      text: 'can man van cab main calm name bank, zoom exact size box next.'
    },
    {
      id: 'tc_16_falling_canada',
      type: 'game_falling',
      unit: 'Unit 3 • Bottom Row Keys',
      title: '16. Meteor Shower: Full Alphabet',
      badge: '🎮 Game',
      keysBadge: '☄️ a–z words',
      keysList: ['Full Alphabet'],
      targetWpm: 28,
      goal: 14,
      pool: ['maple', 'cabin', 'canoe', 'north', 'river', 'park', 'home', 'bank', 'book', 'calm', 'zoom', 'winter'],
      description: 'Defend Canada’s night sky by typing falling nature words!',
      fingerFocus: 'All 10 fingers work together across top, home & bottom rows',
      text: ''
    },

    // Unit 4: Canadian Vocabulary & Shift Capitals
    {
      id: 'tc_17_canadian_words',
      type: 'practice',
      unit: 'Unit 4 • Everyday Canada & Shift',
      title: '17. Everyday Canadian Words',
      badge: 'Practice',
      keysBadge: 'a–z flow',
      keysList: ['All Letters', 'Space'],
      targetWpm: 28,
      description: 'Build comfortable flow across essential newcomer vocabulary',
      fingerFocus: 'Look ahead one word while your hands follow muscle memory',
      text: 'welcome canada hello please thank you library clinic school bus subway safe home'
    },
    {
      id: 'tc_18_shift_capitals',
      type: 'practice',
      unit: 'Unit 4 • Everyday Canada & Shift',
      title: '18. Shift Key & Canadian Cities',
      badge: 'Shift',
      keysBadge: '⇧ A–Z',
      keysList: ['Left Shift', 'Right Shift'],
      targetWpm: 28,
      description: 'Hold the opposite pinky on Shift to capitalize Canadian cities',
      fingerFocus: 'Right Shift for left-hand capitals; Left Shift for right-hand capitals',
      text: 'Canada Ottawa Ontario Toronto Montreal Vancouver Calgary Edmonton English French'
    },

    // Unit 5: Numbers, Hotlines & Arcade Boss Challenge
    {
      id: 'tc_19_defense_hotlines',
      type: 'game_defense',
      unit: 'Unit 5 • Numbers & Digital Life',
      title: '19. City Defenders: 911 & Cities',
      badge: '🎮 Game',
      keysBadge: '🏰 911 / ⇧',
      keysList: ['Numbers', 'Shift'],
      targetWpm: 28,
      goal: 12,
      pool: ['911', '211', '311', '811', 'Ottawa', 'Banff', 'Canada', 'Toronto', 'Health', 'Police'],
      description: 'Use Shift & top number row to stop mischief critters at the gate!',
      fingerFocus: 'Use opposite pinky Shift for capitals and reach cleanly to numbers',
      text: ''
    },
    {
      id: 'tc_20_frog_express',
      type: 'game_frog',
      unit: 'Unit 5 • Numbers & Digital Life',
      title: '20. Trans-Canada Express',
      badge: '🏆 Boss',
      keysBadge: '🍁 K1A 0B1',
      keysList: ['Shift', 'Digits', 'Canada'],
      targetWpm: 30,
      goal: 10,
      pool: ['K1A', '0B1', 'M5V', '2T6', 'Ottawa', 'Toronto', 'Calgary', 'Halifax', 'Canada', 'Welcome'],
      description: 'Cross the final river checkpoint typing Canadian postal codes and cities!',
      fingerFocus: 'Master accuracy, Shift coordination, and steady WPM',
      text: ''
    }
  ],

  isGameLesson(lesson) {
    return Boolean(lesson && typeof lesson.type === 'string' && lesson.type.startsWith('game_'));
  },

  init(containerElement, lessonIdx = 0) {
    this.cleanup();
    const safeIdx = Math.max(0, Math.min(lessonIdx, this.lessons.length - 1));
    const lesson = this.lessons[safeIdx];

    this.activeLessonIndex = safeIdx;
    this.viewMode = 'practice';
    this.targetText = this.isGameLesson(lesson) ? '' : (lesson.text || '');
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

    if (this.isGameLesson(lesson) && typeof TypingGames !== 'undefined') {
      const gameSlot = document.getElementById('typing-game-slot');
      if (gameSlot) {
        TypingGames.start(lesson, gameSlot, {
          onTargetChanged: (nextCh) => this.highlightTargetChar(nextCh),
          onKeyCorrect: (code, _ch, combo) => {
            if (!this.startTime) this.startTimer();
            this.totalKeystrokes++;
            this.currentIndex++;
            this.streak = combo;
            if (combo > this.bestStreak) this.bestStreak = combo;
            this.playKeySound(false);
            this.highlightPhysicalKey(code, true);
            setTimeout(() => this.highlightPhysicalKey(code, false), 140);
            this.updateStatsUI();
          },
          onKeyWrong: (code) => {
            if (!this.startTime) this.startTimer();
            this.totalKeystrokes++;
            this.mistakes++;
            this.streak = 0;
            this.playKeySound(true);
            this.flashWrongKey(code);
            this.updateStatsUI();
          },
          onWin: (gameStats) => this.finishLesson(gameStats),
          onGameOver: () => {
            if (this.timerInterval) {
              clearInterval(this.timerInterval);
              this.timerInterval = null;
            }
          }
        });
      }
    }
  },

  cleanup() {
    if (typeof TypingGames !== 'undefined' && TypingGames.stop) {
      TypingGames.stop();
    }
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
    if (typeof TypingGames !== 'undefined' && TypingGames.stop) {
      TypingGames.stop();
    }
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.viewMode = 'map';
    this.renderSimulator(this.containerEl);
  },

  setMapFilter(filter) {
    this.mapFilter = filter === 'games' || filter === 'practice' ? filter : 'all';
    if (this.viewMode === 'map') {
      this.renderSimulator(this.containerEl);
    }
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

  calculateStars(wpm, accuracy, gameStats = null) {
    const lesson = this.lessons[this.activeLessonIndex] || { targetWpm: 20 };
    const goal = lesson.targetWpm || 20;
    const platinum = accuracy === 100 && (wpm >= goal || (gameStats && gameStats.heartsLeft === 5));

    let stars = 1;
    if (accuracy >= 98 && wpm >= goal) stars = 5;
    else if (accuracy >= 94 && wpm >= Math.max(12, Math.floor(goal * 0.78))) stars = 4;
    else if (accuracy >= 88 && wpm >= Math.max(8, Math.floor(goal * 0.55))) stars = 3;
    else if (accuracy >= 75) stars = 2;

    if (gameStats && gameStats.heartsLeft >= 5 && accuracy >= 95 && stars < 5) {
      stars = Math.max(stars, 4);
    }

    const baseScore = Math.max(100, Math.round(accuracy * 18 + wpm * 24 + this.bestStreak * 15 - this.mistakes * 20));
    const score = gameStats ? Math.max(baseScore, gameStats.score + accuracy * 10) : baseScore;
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

    const innerLeft = { Digit5: { x: 22, y: -34 }, KeyT: { x: 20, y: -20 }, KeyG: { x: 24, y: -4 }, KeyB: { x: 24, y: 18 } };
    const innerRight = { Digit6: { x: -22, y: -34 }, KeyY: { x: -20, y: -20 }, KeyH: { x: -24, y: -4 }, KeyN: { x: -24, y: 18 } };
    if (innerLeft[code]) return innerLeft[code];
    if (innerRight[code]) return innerRight[code];

    const numRow = ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal'];
    const topRow = ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight'];
    const bottomRow = ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyM', 'Comma', 'Period', 'Slash'];

    if (numRow.includes(code)) return { x: 0, y: -34 };
    if (topRow.includes(code)) return { x: -5, y: -20 };
    if (bottomRow.includes(code)) return { x: 5, y: 18 };
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
    if (progressEl) {
      const lesson = this.lessons[this.activeLessonIndex];
      let pct = 0;
      if (this.isGameLesson(lesson) && typeof TypingGames !== 'undefined' && TypingGames.goal > 0) {
        pct = Math.min(100, Math.round((TypingGames.cleared / TypingGames.goal) * 100));
      } else if (this.targetText.length > 0) {
        pct = Math.round((this.currentIndex / this.targetText.length) * 100);
      }
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

    const lesson = this.lessons[this.activeLessonIndex];
    if (this.isGameLesson(lesson) && typeof TypingGames !== 'undefined' && TypingGames.active) {
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) {
        this.highlightPhysicalKey(e.code, true);
        setTimeout(() => this.highlightPhysicalKey(e.code, false), 140);
        return;
      }
      TypingGames.handleKey(e);
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

  finishLesson(gameStats = null) {
    this.isFinished = true;
    if (typeof TypingGames !== 'undefined' && TypingGames.stop) {
      TypingGames.stop();
    }
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    const duration = Math.max(1, this.elapsedSeconds);
    const accuracy = this.calculateAccuracy();
    const wpm = Math.max(this.calculateWpm(), gameStats ? Math.round((this.currentIndex / 5) / Math.max(0.25, duration / 60)) : 0);
    const rating = this.calculateStars(wpm, accuracy, gameStats);
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
        <h2 class="tc-results-heading">${this.isGameLesson(lesson) ? 'Arcade Victory' : 'Lesson Complete'}, ${studentName}!</h2>
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
          ${gameStats ? `<span class="stat-pill">❤️ Hearts Left: ${gameStats.heartsLeft}</span>` : `<span class="stat-pill">⏱️ Time: ${duration}s</span>`}
        </div>

        <div class="tc-results-actions">
          ${this.activeLessonIndex < this.lessons.length - 1 ? `
            <button type="button" class="btn-primary is-success" onclick="TypingTrainer.nextLesson()">
              <span>Next Lesson (${this.activeLessonIndex + 2}) ➜</span>
            </button>
          ` : ''}
          <button type="button" class="btn-secondary" onclick="TypingTrainer.init(null, ${this.activeLessonIndex})">
            <span>↺ Play Again</span>
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
    const totalGames = this.lessons.filter(l => this.isGameLesson(l)).length;
    const totalPractice = this.lessons.length - totalGames;

    const unitNames = [];
    this.lessons.forEach(l => {
      if (!unitNames.includes(l.unit)) unitNames.push(l.unit);
    });

    const unitsHtml = unitNames.map(unitName => {
      const unitLessons = this.lessons
        .map((lesson, idx) => ({ lesson, idx }))
        .filter(item => item.lesson.unit === unitName)
        .filter(item => {
          if (this.mapFilter === 'games') return this.isGameLesson(item.lesson);
          if (this.mapFilter === 'practice') return !this.isGameLesson(item.lesson);
          return true;
        });

      if (unitLessons.length === 0) return '';

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
              const isGame = this.isGameLesson(lesson);
              return `
                <button
                  type="button"
                  class="tc-lesson-tile ${isGame ? 'is-game' : ''} ${isCompleted ? 'is-completed' : ''} ${isCurrent ? 'is-current' : ''}"
                  onclick="TypingTrainer.selectLesson(${idx})"
                >
                  <div class="tc-tile-top">
                    <span class="tc-tile-num">#${String(idx + 1).padStart(2, '0')}</span>
                    <span class="tc-tile-badge ${isGame ? 'badge-game' : ''}">${lesson.badge}</span>
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
            <p class="tc-map-sub">Interactive lessons & arcade typing games starting right at Lesson 4!</p>
          </div>
          <div class="tc-map-header-right">
            <div class="tc-map-filters" role="tablist" aria-label="Filter lessons">
              <button type="button" class="tc-filter-btn ${this.mapFilter === 'all' ? 'active' : ''}" onclick="TypingTrainer.setMapFilter('all')">All (${this.lessons.length})</button>
              <button type="button" class="tc-filter-btn ${this.mapFilter === 'games' ? 'active' : ''}" onclick="TypingTrainer.setMapFilter('games')">🎮 Games (${totalGames})</button>
              <button type="button" class="tc-filter-btn ${this.mapFilter === 'practice' ? 'active' : ''}" onclick="TypingTrainer.setMapFilter('practice')">⌨️ Drills (${totalPractice})</button>
            </div>
            <div class="tc-course-meter">
              <span>★ ${totalStarsEarned} / ${maxStars}</span>
            </div>
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
    const isGame = this.isGameLesson(lesson);
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
              <span>${this.viewMode === 'map' ? '⌨️ Back to Lesson' : '☰ Lessons'}</span>
            </button>

            <div class="tc-lesson-badge ${isGame ? 'is-game-pill' : ''}">
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
            <div class="tc-intro-strip">
              <div class="tc-intro-keys">
                <span>${isGame ? 'Arcade Keys:' : 'Focus Keys:'}</span>
                ${keysTagsHtml}
                <span>• ${lesson.description}</span>
              </div>
              <div class="typing-finger-hint" id="typing-finger-hint">
                <span>👆</span>
                <strong id="finger-name-display">-</strong>
              </div>
            </div>

            ${isGame ? '<div id="typing-game-slot"></div>' : `
              <div class="typing-prompt-wrapper" id="typing-prompt-box">
                <div id="typing-prompt-inner" class="typing-prompt-inner"></div>
              </div>
            `}

            <!-- White Keyboard + Natural Overlaid Bezier SVG Hands -->
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
      if (!isGame) {
        this.renderPromptText();
        this.updateActiveKeyHighlight();
      }
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
    if (this.currentIndex >= this.targetText.length) {
      this.highlightTargetChar('');
      return;
    }
    this.highlightTargetChar(this.targetText[this.currentIndex]);
  },

  highlightTargetChar(char) {
    document.querySelectorAll('.v-key-target').forEach(el => el.classList.remove('v-key-target'));
    document.querySelectorAll('.v-key-shift-required').forEach(el => el.classList.remove('v-key-shift-required'));
    document.querySelectorAll('.hand-finger').forEach(el => {
      el.classList.remove('finger-active');
      el.classList.remove('finger-shift-active');
      this.setFingerReach(el, 0, 0);
    });

    if (!char) {
      const fingerDisplay = document.getElementById('finger-name-display');
      if (fingerDisplay) fingerDisplay.textContent = '-';
      return;
    }

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

  buildNaturalHandSvg(isRight) {
    const mx = (x) => (isRight ? 760 - x : x);
    const palmPath = [
      `M ${mx(102)} 206`,
      `C ${mx(96)} 178, ${mx(84)} 158, ${mx(74)} 138`,
      `C ${mx(70)} 124, ${mx(72)} 114, ${mx(88)} 112`,
      `Q ${mx(110)} 104, ${mx(130)} 102`,
      `Q ${mx(176)} 96, ${mx(224)} 102`,
      `C ${mx(244)} 106, ${mx(260)} 122, ${mx(268)} 146`,
      `C ${mx(262)} 168, ${mx(240)} 178, ${mx(222)} 188`,
      `L ${mx(216)} 206 Z`
    ].join(' ');

    const fingers = [
      {
        code: 'f-lp',
        body: `M ${mx(74)} 116 C ${mx(68)} 92, ${mx(65)} 70, ${mx(64)} 54 C ${mx(64)} 43, ${mx(82)} 41, ${mx(85)} 52 C ${mx(88)} 70, ${mx(92)} 92, ${mx(96)} 114 Q ${mx(85)} 118 ${mx(74)} 116 Z`,
        nail: `M ${mx(67)} 55 C ${mx(66)} 46, ${mx(79)} 45, ${mx(81)} 54 C ${mx(80)} 60, ${mx(68)} 60, ${mx(67)} 55 Z`,
        crease: `M ${mx(70)} 76 Q ${mx(77)} 78 ${mx(84)} 75 M ${mx(73)} 94 Q ${mx(82)} 96 ${mx(90)} 93`,
        gx: mx(74),
        gy: 52
      },
      {
        code: 'f-lr',
        body: `M ${mx(116)} 106 C ${mx(114)} 76, ${mx(112)} 48, ${mx(112)} 31 C ${mx(112)} 19, ${mx(134)} 19, ${mx(135)} 31 C ${mx(136)} 48, ${mx(138)} 76, ${mx(140)} 104 Q ${mx(128)} 109 ${mx(116)} 106 Z`,
        nail: `M ${mx(116)} 33 C ${mx(116)} 23, ${mx(130)} 23, ${mx(131)} 33 C ${mx(130)} 39, ${mx(117)} 39, ${mx(116)} 33 Z`,
        crease: `M ${mx(116)} 56 Q ${mx(124)} 58 ${mx(132)} 56 M ${mx(116)} 79 Q ${mx(126)} 81 ${mx(135)} 79`,
        gx: mx(123),
        gy: 30
      },
      {
        code: 'f-lm',
        body: `M ${mx(163)} 102 C ${mx(163)} 70, ${mx(164)} 40, ${mx(165)} 20 C ${mx(165)} 7, ${mx(187)} 7, ${mx(187)} 20 C ${mx(188)} 40, ${mx(188)} 70, ${mx(189)} 102 Q ${mx(176)} 107 ${mx(163)} 102 Z`,
        nail: `M ${mx(169)} 22 C ${mx(169)} 12, ${mx(183)} 12, ${mx(183)} 22 C ${mx(183)} 28, ${mx(169)} 28, ${mx(169)} 22 Z`,
        crease: `M ${mx(167)} 48 Q ${mx(176)} 50 ${mx(185)} 48 M ${mx(166)} 74 Q ${mx(176)} 76 ${mx(186)} 74`,
        gx: mx(176),
        gy: 19
      },
      {
        code: 'f-li',
        body: `M ${mx(214)} 106 C ${mx(216)} 76, ${mx(218)} 50, ${mx(220)} 34 C ${mx(221)} 21, ${mx(243)} 22, ${mx(242)} 35 C ${mx(241)} 52, ${mx(240)} 78, ${mx(239)} 108 Q ${mx(226)} 111 ${mx(214)} 106 Z`,
        nail: `M ${mx(224)} 35 C ${mx(225)} 26, ${mx(238)} 26, ${mx(238)} 36 C ${mx(237)} 42, ${mx(224)} 41, ${mx(224)} 35 Z`,
        crease: `M ${mx(219)} 58 Q ${mx(229)} 60 ${mx(238)} 58 M ${mx(217)} 81 Q ${mx(228)} 83 ${mx(238)} 81`,
        gx: mx(231),
        gy: 33
      },
      {
        code: 'f-thumb',
        body: `M ${mx(238)} 166 C ${mx(258)} 164, ${mx(282)} 152, ${mx(304)} 136 C ${mx(318)} 126, ${mx(308)} 108, ${mx(292)} 116 C ${mx(272)} 126, ${mx(256)} 132, ${mx(244)} 136 Q ${mx(238)} 150 ${mx(238)} 166 Z`,
        nail: `M ${mx(290)} 120 C ${mx(299)} 114, ${mx(308)} 121, ${mx(300)} 129 C ${mx(295)} 133, ${mx(287)} 126, ${mx(290)} 120 Z`,
        crease: `M ${mx(264)} 134 Q ${mx(272)} 142 ${mx(277)} 149`,
        gx: mx(300),
        gy: 123
      }
    ];

    const rightCodeMap = { 'f-lp': 'f-rp', 'f-lr': 'f-rr', 'f-lm': 'f-rm', 'f-li': 'f-ri', 'f-thumb': 'f-thumb' };

    return `
      <g id="${isRight ? 'svg-right-hand' : 'svg-left-hand'}">
        <path class="hand-palm" d="${palmPath}" />
        ${fingers.map(f => {
          const code = isRight ? rightCodeMap[f.code] : f.code;
          return `
            <g class="hand-finger ${code}" data-finger="${code}">
              <path class="finger-body" d="${f.body}" />
              <path class="finger-crease" d="${f.crease}" />
              <path class="finger-nail" d="${f.nail}" />
              <circle class="finger-tip-glow" cx="${f.gx}" cy="${f.gy}" r="11" />
            </g>
          `;
        }).join('')}
      </g>
    `;
  },

  renderHandsGuideHtml() {
    return `
      <div class="tc-hands-overlay" aria-hidden="true">
        <svg class="hands-svg" viewBox="0 0 760 210" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="handSkinGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(255, 229, 209, 0.72)" />
              <stop offset="68%" stop-color="rgba(246, 214, 189, 0.48)" />
              <stop offset="100%" stop-color="rgba(246, 214, 189, 0)" />
            </linearGradient>
            <linearGradient id="fingerSkinGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(255, 236, 222, 0.78)" />
              <stop offset="100%" stop-color="rgba(248, 218, 196, 0.62)" />
            </linearGradient>
          </defs>
          ${this.buildNaturalHandSvg(false)}
          ${this.buildNaturalHandSvg(true)}
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
