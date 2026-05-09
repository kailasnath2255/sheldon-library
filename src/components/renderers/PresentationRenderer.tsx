import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  StickyNote,
  Download,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { renderSlide } from "./SlideTypes";
import type { PresentationResponse } from "@/lib/types";
import { presentationToPptx } from "@/lib/api";
import { triggerBase64Download } from "@/lib/pdf";

export default function PresentationRenderer({
  data,
}: {
  data: PresentationResponse;
}) {
  const [idx, setIdx] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const slides = data.slides;
  const total = slides.length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIdx((i) => Math.min(total - 1, i + 1));
      if (e.key === "ArrowLeft") setIdx((i) => Math.max(0, i - 1));
      if (e.key.toLowerCase() === "n") setShowNotes((s) => !s);
      if (e.key.toLowerCase() === "f") toggleFullscreen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen?.();
      setFullscreen(true);
    } else {
      await document.exitFullscreen?.();
      setFullscreen(false);
    }
  };

  const handlePptx = async () => {
    const id = toast.loading("Building PPTX…");
    try {
      const res = await presentationToPptx(slides);
      if (res.base64) {
        triggerBase64Download(
          res.base64,
          res.filename,
          "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        );
        toast.success("PPTX ready!", { id });
      } else {
        toast(
          "Mock mode — connect n8n to download a real PPTX. Slides JSON is in the page.",
          { id, icon: "ℹ️" }
        );
      }
    } catch {
      toast.error("Couldn't build PPTX — try again.", { id });
    }
  };

  const slide = slides[idx];

  return (
    <div className="space-y-3 animate-fade-up">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-navy/60">
          ← / → to navigate · N for notes · F for fullscreen
        </p>
        <button
          onClick={handlePptx}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple text-white font-semibold hover:bg-purple/90 transition text-sm"
        >
          <Download className="w-4 h-4" /> Download PPTX
        </button>
      </div>

      <div
        ref={containerRef}
        className="relative bg-soft-cream dark:bg-deep-cream/30 rounded-3xl ss-edge overflow-hidden"
        style={{ aspectRatio: "16 / 9", minHeight: 360 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-3 md:inset-4"
          >
            {renderSlide(slide)}
          </motion.div>
        </AnimatePresence>

        {/* Super Sheldon branding watermark */}
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-white/90 dark:bg-deep-surface/90 backdrop-blur rounded-full pl-1.5 pr-3 py-1 border-2 border-ss-ink-900 dark:border-white/40 shadow-soft pointer-events-none">
          <img src="/logo.webp" alt="" className="w-6 h-6 rounded-full object-contain" />
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ss-ink-900 dark:text-white">
            Super Sheldon
          </span>
        </div>

        {/* Controls */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur rounded-full shadow-lg px-3 py-2 flex items-center gap-2">
          <button
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            disabled={idx === 0}
            className="p-1.5 rounded-full hover:bg-navy/5 disabled:opacity-30"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 text-navy" />
          </button>
          <span className="text-sm font-bold text-navy tabular-nums px-1">
            {idx + 1}{" "}
            <span className="text-navy/40">/ {total}</span>
          </span>
          <button
            onClick={() => setIdx((i) => Math.min(total - 1, i + 1))}
            disabled={idx === total - 1}
            className="p-1.5 rounded-full hover:bg-navy/5 disabled:opacity-30"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 text-navy" />
          </button>
          <span className="w-px h-5 bg-navy/15 mx-1" />
          <button
            onClick={() => setShowNotes((s) => !s)}
            className={`p-1.5 rounded-full transition ${
              showNotes ? "bg-purple text-white" : "hover:bg-navy/5 text-navy"
            }`}
            aria-label="Toggle teacher notes"
          >
            <StickyNote className="w-4 h-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-full hover:bg-navy/5 text-navy"
            aria-label="Toggle fullscreen"
          >
            {fullscreen ? (
              <Minimize className="w-4 h-4" />
            ) : (
              <Maximize className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Notes drawer */}
        <AnimatePresence>
          {showNotes && (
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="absolute top-3 right-3 bottom-16 w-[calc(100%-1.5rem)] sm:w-72 bg-navy text-white rounded-2xl shadow-xl p-4 overflow-y-auto scrollbar-thin"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-display font-bold">Teacher notes</h4>
                <button
                  onClick={() => setShowNotes(false)}
                  className="p-1 rounded hover:bg-white/10"
                  aria-label="Close notes"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-white/85 leading-relaxed">
                {slide.notes ?? "No notes for this slide."}
              </p>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
