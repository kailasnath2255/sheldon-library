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
  diagnostic: "bg-soft-mint dark:bg-deep-mint text-emerald-700 dark:text-emerald-200",
  assessment: "bg-soft-peach dark:bg-deep-peach text-ss-orange-700 dark:text-ss-orange-200",
  worksheet: "bg-soft-yellow dark:bg-deep-cream text-amber-700 dark:text-amber-200",
  lesson_plan: "bg-soft-lavender dark:bg-deep-lavender text-ss-accent-purple dark:text-purple-200",
  presentation: "bg-soft-sky dark:bg-deep-sky text-blue-700 dark:text-blue-200",
  game: "bg-soft-rose dark:bg-deep-rose text-pink-700 dark:text-pink-200",
};

export default function TypePill({ type }: { type: LibraryItemType }) {
  return (
    <span className={`pill ${COLOR[type]} font-bold`} aria-label={`Type: ${LABEL[type]}`}>
      {LABEL[type]}
    </span>
  );
}
