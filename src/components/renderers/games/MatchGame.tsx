import { useMemo, useState } from "react";
import { Trophy, RefreshCw, CheckCircle2 } from "lucide-react";

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function MatchGame({
  pairs,
}: {
  pairs: { left: string; right: string }[];
}) {
  const lefts = useMemo(() => pairs.map((p) => p.left), [pairs]);
  const rights = useMemo(() => shuffle(pairs.map((p) => p.right)), [pairs]);

  const [picked, setPicked] = useState<{
    left: string | null;
    right: string | null;
  }>({ left: null, right: null });
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [misses, setMisses] = useState(0);
  const [version, setVersion] = useState(0);

  const onPick = (side: "left" | "right", v: string) => {
    if (Object.values(matches).includes(v) || v in matches) return;
    const next = { ...picked, [side]: v };
    setPicked(next);
    if (next.left && next.right) {
      const correct = pairs.find((p) => p.left === next.left)?.right === next.right;
      if (correct) {
        setMatches((m) => ({ ...m, [next.left!]: next.right! }));
      } else {
        setMisses((m) => m + 1);
      }
      setTimeout(() => setPicked({ left: null, right: null }), 600);
    }
  };

  const done = Object.keys(matches).length === pairs.length;
  const reset = () => {
    setMatches({});
    setMisses(0);
    setPicked({ left: null, right: null });
    setVersion((v) => v + 1);
  };

  return (
    <div key={version} className="space-y-4 animate-fade-up">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl font-bold text-navy">
          Match each pair
        </h3>
        <div className="flex gap-2">
          <span className="pill bg-teal/10 text-teal">
            ✓ {Object.keys(matches).length}
          </span>
          <span className="pill bg-coral/10 text-coral">✗ {misses}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          {lefts.map((l) => {
            const matched = l in matches;
            const isPicked = picked.left === l;
            return (
              <button
                key={l}
                onClick={() => onPick("left", l)}
                disabled={matched}
                className={`w-full px-4 py-3 rounded-xl border-2 text-left font-semibold transition ${
                  matched
                    ? "bg-teal/10 border-teal/40 text-teal"
                    : isPicked
                    ? "bg-purple/10 border-purple text-purple"
                    : "bg-white dark:bg-deep-surface border-navy/15 text-navy hover:border-purple/40"
                }`}
              >
                {matched && <CheckCircle2 className="w-4 h-4 inline mr-1" />}
                {l}
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          {rights.map((r) => {
            const matched = Object.values(matches).includes(r);
            const isPicked = picked.right === r;
            return (
              <button
                key={r}
                onClick={() => onPick("right", r)}
                disabled={matched}
                className={`w-full px-4 py-3 rounded-xl border-2 text-left font-semibold transition ${
                  matched
                    ? "bg-teal/10 border-teal/40 text-teal"
                    : isPicked
                    ? "bg-purple/10 border-purple text-purple"
                    : "bg-white dark:bg-deep-surface border-navy/15 text-navy hover:border-purple/40"
                }`}
              >
                {matched && <CheckCircle2 className="w-4 h-4 inline mr-1" />}
                {r}
              </button>
            );
          })}
        </div>
      </div>

      {done && (
        <div className="bg-teal/5 border border-teal/30 rounded-2xl p-5 flex items-center gap-3">
          <Trophy className="w-8 h-8 text-gold" />
          <div className="flex-1">
            <p className="font-display font-bold text-navy">All matched!</p>
            <p className="text-sm text-navy/70">{misses} miss(es).</p>
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
