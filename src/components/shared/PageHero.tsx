import type { ReactNode } from "react";
import { motion } from "framer-motion";

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  right,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6"
    >
      <div>
        {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
        <h1 className="ss-display text-4xl md:text-5xl text-ss-ink-900 dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-ss-ink-500 dark:text-ss-ink-300 mt-3 text-base max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {right}
    </motion.div>
  );
}
