import { useState } from "react";
import { Reorder } from "framer-motion";
import { Check, RefreshCw, Trophy } from "lucide-react";

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function SequenceGame({
  items,
  correctOrder,
}: {
  items: string[];
  correctOrder: number[];
}) {
  const correctSequence = correctOrder.map((i) => items[i]);
  const [order, setOrder] = useState<string[]>(() => shuffle(items));
  const [checked, setChecked] = useState(false);

  const isCorrect = correctSequence.every((v, i) => order[i] === v);

  return (
    <div className="space-y-4 animate-fade-up">
      <h3 className="font-display text-2xl font-bold text-navy">
        Drag to put in the correct order
      </h3>
      <Reorder.Group
        axis="y"
        values={order}
        onReorder={(next) => {
          setOrder(next);
          setChecked(false);
        }}
        className="space-y-2"
      >
        {order.map((item, i) => (
          <Reorder.Item
            key={item}
            value={item}
            className={`px-4 py-3 rounded-xl border-2 cursor-grab active:cursor-grabbing select-none flex items-center gap-3 ${
              checked
                ? item === correctSequence[i]
                  ? "bg-teal/10 border-teal/40"
                  : "bg-coral/10 border-coral/40"
                : "bg-white dark:bg-deep-surface border-navy/15"
            }`}
          >
            <span className="w-7 h-7 rounded-full bg-purple text-white flex items-center justify-center font-bold text-sm">
              {i + 1}
            </span>
            <span className="font-semibold text-navy">{item}</span>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setChecked(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple text-white font-semibold hover:bg-purple/90 transition text-sm"
        >
          <Check className="w-4 h-4" /> Check
        </button>
        <button
          onClick={() => {
            setOrder(shuffle(items));
            setChecked(false);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-navy/15 text-navy font-semibold hover:bg-navy/5 transition text-sm"
        >
          <RefreshCw className="w-4 h-4" /> Shuffle
        </button>
      </div>

      {checked && isCorrect && (
        <div className="bg-teal/5 border border-teal/30 rounded-2xl p-5 flex items-center gap-3">
          <Trophy className="w-8 h-8 text-gold" />
          <p className="font-display font-bold text-navy">
            Perfect order — well done!
          </p>
        </div>
      )}
    </div>
  );
}
