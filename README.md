# Sheldon's Library v2

AI-powered teacher assistant. A tutor picks a student, picks a tool, and gets an
**interactive** AI-generated artifact in 30 seconds — diagnostic quiz, assessment,
worksheet, lesson plan, presentation deck, or game.

## Stack

- **Frontend:** Vite + React 18 + TypeScript (strict) + Tailwind CSS
- **State:** Zustand, hydrated from n8n webhooks on mount
- **Routing:** react-router-dom v6 (5 routes)
- **Charts:** Recharts · **Animation:** Framer Motion · **Icons:** Lucide
- **PDF/PPTX:** jsPDF + html2canvas (browser-side)
- **Backend:** n8n on Railway (8 webhook workflows)
- **Database:** Airtable (4 tables: Students / LibraryItems / QuizAttempts / GeneratorRuns)
- **AI:** primary = Anthropic API; fallback = Hugging Face Inference (Qwen / Llama / Mixtral)

## Quick start (mock mode — no backend needed)

```bash
npm install
npm run dev
```

Visit http://localhost:5173. A yellow banner reminds you it's mock data.
Generate any of the 6 content types, take the quiz, flip through a presentation
— everything works against canned responses in `src/lib/mockData.ts`.

## Going live

### 1. Set up the backend (~90 min)

Follow `SHELDONS_LIBRARY_V2_BUILD_GUIDE (2).md` Phase 1 to create:

- Airtable base with 4 tables (`appXXXXXXXX` base ID)
- Airtable Personal Access Token (read + write + schema:read scopes)
- Anthropic API key (~$5 free credit covers ~500 generations)
- Hugging Face token (free tier sufficient)
- n8n on Railway (with Postgres template)
- 3 credentials in n8n: Anthropic, Airtable PAT, Hugging Face

### 2. Import the n8n workflows

In n8n → Workflows → **Import from File**:

- `n8n/workflows/sync-state.json` — Airtable read/write multiplexer
- `n8n/workflows/llm-generators.json` — 7 LLM generators with Claude → HF fallback

After import, on each Airtable node: re-link credential, paste base + table IDs.
On each HTTP node: re-link Anthropic / Hugging Face credential. Activate both workflows.

See `n8n/README.md` for per-workflow notes.

### 3. Wire the frontend

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_N8N_BASE_URL=https://YOUR-N8N.up.railway.app/webhook
VITE_SHELDON_KEY=
```

Restart dev server. The yellow mock banner disappears, real Airtable students load.

### 4. Deploy to Vercel

```bash
git push    # to your GitHub repo
```

Then in Vercel → New Project → import repo → set the same env vars in the project
settings → deploy. `vercel.json` already configures SPA routing.

## Routes

| Path | Page | Purpose |
|---|---|---|
| `/` | Dashboard | Hero + stats + 6 generator cards + recent items |
| `/students` | Students | CRUD roster |
| `/generate` | Generate | Tool picker + dynamic form + live renderer |
| `/library` | Library | Search, sort, filter saved artifacts |
| `/progress` | Progress | Score trajectory + PTM PDF export |

## Generator tools

| Tool | Default model | Fallback |
|---|---|---|
| Diagnostic Test | Sonnet 4.5 | Qwen 2.5-7B |
| Assessment | Sonnet 4.5 | Qwen 2.5-7B |
| Worksheet | Haiku 4.5 | Qwen 2.5-7B |
| Lesson Plan | Haiku 4.5 | Llama 3.1-8B |
| Presentation | Sonnet 4.5 (16k tokens) | Mixtral 8x7B |
| Game | Haiku 4.5 | Qwen 2.5-7B |
| Diagnostic Analyze | Haiku 4.5 | Llama 3.1-8B |

The user can override the model per-generation in the **AI Engine** picker on the
Generate page. The fallback fires automatically if the primary fails.

## Mock vs live mode

`src/lib/api.ts` checks `VITE_N8N_BASE_URL`. Empty or starting with `https://your-n8n` →
returns canned data from `mockData.ts` after a 1.5s simulated delay. Otherwise
POSTs to `${baseUrl}/<path>` with optional `x-sheldon-key` header.

## Project structure

```
src/
  lib/                  # api.ts, types.ts, models.ts, mockData.ts, pdf.ts, format.ts
  store/                # Zustand store (useStore.ts)
  components/
    layout/             # Sidebar, TopBar, ActiveStudentSelector
    shared/             # StatCard, GeneratorCard, TypePill, OwlMascot, etc.
    students/           # StudentCard, AddStudentModal
    generators/         # 6 forms + ModelSelector + shared atoms
    renderers/          # Quiz, Worksheet, LessonPlan, Presentation + 5 game renderers
  pages/                # Dashboard, Students, Generate, Library, Progress
n8n/
  workflows/            # importable workflow JSON
  README.md             # per-workflow notes
```

## Stack rules

- All backend logic lives in n8n. The frontend ONLY calls webhooks.
- LLM API keys never enter the frontend bundle — they live in n8n credentials.
- Airtable is the source of truth (no localStorage for user data).
- No icon library other than Lucide.
- No state library other than Zustand.

## License

Internal — Sheldon Labs.
