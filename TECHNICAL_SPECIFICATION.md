# Technical Specification: "WelcomePlace Canada" Digital Literacy Platform

## 1. Project Overview

**WelcomePlace Canada** is an offline client-side web application (front-end only) designed to teach fundamental computer and digital literacy skills to newcomers and immigrants in Canada.

### Primary Objectives:
- **100% Offline Autonomy:** Functions without external backends, cloud databases, or mandatory internet connectivity. Runs by opening `index.html` locally in any modern browser.
- **Inclusivity & Accessibility:** Ultra-intuitive UI designed for learners with minimal or beginner computer experience and developing English language skills (large targets, visual metaphors, audio pronunciation, clear cues).
- **Three-Tier Role Architecture:** Student, Teacher, Administrator.
- **Performance Tracking & Reports:** Automatic logging of practice lab milestones, typing metrics, and quiz scores, with exportable `.txt` summaries for instructors.

---

## 2. Technical Architecture & Constraints

| Constraint | Solution |
| :--- | :--- |
| **No Backend / Offline** | Pure HTML5, CSS3, and ES6+ modules. Direct launch via `index.html` in Chrome, Edge, Safari, or Firefox without npm/Node.js requirements at runtime. |
| **Platform Language** | **100% English (Clear, accessible English)** paired with visual icons and audio support. |
| **Security & Roles** | Teacher and Administrator portals secured by password authentication with account management capabilities. |
| **Offline Persistence** | `localStorage` and `IndexedDB` for client-side storage of accounts, session tokens, audit logs, and metrics. |
| **Data Export** | `Blob` and File Download API for client-side generation of detailed text reports (`.txt`). |

---

## 3. Role Architecture & Features

### 3.1. Student Profile
- **Focus:** Hands-on interactive practice, minimal text clutter, high visual affordance.
- **Login:** Nickname, student password, and culturally inclusive avatar picker (diverse representations including hijab).
- **Curriculum:**
  - 5 Core Digital Literacy Modules (Hardware Basics, Mouse & Desktop, Keyboard & Typing, Internet & Email, Digital Safety & Privacy in Canada).
  - Multi-Modal Learning: Presentations, Text Guides, Video Slots, Listening Audio Pronunciation, and Knowledge Quizzes.
  - **Mouse Precision Lab (techlit.tools style):** 6 skill tracks × 4 levels = 24 interactive exercises:
    1. Click Precision (Giant Balloon Pop, Coin Chase, Number Sequence, Whack-a-Star)
    2. Double Click (Treasure Chest, Canadian Photos, App Launcher, Speed Gauge)
    3. Right Click Menu (Color Changer, Document Rename, Image Inspector, Copy Certificate)
    4. Drag and Drop (Apple Picker Tree, Shape Sorter, Canada Backpack Packer, Recycle Bin)
    5. Text Selection (Target Words "Canada", "911", "K1A 0B1", Full Sentence with strict whitespace boundaries)
    6. Scroll Wheel (Canadian Forest Trail Scavenger Hunt, Supermarket Receipt, Coast-to-Coast Map, Terms Unlock)
  - **Keyboard Trainer (Stamina / Keybr style):** 8 typing practice lessons with live WPM, accuracy, error count, visual on-screen keyboard, and tactile finger guides.
  - Seamless auto-progression to next exercise upon level completion.

### 3.2. Teacher Profile
- **Authentication:** Dedicated instructor credentials configured by the Administrator.
- **Capabilities:**
  - Complete access to all student lessons and simulators.
  - **Teacher Guide:** Methodological guidelines, newcomer cultural advice, and classroom group exercises.

### 3.3. Administrator Portal
- **Authentication:** Administrator credentials.
- **Capabilities:**
  - Interactive Analytics Dashboard: Lifetime metrics, pass rates, average scores, and active user tallies.
  - User Account Management: Create and delete Student and Teacher accounts, assign avatars, and reset passwords.
  - Reporting Center: Download individual student `.txt` audit reports or export a comprehensive Master Audit Log for all students.
  - Cohort Management: Ability to clear local cohort history before each intake.

---

## 4. Compliance & Offline Architecture
- 100% Client-side and offline capable.
- No external runtime dependencies or backends required.

