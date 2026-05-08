import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
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

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bgLight">
        <div className="animate-bounce">
          <OwlMascot size={140} />
        </div>
        <p className="mt-4 font-display text-xl font-bold text-navy">
          Sheldon is waking up… 🦉
        </p>
        <p className="text-sm text-navy/60 mt-1">Hydrating your library</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />

        {isMockMode && (
          <div className="bg-gold/15 border-b border-gold/30 text-[#7a5b00] text-xs sm:text-sm px-4 md:px-8 py-2 font-semibold flex items-center gap-2">
            <span aria-hidden>⚠</span>
            Mock mode — n8n not connected. Set
            <code className="bg-white px-1.5 py-0.5 rounded text-[11px]">
              VITE_N8N_BASE_URL
            </code>
            to switch to live data.
          </div>
        )}

        <main className="flex-1 px-4 md:px-8 py-6 pb-24 lg:pb-10 max-w-[1400px] w-full mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/generate" element={<Generate />} />
            <Route path="/library" element={<Library />} />
            <Route path="/progress" element={<Progress />} />
          </Routes>
        </main>

        <footer className="px-4 md:px-8 py-4 text-xs text-navy/40 text-center lg:text-right border-t border-navy/5">
          Made with ❤ · v2.0 · Sheldon Labs
        </footer>
      </div>
    </div>
  );
}
