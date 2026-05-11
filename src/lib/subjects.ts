// Subject-specific decoration motifs layered on top of theme decorations.
// Each subject contributes 3-4 inline SVG patterns that float in the slide
// background — math gets numbers/π, science gets atoms, english gets books, etc.

export type SubjectId =
  | "math"
  | "science"
  | "english"
  | "language"
  | "history"
  | "geography"
  | "art"
  | "music"
  | "general";

export type Subject = {
  id: SubjectId;
  label: string;
  hint: string;
  decorations: string[];  // 3-4 inline SVG strings (40x40 viewBox, currentColor-friendly)
};

// ─── SVG motifs ──────────────────────────────────────────────
// 40x40 viewBox, uses currentColor so they inherit theme accent

// Math
const MATH_NUM = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><text x="20" y="30" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="900" font-size="32" fill="currentColor" opacity="0.85">7</text></svg>`;
const MATH_PI = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><text x="20" y="30" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="900" font-size="32" fill="currentColor" opacity="0.85">π</text></svg>`;
const MATH_PLUS = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect x="17" y="6" width="6" height="28" rx="1" fill="currentColor" opacity="0.8"/><rect x="6" y="17" width="28" height="6" rx="1" fill="currentColor" opacity="0.8"/></svg>`;
const MATH_TRI = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><polygon points="20,5 35,33 5,33" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" opacity="0.8"/></svg>`;

// Science
const SCI_ATOM = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><ellipse cx="20" cy="20" rx="15" ry="6" fill="none" stroke="currentColor" stroke-width="1.6" opacity="0.7"/><ellipse cx="20" cy="20" rx="15" ry="6" fill="none" stroke="currentColor" stroke-width="1.6" opacity="0.7" transform="rotate(60 20 20)"/><ellipse cx="20" cy="20" rx="15" ry="6" fill="none" stroke="currentColor" stroke-width="1.6" opacity="0.7" transform="rotate(-60 20 20)"/><circle cx="20" cy="20" r="3" fill="currentColor"/></svg>`;
const SCI_FLASK = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M16 6 L16 16 L8 32 Q8 36 20 36 Q32 36 32 32 L24 16 L24 6 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" opacity="0.8"/><path d="M11 28 Q20 30 29 28" stroke="currentColor" stroke-width="2" opacity="0.6"/><line x1="14" y1="6" x2="26" y2="6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>`;
const SCI_DNA = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M14 6 Q26 14 14 22 Q26 30 14 38" fill="none" stroke="currentColor" stroke-width="2" opacity="0.8"/><path d="M26 6 Q14 14 26 22 Q14 30 26 38" fill="none" stroke="currentColor" stroke-width="2" opacity="0.8"/><line x1="14" y1="11" x2="26" y2="11" stroke="currentColor" stroke-width="1.5" opacity="0.5"/><line x1="14" y1="22" x2="26" y2="22" stroke="currentColor" stroke-width="1.5" opacity="0.5"/><line x1="14" y1="33" x2="26" y2="33" stroke="currentColor" stroke-width="1.5" opacity="0.5"/></svg>`;

// English / Language Arts
const ENG_BOOK = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M5 10 Q20 6 35 10 L35 32 Q20 28 5 32 Z" fill="currentColor" opacity="0.55" stroke="currentColor" stroke-width="1.5"/><line x1="20" y1="9" x2="20" y2="30" stroke="currentColor" stroke-width="1.5" opacity="0.8"/></svg>`;
const ENG_QUOTE = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><text x="20" y="32" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="900" font-size="38" fill="currentColor" opacity="0.85">"</text></svg>`;
const ENG_PEN = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M30 6 L34 10 L14 30 L10 30 L10 26 Z" fill="currentColor" opacity="0.7" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><line x1="26" y1="10" x2="30" y2="14" stroke="currentColor" stroke-width="1.5"/></svg>`;
const ENG_LETTER = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><text x="20" y="31" text-anchor="middle" font-family="Cinzel, Georgia, serif" font-weight="900" font-size="28" fill="currentColor" opacity="0.85">A</text></svg>`;

// Language (foreign)
const LANG_GLOBE_TXT = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" stroke-width="2" opacity="0.8"/><path d="M6 20 Q20 12 34 20 Q20 28 6 20" fill="none" stroke="currentColor" stroke-width="1.4" opacity="0.6"/><line x1="20" y1="6" x2="20" y2="34" stroke="currentColor" stroke-width="1.4" opacity="0.6"/></svg>`;
const LANG_BUBBLE = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M6 14 Q6 8 12 8 L28 8 Q34 8 34 14 L34 22 Q34 28 28 28 L18 28 L12 33 L12 28 Q6 28 6 22 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" opacity="0.8"/></svg>`;
const LANG_HOLA = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><text x="20" y="26" text-anchor="middle" font-family="Patrick Hand, cursive" font-weight="700" font-size="13" fill="currentColor" opacity="0.85">¡Hola!</text></svg>`;

// History
const HIS_SCROLL = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="10" width="24" height="22" rx="2" fill="currentColor" opacity="0.4"/><rect x="8" y="10" width="24" height="22" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="13" y1="16" x2="27" y2="16" stroke="currentColor" stroke-width="1" opacity="0.7"/><line x1="13" y1="20" x2="27" y2="20" stroke="currentColor" stroke-width="1" opacity="0.7"/><line x1="13" y1="24" x2="23" y2="24" stroke="currentColor" stroke-width="1" opacity="0.7"/></svg>`;
const HIS_COLUMN = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="6" width="20" height="3" fill="currentColor" opacity="0.85"/><rect x="13" y="9" width="14" height="22" fill="none" stroke="currentColor" stroke-width="1.6" opacity="0.8"/><line x1="17" y1="9" x2="17" y2="31" stroke="currentColor" stroke-width="1" opacity="0.5"/><line x1="23" y1="9" x2="23" y2="31" stroke="currentColor" stroke-width="1" opacity="0.5"/><rect x="10" y="31" width="20" height="3" fill="currentColor" opacity="0.85"/></svg>`;
const HIS_HOURGLASS = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M10 6 L30 6 L20 20 L30 34 L10 34 L20 20 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" opacity="0.85"/><polygon points="20,20 24,16 16,16" fill="currentColor" opacity="0.6"/></svg>`;

// Geography
const GEO_GLOBE = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" stroke-width="2" opacity="0.8"/><path d="M6 20 Q20 14 34 20 Q20 26 6 20" fill="none" stroke="currentColor" stroke-width="1.4" opacity="0.7"/><ellipse cx="20" cy="20" rx="6" ry="14" fill="none" stroke="currentColor" stroke-width="1.4" opacity="0.7"/></svg>`;
const GEO_MOUNTAIN = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><polygon points="6,32 15,12 23,22 28,16 34,32" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" opacity="0.85"/><polygon points="13,16 15,12 17,16" fill="currentColor" opacity="0.6"/></svg>`;
const GEO_COMPASS = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" stroke-width="2" opacity="0.8"/><polygon points="20,8 23,20 20,32 17,20" fill="currentColor" opacity="0.75"/><circle cx="20" cy="20" r="2" fill="currentColor"/></svg>`;

// Art
const ART_BRUSH = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect x="18" y="20" width="4" height="14" rx="1" fill="currentColor" opacity="0.8"/><path d="M15 6 Q20 4 25 6 L25 22 L15 22 Z" fill="currentColor" opacity="0.6" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
const ART_PALETTE = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M8 18 Q8 8 20 6 Q34 6 34 18 Q34 28 24 28 Q22 28 22 30 Q22 34 18 34 Q6 34 8 18 Z" fill="none" stroke="currentColor" stroke-width="2" opacity="0.85"/><circle cx="14" cy="14" r="2" fill="currentColor" opacity="0.7"/><circle cx="20" cy="11" r="2" fill="currentColor" opacity="0.5"/><circle cx="26" cy="14" r="2" fill="currentColor" opacity="0.7"/><circle cx="28" cy="20" r="2" fill="currentColor" opacity="0.5"/></svg>`;
const ART_SPLAT = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M20 8 Q26 10 28 6 Q30 12 34 14 Q30 18 32 22 Q26 22 24 28 Q20 24 16 28 Q14 22 8 22 Q12 18 8 14 Q14 12 12 6 Q16 10 20 8 Z" fill="currentColor" opacity="0.55"/></svg>`;

// Music
const MUS_NOTE = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><ellipse cx="14" cy="30" rx="6" ry="4.5" fill="currentColor" opacity="0.85" transform="rotate(-12 14 30)"/><rect x="19" y="6" width="3" height="24" fill="currentColor" opacity="0.85"/><path d="M22 6 Q32 8 32 18 L22 14 Z" fill="currentColor" opacity="0.85"/></svg>`;
const MUS_CLEF = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M20 6 Q15 9 16 16 Q17 20 22 22 Q28 24 26 30 Q24 36 18 34 Q14 32 14 28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.85"/><circle cx="18" cy="32" r="2" fill="currentColor"/></svg>`;
const MUS_BARS = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><line x1="6" y1="12" x2="34" y2="12" stroke="currentColor" stroke-width="1.2" opacity="0.7"/><line x1="6" y1="18" x2="34" y2="18" stroke="currentColor" stroke-width="1.2" opacity="0.7"/><line x1="6" y1="24" x2="34" y2="24" stroke="currentColor" stroke-width="1.2" opacity="0.7"/><line x1="6" y1="30" x2="34" y2="30" stroke="currentColor" stroke-width="1.2" opacity="0.7"/><circle cx="14" cy="22" r="3" fill="currentColor" opacity="0.85"/><circle cx="26" cy="16" r="3" fill="currentColor" opacity="0.85"/></svg>`;

// General fallback
const GEN_STAR = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><polygon points="20,5 25,15 36,16 27,24 30,35 20,29 10,35 13,24 4,16 15,15" fill="currentColor" opacity="0.65"/></svg>`;
const GEN_SPARK = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M20 6 L22 18 L34 20 L22 22 L20 34 L18 22 L6 20 L18 18 Z" fill="currentColor" opacity="0.7"/></svg>`;
const GEN_BLOB = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="12" fill="currentColor" opacity="0.55"/></svg>`;

export const SUBJECTS: Record<SubjectId, Subject> = {
  math:      { id: "math",      label: "Maths",        hint: "Numbers, π, equations, geometry",          decorations: [MATH_NUM, MATH_PI, MATH_PLUS, MATH_TRI] },
  science:   { id: "science",   label: "Science",      hint: "Atoms, flasks, DNA helix",                 decorations: [SCI_ATOM, SCI_FLASK, SCI_DNA] },
  english:   { id: "english",   label: "English",      hint: "Books, quotes, pens, letters",             decorations: [ENG_BOOK, ENG_QUOTE, ENG_PEN, ENG_LETTER] },
  language:  { id: "language",  label: "Languages",    hint: "Globes, speech bubbles, greetings",        decorations: [LANG_GLOBE_TXT, LANG_BUBBLE, LANG_HOLA] },
  history:   { id: "history",   label: "History",      hint: "Scrolls, columns, hourglass",              decorations: [HIS_SCROLL, HIS_COLUMN, HIS_HOURGLASS] },
  geography: { id: "geography", label: "Geography",    hint: "Globes, mountains, compasses",             decorations: [GEO_GLOBE, GEO_MOUNTAIN, GEO_COMPASS] },
  art:       { id: "art",       label: "Art",          hint: "Brushes, palettes, paint splats",          decorations: [ART_BRUSH, ART_PALETTE, ART_SPLAT] },
  music:     { id: "music",     label: "Music",        hint: "Notes, clefs, staff lines",                decorations: [MUS_NOTE, MUS_CLEF, MUS_BARS] },
  general:   { id: "general",   label: "General",      hint: "Generic sparkles & stars",                 decorations: [GEN_STAR, GEN_SPARK, GEN_BLOB] },
};

export function subjectForId(id?: string): Subject {
  if (id && id in SUBJECTS) return SUBJECTS[id as SubjectId];
  return SUBJECTS.general;
}

// Heuristic: guess subject from a free-text input
export function guessSubject(text: string): SubjectId {
  const s = text.toLowerCase();
  if (/math|algebra|geom|calc|fraction|equation|number|pi |arith/.test(s)) return "math";
  if (/science|chem|phys|bio|atom|cell|reaction|energy|force|gravity|space/.test(s)) return "science";
  if (/english|lit|gramm|poem|story|writ|essay|read/.test(s)) return "english";
  if (/spanish|french|german|hindi|mandarin|language|esl|foreign/.test(s)) return "language";
  if (/history|ancient|war|civil|empire|past|century/.test(s)) return "history";
  if (/geog|continent|country|map|river|mountain|climate|earth/.test(s)) return "geography";
  if (/art|draw|paint|color|design|sketch/.test(s)) return "art";
  if (/music|sound|rhythm|note|instrument|melod/.test(s)) return "music";
  return "general";
}
