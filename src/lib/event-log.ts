// ─── Persistent event log for the Admin page ─────────────────────
// Captures every webhook call (success or failure) with timestamp,
// path, status, duration, and the full error message when something
// goes wrong. Stored in localStorage so it survives page reloads.
//
// The regular teacher UI never displays these details — only the
// /admin page reads from here.

const KEY = "sheldon-event-log-v1";
const MAX_EVENTS = 500;

export type EventStatus = "success" | "error";

export interface LogEvent {
  id: string;              // unique
  timestamp: string;       // ISO
  path: string;            // webhook path or operation name
  status: EventStatus;
  durationMs: number;
  httpStatus?: number;     // HTTP status if available
  provider?: string;       // "claude" | "hf" | "groq" | "haiku-retry" — best-effort from response
  model?: string;          // model id used
  error?: string;          // full error message on failure
  payloadPreview?: string; // first ~200 chars of request body — helps reproduce
  responsePreview?: string;// first ~300 chars of response — helps debug
}

function read(): LogEvent[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(events: LogEvent[]): void {
  try {
    // Keep newest first, cap at MAX_EVENTS
    const trimmed = events.slice(0, MAX_EVENTS);
    localStorage.setItem(KEY, JSON.stringify(trimmed));
    // Notify any listening admin tabs in the same browser
    window.dispatchEvent(new CustomEvent("sheldon-events-changed"));
  } catch {
    // localStorage full or disabled — silently drop
  }
}

export function logEvent(event: Omit<LogEvent, "id" | "timestamp">): void {
  const e: LogEvent = {
    ...event,
    id: `e_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
  };
  const all = read();
  all.unshift(e);
  write(all);
}

export function getEvents(): LogEvent[] {
  return read();
}

export function clearEvents(): void {
  write([]);
}

export function subscribe(listener: () => void): () => void {
  const handler = () => listener();
  window.addEventListener("sheldon-events-changed", handler);
  // Also re-poll when this tab gains focus, in case another tab wrote
  window.addEventListener("focus", handler);
  return () => {
    window.removeEventListener("sheldon-events-changed", handler);
    window.removeEventListener("focus", handler);
  };
}

// Helper used by the admin page for the provider-health rollup
export function rollupByProvider(events: LogEvent[]): Record<string, { ok: number; fail: number; total: number }> {
  const out: Record<string, { ok: number; fail: number; total: number }> = {};
  for (const e of events) {
    const key = e.provider || "(unknown)";
    if (!out[key]) out[key] = { ok: 0, fail: 0, total: 0 };
    out[key].total += 1;
    if (e.status === "success") out[key].ok += 1;
    else out[key].fail += 1;
  }
  return out;
}
