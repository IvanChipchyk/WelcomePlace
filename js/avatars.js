/**
 * WelcomePlace - Inclusive & Diverse Student Avatars
 * Handcrafted vector SVG avatars representing people of diverse ethnicities,
 * genders, and cultural backgrounds (including women in hijab, African, Middle Eastern,
 * South Asian, East Asian, and diverse newcomer communities).
 */

const AVATARS_DATA = [
  {
    id: 'avatar_hijab_teal',
    name: 'Woman with Hijab',
    background: '#e0f2fe',
    svg: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#e0f2fe"/>
        <!-- Hijab Outer / Shoulder wrap -->
        <path d="M22 100 C22 75 32 60 50 60 C68 60 78 75 78 100 Z" fill="#0284c7"/>
        <path d="M28 52 C26 30 36 15 50 15 C64 15 74 30 72 52 C71 68 64 78 50 78 C36 78 29 68 28 52 Z" fill="#0369a1"/>
        <!-- Face Oval -->
        <ellipse cx="50" cy="49" rx="16" ry="19" fill="#8d5524"/>
        <!-- Hijab Inner Forehead Band -->
        <path d="M36 40 C41 35 59 35 64 40 C63 35 57 33 50 33 C43 33 37 35 36 40 Z" fill="#0284c7"/>
        <!-- Eyes & Eyebrows -->
        <circle cx="44" cy="48" r="2.2" fill="#1e293b"/>
        <circle cx="56" cy="48" r="2.2" fill="#1e293b"/>
        <path d="M41 43 Q44 41 47 43" stroke="#1e293b" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M53 43 Q56 41 59 43" stroke="#1e293b" stroke-width="1.4" stroke-linecap="round"/>
        <!-- Nose -->
        <path d="M50 49 Q51 53 49 54" stroke="#663c16" stroke-width="1.2" stroke-linecap="round"/>
        <!-- Smile -->
        <path d="M45 59 Q50 63 55 59" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    `
  },
  {
    id: 'avatar_man_african',
    name: 'Man (Short Hair / African)',
    background: '#ecfdf5',
    svg: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#ecfdf5"/>
        <!-- Shoulders / Shirt -->
        <path d="M20 100 C20 76 33 66 50 66 C67 66 80 76 80 100 Z" fill="#059669"/>
        <!-- Neck -->
        <rect x="44" y="55" width="12" height="15" fill="#603813"/>
        <!-- Head -->
        <ellipse cx="50" cy="44" rx="19" ry="22" fill="#603813"/>
        <!-- Hair -->
        <path d="M30 40 C30 22 39 16 50 16 C61 16 70 22 70 40 C67 25 33 25 30 40 Z" fill="#18181b"/>
        <!-- Ears -->
        <circle cx="31" cy="44" r="5" fill="#603813"/>
        <circle cx="69" cy="44" r="5" fill="#603813"/>
        <!-- Eyes & Brows -->
        <circle cx="43" cy="43" r="2.4" fill="#18181b"/>
        <circle cx="57" cy="43" r="2.4" fill="#18181b"/>
        <path d="M39 38 Q43 36 47 38" stroke="#18181b" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M53 38 Q57 36 61 38" stroke="#18181b" stroke-width="1.8" stroke-linecap="round"/>
        <!-- Nose -->
        <path d="M50 44 Q52 49 48 50" stroke="#3b2006" stroke-width="1.4" stroke-linecap="round"/>
        <!-- Warm Friendly Smile -->
        <path d="M43 54 Q50 60 57 54" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `
  },
  {
    id: 'avatar_woman_braids',
    name: 'Woman (Braided Updo)',
    background: '#fef3c7',
    svg: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#fef3c7"/>
        <!-- Hair Bun / Bun top -->
        <circle cx="50" cy="22" r="14" fill="#18181b"/>
        <!-- Shoulders / Blouse -->
        <path d="M20 100 C20 77 34 68 50 68 C66 68 80 77 80 100 Z" fill="#d97706"/>
        <!-- Neck with collar -->
        <rect x="44" y="58" width="12" height="14" fill="#794a28"/>
        <!-- Head -->
        <ellipse cx="50" cy="47" rx="18" ry="20" fill="#794a28"/>
        <!-- Hair Side Lines -->
        <path d="M32 46 C31 30 40 24 50 24 C60 24 69 30 68 46 C64 30 36 30 32 46 Z" fill="#18181b"/>
        <!-- Earrings -->
        <circle cx="31" cy="48" r="3" fill="#fbbf24"/>
        <circle cx="69" cy="48" r="3" fill="#fbbf24"/>
        <!-- Eyes & Brows -->
        <circle cx="43" cy="45" r="2.2" fill="#18181b"/>
        <circle cx="57" cy="45" r="2.2" fill="#18181b"/>
        <path d="M40 40 Q43 38 46 40" stroke="#18181b" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M54 40 Q57 38 60 40" stroke="#18181b" stroke-width="1.4" stroke-linecap="round"/>
        <!-- Smile -->
        <path d="M44 56 Q50 61 56 56" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `
  },
  {
    id: 'avatar_man_beard',
    name: 'Man with Beard',
    background: '#ede9fe',
    svg: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#ede9fe"/>
        <!-- Shoulders / Jacket -->
        <path d="M20 100 C20 76 33 66 50 66 C67 66 80 76 80 100 Z" fill="#4f46e5"/>
        <!-- Neck -->
        <rect x="44" y="55" width="12" height="15" fill="#c68642"/>
        <!-- Head -->
        <ellipse cx="50" cy="44" rx="18" ry="21" fill="#c68642"/>
        <!-- Dark Hair -->
        <path d="M31 38 C31 20 40 16 50 16 C60 16 69 20 69 38 C65 24 35 24 31 38 Z" fill="#1e1b4b"/>
        <!-- Ears -->
        <circle cx="31" cy="44" r="4.5" fill="#c68642"/>
        <circle cx="69" cy="44" r="4.5" fill="#c68642"/>
        <!-- Beard -->
        <path d="M33 46 C34 66 45 70 50 70 C55 70 66 66 67 46 C67 52 64 63 50 64 C36 63 33 52 33 46 Z" fill="#1e1b4b"/>
        <!-- Mustache -->
        <path d="M43 54 Q50 56 57 54" stroke="#1e1b4b" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Eyes & Brows -->
        <circle cx="43" cy="42" r="2.2" fill="#1e1b4b"/>
        <circle cx="57" cy="42" r="2.2" fill="#1e1b4b"/>
        <path d="M40 37 Q44 35 47 37" stroke="#1e1b4b" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M53 37 Q56 35 60 37" stroke="#1e1b4b" stroke-width="1.8" stroke-linecap="round"/>
        <!-- Smile inside beard -->
        <path d="M46 58 Q50 61 54 58" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
    `
  },
  {
    id: 'avatar_woman_asia',
    name: 'Woman (Straight Hair)',
    background: '#ffe4e6',
    svg: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#ffe4e6"/>
        <!-- Long Hair Behind -->
        <path d="M30 38 C30 65 33 80 33 90 C37 90 38 65 40 55 C60 55 62 65 67 90 C67 80 70 65 70 38 Z" fill="#1e293b"/>
        <!-- Shoulders -->
        <path d="M22 100 C22 78 34 68 50 68 C66 68 78 78 78 100 Z" fill="#e11d48"/>
        <!-- Neck -->
        <rect x="44" y="56" width="12" height="14" fill="#fcd34d"/>
        <!-- Head -->
        <ellipse cx="50" cy="45" rx="18" ry="20" fill="#fed7aa"/>
        <!-- Front Bangs / Hair -->
        <path d="M32 38 C32 22 41 18 50 18 C59 18 68 22 68 38 C60 28 40 28 32 38 Z" fill="#1e293b"/>
        <!-- Eyes & Brows -->
        <circle cx="43" cy="43" r="2.2" fill="#0f172a"/>
        <circle cx="57" cy="43" r="2.2" fill="#0f172a"/>
        <path d="M40 38 Q43 36 46 38" stroke="#0f172a" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M54 38 Q57 36 60 38" stroke="#0f172a" stroke-width="1.4" stroke-linecap="round"/>
        <!-- Smile -->
        <path d="M44 54 Q50 58 56 54" stroke="#e11d48" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    `
  },
  {
    id: 'avatar_man_glasses',
    name: 'Person with Glasses',
    background: '#f1f5f9',
    svg: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#f1f5f9"/>
        <!-- Shoulders / Polo Shirt -->
        <path d="M20 100 C20 76 33 66 50 66 C67 66 80 76 80 100 Z" fill="#0284c7"/>
        <!-- Neck -->
        <rect x="44" y="55" width="12" height="15" fill="#e0ac69"/>
        <!-- Head -->
        <ellipse cx="50" cy="44" rx="18" ry="21" fill="#e0ac69"/>
        <!-- Wavy Hair -->
        <path d="M30 36 C28 20 40 15 50 15 C60 15 72 20 70 36 C64 24 36 24 30 36 Z" fill="#451a03"/>
        <!-- Glasses -->
        <rect x="36" y="39" width="12" height="9" rx="3" stroke="#0f172a" stroke-width="2" fill="rgba(255,255,255,0.4)"/>
        <rect x="52" y="39" width="12" height="9" rx="3" stroke="#0f172a" stroke-width="2" fill="rgba(255,255,255,0.4)"/>
        <line x1="48" y1="43" x2="52" y2="43" stroke="#0f172a" stroke-width="2"/>
        <!-- Eyes inside lenses -->
        <circle cx="42" cy="43" r="1.8" fill="#0f172a"/>
        <circle cx="58" cy="43" r="1.8" fill="#0f172a"/>
        <!-- Smile -->
        <path d="M44 55 Q50 60 56 55" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `
  },
  {
    id: 'avatar_girl_caucasian',
    name: 'Young Woman / Girl',
    background: '#fdf4ff',
    svg: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#fdf4ff"/>
        <!-- Long Hair Behind -->
        <path d="M26 40 C24 66 28 85 30 96 C36 96 36 68 38 56 C62 56 64 68 70 96 C72 85 76 66 74 40 Z" fill="#d97706"/>
        <!-- Shoulders / Lavender Sweater -->
        <path d="M22 100 C22 78 34 68 50 68 C66 68 78 78 78 100 Z" fill="#9333ea"/>
        <!-- Neck -->
        <rect x="44" y="56" width="12" height="14" fill="#ffedd5"/>
        <!-- Head -->
        <ellipse cx="50" cy="45" rx="18" ry="20" fill="#ffedd5"/>
        <!-- Blond/Wavy Hair Front -->
        <path d="M28 38 C28 20 40 15 50 15 C60 15 72 20 72 38 C62 26 56 30 50 26 C44 30 38 26 28 38 Z" fill="#f59e0b"/>
        <!-- Eyes & Brows -->
        <circle cx="43" cy="43" r="2.2" fill="#0f172a"/>
        <circle cx="57" cy="43" r="2.2" fill="#0f172a"/>
        <path d="M40 38 Q43 36 46 38" stroke="#78350f" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M54 38 Q57 36 60 38" stroke="#78350f" stroke-width="1.4" stroke-linecap="round"/>
        <!-- Nose -->
        <path d="M50 44 Q51 48 49 49" stroke="#ea580c" stroke-width="1.2" stroke-linecap="round"/>
        <!-- Smile -->
        <path d="M44 54 Q50 59 56 54" stroke="#e11d48" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `
  },
  {
    id: 'avatar_boy_caucasian',
    name: 'Young Man / Boy',
    background: '#eff6ff',
    svg: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#eff6ff"/>
        <!-- Shoulders / Navy T-shirt -->
        <path d="M20 100 C20 76 33 66 50 66 C67 66 80 76 80 100 Z" fill="#1d4ed8"/>
        <!-- Neck -->
        <rect x="44" y="55" width="12" height="15" fill="#fed7aa"/>
        <!-- Head -->
        <ellipse cx="50" cy="44" rx="18" ry="21" fill="#fed7aa"/>
        <!-- Short Brown Hair -->
        <path d="M30 36 C30 18 38 14 50 14 C62 14 70 18 70 36 C66 22 58 20 50 20 C42 20 34 22 30 36 Z" fill="#78350f"/>
        <!-- Ears -->
        <circle cx="31" cy="44" r="4.5" fill="#fed7aa"/>
        <circle cx="69" cy="44" r="4.5" fill="#fed7aa"/>
        <!-- Eyes & Brows -->
        <circle cx="43" cy="42" r="2.2" fill="#0f172a"/>
        <circle cx="57" cy="42" r="2.2" fill="#0f172a"/>
        <path d="M40 37 Q44 35 47 37" stroke="#78350f" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M53 37 Q56 35 60 37" stroke="#78350f" stroke-width="1.6" stroke-linecap="round"/>
        <!-- Nose -->
        <path d="M50 43 Q51 47 49 48" stroke="#ea580c" stroke-width="1.2" stroke-linecap="round"/>
        <!-- Smile -->
        <path d="M43 54 Q50 60 57 54" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `
  }
];

const AvatarsService = {
  getAll() {
    return AVATARS_DATA;
  },

  getById(id) {
    const found = AVATARS_DATA.find(a => a.id === id);
    return found || AVATARS_DATA[0];
  },

  getSvgHtml(id, size = 48) {
    const item = this.getById(id);
    return `
      <div class="avatar-svg-container" style="width: ${size}px; height: ${size}px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; overflow: hidden; flex-shrink: 0;">
        ${item.svg}
      </div>
    `;
  }
};

if (typeof window !== 'undefined') {
  window.AVATARS_DATA = AVATARS_DATA;
  window.AvatarsService = AvatarsService;
}
