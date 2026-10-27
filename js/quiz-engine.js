/**
 * WelcomePlace - Interactive Quiz Engine
 * Supports Radio Buttons (Single Choice) and Checkboxes (Multiple Choice)
 * Calculates scores, tracks time, persists metrics, and triggers TXT report creation.
 */

const QuizEngine = {
  activeQuiz: null,
  activeModule: null,
  startTime: null,
  userResponses: {}, // { [questionId]: value(s) }
  timerInterval: null,

  init(moduleData, containerElement) {
    this.activeModule = moduleData;
    this.activeQuiz = moduleData.quiz;
    this.userResponses = {};
    this.startTime = Date.now();
    this.render(containerElement);
    this.startTimer();
  },

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    const timerEl = document.getElementById('quiz-live-timer');
    if (!timerEl) return;

    this.timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      const m = Math.floor(elapsed / 60);
      const s = elapsed % 60;
      timerEl.textContent = `⏱️ ${m}:${s < 10 ? '0' : ''}${s}`;
    }, 1000);
  },

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  },

  render(container) {
    const qList = this.activeQuiz.questions || [];
    
    let html = `
      <div class="quiz-card">
        <div class="quiz-header">
          <div class="quiz-title-badge">
            <span style="font-size: 1.8rem;">📝</span>
            <div>
              <h2>${this.activeQuiz.title}</h2>
              <p style="color: var(--text-muted); font-size: 0.88rem;">Answer all questions below. You can select single choices or checkboxes.</p>
            </div>
          </div>
          <div class="quiz-timer-pill" id="quiz-live-timer">⏱️ 0:00</div>
        </div>

        <form id="quiz-form" onsubmit="event.preventDefault(); QuizEngine.handleSubmit();">
    `;

    qList.forEach((q, idx) => {
      const isCheckbox = q.type === 'checkbox';
      const badgeText = isCheckbox ? 'Multiple Choice (Checkboxes)' : 'Single Choice (Radio Button)';

      html += `
        <div class="question-block" id="q-block-${q.id}">
          <div class="question-head">
            <div class="q-number">${idx + 1}</div>
            <div class="q-text">
              ${q.prompt}
              <span class="q-type-badge">${badgeText}</span>
            </div>
          </div>

          <div class="options-list">
      `;

      q.options.forEach((opt) => {
        const inputName = `question_${q.id}`;
        const inputType = isCheckbox ? 'checkbox' : 'radio';
        const inputId = `opt_${q.id}_${opt.id}`;

        html += `
          <label class="option-label" for="${inputId}">
            <input 
              type="${inputType}" 
              name="${inputName}" 
              id="${inputId}" 
              value="${opt.id}"
              onchange="QuizEngine.handleOptionChange('${q.id}', '${opt.id}', '${inputType}')"
            />
            <span class="option-icon">${opt.icon || (isCheckbox ? '☑️' : '⚪')}</span>
            <span class="option-text">${opt.text}</span>
          </label>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    html += `
          <div class="quiz-action-bar">
            <div style="font-size: 0.9rem; color: var(--text-muted);">
              💡 <em>Click "Submit Quiz" to check your score and generate your TXT report.</em>
            </div>
            <button type="submit" class="submit-quiz-btn">
              <span>Submit & Save Results</span>
              <span>💾 ➜</span>
            </button>
          </div>
        </form>
      </div>
    `;

    container.innerHTML = html;
  },

  handleOptionChange(qId, optId, inputType) {
    if (inputType === 'radio') {
      this.userResponses[qId] = optId;
    } else {
      if (!Array.isArray(this.userResponses[qId])) {
        this.userResponses[qId] = [];
      }
      const arr = this.userResponses[qId];
      const index = arr.indexOf(optId);
      if (index > -1) {
        arr.splice(index, 1);
      } else {
        arr.push(optId);
      }
    }

    // Update Visual Selection State
    const block = document.getElementById(`q-block-${qId}`);
    if (block) {
      const labels = block.querySelectorAll('.option-label');
      labels.forEach(label => {
        const inp = label.querySelector('input');
        if (inp && inp.checked) {
          label.classList.add('selected');
        } else {
          label.classList.remove('selected');
        }
      });
    }
  },

  handleSubmit() {
    this.stopTimer();
    const durationSeconds = Math.max(1, Math.floor((Date.now() - this.startTime) / 1000));
    const questions = this.activeQuiz.questions || [];
    
    let correctCount = 0;
    const details = [];

    questions.forEach((q) => {
      const isCheckbox = q.type === 'checkbox';
      let isCorrect = false;
      let userAnswerText = '';

      if (isCheckbox) {
        const userSelected = this.userResponses[q.id] || [];
        const correctOptions = q.options.filter(o => o.isCorrect).map(o => o.id);
        
        // Exact set match for checkbox
        const matchesAll = correctOptions.length === userSelected.length &&
          correctOptions.every(id => userSelected.includes(id));
        isCorrect = matchesAll;

        const selectedTexts = q.options.filter(o => userSelected.includes(o.id)).map(o => o.text);
        userAnswerText = selectedTexts;
      } else {
        const userSelected = this.userResponses[q.id];
        const chosenOpt = q.options.find(o => o.id === userSelected);
        isCorrect = chosenOpt ? !!chosenOpt.isCorrect : false;
        userAnswerText = chosenOpt ? chosenOpt.text : 'No answer';
      }

      if (isCorrect) correctCount++;

      details.push({
        qId: q.id,
        type: q.type,
        prompt: q.prompt,
        userAnswer: userAnswerText,
        isCorrect: isCorrect,
        explanation: q.explanation || ''
      });
    });

    const totalQuestions = questions.length;
    const scorePercent = Math.round((correctCount / totalQuestions) * 100);
    const status = scorePercent >= 70 ? 'PASSED' : 'NEEDS REVIEW';
    const activeStudent = StorageService.getActiveStudent();
    const studentName = activeStudent.nickname || 'Student';
    const avatarId = activeStudent.avatarId || 'avatar_hijab_teal';

    // Metric Record Object
    const metricRecord = {
      studentName: studentName,
      avatarId: avatarId,
      moduleId: this.activeModule.id,
      moduleCode: this.activeModule.code,
      moduleTitle: this.activeModule.title,
      durationSeconds: durationSeconds,
      scorePercent: scorePercent,
      correctCount: correctCount,
      totalQuestions: totalQuestions,
      status: status,
      details: details
    };

    // Save to Offline Storage (silently recorded for Admin and Teacher review)
    const savedRecord = StorageService.saveMetric(metricRecord);

    // Show Clean Celebration Results View for Student
    this.showResultsView(savedRecord);
  },

  showResultsView(record) {
    const container = document.getElementById('lesson-content-viewport');
    if (!container) return;

    const isPassed = record.scorePercent >= 70;
    const badgeClass = isPassed ? 'passed' : 'review';
    const celebrationIcon = isPassed ? '🎉 🏆 ⭐' : '📚 💪';
    const feedbackTitle = isPassed ? `Congratulations, ${record.studentName}!` : 'Good Effort! Keep Learning!';
    const feedbackSubtitle = isPassed 
      ? `🌟 Outstanding work! You successfully passed <strong>${record.moduleTitle}</strong>!` 
      : `You completed the evaluation for <strong>${record.moduleTitle}</strong>. Review the guide and try again anytime!`;
    const avatarHtml = typeof AvatarsService !== 'undefined' 
      ? AvatarsService.getSvgHtml(record.avatarId || 'avatar_hijab_teal', 52)
      : '';

    container.innerHTML = `
      <div class="quiz-results-banner" style="margin: 0 auto; max-width: 650px; text-align: center;">
        <div class="results-icon-celebration">${celebrationIcon}</div>
        <h2 style="font-size: 2.1rem; font-weight: 800; color: #1e3a8a; margin-bottom: 0.5rem;">${feedbackTitle}</h2>
        <p style="font-size: 1.15rem; color: #059669; font-weight: 700; margin-bottom: 1.25rem;">
          ${feedbackSubtitle}
        </p>
        
        <div style="display: inline-flex; align-items: center; gap: 0.75rem; background: var(--surface-muted); padding: 0.5rem 1.25rem; border-radius: var(--radius-full); margin-bottom: 1.5rem;">
          ${avatarHtml}
          <div style="text-align: left;">
            <div style="font-size: 1rem; font-weight: 800; color: var(--text-main);">${record.studentName}</div>
            <div style="color: var(--text-light); font-size: 0.82rem;">${record.moduleTitle}</div>
          </div>
        </div>

        <div class="results-score-badge ${badgeClass}" style="margin-bottom: 2rem; font-size: 1.15rem; padding: 0.85rem 1.75rem;">
          ${record.scorePercent}% (${record.correctCount} / ${record.totalQuestions} Questions Correct)
        </div>

        <div style="display: flex; gap: 0.85rem; justify-content: center; flex-wrap: wrap;">
          <button class="btn-primary" style="padding: 0.85rem 1.6rem; font-weight: 800; font-size: 1rem;" onclick="App.renderModulesList()">
            <span>← Return to All Modules</span>
          </button>
          <button class="btn-secondary" style="padding: 0.85rem 1.4rem;" onclick="QuizEngine.init(QuizEngine.activeModule)">
            <span>🔄 Try Quiz Again</span>
          </button>
        </div>
      </div>
    `;
  }
};

if (typeof window !== 'undefined') {
  window.QuizEngine = QuizEngine;
}
