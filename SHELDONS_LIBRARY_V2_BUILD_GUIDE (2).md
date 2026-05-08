# Sheldon's Library v2.0 — Teacher Assistant Web App
## Complete Hackathon Build Guide (Single Source of Truth)

> Read this whole doc once. Then follow it top-to-bottom. Don't skip steps.
> Total build time: ~12–16 hours of work spread across the hackathon window.
> Stack is locked. Don't substitute tools.

---

## TABLE OF CONTENTS

1. What you are building (the flow, in plain English)
2. The full stack (what runs where)
3. Free-tier budget (what costs nothing, what runs out)
4. PHASE 1 — Manual setup BEFORE pasting the AI prompt (~90 min)
5. PHASE 2 — The Master AI Prompt (paste into Emergent / Lovable)
6. PHASE 3 — Build the 9 n8n workflows (after AI finishes the frontend)
7. PHASE 4 — Wire it all together (env vars, deploy)
8. PHASE 5 — Demo-day checklist
9. APPENDIX A — Airtable schema (every field, every type)
10. APPENDIX B — Webhook contracts (request/response JSON)
11. APPENDIX C — Claude prompts for each generator (the LLM secret sauce)
12. APPENDIX D — DESIGN.md (drop into repo root verbatim)

---

## 1. WHAT YOU ARE BUILDING

A teacher-facing web app where a tutor picks a student, picks a tool (Diagnostic / Assessment / Worksheet / Lesson Plan / Presentation / Game), and gets an AI-generated, **interactive** artifact in 30 seconds — not a static PDF, but a live clickable quiz the student takes right there, a slide deck with drag-drop quiz slides, a printable worksheet with cartoon styling. Everything saves to the teacher's Library. Progress and scores accumulate per student so the teacher can pull a real PTM (parent-teacher meeting) report.

### The flow (end-to-end)

```
1. Teacher opens app → Dashboard (default route /)
2. Teacher picks/adds an Active Student (top bar selector)
3. Teacher clicks one of 6 generator cards (e.g. "Diagnostic Test")
4. /generate page opens with form on left, empty preview on right
5. Teacher fills form (topic, difficulty, etc.), clicks "Generate"
6. Frontend POSTs to n8n webhook
7. n8n calls Claude Sonnet 4.5 with a structured prompt
   → Claude returns JSON (questions / slides / worksheet HTML)
8. n8n saves artifact to Airtable LibraryItems table
9. n8n returns the artifact JSON to frontend
10. Frontend renders the INTERACTIVE artifact in the right pane:
    - Diagnostic/Assessment → live clickable quiz
    - Worksheet → printable card-style page
    - Lesson Plan → structured doc
    - Presentation → 16:9 slide deck with controls
    - Game → drag-drop / match / sequence component
11. Student takes quiz / plays game → scores POST to n8n /diagnostic-analyze
12. n8n calls Claude to analyze, returns strengths/weaknesses/recommendations
13. Score saved to Airtable Progress table
14. Teacher views Library + Progress pages, exports PTM report PDF
```

### Why each tool in the stack

| Concern | Tool | Why this one |
|---|---|---|
| Frontend framework | **Vite + React + TypeScript** | Fastest scaffolding, AI builders write it well, no SEO needs |
| Styling | **Tailwind CSS** | Matches your DESIGN.md tokens cleanly |
| State management | **Zustand** | Tiny, no boilerplate, easy persistence patterns |
| Charts | **Recharts** | Per spec, clean API, works for Progress trajectory |
| Animations | **Framer Motion** | For slide reveals, I-Do/We-Do/You-Do, drag-drop games |
| Icons | **Lucide React** | Per DESIGN.md — no other icon libraries allowed |
| Routing | **react-router-dom** | 5 routes, simple |
| Toasts | **react-hot-toast** | One import, looks great |
| PDF export (browser) | **jsPDF + html2canvas** | Worksheet and PTM report PDF, no server needed |
| Backend brain | **n8n on Railway** | Drag-drop workflows, all integrations as native nodes |
| LLM | **Claude Sonnet 4.5 via Anthropic API** | Best at structured JSON output, $5 free credit covers ~100 generations |
| PPTX export | **pptxgenjs in n8n Code node** | No extra service. Returns base64 download |
| Database | **Airtable** | Same workspace as your sales project. Multi-device. Survives refresh |
| Frontend hosting | **Vercel** | Free, instant GitHub deploy |
| n8n hosting | **Railway** | Reuse existing instance from sales project |
| AI builder | **Emergent** (primary) / Lovable (backup) | Best at multi-page agentic builds |

---

## 2. THE FULL STACK

```
┌──────────────────────────────────────────────────────────────────┐
│  Teacher's Browser (laptop) + Student's Device (taking quiz)     │
└──────────────────────────────────┬───────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────┐
│  Vite + React + Tailwind app on VERCEL                           │
│   Routes:                                                        │
│     /              Dashboard (hero + 6 generator cards)          │
│     /students      Student roster CRUD                           │
│     /generate      40/60 split: form left, live preview right   │
│     /library       Filtered grid of saved artifacts              │
│     /progress      Score trajectory, PTM report export           │
│   State: Zustand store, hydrated from Airtable on mount          │
└──┬───────────────────────────────────────────────────────────────┘
   │ HTTPS
   ▼
┌──────────────────────────────────────────────────────────────────┐
│  n8n on RAILWAY (existing instance from sales project)           │
│   9 workflows:                                                   │
│     1.  /diagnostic-generate     → Claude → JSON quiz            │
│     2.  /diagnostic-analyze      → Claude → analysis + score     │
│     3.  /assessment-generate     → Claude → JSON quiz w/ marks   │
│     4.  /worksheet-generate      → Claude → HTML worksheet       │
│     5.  /lessonplan-generate     → Claude → structured doc       │
│     6.  /presentation-generate   → Claude → slides JSON          │
│     7.  /presentation-to-pptx    → pptxgenjs → base64 PPTX       │
│     8.  /game-generate           → Claude → game JSON            │
│     9.  /sync-state              → Airtable read/write helper    │
└──┬─────────────────────────────────────────────────────┬─────────┘
   │                                                     │
   ▼                                                     ▼
┌──────────────────────────┐           ┌────────────────────────────┐
│  Anthropic API           │           │  Airtable (Sheldon Library)│
│  Claude Sonnet 4.5       │           │   - Students               │
│  (structured JSON output)│           │   - LibraryItems           │
└──────────────────────────┘           │   - QuizAttempts           │
                                       │   - GeneratorRuns (audit)  │
                                       └────────────────────────────┘
```

---

## 3. FREE-TIER BUDGET

| Service | Free tier | Will you exceed it? |
|---|---|---|
| Vercel | Unlimited static, 100 GB bandwidth/mo | No |
| Airtable | 1000 records per base, 5 editors | No (~50 records for demo) |
| Railway | $5 credit/mo (n8n uses ~$3-4) | No, runs ~3 weeks free |
| Anthropic API | $5 free credit on signup | No (~100 generations covered) |
| Emergent | Free tier with daily token cap | Maybe — split prompt if hit |
| Lovable | Free tier with daily limit | No (backup builder) |

**Total cost for the hackathon: $0.**

If you blow through Anthropic's $5: a top-up of $5 buys you ~500 more generations. Keep a note.

---

## 4. PHASE 1 — MANUAL SETUP (~90 min)

> Do these 8 steps yourself before pasting the AI prompt.

### Step 1.1 — Create the Airtable base (~20 min)

1. Open the Airtable workspace you used for the sales project (or sign up free at https://airtable.com).
2. Create a **new base** (don't reuse the sales base): name it **`Sheldon Library v2`**.
3. Build 4 tables. **Use exact field names — n8n workflows depend on them.** See **APPENDIX A** for full field list.
   - `Students`
   - `LibraryItems`
   - `QuizAttempts`
   - `GeneratorRuns`
4. Personal Access Token (PAT):
   - Click avatar → Builder hub → Personal access tokens.
   - Create new. Name: `Sheldon Library n8n`.
   - Scopes: `data.records:read`, `data.records:write`, `schema.bases:read`.
   - Access: select **Sheldon Library v2** base.
   - Copy the token. Save as `AIRTABLE_LIBRARY_PAT`.
5. Get the Base ID: https://airtable.com/api → click the base → URL contains `app...`. Save as `AIRTABLE_LIBRARY_BASE_ID`.
6. **Add 3 demo students manually** so the app has data on first load (e.g. "Aarav Sharma · Grade 7 · India · Maths", etc.)

### Step 1.2 — Anthropic API key (~5 min)

1. Go to https://console.anthropic.com → sign up / log in.
2. Settings → API Keys → Create Key. Name: `Sheldon Library`.
3. Copy. Save as `ANTHROPIC_API_KEY`.
4. Settings → Plans & Billing — confirm you have the $5 free credit (or top up $5 if not).

### Step 1.3 — Open your existing n8n on Railway (~3 min)

1. Open your existing n8n instance from the sales project at the Railway URL.
2. Login. You'll add new credentials and workflows next to the existing ones.
3. **If you don't have one yet:** New Railway project → Deploy template → "n8n with Postgres" → Generate Domain. Save URL as `N8N_BASE_URL`.

### Step 1.4 — Add the Anthropic credential to n8n (~3 min)

1. n8n → Settings → Credentials → New.
2. Search "Anthropic" → "Anthropic API".
3. Paste `ANTHROPIC_API_KEY`. Save as `Sheldon Anthropic`.

### Step 1.5 — Add the new Airtable credential to n8n (~2 min)

> You can reuse the sales project credential if it has access to both bases. Cleaner to make a new one.

1. n8n → Settings → Credentials → New → Airtable Personal Access Token API.
2. Paste `AIRTABLE_LIBRARY_PAT`. Save as `Sheldon Library Airtable`.

### Step 1.6 — Vercel + GitHub (~3 min)

1. Vercel: already have an account from sales project. No setup needed.
2. GitHub: create a new repo `sheldon-library-v2` (private fine).

### Step 1.7 — Decide your AI builder + sign in (~5 min)

- **Primary: Emergent** (https://emergent.sh) — sign up free. Spec is written for it.
- **Backup: Lovable** (https://lovable.dev) — sign up free.
- Have both ready in browser tabs.

### Step 1.8 — Final checklist before pasting the prompt

You should have all of these saved:

```
AIRTABLE_LIBRARY_PAT=pat...
AIRTABLE_LIBRARY_BASE_ID=app...
ANTHROPIC_API_KEY=sk-ant-...
N8N_BASE_URL=https://your-n8n.up.railway.app
```

You will get the 9 webhook URLs in Phase 3. The frontend works in mock mode without them, so you can build in parallel.

✅ Ready for Phase 2.

---

## 5. PHASE 2 — THE MASTER AI PROMPT

> Paste everything between `===PROMPT START===` and `===PROMPT END===` (do **not** include the markers) into Emergent.
>
> If your builder hits a token limit on a single prompt, send it in 2 parts split at `─────────── PART 2 ───────────`.

```
===PROMPT START===

# PROJECT: Sheldon's Library v2.0 — Teacher Assistant Web App

You are building a Vite + React + TypeScript web app for Super Sheldon EdTech. This is a teacher tool that uses AI (via n8n webhooks) to generate interactive, class-ready educational content. The teacher picks a student, picks a tool (6 options), gets an AI-generated artifact rendered live in the browser. Students take quizzes inline. Everything saves to a library and progress tracker.

## TECH STACK (USE EXACTLY THESE — DO NOT SUBSTITUTE)

- Vite + React 18 + TypeScript (strict mode)
- Tailwind CSS
- Zustand for state management
- react-router-dom v6 for routing
- Recharts for charts
- Framer Motion for animations and slide transitions
- Lucide React for icons (NO other icon libraries)
- react-hot-toast for toasts
- jsPDF + html2canvas for client-side PDF export
- Native fetch for n8n webhook calls

## ABSOLUTE RULES

1. NEVER hardcode hex colors outside `tailwind.config.ts` and `globals.css`.
2. NEVER add login, authentication, or user accounts. Single-user app.
3. NEVER add localStorage state — Airtable is the source of truth (via n8n webhooks).
4. NEVER invent UI components — use only the patterns shown below.
5. ALL backend logic lives in n8n. The frontend ONLY calls webhooks.
6. ALL copy follows the voice rules below (no "Submit", no "Loading…", no "Error").

## DESIGN SYSTEM — BAKE INTO `tailwind.config.ts` AND `globals.css`

### Brand palette (Sheldon's Library v2 — different from earlier Super Sheldon orange theme)

```js
colors: {
  navy:   '#1B2A4E',  // primary text, top bar
  teal:   '#0FA3A3',  // success, accents
  coral:  '#FF6B6B',  // destructive, "Remove"
  gold:   '#F4B400',  // warning, highlights
  purple: '#6C5CE7',  // active sidebar item, primary CTA
  bgLight:'#F5F3FF',  // page background
  // Generator card colors (KEEP EXACT)
  card: {
    diagnostic:    '#B6F2D7',  // mint
    assessment:    '#FFD9B3',  // peach
    worksheet:     '#FFE066',  // sunshine
    lessonplan:    '#C9B8FF',  // lavender
    presentation:  '#B3E0FF',  // sky
    games:         '#FFC0DD',  // pink
  }
}
```

### Typography
- Display headings: bold sans-serif, near-black (#0F1115), large (e.g. "Hi, let's build")
- Body: 14–15px, line-height 1.5
- Pills/labels: ALL CAPS, letter-spacing 0.08em, 11–12px

Load fonts in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
```

### Layout
- Fixed left sidebar 240px wide, white background
- Main area on soft gradient (white → very light purple `#F5F3FF` at bottom)
- Top bar shows ACTIVE STUDENT pill + dropdown + date (right-aligned)
- Owl mascot illustration top-right of dashboard hero (use a placeholder SVG owl with glasses for now — purple/cream colors)
- "Made with Emergent" badge bottom-right (keep)

### Component patterns (use verbatim)

```tsx
// Primary button (purple)
<button className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-purple text-white font-semibold hover:bg-purple/90 active:scale-[0.98] disabled:opacity-50 transition">Generate</button>

// Secondary button
<button className="px-5 py-3 rounded-xl border border-navy/20 text-navy font-semibold hover:bg-navy/5 transition">Cancel</button>

// Destructive button (coral)
<button className="px-4 py-2 rounded-xl bg-coral/10 text-coral font-semibold hover:bg-coral/20 transition">Remove</button>

// Input
<input className="w-full px-4 py-3 rounded-xl border border-navy/15 bg-white text-navy placeholder-navy/40 focus:border-purple focus:ring-2 focus:ring-purple/20 outline-none transition" />

// Card
<div className="bg-white rounded-2xl shadow-sm p-6 border border-navy/5">…</div>

// Pastel generator card
<button className="bg-card-diagnostic rounded-2xl p-6 text-left hover:scale-[1.02] hover:shadow-lg transition w-full">…</button>

// Type pill
<span className="px-3 py-1 rounded-full bg-purple/10 text-purple text-xs font-bold uppercase tracking-wider">PRESENTATION</span>

// Sidebar nav item (active)
<a className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple text-white font-semibold">…</a>

// Sidebar nav item (rest)
<a className="flex items-center gap-3 px-4 py-3 rounded-xl text-navy hover:bg-navy/5 transition">…</a>
```

### Voice rules
- Empty: "Nothing here yet — add one."
- Loading: "Sheldon is thinking…" (with animated owl icon)
- Error: "Something broke — try again." + Retry button
- Success: "Saved!" / "Generated!"
- Confirm delete: "This can't be undone. Remove?"

## REPO STRUCTURE

```
/
├── src/
│   ├── main.tsx
│   ├── App.tsx                          # Router + layout shell
│   ├── index.css                        # Tailwind + globals
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Students.tsx
│   │   ├── Generate.tsx
│   │   ├── Library.tsx
│   │   └── Progress.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   └── ActiveStudentSelector.tsx
│   │   ├── shared/
│   │   │   ├── PageHero.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── GeneratorCard.tsx
│   │   │   ├── TypePill.tsx
│   │   │   ├── LoadingState.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorState.tsx
│   │   │   └── OwlMascot.tsx
│   │   ├── students/
│   │   │   ├── StudentCard.tsx
│   │   │   └── AddStudentModal.tsx
│   │   ├── generators/
│   │   │   ├── DiagnosticForm.tsx
│   │   │   ├── AssessmentForm.tsx
│   │   │   ├── WorksheetForm.tsx
│   │   │   ├── LessonPlanForm.tsx
│   │   │   ├── PresentationForm.tsx
│   │   │   └── GameForm.tsx
│   │   └── renderers/
│   │       ├── QuizRenderer.tsx          # used by Diagnostic + Assessment
│   │       ├── QuizResults.tsx
│   │       ├── WorksheetRenderer.tsx
│   │       ├── LessonPlanRenderer.tsx
│   │       ├── PresentationRenderer.tsx
│   │       ├── SlideTypes.tsx
│   │       └── games/
│   │           ├── SortGame.tsx
│   │           ├── MatchGame.tsx
│   │           ├── SequenceGame.tsx
│   │           ├── FillBlankGame.tsx
│   │           └── QuizGame.tsx
│   ├── store/
│   │   └── useStore.ts                   # Zustand store
│   ├── lib/
│   │   ├── api.ts                        # n8n webhook wrapper + mock mode
│   │   ├── types.ts                      # All TS types
│   │   ├── pdf.ts                        # jsPDF + html2canvas helpers
│   │   └── mockData.ts                   # Mock responses for dev
│   └── assets/
│       └── owl.svg                       # Placeholder owl mascot
├── public/
├── .env.example
├── tailwind.config.ts
├── DESIGN.md
└── README.md
```

## ENVIRONMENT VARIABLES

`.env.example`:
```
VITE_N8N_BASE_URL=
VITE_SHELDON_KEY=optional-shared-secret
```

Frontend always sends header `x-sheldon-key: <VITE_SHELDON_KEY>` if set.

When `VITE_N8N_BASE_URL` is empty or starts with `https://your-n8n`, the app runs in **mock mode** — `lib/api.ts` returns canned responses from `lib/mockData.ts`. Show a yellow banner at top: "⚠ Mock mode — n8n not connected."

## ─────────── PART 1 ───────────

## ROUTES & PAGES

### `/` — Dashboard
- Hero: "Hi, let's build a class-ready plan." + subtitle "Pick a tool below to generate AI-tailored content for {ACTIVE_STUDENT_NAME}. Everything saves to your library for the PTM."
- Owl mascot top-right of hero.
- 3 stat cards in a row:
  1. STUDENTS → big number (count from store) + "Manage roster →" link to /students
  2. LIBRARY ITEMS → big number with "+" suffix + "Open library →" to /library
  3. AI MODEL → "Claude Sonnet 4.5" + "Pedagogy-aware generation"
- "Generator Tools" heading.
- 2×3 grid of pastel generator cards:
  Diagnostic Test (mint) | Assessment (peach) | Worksheet (sunshine)
  Lesson Plan (lavender) | Presentation (sky)  | Games & Activities (pink)
  Each card: large Lucide icon (left), bold title, "Launch →" subtitle.
  On click → navigate to `/generate?tool=<type>`.
- "Recently generated" heading.
- 3-column grid (responsive: 1 col mobile, 2 tablet, 3 desktop) of last 6 LibraryItems.
  Each card: TYPE pill, bold title, timestamp, click → opens artifact in renderer.

### `/students`
- Heading "Students" + "+ Add student" purple button (top-right).
- Grid of StudentCard (responsive 1/2/3 cols).
- Each card: avatar tile (rounded square, alternating pastel fill), name, "Grade N · Country", "Subject: X", "Parent: email" (if present), coral "Remove" with trash icon.
- "+ Add student" opens AddStudentModal with: name, grade (1–12), country (UK/Australia/India/USA/Singapore/NZ), subject, parentEmail (optional).
- Save → POST to `/sync-state` (action: createStudent).
- Remove → confirm dialog → POST to `/sync-state` (action: deleteStudent).

### `/generate`
- 40/60 two-column layout (stack on mobile).
- Read `?tool=` query param to set initial selected tool (or none).
- LEFT 40%:
  - "Student & Class Information" card:
    - Student Name (read-only, from active student)
    - Year/Grade dropdown 1–12 (default from active student)
    - Region dropdown (UK / Australia / India / USA / Singapore / NZ — default from active student)
    - Subject text input (default from active student)
  - "Select Requirement" — 6 radio cards in pastel colors.
  - Below: dynamic form for the selected tool (see DYNAMIC FORMS below).
- RIGHT 60%:
  - Empty state: friendly illustration + "Your generated content will appear here. Pick a tool to begin."
  - Loading state: skeleton + animated owl + "Sheldon is thinking…"
  - Loaded state: render the appropriate Renderer (see RENDERERS).
  - Error state: red left border card + "Something broke — try again." + Retry button.

### `/library`
- Heading "Library".
- Filter chips at top: All | Diagnostic | Assessment | Worksheet | Lesson Plan | Presentation | Games (active chip = purple bg, white text).
- Grid of saved LibraryItems (3 cols desktop). Each card: TYPE pill, title, student name (from lookup), timestamp, click → open in renderer (read-only mode).
- Empty state per filter: "Nothing here yet — generate one to start your library."

### `/progress`
- Heading "Progress & PTM Reports".
- Subtitle "Track strengths, weaknesses, and recommendations over time."
- Student selector dropdown (defaults to active student).
- 3 stat cards: STUDENT (name + grade), ASSESSMENTS TAKEN (count), LATEST SCORE (% with color-coded badge).
- "Score trajectory" — Recharts LineChart, X = attempt #, Y = 0–100 score, line color = purple, dot color = teal.
- For each attempt (most recent first): card with timestamp pill, big % score top-right, analysis paragraph, three columns (Strengths / Weaknesses / Recommendations).
- "Export PTM Report (PDF)" button top-right — uses jsPDF + html2canvas to capture the Progress page and download as PDF.

## DYNAMIC GENERATOR FORMS (LEFT COLUMN OF /generate)

### A) Diagnostic Test
Fields:
- Parent Goal (radio): Curriculum Alignment | Skill Development | Exam Prep
- Number of questions (slider 5–20, default 10)
- Submit: "Generate Diagnostic" button
**The form helper text shows:** "ℹ️ Diagnostic tests cover the previous year's syllabus to identify gaps." So a Grade 7 student gets a Grade 6 diagnostic.

### B) Assessment
Fields:
- Topic (multi-tag input — type and press enter to add a tag)
- Sub-topic (multi-tag input)
- Timed (toggle) → if on, show "Total Time (mins)" number input
- Total Marks (number)
- Total Questions (number, default 10)
- Difficulty (segmented control): Easy | Medium | Hard
- Submit: "Generate Assessment"

### C) Worksheet
Fields:
- Topic (text)
- Sub-topic (text)
- Type (segmented): Homework | Classwork
- Sections (multi-checkbox, first 3 on by default):
  MCQs, Fill in the blanks, Match the following, Short answers, Choose the correct option, Find the error, Sentence making, Sorting game, Creative challenges, Passage, Comprehension
- Submit: "Generate Worksheet"

### D) Lesson Plan
Fields:
- Topic, Sub-topic
- Class Duration (minutes, default 60)
- Submit: "Generate Lesson Plan"

### E) Presentation
Fields:
- Topic, Sub-topic
- Class Duration (minutes, default 60)
- Difficulty (segmented): Easy | Medium | Hard
- Upload material (optional file input — accept .pdf, .docx, .pptx — read as base64, send only filename + size for hackathon, full upload is post-hackathon)
- Submit: "Generate Presentation"

### F) Games & Activities
Fields:
- Topic, Sub-topic
- Game Style (dropdown): Sort | Match | Sequence | Fill-blank | Quiz
- Submit: "Generate Game"

## ─────────── PART 2 ───────────

## RENDERERS — RIGHT COLUMN OF /generate

### QuizRenderer (used by Diagnostic AND Assessment)
- Top bar: progress (e.g. "3 / 10"), timer (counts up MM:SS), Pause button.
- One question per screen, large readable text.
- Answer options as big tappable cards (NOT radio buttons) — full-width, rounded-2xl, white bg, hover scale.
- On click: lock the answer, show selected card with purple border + checkmark, "Next" button appears.
- After last question: show "Submit" button.
- On submit:
  - **Diagnostic**: POST to `/diagnostic-analyze` with answers → show QuizResults.
  - **Assessment**: locally compute score (correct answers known from generator response), show QuizResults with marks + explanations + green/red icons + "Download answer key (PDF)" button.

### QuizResults (shared by Diagnostic and Assessment)
- Big score circle: e.g. "5 / 10 · 50%" (color: ≥75 teal, 50–74 gold, <50 coral).
- Recharts BarChart of per-skill scores (if Diagnostic).
- Three columns (responsive):
  - Strengths (green/teal bullets)
  - Weaknesses (coral bullets)
  - Recommendations (purple bullets)
- "Save to Progress" button — auto-clicks after 1s on render. Calls `/sync-state` (action: saveAttempt).

### WorksheetRenderer
- Topic banner with cartoon/emoji header.
- "What you'll practice today" mini-revision section with 2-3 examples.
- Each selected section rendered with playful styling (use card layouts with pastel backgrounds varying by section).
- Footer: name/date/score boxes (printable).
- "Download PDF" button — uses `lib/pdf.ts` (html2canvas + jsPDF) to capture the renderer's div and produce A4 PDF.
- @media print CSS: hide sidebar/topbar, full width, page breaks between sections.

### LessonPlanRenderer
- Header card: Topic, Grade, Duration, Learning Objectives (bullets).
- Timeline table: columns Time | Activity | Materials | Teacher Notes.
- Differentiation block: 3 columns (Below level / At level / Above level).
- Assessment + homework block.
- "Download DOCX" button — for hackathon, downloads a styled .html file with .docx extension (Word will open it). True DOCX is post-hackathon.

### PresentationRenderer (THE BIG ONE — interactive slide deck)
- 16:9 aspect ratio, takes full right pane.
- Bottom controls: Prev | "Slide N of total" | Next | Fullscreen | Notes toggle.
- Right-side collapsible Teacher Notes drawer (slides off-screen when closed).
- Slide types (each is a sub-component in `SlideTypes.tsx`):
  - **title**: large topic, subtitle, owl mascot
  - **definition**: term + definition card + 1–2 visual hints
  - **image+caption**: image placeholder + caption
  - **two-column compare**: side-by-side cards
  - **I-Do / We-Do / You-Do**: animated 3-column reveal using Framer Motion (each column fades in on click)
  - **clickable quiz**: tappable card answers, tracks score across all quiz slides
  - **drag-and-drop sort**: items get dragged into buckets (Framer Motion drag)
  - **fill-in-the-blank**: input fields inline in text
  - **video embed**: YouTube embed by URL
  - **takeaway**: bulleted summary card
- Smooth slide transitions: Framer Motion `AnimatePresence` with slide-from-right.
- "Download PPTX" button — POST to `/presentation-to-pptx` with slides JSON, get back base64, trigger browser download.
- "Save to Library" auto-runs on first render of a freshly-generated presentation (calls `/sync-state` action: saveLibraryItem).

### Game renderers (one per gameStyle)
- **SortGame**: 4-6 items + 2-3 buckets. Drag items into buckets (Framer Motion).
- **MatchGame**: 2 columns of items. Click item on left, click match on right. Lines drawn with SVG.
- **SequenceGame**: items in a row, drag to reorder (Framer Motion Reorder).
- **FillBlankGame**: paragraph with input fields. Validate on submit.
- **QuizGame**: same QuizRenderer UI as Diagnostic.
- All games show: score + "Play Again" + "Save to Library" on completion.

## ZUSTAND STORE (`src/store/useStore.ts`)

Slices:
```ts
type Store = {
  // Hydrated from Airtable on app mount
  students: Student[];
  libraryItems: LibraryItem[];
  attempts: QuizAttempt[];
  
  // UI state
  activeStudentId: string | null;
  isHydrated: boolean;
  
  // Actions
  hydrate: () => Promise<void>;       // calls /sync-state action: getAll
  setActiveStudent: (id: string) => void;
  addStudent: (student: NewStudent) => Promise<void>;
  removeStudent: (id: string) => Promise<void>;
  saveLibraryItem: (item: NewLibraryItem) => Promise<void>;
  saveAttempt: (attempt: NewAttempt) => Promise<void>;
};
```

On `App.tsx` mount, call `useStore.getState().hydrate()` once. Show a full-screen splash ("Sheldon is waking up… 🦉") until `isHydrated` is true.

## API LAYER (`src/lib/api.ts`)

Single file exporting one function per webhook + a `callWebhook` helper that:
- Reads `VITE_N8N_BASE_URL` and `VITE_SHELDON_KEY`.
- If unset/placeholder → returns mock data from `lib/mockData.ts` after 1.5s delay.
- Otherwise POSTs to `${baseUrl}/${path}` with header `x-sheldon-key`.
- Timeout: 90s for `/presentation-generate` and `/presentation-to-pptx`, 30s for everything else.
- On non-2xx: throw with parsed error message.

Functions:
- `generateDiagnostic(payload) → DiagnosticResponse`
- `analyzeDiagnostic(payload) → AnalysisResponse`
- `generateAssessment(payload) → AssessmentResponse`
- `generateWorksheet(payload) → { html, json }`
- `generateLessonPlan(payload) → LessonPlanResponse`
- `generatePresentation(payload) → { slides: Slide[] }`
- `presentationToPptx(slides) → { downloadUrl, base64 }`
- `generateGame(payload) → { gameType, payload }`
- `syncState(action, payload) → any`  (the multiplex helper)

## TYPES (`src/lib/types.ts`)

```ts
export type Student = {
  id: string;
  name: string;
  grade: number;
  country: 'UK'|'Australia'|'India'|'USA'|'Singapore'|'NZ';
  subject: string;
  parentEmail?: string;
  avatarColor: string;
};

export type LibraryItemType = 
  | 'diagnostic' | 'assessment' | 'worksheet' 
  | 'lesson_plan' | 'presentation' | 'game';

export type LibraryItem = {
  id: string;
  type: LibraryItemType;
  title: string;
  studentId: string;
  payload: any;        // shape varies by type
  createdAt: string;   // ISO
};

export type QuizAttempt = {
  id: string;
  studentId: string;
  libraryItemId: string;
  score: number;       // 0-100
  skills: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  createdAt: string;
};

export type Slide = {
  type: 'title'|'definition'|'image_caption'|'compare'|'ido_wedo_youdo'
       |'quiz'|'drag_sort'|'fill_blank'|'video'|'takeaway';
  title?: string;
  body?: string;
  media?: string;
  notes?: string;
  // Per-type fields:
  definition?: { term: string; meaning: string };
  compare?: { left: { title: string; points: string[] }; right: { title: string; points: string[] } };
  iwy?: { iDo: string; weDo: string; youDo: string };
  quiz?: { question: string; options: string[]; correctIndex: number; explanation?: string };
  dragSort?: { items: string[]; buckets: { name: string; correctItems: string[] }[] };
  fillBlank?: { sentence: string; blanks: string[] };
  video?: { url: string; caption: string };
  takeaway?: { points: string[] };
};
```

## MOCK DATA (`src/lib/mockData.ts`)

Provide rich mock responses for every webhook so the app is fully demo-able offline. Mock diagnostic: 10 grade-6 maths questions on fractions. Mock presentation: 12 slides covering 6 different slide types so the renderer is testable. Mock students: 3 demo students with avatars.

## ACCESSIBILITY
- All interactive cards keyboard-focusable with visible focus ring (`focus:ring-2 focus:ring-purple/40`).
- Quiz answer cards have `aria-label` describing the option.
- Color never alone conveys meaning — also use icons + text.

## ERROR HANDLING
Every webhook call:
- Skeleton loader while pending.
- On error: ErrorState renderer with red left border, plain explanation, Retry button.
- Toast: "Something broke — try again."
- On retry: keep form values, just re-call.

## DELIVERABLES (build in this order)

1. Vite + React + TS scaffold + Tailwind + tailwind.config.ts with full color palette.
2. Fonts in index.html.
3. `lib/types.ts`, `lib/mockData.ts`, `lib/api.ts` with mock fallback.
4. Zustand store with hydrate() action.
5. App.tsx layout shell: Sidebar + TopBar + Outlet.
6. ActiveStudentSelector in TopBar.
7. Shared components: StatCard, GeneratorCard, TypePill, LoadingState, EmptyState, ErrorState, OwlMascot (placeholder SVG).
8. Dashboard page.
9. Students page + AddStudentModal.
10. Generate page with all 6 dynamic forms.
11. QuizRenderer + QuizResults.
12. WorksheetRenderer with print CSS.
13. LessonPlanRenderer.
14. PresentationRenderer with all 10 slide types + Framer Motion transitions.
15. All 5 Game renderers.
16. Library page with filters.
17. Progress page with Recharts + PDF export.
18. DESIGN.md and README.md.

## ACCEPTANCE CRITERIA

- App runs with `npm install && npm run dev` without env vars set (uses mock data).
- All copy follows voice rules. No "Submit", no "Loading…", no "Error 500".
- All 5 routes work end-to-end with mock data.
- Generate page successfully generates and renders artifacts for all 6 tools using mock data.
- Quiz flow: take quiz → submit → see results → save to progress (mock).
- Presentation: 12 mock slides render, Prev/Next/Fullscreen/Notes all work.
- Mobile responsive (test 360px).
- TypeScript strict, no `any` outside `payload: any` in LibraryItem.
- No icon library other than Lucide.
- No state library other than Zustand.

Build the entire project. Don't ask follow-up questions — make sensible choices and proceed.

===PROMPT END===
```

> **What to do once the AI finishes:** Test locally — `npm install && npm run dev`. All 5 pages should work in mock mode. Generate each artifact type. Take a mock quiz. Flip through a mock presentation. If anything looks off, ask the AI to fix that specific thing — don't restart the prompt.

---

## 6. PHASE 3 — BUILD THE 9 n8n WORKFLOWS

> Each replaces a function in `lib/api.ts`. Build all 9 in n8n. Activate each one and copy its Production webhook URL.

### Pattern for ALL workflows

Every workflow starts with:
1. **Webhook** trigger (POST, response mode = "Using 'Respond to Webhook' node")
2. **(Optional) IF** node to check `x-sheldon-key` header for security
3. Then the workflow body
4. **Respond to Webhook** at the end

For LLM workflows, the body uses an **HTTP Request** node calling Anthropic directly (more reliable than the n8n Anthropic node for structured JSON):
- URL: `https://api.anthropic.com/v1/messages`
- Method: POST
- Headers: `x-api-key: <Anthropic credential>`, `anthropic-version: 2023-06-01`, `Content-Type: application/json`
- Body (JSON):
  ```json
  {
    "model": "claude-sonnet-4-5",
    "max_tokens": 8000,
    "system": "<from APPENDIX C>",
    "messages": [{ "role": "user", "content": "<built from request body>" }]
  }
  ```
- After response: a Code node parses `data.content[0].text` as JSON.

### Workflow 1 — `/diagnostic-generate`
**Path:** `diagnostic-generate` · **Method:** POST

**Input:** `{ studentId, name, grade, region, subject, goal, numQuestions }`

**Nodes:**
1. Webhook
2. **HTTP Request** → Anthropic. System + user prompt from APPENDIX C section "Diagnostic Generate".
3. **Code (parse Claude JSON)**:
   ```js
   const text = $json.content[0].text;
   const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || [null, text];
   const parsed = JSON.parse(jsonMatch[1]);
   return [{ json: { quizId: 'q_' + Date.now(), ...parsed } }];
   ```
4. **Airtable Create** (in `GeneratorRuns` table) — log this run with the prompt, response, latency.
5. **Respond to Webhook** → return `{ quizId, questions }`.

### Workflow 2 — `/diagnostic-analyze`
**Path:** `diagnostic-analyze` · **Method:** POST

**Input:** `{ quizId, answers: [{ questionId, chosenIndex }], questions: [...] }`

**Nodes:**
1. Webhook
2. **Code** — calculate raw score per skill from answers + questions (no LLM yet for speed).
3. **HTTP Request** → Anthropic. System + user prompt from APPENDIX C section "Diagnostic Analyze". User content includes the score data + per-skill stats.
4. **Code** — parse Claude JSON for strengths/weaknesses/recommendations.
5. **Respond to Webhook** → return `{ score, skills, strengths, weaknesses, recommendations }`.

### Workflow 3 — `/assessment-generate`
**Path:** `assessment-generate`

**Input:** `{ topics, subtopics, timed, totalTime, marks, numQ, difficulty, grade, subject }`

**Nodes:**
1. Webhook
2. HTTP Request → Anthropic (prompt from APPENDIX C "Assessment Generate")
3. Code → parse JSON
4. Airtable log
5. Respond → `{ questions: [{ id, text, options, correctIndex, marks, explanation }] }`

### Workflow 4 — `/worksheet-generate`
**Path:** `worksheet-generate`

**Input:** `{ topic, subtopic, type, sections, grade, subject }`

**Nodes:**
1. Webhook
2. HTTP Request → Anthropic (prompt from APPENDIX C "Worksheet Generate"). Returns structured JSON describing each section (NOT raw HTML — frontend renders).
3. Code → parse JSON
4. Respond → `{ json: { topic, sections: [...] } }`

### Workflow 5 — `/lessonplan-generate`
**Path:** `lessonplan-generate`

**Input:** `{ topic, subtopic, duration, grade, subject }`

**Nodes:**
1. Webhook
2. HTTP Request → Anthropic (prompt from APPENDIX C "Lesson Plan Generate")
3. Code → parse JSON
4. Respond → `{ json: { objectives, timeline, differentiation, assessment, homework } }`

### Workflow 6 — `/presentation-generate`
**Path:** `presentation-generate`

**Input:** `{ topic, subtopic, duration, difficulty, grade, subject }`

**Nodes:**
1. Webhook
2. HTTP Request → Anthropic (prompt from APPENDIX C "Presentation Generate"). `max_tokens: 16000`.
3. Code → parse JSON, validate slide structure
4. Airtable log
5. Respond → `{ slides: [{ type, title, body, ... }] }`

### Workflow 7 — `/presentation-to-pptx`
**Path:** `presentation-to-pptx`

**Input:** `{ slides: Slide[] }`

**Nodes:**
1. Webhook
2. **Code (JavaScript)** — uses `pptxgenjs` (n8n has it bundled in code nodes via `require`):
   ```js
   const pptxgen = require("pptxgenjs");
   const pptx = new pptxgen();
   pptx.layout = "LAYOUT_WIDE";
   
   for (const slide of $input.first().json.slides) {
     const s = pptx.addSlide();
     s.background = { color: "F5F3FF" };
     if (slide.title) {
       s.addText(slide.title, {
         x: 0.5, y: 0.5, w: 12, h: 1,
         fontSize: 36, bold: true, color: "1B2A4E",
         fontFace: "Plus Jakarta Sans"
       });
     }
     if (slide.body) {
       s.addText(slide.body, {
         x: 0.5, y: 2, w: 12, h: 5,
         fontSize: 18, color: "2A2E36"
       });
     }
     if (slide.notes) s.addNotes(slide.notes);
   }
   
   const base64 = await pptx.write({ outputType: "base64" });
   return [{ json: { base64, filename: `presentation-${Date.now()}.pptx` } }];
   ```
3. Respond → `{ base64, filename }`

> **If `require('pptxgenjs')` is not available in your n8n install** (depends on Railway template), switch the Code node language to "Run external command" and shell out to a Python pptxgen call, OR fall back to returning a base64-encoded ZIP of generated slide HTML files. For hackathon demo, the JavaScript approach almost always works on Railway's official n8n template.

### Workflow 8 — `/game-generate`
**Path:** `game-generate`

**Input:** `{ topic, subtopic, gameStyle, grade, subject }`

**Nodes:**
1. Webhook
2. HTTP Request → Anthropic (prompt from APPENDIX C "Game Generate" — branches on gameStyle)
3. Code → parse JSON
4. Respond → `{ gameType, payload }`

### Workflow 9 — `/sync-state` (the multiplexer)
**Path:** `sync-state`

**Input:** `{ action: 'getAll' | 'createStudent' | 'deleteStudent' | 'saveLibraryItem' | 'saveAttempt', payload?: any }`

**Nodes:**
1. Webhook
2. **Switch** node on `{{ $json.body.action }}` — 5 outputs.
3. Each branch:
   - `getAll` → 3 parallel Airtable List nodes (Students, LibraryItems, QuizAttempts) → Merge → Respond.
   - `createStudent` → Airtable Create in Students → Respond with new record.
   - `deleteStudent` → Airtable Delete → Respond `{ success: true }`.
   - `saveLibraryItem` → Airtable Create in LibraryItems → Respond.
   - `saveAttempt` → Airtable Create in QuizAttempts → Respond.

**Why one workflow not 5:** fewer URLs to manage, one auth credential, easier to extend.

---

## 7. PHASE 4 — WIRE IT ALL TOGETHER

### Step 4.1 — Add the env vars to Vercel

After your AI builder finishes, push the repo to GitHub. Vercel auto-deploys.

In Vercel → your project → Settings → Environment Variables. Add:

```
VITE_N8N_BASE_URL=https://your-n8n.up.railway.app/webhook
VITE_SHELDON_KEY=<any random string, set the same in n8n IF nodes if you added auth>
```

> **Note the `/webhook` suffix** — n8n production URLs are `https://<host>/webhook/<path>`. So the base ends in `/webhook` and your `lib/api.ts` appends each path.

Trigger a redeploy.

### Step 4.2 — Sanity check each webhook

Use curl or Postman:

```bash
curl -X POST https://your-n8n.up.railway.app/webhook/sync-state \
  -H "Content-Type: application/json" \
  -d '{"action":"getAll"}'
# Expected: { students: [...], libraryItems: [...], attempts: [...] }

curl -X POST https://your-n8n.up.railway.app/webhook/diagnostic-generate \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","grade":7,"region":"UK","subject":"Maths","goal":"Curriculum Alignment","numQuestions":5}'
# Expected: { quizId: "...", questions: [...] }
```

If any 404s: workflow isn't activated. If 500s: check n8n Executions tab for the failing node.

### Step 4.3 — Final end-to-end test

1. Open the Vercel URL.
2. App should hydrate from Airtable (no mock banner).
3. Add a new student → check Airtable, row appears.
4. Click "Diagnostic Test" → fill form → "Generate Diagnostic" → quiz appears in right pane within 30s.
5. Take the quiz → see results screen → check Airtable QuizAttempts, row appears.
6. Open Library → see saved item.
7. Open Progress → see attempt + chart.
8. Generate a Presentation → flip through slides → click "Download PPTX" → file downloads.

---

## 8. PHASE 5 — DEMO-DAY CHECKLIST

### Morning of demo

- [ ] End-to-end smoke test on the production URL (NOT localhost).
- [ ] Open n8n Executions tab in a backup tab — your debug window if something fails live.
- [ ] Open Airtable in a tab — show judges the data is real.
- [ ] Confirm Anthropic API has credit left: https://console.anthropic.com/settings/billing.
- [ ] Confirm Railway has credit left.
- [ ] **Record a 90-second screen recording** of the working flow as backup. If demo network fails, you have a video.
- [ ] Have 1 demo student pre-loaded with 2-3 attempts already in Progress (so the chart looks real, not empty).
- [ ] Charge laptop. Tether to phone hotspot if venue WiFi is unreliable.

### Demo script (90 seconds)

1. (10s) "This is Sheldon's Library — the teacher dashboard. Today, building a class plan takes a tutor 30 minutes per student. We compress that to 30 seconds."
2. (15s) Pick a student (Aarav Sharma · Grade 7 · Maths).
3. (15s) Click **Diagnostic Test** → set 10 questions → Generate. *"Sheldon is thinking…" → 10 grade-6 questions appear.*
4. (15s) Take 3 questions live. Submit. Show the analysis screen — strengths, weaknesses, recommendations.
5. (15s) Switch to **Presentation** tool → topic "Fractions" → Generate → flip 3 slides showing different types (title, I-Do/We-Do/You-Do, quiz slide).
6. (10s) Click "Download PPTX" — file downloads.
7. (10s) Open Progress page — show the trajectory chart, click "Export PTM Report".
8. *"30 seconds per artifact. Every artifact is interactive. Every score is tracked. That's Sheldon's Library."*

---

## 9. APPENDIX A — AIRTABLE SCHEMA

### Table: `Students`
| Field | Type | Notes |
|---|---|---|
| `student_id` | Autonumber | Primary field, formatted as "S-{id}" via formula |
| `name` | Single line text | |
| `grade` | Number | 1–12 |
| `country` | Single select | UK, Australia, India, USA, Singapore, NZ |
| `subject` | Single line text | |
| `parent_email` | Email | optional |
| `avatar_color` | Single line text | hex like #B6F2D7 |
| `created_at` | Created time | |

### Table: `LibraryItems`
| Field | Type | Notes |
|---|---|---|
| `item_id` | Autonumber | Primary field |
| `type` | Single select | diagnostic, assessment, worksheet, lesson_plan, presentation, game |
| `title` | Single line text | |
| `student` | Link | → Students |
| `payload` | Long text | JSON.stringify of the artifact |
| `created_at` | Created time | |

### Table: `QuizAttempts`
| Field | Type | Notes |
|---|---|---|
| `attempt_id` | Autonumber | Primary field |
| `student` | Link | → Students |
| `library_item` | Link | → LibraryItems |
| `score` | Number | 0–100, percent format |
| `skills_json` | Long text | JSON of per-skill scores |
| `strengths` | Long text | JSON array |
| `weaknesses` | Long text | JSON array |
| `recommendations` | Long text | JSON array |
| `analysis_text` | Long text | Claude's prose analysis |
| `created_at` | Created time | |

### Table: `GeneratorRuns` (audit log — optional but useful for debugging)
| Field | Type | Notes |
|---|---|---|
| `run_id` | Autonumber | Primary field |
| `tool_type` | Single select | Same options as LibraryItems.type |
| `request_body` | Long text | JSON |
| `response_body` | Long text | JSON |
| `latency_ms` | Number | |
| `success` | Checkbox | |
| `error_message` | Long text | |
| `created_at` | Created time | |

---

## 10. APPENDIX B — WEBHOOK CONTRACTS

### `POST /webhook/diagnostic-generate`
**Request:**
```json
{
  "studentId": "S-001",
  "name": "Aarav Sharma",
  "grade": 7,
  "region": "UK",
  "subject": "Maths",
  "goal": "Curriculum Alignment",
  "numQuestions": 10
}
```
**Response:**
```json
{
  "quizId": "q_1714512345",
  "questions": [
    {
      "id": "q1",
      "text": "What is 3/4 + 1/2?",
      "options": ["1 1/4", "4/6", "1/2", "5/4"],
      "correctIndex": 0,
      "skill": "Fractions"
    }
  ]
}
```

### `POST /webhook/diagnostic-analyze`
**Request:**
```json
{
  "quizId": "q_1714512345",
  "answers": [{ "questionId": "q1", "chosenIndex": 0 }],
  "questions": [/* full questions array from generate response */]
}
```
**Response:**
```json
{
  "score": 70,
  "skills": { "Fractions": 80, "Decimals": 50 },
  "strengths": ["Confident with fraction addition", "Strong number sense"],
  "weaknesses": ["Struggles with decimal-fraction conversion"],
  "recommendations": ["Practice 10 mins/day on decimals", "Use visual fraction strips"],
  "analysisText": "Aarav shows..."
}
```

### `POST /webhook/assessment-generate`
**Request:**
```json
{
  "topics": ["Fractions"],
  "subtopics": ["Addition", "Subtraction"],
  "timed": true,
  "totalTime": 30,
  "marks": 20,
  "numQ": 10,
  "difficulty": "Medium",
  "grade": 7,
  "subject": "Maths"
}
```
**Response:**
```json
{
  "questions": [
    { "id": "q1", "text": "...", "options": [...], "correctIndex": 2, "marks": 2, "explanation": "..." }
  ]
}
```

### `POST /webhook/worksheet-generate`
**Request:** `{ topic, subtopic, type, sections[], grade, subject }`
**Response:** `{ json: { topic, intro, sections: [{ name, items: [...] }] } }`

### `POST /webhook/lessonplan-generate`
**Request:** `{ topic, subtopic, duration, grade, subject }`
**Response:**
```json
{
  "json": {
    "topic": "...",
    "objectives": ["..."],
    "timeline": [{ "time": "0–5 min", "activity": "...", "materials": "...", "notes": "..." }],
    "differentiation": { "below": "...", "at": "...", "above": "..." },
    "assessment": "...",
    "homework": "..."
  }
}
```

### `POST /webhook/presentation-generate`
**Request:** `{ topic, subtopic, duration, difficulty, grade, subject }`
**Response:** `{ slides: Slide[] }` (Slide type per `lib/types.ts`)

### `POST /webhook/presentation-to-pptx`
**Request:** `{ slides: Slide[] }`
**Response:** `{ base64: "UEsDBBQ...", filename: "presentation-1714512345.pptx" }`

### `POST /webhook/game-generate`
**Request:** `{ topic, subtopic, gameStyle, grade, subject }`
**Response:** `{ gameType: "sort", payload: { items: [...], buckets: [...] } }`

### `POST /webhook/sync-state`
**Request:** `{ action, payload? }`
**Response:** varies by action — see Workflow 9.

---

## 11. APPENDIX C — CLAUDE PROMPTS (THE LLM SECRET SAUCE)

> Paste each system prompt into the corresponding n8n HTTP Request node's body. **Critical:** every prompt ends with "Return ONLY valid JSON inside a ```json fence. No prose before or after."

### Diagnostic Generate

**System:**
```
You are Sheldon, an expert tutor and curriculum specialist for Super Sheldon EdTech. You generate diagnostic tests that identify learning gaps for a student.

Rules:
- The test covers the PREVIOUS year's syllabus (so a Grade 7 student gets Grade 6 content) to surface gaps.
- Match the region's curriculum: UK = National Curriculum, Australia = ACARA V9, India = CBSE, USA = Common Core, Singapore = MOE, NZ = NZ Curriculum.
- Each question targets ONE skill. Distribute questions across 4-5 distinct skills.
- Difficulty mix: 30% easy, 50% medium, 20% hard.
- Each question has 4 options, exactly ONE correct.
- Make options plausible — wrong answers should reflect common student mistakes.

Return ONLY valid JSON inside a ```json fence:
{
  "questions": [
    {
      "id": "q1",
      "text": "...",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0,
      "skill": "Fractions"
    }
  ]
}
```

**User:**
```
Generate a {numQuestions}-question diagnostic test for:
Student: {name}, Grade {grade}, {region}, Subject: {subject}
Parent goal: {goal}

Test the PREVIOUS year's content (Grade {grade-1}).
```

### Diagnostic Analyze

**System:**
```
You are Sheldon, analyzing a student's diagnostic test results to give the parent and tutor a clear, actionable read.

Given per-skill scores, write:
- 2-3 STRENGTHS (specific, encouraging, max 12 words each)
- 2-3 WEAKNESSES (specific but kind — never use "weak" or "bad", say "needs more practice with…")
- 3-4 RECOMMENDATIONS (concrete, time-bounded, max 15 words each)
- One ANALYSIS paragraph (3-4 sentences, warm tutor voice, references actual skills/scores)

Return ONLY valid JSON inside a ```json fence:
{
  "strengths": ["..."],
  "weaknesses": ["..."],
  "recommendations": ["..."],
  "analysisText": "..."
}
```

### Assessment Generate

**System:**
```
You are Sheldon, generating a graded assessment.

Rules:
- Match difficulty: Easy = recall/recognition, Medium = application, Hard = analysis/synthesis.
- Distribute marks evenly unless the difficulty mix demands otherwise.
- Each question has an EXPLANATION (1-2 sentences) shown after submission.

Return ONLY valid JSON inside a ```json fence:
{
  "questions": [
    {
      "id": "q1",
      "text": "...",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 2,
      "marks": 2,
      "explanation": "..."
    }
  ]
}
```

### Worksheet Generate

**System:**
```
You are Sheldon, generating a worksheet for a student.

Rules:
- Tone: warm, playful but precise. Like a great tutor.
- For each section requested, include 4-6 items.
- Add a brief intro: "What you'll practice today" (1-2 sentences).
- Match the grade level — never above.

Return ONLY valid JSON inside a ```json fence:
{
  "topic": "...",
  "intro": "...",
  "sections": [
    {
      "name": "MCQs",
      "items": [
        { "question": "...", "options": ["A","B","C","D"], "answer": "A" }
      ]
    },
    {
      "name": "Fill in the blanks",
      "items": [
        { "sentence": "The capital of ___ is Paris.", "answer": "France" }
      ]
    }
  ]
}
```

### Lesson Plan Generate

**System:**
```
You are Sheldon, an experienced classroom teacher writing a 1:1 tutoring lesson plan.

Rules:
- Timeline must add up to the requested duration.
- Use I-Do / We-Do / You-Do gradual release.
- Differentiation block must be specific (not "give harder questions" — say WHAT).
- Homework should be 10-15 minutes.

Return ONLY valid JSON inside a ```json fence:
{
  "topic": "...",
  "objectives": ["..."],
  "timeline": [
    { "time": "0–5 min", "activity": "...", "materials": "...", "notes": "..." }
  ],
  "differentiation": {
    "below": "...",
    "at": "...",
    "above": "..."
  },
  "assessment": "...",
  "homework": "..."
}
```

### Presentation Generate

**System:**
```
You are Sheldon, building a 1:1 tutoring class presentation.

MANDATORY 10-section pedagogical flow (every presentation MUST include all in this order):
1. Icebreaker / Rapport (1 slide)
2. Warm-up (1-2 slides)
3. Learning Objective (1 slide)
4. Definition (1-2 slides, type: definition)
5. Explanation with examples (3-5 slides, mix of definition / image_caption / compare)
6. Activity (3 slides, type: ido_wedo_youdo)
7. Skill Task (1-2 slides)
8. Quick Assessment (5 slides, all type: quiz)
9. Key Takeaways (1 slide, type: takeaway)
10. Closure HOTS (1 slide)

Slide types you can use: title, definition, image_caption, compare, ido_wedo_youdo, quiz, drag_sort, fill_blank, video, takeaway.

Aim for 15-20 slides total for a 60-minute class.

Each slide MUST have:
- type
- title (or term for definition slides)
- notes (teacher speaker notes, 2-4 sentences — what to say while showing this slide)

Return ONLY valid JSON inside a ```json fence:
{
  "slides": [
    { "type": "title", "title": "...", "body": "...", "notes": "..." },
    { "type": "definition", "title": "...", "definition": { "term": "...", "meaning": "..." }, "notes": "..." },
    { "type": "ido_wedo_youdo", "title": "...", "iwy": { "iDo": "...", "weDo": "...", "youDo": "..." }, "notes": "..." },
    { "type": "quiz", "title": "...", "quiz": { "question": "...", "options": ["A","B","C","D"], "correctIndex": 0, "explanation": "..." }, "notes": "..." }
  ]
}
```

### Game Generate

**System:**
```
You are Sheldon, designing a quick interactive learning game.

Game styles and their JSON shapes:

For "sort":
{ "gameType": "sort", "payload": { "items": ["..."], "buckets": [{ "name": "...", "correctItems": ["..."] }] } }

For "match":
{ "gameType": "match", "payload": { "pairs": [{ "left": "...", "right": "..." }] } }

For "sequence":
{ "gameType": "sequence", "payload": { "items": ["..."], "correctOrder": [0,1,2,3] } }

For "fill-blank":
{ "gameType": "fill-blank", "payload": { "sentence": "...", "blanks": ["...","..."] } }

For "quiz":
{ "gameType": "quiz", "payload": { "questions": [{ "text": "...", "options": ["A","B","C","D"], "correctIndex": 0 }] } }

Rules:
- 5-8 items / 4-6 questions per game.
- Match grade level.

Return ONLY valid JSON inside a ```json fence in the shape above.
```

---

## 12. APPENDIX D — DESIGN.md (paste into repo root unchanged)

```markdown
# Sheldon's Library v2 — Design Core

## 1. Brand
- App: Sheldon's Library v2
- Mascot: Sheldon the Owl (Pixar-style, glasses)
- Voice: warm tutor-friend. Short sentences. No jargon. Encourage, don't scold.

## 2. Tokens

```json
{
  "color": {
    "navy": "#1B2A4E",
    "teal": "#0FA3A3",
    "coral": "#FF6B6B",
    "gold": "#F4B400",
    "purple": "#6C5CE7",
    "bgLight": "#F5F3FF",
    "card": {
      "diagnostic": "#B6F2D7",
      "assessment": "#FFD9B3",
      "worksheet":  "#FFE066",
      "lessonplan": "#C9B8FF",
      "presentation": "#B3E0FF",
      "games":      "#FFC0DD"
    }
  },
  "font": {
    "display": "\"Plus Jakarta Sans\", Inter, system-ui, sans-serif",
    "body":    "Inter, system-ui, sans-serif"
  },
  "radius": { "sm":"6px","md":"10px","lg":"12px","xl":"16px","2xl":"24px","full":"9999px" }
}
```

## 3. Type Scale
| Token | Size | Weight | Use |
|---|---|---|---|
| display | 2.5–3.5rem | 800 | hero |
| h1 | 2–2.5rem | 700 | page title |
| h2 | 1.5–1.875rem | 700 | section |
| h3 | 1.25rem | 600 | card title |
| body | 1rem | 400 | default |
| pill | 0.75rem | 700 | UPPERCASE labels |

## 4. Components
- Primary button: rounded-xl, purple bg, white text
- Card: rounded-2xl, white, soft shadow
- Pastel generator card: rounded-2xl, color from card palette, hover scale
- Type pill: rounded-full, color/10 bg, color text, uppercase tracking

## 5. Voice
| Context | Say | Don't |
|---|---|---|
| Empty | "Nothing here yet — add one." | "No data found." |
| Loading | "Sheldon is thinking…" | "Loading…" |
| Error | "Something broke — try again." | "Error 500" |
| Success | "Saved!" / "Generated!" | "Operation successful" |
| Confirm delete | "This can't be undone. Remove?" | "Are you sure?" |

## 6. Accessibility
- Contrast ≥ 4.5:1 (use navy on white, not navy/40).
- Every input has a label. Errors in text, not color alone.
- Focus ring: ring-2 ring-purple/40.
- Alt on every image. aria-label on icon-only buttons.

## 7. Hard Rules
- Backend logic lives in n8n. Never in frontend.
- Anthropic API key lives in n8n credentials. Never in repo.
- No login, no auth, no analytics, no localStorage.
- Airtable is the source of truth.

v2.0 · Sheldon's Library · Sheldon Labs
```

---

## END

That's the full guide. **Stack is locked. Don't substitute.**

**Order to follow:**
1. Phase 1 manual setup (~90 min)
2. Paste the master prompt into Emergent (~20-40 min wait + review)
3. While Emergent is building, build the 9 n8n workflows in parallel (~3 hrs)
4. Wire env vars in Vercel (~10 min)
5. End-to-end test (~30 min)
6. Demo prep + record backup video (~1 hr)

If anything in Phases 3–5 fails: n8n **Executions** tab shows the exact node and field that errored.

Good luck. Build it. Ship it. Demo it. 🦉
