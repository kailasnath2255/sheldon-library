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

        {/* Super Sheldon branding watermark — bigger, always visible */}
        <div className="absolute top-4 left-4 flex items-center gap-2.5 bg-white backdrop-blur rounded-full pl-1.5 pr-4 py-1.5 border-2 border-ss-ink-900 shadow-soft-lg pointer-events-none z-10">
          <div className="w-9 h-9 rounded-full bg-white border-2 border-ss-ink-900 overflow-hidden flex items-center justify-center">
            <img src="/logo.webp" alt="" className="w-[88%] h-[88%] object-contain" />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-ss-ink-900">
            Super Sheldon
          </span>
        </div>

        {/* Controls — fixed dark/light combo so Next button is ALWAYS visible regardless of theme */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-ss-ink-900 dark:bg-white border-2 border-ss-ink-900 dark:border-white/80 rounded-full shadow-soft-lg px-3 py-2 flex items-center gap-1.5">
          <button
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            disabled={idx === 0}
            className="p-2 rounded-full hover:bg-white/15 dark:hover:bg-ss-ink-900/15 disabled:opacity-30 transition"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 text-white dark:text-ss-ink-900" />
          </button>
          <span className="text-sm font-bold text-white dark:text-ss-ink-900 tabular-nums px-2">
            {idx + 1}
            <span className="text-white/50 dark:text-ss-ink-900/50"> / {total}</span>
          </span>
          <button
            onClick={() => setIdx((i) => Math.min(total - 1, i + 1))}
            disabled={idx === total - 1}
            className="p-2 rounded-full hover:bg-white/15 dark:hover:bg-ss-ink-900/15 disabled:opacity-30 transition"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 text-white dark:text-ss-ink-900" />
          </button>
          <span className="w-px h-5 bg-white/20 dark:bg-ss-ink-900/20 mx-1" />
          <button
            onClick={() => setShowNotes((s) => !s)}
            className={`p-2 rounded-full transition ${
              showNotes
                ? "bg-ss-orange-500 text-white"
                : "hover:bg-white/15 dark:hover:bg-ss-ink-900/15 text-white dark:text-ss-ink-900"
            }`}
            aria-label="Toggle teacher notes"
          >
            <StickyNote className="w-4 h-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full hover:bg-white/15 dark:hover:bg-ss-ink-900/15 transition text-white dark:text-ss-ink-900"
            aria-label="Toggle fullscreen"
          >
            {fullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>

        {/* Teacher Notes drawer — fixed dark surface + white text always */}
        <AnimatePresence>
          {showNotes && (
            <motion.aside
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="absolute top-4 right-4 bottom-20 w-[calc(100%-2rem)] sm:w-80 bg-ss-ink-900 text-white rounded-2xl shadow-soft-lg border-2 border-ss-ink-900 dark:border-white/40 p-5 overflow-y-auto scrollbar-thin z-10"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-ss-orange-300">
                    Speaker
                  </p>
                  <h4 className="font-display font-extrabold text-lg text-white mt-0.5">
                    Teacher notes
                  </h4>
                </div>
                <button
                  onClick={() => setShowNotes(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
                  aria-label="Close notes"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-white leading-relaxed">
                {slide.notes ?? <span className="text-white/60 italic">No notes for this slide.</span>}
              </p>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
