import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, RefreshCw } from "lucide-react";

type Props = {
  items: string[];
  buckets: { name: string; correctItems: string[] }[];
};

export default function SortGame({ items, buckets }: Props) {
  const [dropped, setDropped] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, boolean>>({});
  const remaining = items.filter((it) => !(it in dropped));
  const done = remaining.length === 0;
  const score = Object.values(feedback).filter(Boolean).length;

  const reset = () => {
    setDropped({});
    setFeedback({});
  };

  const drop = (item: string, bucket: string) => {
    const correct =
      buckets.find((b) => b.name === bucket)?.correctItems.includes(item) ?? false;
    setDropped((d) => ({ ...d, [item]: bucket }));
    setFeedback((f) => ({ ...f, [item]: correct }));
  };

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl font-bold text-navy">
          Sort the items into the right buckets
        </h3>
        <span className="pill bg-purple/10 text-purple">
          Score · {score} / {items.length}
        </span>
      </div>

      <div className="bg-card-presentation rounded-2xl p-4 min-h-[80px] border-2 border-dashed border-purple/30 flex flex-wrap gap-2">
        {remaining.length === 0 ? (
          <p className="text-navy/60 text-sm py-2">All items sorted! 🎉</p>
        ) : (
          remaining.map((it) => (
            <motion.button
              key={it}
              drag
              dragSnapToOrigin
              whileDrag={{ scale: 1.08, zIndex: 10 }}
              onDragEnd={(_, info) => {
                const el = document.elementFromPoint(info.point.x, info.point.y);
                const b = el?.closest<HTMLElement>("[data-bucket]")?.dataset
                  .bucket;
                if (b) drop(it, b);
              }}
              className="px-4 py-2 bg-white dark:bg-deep-surface rounded-xl shadow-soft text-navy font-bold cursor-grab active:cursor-grabbing select-none"
            >
              {it}
            </motion.button>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {buckets.map((b) => (
          <div
            key={b.name}
            data-bucket={b.name}
            className="bg-white dark:bg-deep-surface rounded-2xl border-2 border-dashed border-teal/40 p-4 min-h-[120px]"
          >
            <p className="font-display font-bold text-teal text-lg">{b.name}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {Object.entries(dropped)
                .filter(([, bucket]) => bucket === b.name)
                .map(([item]) => (
                  <span
                    key={item}
                    className={`px-2.5 py-1 rounded-full text-sm font-bold ${
                      feedback[item]
                        ? "bg-teal/15 text-teal"
                        : "bg-coral/15 text-coral"
                    }`}
                  >
                    {feedback[item] ? "✓ " : "✗ "}
                    {item}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>

      {done && (
        <div className="bg-purple/5 border border-purple/30 rounded-2xl p-5 flex items-center gap-3">
          <Trophy className="w-8 h-8 text-gold" />
          <div className="flex-1">
            <p className="font-display font-bold text-navy">Round complete!</p>
            <p className="text-sm text-navy/70">
              {score} of {items.length} correct.
            </p>
          </div>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple text-white font-semibold hover:bg-purple/90 transition text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Play again
          </button>
        </div>
      )}
    </div>
  );
}
