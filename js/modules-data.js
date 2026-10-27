/**
 * WelcomePlace - Learning Modules & Template Data Structure
 * Easily extensible for adding presentations, text, quizzes (radio/checkboxes), video, and audio.
 */

const MODULES_DATA = [
  {
    id: 'mod_mouse',
    code: 'MOD01_MOUSE',
    title: 'Mouse & Touchpad Skills',
    subtitle: 'Learn to point, click, double click, and move things on screen',
    icon: '🖱️',
    badge: 'Module 1 • Beginner',
    tags: ['Mouse', 'Clicks', 'Touchpad'],

    // ==========================================
    // 1. PRESENTATION (Slide Carousel Slot)
    // ==========================================
    presentation: [
      {
        slideNumber: 1,
        title: 'Holding the Computer Mouse',
        icon: '✋',
        text: 'Rest your right or left hand gently on the mouse. Keep your wrist flat on the desk. Relax your fingers.',
        tip: '💡 Practice tip: Do not squeeze the mouse tightly.'
      },
      {
        slideNumber: 2,
        title: 'Left Click (Normal Click)',
        icon: '👆',
        text: 'Press the LEFT button gently with your index finger. You will hear a soft "click". Use this to select buttons, links, and text.',
        tip: '💡 90% of the time, you will use the Left Click.'
      },
      {
        slideNumber: 3,
        title: 'Double Click (Two Fast Clicks)',
        icon: '⚡',
        text: 'Click the LEFT button two times very quickly: tap-tap! This opens folders and applications on the desktop screen.',
        tip: '💡 Keep the mouse completely still while clicking twice.'
      },
      {
        slideNumber: 4,
        title: 'Right Click (Menu of Options)',
        icon: '📋',
        text: 'Click the RIGHT button with your middle finger. A small menu will open with extra choices like Copy, Paste, or Open.',
        tip: '💡 To close the menu, simply click anywhere on an empty spot.'
      },
      {
        slideNumber: 5,
        title: 'Drag and Drop (Moving Items)',
        icon: '📦',
        text: 'Click on a file, hold the left button down, move the mouse across the screen, then let go of the button to drop the file.',
        tip: '💡 Great for sorting documents into folders!'
      }
    ],

    // ==========================================
    // 2. TEXT LESSON (Reading & Visual Guide Slot)
    // ==========================================
    textLesson: {
      heading: 'Everyday Computer Mouse Guide',
      summary: 'The mouse is your digital hand inside the computer screen. Moving the mouse moves the pointer (cursor) on the display.',
      sections: [
        {
          subheading: '1. The Mouse Pointer (Cursor)',
          body: 'On the screen, look for an arrow ( ↖ ). When you hover over a button or web link, the arrow often changes into a small pointing hand ( 👆 ). That means you can click it!'
        },
        {
          subheading: '2. The Scroll Wheel',
          body: 'Between the two buttons, there is a small wheel. Roll it towards you to move DOWN a web page. Roll it away from you to move UP.'
        },
        {
          subheading: '3. Laptop Touchpad Alternative',
          body: 'On a laptop, tap the touch rectangle with one finger for left click, or tap with two fingers together for right click.'
        }
      ]
    },

    // ==========================================
    // 3. VIDEO SLOT (Video Player Placeholder / Embed)
    // ==========================================
    videoLesson: {
      title: 'Visual Video Guide: How to Use Mouse & Touchpad',
      duration: '3 min 20 sec',
      videoUrl: '', // Ready for local MP4 or YouTube embed
      description: 'A slow, step-by-step video demonstration of mouse grip, clicking speed, and drag-and-drop mechanics with closed captions.',
      subtitlesAvailable: true
    },

    // ==========================================
    // 4. AUDIO SLOT (Audio Player / Pronunciation Slot)
    // ==========================================
    audioLesson: {
      title: 'Pronunciation & Audio Explanation: Mouse Vocabulary',
      duration: '1 min 45 sec',
      audioUrl: '', // Ready for local MP3/WAV
      transcription: 'Listen carefully: "Click", "Double Click", "Right Click", "Scroll", "Pointer". Practice repeating each word out loud.',
      speechPrompt: 'Welcome to Module 1. The computer mouse helps you navigate. Click the left button to choose an item. Double click to open a file.'
    },

    // ==========================================
    // 5. QUIZ (Radio Buttons & Checkboxes Slot)
    // ==========================================
    quiz: {
      title: 'Module 1 Knowledge Check: Mouse Skills',
      timeLimitMinutes: 10,
      questions: [
        {
          id: 'q1_mouse',
          type: 'radio', // Single choice
          prompt: 'Which mouse button is used for standard clicking on buttons and links?',
          options: [
            { id: 'opt_left', text: 'Left Button (Index finger)', icon: '👈', isCorrect: true },
            { id: 'opt_right', text: 'Right Button (Middle finger)', icon: '👉', isCorrect: false },
            { id: 'opt_wheel', text: 'Scroll Wheel', icon: '🔘', isCorrect: false }
          ],
          explanation: 'The Left Button is the main button used for everyday clicking.'
        },
        {
          id: 'q2_mouse',
          type: 'radio', // Single choice
          prompt: 'What action is needed to OPEN a folder or program icon on the desktop?',
          options: [
            { id: 'opt_single', text: 'Single click once', icon: '👆', isCorrect: false },
            { id: 'opt_double', text: 'Double click (Two fast clicks tap-tap)', icon: '⚡', isCorrect: true },
            { id: 'opt_shake', text: 'Shake the mouse', icon: '👋', isCorrect: false }
          ],
          explanation: 'Two fast clicks on the left button open icons and files.'
        },
        {
          id: 'q3_mouse',
          type: 'checkbox', // Multiple choice
          prompt: 'Select ALL actions that you can do using a computer mouse: (Choose 3)',
          options: [
            { id: 'chk_move', text: 'Move the arrow pointer on screen', icon: '↖️', isCorrect: true },
            { id: 'chk_scroll', text: 'Scroll a long page up and down', icon: '📜', isCorrect: true },
            { id: 'chk_drop', text: 'Drag and drop files into folders', icon: '📂', isCorrect: true },
            { id: 'chk_charge', text: 'Charge a smartphone battery directly', icon: '🔋', isCorrect: false }
          ],
          explanation: 'The mouse moves the pointer, scrolls pages, and drags objects.'
        },
        {
          id: 'q4_mouse',
          type: 'radio', // Single choice
          prompt: 'What happens when you click the RIGHT button on an icon?',
          options: [
            { id: 'opt_menu', text: 'A menu with extra options appears (Copy, Delete, Properties)', icon: '📋', isCorrect: true },
            { id: 'opt_off', text: 'The computer instantly turns off', icon: '🔌', isCorrect: false },
            { id: 'opt_sound', text: 'Music starts playing', icon: '🎵', isCorrect: false }
          ],
          explanation: 'Right click always opens a context menu with actions for that item.'
        }
      ]
    },

    // ==========================================
    // 6. TEACHER GUIDANCE & METHODOLOGY SLOT
    // ==========================================
    teacherNotes: {
      learningGoal: 'Ensure the student can independently navigate the screen, perform left/right clicks without moving the mouse off-target, and understand the pointer shape.',
      methodologyTips: [
        'Physical Grip: Check if the learner is gripping the mouse too firmly. Newcomers often exert excess pressure, causing hand strain.',
        'Double-Click Speed: Many newcomers click too slowly (tap ... pause ... tap). Demonstrate the rhythm: "quick-quick like a heartbeat".',
        'Cursor Lost: Show learners that shaking the mouse quickly will help their eye spot the moving pointer on screen.'
      ],
      classroomExercises: [
        'Offline Warmup: Hand-eye coordination practice using paper cards before sitting at the machine.',
        'Target Practice: Have learners click on 5 colorful squares placed across the screen.',
        'File Sorting: Have learners practice dragging 3 test photos into an "Archive" folder.'
      ]
    }
  },

  {
    id: 'mod_keyboard',
    code: 'MOD02_KEYBOARD',
    title: 'Keyboard & Typing Essentials',
    subtitle: 'Learn the Spacebar, Enter, Backspace, Shift, and Canadian Postal Codes',
    icon: '⌨️',
    badge: 'Module 2 • Beginner',
    tags: ['Keyboard', 'Typing', 'Canadian Postal Code'],

    presentation: [
      {
        slideNumber: 1,
        title: 'The Spacebar (Longest Key)',
        icon: '␣',
        text: 'The long bar at the bottom is the Spacebar. Press it once with your thumb to create a space between words.',
        tip: '💡 Example: My[Space]Name'
      },
      {
        slideNumber: 2,
        title: 'The Enter / Return Key',
        icon: '↵',
        text: 'Enter moves you down to a new line when typing text, or submits an online form when you are done filling it.',
        tip: '💡 Found on the right side of the main letter keys.'
      },
      {
        slideNumber: 3,
        title: 'The Backspace Key (Eraser)',
        icon: '⌫',
        text: 'Made a spelling mistake? Press Backspace to erase letters to the left of the blinking cursor.',
        tip: '💡 Tap once to erase one letter. Do not hold it down too long!'
      },
      {
        slideNumber: 4,
        title: 'Shift Key (Capital Letters)',
        icon: '⇧',
        text: 'Hold down the SHIFT key with one finger, and press a letter key with another finger to make it CAPITAL (A, B, C).',
        tip: '💡 Also used to type symbols shown on top of numbers (like @ or $).'
      },
      {
        slideNumber: 5,
        title: 'Canadian Postal Code Format',
        icon: '📬',
        text: 'In Canada, postal codes are always 6 characters: Letter Number Letter [Space] Number Letter Number (e.g. K1A 0B1 or M5V 2T6).',
        tip: '💡 Always use capital letters for postal codes.'
      }
    ],

    textLesson: {
      heading: 'Essential Keys on a Canadian Keyboard',
      summary: 'The keyboard allows you to type letters, numbers, and fill out government and job application forms.',
      sections: [
        {
          subheading: '1. Home Row Position',
          body: 'Notice tiny bumps on the letters "F" and "J". These help your index fingers find the center without looking down.'
        },
        {
          subheading: '2. Number Keys and Symbols',
          body: 'Numbers 0 to 9 are located on the top row. Press Shift + 4 to get the Canadian Dollar sign ($), and Shift + 2 for the "at" symbol (@) in email addresses.'
        },
        {
          subheading: '3. Caps Lock Warning',
          body: 'If all your letters are typing in CAPITAL LETTERS, check the "Caps Lock" key on the left side. Press it once to turn it off.'
        }
      ]
    },

    videoLesson: {
      title: 'Typing Your First Canadian Address & Name',
      duration: '4 min 10 sec',
      videoUrl: '',
      description: 'Step-by-step video demonstrating how to type a full name, Canadian postal code, and email address using Shift and Backspace.',
      subtitlesAvailable: true
    },

    audioLesson: {
      title: 'Audio Guide: Key Names & Pronunciation',
      duration: '2 min 00 sec',
      audioUrl: '',
      transcription: 'Listen and repeat: "Spacebar", "Backspace", "Enter", "Shift", "Caps Lock", "At symbol".',
      speechPrompt: 'This is the keyboard lesson. Remember, the Spacebar creates spaces between words. Press Backspace to erase errors.'
    },

    quiz: {
      title: 'Module 2 Knowledge Check: Keyboard Essentials',
      timeLimitMinutes: 10,
      questions: [
        {
          id: 'q1_key',
          type: 'radio',
          prompt: 'Which key is used to erase a letter if you made a typo?',
          options: [
            { id: 'opt_back', text: 'Backspace (⌫)', icon: '⌫', isCorrect: true },
            { id: 'opt_space', text: 'Spacebar', icon: '␣', isCorrect: false },
            { id: 'opt_esc', text: 'Escape (Esc)', icon: '⏹️', isCorrect: false }
          ],
          explanation: 'Backspace erases the character immediately to the left.'
        },
        {
          id: 'q2_key',
          type: 'radio',
          prompt: 'Which Canadian Postal Code is written in the correct format?',
          options: [
            { id: 'opt_k1a', text: 'K1A 0B1 (Letter Number Letter Space Number Letter Number)', icon: '🇨🇦', isCorrect: true },
            { id: 'opt_us', text: '90210 (5 numbers only)', icon: '❌', isCorrect: false },
            { id: 'opt_text', text: 'CANADA-POST', icon: '❌', isCorrect: false }
          ],
          explanation: 'Canadian postal codes follow the A1A 1A1 alphanumeric format.'
        },
        {
          id: 'q3_key',
          type: 'checkbox',
          prompt: 'Select ALL keys that help you type CAPITAL letters: (Choose 2)',
          options: [
            { id: 'chk_shift', text: 'Shift Key (⇧)', icon: '⇧', isCorrect: true },
            { id: 'chk_caps', text: 'Caps Lock Key', icon: '🔒', isCorrect: true },
            { id: 'chk_tab', text: 'Tab Key', icon: '⇥', isCorrect: false },
            { id: 'chk_ctrl', text: 'Control (Ctrl) Key', icon: '⚙️', isCorrect: false }
          ],
          explanation: 'Both Shift and Caps Lock are used to make letters capital.'
        },
        {
          id: 'q4_key',
          type: 'radio',
          prompt: 'What does the Enter / Return key do?',
          options: [
            { id: 'opt_newline', text: 'Starts a new line of text or submits a filled form', icon: '↵', isCorrect: true },
            { id: 'opt_close', text: 'Closes the computer lid', icon: '💻', isCorrect: false },
            { id: 'opt_del', text: 'Deletes all files on the screen', icon: '🗑️', isCorrect: false }
          ],
          explanation: 'Enter confirms actions and creates new lines.'
        }
      ]
    },

    teacherNotes: {
      learningGoal: 'Ensure learners can type their own name, phone number, and Canadian postal code without assistance.',
      methodologyTips: [
        'Script Differences: Many immigrants from Chad, Somalia, or Ethiopia may be accustomed to Arabic script, Ge\'ez/Amharic, or non-Latin alphabets. Be patient as they locate Latin letters on the QWERTY keyboard.',
        'Postal Code Confusion: Emphasize the alternating Letter-Number-Letter format, as many countries only use digits for postcodes.'
      ],
      classroomExercises: [
        'Name & Phone Exercise: Have each student open a text pad and type their full name and contact number 3 times.',
        'Postal Code Search: Give students 3 different Canadian city postal codes to practice typing accurately.'
      ]
    }
  },

  {
    id: 'mod_safety',
    code: 'MOD03_SAFETY',
    title: 'Internet Safety & Scam Awareness',
    subtitle: 'Protect personal information, SIN security, and spot fake CRA messages',
    icon: '🛡️',
    badge: 'Module 3 • Important',
    tags: ['Safety', 'SIN', 'Passwords', 'Canada Scams'],

    presentation: [
      {
        slideNumber: 1,
        title: 'Protect Your Social Insurance Number (SIN)',
        icon: '🔒',
        text: 'Your 9-digit Canadian SIN is confidential. NEVER share it by text message, email, or over an unsecured phone call.',
        tip: '💡 Only trusted employers, banks, and tax services require your SIN.'
      },
      {
        slideNumber: 2,
        title: 'Spotting Fake Government Messages (CRA Scams)',
        icon: '⚠️',
        text: 'Scammers often send text messages claiming: "CRA sent you an Interac e-Transfer refund. Click this link." This is ALWAYS A SCAM.',
        tip: '💡 The Canadian Government NEVER sends refund links by SMS!'
      },
      {
        slideNumber: 3,
        title: 'Creating a Strong Password',
        icon: '🔑',
        text: 'Do not use simple words like "123456" or your name. Combine letters, numbers, and a symbol like "Welcome$2026".',
        tip: '💡 Never share your password with strangers.'
      }
    ],

    textLesson: {
      heading: 'Staying Safe Online in Canada',
      summary: 'Scammers target new newcomers because they are unfamiliar with Canadian administrative processes. Learning these simple rules will keep you safe.',
      sections: [
        {
          subheading: 'Rule 1: Look for the Padlock in the Address Bar',
          body: 'Safe websites show a small padlock icon ( 🔒 ) next to the web address (https://). This means the connection is encrypted.'
        },
        {
          subheading: 'Rule 2: Urgency is a Red Flag',
          body: 'If a caller or message threatens that "police will arrive in 1 hour if you do not pay with gift cards", hang up immediately. Legitimate government departments never behave this way.'
        }
      ]
    },

    videoLesson: {
      title: 'How to Recognize Common Canadian Immigrant Scams',
      duration: '3 min 50 sec',
      videoUrl: '',
      description: 'Visual breakdowns of genuine Canadian government portals (Canada.ca) versus fraudulent phishing websites.',
      subtitlesAvailable: true
    },

    audioLesson: {
      title: 'Audio Safety Warning: Protecting Your Identity',
      duration: '1 min 30 sec',
      audioUrl: '',
      transcription: 'Remember: Never click unknown links in text messages. Keep your passwords private. Always ask your instructor if you are unsure.',
      speechPrompt: 'Digital safety is very important. Keep your Social Insurance Number private. Do not click links in strange SMS messages.'
    },

    quiz: {
      title: 'Module 3 Knowledge Check: Digital Safety',
      timeLimitMinutes: 10,
      questions: [
        {
          id: 'q1_safe',
          type: 'radio',
          prompt: 'You receive an SMS saying: "CRA has sent you a $500 tax refund! Click here to accept." What should you do?',
          options: [
            { id: 'opt_delete', text: 'Delete the message and do NOT click the link. It is a scam.', icon: '🛡️', isCorrect: true },
            { id: 'opt_click', text: 'Click the link and type your bank password', icon: '❌', isCorrect: false },
            { id: 'opt_share', text: 'Forward it to all your friends', icon: '❌', isCorrect: false }
          ],
          explanation: 'The Canada Revenue Agency (CRA) never sends refund money via text message links.'
        },
        {
          id: 'q2_safe',
          type: 'checkbox',
          prompt: 'Select ALL safe habits when creating an online password: (Choose 2)',
          options: [
            { id: 'chk_combo', text: 'Mix capital letters, small letters, and numbers', icon: '🔤', isCorrect: true },
            { id: 'chk_private', text: 'Keep your password secret and do not share it with strangers', icon: '🤐', isCorrect: true },
            { id: 'chk_simple', text: 'Use "123456" so you never forget it', icon: '❌', isCorrect: false },
            { id: 'chk_public', text: 'Write it in large letters on a public desk', icon: '❌', isCorrect: false }
          ],
          explanation: 'Strong passwords are complex and kept strictly private.'
        }
      ]
    },

    teacherNotes: {
      learningGoal: 'Empower newcomers to recognize phishing attempts, safeguard their SIN, and consult trusted authorities when suspicious.',
      methodologyTips: [
        'Real-world examples: Show screenshots of real fake CRA texts. This visual recognition directly protects students outside the classroom.',
        'Reassurance: Explain that legitimate Canadian authorities will always send letters via official mail or secure online portals.'
      ],
      classroomExercises: [
        'Spot the Fake: Show 3 sample SMS messages on the projector; ask the class to vote whether each is Genuine or Fake.'
      ]
    }
  }
];

if (typeof window !== 'undefined') {
  window.MODULES_DATA = MODULES_DATA;
}
