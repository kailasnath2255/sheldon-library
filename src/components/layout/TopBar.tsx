import { Link, NavLink } from "react-router-dom";
import { CalendarDays, LayoutDashboard, Users, Wand2, BookOpen, TrendingUp, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import ActiveStudentSelector from "./ActiveStudentSelector";
import ThemeToggle from "./ThemeToggle";
import { useActiveStudent } from "@/store/useStore";

const MOBILE_NAV = [
  { to: "/", label: "Home", icon: LayoutDashboard, end: true },
  { to: "/students", label: "Students", icon: Users },
  { to: "/generate", label: "Generate", icon: Wand2 },
  { to: "/library", label: "Library", icon: BookOpen },
  { to: "/progress", label: "Progress", icon: TrendingUp },
];

export default function TopBar() {
  const active = useActiveStudent();
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
        className="sticky top-0 z-30 px-4 md:px-6 py-4 backdrop-blur-md bg-bgLight/70 dark:bg-deep-bg/70 border-b-2 border-ss-ink-900 dark:border-white/50"
      >
        <div className="flex items-center justify-between gap-3">
          {/* Mobile brand */}
          <Link to="/" className="lg:hidden flex items-center gap-2">
            <img
              src="/logo.webp"
              alt="Super Sheldon"
              className="w-12 h-auto object-contain drop-shadow"
            />
            <span className="font-display font-extrabold text-ss-ink-900 dark:text-white">Sheldon</span>
          </Link>

          {/* Active Student chip */}
          <div className="flex-1 flex justify-start lg:justify-start">
            <ActiveStudentSelector />
          </div>

          {/* Right chips */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full ss-card">
              <CalendarDays className="w-4 h-4 text-ss-orange-500" strokeWidth={2.2} />
              <span className="text-sm font-semibold text-ss-ink-900 dark:text-white whitespace-nowrap">
                {today}
              </span>
            </div>
            {active ? (
              <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full ss-card">
                <GraduationCap className="w-4 h-4 text-ss-orange-500" strokeWidth={2.2} />
                <div className="flex flex-col leading-tight">
                  <span className="text-[9px] uppercase tracking-[0.14em] font-bold text-ss-ink-500 dark:text-ss-ink-400">
                    Grade
                  </span>
                  <span className="text-sm font-bold text-ss-ink-900 dark:text-white -mt-0.5">
                    {active.grade}
                  </span>
                </div>
              </div>
            ) : null}
            <ThemeToggle />
          </div>
        </div>
      </motion.header>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-3 inset-x-3 z-30 ss-card flex justify-around p-2">
        {MOBILE_NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition ${
                isActive
                  ? "bg-ss-orange-500 text-white"
                  : "text-ss-ink-500 dark:text-ss-ink-300 hover:text-ss-orange-500"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
