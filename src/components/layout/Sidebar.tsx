import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Wand2,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/students", label: "Students", icon: Users },
  { to: "/generate", label: "Generate", icon: Wand2 },
  { to: "/library", label: "Library", icon: BookOpen },
  { to: "/progress", label: "Progress", icon: TrendingUp },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-0 h-screen p-4 gap-3 border-r-2 border-ss-ink-900 dark:border-white/50">
      {/* Brand pill card — logo extends visibly above the card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative ss-card p-5 pt-12 mt-10"
      >
        {/* Free-standing logo, popping out the top — bigger + no colored box behind */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-white dark:bg-white border-2 border-ss-ink-900 dark:border-white/60 shadow-soft flex items-center justify-center overflow-hidden">
          <img src="/logo.webp" alt="Super Sheldon" className="w-[88%] h-[88%] object-contain" />
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-ss-ink-500 dark:text-ss-ink-300">
            Super Sheldon
          </p>
          <h1 className="font-display font-extrabold text-xl leading-tight text-ss-ink-900 dark:text-white mt-0.5">
            Library
          </h1>
          <p className="mt-2 text-[12px] leading-snug text-ss-ink-500 dark:text-ss-ink-300">
            A premium teacher co-pilot for every classroom.
          </p>
        </div>
      </motion.div>

      {/* Nav pills */}
      <nav className="flex-1 flex flex-col gap-2">
        {NAV.map(({ to, label, icon: Icon, end }, idx) => (
          <motion.div
            key={to}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.05 * idx, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-5 py-3.5 rounded-2xl border-2 font-semibold transition duration-300 ease-out ${
                  isActive
                    ? "bg-ss-orange-500 text-white border-ss-ink-900 dark:border-white shadow-brand"
                    : "bg-white dark:bg-deep-surface text-ss-ink-900 dark:text-ss-ink-100 border-ss-ink-900 dark:border-white/40 hover:-translate-y-0.5 hover:shadow-soft hover:bg-soft-cream dark:hover:bg-deep-cream/40"
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110" strokeWidth={2.2} />
              <span>{label}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Footer pill */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="ss-card px-5 py-4"
      >
        <p className="text-[10px] uppercase tracking-[0.14em] font-bold text-ss-ink-500 dark:text-ss-ink-300">
          AI Engine
        </p>
        <p className="text-sm font-semibold text-ss-ink-900 dark:text-white mt-0.5">
          Adaptive
        </p>
        <p className="text-[11px] text-ss-ink-500 dark:text-ss-ink-400 mt-1">
          Pick a model at gen time
        </p>
      </motion.div>
    </aside>
  );
}
