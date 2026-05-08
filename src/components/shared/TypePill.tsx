import type { LibraryItemType } from "@/lib/types";

const LABEL: Record<LibraryItemType, string> = {
  diagnostic: "Diagnostic",
  assessment: "Assessment",
  worksheet: "Worksheet",
  lesson_plan: "Lesson Plan",
  presentation: "Presentation",
  game: "Game",
};

const COLOR: Record<LibraryItemType, string> = {
  diagnostic: "bg-teal/10 text-teal",
  assessment: "bg-gold/15 text-[#8a6d00]",
  worksheet: "bg-coral/10 text-coral",
  lesson_plan: "bg-purple/10 text-purple",
  presentation: "bg-[#0072c6]/10 text-[#0072c6]",
  game: "bg-pink-500/10 text-pink-600",
};

export default function TypePill({ type }: { type: LibraryItemType }) {
  return (
    <span
      className={`pill ${COLOR[type]} font-bold`}
      aria-label={`Type: ${LABEL[type]}`}
    >
      {LABEL[type]}
    </span>
  );
}
