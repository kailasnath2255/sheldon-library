import type { ReactNode } from "react";
import { motion } from "framer-motion";

type Tone = "lavender" | "peach" | "mint" | "rose" | "sky" | "cream" | "yellow" | "white";

const TONE_BG: Record<Tone, string> = {
  lavender: "bg-soft-lavender dark:bg-deep-lavender",
  peach: "bg-soft-peach dark:bg-deep-peach",
  mint: "bg-soft-mint dark:bg-deep-mint",
  rose: "bg-soft-rose dark:bg-deep-rose",
  sky: "bg-soft-sky dark:bg-deep-sky",
  cream: "bg-soft-cream dark:bg-deep-cream",
  yellow: "bg-soft-yellow dark:bg-deep-cream",
  white: "bg-white dark:bg-deep-surface",
};

export default function EyebrowCard({
  eyebrow,
  title,
  subtitle,
  tone = "white",
  icon,
  className = "",
  delay = 0,
  href,
  onClick,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  tone?: Tone;
  icon?: ReactNode;
  className?: string;
  delay?: number;
  href?: string;
  onClick?: () => void;
}) {
  const inner = (
    <div
      className={`${TONE_BG[tone]} h-full rounded-3xl p-5 md:p-6 ss-edge flex flex-col ${
        href || onClick ? "cursor-pointer" : ""
      } transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-soft-lg ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-ss-ink-500 dark:text-ss-ink-300">
          {eyebrow}
        </p>
        {icon ? <div className="text-ss-ink-900 dark:text-white">{icon}</div> : null}
      </div>
      <h3 className="mt-3 font-display font-extrabold text-2xl md:text-3xl leading-[1.05] text-ss-ink-900 dark:text-white">
        {title}
      </h3>
      {subtitle ? (
        <p className="mt-2 text-sm text-ss-ink-500 dark:text-ss-ink-300 leading-snug">
          {subtitle}
        </p>
      ) : null}
    </div>
  );

  const wrapperCls = "h-full";

  if (href) {
    return (
      <motion.a
        href={href}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1], delay }}
        className={wrapperCls + " block"}
      >
        {inner}
      </motion.a>
    );
  }

  if (onClick) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1], delay }}
        className={wrapperCls + " text-left w-full"}
      >
        {inner}
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1], delay }}
      className={wrapperCls}
    >
      {inner}
    </motion.div>
  );
}
