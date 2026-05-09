import { useEffect, useRef, useState } from "react";
import { Download, Maximize2, Minimize2, ExternalLink } from "lucide-react";
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

  const openInNewTab = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div ref={wrapRef} className="bg-white dark:bg-deep-surface rounded-3xl ss-edge overflow-hidden flex flex-col h-[85vh]">
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b-2 border-ss-ink-900 dark:border-white/50 bg-soft-cream dark:bg-deep-cream/40">
        <span className="eyebrow">Live preview</span>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="pill" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />} onClick={openInNewTab}>
            Open in new tab
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

      <iframe
        ref={iframeRef}
        srcDoc={html}
        title="Generated content"
        className="flex-1 w-full bg-white"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-fullscreen allow-downloads"
      />
    </div>
  );
}
