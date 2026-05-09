import { useEffect, useRef, useState } from "react";
import { Download, Maximize2, Minimize2, Code2 } from "lucide-react";
import Button from "@/components/shared/Button";

export default function HTMLContentRenderer({
  html,
  filename = "lesson.html",
}: {
  html: string;
  filename?: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [isFs, setIsFs] = useState(false);
  const [showSrc, setShowSrc] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => undefined);
    } else {
      document.exitFullscreen?.().catch(() => undefined);
    }
  };

  const download = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div ref={wrapRef} className="bg-white dark:bg-deep-surface rounded-3xl ss-edge overflow-hidden flex flex-col h-[80vh]">
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b-2 border-ss-ink-900 dark:border-white/50 bg-soft-cream dark:bg-deep-cream/40">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex gap-1.5 shrink-0">
            <span className="w-3 h-3 rounded-full bg-coral border border-ss-ink-900" />
            <span className="w-3 h-3 rounded-full bg-gold border border-ss-ink-900" />
            <span className="w-3 h-3 rounded-full bg-emerald-400 border border-ss-ink-900" />
          </div>
          <span className="text-xs font-bold text-ss-ink-700 dark:text-ss-ink-200 truncate">
            {filename}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="pill" size="sm" icon={<Code2 className="w-3.5 h-3.5" />} onClick={() => setShowSrc((s) => !s)}>
            {showSrc ? "Preview" : "Source"}
          </Button>
          <Button variant="pill" size="sm" icon={<Download className="w-3.5 h-3.5" />} onClick={download}>
            Download
          </Button>
          <Button
            variant="pill"
            size="sm"
            icon={isFs ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            onClick={toggleFullscreen}
          >
            {isFs ? "Exit" : "Fullscreen"}
          </Button>
        </div>
      </div>

      {showSrc ? (
        <pre className="flex-1 overflow-auto bg-ss-ink-900 text-ss-ink-100 text-[12px] p-4 font-mono leading-relaxed whitespace-pre-wrap">
          {html}
        </pre>
      ) : (
        <iframe
          ref={iframeRef}
          srcDoc={html}
          title="Generated content"
          className="flex-1 w-full bg-white"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-fullscreen allow-downloads"
        />
      )}
    </div>
  );
}
