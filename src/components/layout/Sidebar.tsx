import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Wand2,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import OwlMascot from "@/components/shared/OwlMascot";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/students", label: "Students", icon: Users },
  { to: "/generate", label: "Generate", icon: Wand2 },
  { to: "/library", label: "Library", icon: BookOpen },
  { to: "/progress", label: "Progress", icon: TrendingUp },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-white border-r border-navy/5 sticky top-0 h-screen">
      <div className="px-5 py-6 flex items-center gap-3 border-b border-navy/5">
        <OwlMascot size={44} />
        <div>
          <h1 className="font-display font-extrabold text-lg leading-none text-navy">
            Sheldon's
          </h1>
          <p className="font-display font-bold text-purple text-sm">Library v2</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition ${
                isActive
                  ? "bg-purple text-white shadow-sm"
                  : "text-navy hover:bg-navy/5"
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" strokeWidth={2.2} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-navy/5">
        <p className="text-[11px] uppercase tracking-[0.08em] font-bold text-navy/50 mb-1">
          Powered by
        </p>
        <p className="text-sm font-semibold text-navy">Claude Sonnet 4.5</p>
        <p className="text-xs text-navy/50 mt-2">v2.0 · Sheldon Labs</p>
      </div>
    </aside>
  );
}
