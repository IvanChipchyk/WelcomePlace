/**
 * WelcomePlace - TypingClub-Style Arcade Mini-Games Engine
 * Implements 4 animated typing game modes embedded cleanly into Typing Jungle:
 *  - game_balloon: Balloon Valley (floating sky balloons)
 *  - game_frog:    Jungle Frog Jump (river lily-pad hopping)
 *  - game_falling: Falling Meteors (cosmic sky defense)
 *  - game_defense: Orchard Defense (3-lane critter patrol)
 */

const TypingGames = {
  active: false,
  finished: false,
  mode: null,
  lesson: null,
  stageEl: null,
  callbacks: {},

  hearts: 5,
  maxHearts: 5,
  cleared: 0,
  goal: 12,
  score: 0,
  combo: 0,
  bestStreak: 0,
  mistakes: 0,
  totalKeystrokes: 0,

  entities: [],
  nextEntityId: 1,
  lockedEntityId: null,

  pads: [],
  padIndex: 0,
  padTypedCount: 0,
  padTimerMs: 7000,
  padMaxMs: 7000,

  tickTimer: null,
  lastTickTime: 0,

  balloonPalette: [
    'radial-gradient(circle at 32% 28%, #f87171, #dc2626)',
    'radial-gradient(circle at 32% 28%, #60a5fa, #2563eb)',
    'radial-gradient(circle at 32% 28%, #34d399, #059669)',
    'radial-gradient(circle at 32% 28%, #fbbf24, #d97706)',
    'radial-gradient(circle at 32% 28%, #a78bfa, #7c3aed)'
  ],

  critterSprites: ['🦝', '🐿️', '🦊', '🐻'],

  start(lesson, stageContainerEl, callbacks = {}) {
    this.stop();
    if (!lesson || !stageContainerEl) return;

    this.active = true;
    this.finished = false;
    this.lesson = lesson;
    this.mode = lesson.type || 'game_balloon';
    this.stageEl = stageContainerEl;
    this.callbacks = callbacks;

    this.hearts = 5;
    this.maxHearts = 5;
    this.cleared = 0;
    this.goal = lesson.goal || 12;
    this.score = 0;
    this.combo = 0;
    this.bestStreak = 0;
    this.mistakes = 0;
    this.totalKeystrokes = 0;

    this.entities = [];
    this.nextEntityId = 1;
    this.lockedEntityId = null;

    if (this.mode === 'game_frog') {
      this.initFrogCourse();
    } else {
      const initialCount = 3;
      for (let i = 0; i < initialCount; i++) {
        this.spawnEntity(i);
      }
    }

    this.renderStage();
    this.notifyTargetChange();

    this.lastTickTime = Date.now();
    this.tickTimer = setInterval(() => this.stepPhysics(), 60);
  },

  stop() {
    this.active = false;
    if (this.tickTimer) {
      clearInterval(this.tickTimer);
      this.tickTimer = null;
    }
  },

  pickWord(offset = 0) {
    const pool = (this.lesson && Array.isArray(this.lesson.pool) && this.lesson.pool.length > 0)
      ? this.lesson.pool
      : ['f', 'j', 'd', 'k'];

    // Ensure unique starting letter when spawning concurrent arcade entities
    const usedFirstChars = new Set(this.entities.map(ent => ent.text[0]));
    const candidates = pool.filter(w => !usedFirstChars.has(w[0]));
    const source = candidates.length > 0 ? candidates : pool;
    const idx = Math.floor(Math.random() * source.length);
    return source[(idx + offset) % source.length];
  },

  spawnEntity(slotIdx = 0) {
    const remainingToSpawn = this.goal - (this.cleared + this.entities.length);
    if (remainingToSpawn <= 0) return;

    const text = this.pickWord(slotIdx);
    const id = this.nextEntityId++;

    if (this.mode === 'game_balloon') {
      const colSlot = (this.nextEntityId + slotIdx) % 4;
      const x = 16 + colSlot * 22 + Math.floor(Math.random() * 8 - 4);
      const y = 78 + (slotIdx * 9) % 18;
      this.entities.push({
        id,
        text,
        typed: 0,
        x: Math.max(14, Math.min(86, x)),
        y,
        speed: 6.5 + Math.random() * 2.5,
        color: this.balloonPalette[id % this.balloonPalette.length]
      });
    } else if (this.mode === 'game_falling') {
      const colSlot = (this.nextEntityId + slotIdx) % 4;
      const x = 16 + colSlot * 22 + Math.floor(Math.random() * 8 - 4);
      const y = 16 - (slotIdx * 7);
      this.entities.push({
        id,
        text,
        typed: 0,
        x: Math.max(14, Math.min(86, x)),
        y,
        speed: 6.8 + Math.random() * 2.4
      });
    } else if (this.mode === 'game_defense') {
      const lanes = [34, 56, 78];
      const laneIdx = (this.nextEntityId + slotIdx) % lanes.length;
      this.entities.push({
        id,
        text,
        typed: 0,
        x: 86 + (slotIdx * 7),
        y: lanes[laneIdx],
        speed: 6.2 + Math.random() * 2.0,
        sprite: this.critterSprites[id % this.critterSprites.length]
      });
    }
  },

  initFrogCourse() {
    this.pads = [];
    const pool = (this.lesson && Array.isArray(this.lesson.pool) && this.lesson.pool.length > 0)
      ? this.lesson.pool
      : ['sad', 'lad', 'dad', 'all', 'ask'];
    for (let i = 0; i < this.goal; i++) {
      this.pads.push(pool[i % pool.length]);
    }
    this.padIndex = 0;
    this.padTypedCount = 0;
    this.padMaxMs = 8000;
    this.padTimerMs = this.padMaxMs;
  },

  getUrgentEntity() {
    if (this.entities.length === 0) return null;
    if (this.lockedEntityId !== null) {
      const locked = this.entities.find(e => e.id === this.lockedEntityId);
      if (locked) return locked;
      this.lockedEntityId = null;
    }

    const sorted = this.entities.slice().sort((a, b) => {
      if (this.mode === 'game_balloon') return a.y - b.y; // highest first
      if (this.mode === 'game_falling') return b.y - a.y; // lowest first
      return a.x - b.x; // defense: leftmost first
    });
    return sorted[0] || null;
  },

  getNextTargetChar() {
    if (!this.active || this.finished) return '';
    if (this.mode === 'game_frog') {
      const word = this.pads[this.padIndex] || '';
      return word[this.padTypedCount] || '';
    }
    const urgent = this.getUrgentEntity();
    if (!urgent) return '';
    return urgent.text[urgent.typed] || '';
  },

  notifyTargetChange() {
    if (this.callbacks && typeof this.callbacks.onTargetChanged === 'function') {
      this.callbacks.onTargetChanged(this.getNextTargetChar());
    }
  },

  stepPhysics() {
    if (!this.active || this.finished) return;
    const now = Date.now();
    const dt = Math.min(0.15, Math.max(0.01, (now - this.lastTickTime) / 1000));
    this.lastTickTime = now;

    if (this.mode === 'game_frog') {
      this.padTimerMs -= dt * 1000;
      if (this.padTimerMs <= 0) {
        this.padTypedCount = 0;
        this.padTimerMs = this.padMaxMs;
        this.loseHeart(50, 52, '💦 Splash!');
      } else {
        const bar = document.getElementById('tc-frog-pad-bar');
        if (bar) bar.style.width = `${Math.max(0, Math.round((this.padTimerMs / this.padMaxMs) * 100))}%`;
      }
      return;
    }

    let missed = false;
    const survivors = [];
    for (let i = 0; i < this.entities.length; i++) {
      const ent = this.entities[i];
      if (this.mode === 'game_balloon') {
        ent.y -= ent.speed * dt;
        if (ent.y <= 14) {
          if (this.lockedEntityId === ent.id) this.lockedEntityId = null;
          this.loseHeart(ent.x, 18, '💨 Escaped!');
          missed = true;
          continue;
        }
      } else if (this.mode === 'game_falling') {
        ent.y += ent.speed * dt;
        if (ent.y >= 88) {
          if (this.lockedEntityId === ent.id) this.lockedEntityId = null;
          this.loseHeart(ent.x, 84, '💥 Shield Hit!');
          missed = true;
          continue;
        }
      } else if (this.mode === 'game_defense') {
        ent.x -= ent.speed * dt;
        if (ent.x <= 16) {
          if (this.lockedEntityId === ent.id) this.lockedEntityId = null;
          this.loseHeart(18, ent.y, '🍎 Stolen!');
          missed = true;
          continue;
        }
      }
      survivors.push(ent);
    }
    this.entities = survivors;

    if (!this.finished) {
      while (this.entities.length < 3 && (this.cleared + this.entities.length) < this.goal) {
        this.spawnEntity(this.entities.length);
      }
      this.renderEntitiesOnly();
      if (missed) this.notifyTargetChange();
    }
  },

  loseHeart(x = 50, y = 50, msg = '💔 -1 Heart') {
    this.hearts = Math.max(0, this.hearts - 1);
    this.combo = 0;
    this.triggerShake();
    this.spawnPopFx(x, y, msg, '#dc2626');
    this.updateHud();

    if (this.callbacks && typeof this.callbacks.onHeartLost === 'function') {
      this.callbacks.onHeartLost(this.hearts);
    }

    if (this.hearts <= 0) {
      this.triggerGameOver();
    }
  },

  handleKey(e) {
    if (!this.active || this.finished) return false;
    if (!e || typeof e.key !== 'string') return false;
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return false;
    if (e.key === ' ' && e.preventDefault) e.preventDefault();
    if (e.key.length > 1) return false;

    this.totalKeystrokes++;

    if (this.mode === 'game_frog') {
      return this.handleFrogKey(e);
    }
    return this.handleArcadeEntityKey(e);
  },

  handleFrogKey(e) {
    const word = this.pads[this.padIndex] || '';
    const expected = word[this.padTypedCount];

    if (e.key === expected) {
      this.combo++;
      if (this.combo > this.bestStreak) this.bestStreak = this.combo;
      this.padTypedCount++;
      this.padTimerMs = Math.min(this.padMaxMs, this.padTimerMs + 1800);

      if (this.callbacks.onKeyCorrect) this.callbacks.onKeyCorrect(e.code, e.key, this.combo);

      if (this.padTypedCount >= word.length) {
        const pts = 100 * Math.min(4, Math.max(1, Math.ceil(this.combo / 2)));
        this.score += pts;
        this.cleared++;
        this.padIndex++;
        this.padTypedCount = 0;
        this.padTimerMs = this.padMaxMs;
        this.spawnPopFx(36, 46, `🐸 Hop! +${pts}`);

        if (this.cleared >= this.goal || this.padIndex >= this.pads.length) {
          this.triggerWin();
          return true;
        }
      }

      this.renderEntitiesOnly();
      this.updateHud();
      this.notifyTargetChange();
      return true;
    }

    this.mistakes++;
    this.combo = 0;
    this.triggerShake();
    if (this.callbacks.onKeyWrong) this.callbacks.onKeyWrong(e.code);
    this.updateHud();
    return false;
  },

  handleArcadeEntityKey(e) {
    let target = null;
    if (this.lockedEntityId !== null) {
      target = this.entities.find(ent => ent.id === this.lockedEntityId) || null;
      if (!target) this.lockedEntityId = null;
    }

    if (!target) {
      const sorted = this.entities.slice().sort((a, b) => {
        if (this.mode === 'game_balloon') return a.y - b.y;
        if (this.mode === 'game_falling') return b.y - a.y;
        return a.x - b.x;
      });
      target = sorted.find(ent => ent.text[ent.typed] === e.key) || null;
      if (target) this.lockedEntityId = target.id;
    }

    if (target && target.text[target.typed] === e.key) {
      target.typed++;
      this.combo++;
      if (this.combo > this.bestStreak) this.bestStreak = this.combo;
      if (this.callbacks.onKeyCorrect) this.callbacks.onKeyCorrect(e.code, e.key, this.combo);

      if (target.typed >= target.text.length) {
        const pts = 100 * Math.min(4, Math.max(1, Math.ceil(this.combo / 2)));
        this.score += pts;
        this.cleared++;
        const popLabel = this.mode === 'game_balloon' ? `🎈 +${pts}` : (this.mode === 'game_falling' ? `⚡ +${pts}` : `🍎 Saved! +${pts}`);
        this.spawnPopFx(target.x, target.y, popLabel);

        this.entities = this.entities.filter(ent => ent.id !== target.id);
        this.lockedEntityId = null;

        if (this.cleared >= this.goal) {
          this.updateHud();
          this.triggerWin();
          return true;
        }

        if (this.entities.length < 3 && (this.cleared + this.entities.length) < this.goal) {
          this.spawnEntity(0);
        }
      }

      this.renderEntitiesOnly();
      this.updateHud();
      this.notifyTargetChange();
      return true;
    }

    this.mistakes++;
    this.combo = 0;
    this.triggerShake();
    if (this.callbacks.onKeyWrong) this.callbacks.onKeyWrong(e.code);
    this.updateHud();
    return false;
  },

  triggerWin() {
    this.finished = true;
    this.stop();
    if (this.callbacks && typeof this.callbacks.onWin === 'function') {
      this.callbacks.onWin({
        score: this.score,
        cleared: this.cleared,
        heartsLeft: this.hearts,
        bestStreak: this.bestStreak,
        mistakes: this.mistakes,
        totalKeystrokes: this.totalKeystrokes
      });
    }
  },

  triggerGameOver() {
    this.finished = true;
    this.stop();
    if (this.stageEl) {
      this.stageEl.innerHTML = `
        <div class="tc-gameover-banner">
          <div style="font-size: 2.5rem;">💔</div>
          <h3 class="tc-gameover-title">Out of Hearts!</h3>
          <p style="margin: 0; opacity: 0.9;">Cleared ${this.cleared} / ${this.goal} targets • Score: ${this.score}</p>
          <div class="tc-gameover-actions">
            <button type="button" class="btn-primary is-success" onclick="TypingTrainer.init(null, TypingTrainer.activeLessonIndex)">↺ Try Again</button>
            <button type="button" class="btn-secondary" onclick="TypingTrainer.openLessonMap()">☰ Lessons Map</button>
          </div>
        </div>
      `;
    }
    if (this.callbacks && typeof this.callbacks.onGameOver === 'function') {
      this.callbacks.onGameOver();
    }
  },

  triggerShake() {
    const stage = document.getElementById('tc-game-stage');
    if (!stage) return;
    stage.classList.remove('tc-game-shake');
    void stage.offsetWidth;
    stage.classList.add('tc-game-shake');
  },

  spawnPopFx(xPct, yPct, text, color = '#16a34a') {
    const layer = document.getElementById('tc-game-fx-layer');
    if (!layer || typeof document.createElement !== 'function') return;
    const pop = document.createElement('div');
    pop.className = 'tc-game-pop';
    pop.style.left = `${xPct}%`;
    pop.style.top = `${yPct}%`;
    pop.style.color = color;
    pop.textContent = text;
    layer.appendChild(pop);
    setTimeout(() => {
      if (pop.parentNode) pop.parentNode.removeChild(pop);
    }, 750);
  },

  formatWordHtml(text, typed, isLocked) {
    const done = text.slice(0, typed);
    const next = text[typed] || '';
    const rest = text.slice(typed + 1);
    return `
      <span class="tc-word-chip ${isLocked ? 'is-locked' : ''}">
        <span class="wc-done">${done}</span><span class="wc-next">${next}</span><span>${rest}</span>
      </span>
    `;
  },

  updateHud() {
    const heartsEl = document.getElementById('tc-hud-hearts');
    const goalEl = document.getElementById('tc-hud-goal');
    const scoreEl = document.getElementById('tc-hud-score');
    const comboEl = document.getElementById('tc-hud-combo');

    if (heartsEl) {
      heartsEl.textContent = '❤️'.repeat(this.hearts) + '🖤'.repeat(Math.max(0, this.maxHearts - this.hearts));
    }
    if (goalEl) goalEl.textContent = `🎯 ${this.cleared} / ${this.goal}`;
    if (scoreEl) scoreEl.textContent = `💎 ${this.score}`;
    if (comboEl) comboEl.textContent = `🔥 x${this.combo}`;
  },

  renderStage() {
    if (!this.stageEl) return;

    const sceneClass = this.mode === 'game_frog'
      ? 'tc-scene-frog'
      : this.mode === 'game_falling'
        ? 'tc-scene-falling'
        : this.mode === 'game_defense'
          ? 'tc-scene-defense'
          : 'tc-scene-balloon';

    const bgDecor = this.mode === 'game_balloon'
      ? '<span class="tc-bg-cloud c1" aria-hidden="true">☁️</span><span class="tc-bg-cloud c2" aria-hidden="true">☁️</span>'
      : this.mode === 'game_frog'
        ? '<div class="tc-river-shine"></div>'
        : this.mode === 'game_falling'
          ? '<div class="tc-defense-shield"></div>'
          : '<div class="tc-orchard-base">🧺<span style="font-size:0.65rem;font-weight:800;color:#15803d;">ORCHARD</span></div>';

    this.stageEl.innerHTML = `
      <div class="tc-game-stage ${sceneClass}" id="tc-game-stage">
        <div class="tc-game-hud">
          <div class="tc-hud-group">
            <span class="tc-hud-pill tc-hud-hearts" id="tc-hud-hearts">${'❤️'.repeat(this.hearts)}</span>
            <span class="tc-hud-pill" id="tc-hud-goal">🎯 ${this.cleared} / ${this.goal}</span>
          </div>
          <div class="tc-hud-group">
            <span class="tc-hud-pill" id="tc-hud-score">💎 ${this.score}</span>
            <span class="tc-hud-pill tc-hud-combo" id="tc-hud-combo">🔥 x${this.combo}</span>
          </div>
        </div>
        ${bgDecor}
        <div id="tc-game-entities-layer"></div>
        <div id="tc-game-fx-layer" class="tc-game-fx-layer"></div>
      </div>
    `;

    this.renderEntitiesOnly();
  },

  renderEntitiesOnly() {
    const layer = document.getElementById('tc-game-entities-layer');
    if (!layer) return;

    if (this.mode === 'game_frog') {
      const start = Math.max(0, Math.min(this.padIndex, Math.max(0, this.pads.length - 4)));
      const visible = this.pads.slice(start, start + 4);
      const timerPct = Math.max(0, Math.round((this.padTimerMs / this.padMaxMs) * 100));

      layer.innerHTML = `
        <div class="tc-frog-track">
          ${visible.map((word, offset) => {
            const globalIdx = start + offset;
            const isCurrent = globalIdx === this.padIndex;
            const isPast = globalIdx < this.padIndex;
            const isFinish = globalIdx === this.pads.length - 1;
            const typed = isCurrent ? this.padTypedCount : (isPast ? word.length : 0);
            return `
              <div class="tc-lily-pad ${isCurrent ? 'is-active-pad' : ''} ${isPast ? 'is-past-pad' : ''}">
                <div class="tc-lily-disc">
                  ${isCurrent ? '<span class="tc-frog-actor" aria-hidden="true">🐸</span>' : (isFinish ? '<span style="font-size:1.35rem;">🍁</span>' : '')}
                </div>
                ${this.formatWordHtml(word, typed, isCurrent)}
                ${isCurrent ? `<div class="tc-pad-timer-bar"><div class="tc-pad-timer-fill" id="tc-frog-pad-bar" style="width:${timerPct}%;"></div></div>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      `;
      return;
    }

    layer.innerHTML = this.entities.map(ent => {
      const isLocked = ent.id === this.lockedEntityId;
      if (this.mode === 'game_balloon') {
        const done = ent.text.slice(0, ent.typed);
        const rest = ent.text.slice(ent.typed);
        return `
          <div class="tc-balloon ${isLocked ? 'is-locked' : ''}" style="left:${ent.x}%; top:${ent.y}%;">
            <div class="tc-balloon-bulb" style="background:${ent.color};">
              <span style="opacity:0.55;text-decoration:line-through;">${done}</span><span>${rest}</span>
            </div>
            <div class="tc-balloon-string"></div>
          </div>
        `;
      }
      if (this.mode === 'game_falling') {
        return `
          <div class="tc-meteor" style="left:${ent.x}%; top:${ent.y}%;">
            <span class="tc-meteor-tail">☄️</span>
            ${this.formatWordHtml(ent.text, ent.typed, isLocked)}
          </div>
        `;
      }
      return `
        <div class="tc-enemy-unit" style="left:${ent.x}%; top:${ent.y}%;">
          <span class="tc-enemy-sprite">${ent.sprite || '🦝'}</span>
          ${this.formatWordHtml(ent.text, ent.typed, isLocked)}
        </div>
      `;
    }).join('');
  }
};

if (typeof window !== 'undefined') {
  window.TypingGames = TypingGames;
}
