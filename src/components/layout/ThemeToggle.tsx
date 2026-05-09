import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="relative inline-flex items-center justify-center w-11 h-11 rounded-full bg-white border-2 border-ss-ink-900 shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5 active:translate-y-0 transition dark:bg-deep-surface dark:border-white/50"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ rotate: -45, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 45, opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon className="w-[18px] h-[18px] text-ss-orange-400" strokeWidth={2.4} />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 45, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -45, opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sun className="w-[18px] h-[18px] text-ss-orange-500" strokeWidth={2.4} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
