# Sheldon's Library v2

AI teacher co-pilot for K-12. A tutor picks a student, picks a tool, and gets an
**interactive, grade-calibrated** AI-generated artifact in under two minutes —
diagnostic quiz, assessment, worksheet, lesson plan, presentation deck, or game.

Live: **https://sheldon-library.vercel.app**

---

## Table of Contents

1. [What this is](#what-this-is)
2. [Architecture at a glance](#architecture-at-a-glance)
3. [Stack](#stack)
4. [Key features](#key-features)
5. [The four-tier AI fallback chain](#the-four-tier-ai-fallback-chain)
6. [Templated content system](#templated-content-system)
7. [Grade calibration](#grade-calibration)
8. [Topic validation](#topic-validation)
9. [Admin / observability](#admin--observability)
10. [Project structure](#project-structure)
11. [Quick start (mock mode)](#quick-start-mock-mode)
12. [Going live](#going-live)
13. [Environment variables](#environment-variables)
14. [Routes](#routes)
15. [Generator tools](#generator-tools)
16. [n8n workflow structure](#n8n-workflow-structure)
17. [Recent changes](#recent-changes)
18. [Stack rules](#stack-rules)

---

## What this is

A teacher opens the app, selects an active student (whose grade, region, and
subject are locked in), picks one of six tools, fills a brief, and presses
Generate. The frontend ships the brief to n8n. n8n runs a Build Prompt node
that bakes in regional curriculum + Bloom depth + concrete BAD/GOOD examples
for the student's exact grade, sends that to the model, parses the response
through deterministic auto-repair, wraps it in a `template-v1` envelope, and
sends it back. The frontend renders the result in an iframe-hosted templated
HTML view (or a React renderer for legacy items) — fully interactive and
downloadable as HTML or PPTX.

If anything goes wrong — Claude over budget, Hugging Face rate-limited,
Groq down — the chain silently rotates through three more providers before
giving up. The teacher sees a single friendly "tap retry or browse the
library" panel; every failure (and success) is captured in a hidden `/admin`
event log only the operator can reach.

---

## Architecture at a glance

```
   ┌────────────────────┐
   │  Vercel (Frontend) │  Vite + React 18 + TS + Tailwind
   │                    │
   │  • Generate form   │
   │  • Iframe renderer │
   │  • Admin event log │  → localStorage (per-browser)
   └─────────┬──────────┘
             │ POST  /<generator>-generate
             │       /<topic-validate>
             │       /<sync-state>
             ▼
   ┌────────────────────┐
   │   Railway (n8n)    │  Workflow JSON in /n8n/workflows/
   │                    │
   │  Webhook → Build Prompt → Claude → HF → Groq → Haiku → Parse → Respond
   │                                       (4-tier failover chain)
   │                                       Parse auto-repairs payload
   └─────────┬──────────┘
             │ HTTPS
             ▼
   ┌────────────────────────────────────────────┐
   │  AI Providers (in order tried per request) │
   │                                            │
   │  1. Anthropic — Claude Sonnet 4.5 (paid)   │
   │  2. Hugging Face — Llama 3.3 70B (free)    │
   │  3. Groq — Llama 3.3 70B (free)            │
   │  4. Anthropic — Claude Haiku 4.5 (cheap)   │
   └────────────────────────────────────────────┘
```

The frontend NEVER holds a model API key. All AI keys live in n8n credentials
or env vars (`GROQ_API_KEY` is the one env var; Anthropic and HF use n8n
credential records).

---

## Stack

### Frontend
- **Vite + React 18 + TypeScript (strict)** — fingerprinted bundle
- **Tailwind CSS** — utility-first, dark mode supported
- **Zustand** — single store, hydrated from n8n on mount
- **React Router v6** — 6 routes (`/admin` is hidden, direct-URL only)
- **Framer Motion** — page transitions + micro-animations
- **Lucide** — sole icon library
- **Recharts** — Progress page score chart
- **pptxgenjs** — client-side PPTX export of templated presentations
- **jsPDF + html2canvas** — PDF export for Progress reports

### Backend (n8n on Railway)
- **n8n workflow JSON** — two files in `/n8n/workflows/`:
  - `sync-state.json` — students / library items / quiz attempts persistence
  - `llm-generators.json` — every AI flow (Diagnostic, Assessment, Worksheet,
    LessonPlan, Presentation, Game, Analyze, Topic-Validate)

### AI providers
- **Anthropic** — Claude Sonnet 4.5 (primary), Claude Haiku 4.5 (retry tier)
- **Hugging Face Inference** — Llama 3.3 70B, Qwen 2.5 72B, Mistral Nemo, DeepSeek V3
- **Groq** — Llama 3.3 70B Versatile, Llama 3.1 8B Instant (fully free; 14,400 req/day on 8B)

---

## Key features

### 1. Six AI-powered generators

| Tool | Output template | Backed by |
|---|---|---|
| **Diagnostic Test** | `quiz-live.html` | grade-1 baseline MCQs with per-skill tags + analysis screen |
| **Assessment** | `quiz-live.html` | timed/untimed marked MCQs with passing %, per-question explanations |
| **Worksheet** | `worksheet-print.html` | A4 printable, 6 section types, optional answer key |
| **Lesson Plan** | `lessonplan-timeline.html` | 10-section timeline summing to requested minutes |
| **Presentation** | `presentation-classic.html` (G1-6) / `presentation-academic.html` (G7-12) | 40-50 slides, 17 slide types, teacher notes |
| **Game** | `game-arcade.html` | 5 game styles: sort / match / sequence / fill-blank / quiz |

### 2. Grade-calibrated content

Every Build Prompt prepends a calibration block to the system prompt with:
- The exact target grade (no range)
- The regional curriculum framework (UK National / US Common Core / ACARA / NCERT-CBSE / Singapore MOE / NZ)
- The Bloom's-taxonomy depth target for that band
- A scope summary of what that grade actually covers in that subject
- **Concrete BAD / GOOD example pairs** per (grade, subject) so the AI sees what "Grade N depth" looks like
- An anti-rationalisation rule that forbids "stepping-stone" undershooting

See [`gradeCalibration()` inside every Build Prompt node](n8n/workflows/llm-generators.json).

### 3. Smart topic validation

Two layers, both advisory (never silently mutate the payload):

- **Instant client-side heuristic** (`src/lib/topic-heuristic.ts`) — keyword
  banks for 9 subject categories. Catches obvious mismatches like "python"
  entered as a Maths topic. **Hard-blocks** Generate with an Override
  escape hatch.
- **Debounced Groq Llama validator** (`POST /topic-validate`) — runs ~800ms
  after the teacher stops typing. Catches grade-appropriateness ("addition"
  for Grade 11). **Soft warning only.** Fails open if Groq is unreachable.

### 4. Four-tier AI fallback chain

See dedicated section below.

### 5. Templated content system

See dedicated section below.

### 6. Hidden admin event log

See dedicated section below.

### 7. Auto-repair Parse nodes

Each generator's Parse node deterministically fixes common AI mistakes
before validating: clamps `correctIndex` to valid range, dedupes options,
drops empty questions, defaults missing teacher notes, infers missing
marks from difficulty. Throws clean errors only when too few items
survive (e.g. `< 5 questions`).

### 8. Locked student context

Student / Grade / Region / Subject on the Generate page are read-only —
sourced exclusively from the active student profile in the Students page.
Prevents the teacher from accidentally generating for the wrong grade.

---

## The four-tier AI fallback chain

For every generator in `llm-generators.json`:

```
Build Prompt
     ↓
Claude Sonnet 4.5      ✓ → Parse → Respond
     ↓ (failure)
Hugging Face Llama     ✓ → Parse → Respond
     ↓ (failure)
Groq Llama 3.3 70B     ✓ → Parse → Respond
     ↓ (failure)
Claude Haiku 4.5       ✓ → Parse → Respond
     ↓ (failure)
Build Error (only NOW does the teacher see "couldn't fetch that one")
```

**Why the loop back to Claude at the end?** When the teacher explicitly
picks an HF model in the UI, the primary Sonnet call is force-failed
(`model: 'force-fallback-trigger'`) to skip straight to HF. If both HF
and Groq then go down, the tier-4 Haiku attempt is the **first actual
Claude attempt** for that request — so it's worth doing, not redundant.

**Server timeouts** on each HTTP node: 180s. **Frontend timeouts**: 180s
on all six generators.

---

## Templated content system

Every AI generation returns a `format: "template-v1"` payload with the
template ID, theme ID, subject ID, and the content shape. The frontend
fetches the matching HTML from `/public/templates/` (cache-busted with
`?v=N`), substitutes `__TOKEN__` placeholders for theme colors / fonts /
logo / serialised content JSON, and mounts the result in an iframe.

### Templates (6 total)

- `presentation-classic.html` — playful, mascots, bright pastels (Grades 1-6)
- `presentation-academic.html` — dark navy, serif Fraunces, gradient blobs (Grades 7-12)
- `worksheet-print.html` — A4 print-friendly, six section types
- `lessonplan-timeline.html` — vertical timeline with teacher script
- `quiz-live.html` — diagnostic + assessment, with navigator + scorecard
- `game-arcade.html` — 5 game styles in one template

Every template:
- Wraps its IIFE in a `try { ... } catch (err) { fatal(err.message) }` so any
  silent crash surfaces as a visible "Could not load" panel.
- Defensively filters its payload (drops malformed slides / questions /
  sections so the AI can't poison a render with one bad item).
- Has an empty-state fallback panel if everything is filtered out.

### Theme system

6 themes in `src/lib/themes.ts`: **garden**, **space**, **theater**, **ocean**,
**lab**, **studio**. Each defines palette (primary, accent, bg gradient, ink),
fonts (display + body), and a hand-drawn SVG mascot pair (`mascot1`, `mascot2`).

### Subject system

9 subjects in `src/lib/subjects.ts`: math, science, english, language, history,
geography, art, music, general. Each contributes inline SVG motif overlays
that float subtly in the slide background (numbers/π for maths, atoms for
science, books for english, etc).

### Server-side selection engine

Inside each Build Prompt:
- `guessSubject(text)` → subject ID from topic + subject input keywords
- `pickTheme(subjectId, hash)` → theme ID from subject-aware pool, keyed on
  hash of `(topic | subject | student | grade | kind)`. Same combo = stable,
  different combos = real variety. No "always-garden" bias.

### Iconize helper

Inside each presentation template's IIFE, an `iconize(name, fallback)`
function maps ~90 word-icon names (`check`, `checkmark`, `pencil`, `target`,
`lightbulb`, `rocket`, etc) to their corresponding emoji glyphs. Prevents
the literal word "checkmark" from overflowing a 36×36 badge when the AI
emits a word instead of an emoji.

---

## Grade calibration

Every Build Prompt (Diagnostic, Assessment, Worksheet, LessonPlan,
Presentation, Game) calls a shared `gradeCalibration(grade, subject,
region, subjectId)` helper that emits the following block at the top of
the system prompt:

```
═══════════════════════════════════════════
GRADE CALIBRATION — CRITICAL, READ FIRST
═══════════════════════════════════════════
TARGET GRADE: Grade N. Match exactly. Not easier. Not harder.
CURRICULUM: UK National Curriculum (Year N).
SCOPE FOR THIS GRADE: <topic list from MATH / SCIENCE / ENGLISH map>
COGNITIVE DEPTH (Bloom's): <Remember+Understand | Understand+Apply | Apply+Analyze | Analyze+Evaluate+Create>

CONCRETE CALIBRATION EXAMPLES FOR GRADE N:
  ❌ TOO EASY — DO NOT PRODUCE: "<bad example with explanation>"
  ✅ CORRECTLY PITCHED: "<good example>"

COMMON FAILURE MODE: ... rationalising basic questions as "stepping stones"
to the real grade-level topic. Reject that rationalisation.

SELF-CHECK BEFORE EMITTING each item: could a Grade (N-3) student answer
this without effort? If yes, IT IS TOO EASY.
═══════════════════════════════════════════
```

**Coverage**:
- Maths grades 1–12 (12 BAD/GOOD pairs)
- Science grades 4, 7, 11
- English grades 4, 7, 11
- Other (grade, subject) combos fall back to the scope line + Bloom target.

**Diagnostic deliberately calibrates one grade below the student** (its
design intent — surface gaps in last year's material). Every other
generator calibrates to the student's exact grade.

---

## Topic validation

### Frontend (instant + debounced two-layer)

1. **`quickTopicCheck(topic, subject)`** in `src/lib/topic-heuristic.ts`.
   Runs synchronously, no network call. 9 subject keyword banks. Returns
   `{ ok: false, reason }` only when the topic clearly belongs to a
   different subject AND doesn't match the chosen one (so "graphs" — a
   maths + computer-science term — doesn't false-positive).

2. **`/topic-validate` webhook** — debounced 800ms, fires after the
   instant check passes. Uses Groq Llama 3.1 8B Instant (~750 tokens/sec,
   sub-second response, fully free). Returns
   `{ ok, reason, suggestions: [3 alternatives] }`.

### UI hierarchy

- **Hard block** (orange border, Generate disabled): instant heuristic
  detected a clear subject mismatch. Includes an **Override — I know
  what I'm doing** link for edge cases. Override resets on any input
  change.
- **Soft advisory** (amber, Generate stays enabled): Groq grade-level
  check returned a concern with suggested alternatives.
- **No panel**: all clear.

---

## Admin / observability

`/admin` — direct-URL only, no nav link. Anyone with the URL can see it
but it's not advertised.

### What it shows

- **Health cards**: total events, success rate (green/amber/red),
  last success timestamp, last error message.
- **Per-provider rollup**: success rate per provider
  (`claude` / `hf` / `groq` / `haiku-retry`) from `_provider` field in
  Parse responses.
- **Filterable event list**: all / errors / ok with live counts.
- **Per-row expandable detail**: full error text, model used, request
  preview (~200 chars), response preview (~300 chars), event ID.
- **Refresh + Clear buttons**.

### Storage

`localStorage` only — never sent anywhere. Capped at **last 500 events**.
Survives reloads / browser restarts but is per-browser-per-device. See
`src/lib/event-log.ts`.

### What teachers see vs what you see

- **Teacher** (on any failure): friendly panel with an Owl mascot, the
  line *"Sheldon Library couldn't fetch that one. We're working on it —
  meanwhile, explore the Library for already-generated content,"* a
  **Try again** button, and a **Browse Library** CTA. Zero error
  details, no `/admin` reference, no HTTP codes.
- **Operator** (you, at `/admin`): the full error message, request body
  preview, response body preview, timestamps, provider, model, HTTP
  status. Everything you need to debug.

---

## Project structure

```
.
├── n8n/
│   └── workflows/
│       ├── llm-generators.json     # ALL generators + topic-validate
│       └── sync-state.json         # students / library / attempts persistence
├── public/
│   ├── logo.webp
│   └── templates/                  # iframe-rendered HTML (cache-busted)
│       ├── presentation-classic.html
│       ├── presentation-academic.html
│       ├── worksheet-print.html
│       ├── lessonplan-timeline.html
│       ├── quiz-live.html
│       └── game-arcade.html
├── src/
│   ├── App.tsx                     # router + hydration gate
│   ├── lib/
│   │   ├── api.ts                  # callWebhook + per-generator helpers
│   │   ├── event-log.ts            # localStorage event log (admin source)
│   │   ├── topic-heuristic.ts      # instant subject keyword match
│   │   ├── template-engine.ts      # loadTemplate + renderX functions
│   │   ├── template-types.ts       # TemplatedPresentation / Quiz / Worksheet / etc
│   │   ├── template-sample.ts      # dev-only sample decks
│   │   ├── themes.ts               # 6 themes with mascot SVGs
│   │   ├── subjects.ts             # 9 subjects with motif SVGs
│   │   ├── models.ts               # FE model picker (Claude / HF variants)
│   │   ├── types.ts                # shared payload + response types
│   │   ├── pptx-templated.ts       # pptxgenjs export for templated slides
│   │   ├── pptx.ts                 # legacy slide → PPTX
│   │   ├── pdf.ts                  # PTM PDF (Progress page)
│   │   ├── format.ts               # date / number formatters
│   │   └── mockData.ts             # canned responses for mock mode
│   ├── store/
│   │   └── useStore.ts             # Zustand: students / library / attempts
│   ├── components/
│   │   ├── layout/                 # Sidebar, TopBar, ActiveStudentSelector
│   │   ├── shared/                 # StatCard, EmptyState, ErrorState, OwlMascot, ...
│   │   ├── students/               # StudentCard, AddStudentModal
│   │   ├── generators/             # 6 forms + ModelSelector
│   │   └── renderers/
│   │       ├── QuizRenderer.tsx    # legacy React quiz renderer
│   │       ├── PresentationRenderer.tsx  # legacy
│   │       ├── WorksheetRenderer.tsx     # legacy
│   │       ├── LessonPlanRenderer.tsx    # legacy
│   │       ├── GameRenderer.tsx          # legacy
│   │       ├── TemplatedQuizRenderer.tsx         # iframe wrappers
│   │       ├── TemplatedPresentationRenderer.tsx
│   │       ├── TemplatedWorksheetRenderer.tsx
│   │       ├── TemplatedLessonPlanRenderer.tsx
│   │       └── TemplatedGameRenderer.tsx
│   └── pages/
│       ├── Dashboard.tsx
│       ├── Students.tsx
│       ├── Generate.tsx            # main authoring surface
│       ├── Library.tsx
│       ├── Progress.tsx
│       └── Admin.tsx               # hidden event log dashboard
├── .env.example
├── vercel.json                     # SPA rewrites + /templates/* no-cache header
├── tailwind.config.ts
└── package.json
```

---

## Quick start (mock mode)

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`. The yellow banner means it's running on canned
data from `src/lib/mockData.ts`. Every feature works — generate, take the
quiz, flip slides, download PPTX — all against fixtures.

Mock mode is automatic when `VITE_N8N_BASE_URL` is empty or starts with
`https://your-n8n`.

---

## Going live

### 1. Backend (~90 min one-time)

Follow `SHELDONS_LIBRARY_V2_BUILD_GUIDE (2).md` for the original Phase-1
setup. In summary you'll need:

- An n8n instance (Railway template recommended)
- An Anthropic API key (Claude Sonnet 4.5 + Haiku 4.5)
- A Hugging Face read token
- **A Groq API key** (free — sign up at https://console.groq.com, no card)
- 3 credentials in n8n: Anthropic, Hugging Face
- 1 env var in Railway: `GROQ_API_KEY`

### 2. Import the n8n workflows

In n8n → Workflows → **Import from File**:

- `n8n/workflows/sync-state.json` — Airtable / DB read-write proxy
- `n8n/workflows/llm-generators.json` — every LLM workflow + the validator

After import:
- Re-link Anthropic credential on every `*-Claude` node (and `*-Claude Retry`)
- Re-link HuggingFace credential on every `*-HF` node
- The `*-Groq` nodes use the `$env.GROQ_API_KEY` env var — no credential to re-link
- Activate both workflows

### 3. Wire the frontend

```bash
cp .env.example .env
```

```ini
VITE_N8N_BASE_URL=https://YOUR-N8N.up.railway.app/webhook
VITE_SHELDON_KEY=
```

Restart `npm run dev`. The yellow mock banner disappears.

### 4. Deploy to Vercel

```bash
git push
```

Then in Vercel → New Project → import repo → set the two env vars in
**Project Settings → Environment Variables** → deploy. `vercel.json`
configures SPA routing AND a `Cache-Control: max-age=0, must-revalidate`
header on `/templates/*` so template HTML updates ship immediately.

---

## Environment variables

### Frontend (Vite — must be `VITE_` prefixed)

| Var | Required | Notes |
|---|---|---|
| `VITE_N8N_BASE_URL` | for live mode | e.g. `https://sheldon-n8n.up.railway.app/webhook` |
| `VITE_SHELDON_KEY` | optional | Passed as `x-sheldon-key` header — used to require a shared secret on the n8n webhook |

### Backend (Railway / n8n)

| Var | Required | Notes |
|---|---|---|
| `GROQ_API_KEY` | yes | Free key from https://console.groq.com — powers tier-3 fallback AND the topic validator |

The Anthropic and Hugging Face tokens live in **n8n credentials**, not env
vars.

---

## Routes

| Path | Page | In sidebar |
|---|---|---|
| `/` | Dashboard | ✓ |
| `/students` | Students | ✓ |
| `/generate` | Generate | ✓ |
| `/library` | Library | ✓ |
| `/progress` | Progress | ✓ |
| `/admin` | Admin event log | **no — direct URL only** |

---

## Generator tools

| Tool | Default model | Generates | Auto-fallback |
|---|---|---|---|
| Diagnostic Test | Claude Sonnet 4.5 | 10-30 MCQs targeting previous year's curriculum | HF Llama → Groq → Haiku |
| Assessment | Claude Sonnet 4.5 | 3-30 marked MCQs at chosen difficulty | HF Llama → Groq → Haiku |
| Worksheet | Claude Sonnet 4.5 | A4 printable, six section types | HF Llama → Groq → Haiku |
| Lesson Plan | Claude Sonnet 4.5 | 10-section timeline summing to N minutes | HF Llama → Groq → Haiku |
| Presentation | Claude Sonnet 4.5 (16k tokens) | 40-50 slide deck (classic or academic) | HF Llama → Groq → Haiku |
| Game | Claude Sonnet 4.5 | 5 game styles in one template | HF Llama → Groq → Haiku |
| Diagnostic Analyze | Claude Sonnet 4.5 | Per-skill % + remediation suggestions | HF Llama → Groq → Haiku |
| **Topic Validate** | **Groq Llama 3.1 8B** | `{ok, reason, suggestions}` advisory | none — fails open |

The teacher can override the primary model per-generation via the **AI Engine**
picker on the Generate page. Picking an HF variant force-fails the tier-1
Claude attempt so the chain skips straight to HF; the tier-4 Haiku retry
remains as a final safety net.

---

## n8n workflow structure

### `llm-generators.json` — 63 nodes, 7 webhook entry points

For each of the 7 LLM-calling generators (Diagnostic, Analyze, Assessment,
Worksheet, LessonPlan, Presentation, Game):

```
<Kind> Webhook
    ↓
<Kind> Build Prompt        Code node. Builds system + user, runs the
                           gradeCalibration helper, picks themeId via
                           hash-based subject-aware pool, picks
                           subjectId via guessSubject, attaches all of
                           these as metadata on the output for downstream.
    ↓
<Kind> Claude              HTTP node (Anthropic API, Sonnet 4.5)
   ↓ok        ↓error
   |       <Kind> HF       HTTP node (HuggingFace, Llama 3.3 70B default)
   |          ↓ok    ↓error
   |          |    <Kind> Groq   HTTP node (Groq, Llama 3.3 70B Versatile)
   |          |       ↓ok   ↓error
   |          |       |  <Kind> Claude Retry  HTTP node (Anthropic, Haiku 4.5)
   |          |       |     ↓ok          ↓error
   |          |       |     |       <Kind> Build Error
   ↓          ↓       ↓     ↓             ↓
<Kind> Parse                              <Kind> Build Error
    ↓                                          (returns {error: "..."})
<Kind> Respond
```

Plus the validator:

```
Validate Webhook → Validate Build Prompt → Validate Groq → Validate Parse → Validate Respond
                                            ↓ error
                                          (also goes to Parse → fails open returning {ok: true})
```

### `sync-state.json`

Six operations multiplexed onto one webhook (`POST /sync-state`):

- `getAll`
- `createStudent`, `deleteStudent`
- `saveLibraryItem`
- `saveAttempt`

Persists to an Airtable base (4 tables: Students / LibraryItems /
QuizAttempts / GeneratorRuns) via n8n's Airtable nodes.

---

## Recent changes

In commit-date order, most recent first:

- **Grade calibration with BAD/GOOD examples** — all 6 Build Prompts now show the AI concrete per-grade depth anchors, not just topic lists. `gradeCalibration()` emits explicit "DO NOT PRODUCE: ..." / "CORRECTLY PITCHED: ..." pairs for the requested grade + subject. ([8a51389](https://github.com/kailasnath2255/sheldon-library/commit/8a51389))
- **Presentation overflow + ghosting fixes** — `iconize()` helper expanded to 90+ word-icon mappings; display-title text-shadow softened to remove ghosting on serif display fonts; fill-blank renderer strips redundant `= answer` from `after` field. ([cbe8c42](https://github.com/kailasnath2255/sheldon-library/commit/cbe8c42))
- **Comprehensive overflow safety net** across both presentation templates — `overflow-wrap: anywhere`, `min-width: 0` on flex children, `minmax(0, 1fr)` on grids, mascot bubble height cap with internal scroll. ([8799548](https://github.com/kailasnath2255/sheldon-library/commit/8799548))
- **Topic mismatch hard-block + Override** — clear subject mismatches (e.g. "python" in Maths) now disable Generate; an Override link lets the teacher proceed for edge cases. Color switched from coral to brand orange. ([18b6a82](https://github.com/kailasnath2255/sheldon-library/commit/18b6a82), [de525f5](https://github.com/kailasnath2255/sheldon-library/commit/de525f5))
- **Instant client-side topic check** (`topic-heuristic.ts`) — 9-subject keyword banks. No network call. Conservative: only fires when topic clearly belongs to a different subject AND doesn't match the chosen one. ([c34c4cf](https://github.com/kailasnath2255/sheldon-library/commit/c34c4cf))
- **Groq topic validator** — `/topic-validate` endpoint switched from Claude Haiku to Groq Llama 3.1 8B Instant. Fully free, fully independent of Anthropic credit, ~0.5s response. ([d644299](https://github.com/kailasnath2255/sheldon-library/commit/d644299))
- **Claude Haiku loop-back as 4th-tier fallback** — when the teacher explicitly picks an HF model and both HF+Groq fail, Haiku gets the first real Claude attempt for that request. ([fc423de](https://github.com/kailasnath2255/sheldon-library/commit/fc423de))
- **Groq as 3rd-tier fallback** across all 7 generators. ([004709f](https://github.com/kailasnath2255/sheldon-library/commit/004709f))
- **Hidden admin page** (`/admin`) — localStorage event log with health cards, per-provider rollup, filterable list, per-row expand. Friendly teacher-facing failure panel with Owl mascot replaces raw error toasts. ([b1897e5](https://github.com/kailasnath2255/sheldon-library/commit/b1897e5))
- **The blank-quiz hunt** — traced and fixed: a JS syntax error on line 412 of quiz-live (`'Time\\'s up!'` — invalid escaping) aborted the IIFE at parse time, leaving the static "1/1" placeholder visible. Plus cache-busted templates via `TEMPLATE_VERSION` + `vercel.json` no-cache header. ([b94b236](https://github.com/kailasnath2255/sheldon-library/commit/b94b236), [7828f93](https://github.com/kailasnath2255/sheldon-library/commit/7828f93))
- **Dark-theme readability** on classic presentation — introduced `--card-ink` token (always dark) for text on white cards/chips so space theme (white `--ink`) no longer renders white-on-white. ([c6e5c94](https://github.com/kailasnath2255/sheldon-library/commit/c6e5c94))
- **All 6 generators wired to template-v1** — `Wire Game, Worksheet, LessonPlan, Diagnostic, Assessment, Presentation`. ([e2f0ad5](https://github.com/kailasnath2255/sheldon-library/commit/e2f0ad5), [f1fa9cd](https://github.com/kailasnath2255/sheldon-library/commit/f1fa9cd))

Full history at https://github.com/kailasnath2255/sheldon-library/commits/main

---

## Stack rules

- All backend logic lives in n8n. The frontend ONLY calls webhooks.
- LLM API keys never enter the frontend bundle — they live in n8n
  credentials or Railway env vars.
- Single state library (Zustand). Single icon library (Lucide).
- Templates are static assets in `/public/templates/` — fetched via
  `loadTemplate()` with a `?v=N` cache buster, never bundled into JS.
- All generations save to the library auto-magically once successful.
- The teacher never sees a raw error. Failures go to `/admin`.

---

## License

Internal — Sheldon Labs.
