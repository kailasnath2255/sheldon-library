import QuizRenderer from "../QuizRenderer";

export default function QuizGame({
  questions,
}: {
  questions: { text: string; options: string[]; correctIndex: number }[];
}) {
  const mapped = questions.map((q, i) => ({
    id: `g${i}`,
    text: q.text,
    options: q.options,
    correctIndex: q.correctIndex,
  }));
  return <QuizRenderer mode="assessment" questions={mapped} />;
}
