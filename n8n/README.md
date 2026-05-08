# n8n workflows

Importable n8n workflow JSON files for Sheldon's Library v2 backend.

## How to import a workflow

1. **n8n → left sidebar → Workflows → ↑ Import from file** (or the menu in the top-right of the workflows list).
2. Pick the `.json` file from this folder.
3. **Re-link credentials** for every Airtable / Anthropic / HF node:
   - Click each node with a red dot
   - Open the **Credentials** dropdown
   - Pick the credential you created earlier (e.g. "Airtable Personal Access Token account")
   - Save the node
4. **Save** the workflow (Cmd/Ctrl+S).
5. Toggle **Active** (top-right slider).
6. Click the **Webhook** node → copy the **Production URL**.
7. Test with curl (see each workflow's section below).

## Workflows

### `sync-state.json`

Pure Airtable. Multiplexes 5 actions through one webhook so the frontend
hits a single URL.

**Nodes that need credentials re-linked after import (8 Airtable nodes):**
- Students List
- LibraryItems List
- QuizAttempts List
- Create Student
- Delete Student
- Create LibraryItem
- Create QuizAttempt
- (no other Airtable ops)

**Test getAll (read-only, safe):**

```bash
curl -X POST "https://YOUR-N8N.up.railway.app/webhook/sync-state" \
  -H "Content-Type: application/json" \
  -d '{"action":"getAll"}'
```

Expected: `{"students":[...],"libraryItems":[...],"attempts":[...]}`

**Test createStudent (writes a row):**

```bash
curl -X POST "https://YOUR-N8N.up.railway.app/webhook/sync-state" \
  -H "Content-Type: application/json" \
  -d '{"action":"createStudent","payload":{"name":"Test Kid","grade":5,"country":"UK","subject":"Maths","avatarColor":"#B6F2D7"}}'
```

**Test deleteStudent (cleanup):**

```bash
curl -X POST "https://YOUR-N8N.up.railway.app/webhook/sync-state" \
  -H "Content-Type: application/json" \
  -d '{"action":"deleteStudent","payload":"recXXXXXXXXXXXXXX"}'
```

(Replace the `rec...` id with the one returned from createStudent.)
