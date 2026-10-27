/**
 * WelcomePlace - Learning Modules & Template Data Structure
 * Easily extensible for adding presentations, text, quizzes (radio/checkboxes), video, and audio.
 */

const MODULES_DATA = [
  {
    id: 'mod_mouse',
    code: 'MOD01_MOUSE',
    title: 'Introduction to Computers & Mouse Basics',
    subtitle: 'First confident steps: computer parts, comfortable grip, and 4 core actions',
    icon: '🖱️',
    badge: 'Module 1 • Beginner',
    tags: ['Computer Parts', 'Mouse Basics', 'Comfort Grip', 'Clicks'],

    // ==========================================
    // 1. PRESENTATION (12 Slides from PPTX)
    // ==========================================
    presentation: [
      {
        slideNumber: 1,
        title: 'Introduction to Computers & Mouse Basics',
        icon: '💻',
        text: 'Welcome to Lesson 1: First confident steps with computer parts, comfortable grip, and the 4 core mouse actions.',
        tip: '💡 In this class, mistakes are welcome! You cannot break the computer.'
      },
      {
        slideNumber: 2,
        title: 'What We Will Learn Today',
        icon: '🎯',
        text: '1. PC Hardware: 4 main parts of every computer desk.\n2. Comfort Grip: Relaxed hand posture without wrist strain.\n3. 4 Core Moves: Hovering, single clicking, double clicking, and scrolling.\n4. Fun Practice: Simple interactive drills and friendly exercises.',
        tip: '💡 Take your time and learn at your own comfortable pace.'
      },
      {
        slideNumber: 3,
        title: '4 Main Parts of the Computer Desk',
        icon: '🖥️',
        text: '1. Monitor / Screen: Displays all text, windows, and images.\n2. Computer / Tower: The system brain holding the Power button.\n3. Keyboard: Board of keys used to type letters and numbers.\n4. Mouse: Hand-held device used to move the screen pointer.',
        tip: '💡 Look at your desk and point to all 4 main components.'
      },
      {
        slideNumber: 4,
        title: 'Main Parts of a Computer Mouse',
        icon: '🖱️',
        text: '• Left Button (Left Click): The primary button for 90% of daily actions.\n• Scroll Wheel: Rolls long web pages and documents up and down.\n• Right Button (Right Click): Opens helpful popup menus with additional choices.',
        tip: '💡 Rest your index finger on the left button and middle finger on the right button.'
      },
      {
        slideNumber: 5,
        title: 'How to Hold the Mouse Correctly',
        icon: '✋',
        text: '1. Relaxed Palm: Rest your palm gently over the curved body.\n2. Index Finger Ready: Keep your index finger resting on the left side.\n3. Straight Wrist Line: Slide with your forearm and keep your wrist flat on the desk.',
        tip: '💡 Do not squeeze the mouse tightly—hold it as gently as a small bird.'
      },
      {
        slideNumber: 6,
        title: 'Moving the Pointer & Single Click',
        icon: '👆',
        text: '1. Move & Hover: Slide the pointer over an icon without pressing any buttons. Notice how buttons highlight.\n2. Single Left Click: One gentle tap on the left button with your index finger. Used to select objects or open links.',
        tip: '💡 Keep the mouse completely still while clicking.'
      },
      {
        slideNumber: 7,
        title: 'Mastering the Double Click',
        icon: '⚡',
        text: 'Two quick taps in rapid succession (tap-tap like a heartbeat!).\nUsed to open programs, folders, and documents on the desktop.\nGolden Rule: Keep the mouse completely still on the desk while clicking twice!',
        tip: '💡 If you accidentally move the mouse between taps, the computer will not recognize the double click.'
      },
      {
        slideNumber: 8,
        title: 'Drag & Drop and Scrolling',
        icon: '📦',
        text: 'Drag & Drop (3-step action):\n1. Press: Hold the left button down on an icon.\n2. Slide: Move the mouse to the new location.\n3. Release: Let go of the button to drop the item.\n\nScroll Wheel:\n• Roll toward you to go down.\n• Roll forward away to go up.',
        tip: '💡 You do not need to click the wheel—just roll it gently with your index finger.'
      },
      {
        slideNumber: 9,
        title: 'Interactive Tools for Mouse Practice',
        icon: '🎮',
        text: '• Mousercise: Step-by-step beginner web practice.\n• Jigsaw Planet: Digital puzzles for drag-and-drop mastery.\n• MS Paint: Freeform drawing for fine motor control.\n• WelcomePlace Mouse Lab: Interactive speed and accuracy drills.',
        tip: '💡 Try our built-in Mouse Skills Lab from the top menu anytime!'
      },
      {
        slideNumber: 10,
        title: 'Step-by-Step Lesson Schedule (60–90 Min)',
        icon: '⏱️',
        text: '• 10 min: Welcome, seating, and screen check.\n• 15 min: Hardware components and comfortable grip.\n• 20 min: Core clicks (single, double, right-click).\n• 30 min: Interactive drills and mouse practice.\n• 10 min: Q&A, wrap-up, and review quiz.',
        tip: '💡 Pace yourself—short pauses keep your hands relaxed.'
      },
      {
        slideNumber: 11,
        title: '3 Rules for Stress-Free Learning',
        icon: '🌟',
        text: '1. Zero Fear: You cannot break the computer by clicking or moving the mouse.\n2. Light Touch: Gentle finger taps are always enough.\n3. Your Own Pace: Confidence grows with every minute of practice.',
        tip: '💡 Always raise your hand if you feel stuck—your instructor is happy to help.'
      },
      {
        slideNumber: 12,
        title: 'Great Job Today!',
        icon: '🎉',
        text: 'You took your first confident step into the digital world!\nCelebrate your progress today. Ask any question—we are here to support you.\nNext Lesson: The Keyboard & Typing Basics.',
        tip: '💡 Now test your knowledge with the Module 1 Quiz!'
      }
    ],

    // ==========================================
    // 2. TEXT LESSON (Reading & Illustrated Guide)
    // ==========================================
    textLesson: {
      heading: 'Introduction to Computers & Mouse Basics Guide',
      summary: 'The computer mouse is your digital hand inside the screen. Master the monitor, keyboard, computer tower, and the 4 fundamental mouse actions.',
      downloadUrl: 'media/docs/Computer_Basics_Mouse_Mastery.pdf',
      downloadLabel: 'Illustrated Student Handbook (PDF, 11 MB) with step-by-step diagrams and offline drills',
      sections: [
        {
          subheading: '1. The 4 Main Parts of the Computer Desk',
          body: 'Every desktop setup consists of four primary parts: (1) The Monitor/Screen which displays all visuals and windows; (2) The Computer Tower which houses the electronic processor and the main Power button; (3) The Keyboard used for typing text, numbers, and commands; and (4) The Mouse which controls your on-screen arrow pointer.'
        },
        {
          subheading: '2. Anatomy of the Mouse',
          body: 'The mouse has three interactive parts: The Left Button (used 90% of the time for normal clicking and selecting), the Scroll Wheel in the center (rolled toward or away from you to travel through long pages), and the Right Button (used to summon a context menu with extra options like Copy, Paste, and Rename).'
        },
        {
          subheading: '3. Ergonomics & Comfort Grip',
          body: 'Rest your palm gently on the body of the mouse with your wrist resting flat on the table. Do not squeeze tightly. Keep your index finger on the left button and middle finger on the right button. Glide the mouse across the pad using your forearm rather than twisting your wrist.'
        },
        {
          subheading: '4. The 4 Core Mouse Actions',
          body: 'Hover: Point the cursor at an icon without clicking. Single Left Click: One gentle press to select a link or button. Double Click: Two rapid taps in place without moving the mouse to launch an application or folder. Drag and Drop: Click and hold down the left button, slide to a destination, and release to move files.'
        }
      ]
    },

    // ==========================================
    // 3. VIDEO SLOT (Embedded MP4 Video Player)
    // ==========================================
    videoLesson: {
      title: 'Computers & Mouse Basics Video Walkthrough',
      duration: '4 min 12 sec',
      videoUrl: 'media/videos/Computers___Mouse_Basics.mp4',
      description: 'Comprehensive step-by-step video demonstration of computer desk hardware, correct mouse posture, clicking rhythm, and desktop navigation.',
      subtitlesAvailable: true
    },

    // ==========================================
    // 4. AUDIO SLOT (Audio Player / Pronunciation Slot)
    // ==========================================
    audioLesson: {
      title: 'Pronunciation & Audio Guidance: Computer & Mouse Vocabulary',
      duration: '1 min 45 sec',
      audioUrl: '',
      transcription: 'Listen carefully: "Monitor", "Keyboard", "Mouse", "Tower", "Left Click", "Double Click", "Scroll Wheel", "Cursor". Practice repeating each word aloud.',
      speechPrompt: 'Welcome to Lesson 1. The monitor shows your screen. The mouse is your digital hand. Tap the left button once to select, and tap twice fast to open a file.'
    },

    // ==========================================
    // 5. QUIZ (6 Questions from Official Review DOCX)
    // ==========================================
    quiz: {
      title: 'Module 1 Knowledge Check: Computer Parts & Mouse Basics',
      timeLimitMinutes: 10,
      questions: [
        {
          id: 'q1_monitor',
          type: 'radio',
          prompt: '1. Which part of the computer shows you pictures and text?',
          options: [
            { id: 'opt_1a', text: 'The Monitor (Screen)', icon: '🖥️', isCorrect: true },
            { id: 'opt_1b', text: 'The Mouse', icon: '🖱️', isCorrect: false },
            { id: 'opt_1c', text: 'The Keyboard', icon: '⌨️', isCorrect: false },
            { id: 'opt_1d', text: 'The Cables', icon: '🔌', isCorrect: false }
          ],
          explanation: 'The Monitor (Screen) displays everything you see: windows, text, images, and videos.'
        },
        {
          id: 'q2_keyboard',
          type: 'radio',
          prompt: '2. You want to type your name into the computer. What do you use?',
          options: [
            { id: 'opt_2a', text: 'The Monitor', icon: '🖥️', isCorrect: false },
            { id: 'opt_2b', text: 'The Keyboard', icon: '⌨️', isCorrect: true },
            { id: 'opt_2c', text: 'The Mouse Wheel', icon: '🔘', isCorrect: false },
            { id: 'opt_2d', text: 'The Power Button', icon: '⚡', isCorrect: false }
          ],
          explanation: 'The Keyboard is the board of keys used for typing letters, words, and numbers.'
        },
        {
          id: 'q3_doubleclick',
          type: 'radio',
          prompt: '3. How do you OPEN a game or folder on the desktop?',
          options: [
            { id: 'opt_3a', text: 'Double Click (Left click 2 times fast)', icon: '⚡', isCorrect: true },
            { id: 'opt_3b', text: 'Turn off the screen', icon: '🔌', isCorrect: false },
            { id: 'opt_3c', text: 'Press the space bar', icon: '␣', isCorrect: false },
            { id: 'opt_3d', text: 'Move mouse backward', icon: '🔄', isCorrect: false }
          ],
          explanation: 'Double-clicking the left button twice rapidly opens programs and folders.'
        },
        {
          id: 'q4_scrollwheel',
          type: 'radio',
          prompt: '4. What is the little wheel in the middle of the mouse used for?',
          options: [
            { id: 'opt_4a', text: 'To type numbers', icon: '🔢', isCorrect: false },
            { id: 'opt_4b', text: 'To scroll up and down a page', icon: '📜', isCorrect: true },
            { id: 'opt_4c', text: 'To shut down the computer', icon: '🛑', isCorrect: false },
            { id: 'opt_4d', text: 'To make the screen brighter', icon: '💡', isCorrect: false }
          ],
          explanation: 'The scroll wheel rolls long documents and web pages up and down smoothly.'
        },
        {
          id: 'q5_rightclick',
          type: 'radio',
          prompt: '5. Which button gives you extra options or a secret menu?',
          options: [
            { id: 'opt_5a', text: 'Right mouse button', icon: '👉', isCorrect: true },
            { id: 'opt_5b', text: 'Left mouse button', icon: '👈', isCorrect: false },
            { id: 'opt_5c', text: 'The screen edge', icon: '🔲', isCorrect: false },
            { id: 'opt_5d', text: 'Enter key', icon: '↵', isCorrect: false }
          ],
          explanation: 'Clicking the Right mouse button opens a context menu with actions like Copy, Rename, and Delete.'
        },
        {
          id: 'q6_dragdrop',
          type: 'radio',
          prompt: '6. To MOVE an icon from one side of the screen to another, you:',
          options: [
            { id: 'opt_6a', text: 'Hold the left button, drag it, and let go', icon: '📦', isCorrect: true },
            { id: 'opt_6b', text: 'Click once and walk away', icon: '🚶', isCorrect: false },
            { id: 'opt_6c', text: 'Unplug the mouse', icon: '🔌', isCorrect: false },
            { id: 'opt_6d', text: 'Turn the wheel fast', icon: '🔄', isCorrect: false }
          ],
          explanation: 'Drag and Drop means pressing and holding the left button down, sliding across the screen, and releasing.'
        }
      ]
    },

    // ==========================================
    // 6. TEACHER GUIDANCE & METHODOLOGY SLOT
    // ==========================================
    teacherNotes: {
      learningGoal: 'Ensure every learner can identify the 4 primary desk hardware components, adopt an ergonomic mouse posture, execute single and double clicks with correct rhythm, and move icons via drag & drop without fear or strain.',
      downloads: [
        { title: 'Lesson Plan & Teaching Script (DOCX)', file: 'media/docs/Lesson_Plan_and_Teaching_Script.docx', icon: '📝' },
        { title: 'Presentation Slides (PPTX)', file: 'media/docs/Introduction_to_Computers_and_Mouse_Basics.pptx', icon: '📊' },
        { title: 'Review & Quiz Printable (DOCX)', file: 'media/docs/Computer_Class_Review_and_Quiz.docx', icon: '📄' },
        { title: 'Student Illustrated Handbook (PDF)', file: 'media/docs/Computer_Basics_Mouse_Mastery.pdf', icon: '📕' }
      ],
      methodologyTips: [
        'The "Say - Show - Do - Check" Cycle: Never give verbal instruction without physically pointing and demonstrating on the projector screen first. Wait for all eyes, demonstrate twice, then instruct students to do it.',
        'Radical Patience & Zero Pressure: The neurological link between horizontal hand movement on a desk and vertical pointer movement on screen is unfamiliar for beginners. Never grab their mouse; guide verbally and point to their desk.',
        'The Color-Dot Technique: Place a small green sticker on the Left Mouse Button and an orange sticker on the Right Mouse Button. Refer to the "Green button" whenever language barriers arise.',
        'Mouse Sensitivity Calibration: Set Windows pointer speed to low or medium before class starts to prevent rapid, frustrating pointer jumps.'
      ],
      classroomExercises: [
        'Block 1: Welcome & Comfort Check (10-12 min) - Seating ergonomics, screen check, overcoming the fear of breaking the computer.',
        'Block 2: Computer Anatomy & Hardware (15-18 min) - Identifying monitor, tower, keyboard, mouse, and power button.',
        'Block 3: The 4 Core Mouse Actions (20-25 min) - Move & hover, single left click, double click heartbeat rhythm, and drag & drop.',
        'Block 4: Interactive Practice & Drills (25-30 min) - Using the WelcomePlace Mouse Lab, Mousercise, and simple digital games.',
        'Block 5: Wrap-Up & Reinforcement (10 min) - Mini-quiz knowledge check, positive encouragement, previewing Keyboard essentials.'
      ],
      verbatimScriptHighlights: [
        {
          block: 'Block 1 - Welcome',
          quote: '"Nobody can break the computer today. You cannot break it by pressing a button or moving the mouse. Everything is safe. In this room, mistakes are welcome!"'
        },
        {
          block: 'Block 3 - Double Click Rhythm',
          quote: '"Keep the mouse completely still like a resting bird. Tap-tap, quick like a heartbeat! Do not lift the mouse off the desk."'
        },
        {
          block: 'Block 3 - Drag & Drop Metaphor',
          quote: '"Think of it like holding a sheet of paper: Press down and hold, slide smoothly across the table, then let go."'
        }
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
