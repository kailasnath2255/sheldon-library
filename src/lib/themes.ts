import type { ThemePreset, ThemeId } from "./template-types";

// ─── Hand-drawn mascot SVGs ────────────────────────────────────
// Each ~200x200 viewBox, ink-outlined like a children's book illustration.
// They share a consistent style: 3-4px black outlines, friendly round
// features, a small white highlight in the eyes, soft pastel fills.

const MASCOT_SPROUT = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="Sprout the Sapling">
  <ellipse cx="100" cy="180" rx="60" ry="10" fill="#1F2B3E" opacity="0.15"/>
  <path d="M100 110 Q40 80 50 40 Q75 50 100 90 Q125 50 150 40 Q160 80 100 110 Z" fill="#7FBE5C" stroke="#1F2B3E" stroke-width="4"/>
  <path d="M100 90 L100 175" stroke="#1F2B3E" stroke-width="4" stroke-linecap="round"/>
  <ellipse cx="100" cy="170" rx="30" ry="14" fill="#86C66C" stroke="#1F2B3E" stroke-width="4"/>
  <circle cx="86" cy="78" r="8" fill="#FFFFFF" stroke="#1F2B3E" stroke-width="2.5"/>
  <circle cx="114" cy="78" r="8" fill="#FFFFFF" stroke="#1F2B3E" stroke-width="2.5"/>
  <circle cx="86" cy="79" r="4" fill="#1F2B3E"/>
  <circle cx="114" cy="79" r="4" fill="#1F2B3E"/>
  <circle cx="87.5" cy="77.5" r="1.5" fill="#FFFFFF"/>
  <circle cx="115.5" cy="77.5" r="1.5" fill="#FFFFFF"/>
  <path d="M88 92 Q100 100 112 92" fill="none" stroke="#1F2B3E" stroke-width="3" stroke-linecap="round"/>
  <circle cx="74" cy="86" r="3" fill="#FF7C6B" opacity="0.6"/>
  <circle cx="126" cy="86" r="3" fill="#FF7C6B" opacity="0.6"/>
</svg>`.trim();

const MASCOT_BEE = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="Buzz the Bee">
  <ellipse cx="100" cy="180" rx="50" ry="8" fill="#1F2B3E" opacity="0.15"/>
  <ellipse cx="60" cy="80" rx="35" ry="42" fill="#FFFFFF" opacity="0.7" stroke="#1F2B3E" stroke-width="2.5"/>
  <ellipse cx="140" cy="80" rx="35" ry="42" fill="#FFFFFF" opacity="0.7" stroke="#1F2B3E" stroke-width="2.5"/>
  <ellipse cx="100" cy="115" rx="55" ry="50" fill="#FFD43B" stroke="#1F2B3E" stroke-width="4"/>
  <path d="M70 95 Q100 100 130 95" fill="none" stroke="#1F2B3E" stroke-width="6" stroke-linecap="round"/>
  <path d="M60 125 Q100 130 140 125" fill="none" stroke="#1F2B3E" stroke-width="6" stroke-linecap="round"/>
  <path d="M70 145 Q100 150 130 145" fill="none" stroke="#1F2B3E" stroke-width="6" stroke-linecap="round"/>
  <line x1="92" y1="55" x2="88" y2="40" stroke="#1F2B3E" stroke-width="3" stroke-linecap="round"/>
  <line x1="108" y1="55" x2="112" y2="40" stroke="#1F2B3E" stroke-width="3" stroke-linecap="round"/>
  <circle cx="88" cy="38" r="4" fill="#1F2B3E"/>
  <circle cx="112" cy="38" r="4" fill="#1F2B3E"/>
  <circle cx="86" cy="88" r="7" fill="#FFFFFF" stroke="#1F2B3E" stroke-width="2"/>
  <circle cx="114" cy="88" r="7" fill="#FFFFFF" stroke="#1F2B3E" stroke-width="2"/>
  <circle cx="86" cy="89" r="3" fill="#1F2B3E"/>
  <circle cx="114" cy="89" r="3" fill="#1F2B3E"/>
  <path d="M88 105 Q100 112 112 105" fill="none" stroke="#1F2B3E" stroke-width="3" stroke-linecap="round"/>
</svg>`.trim();

const MASCOT_ROCKET = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="Rocket the Astronaut">
  <ellipse cx="100" cy="185" rx="40" ry="6" fill="#1F2B3E" opacity="0.15"/>
  <path d="M100 30 Q70 50 70 100 L70 150 L130 150 L130 100 Q130 50 100 30Z" fill="#FFFFFF" stroke="#1F2B3E" stroke-width="4"/>
  <path d="M70 150 L55 175 L75 165 Z" fill="#FF6B6B" stroke="#1F2B3E" stroke-width="3"/>
  <path d="M130 150 L145 175 L125 165 Z" fill="#FF6B6B" stroke="#1F2B3E" stroke-width="3"/>
  <path d="M100 30 L95 18 L100 6 L105 18 Z" fill="#FFD43B" stroke="#1F2B3E" stroke-width="3"/>
  <circle cx="100" cy="100" r="28" fill="#9B5DE5" stroke="#1F2B3E" stroke-width="4"/>
  <circle cx="92" cy="94" r="6" fill="#FFFFFF"/>
  <circle cx="91" cy="93" r="2" fill="#1F2B3E"/>
  <circle cx="106" cy="98" r="3" fill="#FFFFFF" opacity="0.7"/>
  <path d="M90 165 Q100 180 110 165" fill="#FFD43B" stroke="#1F2B3E" stroke-width="3"/>
  <circle cx="100" cy="172" r="4" fill="#FF6B6B" stroke="#1F2B3E" stroke-width="2"/>
</svg>`.trim();

const MASCOT_STAR = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="Orbit the Star">
  <ellipse cx="100" cy="180" rx="50" ry="8" fill="#1F2B3E" opacity="0.15"/>
  <polygon points="100,30 120,80 174,86 132,118 146,170 100,142 54,170 68,118 26,86 80,80" fill="#FFD43B" stroke="#1F2B3E" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="88" cy="92" r="6" fill="#FFFFFF" stroke="#1F2B3E" stroke-width="2"/>
  <circle cx="112" cy="92" r="6" fill="#FFFFFF" stroke="#1F2B3E" stroke-width="2"/>
  <circle cx="89" cy="93" r="2.5" fill="#1F2B3E"/>
  <circle cx="113" cy="93" r="2.5" fill="#1F2B3E"/>
  <path d="M86 108 Q100 118 114 108" fill="none" stroke="#1F2B3E" stroke-width="3" stroke-linecap="round"/>
  <circle cx="78" cy="100" r="3" fill="#FF6B6B" opacity="0.7"/>
  <circle cx="122" cy="100" r="3" fill="#FF6B6B" opacity="0.7"/>
</svg>`.trim();

const MASCOT_QUILL = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="Quill the Feather">
  <ellipse cx="100" cy="180" rx="40" ry="6" fill="#1F2B3E" opacity="0.15"/>
  <path d="M150 30 Q40 80 60 170 Q90 130 130 100 Q150 80 150 30Z" fill="#722F37" stroke="#1F2B3E" stroke-width="4"/>
  <path d="M150 30 Q90 60 70 140" fill="none" stroke="#1F2B3E" stroke-width="2.5" opacity="0.5"/>
  <path d="M140 50 L70 130" fill="none" stroke="#1F2B3E" stroke-width="2" opacity="0.4"/>
  <path d="M130 70 L75 145" fill="none" stroke="#1F2B3E" stroke-width="2" opacity="0.4"/>
  <line x1="55" y1="175" x2="48" y2="190" stroke="#1F2B3E" stroke-width="4" stroke-linecap="round"/>
  <circle cx="105" cy="80" r="6" fill="#FFFFFF" stroke="#1F2B3E" stroke-width="2"/>
  <circle cx="125" cy="75" r="6" fill="#FFFFFF" stroke="#1F2B3E" stroke-width="2"/>
  <circle cx="106" cy="81" r="2.5" fill="#1F2B3E"/>
  <circle cx="126" cy="76" r="2.5" fill="#1F2B3E"/>
  <path d="M108 92 Q116 98 124 92" fill="none" stroke="#1F2B3E" stroke-width="2.5" stroke-linecap="round"/>
</svg>`.trim();

const MASCOT_MASK = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="Sock the Mask">
  <ellipse cx="100" cy="180" rx="50" ry="8" fill="#1F2B3E" opacity="0.15"/>
  <path d="M100 40 Q40 50 50 110 Q60 160 100 165 Q140 160 150 110 Q160 50 100 40Z" fill="#D4AF37" stroke="#1F2B3E" stroke-width="4"/>
  <path d="M70 75 L90 95 L70 95 L90 75Z" fill="#1F2B3E"/>
  <path d="M130 75 L110 95 L130 95 L110 75Z" fill="#1F2B3E"/>
  <path d="M80 130 Q100 145 120 130" fill="none" stroke="#1F2B3E" stroke-width="4" stroke-linecap="round"/>
  <circle cx="70" cy="60" r="4" fill="#FF6B6B"/>
  <circle cx="130" cy="60" r="4" fill="#FF6B6B"/>
</svg>`.trim();

const MASCOT_FISH = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="Finn the Fish">
  <ellipse cx="100" cy="180" rx="50" ry="6" fill="#1F2B3E" opacity="0.15"/>
  <path d="M150 100 L180 70 L180 130Z" fill="#006A75" stroke="#1F2B3E" stroke-width="4" stroke-linejoin="round"/>
  <ellipse cx="100" cy="100" rx="65" ry="50" fill="#7DCCDB" stroke="#1F2B3E" stroke-width="4"/>
  <path d="M40 100 Q35 70 50 50 Q60 75 60 100 Z" fill="#006A75" stroke="#1F2B3E" stroke-width="3"/>
  <path d="M40 100 Q35 130 50 150 Q60 125 60 100 Z" fill="#006A75" stroke="#1F2B3E" stroke-width="3"/>
  <circle cx="125" cy="90" r="10" fill="#FFFFFF" stroke="#1F2B3E" stroke-width="3"/>
  <circle cx="128" cy="91" r="5" fill="#1F2B3E"/>
  <circle cx="130" cy="89" r="2" fill="#FFFFFF"/>
  <path d="M120 115 Q135 125 150 115" fill="none" stroke="#1F2B3E" stroke-width="3" stroke-linecap="round"/>
  <circle cx="155" cy="80" r="2" fill="#FFFFFF" stroke="#1F2B3E" stroke-width="1.5"/>
  <circle cx="160" cy="65" r="3" fill="#FFFFFF" stroke="#1F2B3E" stroke-width="1.5"/>
</svg>`.trim();

const MASCOT_WAVE = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="Wave the Wave Sprite">
  <ellipse cx="100" cy="180" rx="50" ry="6" fill="#1F2B3E" opacity="0.15"/>
  <path d="M40 130 Q40 70 100 70 Q160 70 160 130 Q160 170 100 170 Q40 170 40 130Z" fill="#7DCCDB" stroke="#1F2B3E" stroke-width="4"/>
  <path d="M50 100 Q70 90 90 100 Q110 110 130 100 Q150 90 160 100" fill="none" stroke="#FFFFFF" stroke-width="4" opacity="0.8" stroke-linecap="round"/>
  <circle cx="80" cy="125" r="8" fill="#FFFFFF" stroke="#1F2B3E" stroke-width="3"/>
  <circle cx="120" cy="125" r="8" fill="#FFFFFF" stroke="#1F2B3E" stroke-width="3"/>
  <circle cx="80" cy="126" r="3.5" fill="#1F2B3E"/>
  <circle cx="120" cy="126" r="3.5" fill="#1F2B3E"/>
  <path d="M85 145 Q100 155 115 145" fill="none" stroke="#1F2B3E" stroke-width="3" stroke-linecap="round"/>
</svg>`.trim();

const MASCOT_BEAKER = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="Beaker the Scientist">
  <ellipse cx="100" cy="185" rx="45" ry="6" fill="#1F2B3E" opacity="0.15"/>
  <path d="M70 40 L70 90 L50 160 Q50 175 100 175 Q150 175 150 160 L130 90 L130 40 Z" fill="#FFFFFF" stroke="#1F2B3E" stroke-width="4"/>
  <path d="M55 145 Q55 175 100 175 Q145 175 145 145 Q145 138 100 138 Q55 138 55 145" fill="#1565C0" stroke="#1F2B3E" stroke-width="3"/>
  <ellipse cx="80" cy="142" rx="6" ry="3" fill="#A6FF00" opacity="0.8"/>
  <ellipse cx="115" cy="148" rx="5" ry="2.5" fill="#A6FF00" opacity="0.8"/>
  <line x1="65" y1="40" x2="135" y2="40" stroke="#1F2B3E" stroke-width="4" stroke-linecap="round"/>
  <circle cx="85" cy="120" r="5" fill="#FFFFFF" stroke="#1F2B3E" stroke-width="2"/>
  <circle cx="115" cy="120" r="5" fill="#FFFFFF" stroke="#1F2B3E" stroke-width="2"/>
  <circle cx="85" cy="121" r="2.5" fill="#1F2B3E"/>
  <circle cx="115" cy="121" r="2.5" fill="#1F2B3E"/>
  <path d="M88 130 Q100 138 112 130" fill="none" stroke="#1F2B3E" stroke-width="2.5" stroke-linecap="round"/>
</svg>`.trim();

const MASCOT_ATOM = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="Atom the Atom">
  <ellipse cx="100" cy="180" rx="40" ry="6" fill="#1F2B3E" opacity="0.15"/>
  <ellipse cx="100" cy="100" rx="70" ry="28" fill="none" stroke="#1F2B3E" stroke-width="3"/>
  <ellipse cx="100" cy="100" rx="70" ry="28" fill="none" stroke="#A6FF00" stroke-width="2.5" transform="rotate(60 100 100)"/>
  <ellipse cx="100" cy="100" rx="70" ry="28" fill="none" stroke="#1565C0" stroke-width="2.5" transform="rotate(-60 100 100)"/>
  <circle cx="100" cy="100" r="22" fill="#FFD43B" stroke="#1F2B3E" stroke-width="4"/>
  <circle cx="92" cy="94" r="4" fill="#FFFFFF" stroke="#1F2B3E" stroke-width="1.5"/>
  <circle cx="108" cy="94" r="4" fill="#FFFFFF" stroke="#1F2B3E" stroke-width="1.5"/>
  <circle cx="92" cy="95" r="1.8" fill="#1F2B3E"/>
  <circle cx="108" cy="95" r="1.8" fill="#1F2B3E"/>
  <path d="M93 105 Q100 110 107 105" fill="none" stroke="#1F2B3E" stroke-width="2" stroke-linecap="round"/>
  <circle cx="170" cy="100" r="4" fill="#1F2B3E"/>
  <circle cx="30" cy="100" r="4" fill="#1F2B3E"/>
</svg>`.trim();

const MASCOT_BRUSH = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="Brush the Paintbrush">
  <ellipse cx="100" cy="185" rx="45" ry="6" fill="#1F2B3E" opacity="0.15"/>
  <rect x="85" y="100" width="30" height="60" rx="4" fill="#8B5A2B" stroke="#1F2B3E" stroke-width="4"/>
  <rect x="80" y="60" width="40" height="50" rx="6" fill="#E91E63" stroke="#1F2B3E" stroke-width="4"/>
  <path d="M80 60 Q70 30 100 25 Q130 30 120 60Z" fill="#E91E63" stroke="#1F2B3E" stroke-width="4"/>
  <circle cx="90" cy="85" r="5" fill="#FFFFFF" stroke="#1F2B3E" stroke-width="2"/>
  <circle cx="110" cy="85" r="5" fill="#FFFFFF" stroke="#1F2B3E" stroke-width="2"/>
  <circle cx="90" cy="86" r="2.5" fill="#1F2B3E"/>
  <circle cx="110" cy="86" r="2.5" fill="#1F2B3E"/>
  <path d="M92 95 Q100 100 108 95" fill="none" stroke="#1F2B3E" stroke-width="2.5" stroke-linecap="round"/>
  <ellipse cx="100" cy="170" rx="22" ry="8" fill="#FFD43B" stroke="#1F2B3E" stroke-width="3"/>
</svg>`.trim();

const MASCOT_NOTE = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="Note the Music Note">
  <ellipse cx="100" cy="185" rx="40" ry="6" fill="#1F2B3E" opacity="0.15"/>
  <ellipse cx="80" cy="150" rx="28" ry="22" fill="#FFD43B" stroke="#1F2B3E" stroke-width="4" transform="rotate(-12 80 150)"/>
  <rect x="100" y="50" width="10" height="100" fill="#FFD43B" stroke="#1F2B3E" stroke-width="4"/>
  <path d="M110 50 Q140 55 140 90 L110 78 Z" fill="#FFD43B" stroke="#1F2B3E" stroke-width="4"/>
  <circle cx="72" cy="148" r="5" fill="#FFFFFF" stroke="#1F2B3E" stroke-width="2"/>
  <circle cx="92" cy="148" r="5" fill="#FFFFFF" stroke="#1F2B3E" stroke-width="2"/>
  <circle cx="72" cy="149" r="2.5" fill="#1F2B3E"/>
  <circle cx="92" cy="149" r="2.5" fill="#1F2B3E"/>
  <path d="M74 158 Q82 162 90 158" fill="none" stroke="#1F2B3E" stroke-width="2.5" stroke-linecap="round"/>
</svg>`.trim();

// Leaf decoration motif
const LEAF_SVG = `
<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <path d="M20 4 C8 12 8 28 20 36 C32 28 32 12 20 4Z" fill="currentColor" opacity="0.5"/>
  <path d="M20 4 L20 36" stroke="#1F2B3E" stroke-width="1.2" opacity="0.4"/>
</svg>`.trim();

const STAR_SVG = `
<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <polygon points="20,4 25,15 37,16 28,24 30,36 20,30 10,36 12,24 3,16 15,15" fill="currentColor" opacity="0.7"/>
</svg>`.trim();

const SCROLL_SVG = `
<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <rect x="6" y="8" width="28" height="24" rx="3" fill="currentColor" opacity="0.45" stroke="#1F2B3E" stroke-width="1"/>
  <line x1="10" y1="14" x2="30" y2="14" stroke="#1F2B3E" stroke-width="0.8"/>
  <line x1="10" y1="18" x2="30" y2="18" stroke="#1F2B3E" stroke-width="0.8"/>
  <line x1="10" y1="22" x2="26" y2="22" stroke="#1F2B3E" stroke-width="0.8"/>
</svg>`.trim();

const BUBBLE_SVG = `
<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <circle cx="20" cy="20" r="14" fill="currentColor" opacity="0.5"/>
  <circle cx="16" cy="16" r="3" fill="#FFFFFF" opacity="0.7"/>
</svg>`.trim();

const ATOM_SVG = `
<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="20" cy="20" rx="14" ry="6" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6"/>
  <ellipse cx="20" cy="20" rx="14" ry="6" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6" transform="rotate(60 20 20)"/>
  <ellipse cx="20" cy="20" rx="14" ry="6" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6" transform="rotate(-60 20 20)"/>
  <circle cx="20" cy="20" r="3" fill="currentColor"/>
</svg>`.trim();

const NOTE_SVG = `
<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <circle cx="14" cy="28" r="6" fill="currentColor" opacity="0.7"/>
  <rect x="19" y="8" width="2.5" height="22" fill="currentColor" opacity="0.7"/>
  <path d="M21.5 8 Q30 10 30 18" fill="none" stroke="currentColor" stroke-width="2" opacity="0.7"/>
</svg>`.trim();

export const THEMES: Record<ThemeId, ThemePreset> = {
  garden: {
    id: "garden",
    label: "Garden",
    description: "Fresh greens with sunshine yellow; warm, nature-loving feel.",
    bestFor: ["biology", "plants", "ecology", "early-years science", "growth", "habitats"],
    primary: "#2D5016",
    primarySoft: "#D4E8C5",
    accent: "#FFD43B",
    secondary: "#E91E63",
    secondarySoft: "#FBD0E0",
    bg1: "#E3F2FD",
    bg2: "#C8E6C9",
    bg3: "#B8E6B0",
    ink: "#1F2B3E",
    cream: "#FFF9E6",
    displayFont: "Patrick Hand",
    bodyFont: "Fredoka",
    mascot1: { name: "Sprout", svg: MASCOT_SPROUT },
    mascot2: { name: "Buzz",   svg: MASCOT_BEE },
    decorations: [LEAF_SVG, LEAF_SVG, LEAF_SVG],
  },
  space: {
    id: "space",
    label: "Cosmic",
    description: "Deep cosmic navy with starlight accents; perfect for STEM.",
    bestFor: ["physics", "astronomy", "space", "math", "chemistry", "advanced topics"],
    primary: "#3A2A6B",
    primarySoft: "#D7CCEB",
    accent: "#FFD43B",
    secondary: "#FF6B9D",
    secondarySoft: "#FFCFE0",
    bg1: "#1A1A2E",
    bg2: "#302B63",
    bg3: "#24243E",
    ink: "#FFFFFF",
    cream: "#F5F1FF",
    displayFont: "Orbitron",
    bodyFont: "Fredoka",
    mascot1: { name: "Rocket", svg: MASCOT_ROCKET },
    mascot2: { name: "Orbit",  svg: MASCOT_STAR },
    decorations: [STAR_SVG, STAR_SVG, STAR_SVG],
  },
  theater: {
    id: "theater",
    label: "Theater",
    description: "Wine + gold with parchment cream; literary and elegant.",
    bestFor: ["English literature", "Shakespeare", "history", "social studies", "poetry"],
    primary: "#722F37",
    primarySoft: "#EBD5D8",
    accent: "#D4AF37",
    secondary: "#5C7C3F",
    secondarySoft: "#D7E0CC",
    bg1: "#F4E4C1",
    bg2: "#E8D4A0",
    bg3: "#D9C089",
    ink: "#1F2B3E",
    cream: "#FFF8E8",
    displayFont: "Cinzel",
    bodyFont: "Fredoka",
    mascot1: { name: "Quill", svg: MASCOT_QUILL },
    mascot2: { name: "Sock",  svg: MASCOT_MASK },
    decorations: [SCROLL_SVG, SCROLL_SVG, SCROLL_SVG],
  },
  ocean: {
    id: "ocean",
    label: "Ocean",
    description: "Cool aquatic teals with coral accents; aquatic and serene.",
    bestFor: ["marine biology", "water cycle", "geography", "weather", "earth science"],
    primary: "#006A75",
    primarySoft: "#C7E8EC",
    accent: "#FFD43B",
    secondary: "#FF7C6B",
    secondarySoft: "#FFD7D2",
    bg1: "#C9E9F2",
    bg2: "#7DCCDB",
    bg3: "#5BA9BC",
    ink: "#1F2B3E",
    cream: "#FFF8E8",
    displayFont: "Patrick Hand",
    bodyFont: "Fredoka",
    mascot1: { name: "Finn", svg: MASCOT_FISH },
    mascot2: { name: "Wave", svg: MASCOT_WAVE },
    decorations: [BUBBLE_SVG, BUBBLE_SVG, BUBBLE_SVG],
  },
  lab: {
    id: "lab",
    label: "Lab",
    description: "Cool steel-blue with bright lime; technical and modern.",
    bestFor: ["chemistry", "biology experiments", "physics labs", "computer science", "engineering"],
    primary: "#1565C0",
    primarySoft: "#CFE0F3",
    accent: "#A6FF00",
    secondary: "#FF6B6B",
    secondarySoft: "#FFD0D0",
    bg1: "#ECEFF1",
    bg2: "#CFD8DC",
    bg3: "#B0BEC5",
    ink: "#1F2B3E",
    cream: "#F0F4F8",
    displayFont: "Fredoka",
    bodyFont: "Fredoka",
    mascot1: { name: "Beaker", svg: MASCOT_BEAKER },
    mascot2: { name: "Atom",   svg: MASCOT_ATOM },
    decorations: [ATOM_SVG, ATOM_SVG, ATOM_SVG],
  },
  studio: {
    id: "studio",
    label: "Studio",
    description: "Warm pink + sunny yellow with mint; creative and playful.",
    bestFor: ["art", "music", "design", "creative writing", "drama", "early years"],
    primary: "#E91E63",
    primarySoft: "#FBD0E0",
    accent: "#FFD43B",
    secondary: "#6DD9A5",
    secondarySoft: "#D5F2E4",
    bg1: "#FFF1E6",
    bg2: "#FFD9C7",
    bg3: "#FFB8A1",
    ink: "#1F2B3E",
    cream: "#FFF8E8",
    displayFont: "Caveat",
    bodyFont: "Fredoka",
    mascot1: { name: "Brush", svg: MASCOT_BRUSH },
    mascot2: { name: "Note",  svg: MASCOT_NOTE },
    decorations: [NOTE_SVG, NOTE_SVG, NOTE_SVG],
  },
};

export function themeForId(id: ThemeId | string | undefined): ThemePreset {
  if (id && id in THEMES) return THEMES[id as ThemeId];
  return THEMES.garden;
}

// Pick a theme based on a free-text topic — the AI uses this as a hint,
// but ultimately the AI returns a themeId itself. This is a fallback for
// older payloads or human override.
export function suggestTheme(topic: string, subject?: string): ThemeId {
  const text = `${topic} ${subject || ""}`.toLowerCase();
  for (const t of Object.values(THEMES)) {
    if (t.bestFor.some((k) => text.includes(k))) return t.id;
  }
  // sensible defaults by subject keyword
  if (/math|algebra|geom|calc|equation/.test(text)) return "space";
  if (/sci|chem|physics|bio/.test(text)) return "lab";
  if (/eng|lit|gramm|poem|story|writ/.test(text)) return "theater";
  if (/art|music|draw|paint/.test(text)) return "studio";
  if (/water|ocean|fish|sea|river|weather/.test(text)) return "ocean";
  return "garden";
}
