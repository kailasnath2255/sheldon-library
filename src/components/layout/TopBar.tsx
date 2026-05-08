import { Link, NavLink } from "react-router-dom";
import { CalendarDays, LayoutDashboard, Users, Wand2, BookOpen, TrendingUp } from "lucide-react";
import OwlMascot from "@/components/shared/OwlMascot";
import ActiveStudentSelector from "./ActiveStudentSelector";

const MOBILE_NAV = [
  { to: "/", label: "Home", icon: LayoutDashboard, end: true },
  { to: "/students", label: "Students", icon: Users },
  { to: "/generate", label: "Generate", icon: Wand2 },
  { to: "/library", label: "Library", icon: BookOpen },
  { to: "/progress", label: "Progress", icon: TrendingUp },
];

export default function TopBar() {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm border-b border-navy/5 sticky top-0 z-30">
        <div className="px-4 md:px-8 py-3 flex items-center justify-between gap-3">
          <Link to="/" className="lg:hidden flex items-center gap-2">
            <OwlMascot size={32} />
            <span className="font-display font-extrabold text-navy">Sheldon's</span>
          </Link>
          <div className="hidden md:flex items-center gap-2 text-sm text-navy/60 ml-1">
            <CalendarDays className="w-4 h-4" />
            <span>{today}</span>
          </div>
          <div className="flex items-center gap-3">
            <ActiveStudentSelector />
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-navy/5 flex justify-around py-2">
        {MOBILE_NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                isActive ? "text-purple" : "text-navy/60"
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
