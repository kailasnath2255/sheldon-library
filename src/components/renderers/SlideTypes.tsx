import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import OwlMascot from "@/components/shared/OwlMascot";
import type { Slide } from "@/lib/types";

const sectionStyle =
  "rounded-3xl w-full h-full flex flex-col p-4 sm:p-8 md:p-12 overflow-auto scrollbar-thin";

export const TitleSlide = ({ slide }: { slide: Slide }) => (
  <div
    className={`${sectionStyle} bg-gradient-to-br from-purple via-[#8e7df8] to-card-presentation text-white`}
  >
    <div className="flex-1 flex items-center">
      <div className="flex-1">
        <p className="pill bg-white/20 text-white">Title</p>
        <h1 className="font-display text-3xl sm:text-5xl md:text-7xl font-extrabold leading-[1.05] mt-4">
          {slide.title}
        </h1>
        {slide.body && (
          <p className="text-white/80 text-base sm:text-lg mt-4 max-w-xl">{slide.body}</p>
        )}
      </div>
      <div className="hidden md:block">
        <OwlMascot size={220} />
      </div>
    </div>
  </div>
);

export const DefinitionSlide = ({ slide }: { slide: Slide }) => (
  <div className={`${sectionStyle} bg-card-lessonplan text-navy`}>
    <p className="pill bg-purple/15 text-purple">Definition</p>
    <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold mt-4">
      {slide.title}
    </h2>
    <div className="mt-8 bg-white/70 rounded-2xl p-6 max-w-2xl">
      <p className="text-3xl font-display font-extrabold text-purple">
        {slide.definition?.term}
      </p>
      <p className="text-navy/80 text-lg mt-3 leading-relaxed">
        {slide.definition?.meaning}
      </p>
    </div>
  </div>
);

export const ImageCaptionSlide = ({ slide }: { slide: Slide }) => (
  <div className={`${sectionStyle} bg-card-presentation text-navy`}>
    <p className="pill bg-purple/15 text-purple">Visual</p>
    <h2 className="font-display text-xl sm:text-3xl md:text-4xl font-extrabold mt-3">
      {slide.title}
    </h2>
    <div className="flex-1 flex items-center justify-center">
      <div className="text-9xl">{slide.imageCaption?.emoji ?? "🌟"}</div>
    </div>
    <p className="text-center text-navy/80 text-xl">
      {slide.imageCaption?.caption ?? slide.body}
    </p>
  </div>
);

export const CompareSlide = ({ slide }: { slide: Slide }) => (
  <div className={`${sectionStyle} bg-card-diagnostic text-navy`}>
    <p className="pill bg-teal/15 text-teal">Compare</p>
    <h2 className="font-display text-xl sm:text-3xl md:text-4xl font-extrabold mt-3">
      {slide.title}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 flex-1">
      {[slide.compare?.left, slide.compare?.right].map((col, i) => (
        <div
          key={i}
          className="bg-white/70 rounded-2xl p-5"
        >
          <p className="font-display font-extrabold text-2xl text-purple">
            {col?.title}
          </p>
          <ul className="mt-3 space-y-2">
            {col?.points.map((p, j) => (
              <li key={j} className="text-navy/80 flex gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple mt-2 shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

export const IDoWeDoYouDoSlide = ({ slide }: { slide: Slide }) => {
  const [step, setStep] = useState(0);
  const cols = [
    { label: "I Do", body: slide.iwy?.iDo, color: "purple" },
    { label: "We Do", body: slide.iwy?.weDo, color: "teal" },
    { label: "You Do", body: slide.iwy?.youDo, color: "gold" },
  ];
  return (
    <div className={`${sectionStyle} bg-card-games text-navy`}>
      <p className="pill bg-purple/15 text-purple">Activity · I Do · We Do · You Do</p>
      <h2 className="font-display text-xl sm:text-3xl md:text-4xl font-extrabold mt-3">
        {slide.title}
      </h2>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
        {cols.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: i <= step ? 1 : 0.25,
              y: i <= step ? 0 : 10,
            }}
            transition={{ duration: 0.35 }}
            className="bg-white/80 rounded-2xl p-5 flex flex-col"
          >
            <p
              className={`pill bg-${c.color}/15 text-${c.color}`}
              style={
                c.color === "purple"
                  ? { background: "rgba(108,92,231,0.15)", color: "#6C5CE7" }
                  : c.color === "teal"
                  ? { background: "rgba(15,163,163,0.15)", color: "#0FA3A3" }
                  : { background: "rgba(244,180,0,0.15)", color: "#8a6d00" }
              }
            >
              {c.label}
            </p>
            <p className="text-navy/85 mt-3">{c.body}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="px-3 py-1.5 rounded-lg border border-navy/20 text-sm font-semibold"
        >
          Back
        </button>
        <button
          onClick={() => setStep((s) => Math.min(2, s + 1))}
          className="px-3 py-1.5 rounded-lg bg-purple text-white text-sm font-semibold"
        >
          Reveal next
        </button>
      </div>
    </div>
  );
};

export const QuizSlide = ({ slide }: { slide: Slide }) => {
  const [picked, setPicked] = useState<number | null>(null);
  const correct = slide.quiz?.correctIndex ?? -1;
  const isCorrect = picked === correct;
  return (
    <div className={`${sectionStyle} bg-card-assessment text-navy`}>
      <p className="pill bg-coral/10 text-coral">Quick check</p>
      <h2 className="font-display text-2xl md:text-3xl font-extrabold mt-3">
        {slide.quiz?.question ?? slide.title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
        {slide.quiz?.options.map((opt, i) => {
          const showResult = picked !== null;
          const isThisCorrect = i === correct;
          const isThisPicked = i === picked;
          return (
            <button
              key={i}
              onClick={() => picked === null && setPicked(i)}
              className={`text-left rounded-2xl border-2 p-4 transition ${
                showResult && isThisCorrect
                  ? "bg-teal/10 border-teal"
                  : showResult && isThisPicked
                  ? "bg-coral/10 border-coral"
                  : "bg-white dark:bg-deep-surface border-navy/10 hover:border-purple/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-navy/5 text-navy font-bold flex items-center justify-center shrink-0">
                  {String.fromCharCode(65 + i)}
                </div>
                <p className="text-navy font-medium pt-1">{opt}</p>
                {showResult && isThisCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-teal ml-auto shrink-0 mt-1" />
                )}
                {showResult && isThisPicked && !isThisCorrect && (
                  <XCircle className="w-5 h-5 text-coral ml-auto shrink-0 mt-1" />
                )}
              </div>
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div
          className={`mt-4 rounded-xl p-3 text-sm ${
            isCorrect ? "bg-teal/10 text-teal" : "bg-coral/10 text-coral"
          }`}
        >
          <b>{isCorrect ? "Correct!" : "Not quite."}</b>{" "}
          {slide.quiz?.explanation}
        </div>
      )}
    </div>
  );
};

export const DragSortSlide = ({ slide }: { slide: Slide }) => {
  const items = slide.dragSort?.items ?? [];
  const buckets = slide.dragSort?.buckets ?? [];
  const [dropped, setDropped] = useState<Record<string, string | null>>({});
  const [feedback, setFeedback] = useState<Record<string, boolean | null>>({});

  const remaining = items.filter((it) => !dropped[it]);

  const onDrop = (item: string, bucket: string) => {
    const correct =
      buckets
        .find((b) => b.name === bucket)
        ?.correctItems.includes(item) ?? false;
    setDropped((d) => ({ ...d, [item]: bucket }));
    setFeedback((f) => ({ ...f, [item]: correct }));
  };

  return (
    <div className={`${sectionStyle} bg-card-presentation text-navy`}>
      <p className="pill bg-purple/15 text-purple">Drag · Sort</p>
      <h2 className="font-display text-3xl font-extrabold mt-3">
        {slide.title}
      </h2>

      <div className="mt-5 flex flex-wrap gap-2 min-h-[60px] bg-white/40 rounded-xl p-3 border-2 border-dashed border-navy/15">
        {remaining.map((it) => (
          <motion.button
            key={it}
            drag
            dragSnapToOrigin
            whileDrag={{ scale: 1.05, zIndex: 10 }}
            onDragEnd={(_, info) => {
              const el = document.elementFromPoint(info.point.x, info.point.y);
              const bucket = el?.closest<HTMLElement>("[data-bucket]")?.dataset.bucket;
              if (bucket) onDrop(it, bucket);
            }}
            className="px-4 py-2 rounded-xl bg-white dark:bg-deep-surface shadow-soft text-navy font-semibold cursor-grab active:cursor-grabbing"
          >
            {it}
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 flex-1">
        {buckets.map((b) => (
          <div
            key={b.name}
            data-bucket={b.name}
            className="bg-white/70 rounded-2xl p-4 border-2 border-dashed border-purple/30 flex flex-col"
          >
            <p className="font-display font-bold text-purple">{b.name}</p>
            <div className="flex flex-wrap gap-1.5 mt-2 flex-1 content-start">
              {Object.entries(dropped)
                .filter(([, bucket]) => bucket === b.name)
                .map(([item]) => (
                  <span
                    key={item}
                    className={`px-2.5 py-1 rounded-full text-sm font-semibold ${
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
    </div>
  );
};

export const FillBlankSlide = ({ slide }: { slide: Slide }) => {
  const sentence = slide.fillBlank?.sentence ?? "";
  const blanks = slide.fillBlank?.blanks ?? [];
  const [vals, setVals] = useState<string[]>(blanks.map(() => ""));
  const parts = sentence.split(/___+/);
  return (
    <div className={`${sectionStyle} bg-card-worksheet text-navy`}>
      <p className="pill bg-purple/15 text-purple">Fill in the blank</p>
      <h2 className="font-display text-3xl font-extrabold mt-3">{slide.title}</h2>
      <div className="mt-6 text-2xl leading-relaxed text-navy">
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {i < blanks.length && (
              <input
                value={vals[i] ?? ""}
                onChange={(e) =>
                  setVals((vs) => {
                    const next = [...vs];
                    next[i] = e.target.value;
                    return next;
                  })
                }
                className={`inline-block min-w-[120px] mx-1 px-2 py-0.5 border-b-4 outline-none bg-transparent text-purple font-bold ${
                  vals[i]
                    ? vals[i].trim().toLowerCase() ===
                      blanks[i].trim().toLowerCase()
                      ? "border-teal"
                      : "border-coral"
                    : "border-navy/20"
                }`}
              />
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export const VideoSlide = ({ slide }: { slide: Slide }) => (
  <div className={`${sectionStyle} bg-navy text-white`}>
    <p className="pill bg-white/15 text-white">Watch</p>
    <h2 className="font-display text-3xl font-extrabold mt-3">{slide.title}</h2>
    <div className="flex-1 mt-4 rounded-2xl overflow-hidden bg-black">
      <iframe
        src={slide.video?.url}
        title={slide.title}
        className="w-full h-full min-h-[300px]"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
    {slide.video?.caption && (
      <p className="text-white/80 text-sm mt-3">{slide.video.caption}</p>
    )}
  </div>
);

export const TakeawaySlide = ({ slide }: { slide: Slide }) => (
  <div
    className={`${sectionStyle} bg-gradient-to-br from-card-diagnostic to-teal/30 text-navy relative`}
  >
    <p className="pill bg-purple/15 text-purple">Key takeaways</p>
    <h2 className="font-display text-4xl font-extrabold mt-3">
      {slide.title || "What we learned"}
    </h2>
    <ul className="mt-6 space-y-3 text-lg">
      {slide.takeaway?.points.map((p, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}
          className="bg-white/70 rounded-xl px-4 py-3 flex gap-3 items-start"
        >
          <span className="w-7 h-7 rounded-full bg-purple text-white flex items-center justify-center font-bold shrink-0 text-sm">
            {i + 1}
          </span>
          {p}
        </motion.li>
      ))}
    </ul>
  </div>
);

export const renderSlide = (slide: Slide) => {
  switch (slide.type) {
    case "title":
      return <TitleSlide slide={slide} />;
    case "definition":
      return <DefinitionSlide slide={slide} />;
    case "image_caption":
      return <ImageCaptionSlide slide={slide} />;
    case "compare":
      return <CompareSlide slide={slide} />;
    case "ido_wedo_youdo":
      return <IDoWeDoYouDoSlide slide={slide} />;
    case "quiz":
      return <QuizSlide slide={slide} />;
    case "drag_sort":
      return <DragSortSlide slide={slide} />;
    case "fill_blank":
      return <FillBlankSlide slide={slide} />;
    case "video":
      return <VideoSlide slide={slide} />;
    case "takeaway":
      return <TakeawaySlide slide={slide} />;
    default:
      return (
        <div className="rounded-3xl bg-white dark:bg-deep-surface p-10 h-full flex items-center justify-center">
          <pre className="text-xs">{JSON.stringify(slide, null, 2)}</pre>
        </div>
      );
  }
};
