import type { GamePayload } from "@/lib/types";
import SortGame from "./games/SortGame";
import MatchGame from "./games/MatchGame";
import SequenceGame from "./games/SequenceGame";
import FillBlankGame from "./games/FillBlankGame";
import QuizGame from "./games/QuizGame";

export default function GameRenderer({ data }: { data: GamePayload }) {
  switch (data.gameType) {
    case "sort":
      return <SortGame items={data.payload.items} buckets={data.payload.buckets} />;
    case "match":
      return <MatchGame pairs={data.payload.pairs} />;
    case "sequence":
      return (
        <SequenceGame
          items={data.payload.items}
          correctOrder={data.payload.correctOrder}
        />
      );
    case "fill-blank":
      return (
        <FillBlankGame
          sentence={data.payload.sentence}
          blanks={data.payload.blanks}
        />
      );
    case "quiz":
      return <QuizGame questions={data.payload.questions} />;
    default:
      return <p className="text-navy/60">Unknown game type.</p>;
  }
}
