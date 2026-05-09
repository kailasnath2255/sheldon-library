import type { ReactNode } from "react";
import { motion } from "framer-motion";

type Tone = "lavender" | "peach" | "mint" | "rose" | "sky" | "cream" | "yellow";

const TONE_BG: Record<Tone, string> = {
  lavender: "bg-soft-lavender dark:bg-deep-lavender",
  peach: "bg-soft-peach dark:bg-deep-peach",
  mint: "bg-soft-mint dark:bg-deep-mint",
  rose: "bg-soft-rose dark:bg-deep-rose",
  sky: "bg-soft-sky dark:bg-deep-sky",
  cream: "bg-soft-cream dark:bg-deep-cream",
  yellow: "bg-soft-yellow dark:bg-deep-cream",
};

export default function PastelBlock({
  tone = "lavender",
  className = "",
  children,
  delay = 0,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1], delay }}
      className={`${TONE_BG[tone]} rounded-3xl p-6 md:p-10 ss-edge transition-colors duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
}
