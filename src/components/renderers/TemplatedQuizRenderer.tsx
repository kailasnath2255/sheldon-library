import { useEffect, useRef, useState } from "react";
import { Download, Maximize2, Minimize2, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/shared/Button";
import type { TemplatedQuiz } from "@/lib/template-types";
import { renderQuiz } from "@/lib/template-engine";

export default function TemplatedQuizRenderer({ data }: { data: TemplatedQuiz }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [html, setHtml] = useState<string>("");
  const [isFs, setIsFs] = useState(false);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setBusy(true);
    renderQuiz(data)
      .then((doc) => { if (!cancelled) { setHtml(doc); setBusy(false); } })
      .catch((e) => {
        if (!cancelled) { toast.error("Could not render quiz: " + (e?.message || String(e))); setBusy(false); }
      });
    return () => { cancelled = true; };
  }, [data]);

  useEffect(() => {
    const onChange = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen?.().catch(() => undefined);
    else document.exitFullscreen?.().catch(() => undefined);
  };
  const downloadHtml = () => {
    if (!html) return;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const openInNewTab = () => {
    if (!html) return;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div ref={wrapRef} className="bg-white dark:bg-deep-surface rounded-3xl ss-edge overflow-hidden flex flex-col h-[85vh]">
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b-2 border-ss-ink-900 dark:border-white/50 bg-soft-cream dark:bg-deep-cream/40">
        <span className="eyebrow">{data.mode === "diagnostic" ? "Diagnostic" : "Assessment"} · {data.themeId}</span>
        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          <Button variant="pill" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />} onClick={openInNewTab}>Open in new tab</Button>
          <Button variant="pill" size="sm" icon={<Download className="w-3.5 h-3.5" />} onClick={downloadHtml}>Download</Button>
          <Button variant="pill" size="sm" icon={isFs ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />} onClick={toggleFullscreen}>
            {isFs ? "Exit" : "Fullscreen"}
          </Button>
        </div>
      </div>
      {busy ? (
        <div className="flex-1 flex items-center justify-center text-ss-ink-500 dark:text-ss-ink-300 text-sm">Building quiz…</div>
      ) : (
        <iframe ref={iframeRef} srcDoc={html} title={data.title} className="flex-1 w-full bg-white" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-fullscreen allow-downloads" />
      )}
    </div>
  );
}
