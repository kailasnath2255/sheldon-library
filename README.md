# Sheldon's Library v2

AI-powered teacher assistant. Vite + React + TS + Tailwind. Generates diagnostics, assessments, worksheets, lesson plans, presentations and games.

## Quick start

```bash
npm install
npm run dev
```

The app runs in **mock mode** out of the box — no backend required. A yellow banner reminds you it's mock data.

## Going live (Phase 1)

1. Set up Airtable, Anthropic, n8n per the build guide (`SHELDONS_LIBRARY_V2_BUILD_GUIDE`).
2. Build the 9 n8n workflows.
3. Copy `.env.example` to `.env` and fill in:
   ```
   VITE_N8N_BASE_URL=https://your-n8n.up.railway.app/webhook
   VITE_SHELDON_KEY=optional-shared-secret
   ```
4. `npm run build && npm run preview`.

## Stack

- Vite + React 18 + TypeScript (strict)
- Tailwind CSS
- Zustand (state)
- React Router v6
- Recharts (charts)
- Framer Motion (animations + drag)
- Lucide React (icons)
- react-hot-toast
- jsPDF + html2canvas (PDF export)

## Routes

- `/` Dashboard
- `/students` Roster CRUD
- `/generate` Tool picker + form + live renderer
- `/library` Saved artifacts
- `/progress` Score trajectory + PTM PDF export

## Mock mode

When `VITE_N8N_BASE_URL` is empty or starts with `https://your-n8n`, every webhook call returns canned data from `src/lib/mockData.ts`. Mock state mutates in-memory so add-student and save-attempt feel real.
