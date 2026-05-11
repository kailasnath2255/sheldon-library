import type { TemplatedPresentation, TemplatedGame, TemplatedWorksheet, TemplatedLessonPlan, TemplatedQuiz, ThemeId } from "./template-types";

// ─── SAMPLE DECK A: Garden theme — Photosynthesis ──────────
export const SAMPLE_DECK: TemplatedPresentation = {
  format: "template-v1",
  template: "presentation-classic",
  themeId: "garden",
  title: "Photosynthesis — Year 4 Adventure",
  slides: [
    {
      type: "title",
      section: "Welcome!",
      title: "Plants' Magic Recipe",
      subtitle: "Year 4 Science adventure with Sprout & Buzz",
      mascot1Says: "Hi, I'm Sprout! Let's discover how plants eat sunshine.",
      mascot2Says: "I'm Buzz the Bee! Ready to grow big ideas?",
      notes: "Welcome warmly. Ask the student which plant they like best and connect to today's topic — plants making their own food.",
    },
    {
      type: "section",
      section: "Warm-up",
      title: "What plants need to grow",
      body: "Sunshine, water, air, soil — four magical ingredients!",
      notes: "Quick brainstorm: ask the student to name three things they think a plant needs.",
    },
    {
      type: "objectives",
      section: "Today's Goals",
      title: "By the end of this lesson, I will…",
      items: [
        { icon: "★", text: "Define photosynthesis in my own words." },
        { icon: "★", text: "Name the four ingredients plants need." },
        { icon: "★", text: "Spot photosynthesis happening in real life." },
        { icon: "★", text: "Explain why plants matter to all of us." },
      ],
      notes: "Read each goal aloud slowly. Ask which sounds most exciting.",
    },
    {
      type: "definition",
      section: "Definition",
      title: "What is photosynthesis?",
      term: "Photosynthesis",
      formula: "Sun + Water + Air → Plant food",
      meaning: "How plants make their own food using sunlight, water, and air.",
      example: "A sunflower 🌻 turning toward the sun is doing it right now!",
      notes: "Break the word down: 'photo' = light, 'synthesis' = putting together. Plants put food together using light.",
    },
    {
      type: "compare",
      section: "Compare",
      title: "Plants vs Us",
      left: {
        title: "Plants 🌱",
        formula: "Make their own food",
        example: "Use sunlight as their kitchen!",
        points: ["Take in CO₂", "Give out O₂", "Get energy from the sun"],
      },
      right: {
        title: "Humans 👦",
        formula: "Eat food others made",
        example: "We need plants in our meals!",
        points: ["Breathe in O₂", "Breathe out CO₂", "Get energy from food"],
      },
      notes: "Highlight how plants and humans are opposite breathers — that's why they need each other.",
    },
    {
      type: "examples",
      section: "Examples",
      title: "Photosynthesis everywhere!",
      body: "Spot it in everyday life — the sun is feeding plants right now.",
      items: [
        { icon: "🌻", text: "Sunflowers turning toward the sun." },
        { icon: "🌳", text: "An oak tree's leaves catching light." },
        { icon: "🌿", text: "A houseplant on your windowsill." },
        { icon: "🌾", text: "Wheat in a sunny farm field." },
      ],
      notes: "Ask the student which one they saw most recently.",
    },
    {
      type: "fact",
      section: "Did You Know?",
      body: "One large tree can give enough oxygen for 4 people in a single day!",
      quote: "Plants are the lungs of our planet.",
      source: "Common saying among biologists",
      notes: "Let the student be amazed. Ask what would happen if we cut down all the trees.",
    },
    {
      type: "i-do",
      section: "I Do",
      title: "Let me show you how to spot it",
      sentence: "A tomato plant grows new leaves in summer.",
      thinking: [
        "Is it a plant? Yes — tomato plant.",
        "Does it have sunlight, water, air? Yes, all three.",
        "Then it must be doing photosynthesis to grow!",
      ],
      conclusion: "So this is photosynthesis in action! ✅",
      notes: "Think aloud confidently. Use a slow pace so the student follows the reasoning.",
    },
    {
      type: "quiz",
      section: "Quick Check",
      title: "What's the recipe?",
      label: "Multiple Choice",
      question: "Which of these do plants NOT need for photosynthesis?",
      options: ["Sunlight", "Water", "Chocolate", "Air (CO₂)"],
      correctIndex: 2,
      explanation: "Right! Plants don't eat chocolate — they need sunlight, water, and CO₂.",
      notes: "Encourage the student to read each option aloud before answering.",
    },
    {
      type: "fill-blank",
      section: "Fill the Blank",
      title: "Complete the recipe",
      before: "Plants take in sunlight, water, and",
      after: "to make their food.",
      options: ["chocolate", "carbon dioxide", "milk", "fire"],
      correctIndex: 1,
      explanation: "Yes! Carbon dioxide from the air is the third ingredient.",
      notes: "If they pick wrong, explain that CO₂ is the gas we breathe out.",
    },
    {
      type: "drag-sort",
      section: "Drag & Sort",
      title: "What's needed, what's not?",
      body: "Drag each item into the right basket!",
      items: [
        { type: "a", text: "Sunlight" },
        { type: "a", text: "Water" },
        { type: "a", text: "Air (CO₂)" },
        { type: "b", text: "Pizza" },
        { type: "b", text: "WiFi" },
        { type: "b", text: "Music" },
      ],
      zones: [
        { label: "✓ Plants need this", accept: "a" },
        { label: "✗ Plants don't need this", accept: "b" },
      ],
      notes: "Let the student attempt each card. Celebrate every correct drop.",
    },
    {
      type: "story",
      section: "Story Time",
      title: "Sprout's Sunny Day",
      parts: [
        { text: "Sprout stretched her leaves up to the " },
        { text: "warm sunshine", tag: "a" },
        { text: ". She drank some " },
        { text: "fresh water", tag: "a" },
        { text: " from the rain, then breathed in " },
        { text: "air full of CO₂", tag: "a" },
        { text: ". With those three magical ingredients, she made her very own " },
        { text: "sugary food", tag: "b" },
        { text: " — and released " },
        { text: "fresh oxygen", tag: "b" },
        { text: " for Buzz to enjoy. What a clever plant!" },
      ],
      legend: "Green = ingredients · Pink = what plants produce",
      notes: "Read the story slowly, pointing at each highlighted word. Ask the student to name them back.",
    },
    {
      type: "mnemonic",
      section: "Memory Trick",
      title: "Sun, Water, Air!",
      body: "Sunshine + Sip of water + Sweet air = Sugar food for the plant! Say it three times!",
      notes: "Have the student chant it with you, with hand actions if they like.",
    },
    {
      type: "takeaway",
      section: "Key Takeaways",
      title: "What we learned today",
      points: [
        { icon: "🌱", text: "Photosynthesis = plants making their own food from sun, water, and air." },
        { icon: "☀️", text: "Plants give us oxygen in return." },
        { icon: "💚", text: "Without plants, no animal could survive." },
      ],
      notes: "Recap each takeaway with a quick action — like raising arms for the sun.",
    },
    {
      type: "hots",
      section: "Big Brain Time",
      title: "What if...?",
      question: "What if a plant lived in a completely dark room? What would happen to it?",
      mascotSays: "Think it through — no sun means no food, right?",
      notes: "Give the student time to think. Probe gently — what would the plant be missing?",
    },
    {
      type: "closure",
      section: "You Did It!",
      title: "BRILLIANT!",
      body: "You're now a Plant Detective! 🌱",
      stars: 5,
      mascot1Says: "You were as bright as the sun today!",
      mascot2Says: "Come back soon for more adventures!",
      notes: "Celebrate warmly. Mention what next lesson will cover.",
    },
  ],
};

// ─── SAMPLE DECK B: Space theme — Newton's First Law ───────
export const SAMPLE_DECK_SPACE: TemplatedPresentation = {
  format: "template-v1",
  template: "presentation-classic",
  themeId: "space",
  title: "Newton's First Law — Year 9 Physics",
  slides: [
    {
      type: "title",
      section: "Cosmic Mechanics",
      title: "The Law of Inertia",
      subtitle: "Year 9 Physics with Rocket & Orbit",
      mascot1Says: "I'm Rocket — let's blast into the laws of motion!",
      mascot2Says: "I'm Orbit. Without forces, things just keep going!",
      notes: "Open with the floating-pen-in-spacecraft idea to hook curiosity.",
    },
    {
      type: "objectives",
      section: "Mission Briefing",
      title: "Today you will…",
      items: [
        { icon: "★", text: "State Newton's First Law in your own words." },
        { icon: "★", text: "Identify inertia in everyday situations." },
        { icon: "★", text: "Explain why seatbelts save lives." },
        { icon: "★", text: "Spot when a force is acting on an object." },
      ],
      notes: "Connect each objective to a real cosmic example.",
    },
    {
      type: "definition",
      section: "Definition",
      title: "Newton's First Law",
      term: "Law of Inertia",
      formula: "An object stays at rest or in motion unless acted on by a force",
      meaning: "Objects don't change their state of motion on their own — they need a push or a pull.",
      example: "A spacecraft drifting in space keeps drifting forever — no air to slow it down!",
      notes: "Emphasise 'unless acted on by a force' — that's the magic phrase.",
    },
    {
      type: "compare",
      section: "Earth vs Space",
      title: "Why we don't see it on Earth",
      left: {
        title: "On Earth",
        formula: "Friction & gravity",
        example: "A ball rolled on grass stops quickly.",
        points: ["Air pushes back", "Friction with the ground", "Gravity pulls everything down"],
      },
      right: {
        title: "In Space",
        formula: "Almost no forces",
        example: "Voyager 1 has drifted for 46 years and is still going.",
        points: ["No air resistance", "Negligible friction", "Far from major gravity"],
      },
      notes: "Earth has hidden forces making the law seem 'wrong' — space shows the real picture.",
    },
    {
      type: "examples",
      section: "Inertia Everywhere",
      title: "Spot the inertia",
      items: [
        { icon: "🚗", text: "Bus stops suddenly — you lurch forward." },
        { icon: "⚽", text: "A football keeps rolling until friction stops it." },
        { icon: "🛌", text: "A book on a table won't move on its own." },
        { icon: "🛹", text: "Skateboarder jumps off — board keeps moving." },
      ],
      notes: "Ask the student which they've felt most recently.",
    },
    {
      type: "quiz",
      section: "Quick Check",
      title: "Test your law-knowing",
      label: "Multiple Choice",
      question: "A puck slides across a perfectly smooth, friction-free ice rink. What happens after a long time?",
      options: [
        "It stops gradually.",
        "It speeds up.",
        "It continues at the same speed forever.",
        "It changes direction.",
      ],
      correctIndex: 2,
      explanation: "With no friction, there's no force to change its motion. That's Newton's First Law in action.",
      notes: "Discuss why this contradicts everyday intuition.",
    },
    {
      type: "drag-sort",
      section: "Force or No Force?",
      title: "Categorise these scenarios",
      body: "Drag each scenario to the right bin.",
      items: [
        { type: "a", text: "Tennis ball hit by racquet" },
        { type: "a", text: "Apple falling from a tree" },
        { type: "a", text: "Brakes stopping a car" },
        { type: "b", text: "Astronaut floating in space" },
        { type: "b", text: "Book resting on a table" },
        { type: "b", text: "Hockey puck on frictionless ice" },
      ],
      zones: [
        { label: "✓ Force is acting", accept: "a" },
        { label: "✗ No net force", accept: "b" },
      ],
      notes: "Friction and gravity count as forces!",
    },
    {
      type: "takeaway",
      section: "Mission Recap",
      title: "Key takeaways",
      points: [
        { icon: "🚀", text: "Things keep doing what they're doing unless something acts on them." },
        { icon: "⭐", text: "Inertia is laziness — resistance to change in motion." },
        { icon: "🪐", text: "Mass = more inertia (heavier = harder to push)." },
      ],
      notes: "Mass is the hidden variable behind inertia.",
    },
    {
      type: "closure",
      section: "Mission Complete!",
      title: "STELLAR!",
      body: "You've mastered the Law of Inertia 🚀",
      stars: 5,
      mascot1Says: "You earned your astronaut wings today!",
      mascot2Says: "Next time: Newton's Second Law — F = ma!",
      notes: "Tease next lesson to keep momentum.",
    },
  ],
};

// ─── SAMPLE DECK C: Theater theme — Shakespeare ─────────────
export const SAMPLE_DECK_THEATER: TemplatedPresentation = {
  format: "template-v1",
  template: "presentation-classic",
  themeId: "theater",
  title: "Shakespeare's Sonnets — Year 10 English",
  slides: [
    {
      type: "title",
      section: "Act I, Scene I",
      title: "The Bard's Sonnets",
      subtitle: "Year 10 English Literature with Quill & Sock",
      mascot1Says: "Hark! I'm Quill — let us write our way through Shakespeare.",
      mascot2Says: "And I'm Sock the Mask. Tragedy or comedy? Today, poetry!",
      notes: "Set a slightly theatrical tone to draw the student in.",
    },
    {
      type: "definition",
      section: "Definition",
      title: "What is a sonnet?",
      term: "Sonnet",
      formula: "14 lines · iambic pentameter · ABAB CDCD EFEF GG",
      meaning: "A 14-line poem with a strict rhyme scheme and rhythm — Shakespeare's favourite form.",
      example: '"Shall I compare thee to a summer\'s day?" — Sonnet 18',
      notes: "Iambic pentameter = ten syllables per line, alternating unstressed/stressed.",
    },
    {
      type: "compare",
      section: "Two Sonnet Forms",
      title: "Shakespearean vs Petrarchan",
      left: {
        title: "Shakespearean",
        formula: "3 quatrains + 1 couplet",
        example: "ABAB CDCD EFEF GG",
        points: ["English style", "Builds + twists at the couplet", "All 14 lines = one poem"],
      },
      right: {
        title: "Petrarchan",
        formula: "1 octave + 1 sestet",
        example: "ABBAABBA CDECDE",
        points: ["Italian origin", "Octave poses a problem", "Sestet resolves it"],
      },
      notes: "Both forms appear on the syllabus — know the difference.",
    },
    {
      type: "quiz",
      section: "Quick Check",
      title: "Spot the form",
      label: "True / False",
      question: "Shakespeare wrote his sonnets in iambic pentameter.",
      options: ["True", "False"],
      correctIndex: 0,
      explanation: "True — iambic pentameter gives his sonnets their distinctive heartbeat rhythm.",
      notes: "Tap a desk to demonstrate the daDUM-daDUM-daDUM rhythm.",
    },
    {
      type: "mnemonic",
      section: "Memory Trick",
      title: "Sonnet Cipher",
      body: "Three quatrains, one couplet, fourteen lines in all — that's Shakespeare's call!",
      notes: "Have the student repeat it with a poetic flourish.",
    },
    {
      type: "takeaway",
      section: "Curtain Call",
      title: "What we learned",
      points: [
        { icon: "📜", text: "A sonnet is a 14-line poem in iambic pentameter." },
        { icon: "🎭", text: "Shakespearean form: ABAB CDCD EFEF GG." },
        { icon: "🌹", text: "The final couplet often delivers a twist or resolution." },
      ],
      notes: "Plant the idea that form serves meaning.",
    },
    {
      type: "closure",
      section: "Exeunt!",
      title: "BRAVO!",
      body: "Thou hast mastered the sonnet form!",
      stars: 5,
      mascot1Says: "Well played, dear scholar!",
      mascot2Says: "Next: imagery and metaphor in the Bard's lines.",
      notes: "End on a flourish.",
    },
  ],
};

// ─── SAMPLE DECK D: Ocean theme — Water Cycle ──────────────
export const SAMPLE_DECK_OCEAN: TemplatedPresentation = {
  format: "template-v1",
  template: "presentation-classic",
  themeId: "ocean",
  title: "The Water Cycle — Year 5 Science",
  slides: [
    {
      type: "title",
      section: "Splash!",
      title: "The Water Cycle",
      subtitle: "Year 5 Science with Finn & Wave",
      mascot1Says: "I'm Finn — let's dive into where water goes!",
      mascot2Says: "I'm Wave — every drop has a story to tell.",
      notes: "Open by asking: where does rain come from?",
    },
    {
      type: "definition",
      section: "Definition",
      title: "What is the water cycle?",
      term: "Water Cycle",
      formula: "Evaporation → Condensation → Precipitation → Collection",
      meaning: "The endless journey of water between Earth's surface and the sky.",
      example: "A puddle vanishes, becomes a cloud, then rains down again — same water!",
      notes: "Stress: the same water has been cycling for billions of years.",
    },
    {
      type: "examples",
      section: "Examples",
      title: "Spot the cycle around you",
      items: [
        { icon: "☀️", text: "Sea water heats up and rises as vapour." },
        { icon: "☁️", text: "Vapour cools into clouds high up." },
        { icon: "🌧️", text: "Rain falls back to the ground." },
        { icon: "🏞️", text: "Rivers carry water back to the sea." },
      ],
      notes: "Ask the student to put the four examples in order.",
    },
    {
      type: "takeaway",
      section: "Wave Goodbye!",
      title: "Today's drops",
      points: [
        { icon: "💧", text: "Water moves between sea, sky, and land in a continuous loop." },
        { icon: "☀️", text: "The sun powers the whole cycle." },
        { icon: "🌍", text: "We share Earth's water — keep it clean!" },
      ],
      notes: "Tie to environmental responsibility.",
    },
    {
      type: "closure",
      section: "Sea You Soon!",
      title: "WAVE-TASTIC!",
      stars: 5,
      mascot1Says: "You're a Water Cycle Champion!",
      mascot2Says: "Catch you on the next wave!",
      notes: "Quick celebratory close.",
    },
  ],
};

// ─── SAMPLE DECK E: Lab theme — States of Matter ───────────
export const SAMPLE_DECK_LAB: TemplatedPresentation = {
  format: "template-v1",
  template: "presentation-classic",
  themeId: "lab",
  title: "States of Matter — Year 7 Chemistry",
  slides: [
    {
      type: "title",
      section: "Lab Open",
      title: "States of Matter",
      subtitle: "Year 7 Chemistry with Beaker & Atom",
      mascot1Says: "I'm Beaker — pop on your safety goggles!",
      mascot2Says: "I'm Atom. Today we explore solids, liquids, and gases.",
      notes: "Set up a 'lab' tone with safety nod for fun.",
    },
    {
      type: "compare",
      section: "Three States",
      title: "Solid · Liquid · Gas",
      left: {
        title: "Solid 🧊",
        formula: "Fixed shape & volume",
        example: "Ice cube",
        points: ["Particles tightly packed", "Vibrate but don't move", "Hard to compress"],
      },
      right: {
        title: "Gas 🌫️",
        formula: "No fixed shape or volume",
        example: "Steam",
        points: ["Particles far apart", "Move freely & fast", "Easy to compress"],
      },
      notes: "Liquid is in-between — covered on the next slide.",
    },
    {
      type: "examples",
      section: "In the Wild",
      title: "Find them around you",
      items: [
        { icon: "🧊", text: "Ice — solid water." },
        { icon: "💧", text: "Tap water — liquid water." },
        { icon: "♨️", text: "Steam from a kettle — gas water." },
        { icon: "🪨", text: "Rock — common solid." },
      ],
      notes: "Same stuff (H₂O) in three different states!",
    },
    {
      type: "quiz",
      section: "Quick Test",
      title: "Identify the state",
      label: "Multiple Choice",
      question: "Particles vibrate in place and the substance has a fixed shape. Which state?",
      options: ["Solid", "Liquid", "Gas", "Plasma"],
      correctIndex: 0,
      explanation: "Solid — fixed shape, tightly packed, vibrating particles.",
      notes: "Bonus: ask what plasma is (4th state, found in stars).",
    },
    {
      type: "closure",
      section: "Lab Closed",
      title: "EXPERIMENT COMPLETE!",
      stars: 5,
      mascot1Says: "Top marks, junior chemist!",
      mascot2Says: "Next time: how heat changes matter.",
      notes: "Hint at melting/boiling as next lesson.",
    },
  ],
};

// ─── SAMPLE DECK F: Studio theme — Color Theory ────────────
export const SAMPLE_DECK_STUDIO: TemplatedPresentation = {
  format: "template-v1",
  template: "presentation-classic",
  themeId: "studio",
  title: "Color Theory Basics — Year 4 Art",
  slides: [
    {
      type: "title",
      section: "Studio Open",
      title: "Color Magic",
      subtitle: "Year 4 Art with Brush & Note",
      mascot1Says: "I'm Brush — let's paint with knowledge!",
      mascot2Says: "I'm Note. Today we learn how colors talk to each other.",
      notes: "Have a real colour wheel handy if possible.",
    },
    {
      type: "definition",
      section: "Definition",
      title: "Primary Colors",
      term: "Primaries",
      formula: "Red + Yellow + Blue",
      meaning: "The three colors that can't be made by mixing others — every other color comes from these.",
      example: "Yellow + Blue = Green!",
      notes: "Demo with two coloured papers held up.",
    },
    {
      type: "examples",
      section: "Mix Them!",
      title: "Secondary colors",
      items: [
        { icon: "🟠", text: "Red + Yellow = Orange" },
        { icon: "🟢", text: "Yellow + Blue = Green" },
        { icon: "🟣", text: "Blue + Red = Purple" },
        { icon: "🎨", text: "Mix any two primaries to make a secondary." },
      ],
      notes: "Encourage the student to try in their own sketchbook.",
    },
    {
      type: "takeaway",
      section: "Brush Strokes",
      title: "What we learned",
      points: [
        { icon: "🎨", text: "Red, yellow, blue are the three primaries." },
        { icon: "🌈", text: "Mixing two primaries gives you a secondary." },
        { icon: "✨", text: "Practise mixing in your sketchbook this week!" },
      ],
      notes: "Set a small home practice task.",
    },
    {
      type: "closure",
      section: "Studio Closed",
      title: "MASTERPIECE!",
      stars: 5,
      mascot1Says: "You painted today beautifully!",
      mascot2Says: "Next lesson: warm vs cool colors.",
      notes: "Celebrate creativity.",
    },
  ],
};

// ─── Master map for the dev preview switcher ───────────────
export const SAMPLE_DECKS: Record<ThemeId, TemplatedPresentation> = {
  garden:  SAMPLE_DECK,
  space:   SAMPLE_DECK_SPACE,
  theater: SAMPLE_DECK_THEATER,
  ocean:   SAMPLE_DECK_OCEAN,
  lab:     SAMPLE_DECK_LAB,
  studio:  SAMPLE_DECK_STUDIO,
};

// ═══════════════════════════════════════════════════════════════
// ACADEMIC SAMPLE — Grade 7-9 dark/serif template
// Modelled on the user's Acids & Bases reference deck
// ═══════════════════════════════════════════════════════════════
export const SAMPLE_DECK_ACADEMIC: TemplatedPresentation = {
  format: "template-v1",
  template: "presentation-academic",
  themeId: "lab",
  title: "Acids, Bases & Chemical Reactions",
  slides: [
    {
      type: "title",
      section: "Title",
      title: "Acids, Bases & Chemical Reactions",
      subtitle: "The science of substances that change — and the rules they follow.",
      notes: "Welcome the student. Today we explore chemical reactions — what makes substances change, and the rules they follow.",
    },
    {
      type: "examples",
      section: "Icebreaker",
      title: "You Are 100% Chemistry, Right Now",
      body: "Chemical reactions happening right now in your body and around you:",
      items: [
        { icon: "🍳", text: "Eating breakfast — your stomach turns food into fuel" },
        { icon: "🫁", text: "Breathing — every cell respires using oxygen" },
        { icon: "🩸", text: "Stomach digesting — strong acid breaks down food" },
        { icon: "🦷", text: "Brushing teeth — base neutralises mouth acid" },
        { icon: "🧼", text: "Soap + water — saponification cleaning grease" },
        { icon: "🥤", text: "Fizzy drink — CO₂ released from carbonic acid" },
      ],
      notes: "Get them noticing chemistry is everywhere in daily life.",
    },
    {
      type: "quiz",
      section: "Icebreaker",
      title: "Quick Guess: Acid or Base?",
      question: "Which of these is an ACID?",
      options: ["Soap", "Lemon juice", "Toothpaste", "Bleach"],
      correctIndex: 1,
      explanation: "Lemon juice contains citric acid (pH ~2). Soap, toothpaste, and bleach are all bases.",
      notes: "Quick guess game. Don't correct — they'll know by the end.",
    },
    {
      type: "body",
      section: "Warm-up",
      title: "By the end of today, you'll answer:",
      body: "🩸 Why does your stomach use ACID — and how is it not destroyed?\n🦷 Why does toothpaste protect your teeth from cavities?\n🐝 What's the difference between treating a bee sting vs a wasp sting?\n🌧 Why does ACID RAIN damage statues?",
      icon: "❓",
      notes: "Plant questions that will be answered through the lesson.",
    },
    {
      type: "objectives",
      section: "Learning Objective",
      title: "Today, you will…",
      items: [
        { text: "Tell physical changes from chemical changes — and identify the signs" },
        { text: "Explain how reactants become products (conservation of mass)" },
        { text: "Define acids and bases by their behaviour and ions" },
        { text: "Use the pH scale and indicators to identify acids, bases, and neutral substances" },
        { text: "Predict products of three key acid reactions: neutralisation, acid+metal, acid+carbonate" },
      ],
      notes: "Read all 5 objectives aloud. This is a meaty chemistry lesson.",
    },
    {
      type: "compare",
      section: "Definition",
      title: "Physical Change vs Chemical Change",
      left: {
        title: "Physical Change",
        formula: "Same substance, different form",
        example: "Ice melting · Water boiling · Sugar dissolving",
        points: ["Easy to reverse", "No new substance", "Atoms stay arranged the same way"],
      },
      right: {
        title: "Chemical Change",
        formula: "A NEW substance is formed",
        example: "Burning wood · Iron rusting · Cooking egg",
        points: ["Usually hard to reverse", "New substance with new properties", "Atoms rearrange into new molecules"],
      },
      notes: "The fundamental distinction. Test: can you reverse it?",
    },
    {
      type: "definition",
      section: "Definition",
      title: "Reactants → Products",
      term: "Reactants & Products",
      formula: "reactants → products",
      meaning: "Substances you START with are reactants. Substances you END with are products. The arrow means 'becomes' or 'produces'.",
      example: "hydrogen + oxygen → water",
      notes: "Vocabulary. The arrow is the heart of every chemical equation.",
    },
    {
      type: "examples",
      section: "Explanation",
      title: "5 Signs of a Chemical Reaction",
      body: "Look for any one of these — if you see multiple, it's definitely a chemical reaction.",
      items: [
        { icon: "🎨", text: "Colour change (e.g. copper sulfate blue → green)" },
        { icon: "💨", text: "Gas produced — bubbles or fizzing" },
        { icon: "🌡️", text: "Temperature change — heat in or out" },
        { icon: "⬇️", text: "Precipitate — solid forms in a liquid" },
        { icon: "✨", text: "Light or sound emitted (e.g. magnesium burning)" },
      ],
      notes: "Have the student guess 2 before revealing all 5.",
    },
    {
      type: "definition",
      section: "Definition",
      title: "What is an Acid?",
      term: "Acid",
      formula: "Releases H⁺ ions · pH < 7",
      meaning: "An acid releases hydrogen ions (H⁺) in water, has a pH less than 7, tastes sour, and turns blue litmus paper red.",
      example: "Hydrochloric acid (HCl) in your stomach helps digest food.",
      notes: "Define by ions and behaviour. NEVER taste lab acids!",
    },
    {
      type: "examples",
      section: "Examples",
      title: "Acids Around Us",
      items: [
        { icon: "🍋", text: "Lemon juice — citric acid (pH ~2)" },
        { icon: "🥤", text: "Fizzy drinks — carbonic + phosphoric acid" },
        { icon: "🍅", text: "Tomatoes — citric + malic acid" },
        { icon: "🩸", text: "Stomach acid — hydrochloric acid (pH ~1)" },
        { icon: "🐝", text: "Bee sting — formic acid" },
        { icon: "🌧️", text: "Acid rain — sulfuric + nitric acid" },
      ],
      notes: "Acids are everywhere — your stomach makes HCl strong enough to dissolve metal.",
    },
    {
      type: "definition",
      section: "Definition",
      title: "What is a Base?",
      term: "Base",
      formula: "Releases OH⁻ ions · pH > 7",
      meaning: "A base releases hydroxide ions (OH⁻) in water, has a pH greater than 7, feels slippery, and turns red litmus paper blue.",
      example: "Sodium hydroxide (NaOH) in soap reacts with oils to clean grease.",
      notes: "A base that dissolves in water is called an alkali. All alkalis are bases.",
    },
    {
      type: "examples",
      section: "Examples",
      title: "Bases Around Us",
      items: [
        { icon: "🧼", text: "Soap — sodium hydroxide based" },
        { icon: "🦷", text: "Toothpaste — mildly alkaline" },
        { icon: "🧂", text: "Baking soda — sodium bicarbonate" },
        { icon: "💊", text: "Antacids — magnesium hydroxide" },
        { icon: "🪣", text: "Bleach — sodium hypochlorite" },
        { icon: "🧴", text: "Oven cleaner — strong NaOH (caution!)" },
      ],
      notes: "Most cleaning products are basic. Most foods are slightly acidic.",
    },
    {
      type: "definition",
      section: "Definition",
      title: "The pH Scale (0 to 14)",
      term: "pH Scale",
      formula: "0–6 acidic · 7 neutral · 8–14 alkaline",
      meaning: "pH measures how acidic or alkaline a substance is. Each step is 10× — pH 3 is 100× more acidic than pH 5.",
      example: "Battery acid pH 0 · stomach acid pH 1 · pure water pH 7 · ammonia pH 11 · drain cleaner pH 14",
      notes: "Scale is logarithmic — each unit = 10× change.",
    },
    {
      type: "definition",
      section: "Definition",
      title: "Neutralisation: Acid + Base → Salt + Water",
      term: "Neutralisation",
      formula: "ACID + BASE → SALT + WATER",
      meaning: "The H⁺ from the acid combines with OH⁻ from the base to make water. The leftover ions form a salt.",
      example: "HCl + NaOH → NaCl + H₂O (common table salt!)",
      notes: "The most important reaction in this lesson. H⁺ + OH⁻ → H₂O.",
    },
    {
      type: "compare",
      section: "Explanation",
      title: "Two More Acid Reactions",
      left: {
        title: "Acid + Metal",
        formula: "→ Salt + Hydrogen ⚡",
        example: "HCl + Mg → MgCl₂ + H₂↑",
        points: ["Fizzes with hydrogen gas", "Tested with 'squeaky pop'", "Reactive metals only (Mg, Zn, Fe)"],
      },
      right: {
        title: "Acid + Carbonate",
        formula: "→ Salt + Water + CO₂ 💨",
        example: "HCl + CaCO₃ → CaCl₂ + H₂O + CO₂↑",
        points: ["Fizzes with CO₂ gas", "Limewater turns cloudy", "Chalk + vinegar = classic"],
      },
      notes: "All three acid reactions produce a SALT. The other products tell you which reaction happened.",
    },
    {
      type: "fact",
      section: "Explanation",
      title: "Conservation of Mass",
      body: "Lavoisier discovered: atoms can't be created or destroyed — they just rearrange. Mass of reactants = Mass of products.",
      quote: "Nothing is lost, nothing is created, everything is transformed.",
      source: "Antoine Lavoisier, 1789",
      notes: "Critical for understanding why we balance equations.",
    },
    {
      type: "i-do",
      section: "Activity",
      title: "Watch Me Analyse a Reaction",
      sentence: "When you add vinegar to baking soda, you see fizzing and the solution gets cooler. What's happening?",
      thinking: [
        "Sign 1: Gas produced — yes, fizzing means CO₂ bubbles forming",
        "Sign 2: Temperature change — yes, gets cooler (endothermic)",
        "Sign 3: Hard to reverse — yes, can't get the original back",
      ],
      conclusion: "Multiple signs = definitely a chemical reaction! This is an ACID + CARBONATE reaction producing salt + water + CO₂.",
      notes: "Think aloud. Show the reasoning process clearly.",
    },
    {
      type: "quiz",
      section: "Activity",
      title: "We Do — Together!",
      label: "WE DO",
      question: "Sarah lights magnesium ribbon — bright white light. What sign of a chemical reaction is this?",
      options: ["Colour change", "Light or sound emitted", "Precipitate forms", "Just a physical change"],
      correctIndex: 1,
      explanation: "Bright light = LIGHT EMITTED. This is combustion: magnesium + oxygen → magnesium oxide + light.",
      notes: "Work it out together. Have the student name the sign before revealing.",
    },
    {
      type: "fill-blank",
      section: "Activity",
      title: "You Do — Your Turn",
      before: "Hydrochloric acid + sodium hydroxide →",
      after: "+ water",
      options: ["sodium chloride", "calcium carbonate", "potassium nitrate", "carbon dioxide"],
      correctIndex: 0,
      explanation: "Acid + Base → Salt + Water. HCl + NaOH → NaCl + H₂O. NaCl is common table salt!",
      notes: "Encourage them to derive the answer from the pattern Acid + Base → Salt + Water.",
    },
    {
      type: "drag-sort",
      section: "Skill Task",
      title: "Acid or Base?",
      body: "Tap each item, then tap the correct bucket.",
      items: [
        { type: "a", text: "Lemon juice" },
        { type: "a", text: "Vinegar" },
        { type: "a", text: "Stomach acid" },
        { type: "b", text: "Soap" },
        { type: "b", text: "Antacid" },
        { type: "b", text: "Bleach" },
      ],
      zones: [
        { label: "🍋 Acids (pH < 7)", accept: "a" },
        { label: "🧼 Bases (pH > 7)", accept: "b" },
      ],
      notes: "Reinforces the pH classification.",
    },
    {
      type: "quiz",
      section: "Quick Assessment",
      title: "Question 1",
      label: "QUICK ASSESSMENT · 1 OF 5",
      question: "Which is a sign of a chemical reaction?",
      options: ["Mass stays the same", "Colour change, gas, or new smell", "Substance dissolves", "Substance changes state"],
      correctIndex: 1,
      explanation: "Chemical reactions produce observable signs: colour, gas, heat, light, or precipitate.",
    },
    {
      type: "quiz",
      section: "Quick Assessment",
      title: "Question 2",
      label: "QUICK ASSESSMENT · 2 OF 5",
      question: "What is the pH of pure water?",
      options: ["0", "5", "7", "14"],
      correctIndex: 2,
      explanation: "Pure water is neutral with equal H⁺ and OH⁻ — pH 7.",
    },
    {
      type: "quiz",
      section: "Quick Assessment",
      title: "Question 3",
      label: "QUICK ASSESSMENT · 3 OF 5",
      question: "What ions does an acid release in water?",
      options: ["OH⁻ (hydroxide)", "H⁺ (hydrogen)", "Cl⁻ (chloride)", "Na⁺ (sodium)"],
      correctIndex: 1,
      explanation: "Acids release hydrogen ions (H⁺) — that's what makes them acidic.",
    },
    {
      type: "quiz",
      section: "Quick Assessment",
      title: "Question 4",
      label: "QUICK ASSESSMENT · 4 OF 5",
      question: "Acid + Base → ? + ?",
      options: ["Salt + water", "Hydrogen + oxygen", "Salt + carbon dioxide", "Water only"],
      correctIndex: 0,
      explanation: "Neutralisation always produces a salt and water.",
    },
    {
      type: "quiz",
      section: "Quick Assessment",
      title: "Question 5",
      label: "QUICK ASSESSMENT · 5 OF 5",
      question: "Stomach pain from too much acid? You need an…",
      options: ["Acid", "Antacid (base)", "Salt", "Indicator"],
      correctIndex: 1,
      explanation: "Antacids contain a mild base like Mg(OH)₂ that neutralises excess stomach acid.",
    },
    {
      type: "takeaway",
      section: "Key Takeaways",
      title: "You Mastered the Chemistry of Reactions!",
      points: [
        { icon: "⚛️", text: "Chemical changes create new substances · 5 signs: colour, gas, heat, precipitate, light" },
        { icon: "⚖️", text: "Conservation of mass: atoms rearrange, mass stays the same" },
        { icon: "🍋", text: "Acids: release H⁺ · pH < 7 · turn litmus RED · sour" },
        { icon: "🧼", text: "Bases: release OH⁻ · pH > 7 · turn litmus BLUE · slippery" },
        { icon: "📊", text: "pH scale 0–14: low = acidic · 7 = neutral · high = basic" },
        { icon: "⚗️", text: "Acid + Base → SALT + WATER (neutralisation)" },
        { icon: "⚡", text: "Acid + Metal → SALT + HYDROGEN (fizz!)" },
        { icon: "💨", text: "Acid + Carbonate → SALT + WATER + CO₂" },
      ],
      notes: "Walk through each takeaway with a concrete example.",
    },
    {
      type: "hots",
      section: "Closure",
      title: "Big Thinking",
      question: "Acid rain forms when sulfur dioxide from factories dissolves in rainwater. Why does this damage stone buildings made of limestone (calcium carbonate)?",
      icon: "🌧️",
      mascotSays: "Think about what you just learned — acid + carbonate → ?",
      notes: "Connects directly to the acid + carbonate reaction they just learned.",
    },
    {
      type: "closure",
      section: "Closure",
      title: "Chemistry: The Language of Change",
      body: "Acid in your stomach digests breakfast. Base in your toothpaste protects your teeth. Billions of chemical reactions happen in your body every second. You now speak the language of chemistry. 🧪⚗️",
      stars: 5,
      notes: "End strong. Connect chemistry back to their daily life.",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// GAME SAMPLES — one per theme, demonstrating different gameTypes
// ═══════════════════════════════════════════════════════════════

export const SAMPLE_GAME_GARDEN: TemplatedGame = {
  format: "template-v1",
  template: "game-arcade",
  themeId: "garden",
  title: "Photosynthesis Quiz",
  intro: "Help Sprout and Buzz discover what plants need to grow!",
  achievement: { title: "Garden Master", message: "You know your photosynthesis!" },
  data: {
    gameType: "quiz",
    payload: {
      questions: [
        { text: "Which gas do plants take in for photosynthesis?", options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Helium"], correctIndex: 1, explanation: "Plants use carbon dioxide from the air.", difficulty: "easy" },
        { text: "What energy source powers photosynthesis?", options: ["Sunlight", "Moonlight", "Wind", "Heat"], correctIndex: 0, explanation: "Plants harvest sunlight to make their food.", difficulty: "easy" },
        { text: "Which gas do plants release as a by-product?", options: ["CO₂", "Hydrogen", "Oxygen", "Nitrogen"], correctIndex: 2, explanation: "Oxygen is released — the air we breathe.", difficulty: "medium" },
        { text: "Where in the plant does photosynthesis mostly happen?", options: ["Roots", "Stem", "Leaves", "Flowers"], correctIndex: 2, explanation: "Leaves are packed with chloroplasts — the kitchen!", difficulty: "medium" },
        { text: "What's the green pigment that captures sunlight called?", options: ["Carotene", "Chlorophyll", "Melanin", "Anthocyanin"], correctIndex: 1, explanation: "Chlorophyll gives plants their green colour.", difficulty: "hard" },
        { text: "Photosynthesis converts CO₂ and water into what?", options: ["Carbon", "Glucose + oxygen", "Salt", "Hydrogen"], correctIndex: 1, explanation: "Glucose is the plant's food, oxygen is the bonus.", difficulty: "hard" },
      ],
    },
  },
};

export const SAMPLE_GAME_SPACE: TemplatedGame = {
  format: "template-v1",
  template: "game-arcade",
  themeId: "space",
  title: "Planet Match",
  intro: "Match each planet to its key feature!",
  achievement: { title: "Cosmic Champion", message: "You know the solar system inside out!" },
  data: {
    gameType: "match",
    payload: {
      pairs: [
        { left: "Mercury",  right: "Closest to the sun" },
        { left: "Venus",    right: "Hottest planet" },
        { left: "Earth",    right: "Has life as we know it" },
        { left: "Mars",     right: "The red planet" },
        { left: "Jupiter",  right: "Largest planet" },
        { left: "Saturn",   right: "Famous for its rings" },
      ],
    },
  },
};

export const SAMPLE_GAME_THEATER: TemplatedGame = {
  format: "template-v1",
  template: "game-arcade",
  themeId: "theater",
  title: "Sort the Sonnets",
  intro: "Sort each line into the correct sonnet style!",
  achievement: { title: "Bard's Apprentice", message: "Shakespeare would be proud!" },
  data: {
    gameType: "sort",
    payload: {
      items: [
        "ABAB CDCD EFEF GG",
        "Three quatrains and a couplet",
        "ABBAABBA CDECDE",
        "Octave + sestet",
        "Final couplet delivers the twist",
        "Italian origin",
      ],
      buckets: [
        { name: "Shakespearean", correctItems: ["ABAB CDCD EFEF GG", "Three quatrains and a couplet", "Final couplet delivers the twist"] },
        { name: "Petrarchan",    correctItems: ["ABBAABBA CDECDE", "Octave + sestet", "Italian origin"] },
      ],
    },
  },
};

export const SAMPLE_GAME_OCEAN: TemplatedGame = {
  format: "template-v1",
  template: "game-arcade",
  themeId: "ocean",
  title: "Water Cycle Sequence",
  intro: "Put the water cycle steps in the right order!",
  achievement: { title: "Tide Master", message: "You've got the cycle down!" },
  data: {
    gameType: "sequence",
    payload: {
      items: [
        "Sun heats the ocean",
        "Water evaporates into vapour",
        "Vapour rises and cools into clouds",
        "Clouds release rain (precipitation)",
        "Rivers carry water back to the sea",
      ],
      correctOrder: [0, 1, 2, 3, 4],
    },
  },
};

export const SAMPLE_GAME_LAB: TemplatedGame = {
  format: "template-v1",
  template: "game-arcade",
  themeId: "lab",
  title: "States of Matter",
  intro: "Complete each sentence about states of matter!",
  achievement: { title: "Lab Star", message: "Brilliant chemistry, junior scientist!" },
  data: {
    gameType: "fill-blank",
    payload: {
      questions: [
        { sentence: "Particles in a ___ are tightly packed and vibrate in place.", options: ["solid", "gas", "liquid"], correctIndex: 0, explanation: "Solids have rigid particle structure." },
        { sentence: "A ___ takes the shape of its container but has a fixed volume.", options: ["solid", "gas", "liquid"], correctIndex: 2, explanation: "Liquids flow but don't expand." },
        { sentence: "Particles in a ___ are far apart and move freely.", options: ["solid", "gas", "liquid"], correctIndex: 1, explanation: "Gases fill any container they're in." },
        { sentence: "When ice melts, it changes from solid to ___.", options: ["gas", "liquid", "plasma"], correctIndex: 1, explanation: "Melting = solid → liquid." },
        { sentence: "The fourth state of matter, found in stars, is ___.", options: ["plasma", "ice", "steel"], correctIndex: 0, explanation: "Plasma is super-heated ionised gas." },
      ],
    },
  },
};

export const SAMPLE_GAME_STUDIO: TemplatedGame = {
  format: "template-v1",
  template: "game-arcade",
  themeId: "studio",
  title: "Color Wheel",
  intro: "Test your color theory!",
  achievement: { title: "Color Wizard", message: "You're a true artist!" },
  data: {
    gameType: "quiz",
    payload: {
      questions: [
        { text: "Which three colors are the primary colors?", options: ["Red, Yellow, Blue", "Green, Orange, Purple", "Black, White, Grey", "Pink, Teal, Brown"], correctIndex: 0, explanation: "Red, yellow, blue can't be made by mixing other colors.", difficulty: "easy" },
        { text: "Yellow + Blue = ?", options: ["Purple", "Orange", "Green", "Brown"], correctIndex: 2, explanation: "Green is a secondary color made from yellow + blue.", difficulty: "easy" },
        { text: "Red + Yellow = ?", options: ["Purple", "Orange", "Green", "Pink"], correctIndex: 1, explanation: "Orange is made from red + yellow.", difficulty: "easy" },
        { text: "Which colors are 'warm' colors?", options: ["Blues + greens", "Reds + oranges + yellows", "Black + white", "Greys"], correctIndex: 1, explanation: "Warm colors remind us of fire and sun.", difficulty: "medium" },
        { text: "Complementary colors are opposite each other on the color wheel. What's the complement of red?", options: ["Yellow", "Orange", "Green", "Blue"], correctIndex: 2, explanation: "Red and green are direct opposites — that's why they look great together.", difficulty: "hard" },
      ],
    },
  },
};

export const SAMPLE_GAMES: Record<ThemeId, TemplatedGame> = {
  garden:  SAMPLE_GAME_GARDEN,
  space:   SAMPLE_GAME_SPACE,
  theater: SAMPLE_GAME_THEATER,
  ocean:   SAMPLE_GAME_OCEAN,
  lab:     SAMPLE_GAME_LAB,
  studio:  SAMPLE_GAME_STUDIO,
};

// ═══════════════════════════════════════════════════════════════
// WORKSHEET SAMPLES — print-friendly per theme
// ═══════════════════════════════════════════════════════════════

const baseWorksheet = (themeId: ThemeId, title: string, subtitle: string, intro: string, sections: TemplatedWorksheet["sections"]): TemplatedWorksheet => ({
  format: "template-v1",
  template: "worksheet-print",
  themeId,
  title,
  subtitle,
  intro,
  sections,
  showAnswerKey: true,
});

export const SAMPLE_WORKSHEET_GARDEN: TemplatedWorksheet = baseWorksheet(
  "garden",
  "Photosynthesis Worksheet",
  "Year 4 · Science · Homework",
  "What you will practice today: how plants make food and why we need them. Take your time!",
  [
    {
      type: "mcq",
      title: "Choose the correct answer",
      instructions: "Circle one option for each question.",
      items: [
        { question: "What gas do plants take in?", options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Helium"], answer: "Carbon dioxide" },
        { question: "Which part of a plant is the kitchen?", options: ["Roots", "Stem", "Leaves", "Petals"], answer: "Leaves" },
        { question: "Photosynthesis happens because of which energy?", options: ["Wind", "Sun", "Water", "Heat"], answer: "Sun" },
        { question: "What do plants release into the air?", options: ["Oxygen", "Carbon dioxide", "Smoke", "Salt"], answer: "Oxygen" },
      ],
    },
    {
      type: "fill-blank",
      title: "Fill in the blanks",
      instructions: "Write the missing word in the line.",
      items: [
        { sentence: "Plants take in sunlight, water, and ___ to make food.", answer: "carbon dioxide" },
        { sentence: "The green colour of leaves comes from a substance called ___.", answer: "chlorophyll" },
        { sentence: "The food plants make is a kind of sugar called ___.", answer: "glucose" },
        { sentence: "Plants release ___ as a by-product of photosynthesis.", answer: "oxygen" },
      ],
    },
    {
      type: "match",
      title: "Match the following",
      instructions: "Draw a line to match each item to its partner.",
      items: [
        { left: "Chlorophyll", right: "Green pigment in leaves" },
        { left: "Glucose",     right: "Food made by plants" },
        { left: "Stomata",     right: "Tiny pores in leaves" },
        { left: "Roots",       right: "Take in water" },
      ],
    },
    {
      type: "short-answer",
      title: "Short answers",
      items: [
        { question: "Why are leaves usually green?", answer: "Because they contain chlorophyll, which is green and absorbs sunlight." },
        { question: "Name two things plants need from the air.", answer: "Carbon dioxide and sunlight (technically light, not 'from the air')." },
      ],
    },
    {
      type: "true-false",
      title: "True or False?",
      items: [
        { statement: "Plants make their own food.", answer: "True" },
        { statement: "Plants take in oxygen for photosynthesis.", answer: "False" },
        { statement: "Sunlight is the energy source for photosynthesis.", answer: "True" },
      ],
    },
    {
      type: "creative",
      title: "Brain Boost",
      items: [
        { prompt: "Imagine you are a sunflower. Write 3 sentences about your day in the sun.", lines: 5 },
      ],
    },
  ],
);

export const SAMPLE_WORKSHEET_SPACE: TemplatedWorksheet = baseWorksheet(
  "space",
  "Newton's Laws Worksheet",
  "Year 9 · Physics · Classwork",
  "Today we practise applying Newton's three laws of motion to real situations.",
  [
    {
      type: "mcq",
      title: "Choose the correct answer",
      items: [
        { question: "Newton's First Law is also called the law of…", options: ["Force", "Inertia", "Gravity", "Action"], answer: "Inertia" },
        { question: "F = ma is Newton's…", options: ["First law", "Second law", "Third law", "Zeroth law"], answer: "Second law" },
        { question: "For every action there is an equal and opposite…", options: ["Reaction", "Force", "Motion", "Inertia"], answer: "Reaction" },
      ],
    },
    {
      type: "fill-blank",
      title: "Fill in the blanks",
      items: [
        { sentence: "An object at rest tends to stay at rest unless acted on by an external ___.", answer: "force" },
        { sentence: "Acceleration is directly proportional to ___ and inversely proportional to mass.", answer: "force" },
      ],
    },
    {
      type: "short-answer",
      title: "Explain in your own words",
      items: [
        { question: "Why do you lurch forward when a car brakes suddenly?", answer: "Your body has inertia and tries to keep moving forward even when the car stops (Newton's First Law)." },
      ],
    },
    {
      type: "creative",
      title: "Apply it",
      items: [
        { prompt: "Describe a sport scenario that demonstrates all three of Newton's laws.", lines: 6 },
      ],
    },
  ],
);

export const SAMPLE_WORKSHEET_THEATER: TemplatedWorksheet = baseWorksheet(
  "theater",
  "Sonnets Worksheet",
  "Year 10 · English Literature · Homework",
  "Today we look at the structure and language of Shakespeare's sonnets.",
  [
    {
      type: "mcq",
      title: "Choose the correct answer",
      items: [
        { question: "How many lines does a Shakespearean sonnet have?", options: ["10", "12", "14", "16"], answer: "14" },
        { question: "The rhyme scheme of a Shakespearean sonnet is…", options: ["AABB AABB AABB CC", "ABAB CDCD EFEF GG", "ABBA ABBA CDC CDC", "ABCABC ABCABC AB"], answer: "ABAB CDCD EFEF GG" },
      ],
    },
    {
      type: "match",
      title: "Match the term to its meaning",
      items: [
        { left: "Quatrain", right: "4-line stanza" },
        { left: "Couplet", right: "Pair of rhyming lines" },
        { left: "Iambic", right: "Unstressed-stressed pattern" },
        { left: "Pentameter", right: "Five feet per line" },
      ],
    },
    {
      type: "short-answer",
      title: "Open response",
      items: [
        { question: "What role does the final couplet usually play in a Shakespearean sonnet?", answer: "It often delivers a twist, conclusion, or resolution to the ideas in the three quatrains." },
      ],
    },
  ],
);

export const SAMPLE_WORKSHEET_OCEAN: TemplatedWorksheet = baseWorksheet(
  "ocean",
  "Water Cycle Worksheet",
  "Year 5 · Science · Classwork",
  "Practise the stages of the water cycle and where water goes.",
  [
    {
      type: "fill-blank",
      title: "Fill in the blanks",
      items: [
        { sentence: "When water heats up, it turns into vapour. This is called ___.", answer: "evaporation" },
        { sentence: "Vapour cools and forms clouds. This is called ___.", answer: "condensation" },
        { sentence: "When water falls from clouds it is called ___.", answer: "precipitation" },
      ],
    },
    {
      type: "true-false",
      title: "True or False",
      items: [
        { statement: "The water cycle is powered by the sun.", answer: "True" },
        { statement: "Rivers always flow up to the mountains.", answer: "False" },
      ],
    },
  ],
);

export const SAMPLE_WORKSHEET_LAB: TemplatedWorksheet = baseWorksheet(
  "lab",
  "States of Matter",
  "Year 7 · Chemistry · Homework",
  "Sort and classify substances by their states.",
  [
    {
      type: "mcq",
      title: "Choose the correct answer",
      items: [
        { question: "Which has a fixed shape and volume?", options: ["Solid", "Liquid", "Gas", "Plasma"], answer: "Solid" },
        { question: "Which can be easily compressed?", options: ["Solid", "Liquid", "Gas", "All of them"], answer: "Gas" },
      ],
    },
    {
      type: "match",
      title: "Match the state to its example",
      items: [
        { left: "Solid",  right: "Ice cube" },
        { left: "Liquid", right: "Tap water" },
        { left: "Gas",    right: "Steam" },
      ],
    },
  ],
);

export const SAMPLE_WORKSHEET_STUDIO: TemplatedWorksheet = baseWorksheet(
  "studio",
  "Color Theory Worksheet",
  "Year 4 · Art · Homework",
  "Mix and identify colours like a real artist!",
  [
    {
      type: "fill-blank",
      title: "Fill in the blanks",
      items: [
        { sentence: "Red + Yellow = ___.", answer: "Orange" },
        { sentence: "Yellow + Blue = ___.", answer: "Green" },
        { sentence: "Blue + Red = ___.", answer: "Purple" },
      ],
    },
    {
      type: "creative",
      title: "Try it!",
      items: [
        { prompt: "Draw your favourite mood in three colours. Label each colour with the feeling it represents.", lines: 8 },
      ],
    },
  ],
);

export const SAMPLE_WORKSHEETS: Record<ThemeId, TemplatedWorksheet> = {
  garden:  SAMPLE_WORKSHEET_GARDEN,
  space:   SAMPLE_WORKSHEET_SPACE,
  theater: SAMPLE_WORKSHEET_THEATER,
  ocean:   SAMPLE_WORKSHEET_OCEAN,
  lab:     SAMPLE_WORKSHEET_LAB,
  studio:  SAMPLE_WORKSHEET_STUDIO,
};

// ═══════════════════════════════════════════════════════════════
// LESSON PLAN SAMPLES — one per theme, teacher-facing timeline
// ═══════════════════════════════════════════════════════════════

const baseLP = (themeId: ThemeId, title: string, subtitle: string, objectives: string[], timeline: TemplatedLessonPlan["timeline"], diff: TemplatedLessonPlan["differentiation"], assessment: string, homework: string): TemplatedLessonPlan => ({
  format: "template-v1",
  template: "lessonplan-timeline",
  themeId,
  title,
  subtitle,
  durationMin: 55,
  objectives,
  timeline,
  differentiation: diff,
  assessment,
  homework,
});

const PHOTOSYNTHESIS_TIMELINE: TemplatedLessonPlan["timeline"] = [
  { section: "Icebreaker",           time: "0-5 min",   durationMin: 5,  activity: "Open with 'If you were a plant, where would you live?' Ask 2 follow-ups about why.", materials: "Chat / voice", notes: "Keep it light. Make the student smile in the first minute." },
  { section: "Warm-up",              time: "5-10 min",  durationMin: 5,  activity: "Show two images: plant in sun vs plant in dark. Ask which grows better and why.", materials: "Screen share", notes: "Listen for prior knowledge. Don't correct yet." },
  { section: "Learning Objective",   time: "10-13 min", durationMin: 3,  activity: "State: 'Today you'll be able to explain how plants make food using sunlight.'", materials: "Slide / chat", notes: "Read it slowly. Ask the student to repeat it back." },
  { section: "Definition",           time: "13-17 min", durationMin: 4,  activity: "Define photosynthesis. Break the word: photo + synthesis = light + putting together.", materials: "Whiteboard", notes: "Have the student write the word breakdown." },
  { section: "Explanation",          time: "17-29 min", durationMin: 12, activity: "Walk through the equation: CO₂ + water + sunlight → glucose + oxygen. Use sunflower diagram.", materials: "Diagram on screen", notes: "Pause every 30 seconds to ask 'still with me?'. Use the diagram, not text-heavy slides." },
  { section: "Activity (I Do / We Do / You Do)", time: "29-39 min", durationMin: 10, activity: "I Do: label a diagram. We Do: label one together. You Do: student labels one alone.", materials: "Drag-drop activity", notes: "Increase challenge gradually. Celebrate the You Do." },
  { section: "Skill Task",           time: "39-45 min", durationMin: 6,  activity: "Apply: 'A plant in a closet. What's missing? What will happen?'", materials: "Discussion", notes: "Encourage reasoning, not just naming." },
  { section: "Quick Assessment",     time: "45-50 min", durationMin: 5,  activity: "Five quick questions (see Assessment section below).", materials: "Quiz mode", notes: "Don't over-explain wrong answers — give a hint and let them try again." },
  { section: "Key Takeaways",        time: "50-53 min", durationMin: 3,  activity: "Recap: sun + water + air = plant food. Plants give us oxygen.", materials: "Recap slide", notes: "Make the student say it back in their own words." },
  { section: "Closure (HOTS)",       time: "53-55 min", durationMin: 2,  activity: "'What if Earth had no plants?' Open-ended, 1 minute thinking out loud.", materials: "Voice", notes: "Don't grade. Just listen and affirm curiosity." },
];

export const SAMPLE_LP_GARDEN: TemplatedLessonPlan = baseLP(
  "garden",
  "Photosynthesis · 55-min 1:1",
  "Year 4 · Science · Online live class",
  [
    "Explain photosynthesis in their own words.",
    "Identify the four key ingredients (sun, water, air, chlorophyll).",
    "Predict what happens to a plant deprived of any ingredient.",
  ],
  PHOTOSYNTHESIS_TIMELINE,
  {
    below: "Use a labelled diagram with 4 colour-coded ingredients before asking the student to repeat back.",
    at:    "Standard sequence with diagram + brief equation.",
    above: "Introduce 'chlorophyll' and the chemical equation. Ask why leaves are green.",
  },
  "1) What gas do plants take in? 2) What gas do plants release? 3) Which part of a plant is the 'kitchen'? 4) Name the green pigment in leaves. 5) What's the energy source for photosynthesis?\n\nAnswers: 1) CO₂  2) Oxygen  3) Leaves  4) Chlorophyll  5) Sunlight",
  "Find one plant at home. Sketch it and write 3 sentences about how it might be doing photosynthesis right now.",
);

export const SAMPLE_LP_SPACE: TemplatedLessonPlan = baseLP(
  "space",
  "Newton's First Law · 55-min 1:1",
  "Year 9 · Physics · Online live class",
  [
    "State Newton's First Law in their own words.",
    "Identify inertia in everyday situations.",
    "Explain why seatbelts exist using inertia.",
  ],
  PHOTOSYNTHESIS_TIMELINE.map((e, i) => ({ ...e, activity: i === 4 ? "Walk through F = 0 → no change in motion. Show diagrams of cars braking, hockey pucks on ice." : e.activity })),
  {
    below: "Use a single example (bus braking) and revisit it three different ways.",
    at:    "Use 2–3 examples (cars, sports, space).",
    above: "Bring up mass-as-inertia and tease F=ma for the next lesson.",
  },
  "1) An object at rest stays at rest unless… 2) Why do you lurch forward when a car brakes? 3) True or false: in space, a thrown ball stops eventually. 4) Heavier object = ___ inertia. 5) Friction is a kind of ___.\n\nAnswers: 1) acted on by a force  2) inertia (your body keeps moving)  3) False  4) more  5) force",
  "Watch one minute of a sports clip. Write 3 sentences identifying inertia.",
);

export const SAMPLE_LP_THEATER: TemplatedLessonPlan = baseLP(
  "theater",
  "Shakespeare's Sonnets · 55-min 1:1",
  "Year 10 · English Literature · Online live class",
  [
    "Define a Shakespearean sonnet.",
    "Identify the rhyme scheme and meter.",
    "Comment briefly on the function of the final couplet.",
  ],
  PHOTOSYNTHESIS_TIMELINE.map(e => ({ ...e, activity: e.activity })),
  {
    below: "Work with one sonnet (Sonnet 18) the whole lesson; mark up the rhyme scheme line by line.",
    at:    "Two sonnets, identify the shift between quatrains and couplet.",
    above: "Compare Shakespearean vs Petrarchan, ask which suits the topic of each sonnet best.",
  },
  "1) How many lines in a sonnet? 2) What's the rhyme scheme? 3) What's iambic pentameter? 4) Role of the final couplet? 5) Name another Shakespearean sonnet.\n\nAnswers: 1) 14  2) ABAB CDCD EFEF GG  3) ten syllables per line, unstressed-stressed pattern  4) twist/conclusion  5) Sonnet 130 / 116 / etc.",
  "Write your own 4 lines in iambic pentameter on any topic.",
);

export const SAMPLE_LP_OCEAN: TemplatedLessonPlan = baseLP(
  "ocean",
  "Water Cycle · 55-min 1:1",
  "Year 5 · Science · Online live class",
  ["Name the 4 stages.", "Explain evaporation in their own words.", "Describe how a raindrop returns to the sea."],
  PHOTOSYNTHESIS_TIMELINE,
  { below: "Use a single annotated diagram repeatedly.", at: "Standard.", above: "Introduce groundwater and aquifers." },
  "1) Sun → water → ? (evaporation) 2) Vapour → ? (condensation) 3) Clouds → ? (precipitation) 4) Where does most water end up?  5) The cycle is powered by ___.\n\nAnswers: 1) evaporation  2) condensation  3) precipitation  4) oceans  5) the sun",
  "Track the weather for 3 days. Write which stage you spotted each day.",
);

export const SAMPLE_LP_LAB: TemplatedLessonPlan = baseLP(
  "lab",
  "States of Matter · 55-min 1:1",
  "Year 7 · Chemistry · Online live class",
  ["Name the 3 main states.", "Describe particle motion in each state.", "Predict what happens when ice is heated."],
  PHOTOSYNTHESIS_TIMELINE,
  { below: "Use ice/water/steam as the sole example throughout.", at: "Standard.", above: "Introduce plasma and energy levels." },
  "1) Particles in a solid are ___. 2) A gas can be ___. 3) Liquid + heat → ? 4) Gas → cold → ? 5) Name a state besides solid/liquid/gas.\n\nAnswers: 1) tightly packed and vibrating  2) compressed easily  3) gas (evaporation)  4) liquid (condensation)  5) plasma",
  "Find one of each state in your kitchen. Write down what you found.",
);

export const SAMPLE_LP_STUDIO: TemplatedLessonPlan = baseLP(
  "studio",
  "Color Theory · 55-min 1:1",
  "Year 4 · Art · Online live class",
  ["Name the 3 primary colors.", "Mix two primaries to predict a secondary.", "Identify warm vs cool colors."],
  PHOTOSYNTHESIS_TIMELINE,
  { below: "Stick to mixing 2 primaries at a time with visual aids.", at: "Standard.", above: "Introduce complementary colors and use in compositions." },
  "1) The 3 primaries are ___. 2) Red + yellow = ? 3) Yellow + blue = ? 4) Warm colors are ___. 5) Complement of red is ___.\n\nAnswers: 1) red, yellow, blue  2) orange  3) green  4) reds/oranges/yellows  5) green",
  "Paint or draw a self-portrait using only 3 primary colors.",
);

export const SAMPLE_LESSONPLANS: Record<ThemeId, TemplatedLessonPlan> = {
  garden:  SAMPLE_LP_GARDEN,
  space:   SAMPLE_LP_SPACE,
  theater: SAMPLE_LP_THEATER,
  ocean:   SAMPLE_LP_OCEAN,
  lab:     SAMPLE_LP_LAB,
  studio:  SAMPLE_LP_STUDIO,
};

// ═══════════════════════════════════════════════════════════════
// QUIZ SAMPLES (Diagnostic + Assessment shared) — one per theme
// ═══════════════════════════════════════════════════════════════

const baseQuiz = (themeId: ThemeId, title: string, subtitle: string, mode: "diagnostic" | "assessment", questions: TemplatedQuiz["questions"]): TemplatedQuiz => ({
  format: "template-v1",
  template: "quiz-live",
  themeId,
  title,
  subtitle,
  mode,
  timed: mode === "assessment",
  totalTimeMin: mode === "assessment" ? 30 : undefined,
  totalMarks: mode === "assessment" ? questions.length * 2 : undefined,
  passMarkPct: 60,
  showAnalysis: mode === "diagnostic",
  questions,
});

const PHOTO_QUESTIONS = [
  { id: "q1", text: "Which gas do plants take in for photosynthesis?", options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], correctIndex: 1, marks: 2, explanation: "Plants take in CO₂ from the air.", skill: "Inputs of photosynthesis", difficulty: "easy" as const },
  { id: "q2", text: "What's the green pigment in leaves called?", options: ["Carotene", "Chlorophyll", "Melanin", "Anthocyanin"], correctIndex: 1, marks: 2, explanation: "Chlorophyll absorbs sunlight and gives leaves their green colour.", skill: "Plant structure", difficulty: "medium" as const },
  { id: "q3", text: "Which is the by-product of photosynthesis?", options: ["CO₂", "Water", "Oxygen", "Nitrogen"], correctIndex: 2, marks: 2, explanation: "Oxygen is released as the plant produces glucose.", skill: "Outputs", difficulty: "easy" as const },
  { id: "q4", text: "Where in the plant does photosynthesis mostly happen?", options: ["Roots", "Stem", "Leaves", "Flowers"], correctIndex: 2, marks: 2, explanation: "Leaves are packed with chloroplasts.", skill: "Plant structure", difficulty: "easy" as const },
  { id: "q5", text: "What does photosynthesis produce that the plant uses for food?", options: ["Salt", "Glucose", "Carbon", "Steam"], correctIndex: 1, marks: 2, explanation: "Glucose is the sugar plants store as food.", skill: "Outputs", difficulty: "medium" as const },
];

export const SAMPLE_QUIZ_GARDEN_DIAG: TemplatedQuiz = baseQuiz("garden", "Photosynthesis · Diagnostic", "Year 4 · Science", "diagnostic", PHOTO_QUESTIONS);
export const SAMPLE_QUIZ_SPACE_ASSESS: TemplatedQuiz = baseQuiz("space", "Newton's Laws · Assessment", "Year 9 · Physics · 30 min · 10 marks", "assessment", [
  { id: "q1", text: "Newton's First Law is also called the law of…", options: ["Force", "Inertia", "Gravity", "Action"], correctIndex: 1, marks: 2, explanation: "The Law of Inertia.", difficulty: "easy" as const },
  { id: "q2", text: "F = ma is which law?", options: ["First", "Second", "Third", "Zeroth"], correctIndex: 1, marks: 2, explanation: "Force = mass × acceleration is the Second Law.", difficulty: "easy" as const },
  { id: "q3", text: "When you push a wall, the wall pushes back with…", options: ["Less force", "Equal force in same direction", "Equal force opposite direction", "No force"], correctIndex: 2, marks: 2, explanation: "Newton's Third Law: equal and opposite reaction.", difficulty: "medium" as const },
  { id: "q4", text: "Inertia depends on…", options: ["Speed", "Mass", "Colour", "Temperature"], correctIndex: 1, marks: 2, explanation: "Heavier objects have more inertia.", difficulty: "medium" as const },
  { id: "q5", text: "A car suddenly brakes. Why do you lurch forward?", options: ["Gravity", "Inertia of your body", "The seatbelt pushes you", "The car accelerates"], correctIndex: 1, marks: 2, explanation: "Your body's inertia keeps it moving forward when the car decelerates.", difficulty: "hard" as const },
]);

export const SAMPLE_QUIZ_THEATER_DIAG: TemplatedQuiz = baseQuiz("theater", "Sonnets · Diagnostic", "Year 10 · English", "diagnostic", [
  { id: "q1", text: "How many lines in a Shakespearean sonnet?", options: ["10", "12", "14", "16"], correctIndex: 2, explanation: "14 lines.", skill: "Sonnet structure", difficulty: "easy" as const },
  { id: "q2", text: "Rhyme scheme of a Shakespearean sonnet?", options: ["ABAB ABAB CDCD EE", "ABAB CDCD EFEF GG", "AABB AABB CCDD EE", "ABBA ABBA CDC CDC"], correctIndex: 1, explanation: "ABAB CDCD EFEF GG.", skill: "Rhyme scheme", difficulty: "medium" as const },
  { id: "q3", text: "Iambic pentameter has how many syllables per line?", options: ["8", "10", "12", "14"], correctIndex: 1, explanation: "Ten syllables: five iambs.", skill: "Meter", difficulty: "medium" as const },
  { id: "q4", text: "The final couplet often…", options: ["Repeats the title", "Resolves or twists the idea", "Lists characters", "Translates Latin"], correctIndex: 1, explanation: "Couplet typically resolves or twists the sonnet's argument.", skill: "Function", difficulty: "hard" as const },
]);

export const SAMPLE_QUIZ_OCEAN_ASSESS: TemplatedQuiz = baseQuiz("ocean", "Water Cycle · Assessment", "Year 5 · Science · 20 min", "assessment", [
  { id: "q1", text: "What process turns liquid water into vapour?", options: ["Condensation", "Evaporation", "Precipitation", "Collection"], correctIndex: 1, marks: 2, explanation: "Evaporation: liquid → gas.", difficulty: "easy" as const },
  { id: "q2", text: "What powers the water cycle?", options: ["Wind", "Sun", "Gravity", "Magnets"], correctIndex: 1, marks: 2, explanation: "The sun heats water to evaporate it.", difficulty: "easy" as const },
  { id: "q3", text: "What gives back water to the sea?", options: ["Rivers", "Rocks", "Trees", "Birds"], correctIndex: 0, marks: 2, explanation: "Rivers carry water back to the ocean.", difficulty: "medium" as const },
  { id: "q4", text: "Vapour cools and forms…", options: ["Salt", "Clouds", "Rocks", "Ice"], correctIndex: 1, marks: 2, explanation: "Cooled vapour condenses into clouds.", difficulty: "easy" as const },
]);

export const SAMPLE_QUIZ_LAB_DIAG: TemplatedQuiz = baseQuiz("lab", "States of Matter · Diagnostic", "Year 7 · Chemistry", "diagnostic", [
  { id: "q1", text: "Which has a fixed shape and volume?", options: ["Solid", "Liquid", "Gas", "Plasma"], correctIndex: 0, explanation: "Solids have rigid particle structure.", skill: "States of matter", difficulty: "easy" as const },
  { id: "q2", text: "Particles in a liquid…", options: ["Are tightly packed", "Move freely + flow", "Move at random in vast space", "Don't move"], correctIndex: 1, explanation: "Liquid particles flow past each other.", skill: "Particle theory", difficulty: "medium" as const },
  { id: "q3", text: "Steam → water is called…", options: ["Melting", "Evaporation", "Condensation", "Sublimation"], correctIndex: 2, explanation: "Gas → liquid = condensation.", skill: "Phase changes", difficulty: "medium" as const },
  { id: "q4", text: "Plasma is found in…", options: ["Ice cubes", "Stars", "Rain", "Mud"], correctIndex: 1, explanation: "Plasma exists in stars (incl. our sun).", skill: "Plasma", difficulty: "hard" as const },
]);

export const SAMPLE_QUIZ_STUDIO_ASSESS: TemplatedQuiz = baseQuiz("studio", "Color Theory · Assessment", "Year 4 · Art · 15 min", "assessment", [
  { id: "q1", text: "How many primary colors are there?", options: ["2", "3", "4", "7"], correctIndex: 1, marks: 2, explanation: "Three: red, yellow, blue.", difficulty: "easy" as const },
  { id: "q2", text: "Red + yellow = ?", options: ["Purple", "Orange", "Green", "Pink"], correctIndex: 1, marks: 2, explanation: "Orange.", difficulty: "easy" as const },
  { id: "q3", text: "Warm colors include…", options: ["Blue, green", "Red, orange, yellow", "Black, white", "Grey, brown"], correctIndex: 1, marks: 2, explanation: "Warm = sun/fire colours.", difficulty: "medium" as const },
  { id: "q4", text: "Complement of green is…", options: ["Yellow", "Blue", "Red", "Orange"], correctIndex: 2, marks: 2, explanation: "Red and green are direct opposites.", difficulty: "hard" as const },
]);

export const SAMPLE_QUIZZES: Record<ThemeId, TemplatedQuiz> = {
  garden:  SAMPLE_QUIZ_GARDEN_DIAG,
  space:   SAMPLE_QUIZ_SPACE_ASSESS,
  theater: SAMPLE_QUIZ_THEATER_DIAG,
  ocean:   SAMPLE_QUIZ_OCEAN_ASSESS,
  lab:     SAMPLE_QUIZ_LAB_DIAG,
  studio:  SAMPLE_QUIZ_STUDIO_ASSESS,
};
