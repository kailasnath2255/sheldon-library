import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import OwlMascot from "@/components/shared/OwlMascot";
import { useStore } from "@/store/useStore";
import { isMockMode } from "@/lib/api";
import Dashboard from "@/pages/Dashboard";
import Students from "@/pages/Students";
import Generate from "@/pages/Generate";
import Library from "@/pages/Library";
import Progress from "@/pages/Progress";

export default function App() {
  const { hydrate, isHydrated } = useStore();
  const location = useLocation();

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bgLight dark:bg-deep-bg">
        <div className="animate-float">
          <OwlMascot size={140} />
        </div>
        <p className="mt-4 font-display text-xl font-bold text-ss-ink-900 dark:text-white">
          Sheldon is waking up…
        </p>
        <p className="text-sm text-ss-ink-500 dark:text-ss-ink-300 mt-1">
          Hydrating your library
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-bgLight dark:bg-deep-bg transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />

        {isMockMode && (
          <div className="mx-4 md:mx-6 mb-2 rounded-2xl bg-soft-yellow dark:bg-deep-cream/40 border border-ss-accent-yellow/40 text-ss-ink-900 dark:text-ss-ink-100 text-xs sm:text-sm px-4 py-2.5 font-semibold flex items-center gap-2">
            <span aria-hidden>⚠</span>
            Mock mode — n8n not connected. Set
            <code className="bg-white dark:bg-deep-surface px-1.5 py-0.5 rounded text-[11px]">
              VITE_N8N_BASE_URL
            </code>
            to switch to live data.
          </div>
        )}

        <main className="flex-1 px-4 md:px-6 py-4 pb-32 lg:pb-10 max-w-[1400px] w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <Routes location={location}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/students" element={<Students />} />
                <Route path="/generate" element={<Generate />} />
                <Route path="/library" element={<Library />} />
                <Route path="/progress" element={<Progress />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="px-4 md:px-6 py-4 text-xs text-ss-ink-400 dark:text-ss-ink-500 text-center lg:text-right">
          Made with care · v2.0 · Sheldon Labs
        </footer>
      </div>
    </div>
  );
}
