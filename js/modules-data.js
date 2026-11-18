/**
 * WelcomePlace - Learning Modules & Template Data Structure
 * Enriched with official Module 1 curriculum, 12-slide PPTX deck, 15-page Visual Primer PDF,
 * printable Review & Quiz DOCX, MP4 walkthrough, and Teacher-Exclusive Lesson Plan & Verbatim Script.
 */

const MODULES_DATA = [
  {
    id: 'mod_mouse',
    code: 'MOD01_MOUSE',
    title: 'Introduction to Computers & Mouse Basics',
    subtitle: 'First confident steps: computer parts, comfortable grip, and 6 core mouse actions',
    icon: '🖱️',
    badge: 'Module 1 • Beginner',
    tags: ['Computer Parts', 'Mouse Basics', 'Comfort Grip', 'Clicks & Scroll'],

    presentationMeta: {
      pptxUrl: 'media/docs/Introduction_to_Computers_and_Mouse_Basics.pptx',
      pptxLabel: 'Introduction to Computers & Mouse Basics (.PPTX, 12 Slides)',
      pdfUrl: 'media/docs/Computer_Basics_Mouse_Mastery.pdf',
      pdfLabel: 'Computer Basics & Mouse Mastery — Visual Primer (.PDF, 15 Slides)',
      pdfPages: 15
    },

    // ==========================================
    // 1. PRESENTATION (15 Visual Slides from Computer_Basics_Mouse_Mastery.pdf)
    // ==========================================
    presentation: [
      {
        slideNumber: 1,
        image: 'media/slides/slide-01.png',
        title: 'Computer Basics & Mouse Mastery',
        speech: 'Slide 1: Computer Basics and Mouse Mastery. A visual primer for first-time users. Unit 1: Hardware and Peripherals.'
      },
      {
        slideNumber: 2,
        image: 'media/slides/slide-02.png',
        title: '3 Rules for Stress-Free Learning',
        speech: 'Slide 2: 3 Rules for Stress-Free Learning. Zero Fear: you cannot break the computer. Light Touch: soft, relaxed finger taps are enough. Your Own Pace: mistakes are welcome here.'
      },
      {
        slideNumber: 3,
        image: 'media/slides/slide-03.png',
        title: 'The Anatomy of a Computer Desk',
        speech: 'Slide 3: The Anatomy of a Computer Desk. 1, Monitor or Screen. 2, The System Unit. 3, Keyboard. 4, Mouse.'
      },
      {
        slideNumber: 4,
        image: 'media/slides/slide-04.png',
        title: 'Identifying Your System Unit',
        speech: 'Slide 4: Identifying Your System Unit. The computer brain comes in many shapes and sizes: Tower PC, Desktop PC, Slim Mini-Tower, Mini PC, All-in-One, and Laptop.'
      },
      {
        slideNumber: 5,
        image: 'media/slides/slide-05.png',
        title: 'The Cable & Port Translator',
        speech: 'Slide 5: The Cable and Port Translator. Power button wakes the computer. USB Type-A connects mouse, keyboard, and flash drives. HDMI carries video and sound. Power cable supplies electricity. Audio jack plugs in earphones.'
      },
      {
        slideNumber: 6,
        image: 'media/slides/slide-06.png',
        title: 'Anatomy of the Mouse',
        speech: 'Slide 6: Anatomy of the Mouse. Left Button in green is your main tool for 90 percent of daily actions. Scroll Wheel rolls pages up and down. Right Button in orange opens helpful menus.'
      },
      {
        slideNumber: 7,
        image: 'media/slides/slide-07.png',
        title: 'How to Hold the Mouse (DO vs. DON\'T)',
        speech: 'Slide 7: How to Hold the Mouse. A relaxed hand prevents wrist pain. Do rest your palm gently and slide using your forearm. Do not bend your wrist backward, squeeze tightly, or lift the mouse.'
      },
      {
        slideNumber: 8,
        image: 'media/slides/slide-08.png',
        title: 'The Cursor Decoder Ring',
        speech: 'Slide 8: The Cursor Decoder Ring. Standard Pointer selects items. Web Hand opens internet links. Text Cursor lets you begin typing. Working Wheel means please wait while the computer thinks.'
      },
      {
        slideNumber: 9,
        image: 'media/slides/slide-09.png',
        title: 'Action 1: Point & Hover',
        speech: 'Slide 9: Action 1, Point and Hover. Slide the mouse flat without clicking until the arrow touches an icon. A helpful text tooltip appears.'
      },
      {
        slideNumber: 10,
        image: 'media/slides/slide-10.png',
        title: 'Action 2: The Single Left Click',
        speech: 'Slide 10: Action 2, The Single Left Click. Tap the green left button once crisply with your index finger and release to select a file or click a link.'
      },
      {
        slideNumber: 11,
        image: 'media/slides/slide-11.png',
        title: 'Action 3: The Double Click',
        speech: 'Slide 11: Action 3, The Double Click. Keep the mouse completely frozen on the desk and tap the left button twice very quickly to open programs and folders.'
      },
      {
        slideNumber: 12,
        image: 'media/slides/slide-12.png',
        title: 'Action 4: The Right Click',
        speech: 'Slide 12: Action 4, The Right Click. Tap the orange right button once with your middle finger to open the action menu with options like Copy, Paste, and Delete.'
      },
      {
        slideNumber: 13,
        image: 'media/slides/slide-13.png',
        title: 'Action 5: Drag & Drop',
        speech: 'Slide 13: Action 5, Drag and Drop. Step 1, press and hold the left button down. Step 2, slide across the pad while holding. Step 3, release to move files and items.'
      },
      {
        slideNumber: 14,
        image: 'media/slides/slide-14.png',
        title: 'Action 6: Scrolling',
        speech: 'Slide 14: Action 6, Scrolling. Roll the center wheel toward you or away from you with your finger to move long pages up and down without clicking.'
      },
      {
        slideNumber: 15,
        image: 'media/slides/slide-15.png',
        title: 'Master Visual Cheat Sheet',
        speech: 'Slide 15: Master Visual Cheat Sheet. Hover means Look. Single Left Click means Select. Double Click means Open. Single Right Click means Menu. Drag and Drop means Move.'
      }
    ],

    // ==========================================
    // 2. TEXT LESSON & ILLUSTRATED VISUAL PRIMER
    // ==========================================
    textLesson: {
      heading: 'Computer Basics & Mouse Mastery — Visual Primer & Study Guide',
      summary: 'Complete illustrated handbook based on "Computer Basics & Mouse Mastery" (15-page Visual Primer) and "Quick Review & Quiz". Learn desk hardware, connectors, ergonomic mouse grip, cursor shapes, and the 6 core mouse actions.',
      downloadUrl: 'media/docs/Computer_Basics_Mouse_Mastery.pdf',
      downloadLabel: 'Illustrated Visual Primer Handbook (.PDF, 11 MB, 15 Pages) — step-by-step diagrams & cheat sheet',
      reviewDocUrl: 'media/docs/Computer_Class_Review_and_Quiz.docx',
      sections: [
        {
          icon: '🛡️',
          subheading: '1. Three Rules for Stress-Free Learning',
          body: '• Zero Fear: You cannot break the computer by pressing a button or moving the mouse. Everything is safe.\n• Light Touch: Be gentle. Soft, relaxed finger taps are all the computer needs to understand you.\n• Your Own Pace: Mistakes are welcome here. Confidence grows with every minute of practice.'
        },
        {
          icon: '🖥️',
          subheading: '2. Anatomy of a Computer Desk & System Unit Types',
          body: 'Every workstation has four primary parts: (1) Monitor / Screen — displays text, windows, pictures, and programs; (2) System Unit (Tower / Brain) — performs computations and holds the Power button (comes in Tower PC, Desktop PC, Slim/Mini-Tower, Mini PC, All-in-One, or Laptop); (3) Keyboard — board of keys for typing names, words, numbers, and passwords; (4) Mouse — hand-held device that moves the on-screen arrow.'
        },
        {
          icon: '🔌',
          subheading: '3. The Cable & Port Translator',
          body: '• Power Button (⏻): Press once firmly to wake the computer or monitor.\n• USB Port (Type-A): Connects your mouse, keyboard, and USB flash drives (most common rectangular port).\n• HDMI / Video Cable: Carries high-definition video and sound from the System Unit to the Monitor.\n• Power Cable: Brings electricity safely from the wall outlet.\n• Audio Jack: Plugs in earphones or headphones to listen to videos and audio lessons.'
        },
        {
          icon: '🖱️',
          subheading: '4. Anatomy of the Mouse & Ergonomic Grip (DO vs. DON\'T)',
          body: '• Left Button (Green Dot): Used for 90% of daily actions (index finger rests here).\n• Scroll Wheel (Center): Rolls web pages and documents up and down.\n• Right Button (Orange Dot): Opens helpful hidden context menus (middle finger rests here).\n\n✅ DO: Rest palm gently over the curved body, slide using your forearm (not just wrist), keep index finger relaxed on the left button.\n❌ DON\'T: Never bend your wrist backward, squeeze tightly ("death grip"), or lift the mouse in the air to move it.'
        },
        {
          icon: '🔍',
          subheading: '5. The Cursor Decoder Ring (How the Arrow Talks to You)',
          body: '• Standard Pointer (White Arrow): "I am ready. Use me to click and select items."\n• The Web Hand (Pointing Finger): "You are hovering over an internet link! Single-click me to open the page."\n• The Text Cursor (I-Beam): "Click here, and you can begin typing words with your keyboard."\n• The Working Wheel (Spinning Circle): "The computer is thinking. Please wait a second before clicking again."'
        },
        {
          icon: '⚡',
          subheading: '6. The 6 Core Mouse Actions',
          body: '1. Point & Hover: Slide flat without pressing to reveal helpful tooltips.\n2. Single Left Click: One crisp tap on the left button (Green) to select a file or open a web link.\n3. Double Click: Freeze your hand on the desk and tap the left button twice very fast ("click-click!") to open folders & apps.\n4. Right Click: Tap the right button (Orange) once with your middle finger to open special options (Copy, Paste, Rename, Delete).\n5. Drag & Drop: Press & hold Left button -> Slide across desk -> Release to move files.\n6. Scrolling: Roll the center wheel toward you (down) or away from you (up) without clicking.'
        }
      ],
      cheatSheet: [
        { physical: 'Slide without clicking', name: 'Hover / Point', intent: 'Look — reveals tooltips & highlights items' },
        { physical: 'Green Dot (Tap Once)', name: 'Single Left Click', intent: 'Select — highlights an item or opens a web link' },
        { physical: 'Green Dot (Tap-Tap! Freeze hand)', name: 'Double Click', intent: 'Open — launches desktop programs, files & folders' },
        { physical: 'Orange Dot (Tap Once)', name: 'Single Right Click', intent: 'Menu — opens extra options (Copy, Paste, Rename)' },
        { physical: 'Hold Green Dot & Slide', name: 'Drag & Drop', intent: 'Move — picks up and drops an item to a new place' },
        { physical: 'Roll Center Wheel', name: 'Scroll Wheel', intent: 'Scroll — moves long pages up and down smoothly' }
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
      vocabulary: [
        { word: 'Monitor', phonetic: 'Mon-i-tor', meaning: 'The screen that displays pictures and text' },
        { word: 'Keyboard', phonetic: 'Key-board', meaning: 'Board of keys used to type letters and numbers' },
        { word: 'Mouse', phonetic: 'Mouse', meaning: 'Hand device that moves the pointer on screen' },
        { word: 'Cursor', phonetic: 'Cur-sor', meaning: 'The arrow on screen showing where you point' },
        { word: 'Left Click', phonetic: 'Left Click', meaning: 'One gentle tap with index finger to select' },
        { word: 'Double Click', phonetic: 'Dou-ble Click', meaning: 'Two fast taps without moving to open' },
        { word: 'Scroll Wheel', phonetic: 'Scroll Wheel', meaning: 'Center wheel rolled to move pages up and down' },
        { word: 'Drag and Drop', phonetic: 'Drag and Drop', meaning: 'Hold left button, slide, and release to move items' }
      ],
      transcription: 'Listen carefully: "Monitor", "Keyboard", "Mouse", "Tower", "Left Click", "Double Click", "Scroll Wheel", "Cursor". Practice repeating each word aloud.',
      speechPrompt: 'Welcome to Lesson 1. The monitor shows your screen. The mouse is your digital hand. Tap the left button once to select, and tap twice fast to open a file.'
    },

    // ==========================================
    // 5. STUDENT & LOGGED-IN USER MATERIALS (from media/)
    //    NOTE: Teacher-exclusive Lesson_Plan_and_Teaching_Script.docx is NEVER listed here.
    // ==========================================
    studentMaterials: [
      {
        id: 'mat_pptx',
        type: 'presentation',
        badge: 'PPTX Presentation • 12 Slides',
        icon: '📊',
        title: 'Introduction to Computers & Mouse Basics',
        description: 'Official classroom slide deck covering hardware, ergonomic grip, 4 core actions, and stress-free rules.',
        file: 'media/docs/Introduction_to_Computers_and_Mouse_Basics.pptx',
        size: '721 KB',
        previewTab: 'presentation',
        previewMode: 'deck'
      },
      {
        id: 'mat_pdf',
        type: 'pdf',
        badge: 'Visual Primer PDF • 15 Pages',
        icon: '📕',
        title: 'Computer Basics & Mouse Mastery Handbook',
        description: 'Full-color illustrated visual primer with cable translator, DO/DON\'T posture guide, cursor decoder & cheat sheet.',
        file: 'media/docs/Computer_Basics_Mouse_Mastery.pdf',
        size: '11 MB',
        previewTab: 'presentation',
        previewMode: 'pdf'
      },
      {
        id: 'mat_review_docx',
        type: 'docx',
        badge: 'Review & Quiz DOCX',
        icon: '📝',
        title: 'Computer Class Quick Review & Printable Quiz',
        description: 'Summary cheat-sheet of key terms plus the 6-question review worksheet for classroom or home practice.',
        file: 'media/docs/Computer_Class_Review_and_Quiz.docx',
        size: '1.2 MB',
        previewTab: 'text',
        previewMode: 'cheatsheet'
      },
      {
        id: 'mat_video',
        type: 'video',
        badge: 'MP4 Video • 4m 12s',
        icon: '🎬',
        title: 'Computers & Mouse Basics Walkthrough',
        description: 'Narrated step-by-step video demonstrating desk hardware, grip, clicking rhythm, and desktop navigation.',
        file: 'media/videos/Computers___Mouse_Basics.mp4',
        size: '26 MB',
        previewTab: 'video'
      }
    ],

    // ==========================================
    // 6. QUIZ (6 Questions from Official Review DOCX)
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
    // 7. TEACHER-EXCLUSIVE GUIDANCE & FULL VERBATIM SCRIPT
    //    (STRICTLY accessible ONLY to authenticated Teachers!)
    // ==========================================
    teacherNotes: {
      teacherExclusiveDoc: {
        title: 'Lesson Plan & Complete Teaching Script (.DOCX)',
        file: 'media/docs/Lesson_Plan_and_Teaching_Script.docx',
        size: '644 KB',
        badge: '🔒 Teacher Exclusive Document'
      },
      courseInfo: {
        audience: 'Adult newcomers, refugees, and seniors with beginner/zero digital and English literacy.',
        duration: '75–90 Minutes (approx. 35 mins guided demonstration / 45–50 mins interactive practice).',
        languageLevel: 'Plain, slow, supportive English (CLB 1–3 friendly) with physical modeling & projector cues.',
        equipment: 'Projector, Windows 10/11 PCs, standard optical mice, green & orange color-dot stickers, printed cheat-sheets.'
      },
      learningGoal: 'Ensure every learner can identify the 4 primary desk hardware components, adopt an ergonomic mouse posture, execute single and double clicks with correct rhythm, and move icons via drag & drop without fear or strain.',
      methodologyTips: [
        'The "Say - Show - Do - Check" Cycle: Never give verbal instruction without physically pointing and demonstrating on the projector screen first. Wait for all eyes, demonstrate twice, then instruct students to do it.',
        'Radical Patience & Zero Pressure: The neurological link between horizontal hand movement on a desk and vertical pointer movement on screen is unfamiliar for beginners. Never grab their mouse unless invited; guide verbally and point to their desk.',
        'The Color-Dot Technique: Place a small green sticker on the Left Mouse Button and an orange sticker on the Right Mouse Button. Refer to the "Green button" whenever language barriers arise.',
        'Mouse Sensitivity Calibration: Set Windows pointer speed to low or medium before class starts to prevent erratic jumping.'
      ],
      scriptBlocks: [
        {
          id: 'block1',
          title: 'Block 1: Welcome, Comfort Check & Environment Setup',
          duration: '10–12 Minutes',
          objective: 'Reduce performance anxiety, ensure ergonomic seating, and establish basic trust.',
          script: '"Good morning everyone! Welcome to our computer class! Please sit down and make yourself comfortable. Are your feet flat on the floor? Nobody can break the computer today. You cannot break it by pressing a button or moving the mouse. Everything is safe. We start from zero. In this room, mistakes are welcome! If you ever feel lost, confused, or stuck—just raise your hand and I will come to your desk with a smile."',
          teacherActions: [
            'Walk around the room and assist anyone whose monitor power is off.',
            'Ensure every chair and desk space allows free arm movement.'
          ]
        },
        {
          id: 'block2',
          title: 'Block 2: Computer Anatomy & Hardware Identification',
          duration: '15–18 Minutes',
          objective: 'Learn and pronounce 4 core physical parts; master ergonomic mouse grip.',
          script: '"A computer is made of 4 main tools: (1) Monitor / Screen — let us say it together: Mon-i-tor! (2) The Tower or System Unit — the brain with the Power button. (3) The Keyboard — used to type names, words, and passwords. (4) The Mouse — it looks like a little mouse with a tail! Rest your palm gently like holding an apple or egg. Index finger rests on the Green dot (left button), middle finger on the Orange dot (right button), wrist flat on the desk."',
          teacherActions: [
            'Walk row by row checking for the "death grip" (white knuckles). Remind gently: "Soft hand, like holding an egg."',
            'Verify index fingers sit on the Green left button, not hovering in air or on the scroll wheel.'
          ]
        },
        {
          id: 'block3',
          title: 'Block 3: The 4 Core Mouse Actions',
          duration: '20–25 Minutes',
          objective: 'Master Hover, Single Left Click, Double Click, and Drag & Drop.',
          script: 'Action 1 (Hover): "Slide flat on the mousepad; park over Recycle Bin without clicking—see the tooltip box!" • Action 2 (Left Click): "One gentle tap on the Green button—click!—and let go immediately." • Action 3 (Double Click — The Big Hurdle): "FREEZE your hand on the mousepad! Only your index finger taps: tap-tap, quick like a heartbeat! Click X in the top right to close." • Action 4 (Drag & Drop): "Think of picking up a cup of tea: Point -> Press Green & HOLD -> Slide across desk -> Lift finger to Drop!"',
          teacherActions: [
            'Watch for hand shaking during Double Click; remind students to keep their palm heavy and still.',
            'Remind students who run out of desk space: lift mouse, place back in center, and continue sliding.'
          ]
        },
        {
          id: 'block4',
          title: 'Block 4: Interactive Practice & Gamified Drills',
          duration: '25–30 Minutes',
          objective: 'Transition from theory to muscle memory through zero-stress games & MS Paint.',
          script: '"Now we are going to play some games to train our hands. Work at your own pace. There is no timer and no grade. If an exercise feels hard, do it three times. Raise your hand anytime you need help!"',
          teacherActions: [
            'Launch WelcomePlace Mouse Precision Lab or recommended browser drills below.',
            'If offline without browser tools, run the MS Paint 3-step circle & bucket-fill drill.'
          ]
        },
        {
          id: 'block5',
          title: 'Block 5: Wrap-Up, Q&A & Positive Reinforcement',
          duration: '10 Minutes',
          objective: 'Summarize learning, celebrate progress, and preview Lesson 2 (Keyboard).',
          script: '"Hands off the mouse and stretch your fingers! Look at what you accomplished today: Monitor, Keyboard, Mouse, Hover, Left Click, Double Click, and Drag & Drop! This is a huge milestone. Next class we will explore the Keyboard—how to type your name, Spacebar, and Backspace."',
          teacherActions: [
            'Lead group finger & wrist stretches.',
            'Administer the 6-question Module 1 Knowledge Check or distribute printed review sheets.'
          ]
        }
      ],
      practiceTracks: [
        { track: 'Built-In Lab', tool: 'WelcomePlace Mouse Precision Lab', skill: 'All 6 Core Mouse Skills (24 Levels)', focus: 'Zero-stress gamified drills offline' },
        { track: 'Online Track A', tool: 'PBCLibrary Mousercise', skill: 'Hover & Precise Pointing', focus: 'Moving inside small squares without clicking' },
        { track: 'Online Track B', tool: 'DigitalLearn.org', skill: 'Single & Double Clicking', focus: 'Target practice with real-time feedback' },
        { track: 'Online Track C', tool: 'JigsawPlanet / Solitaire', skill: 'Drag & Drop', focus: 'Holding click while maneuvering across screen' },
        { track: 'Offline Track', tool: 'MS Paint', skill: 'Complete Mouse Control', focus: 'Draw 5 circles, connect straight lines, Bucket fill colors' }
      ],
      classroomExercises: [
        'Block 1: Welcome & Comfort Check (10-12 min) - Seating ergonomics, screen check, overcoming the fear of breaking the computer.',
        'Block 2: Computer Anatomy & Hardware (15-18 min) - Identifying monitor, tower, keyboard, mouse, and power button.',
        'Block 3: The 4 Core Mouse Actions (20-25 min) - Move & hover, single left click, double click heartbeat rhythm, and drag & drop.',
        'Block 4: Interactive Practice & Drills (25-30 min) - Using the WelcomePlace Mouse Lab, Mousercise, and MS Paint offline drills.',
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
          quote: '"Think of it like holding a cup of tea: Press down and hold, slide smoothly across the table, then let go."'
        }
      ]
    }
  }
];

if (typeof window !== 'undefined') {
  window.MODULES_DATA = MODULES_DATA;
}
