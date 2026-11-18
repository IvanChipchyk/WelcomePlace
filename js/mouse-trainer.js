/**
 * WelcomePlace - Vibrant Interactive Mouse & Trackpad Training Lab
 * Inspired by TechLit.tools (Coin Chase, Apple Picker, Word Selector, Scavenger Hunt)
 *
 * 6 Skill Categories × 4 Engaging Levels = 24 Comprehensive Interactive Exercises:
 *  1. CLICK_PRECISION: Giant Balloons Pop, Coin Chase, Number Sequence, Whack-a-Star
 *  2. DOUBLE_CLICK: Treasure Chest, Canadian Photo Viewer, App Launcher, Speed Gauge Test
 *  3. RIGHT_CLICK: Color Palette, File Renaming, Image Inspector, Context Menu Actions
 *  4. DRAG_DROP: Apple Picker Tree, Shape Sorter, Canadian Backpack Packer, Recycle Bin
 *  5. TEXT_SELECT: Word Selector ("Canada"), Emergency Numbers ("911"), Postal Codes ("K1A 0B1"), Full Sentence Highlighter
 *  6. SCROLL_WHEEL: Canadian Trail Scavenger Hunt, Grocery Receipt Finder, Coast-to-Coast Map, Terms & Conditions Unlock
 *
 * Designed with large friendly targets, high-contrast colors, Web Audio sound effects,
 * particle confetti animations, and full offline reporting.
 */

const MouseTrainer = {
  currentSkill: 'CLICK_PRECISION',
  currentLevel: 0,
  score: 0,
  stars: 0,
  mistakes: 0,
  startTime: null,
  timerInterval: null,
  elapsedSeconds: 0,
  soundEnabled: true,
  audioCtx: null,
  isFullscreen: false,
  boundFsKeyHandler: null,

  // Level State
  targetClicksNeeded: 5,
  currentClicks: 0,
  combo: 0,
  selectedText: '',
  draggedItem: null,
  activeDragState: null,
  doubleClickLastTime: 0,
  sequenceNextExpected: 1,
  constellationNodes: [
    { num: 1, x: 16, y: 66 },
    { num: 2, x: 34, y: 26 },
    { num: 3, x: 52, y: 70 },
    { num: 4, x: 70, y: 28 },
    { num: 5, x: 86, y: 62 }
  ],

  // Track sequence & auto-advance timers
  skillOrder: ['CLICK_PRECISION', 'DOUBLE_CLICK', 'RIGHT_CLICK', 'DRAG_DROP', 'TEXT_SELECT', 'SCROLL_WHEEL'],
  autoAdvanceTimer: null,
  autoAdvanceInterval: null,
  coinTimer: null,
  rhythmTimer: null,

  skills: {
    CLICK_PRECISION: {
      id: 'CLICK_PRECISION',
      title: '1. Click Precision',
      icon: '🎯',
      color: '#3b82f6',
      badge: 'Single Click',
      description: 'Master hand-eye coordination with large targets & moving coins (TechLit Coin Chase style)',
      levels: [
        { id: 'c1', name: 'Giant Balloon Pop', icon: '🎈', targetCount: 5, hint: 'Click 5 giant colorful balloons to pop them!' },
        { id: 'c2', name: 'Coin Chase 🪙', icon: '🪙', targetCount: 6, hint: 'Collect 6 shiny coins before they disappear!' },
        { id: 'c3', name: 'Number Sequence (1 to 5)', icon: '🔢', targetCount: 5, hint: 'Click the large numbers in order: 1 ➔ 2 ➔ 3 ➔ 4 ➔ 5' },
        { id: 'c4', name: 'Whack-a-Star ⭐', icon: '⭐', targetCount: 6, hint: 'Click the glowing stars when they pop up!' }
      ]
    },
    DOUBLE_CLICK: {
      id: 'DOUBLE_CLICK',
      title: '2. Double Click',
      icon: '⚡',
      color: '#8b5cf6',
      badge: 'Speed & Timing',
      description: 'Practice two fast clicks in under 450ms with instant speed feedback & unlocked rewards',
      levels: [
        { id: 'dc1', name: 'Golden Treasure Chest', icon: '🎁', targetCount: 3, hint: 'Double-click the chest fast to unlock jewels!' },
        { id: 'dc2', name: 'Canadian Landmark Photos', icon: '🖼️', targetCount: 3, hint: 'Double-click 3 thumbnail cards to view full Canadian photos!' },
        { id: 'dc3', name: 'App Launcher 🇨🇦', icon: '💻', targetCount: 2, hint: 'Double-click desktop icons to launch applications!' },
        { id: 'dc4', name: 'Speed Gauge Challenge', icon: '⏱️', targetCount: 3, hint: 'Hit the speed target zone (under 400 milliseconds)!' }
      ]
    },
    RIGHT_CLICK: {
      id: 'RIGHT_CLICK',
      title: '3. Right Click Menu',
      icon: '🖱️',
      color: '#0284c7',
      badge: 'Context Menus',
      description: 'Open and navigate context menus with the right mouse button or two-finger trackpad tap',
      levels: [
        { id: 'rc1', name: 'Color Changer Palette', icon: '🎨', targetCount: 1, hint: 'Right-click the card and choose "Turn Emerald Green"!' },
        { id: 'rc2', name: 'Document Rename', icon: '📄', targetCount: 1, hint: 'Right-click the document and choose "Rename Document"!' },
        { id: 'rc3', name: 'Image Inspector', icon: '🔍', targetCount: 1, hint: 'Right-click the Canadian Flag and click "Inspect Properties"!' },
        { id: 'rc4', name: 'Quick Action Copy/Paste', icon: '📋', targetCount: 1, hint: 'Right-click the certificate and select "Copy to Clipboard"!' }
      ]
    },
    DRAG_DROP: {
      id: 'DRAG_DROP',
      title: '4. Drag and Drop',
      icon: '📦',
      color: '#10b981',
      badge: 'Apple Picker & Sorters',
      description: 'Hold down the left button while moving objects across the screen into dropzones',
      levels: [
        { id: 'dd1', name: 'TechLit Apple Picker 🍎', icon: '🍎', targetCount: 4, hint: 'Pick 4 ripe red apples from the tree and drop them in the basket!' },
        { id: 'dd2', name: 'Geometric Shape Sorter', icon: '🔺', targetCount: 4, hint: 'Drag colorful shapes into their matching silhouette slots!' },
        { id: 'dd3', name: 'Canada Travel Backpack 🎒', icon: '🎒', targetCount: 4, hint: 'Pack 4 newcomer essentials (Passport, Mittens, Maple Pin, Health Card)!' },
        { id: 'dd4', name: 'Recycle Bin Cleanup 🗑️', icon: '🗑️', targetCount: 3, hint: 'Drag junk spam files into the Recycle Bin to clean the desktop!' }
      ]
    },
    TEXT_SELECT: {
      id: 'TEXT_SELECT',
      title: '5. Text Selection',
      icon: '✍️',
      color: '#f59e0b',
      badge: 'Highlighter & Copy',
      description: 'Click and drag across letters and words to highlight text (TechLit Word Selector style)',
      levels: [
        { id: 'ts1', name: 'Word Selector: "Canada"', icon: '🇨🇦', targetCount: 3, hint: 'Click and drag over the word "Canada" in each sentence!' },
        { id: 'ts2', name: 'Emergency Hotline 911', icon: '🚨', targetCount: 3, hint: 'Highlight the hotline number "911" or "211" to copy it!' },
        { id: 'ts3', name: 'Canadian Postal Code 📮', icon: '📮', targetCount: 3, hint: 'Click and drag to highlight the postal code "K1A 0B1"!' },
        { id: 'ts4', name: 'Full Sentence Highlighter 📝', icon: '📝', targetCount: 2, hint: 'Highlight the entire sentence from the first to the last word!' }
      ]
    },
    SCROLL_WHEEL: {
      id: 'SCROLL_WHEEL',
      title: '6. Scroll Wheel',
      icon: '📜',
      color: '#ec4899',
      badge: 'Scavenger Hunt',
      description: 'Use the scroll wheel or trackpad two-finger gesture to explore long pages & find targets',
      levels: [
        { id: 'sw1', name: 'Maple Leaf Scavenger Hunt 🍁', icon: '🍁', targetCount: 1, hint: 'Scroll down through the Canadian forest trail to find the Golden Maple Leaf!' },
        { id: 'sw2', name: 'Grocery Store Receipt 🛒', icon: '🛒', targetCount: 1, hint: 'Scroll down the long grocery list to find and click "Confirm Bread & Milk"!' },
        { id: 'sw3', name: 'Coast-to-Coast Expedition 🇨🇦', icon: '🏔️', targetCount: 1, hint: 'Scroll from Atlantic St. John’s all the way to Pacific Vancouver!' },
        { id: 'sw4', name: 'Terms of Service Agreement 📜', icon: '✅', targetCount: 1, hint: 'Scroll all the way to the bottom of the document to unlock the "I Agree" button!' }
      ]
    }
  },

  init(containerElement, skillKey = 'CLICK_PRECISION', levelIndex = 0) {
    this.stopTimer();
    this.cleanupTimers();
    this.currentSkill = this.skills[skillKey] ? skillKey : 'CLICK_PRECISION';
    this.currentLevel = Math.max(0, Math.min(levelIndex, 3));
    this.score = 0;
    this.stars = 0;
    this.mistakes = 0;
    this.elapsedSeconds = 0;
    this.startTime = Date.now();
    this.startTimer();
    this.bindFullscreenKeyListener();

    this.renderLab(containerElement);
  },

  bindFullscreenKeyListener() {
    if (this.boundFsKeyHandler || typeof window === 'undefined' || !window.addEventListener) return;
    this.boundFsKeyHandler = (e) => {
      if (e.key === 'Escape' && this.isFullscreen) {
        this.exitFullscreen();
      }
    };
    window.addEventListener('keydown', this.boundFsKeyHandler);
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
    const root = document.getElementById('mouse-lab-root');
    const btn = document.getElementById('mouse-fullscreen-btn');
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
    this.stopTimer();
    this.containerEl = null;
    if (this.boundFsKeyHandler && typeof window !== 'undefined' && window.removeEventListener) {
      window.removeEventListener('keydown', this.boundFsKeyHandler);
      this.boundFsKeyHandler = null;
    }
    if (typeof App !== 'undefined') {
      App.activeLab = null;
      App.renderModulesList();
    }
  },

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
      const timerEl = document.getElementById('mouse-lab-timer');
      if (timerEl) {
        const m = Math.floor(this.elapsedSeconds / 60);
        const s = this.elapsedSeconds % 60;
        timerEl.textContent = `⏱️ ${m}:${s < 10 ? '0' : ''}${s}`;
      }
    }, 1000);
  },

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.cleanupTimers();
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
    if (this.coinTimer) {
      clearTimeout(this.coinTimer);
      this.coinTimer = null;
    }
    if (this.rhythmTimer) {
      clearTimeout(this.rhythmTimer);
      this.rhythmTimer = null;
    }
    this.cleanupPointerDrag();
  },

  cleanupPointerDrag() {
    if (this.activeDragState) {
      if (this.activeDragState.ghost && this.activeDragState.ghost.parentNode) {
        this.activeDragState.ghost.parentNode.removeChild(this.activeDragState.ghost);
      }
      if (this.activeDragState.moveHandler && typeof document !== 'undefined') {
        document.removeEventListener('mousemove', this.activeDragState.moveHandler);
        document.removeEventListener('mouseup', this.activeDragState.upHandler);
      }
      this.activeDragState = null;
    }
  },

  spawnClickEffect(evt, label = '+100', color = '#059669') {
    if (typeof document === 'undefined') return;
    const fxLayer = document.getElementById('mouse-fx-layer');
    const stage = document.getElementById('mouse-stage-container');
    if (!fxLayer || !stage || !stage.getBoundingClientRect) return;

    const rect = stage.getBoundingClientRect();
    let x = rect.width / 2;
    let y = rect.height / 2;
    if (evt && typeof evt.clientX === 'number' && evt.clientX > 0) {
      x = evt.clientX - rect.left;
      y = evt.clientY - rect.top;
    }

    const ripple = document.createElement('div');
    ripple.className = 'click-ripple-fx';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.borderColor = color;
    fxLayer.appendChild(ripple);

    const popup = document.createElement('div');
    popup.className = 'score-float-fx';
    popup.style.left = `${x}px`;
    popup.style.top = `${y - 8}px`;
    popup.style.color = color;
    popup.textContent = label;
    fxLayer.appendChild(popup);

    setTimeout(() => {
      if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
      if (popup.parentNode) popup.parentNode.removeChild(popup);
    }, 850);
  },

  awardScore(evt, customText = '') {
    this.combo++;
    const pts = 100 * Math.min(4, Math.max(1, this.combo));
    this.score += pts;

    const scoreEl = document.getElementById('mouse-lab-score');
    const comboEl = document.getElementById('mouse-lab-combo');
    if (scoreEl) scoreEl.innerHTML = `💎 Score: <strong>${this.score}</strong>`;
    if (comboEl) {
      comboEl.innerHTML = `🔥 Combo: <strong>x${this.combo}</strong>`;
      comboEl.classList.toggle('combo-hot', this.combo >= 2);
    }

    const label = customText || (this.combo >= 2 ? `+${pts} 🔥x${this.combo}` : `+${pts}`);
    this.spawnClickEffect(evt, label, this.combo >= 3 ? '#d97706' : '#059669');
  },

  resetCombo() {
    this.combo = 0;
    const comboEl = document.getElementById('mouse-lab-combo');
    if (comboEl) {
      comboEl.innerHTML = `🔥 Combo: <strong>x0</strong>`;
      comboEl.classList.remove('combo-hot');
    }
  },

  renderMouseGuideWidget() {
    let leftCls = '';
    let rightCls = '';
    let wheelCls = '';
    let label = 'Left Click';

    switch (this.currentSkill) {
      case 'CLICK_PRECISION':
        leftCls = 'mg-btn-active-green';
        label = '1× Left Click (Green)';
        break;
      case 'DOUBLE_CLICK':
        leftCls = 'mg-btn-double-green';
        label = '2× Fast Tap-Tap!';
        break;
      case 'RIGHT_CLICK':
        rightCls = 'mg-btn-active-orange';
        label = '1× Right Click (Orange)';
        break;
      case 'DRAG_DROP':
        leftCls = 'mg-btn-active-green';
        label = 'Hold Left + Drag';
        break;
      case 'TEXT_SELECT':
        leftCls = 'mg-btn-active-green';
        label = 'Hold Left + Highlight';
        break;
      case 'SCROLL_WHEEL':
        wheelCls = 'mg-wheel-active';
        label = 'Roll Center Wheel';
        break;
    }

    return `
      <div class="mouse-guide-hud" title="Visual Mouse Action Guide">
        <svg class="mouse-guide-svg" viewBox="0 0 48 64" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="40" height="56" rx="20" fill="#f8fafc" stroke="#94a3b8" stroke-width="2.5" />
          <path d="M6 26 L6 22 A18 18 0 0 1 23 5 L23 26 Z" fill="#e2e8f0" class="${leftCls}" />
          <path d="M25 5 A18 18 0 0 1 42 22 L42 26 L25 26 Z" fill="#e2e8f0" class="${rightCls}" />
          <line x1="24" y1="5" x2="24" y2="26" stroke="#94a3b8" stroke-width="2" />
          <line x1="6" y1="26" x2="42" y2="26" stroke="#cbd5e1" stroke-width="1.5" />
          <rect x="20.5" y="10" width="7" height="13" rx="3.5" fill="#64748b" class="${wheelCls}" />
        </svg>
        <span class="mg-label">${label}</span>
      </div>
    `;
  },

  renderStageHud(introHtml) {
    return `
      <div class="stage-top-hud">
        <p class="playground-intro-text">${introHtml}</p>
        ${this.renderMouseGuideWidget()}
      </div>
    `;
  },

  replayLevel() {
    this.cleanupTimers();
    this.setLevel(this.currentLevel);
  },

  nextExercise() {
    this.cleanupTimers();
    const currentSkillObj = this.skills[this.currentSkill];
    const totalLevels = currentSkillObj ? currentSkillObj.levels.length : 4;

    if (this.currentLevel < totalLevels - 1) {
      // Advance to next level in current skill
      this.setLevel(this.currentLevel + 1);
    } else {
      // Current skill completed! Save skill metrics for Admin
      this.recordTrackCompletionMetric();

      // Find next skill in track order
      const skillIdx = this.skillOrder.indexOf(this.currentSkill);
      if (skillIdx >= 0 && skillIdx < this.skillOrder.length - 1) {
        const nextSkillKey = this.skillOrder[skillIdx + 1];
        this.setSkill(nextSkillKey);
      } else {
        // All 6 skills completed!
        this.renderGrandCompletion();
      }
    }
  },

  setSkill(skillKey) {
    this.cleanupTimers();
    this.currentSkill = skillKey;
    this.currentLevel = 0;
    this.currentClicks = 0;
    this.renderLab();
  },

  setLevel(levelIndex) {
    this.cleanupTimers();
    this.currentLevel = levelIndex;
    this.currentClicks = 0;
    this.renderLab();
  },

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    const btn = document.getElementById('mouse-sound-btn');
    if (btn) {
      btn.innerHTML = this.soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
      btn.classList.toggle('active', this.soundEnabled);
    }
  },

  playSound(type = 'pop') {
    if (!this.soundEnabled) return;
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) this.audioCtx = new AudioContextClass();
      }
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      if (type === 'pop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.audioCtx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.08);
      } else if (type === 'coin') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(987, this.audioCtx.currentTime);
        osc.frequency.setValueAtTime(1318, this.audioCtx.currentTime + 0.07);
        gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.22);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.22);
      } else if (type === 'success') {
        // Cheerful major chord arpeggio
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const o = this.audioCtx.createOscillator();
          const g = this.audioCtx.createGain();
          o.connect(g);
          g.connect(this.audioCtx.destination);
          o.frequency.setValueAtTime(freq, this.audioCtx.currentTime + i * 0.06);
          g.gain.setValueAtTime(0.05, this.audioCtx.currentTime + i * 0.06);
          g.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + i * 0.06 + 0.25);
          o.start(this.audioCtx.currentTime + i * 0.06);
          o.stop(this.audioCtx.currentTime + i * 0.06 + 0.25);
        });
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(0.07, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.15);
      }
    } catch {}
  },

  triggerConfetti() {
    const canvas = document.getElementById('mouse-confetti-canvas');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.parentElement.clientWidth || 800;
    canvas.height = canvas.parentElement.clientHeight || 450;

    const particles = [];
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 60,
        y: canvas.height / 2 + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 1.2) * 10,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        alpha: 1
      });
    }

    let frame = 0;
    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.rotation += p.rotSpeed;
        p.alpha -= 0.015;
        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });
      if (alive && frame < 70) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    animate();
  },

  renderLab(container) {
    const parent = container || this.containerEl || document.getElementById('lesson-content-viewport') || document.getElementById('app-main-content');
    if (!parent) return;
    this.containerEl = parent;

    const skill = this.skills[this.currentSkill];
    const level = skill.levels[this.currentLevel];
    const skillNum = Object.keys(this.skills).indexOf(this.currentSkill) + 1;

    parent.innerHTML = `
      <div id="mouse-lab-root" class="mouse-lab-master-wrapper ${this.isFullscreen ? 'lab-fullscreen-active' : ''}" style="--skill-color: ${skill.color};">
        <!-- Studio Command Header -->
        <div class="lab-header-banner">
          <div class="lab-header-main">
            <div class="lab-eyebrow-row">
              <span class="lab-studio-badge">🖱️ Mouse Precision Studio • 24 Drills</span>
              <span class="lab-track-meta">${skill.title}</span>
            </div>
            <h2 class="lab-header-title">
              <span>${level.icon}</span>
              <span>${level.name}</span>
            </h2>
            <p class="lab-header-objective">
              💡 <strong>Objective:</strong> ${level.hint}
            </p>
          </div>

          <div class="lab-actions-group">
            <button id="mouse-sound-btn" class="btn-secondary btn-sm" onclick="MouseTrainer.toggleSound()">
              ${this.soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF'}
            </button>
            <button class="btn-secondary btn-sm" onclick="MouseTrainer.replayLevel()">
              🔄 Reset Level
            </button>
            <button
              id="mouse-fullscreen-btn"
              type="button"
              class="btn-secondary btn-sm btn-fullscreen-lab ${this.isFullscreen ? 'is-active' : ''}"
              aria-pressed="${this.isFullscreen ? 'true' : 'false'}"
              onclick="MouseTrainer.toggleFullscreen()"
            >
              ${this.isFullscreen ? '⤓ Exit Fullscreen' : '⛶ Fullscreen'}
            </button>
            <button class="btn-secondary btn-sm" onclick="MouseTrainer.exitLab()">
              ✕ Exit Lab
            </button>
          </div>
        </div>

        <!-- 6 Core Skill Category Tabs -->
        <div class="mouse-skills-nav-bar">
          ${Object.values(this.skills).map((sk, idx) => `
            <button 
              class="mouse-skill-tab-btn ${sk.id === this.currentSkill ? 'active' : ''}" 
              style="--skill-color: ${sk.color};"
              onclick="MouseTrainer.setSkill('${sk.id}')"
            >
              <div class="skill-tab-top">
                <span class="skill-tab-num">0${idx + 1}</span>
                <span class="skill-tab-icon">${sk.icon}</span>
              </div>
              <span class="skill-tab-title">${sk.title.split('. ')[1] || sk.title}</span>
              <span class="skill-tab-badge">${sk.badge}</span>
            </button>
          `).join('')}
        </div>

        <!-- 4 Level Stepper Strip -->
        <div class="mouse-level-pills-bar">
          <span class="level-bar-label">Levels</span>
          ${skill.levels.map((lvl, idx) => `
            <button 
              class="level-pill-btn ${idx === this.currentLevel ? 'active' : ''}"
              onclick="MouseTrainer.setLevel(${idx})"
            >
              ${lvl.icon} L${idx + 1}: ${lvl.name}
            </button>
          `).join('')}
        </div>

        <!-- Live Telemetry HUD Strip -->
        <div class="mouse-live-strip">
          <div class="mouse-stat-pill" id="mouse-lab-progress">
            🎯 Progress: <strong>${this.currentClicks} / ${level.targetCount}</strong>
          </div>
          <div class="mouse-stat-pill" id="mouse-lab-score">
            💎 Score: <strong>${this.score}</strong>
          </div>
          <div class="mouse-stat-pill ${this.combo >= 2 ? 'combo-hot' : ''}" id="mouse-lab-combo">
            🔥 Combo: <strong>x${this.combo}</strong>
          </div>
          <div class="mouse-stat-pill" id="mouse-lab-stars">
            ⭐ Stars: <strong>${this.stars}</strong>
          </div>
          <div class="mouse-stat-pill" id="mouse-lab-timer">
            ⏱️ 0:00
          </div>
          <div class="mouse-stat-pill track-pill">
            Skill <strong>${skillNum} of 6</strong> • Level <strong>${this.currentLevel + 1} of 4</strong>
          </div>
        </div>

        <!-- Interactive Studio Stage Area -->
        <div class="mouse-stage-card" id="mouse-stage-container">
          <canvas id="mouse-confetti-canvas" class="mouse-confetti-layer"></canvas>
          <div id="mouse-fx-layer" class="mouse-fx-layer"></div>
          <div id="mouse-interactive-viewport" class="mouse-interactive-viewport">
            <!-- Dynamically populated based on active skill & level -->
          </div>
        </div>
      </div>
    `;

    this.syncFullscreenUI();
    this.renderActiveLevelContent();
  },

  renderActiveLevelContent() {
    const viewport = document.getElementById('mouse-interactive-viewport');
    if (!viewport) return;

    this.cleanupTimers();
    this.currentClicks = 0;
    this.sequenceNextExpected = 1;

    switch (this.currentSkill) {
      case 'CLICK_PRECISION':
        this.renderClickPrecision(viewport);
        break;
      case 'DOUBLE_CLICK':
        this.renderDoubleClick(viewport);
        break;
      case 'RIGHT_CLICK':
        this.renderRightClick(viewport);
        break;
      case 'DRAG_DROP':
        this.renderDragDrop(viewport);
        break;
      case 'TEXT_SELECT':
        this.renderTextSelect(viewport);
        break;
      case 'SCROLL_WHEEL':
        this.renderScrollWheel(viewport);
        break;
    }
  },

  // --------------------------------------------------------------------------
  // 1. CLICK PRECISION (Sky Balloons, Coin Chase, Constellation, Cosmic Stars)
  // --------------------------------------------------------------------------
  renderClickPrecision(container) {
    if (this.currentLevel === 0) {
      const balloons = [
        { color: '#ef4444', label: '1', left: 9, top: 26, delay: '0s' },
        { color: '#3b82f6', label: '2', left: 27, top: 44, delay: '0.35s' },
        { color: '#10b981', label: '3', left: 46, top: 18, delay: '0.7s' },
        { color: '#f59e0b', label: '4', left: 65, top: 46, delay: '1.05s' },
        { color: '#8b5cf6', label: '5', left: 82, top: 24, delay: '1.4s' }
      ];
      container.innerHTML = `
        <div class="stage-centered-panel">
          ${this.renderStageHud('🎈 <strong>Sky Balloon Pop:</strong> Left-click each floating balloon to pop it!')}
          <div class="sky-arena" id="balloons-field">
            <span class="sky-cloud c1" aria-hidden="true">☁️</span>
            <span class="sky-cloud c2" aria-hidden="true">☁️</span>
            ${balloons.map((b, i) => `
              <div
                class="giant-balloon-target"
                id="balloon-${i}"
                style="left: ${b.left}%; top: ${b.top}%; animation-delay: ${b.delay}; background: radial-gradient(circle at 35% 28%, ${b.color}, #0f172a);"
                onclick="MouseTrainer.popBalloon(${i}, event)"
              >
                <span class="balloon-num">${b.label}</span>
                <span class="balloon-string"></span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (this.currentLevel === 1) {
      container.innerHTML = `
        <div class="stage-centered-panel" id="coin-chase-board">
          ${this.renderStageHud('🪙 <strong>Coin Chase:</strong> Catch 6 gold coins before the timer ring runs out!')}
          <div id="coin-target-slot" class="coin-chase-arena">
            <!-- Dynamic Coin generated via spawnCoin() -->
          </div>
        </div>
      `;
      this.spawnCoin();
    } else if (this.currentLevel === 2) {
      container.innerHTML = `
        <div class="stage-centered-panel">
          ${this.renderStageHud('✨ <strong>Constellation Connect:</strong> Click stars in order: <strong>1 ➔ 2 ➔ 3 ➔ 4 ➔ 5</strong>')}
          <div class="constellation-arena">
            <svg class="constellation-svg" id="constellation-svg" viewBox="0 0 100 100" preserveAspectRatio="none"></svg>
            ${this.constellationNodes.map(node => `
              <button
                class="sequence-num-btn star-node"
                id="seq-btn-${node.num}"
                style="left: ${node.x}%; top: ${node.y}%;"
                onclick="MouseTrainer.clickSequenceNum(${node.num}, event)"
              >
                ${node.num}
              </button>
            `).join('')}
          </div>
          <div id="sequence-feedback" class="sequence-feedback-text">
            Next expected star: <strong>[1]</strong>
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="stage-centered-panel">
          ${this.renderStageHud('⭐ <strong>Cosmic Whack-a-Star:</strong> Click the glowing stars as they light up!')}
          <div class="whack-star-grid">
            ${[0, 1, 2, 3, 4, 5].map(idx => `
              <div class="star-hole" id="star-hole-${idx}" onclick="MouseTrainer.clickStarHole(${idx}, event)">
                <span class="star-icon" id="star-icon-${idx}">⭐</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      this.activateRandomStar();
    }
  },

  popBalloon(index, evt) {
    const el = document.getElementById(`balloon-${index}`);
    if (!el || el.classList.contains('popped')) return;

    el.classList.add('popped');
    this.playSound('pop');
    this.triggerConfetti();
    this.awardScore(evt);
    this.currentClicks++;
    this.updateProgressUI();

    if (this.currentClicks >= 5) {
      this.completeLevelSuccess();
    }
  },

  spawnCoin() {
    if (this.coinTimer) {
      clearTimeout(this.coinTimer);
      this.coinTimer = null;
    }
    const slot = document.getElementById('coin-target-slot');
    if (!slot) return;
    const width = slot.clientWidth || 640;
    const height = slot.clientHeight || 350;
    const maxX = Math.max(40, width - 105);
    const maxY = Math.max(40, height - 105);
    const randX = Math.max(20, Math.floor(Math.random() * maxX));
    const randY = Math.max(20, Math.floor(Math.random() * maxY));

    slot.innerHTML = `
      <div
        class="giant-gold-coin"
        style="top: ${randY}px; left: ${randX}px;"
        onclick="MouseTrainer.collectCoin(this, event)"
      >
        <svg class="coin-ring-svg" viewBox="0 0 100 100" aria-hidden="true">
          <circle class="coin-ring-arc" cx="50" cy="50" r="44"></circle>
        </svg>
        <span>🪙</span>
      </div>
    `;

    this.coinTimer = setTimeout(() => {
      if (this.currentSkill === 'CLICK_PRECISION' && this.currentLevel === 1 && this.currentClicks < 6) {
        this.resetCombo();
        this.spawnCoin();
      }
    }, 3200);
  },

  collectCoin(coinEl, evt) {
    if (!coinEl || coinEl.classList.contains('coin-collected')) return;
    if (this.coinTimer) {
      clearTimeout(this.coinTimer);
      this.coinTimer = null;
    }
    this.playSound('coin');
    this.triggerConfetti();
    this.awardScore(evt);
    coinEl.classList.add('coin-collected');
    this.currentClicks++;
    this.updateProgressUI();

    if (this.currentClicks >= 6) {
      this.coinTimer = setTimeout(() => this.completeLevelSuccess(), 350);
    } else {
      this.coinTimer = setTimeout(() => this.spawnCoin(), 250);
    }
  },

  clickSequenceNum(num, evt) {
    const fb = document.getElementById('sequence-feedback');
    const btn = document.getElementById(`seq-btn-${num}`);
    if (num === this.sequenceNextExpected) {
      this.playSound('coin');
      if (btn) btn.classList.add('completed');

      if (num > 1) {
        const svg = document.getElementById('constellation-svg');
        const prev = this.constellationNodes[num - 2];
        const curr = this.constellationNodes[num - 1];
        if (svg && prev && curr) {
          if (typeof document.createElementNS === 'function') {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('class', 'constellation-line');
            line.setAttribute('vector-effect', 'non-scaling-stroke');
            line.setAttribute('x1', String(prev.x));
            line.setAttribute('y1', String(prev.y));
            line.setAttribute('x2', String(curr.x));
            line.setAttribute('y2', String(curr.y));
            svg.appendChild(line);
          } else {
            svg.innerHTML += `<line class="constellation-line" vector-effect="non-scaling-stroke" x1="${prev.x}" y1="${prev.y}" x2="${curr.x}" y2="${curr.y}" />`;
          }
        }
      }

      this.awardScore(evt);
      this.currentClicks++;
      this.sequenceNextExpected++;
      this.updateProgressUI();

      if (fb) {
        if (this.sequenceNextExpected <= 5) {
          fb.innerHTML = `Great! Next star: <strong>[${this.sequenceNextExpected}]</strong>`;
        } else {
          fb.innerHTML = `🌟 Constellation Linked!`;
        }
      }

      if (this.currentClicks >= 5) {
        this.triggerConfetti();
        this.completeLevelSuccess();
      }
    } else {
      this.mistakes++;
      this.resetCombo();
      this.playSound('error');
      this.spawnClickEffect(evt, 'Oops!', '#ef4444');
      if (btn) {
        btn.classList.add('shake-error');
        setTimeout(() => btn.classList.remove('shake-error'), 300);
      }
      if (fb) {
        fb.innerHTML = `<span style="color: #ef4444;">Oops! Expected [${this.sequenceNextExpected}]. Try again!</span>`;
      }
    }
  },

  activateRandomStar() {
    document.querySelectorAll('.star-hole').forEach(h => h.classList.remove('active'));
    const rand = Math.floor(Math.random() * 6);
    const targetHole = document.getElementById(`star-hole-${rand}`);
    if (targetHole) targetHole.classList.add('active');
  },

  clickStarHole(idx, evt) {
    const hole = document.getElementById(`star-hole-${idx}`);
    if (hole && hole.classList.contains('active')) {
      this.playSound('coin');
      this.triggerConfetti();
      this.awardScore(evt);
      hole.classList.remove('active');
      this.currentClicks++;
      this.updateProgressUI();

      if (this.currentClicks >= 6) {
        this.completeLevelSuccess();
      } else {
        setTimeout(() => this.activateRandomStar(), 250);
      }
    } else {
      this.mistakes++;
      this.resetCombo();
      this.playSound('error');
      this.spawnClickEffect(evt, 'Miss!', '#ef4444');
    }
  },

  // --------------------------------------------------------------------------
  // 2. DOUBLE CLICK (Treasure Vault, Postcards, Mini-OS Desktop, SVG Gauge)
  // --------------------------------------------------------------------------
  renderDoubleClick(container) {
    if (this.currentLevel === 0) {
      container.innerHTML = `
        <div class="stage-centered-panel">
          ${this.renderStageHud('🎁 <strong>Treasure Vault:</strong> Tap TWICE quickly (under 450ms) on the vault to unlock it!')}
          <div class="interactive-chest-box" id="treasure-chest" onclick="MouseTrainer.handleChestFirstClick()" ondblclick="MouseTrainer.handleChestDblClick(this, event)">
            <div class="chest-emoji" id="chest-emoji">🧰</div>
            <div class="chest-title">LOCKED VAULT</div>
            <div class="chest-sub">Double-click fast (beat the 450ms rhythm bar)!</div>
            <div class="rhythm-bar-wrap"><div class="rhythm-bar-fill" id="rhythm-bar-fill"></div></div>
          </div>
          <div id="chest-speed-meter" class="sequence-feedback-text">Tap twice rapidly!</div>
        </div>
      `;
    } else if (this.currentLevel === 1) {
      const photos = [
        { id: 0, title: 'CN Tower, Toronto', emoji: '🗼', bg: 'linear-gradient(135deg, #bae6fd, #60a5fa)', desc: 'Famous Canadian landmark standing 553 meters tall in Ontario.' },
        { id: 1, title: 'Banff National Park', emoji: '🏔️', bg: 'linear-gradient(135deg, #a7f3d0, #38bdf8)', desc: 'Turquoise glacial lakes and Rocky Mountains in Alberta.' },
        { id: 2, title: 'Niagara Falls', emoji: '🌊', bg: 'linear-gradient(135deg, #c7d2fe, #38bdf8)', desc: 'Magnificent cascading waterfalls on the Ontario border.' }
      ];
      container.innerHTML = `
        <div class="stage-centered-panel">
          ${this.renderStageHud('🖼️ <strong>Landmark Postcards:</strong> Double-click each Canadian postcard to inspect it!')}
          <div class="canada-photos-grid">
            ${photos.map(p => `
              <div
                class="canada-photo-card"
                id="photo-card-${p.id}"
                ondblclick="MouseTrainer.handlePhotoDblClick(${p.id}, '${p.title}', '${p.desc}', '${p.emoji}', event)"
              >
                <div class="postcard-art" style="background: ${p.bg};">${p.emoji}</div>
                <div class="photo-title">${p.title}</div>
                <div class="photo-tag">Double-click to open ➜</div>
              </div>
            `).join('')}
          </div>
          <div id="photo-preview-slot" class="photo-expanded-preview" style="display: none;"></div>
        </div>
      `;
    } else if (this.currentLevel === 2) {
      container.innerHTML = `
        <div class="stage-centered-panel">
          ${this.renderStageHud('💻 <strong>Mini-OS Desktop:</strong> Double-click both desktop icons to launch your newcomer tools!')}
          <div class="mini-os-desktop">
            <div class="desktop-apps-grid">
              <div class="desktop-app-icon" id="desktop-app-canada" ondblclick="MouseTrainer.launchDesktopApp('canada', '🍁 Canadian Citizenship Guide', 'Everything you need to know about rights, voting, and community.', event)">
                <div class="app-icon-badge app-canada">🍁</div>
                <div class="app-label">Canada Guide.app</div>
              </div>
              <div class="desktop-app-icon" id="desktop-app-health" ondblclick="MouseTrainer.launchDesktopApp('health', '🩺 Provincial Health Card', 'Application portal for Ontario OHIP / Alberta AHCIP healthcare.', event)">
                <div class="app-icon-badge app-health">🩺</div>
                <div class="app-label">HealthCard.app</div>
              </div>
            </div>
            <div id="desktop-window-slot" class="desktop-window-slot"></div>
            <div class="mini-os-taskbar">
              <span>🍁 WelcomeOS Desktop</span>
              <span id="os-taskbar-status">0 / 2 apps running</span>
              <span>Double-Click Launch</span>
            </div>
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="stage-centered-panel">
          ${this.renderStageHud('⏱️ <strong>Speedometer Test:</strong> Click twice fast (< 450ms) to push the needle into the green zone!')}
          <div class="speed-gauge-card" onclick="MouseTrainer.measureClickSpeed(event)">
            <svg class="gauge-svg" viewBox="0 0 220 120" aria-hidden="true">
              <defs>
                <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#ef4444" />
                  <stop offset="50%" stop-color="#f59e0b" />
                  <stop offset="100%" stop-color="#10b981" />
                </linearGradient>
              </defs>
              <path d="M 22 108 A 88 88 0 0 1 198 108" fill="none" stroke="#e2e8f0" stroke-width="14" stroke-linecap="round" />
              <path d="M 22 108 A 88 88 0 0 1 198 108" fill="none" stroke="url(#gaugeGrad)" stroke-width="14" stroke-linecap="round" opacity="0.88" />
              <g id="gauge-needle" class="gauge-needle" style="transform: rotate(-75deg);">
                <line x1="110" y1="108" x2="110" y2="30" stroke="#1e3a8a" stroke-width="4" stroke-linecap="round" />
                <circle cx="110" cy="108" r="8" fill="#1e3a8a" />
              </g>
            </svg>
            <div class="speed-gauge-cta">CLICK ME FAST (2×)</div>
            <div id="speed-result-display" class="speed-gauge-readout">Ready...</div>
            <div class="speed-gauge-target">Target: Under 450 ms</div>
          </div>
        </div>
      `;
    }
  },

  handleChestFirstClick() {
    const chest = document.getElementById('treasure-chest');
    if (!chest || chest.classList.contains('chest-opened')) return;
    const fill = document.getElementById('rhythm-bar-fill');
    const meter = document.getElementById('chest-speed-meter');
    if (fill) {
      fill.classList.remove('active');
      void fill.offsetWidth;
      fill.classList.add('active');
    }
    if (meter) meter.textContent = '1st tap! Tap again before the bar empties!';
    if (this.rhythmTimer) clearTimeout(this.rhythmTimer);
    this.rhythmTimer = setTimeout(() => {
      if (fill) fill.classList.remove('active');
    }, 450);
  },

  handleChestDblClick(el, evt) {
    if (!el || el.classList.contains('chest-opened')) return;
    if (this.rhythmTimer) {
      clearTimeout(this.rhythmTimer);
      this.rhythmTimer = null;
    }
    this.playSound('success');
    this.triggerConfetti();
    this.awardScore(evt, '💎 Vault Open!');
    el.classList.add('chest-opened');
    const emojiEl = document.getElementById('chest-emoji');
    if (emojiEl) emojiEl.textContent = '💎 🌟 🎁';
    el.innerHTML += `<div class="chest-unlocked-badge">UNLOCKED! 100 Jewels!</div>`;
    const meter = document.getElementById('chest-speed-meter');
    if (meter) meter.innerHTML = `<span style="color: #10b981;">⚡ Great double-click rhythm!</span>`;
    this.currentClicks++;
    this.updateProgressUI();
    setTimeout(() => this.completeLevelSuccess(), 700);
  },

  handlePhotoDblClick(id, title, desc, emoji, evt) {
    const card = document.getElementById(`photo-card-${id}`);
    if (!card || card.classList.contains('opened')) return;
    card.classList.add('opened');
    this.playSound('coin');
    this.triggerConfetti();
    this.awardScore(evt);

    const preview = document.getElementById('photo-preview-slot');
    if (preview) {
      preview.style.display = 'block';
      preview.innerHTML = `
        <div class="photo-preview-emoji">${emoji}</div>
        <h4 class="photo-preview-title">${title}</h4>
        <p class="photo-preview-desc">${desc}</p>
      `;
    }

    this.currentClicks++;
    this.updateProgressUI();
    if (this.currentClicks >= 3) {
      setTimeout(() => this.completeLevelSuccess(), 700);
    }
  },

  launchDesktopApp(appKey, title, desc, evt) {
    const iconEl = document.getElementById(`desktop-app-${appKey}`);
    const alreadyLaunched = iconEl && iconEl.dataset && iconEl.dataset.launched === '1';

    this.playSound('success');
    this.triggerConfetti();
    const winSlot = document.getElementById('desktop-window-slot');
    if (winSlot) {
      winSlot.innerHTML = `
        <div class="virtual-window">
          <div class="virtual-window-header">
            <span class="os-dots">
              <span class="os-dot r"></span>
              <span class="os-dot y"></span>
              <span class="os-dot g"></span>
            </span>
            <span>💻 ${title}</span>
            <span class="virtual-window-meta">[Active]</span>
          </div>
          <div class="virtual-window-body">
            <p class="virtual-window-desc">${desc}</p>
            <div class="virtual-window-ok">
              ✅ Application launched successfully via double-click!
            </div>
          </div>
        </div>
      `;
    }

    if (!alreadyLaunched) {
      if (iconEl && iconEl.dataset) iconEl.dataset.launched = '1';
      this.awardScore(evt);
      this.currentClicks++;
      this.updateProgressUI();
      const statusEl = document.getElementById('os-taskbar-status');
      if (statusEl) statusEl.textContent = `${this.currentClicks} / 2 apps running`;
      if (this.currentClicks >= 2) {
        setTimeout(() => this.completeLevelSuccess(), 800);
      }
    }
  },

  measureClickSpeed(evt) {
    const now = Date.now();
    const display = document.getElementById('speed-result-display');
    const needle = document.getElementById('gauge-needle');
    if (!this.doubleClickLastTime || (now - this.doubleClickLastTime > 1200)) {
      this.doubleClickLastTime = now;
      if (needle) needle.style.transform = 'rotate(-15deg)';
      if (display) display.textContent = '1st click! Click again fast!';
    } else {
      const diff = now - this.doubleClickLastTime;
      this.doubleClickLastTime = 0;
      if (diff <= 450) {
        const angle = Math.round(Math.max(22, Math.min(78, 82 - (diff / 450) * 58)));
        if (needle) needle.style.transform = `rotate(${angle}deg)`;
        this.playSound('success');
        this.triggerConfetti();
        this.awardScore(evt, `⚡ ${diff}ms`);
        if (display) display.innerHTML = `<span style="color: #10b981;">⚡ ${diff} ms (SUPER FAST!)</span>`;
        this.currentClicks++;
        this.updateProgressUI();
        if (this.currentClicks >= 3) {
          setTimeout(() => this.completeLevelSuccess(), 800);
        }
      } else {
        if (needle) needle.style.transform = 'rotate(-62deg)';
        this.mistakes++;
        this.resetCombo();
        this.playSound('error');
        this.spawnClickEffect(evt, `${diff}ms 🐢`, '#f59e0b');
        if (display) display.innerHTML = `<span style="color: #f59e0b;">🐢 ${diff} ms (Too slow, aim under 450ms)</span>`;
      }
    }
  },

  // --------------------------------------------------------------------------
  // 3. RIGHT CLICK (Frosted Glass Context Menu, Color Palette, Rename, Inspect)
  // --------------------------------------------------------------------------
  renderRightClick(container) {
    let icon = '🎨';
    let heading = 'Right-Click to Change Color';
    let desc = 'Right-click inside the card and select «🟢 Turn Emerald Green»';

    if (this.currentLevel === 0) {
      icon = '🎨';
      heading = 'Right-Click to Change Color';
      desc = 'Right-click anywhere inside the card and choose «🟢 Turn Emerald Green»';
    } else if (this.currentLevel === 1) {
      icon = '📄';
      heading = 'Right-Click to Rename Document';
      desc = 'Right-click on the Canadian Resume file and choose «✏️ Rename Document»';
    } else if (this.currentLevel === 2) {
      icon = '🇨🇦';
      heading = 'Right-Click to Inspect Image';
      desc = 'Right-click on the Canadian Flag and choose «🔍 Inspect Properties»';
    } else {
      icon = '📜';
      heading = 'Right-Click to Copy Certificate';
      desc = 'Right-click on the WelcomePlace Certificate and choose «📋 Copy to Clipboard»';
    }

    container.innerHTML = `
      <div class="stage-centered-panel">
        ${this.renderStageHud('🖱️ <strong>Right Click Practice:</strong> Right-click (or 2-finger trackpad tap) to open the menu!')}

        <div class="right-click-zone" id="rc-target-zone" oncontextmenu="MouseTrainer.openContextMenu(event)">
          <div class="rc-target-icon" id="rc-target-icon">${icon}</div>
          <h3 id="rc-target-heading" class="rc-target-heading">
            ${heading}
          </h3>
          <p id="rc-target-desc" class="rc-target-desc">
            ${desc}
          </p>
        </div>

        <!-- Frosted Glass Context Menu -->
        <div id="mouse-custom-menu" class="mouse-custom-menu" style="display: none;"></div>
      </div>
    `;

    if (!this.hasContextMenuGlobalListener && typeof document !== 'undefined' && document.addEventListener) {
      document.addEventListener('click', () => {
        const m = document.getElementById('mouse-custom-menu');
        if (m) m.style.display = 'none';
      });
      this.hasContextMenuGlobalListener = true;
    }
  },

  openContextMenu(e) {
    e.preventDefault();
    const menu = document.getElementById('mouse-custom-menu');
    if (!menu) return;

    this.playSound('pop');
    menu.style.display = 'block';
    const cx = typeof e.clientX === 'number' ? e.clientX : 200;
    const cy = typeof e.clientY === 'number' ? e.clientY : 200;
    menu.style.top = `${Math.max(12, cy - 32)}px`;
    menu.style.left = `${Math.max(12, cx - 12)}px`;

    if (this.currentLevel === 0) {
      menu.innerHTML = `
        <div class="custom-menu-item" onclick="MouseTrainer.handleContextAction('green', event)"><span>🟢 Turn Emerald Green</span><span class="menu-shortcut">⌘G</span></div>
        <div class="custom-menu-item" onclick="MouseTrainer.handleContextAction('blue', event)"><span>🔵 Turn Ocean Blue</span><span class="menu-shortcut">⌘B</span></div>
        <div class="custom-menu-item" onclick="MouseTrainer.handleContextAction('purple', event)"><span>🟣 Turn Royal Purple</span><span class="menu-shortcut">⌘P</span></div>
      `;
    } else if (this.currentLevel === 1) {
      menu.innerHTML = `
        <div class="custom-menu-item" onclick="MouseTrainer.handleContextAction('open', event)"><span>📂 Open File</span><span class="menu-shortcut">⌘O</span></div>
        <div class="custom-menu-item" onclick="MouseTrainer.handleContextAction('rename', event)"><span>✏️ Rename Document</span><span class="menu-shortcut">⌘R</span></div>
        <div class="custom-menu-item" onclick="MouseTrainer.handleContextAction('delete', event)"><span>🗑️ Move to Trash</span><span class="menu-shortcut">⌫</span></div>
      `;
    } else if (this.currentLevel === 2) {
      menu.innerHTML = `
        <div class="custom-menu-item" onclick="MouseTrainer.handleContextAction('copy', event)"><span>📋 Copy Image</span><span class="menu-shortcut">⌘C</span></div>
        <div class="custom-menu-item" onclick="MouseTrainer.handleContextAction('inspect', event)"><span>🔍 Inspect Properties</span><span class="menu-shortcut">⌘I</span></div>
        <div class="custom-menu-item" onclick="MouseTrainer.handleContextAction('save', event)"><span>💾 Save Image As...</span><span class="menu-shortcut">⌘S</span></div>
      `;
    } else {
      menu.innerHTML = `
        <div class="custom-menu-item" onclick="MouseTrainer.handleContextAction('copy_cert', event)"><span>📋 Copy to Clipboard</span><span class="menu-shortcut">⌘C</span></div>
        <div class="custom-menu-item" onclick="MouseTrainer.handleContextAction('print', event)"><span>🖨️ Print Certificate</span><span class="menu-shortcut">⌘P</span></div>
        <div class="custom-menu-item" onclick="MouseTrainer.handleContextAction('share', event)"><span>🔗 Share Online</span><span class="menu-shortcut">⇧⌘S</span></div>
      `;
    }
  },

  handleContextAction(action, evt) {
    const menu = document.getElementById('mouse-custom-menu');
    if (menu) menu.style.display = 'none';

    const zone = document.getElementById('rc-target-zone');
    const heading = document.getElementById('rc-target-heading');
    const isCorrect = (
      (this.currentLevel === 0 && action === 'green') ||
      (this.currentLevel === 1 && action === 'rename') ||
      (this.currentLevel === 2 && action === 'inspect') ||
      (this.currentLevel === 3 && action === 'copy_cert')
    );

    if (isCorrect) {
      this.playSound('success');
      this.triggerConfetti();
      this.awardScore(evt);

      if (zone) {
        zone.classList.add('rc-action-success');
        if (action === 'green') {
          zone.style.background = '#d1fae5';
          zone.style.borderColor = '#10b981';
          if (heading) heading.innerHTML = '✅ Color Changed to Emerald Green!';
        } else if (action === 'rename') {
          zone.style.background = '#eff6ff';
          zone.style.borderColor = '#3b82f6';
          if (heading) heading.innerHTML = '✅ Renamed: <em>Canada_Resume.pdf</em>';
        } else if (action === 'inspect') {
          zone.style.background = '#fef3c7';
          zone.style.borderColor = '#f59e0b';
          if (heading) heading.innerHTML = '✅ Properties: Canadian Flag (1920×1080 SVG)';
        } else if (action === 'copy_cert') {
          zone.style.background = '#ecfdf5';
          zone.style.borderColor = '#10b981';
          if (heading) heading.innerHTML = '✅ Certificate Copied to Clipboard!';
        }
      }

      this.currentClicks++;
      this.updateProgressUI();

      setTimeout(() => this.completeLevelSuccess(), 600);
    } else {
      this.mistakes++;
      this.resetCombo();
      this.playSound('error');
      this.spawnClickEffect(evt, 'Wrong option', '#ef4444');
      if (heading) {
        const prevText = heading.innerHTML;
        heading.innerHTML = `<span style="color: #ef4444;">⚠️ Not quite! Right-click again and select the requested action.</span>`;
        setTimeout(() => {
          if (heading && zone && !zone.classList.contains('rc-action-success')) {
            heading.innerHTML = prevText;
          }
        }, 1800);
      }
    }
  },

  // --------------------------------------------------------------------------
  // 4. DRAG AND DROP (Orchard Apples, SVG Shape Sorter, Backpack, Recycle Bin)
  // --------------------------------------------------------------------------
  renderDragDrop(container) {
    if (this.currentLevel === 0) {
      container.innerHTML = `
        <div class="apple-picker-wrapper">
          ${this.renderStageHud('🍎 <strong>Orchard Apple Picker:</strong> Drag 4 ripe apples from the tree into the basket!')}
          <div class="apple-orchard-scene">
            <div class="apple-tree-canopy">
              <div class="tree-leaves-crown">🌳 Fresh Apple Tree</div>
              <div class="apples-rack">
                ${[1, 2, 3, 4].map(idx => `
                  <div
                    class="picker-apple-draggable"
                    id="apple-${idx}"
                    draggable="true"
                    onmousedown="MouseTrainer.startPointerDrag(event, 'apple-${idx}', 'apple')"
                    ondragstart="MouseTrainer.onDragStart(event, 'apple-${idx}')"
                  >
                    🍎
                  </div>
                `).join('')}
              </div>
            </div>

            <div
              class="wicker-basket-dropzone"
              id="apple-basket-zone"
              ondragover="MouseTrainer.onDragOver(event)"
              ondragleave="MouseTrainer.onDragLeave(event)"
              ondrop="MouseTrainer.onAppleDrop(event)"
            >
              <div class="dropzone-icon-lg">🧺</div>
              <div class="dropzone-title">Apple Basket</div>
              <div class="dropzone-sub">Drop apples here</div>
              <div id="basket-apples-count" class="dropzone-counter">0 / 4 apples</div>
            </div>
          </div>
        </div>
      `;
    } else if (this.currentLevel === 1) {
      const shapes = [
        {
          id: 'circle',
          name: 'Circle',
          svg: '<svg width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="19" fill="#ef4444" stroke="#b91c1c" stroke-width="2.5"/></svg>',
          ghost: '<svg width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="19" fill="none" stroke="#94a3b8" stroke-width="3" stroke-dasharray="5 4"/></svg>'
        },
        {
          id: 'square',
          name: 'Square',
          svg: '<svg width="48" height="48" viewBox="0 0 48 48"><rect x="7" y="7" width="34" height="34" rx="6" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2.5"/></svg>',
          ghost: '<svg width="48" height="48" viewBox="0 0 48 48"><rect x="7" y="7" width="34" height="34" rx="6" fill="none" stroke="#94a3b8" stroke-width="3" stroke-dasharray="5 4"/></svg>'
        },
        {
          id: 'triangle',
          name: 'Triangle',
          svg: '<svg width="48" height="48" viewBox="0 0 48 48"><polygon points="24,6 43,40 5,40" fill="#10b981" stroke="#047857" stroke-width="2.5" stroke-linejoin="round"/></svg>',
          ghost: '<svg width="48" height="48" viewBox="0 0 48 48"><polygon points="24,6 43,40 5,40" fill="none" stroke="#94a3b8" stroke-width="3" stroke-dasharray="5 4" stroke-linejoin="round"/></svg>'
        },
        {
          id: 'star',
          name: 'Star',
          svg: '<svg width="48" height="48" viewBox="0 0 48 48"><polygon points="24,5 29.5,17.5 43,19 33,28.5 35.5,42 24,35 12.5,42 15,28.5 5,19 18.5,17.5" fill="#f59e0b" stroke="#b45309" stroke-width="2.2" stroke-linejoin="round"/></svg>',
          ghost: '<svg width="48" height="48" viewBox="0 0 48 48"><polygon points="24,5 29.5,17.5 43,19 33,28.5 35.5,42 24,35 12.5,42 15,28.5 5,19 18.5,17.5" fill="none" stroke="#94a3b8" stroke-width="2.8" stroke-dasharray="5 4" stroke-linejoin="round"/></svg>'
        }
      ];
      container.innerHTML = `
        <div class="stage-centered-panel">
          ${this.renderStageHud('🔺 <strong>SVG Shape Sorter:</strong> Drag each geometric shape into its matching outline slot!')}
          <div class="shape-sorter-board">
            <div class="shapes-draggable-bank">
              ${shapes.map(s => `
                <div
                  class="shape-draggable-item"
                  id="shape-${s.id}"
                  draggable="true"
                  onmousedown="MouseTrainer.startPointerDrag(event, 'shape-${s.id}', '${s.id}')"
                  ondragstart="MouseTrainer.onDragStart(event, 'shape-${s.id}', '${s.id}')"
                >
                  <span>${s.svg}</span>
                  <span>${s.name}</span>
                </div>
              `).join('')}
            </div>

            <div class="shapes-slots-bank">
              ${shapes.map(s => `
                <div
                  class="shape-slot-dropzone"
                  id="slot-${s.id}"
                  data-expected-shape="${s.id}"
                  ondragover="MouseTrainer.onDragOver(event)"
                  ondragleave="MouseTrainer.onDragLeave(event)"
                  ondrop="MouseTrainer.onShapeDrop(event, '${s.id}')"
                >
                  <span>${s.ghost}</span>
                  <span class="shape-slot-label">${s.name} Slot</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    } else if (this.currentLevel === 2) {
      const items = [
        { id: 'passport', name: 'Passport', emoji: '📘' },
        { id: 'maple', name: 'Maple Leaf Pin', emoji: '🍁' },
        { id: 'gloves', name: 'Winter Gloves', emoji: '🧤' },
        { id: 'card', name: 'Health Card', emoji: '🪪' }
      ];
      container.innerHTML = `
        <div class="stage-centered-panel">
          ${this.renderStageHud('🎒 <strong>Canada Backpack Packer:</strong> Drag all 4 newcomer essentials into your backpack!')}
          <div class="backpack-scene-grid">
            <div class="backpack-items-shelf">
              ${items.map(it => `
                <div
                  class="backpack-drag-item"
                  id="bp-item-${it.id}"
                  draggable="true"
                  onmousedown="MouseTrainer.startPointerDrag(event, 'bp-item-${it.id}', 'backpack')"
                  ondragstart="MouseTrainer.onDragStart(event, 'bp-item-${it.id}')"
                >
                  <span class="shape-emoji-lg">${it.emoji}</span>
                  <span>${it.name}</span>
                </div>
              `).join('')}
            </div>

            <div
              class="backpack-dropzone"
              id="backpack-drop-zone"
              ondragover="MouseTrainer.onDragOver(event)"
              ondragleave="MouseTrainer.onDragLeave(event)"
              ondrop="MouseTrainer.onBackpackDrop(event)"
            >
              <div class="dropzone-icon-lg">🎒</div>
              <div class="dropzone-title">Canada Travel Backpack</div>
              <div id="backpack-counter" class="dropzone-counter">0 / 4 packed</div>
            </div>
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="stage-centered-panel">
          ${this.renderStageHud('🗑️ <strong>Desktop Cleanup:</strong> Drag the 3 junk spam files into the Recycle Bin!')}
          <div class="recycle-scene-grid">
            <div class="trash-files-rack">
              <div class="trash-file-item" id="spam-1" draggable="true" onmousedown="MouseTrainer.startPointerDrag(event, 'spam-1', 'recycle')" ondragstart="MouseTrainer.onDragStart(event, 'spam-1')">
                📄 Junk_Ad_01.tmp
              </div>
              <div class="trash-file-item" id="spam-2" draggable="true" onmousedown="MouseTrainer.startPointerDrag(event, 'spam-2', 'recycle')" ondragstart="MouseTrainer.onDragStart(event, 'spam-2')">
                📄 Unknown_Spam.exe
              </div>
              <div class="trash-file-item" id="spam-3" draggable="true" onmousedown="MouseTrainer.startPointerDrag(event, 'spam-3', 'recycle')" ondragstart="MouseTrainer.onDragStart(event, 'spam-3')">
                📄 Old_Cache.log
              </div>
            </div>

            <div
              class="recycle-bin-dropzone"
              id="recycle-bin-zone"
              ondragover="MouseTrainer.onDragOver(event)"
              ondragleave="MouseTrainer.onDragLeave(event)"
              ondrop="MouseTrainer.onRecycleDrop(event)"
            >
              <div class="dropzone-icon-lg">🗑️</div>
              <div class="dropzone-title">Recycle Bin</div>
              <div id="trash-counter" class="dropzone-counter">0 / 3 cleaned</div>
            </div>
          </div>
        </div>
      `;
    }
  },

  startPointerDrag(e, elemId, dragKind = '') {
    if (e && typeof e.button === 'number' && e.button !== 0) return;
    if (typeof document === 'undefined' || !document.body) return;
    if (e && e.preventDefault) e.preventDefault();

    const srcEl = document.getElementById(elemId);
    if (!srcEl || srcEl.style.display === 'none') return;

    this.cleanupPointerDrag();
    this.playSound('pop');

    const ghost = document.createElement('div');
    ghost.className = 'drag-ghost-clone';
    ghost.innerHTML = srcEl.innerHTML;
    ghost.style.left = `${e.clientX}px`;
    ghost.style.top = `${e.clientY}px`;
    document.body.appendChild(ghost);
    srcEl.style.opacity = '0.35';

    const hitTest = (cx, cy, selector) => {
      const nodes = document.querySelectorAll(selector);
      let hit = null;
      nodes.forEach(node => {
        node.classList.remove('drop-hover');
        if (!node.getBoundingClientRect) return;
        const r = node.getBoundingClientRect();
        if (cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom) {
          hit = node;
        }
      });
      return hit;
    };

    const targetSelector = this.currentLevel === 0
      ? '#apple-basket-zone'
      : this.currentLevel === 1
        ? '.shape-slot-dropzone'
        : this.currentLevel === 2
          ? '#backpack-drop-zone'
          : '#recycle-bin-zone';

    const moveHandler = mv => {
      ghost.style.left = `${mv.clientX}px`;
      ghost.style.top = `${mv.clientY}px`;
      const over = hitTest(mv.clientX, mv.clientY, targetSelector);
      if (over) over.classList.add('drop-hover');
    };

    const upHandler = up => {
      srcEl.style.opacity = '';
      const droppedOn = hitTest(up.clientX, up.clientY, targetSelector);
      this.cleanupPointerDrag();
      if (!droppedOn) return;

      if (this.currentLevel === 0) {
        this.processAppleDrop(elemId, up);
      } else if (this.currentLevel === 1) {
        const expected = droppedOn.getAttribute ? droppedOn.getAttribute('data-expected-shape') : '';
        this.processShapeDrop(elemId, dragKind, expected, droppedOn, up);
      } else if (this.currentLevel === 2) {
        this.processBackpackDrop(elemId, up);
      } else {
        this.processRecycleDrop(elemId, up);
      }
    };

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
    this.activeDragState = { elemId, dragKind, ghost, moveHandler, upHandler };
  },

  onDragStart(e, elemId, shapeType = '') {
    if (e && e.dataTransfer) {
      e.dataTransfer.setData('text/plain', elemId);
      e.dataTransfer.setData('shapeType', shapeType);
    }
    this.playSound('pop');
  },

  onDragOver(e) {
    e.preventDefault();
    if (e.currentTarget && e.currentTarget.classList) e.currentTarget.classList.add('drop-hover');
  },

  onDragLeave(e) {
    if (e.currentTarget && e.currentTarget.classList) e.currentTarget.classList.remove('drop-hover');
  },

  onAppleDrop(e) {
    e.preventDefault();
    if (e.currentTarget && e.currentTarget.classList) e.currentTarget.classList.remove('drop-hover');
    const id = e.dataTransfer ? e.dataTransfer.getData('text/plain') : '';
    this.processAppleDrop(id, e);
  },

  processAppleDrop(id, evt) {
    const apple = document.getElementById(id);
    if (apple && !apple.classList.contains('in-basket')) {
      apple.classList.add('in-basket');
      apple.style.display = 'none';
      this.playSound('coin');
      this.triggerConfetti();
      this.awardScore(evt);
      this.currentClicks++;
      this.updateProgressUI();

      const counter = document.getElementById('basket-apples-count');
      if (counter) counter.textContent = `${this.currentClicks} / 4 apples`;

      if (this.currentClicks >= 4) {
        setTimeout(() => this.completeLevelSuccess(), 500);
      }
    }
  },

  onShapeDrop(e, expectedShape) {
    e.preventDefault();
    if (e.currentTarget && e.currentTarget.classList) e.currentTarget.classList.remove('drop-hover');
    const droppedShape = e.dataTransfer ? e.dataTransfer.getData('shapeType') : '';
    const elemId = e.dataTransfer ? e.dataTransfer.getData('text/plain') : '';
    this.processShapeDrop(elemId, droppedShape, expectedShape, e.currentTarget, e);
  },

  processShapeDrop(elemId, droppedShape, expectedShape, targetEl, evt) {
    if (targetEl && targetEl.classList && targetEl.classList.contains('slot-filled')) return;
    if (droppedShape === expectedShape) {
      this.playSound('coin');
      this.triggerConfetti();
      this.awardScore(evt);
      const el = document.getElementById(elemId);
      if (el) el.style.display = 'none';
      if (targetEl) {
        targetEl.classList.add('slot-filled');
        targetEl.innerHTML = `<span style="font-size: 2rem;">✅</span><span style="font-weight: 800; color: #10b981;">Matched!</span>`;
      }
      this.currentClicks++;
      this.updateProgressUI();

      if (this.currentClicks >= 4) {
        setTimeout(() => this.completeLevelSuccess(), 500);
      }
    } else {
      this.mistakes++;
      this.resetCombo();
      this.playSound('error');
      this.spawnClickEffect(evt, 'Wrong slot!', '#ef4444');
    }
  },

  onBackpackDrop(e) {
    e.preventDefault();
    if (e.currentTarget && e.currentTarget.classList) e.currentTarget.classList.remove('drop-hover');
    const id = e.dataTransfer ? e.dataTransfer.getData('text/plain') : '';
    this.processBackpackDrop(id, e);
  },

  processBackpackDrop(id, evt) {
    const item = document.getElementById(id);
    if (item && !item.classList.contains('packed')) {
      item.classList.add('packed');
      item.style.display = 'none';
      this.playSound('coin');
      this.triggerConfetti();
      this.awardScore(evt);
      this.currentClicks++;
      this.updateProgressUI();

      const cnt = document.getElementById('backpack-counter');
      if (cnt) cnt.textContent = `${this.currentClicks} / 4 packed`;

      if (this.currentClicks >= 4) {
        setTimeout(() => this.completeLevelSuccess(), 500);
      }
    }
  },

  onRecycleDrop(e) {
    e.preventDefault();
    if (e.currentTarget && e.currentTarget.classList) e.currentTarget.classList.remove('drop-hover');
    const id = e.dataTransfer ? e.dataTransfer.getData('text/plain') : '';
    this.processRecycleDrop(id, e);
  },

  processRecycleDrop(id, evt) {
    const item = document.getElementById(id);
    if (item && !item.classList.contains('deleted')) {
      item.classList.add('deleted');
      item.style.display = 'none';
      this.playSound('coin');
      this.triggerConfetti();
      this.awardScore(evt);
      this.currentClicks++;
      this.updateProgressUI();

      const cnt = document.getElementById('trash-counter');
      if (cnt) cnt.textContent = `${this.currentClicks} / 3 cleaned`;

      if (this.currentClicks >= 3) {
        setTimeout(() => this.completeLevelSuccess(), 500);
      }
    }
  },

  // --------------------------------------------------------------------------
  // 5. TEXT SELECTION & HIGHLIGHTING (Document Editor Word Selector)
  // --------------------------------------------------------------------------
  renderTextSelect(container) {
    let targetPhrase = 'Canada';
    let sampleParagraph = '';

    if (this.currentLevel === 0) {
      targetPhrase = 'Canada';
      sampleParagraph = 'Welcome to Canada, a friendly and peaceful country with opportunities for every new family.';
    } else if (this.currentLevel === 1) {
      targetPhrase = '911';
      sampleParagraph = 'In any emergency where police, ambulance, or firefighters are needed, immediately dial 911.';
    } else if (this.currentLevel === 2) {
      targetPhrase = 'K1A 0B1';
      sampleParagraph = 'The official Parliament Hill address in Ottawa has postal code K1A 0B1 on all government letters.';
    } else {
      targetPhrase = 'I want to learn English and computer skills in Canada.';
      sampleParagraph = 'Every newcomer has great potential: I want to learn English and computer skills in Canada. Practice makes progress every day.';
    }

    container.innerHTML = `
      <div class="text-selector-lab-board" onmouseup="MouseTrainer.checkTextSelection('${targetPhrase}', event)">
        ${this.renderStageHud(`✍️ <strong>Word Selector:</strong> Drag across exact target <span class="target-phrase-badge">${targetPhrase}</span>`)}

        <div class="doc-editor-frame">
          <div class="doc-editor-toolbar">
            <span>📄 Newcomer_Document.txt</span>
            <span>Exact Text Highlight</span>
          </div>
          <div class="selectable-text-box" id="selectable-box">
            ${sampleParagraph}
          </div>
        </div>

        <div class="selection-feedback-strip">
          <div class="selection-readout-label">
            Currently Selected: <strong id="active-selected-text" class="selection-readout-value">[None]</strong>
          </div>
          <div id="selection-status-badge" class="text-strong"></div>
        </div>
      </div>
    `;
  },

  checkTextSelection(target, evt) {
    const rawSelection = (typeof window !== 'undefined' && window.getSelection)
      ? window.getSelection().toString()
      : '';
    const displayEl = document.getElementById('active-selected-text');
    const statusEl = document.getElementById('selection-status-badge');

    if (!rawSelection) return;

    const formattedDisplay = rawSelection
      .replace(/^ +/, m => '␣'.repeat(m.length))
      .replace(/ +$/, m => '␣'.repeat(m.length));

    if (displayEl) {
      displayEl.textContent = `"${formattedDisplay}"`;
    }

    const exactMatch = (rawSelection.toLowerCase() === target.toLowerCase());

    if (exactMatch) {
      this.playSound('success');
      this.triggerConfetti();
      this.awardScore(evt, '✍️ 100% Exact!');
      if (statusEl) {
        statusEl.innerHTML = `<span style="color: #10b981; font-weight: 800; font-size: 1.05rem;">🎉 EXCELLENT! Target selected with 100% precision (no extra spaces)!</span>`;
      }
      this.currentClicks++;
      this.updateProgressUI();
      setTimeout(() => this.completeLevelSuccess(), 700);
      return;
    }

    const trimmed = rawSelection.trim();
    if (trimmed.toLowerCase() === target.toLowerCase()) {
      this.mistakes++;
      this.resetCombo();
      this.playSound('error');
      const hasLeadingSpace = rawSelection.startsWith(' ') || rawSelection.startsWith('\t');
      const hasTrailingSpace = rawSelection.endsWith(' ') || rawSelection.endsWith('\t');

      if (hasLeadingSpace && hasTrailingSpace) {
        if (statusEl) {
          statusEl.innerHTML = `<span style="color: #ef4444; font-weight: 700;">⚠️ Extra spaces at start and end! Highlight EXACTLY "${target}" without surrounding spaces.</span>`;
        }
      } else if (hasLeadingSpace) {
        if (statusEl) {
          statusEl.innerHTML = `<span style="color: #ef4444; font-weight: 700;">⚠️ Extra leading space! Start highlighting directly on "${target[0]}".</span>`;
        }
      } else if (hasTrailingSpace) {
        if (statusEl) {
          statusEl.innerHTML = `<span style="color: #ef4444; font-weight: 700;">⚠️ Extra trailing space! Stop directly on "${target[target.length - 1]}".</span>`;
        }
      }
      return;
    }

    if (rawSelection.toLowerCase().includes(target.toLowerCase())) {
      this.mistakes++;
      this.resetCombo();
      this.playSound('error');
      if (statusEl) {
        statusEl.innerHTML = `<span style="color: #ef4444; font-weight: 700;">⚠️ Extra characters or words included. Highlight ONLY "${target}".</span>`;
      }
      return;
    }

    if (target.toLowerCase().includes(trimmed.toLowerCase()) && trimmed.length > 0) {
      if (statusEl) {
        statusEl.innerHTML = `<span style="color: #f59e0b; font-weight: 600;">Incomplete selection ("${trimmed}"). Highlight the full target: "${target}".</span>`;
      }
    } else {
      if (statusEl) {
        statusEl.innerHTML = `<span style="color: var(--text-muted); font-size: 0.9rem;">Find and highlight "${target}" in the text above.</span>`;
      }
    }
  },

  // --------------------------------------------------------------------------
  // 6. SCROLL WHEEL (Scavenger Hunt, Receipt, Provinces, Terms + Progress Rail)
  // --------------------------------------------------------------------------
  renderScrollWheel(container) {
    const railHtml = `
      <div class="scroll-progress-rail" aria-hidden="true">
        <div class="scroll-progress-fill" id="scroll-progress-fill"></div>
      </div>
    `;

    if (this.currentLevel === 0) {
      container.innerHTML = `
        <div class="stage-centered-panel">
          ${this.renderStageHud('🍁 <strong>Scavenger Hunt:</strong> Scroll down the forest trail to find the Golden Maple Leaf!')}
          <div class="scroll-scene-wrap">
            ${railHtml}
            <div class="scroll-trail-box" id="scroll-box-trail" onscroll="MouseTrainer.updateScrollProgress(this)">
              <div class="trail-item">🌲 Pine Trees of Ontario</div>
              <div class="trail-item">🦌 White-Tailed Deer Spot</div>
              <div class="trail-item">🏕️ Algonquin Park Campsite</div>
              <div class="trail-item">🦅 Bald Eagle Lookout Point</div>
              <div class="trail-item">🛶 Canoe River Rapids</div>
              <div class="trail-item">🦫 Beaver Dam on the Creek</div>
              <div class="trail-item">🏔️ Rocky Mountain Foothills</div>
              <div class="trail-secret-spot" onclick="MouseTrainer.clickSecretScrollTarget(this, event)">
                <div style="font-size: 3rem;">🍁</div>
                <div style="font-weight: 800; color: #b91c1c; font-size: 1.25rem;">YOU FOUND THE GOLDEN MAPLE LEAF!</div>
                <div style="font-size: 0.88rem; color: #92400e;">Click to verify scroll achievement!</div>
              </div>
              <div class="trail-item">🌲 Deep Boreal Forest End</div>
            </div>
          </div>
        </div>
      `;
    } else if (this.currentLevel === 1) {
      container.innerHTML = `
        <div class="stage-centered-panel">
          ${this.renderStageHud('🛒 <strong>Receipt Finder:</strong> Scroll through the grocery receipt to confirm Milk & Bread!')}
          <div class="scroll-scene-wrap">
            ${railHtml}
            <div class="scroll-trail-box" id="scroll-box-receipt" onscroll="MouseTrainer.updateScrollProgress(this)">
              <div class="receipt-header">🛒 CANADIAN SUPERMARKET • RECEIPT</div>
              ${['Apples (3lb) - $4.99', 'Oatmeal Cereal - $3.49', 'Eggs (Dozen) - $3.89', 'Cheddar Cheese - $5.99', 'Bananas - $1.89', 'Carrots (2lb) - $2.49', 'Orange Juice - $3.99', 'Rice (5kg) - $11.99', 'Olive Oil - $9.49', 'Yogurt Tub - $4.29'].map(it => `
                <div class="receipt-item">${it}</div>
              `).join('')}
              <div class="receipt-action-box" onclick="MouseTrainer.clickSecretScrollTarget(this, event)">
                <div style="font-size: 2rem;">🥛 🍞</div>
                <div style="font-weight: 800; color: #1e3a8a;">[CONFIRM MILK & BREAD PURCHASE]</div>
                <div style="font-size: 0.82rem; color: #3b82f6;">Click button to verify</div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (this.currentLevel === 2) {
      const provinces = [
        'Newfoundland & Labrador (St. John’s)',
        'Nova Scotia (Halifax)',
        'Prince Edward Island (Charlottetown)',
        'New Brunswick (Fredericton)',
        'Quebec (Montreal & Quebec City)',
        'Ontario (Toronto & Ottawa Capital)',
        'Manitoba (Winnipeg)',
        'Saskatchewan (Regina & Saskatoon)',
        'Alberta (Calgary & Edmonton)',
        'British Columbia (Vancouver & Victoria)'
      ];
      container.innerHTML = `
        <div class="stage-centered-panel">
          ${this.renderStageHud('🇨🇦 <strong>Coast-to-Coast:</strong> Scroll from East to West and click Vancouver at the Pacific Ocean!')}
          <div class="scroll-scene-wrap">
            ${railHtml}
            <div class="scroll-trail-box" id="scroll-box-provinces" onscroll="MouseTrainer.updateScrollProgress(this)">
              ${provinces.map((prov, i) => `
                <div class="province-row ${i === provinces.length - 1 ? 'province-goal' : ''}" ${i === provinces.length - 1 ? 'onclick="MouseTrainer.clickSecretScrollTarget(this, event)"' : ''}>
                  <span style="font-weight: 800;">${i + 1}. ${prov}</span>
                  ${i === provinces.length - 1 ? '<span class="click-goal-badge">CLICK PACIFIC GOAL! 🎯</span>' : '<span>➜</span>'}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="stage-centered-panel">
          ${this.renderStageHud('📜 <strong>Terms Agreement:</strong> Scroll to the bottom of the document to unlock the Agree button!')}
          <div class="scroll-scene-wrap">
            ${railHtml}
            <div class="scroll-trail-box" id="scroll-box-terms" onscroll="MouseTrainer.updateScrollProgress(this); MouseTrainer.checkTermsScroll(this)">
              <h4 style="margin-top: 0;">WelcomePlace Digital Literacy Code of Conduct</h4>
              <p>1. Respect all learners, teachers, and community members in the digital classroom.</p>
              <p>2. Keep your personal account passwords private to protect your learning progress.</p>
              <p>3. Practice computer skills with dedication and patience every session.</p>
              <p>4. Always log out completely when using public library computers in Canada.</p>
              <p>5. Never click suspicious email links or share your Social Insurance Number (SIN) unprompted.</p>
              <p>6. Utilize official emergency numbers 911 and community support helpline 211 safely.</p>
              <p>7. Verify government portals end in .gc.ca or official provincial domains.</p>
              <p>8. Take regular screen breaks and maintain comfortable posture while typing.</p>
              <div class="terms-unlock-box">
                <button
                  id="terms-agree-btn"
                  class="btn-primary terms-agree-btn"
                  disabled
                  onclick="MouseTrainer.clickSecretScrollTarget(this, event)"
                >
                  🔒 Scroll to Bottom to Unlock Agreement
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  },

  updateScrollProgress(el) {
    if (!el) return;
    const fill = document.getElementById('scroll-progress-fill');
    if (!fill) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    const pct = maxScroll > 0 ? Math.min(100, Math.round((el.scrollTop / maxScroll) * 100)) : 100;
    fill.style.width = `${pct}%`;
  },

  checkTermsScroll(el) {
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 40) {
      const btn = document.getElementById('terms-agree-btn');
      if (btn && btn.disabled) {
        btn.disabled = false;
        btn.classList.add('unlocked');
        btn.innerHTML = '✅ I Read and Agree (Click to Complete)';
        this.playSound('pop');
      }
    }
  },

  clickSecretScrollTarget(el, evt) {
    this.playSound('success');
    this.triggerConfetti();
    this.awardScore(evt, '📜 Scroll Complete!');
    if (el) el.classList.add('secret-found');
    this.currentClicks++;
    this.updateProgressUI();
    setTimeout(() => this.completeLevelSuccess(), 600);
  },

  // --------------------------------------------------------------------------
  // Progress & Completion Handling
  // --------------------------------------------------------------------------
  updateProgressUI() {
    const progressEl = document.getElementById('mouse-lab-progress');
    const level = this.skills[this.currentSkill].levels[this.currentLevel];
    if (progressEl) {
      progressEl.innerHTML = `🎯 Progress: <strong>${this.currentClicks} / ${level.targetCount}</strong>`;
    }
  },

  completeLevelSuccess() {
    this.cleanupTimers();
    this.playSound('success');
    this.triggerConfetti();
    this.stars += 3;
    const starsEl = document.getElementById('mouse-lab-stars');
    if (starsEl) starsEl.innerHTML = `⭐ Stars: <strong>${this.stars}</strong>`;

    const viewport = document.getElementById('mouse-interactive-viewport');
    if (!viewport) return;

    const skill = this.skills[this.currentSkill];
    const currentLevelObj = skill.levels[this.currentLevel];
    const totalLevels = skill.levels.length;
    const isLastLevel = this.currentLevel >= totalLevels - 1;

    let nextLabel = '';
    let isAllSkillsCompleted = false;

    if (!isLastLevel) {
      const nextLvl = skill.levels[this.currentLevel + 1];
      nextLabel = `Next: Level ${this.currentLevel + 2} — ${nextLvl.name}`;
    } else {
      const skillIdx = this.skillOrder.indexOf(this.currentSkill);
      if (skillIdx >= 0 && skillIdx < this.skillOrder.length - 1) {
        const nextSkillKey = this.skillOrder[skillIdx + 1];
        const nextSkillObj = this.skills[nextSkillKey];
        nextLabel = `Next Skill Track: ${nextSkillObj.title}`;
      } else {
        isAllSkillsCompleted = true;
      }
    }

    if (isAllSkillsCompleted) {
      this.recordTrackCompletionMetric();
      this.renderGrandCompletion();
      return;
    }

    viewport.innerHTML = `
      <div class="level-success-celebration">
        <div class="celebration-icons">🏆 ⭐ 🌟</div>
        <h3 class="celebration-title">Level Complete! Fantastic Job!</h3>
        <p class="celebration-desc">
          You successfully completed <strong>${currentLevelObj.name}</strong> with high precision and motor confidence!
        </p>

        <div class="auto-advance-badge" id="mouse-auto-advance-badge">
          <span>⏳ Switching to next exercise in <strong id="mouse-countdown-display">2</strong>s...</span>
        </div>

        <div class="celebration-next-label">➔ ${nextLabel}</div>

        <div class="celebration-actions">
          <button class="btn-primary is-success" onclick="MouseTrainer.nextExercise()">
            <span>Next Exercise ➜</span>
          </button>
          <button class="btn-secondary" onclick="MouseTrainer.replayLevel()">
            <span>🔄 Replay Level</span>
          </button>
        </div>
      </div>
    `;

    // 2-second auto-transition to next exercise
    let countdown = 2;
    this.autoAdvanceInterval = setInterval(() => {
      countdown--;
      const el = document.getElementById('mouse-countdown-display');
      if (el) el.textContent = countdown;
      if (countdown <= 0) {
        if (this.autoAdvanceInterval) {
          clearInterval(this.autoAdvanceInterval);
          this.autoAdvanceInterval = null;
        }
      }
    }, 1000);

    this.autoAdvanceTimer = setTimeout(() => {
      this.nextExercise();
    }, 2200);
  },

  recordTrackCompletionMetric() {
    try {
      const duration = Math.max(1, this.elapsedSeconds);
      const activeStudent = (typeof StorageService !== 'undefined' && StorageService.getActiveStudent)
        ? StorageService.getActiveStudent()
        : null;
      const activeTeacher = (typeof StorageService !== 'undefined' && StorageService.getActiveTeacher)
        ? StorageService.getActiveTeacher()
        : null;
      const studentName = activeStudent
        ? (activeStudent.nickname || 'Student')
        : (activeTeacher ? `${activeTeacher.name} (Instructor)` : 'Student');
      const skill = this.skills[this.currentSkill];
      if (!skill) return;

      const metricRecord = {
        studentName: studentName,
        avatarId: (activeStudent && activeStudent.avatarId) ? activeStudent.avatarId : 'avatar_hijab_teal',
        moduleId: `lab_mouse_${skill.id.toLowerCase()}`,
        moduleCode: 'LAB_MOUSE_PRECISION',
        moduleTitle: `Mouse Lab: ${skill.title}`,
        durationSeconds: duration,
        scorePercent: 100,
        correctCount: skill.levels.length,
        totalQuestions: skill.levels.length,
        status: 'PASSED',
        details: skill.levels.map((lvl, idx) => ({
          qId: `lvl_${idx + 1}`,
          type: 'practice',
          prompt: lvl.name,
          userAnswer: 'Mastered 100%',
          isCorrect: true
        }))
      };

      if (typeof StorageService !== 'undefined' && StorageService.saveMetric) {
        StorageService.saveMetric(metricRecord);
      }
    } catch (e) {
      console.warn('Could not record metric:', e);
    }
  },

  renderGrandCompletion() {
    this.stopTimer();
    const activeStudent = (typeof StorageService !== 'undefined' && StorageService.getActiveStudent)
      ? StorageService.getActiveStudent()
      : null;
    const activeTeacher = (typeof StorageService !== 'undefined' && StorageService.getActiveTeacher)
      ? StorageService.getActiveTeacher()
      : null;
    const studentName = activeStudent
      ? (activeStudent.nickname || 'Student')
      : (activeTeacher ? activeTeacher.name : 'Student');

    const viewport = document.getElementById('mouse-interactive-viewport');
    if (viewport) {
      viewport.innerHTML = `
        <div class="quiz-results-banner">
          <div class="results-icon-celebration">🎉 🏆 🌟</div>
          <h2>Congratulations, ${studentName}!</h2>
          <p class="results-lead">You have successfully completed all mouse practice exercises!</p>
          <p class="results-sub">
            Great job building your digital mouse skills. You are now ready for everyday computer tasks!
          </p>
          <div class="results-actions">
            <button class="btn-primary" onclick="MouseTrainer.exitLab()">
              <span>← Back to Curriculum</span>
            </button>
          </div>
        </div>
      `;
    }
  }
};

if (typeof window !== 'undefined') {
  window.MouseTrainer = MouseTrainer;
}
