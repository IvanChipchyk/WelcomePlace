# WelcomePlace Canada - Digital Literacy Platform

Local web application for digital literacy tailored for newcomers and immigrants in Canada. Operates 100% offline on the client side (front-end only) without requiring external servers, databases, or an active Internet connection.

---

## 🚀 How to Launch the Project
The application requires no installation of Node.js or backend servers.
- Simply double-click [index.html](file:///Users/macuser/Documents/WecomePlace/index.html) in any modern web browser (Google Chrome, Microsoft Edge, Safari, Firefox).
- Or serve the directory through any local static web server.

---

## 👥 Role Profiles (3 Accounts)

1. **Student:**
   - Account login with nickname, password, and culturally inclusive avatar selection.
   - Access to interactive digital literacy modules:
     - 🖼️ **Presentation:** Step-by-step visual slides with clear cues and newcomer tips.
     - 📖 **Text Guide:** Accessible practical explanations with highlight callouts.
     - 🎬 **Video:** Tutorial video slot (local MP4 or web player).
     - 🎧 **Audio:** English pronunciation audio & listening comprehension practice.
     - 📝 **Quiz:** Interactive knowledge checks with instant feedback.
     - 🖱️ **Mouse Precision Lab (techlit.tools style):** 6 skill tracks × 4 levels = 24 interactive exercises (Click Precision, Double Click, Right-Click Context Menus, Drag & Drop, Text Selection, Scroll Wheel).
     - ⌨️ **Keyboard Trainer (Stamina style):** 8 typing lessons with real-time WPM, accuracy, visual keyboard, and tactile finger hints.
   - Upon completion: Silent metric logging for instructors with warm celebratory achievement screens.

2. **Teacher:**
   - Dedicated named teacher profiles authenticated via secure instructor password.
   - Full access to all learner curriculum materials.
   - **🧑‍🏫 Teacher Guide:** Specialized pedagogical recommendations, cultural tips for newcomers, and classroom group activities.

3. **Administrator:**
   - Dedicated administrator portal authenticated via administrator password.
   - Interactive analytics dashboard with lifetime performance metrics across all cohorts.
   - Full management of teacher and student accounts (creation, avatar assignment, credentials, deletion).
   - Instant export of individual student performance logs or complete multi-student Master Audit reports (`.txt`).
   - Ability to clear local cohort logs when starting a new intake.

---

## 📂 Curriculum & Content Structure
All curriculum content, quizzes, slides, video, and audio are structured in:
[js/modules-data.js](file:///Users/macuser/Documents/WecomePlace/js/modules-data.js)

Each module contains:
- `presentation`: Array of slides `{ slideNumber, title, icon, text, tip }`.
- `textLesson`: Structured text guide `{ heading, summary, sections: [...] }`.
- `videoLesson`: Video guide parameters `{ title, duration, videoUrl, description }`.
- `audioLesson`: Audio transcription & listening prompts `{ title, duration, transcription, speechPrompt }`.
- `quiz`: Questions supporting `type: 'radio'` (single choice) and `type: 'checkbox'` (multiple selection).
- `teacherNotes`: Instructor recommendations `{ learningGoal, methodologyTips, classroomExercises }`.

---

## 📊 Metrics Storage Format
- Student test attempts and practice lab metrics are saved offline in `localStorage`.
- Comprehensive metric records can be viewed directly in the Admin Center or exported as formatted `.txt` files:
  `STUDENT_[StudentName]_[ModuleCode]_[Date]_[Time].txt` or `ALL_METRICS_REPORT_[Timestamp].txt`.
