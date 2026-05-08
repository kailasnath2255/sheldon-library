import { useState } from "react";
import { Check, RefreshCw, Trophy } from "lucide-react";

export default function FillBlankGame({
  sentence,
  blanks,
}: {
  sentence: string;
  blanks: string[];
}) {
  const parts = sentence.split(/___+/);
  const [vals, setVals] = useState<string[]>(blanks.map(() => ""));
  const [checked, setChecked] = useState(false);

  const correct = blanks.map(
    (b, i) => vals[i].trim().toLowerCase() === b.trim().toLowerCase()
  );
  const score = correct.filter(Boolean).length;
  const done = checked && score === blanks.length;

  return (
    <div className="space-y-4 animate-fade-up">
      <h3 className="font-display text-2xl font-bold text-navy">
        Fill in the blanks
      </h3>
      <div className="text-xl leading-relaxed text-navy">
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {i < blanks.length && (
              <input
                value={vals[i]}
                onChange={(e) =>
                  setVals((vs) => {
                    const next = [...vs];
                    next[i] = e.target.value;
                    return next;
                  })
                }
                className={`inline-block min-w-[120px] mx-1 px-2 py-0.5 outline-none border-b-2 bg-transparent font-bold ${
                  !checked
                    ? "text-purple border-navy/20"
                    : correct[i]
                    ? "text-teal border-teal"
                    : "text-coral border-coral"
                }`}
              />
            )}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setChecked(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple text-white font-semibold hover:bg-purple/90 transition text-sm"
        >
          <Check className="w-4 h-4" /> Check
        </button>
        <button
          onClick={() => {
            setVals(blanks.map(() => ""));
            setChecked(false);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-navy/15 text-navy font-semibold hover:bg-navy/5 transition text-sm"
        >
          <RefreshCw className="w-4 h-4" /> Reset
        </button>
        {checked && (
          <span className="ml-auto pill bg-purple/10 text-purple">
            {score} / {blanks.length}
          </span>
        )}
      </div>

      {done && (
        <div className="bg-teal/5 border border-teal/30 rounded-2xl p-5 flex items-center gap-3">
          <Trophy className="w-8 h-8 text-gold" />
          <p className="font-display font-bold text-navy">All correct!</p>
        </div>
      )}
    </div>
  );
}
