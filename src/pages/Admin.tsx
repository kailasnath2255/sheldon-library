import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, Trash2, RefreshCw, ChevronRight } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import EmptyState from "@/components/shared/EmptyState";
import Button from "@/components/shared/Button";
import {
  clearEvents,
  getEvents,
  rollupByProvider,
  subscribe,
  type LogEvent,
} from "@/lib/event-log";

const fmtTime = (iso: string) => {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit", day: "2-digit", month: "short" });
  } catch {
    return iso;
  }
};

const fmtDuration = (ms: number) => {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
};

type Filter = "all" | "errors" | "success";

export default function Admin() {
  const [events, setEvents] = useState<LogEvent[]>(() => getEvents());
  const [filter, setFilter] = useState<Filter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => subscribe(() => setEvents(getEvents())), []);

  const filtered = useMemo(() => {
    if (filter === "errors") return events.filter((e) => e.status === "error");
    if (filter === "success") return events.filter((e) => e.status === "success");
    return events;
  }, [events, filter]);

  const stats = useMemo(() => {
    const total = events.length;
    const errors = events.filter((e) => e.status === "error").length;
    const success = total - errors;
    const successRate = total ? Math.round((success / total) * 100) : 0;
    const lastSuccess = events.find((e) => e.status === "success");
    const lastError = events.find((e) => e.status === "error");
    return { total, errors, success, successRate, lastSuccess, lastError };
  }, [events]);

  const providerRollup = useMemo(() => rollupByProvider(events), [events]);

  const refresh = () => setEvents(getEvents());

  const handleClear = () => {
    if (window.confirm("Clear all events? This cannot be undone.")) {
      clearEvents();
      setEvents([]);
    }
  };

  return (
    <div>
      <PageHero
        eyebrow="Admin"
        title="Event log & health"
        subtitle="Every webhook call and error from this browser — captured for debugging. Teachers don't see any of this."
      />

      {/* Health summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white dark:bg-deep-surface rounded-2xl shadow-soft border border-navy/5 p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] font-bold text-ss-ink-500 dark:text-ss-ink-300">
            Total events
          </p>
          <p className="font-display text-3xl font-extrabold text-ss-ink-900 dark:text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-deep-surface rounded-2xl shadow-soft border border-navy/5 p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] font-bold text-ss-ink-500 dark:text-ss-ink-300">
            Success rate
          </p>
          <p className={`font-display text-3xl font-extrabold mt-1 ${stats.successRate >= 90 ? "text-green-600" : stats.successRate >= 60 ? "text-amber-600" : "text-red-600"}`}>
            {stats.total ? `${stats.successRate}%` : "—"}
          </p>
          <p className="text-[11px] text-ss-ink-500 dark:text-ss-ink-300 mt-1">
            {stats.success} ok · {stats.errors} fail
          </p>
        </div>
        <div className="bg-white dark:bg-deep-surface rounded-2xl shadow-soft border border-navy/5 p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] font-bold text-ss-ink-500 dark:text-ss-ink-300">
            Last success
          </p>
          <p className="text-sm font-semibold text-ss-ink-900 dark:text-white mt-1">
            {stats.lastSuccess ? fmtTime(stats.lastSuccess.timestamp) : "—"}
          </p>
          <p className="text-[11px] text-ss-ink-500 dark:text-ss-ink-300 mt-1 truncate">
            {stats.lastSuccess?.path ?? "no successful call yet"}
          </p>
        </div>
        <div className="bg-white dark:bg-deep-surface rounded-2xl shadow-soft border border-navy/5 p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] font-bold text-ss-ink-500 dark:text-ss-ink-300">
            Last error
          </p>
          <p className="text-sm font-semibold text-ss-ink-900 dark:text-white mt-1">
            {stats.lastError ? fmtTime(stats.lastError.timestamp) : "—"}
          </p>
          <p className="text-[11px] text-ss-ink-500 dark:text-ss-ink-300 mt-1 truncate" title={stats.lastError?.error}>
            {stats.lastError?.error ?? "no errors yet"}
          </p>
        </div>
      </div>

      {/* Provider rollup */}
      {Object.keys(providerRollup).length > 0 && (
        <div className="bg-white dark:bg-deep-surface rounded-2xl shadow-soft border border-navy/5 p-5 mb-6">
          <h3 className="font-display font-bold text-navy mb-3">By provider</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(providerRollup).map(([prov, r]) => {
              const rate = r.total ? Math.round((r.ok / r.total) * 100) : 0;
              return (
                <div key={prov} className="border border-navy/10 dark:border-white/10 rounded-xl p-3">
                  <p className="text-xs uppercase tracking-wider font-bold text-ss-ink-500 dark:text-ss-ink-300">{prov}</p>
                  <p className="font-display text-2xl font-extrabold text-ss-ink-900 dark:text-white mt-1">{rate}%</p>
                  <p className="text-[11px] text-ss-ink-500 dark:text-ss-ink-300">
                    {r.ok}/{r.total} ok · {r.fail} fail
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters + actions */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {(["all", "errors", "success"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full border-2 text-xs font-bold transition capitalize ${
                filter === f
                  ? "bg-ss-orange-500 text-white border-ss-ink-900 dark:border-white/60 shadow-brand"
                  : "bg-white dark:bg-deep-surface text-ss-ink-900 dark:text-white border-ss-ink-900 dark:border-white/40 hover:bg-soft-cream dark:hover:bg-deep-cream/40"
              }`}
            >
              {f === "all" ? `All (${events.length})` : f === "errors" ? `Errors (${stats.errors})` : `OK (${stats.success})`}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="pill" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={refresh}>
            Refresh
          </Button>
          <Button variant="pill" size="sm" icon={<Trash2 className="w-3.5 h-3.5" />} onClick={handleClear}>
            Clear
          </Button>
        </div>
      </div>

      {/* Event list */}
      {filtered.length === 0 ? (
        <EmptyState
          title={
            filter === "errors"
              ? "No errors logged."
              : filter === "success"
              ? "No successful calls logged yet."
              : "No events yet."
          }
          message="Generate something from the Generate page — every call is captured here."
        />
      ) : (
        <div className="bg-white dark:bg-deep-surface rounded-2xl shadow-soft border border-navy/5 overflow-hidden">
          <ul className="divide-y divide-navy/5 dark:divide-white/10">
            {filtered.map((e) => {
              const isExpanded = expandedId === e.id;
              return (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : e.id)}
                    className="w-full text-left px-4 py-3 hover:bg-soft-cream dark:hover:bg-deep-cream/30 transition flex items-center gap-3"
                  >
                    {e.status === "success" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                    <span className="font-mono text-xs text-ss-ink-500 dark:text-ss-ink-300 w-32 shrink-0">
                      {fmtTime(e.timestamp)}
                    </span>
                    <span className="font-semibold text-sm text-ss-ink-900 dark:text-white truncate flex-1">
                      {e.path}
                      {e.provider && <span className="ml-2 text-xs font-normal text-ss-ink-500 dark:text-ss-ink-300">· {e.provider}</span>}
                    </span>
                    <span className="text-xs text-ss-ink-500 dark:text-ss-ink-300 shrink-0">{fmtDuration(e.durationMs)}</span>
                    {e.httpStatus && (
                      <span className={`text-xs font-mono shrink-0 ${e.httpStatus < 400 ? "text-green-700" : "text-red-700"}`}>
                        {e.httpStatus}
                      </span>
                    )}
                    <ChevronRight className={`w-4 h-4 text-ss-ink-500 dark:text-ss-ink-300 shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 bg-soft-cream/50 dark:bg-deep-cream/20 border-t border-navy/5 dark:border-white/10">
                      <dl className="text-xs space-y-2 pt-3">
                        {e.error && (
                          <Field label="Error">
                            <pre className="whitespace-pre-wrap break-all text-red-700 dark:text-red-400 font-mono text-[11px] leading-snug">{e.error}</pre>
                          </Field>
                        )}
                        {e.model && <Field label="Model"><code className="text-[11px]">{e.model}</code></Field>}
                        {e.payloadPreview && (
                          <Field label="Request">
                            <pre className="whitespace-pre-wrap break-all text-ss-ink-500 dark:text-ss-ink-300 font-mono text-[11px] leading-snug">{e.payloadPreview}</pre>
                          </Field>
                        )}
                        {e.responsePreview && (
                          <Field label="Response">
                            <pre className="whitespace-pre-wrap break-all text-ss-ink-500 dark:text-ss-ink-300 font-mono text-[11px] leading-snug">{e.responsePreview}</pre>
                          </Field>
                        )}
                        <Field label="Event ID"><code className="text-[11px]">{e.id}</code></Field>
                      </dl>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <p className="mt-6 text-xs text-ss-ink-500 dark:text-ss-ink-300 flex items-center gap-2">
        <Activity className="w-3.5 h-3.5" />
        Events are stored locally in this browser only (last 500). They are not sent to any server.
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-3 items-start">
      <dt className="text-[10px] uppercase tracking-wider font-bold text-ss-ink-500 dark:text-ss-ink-300">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
