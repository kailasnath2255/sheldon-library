import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Wand2,
  Stethoscope,
  ClipboardList,
  FileText,
  BookOpen,
  Presentation,
  Gamepad2,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import PageHero from "@/components/shared/PageHero";
import EmptyState from "@/components/shared/EmptyState";
import LoadingState from "@/components/shared/LoadingState";
import OwlMascot from "@/components/shared/OwlMascot";
import { Link } from "react-router-dom";
import { RefreshCw } from "lucide-react";

import DiagnosticForm, {
  type DiagnosticFormValues,
} from "@/components/generators/DiagnosticForm";
import AssessmentForm, {
  type AssessmentFormValues,
} from "@/components/generators/AssessmentForm";
import WorksheetForm, {
  type WorksheetFormValues,
} from "@/components/generators/WorksheetForm";
import LessonPlanForm, {
  type LessonPlanFormValues,
} from "@/components/generators/LessonPlanForm";
import PresentationForm, {
  type PresentationFormValues,
} from "@/components/generators/PresentationForm";
import GameForm, { type GameFormValues } from "@/components/generators/GameForm";
import ModelSelector from "@/components/generators/ModelSelector";
import { DEFAULT_MODEL_ID, modelToPayload, modelsForTool } from "@/lib/models";

import QuizRenderer from "@/components/renderers/QuizRenderer";
import WorksheetRenderer from "@/components/renderers/WorksheetRenderer";
import LessonPlanRenderer from "@/components/renderers/LessonPlanRenderer";
import PresentationRenderer from "@/components/renderers/PresentationRenderer";
import GameRenderer from "@/components/renderers/GameRenderer";
import HTMLContentRenderer from "@/components/renderers/HTMLContentRenderer";
import MarkdownContentRenderer from "@/components/renderers/MarkdownContentRenderer";
import TemplatedPresentationRenderer from "@/components/renderers/TemplatedPresentationRenderer";
import TemplatedGameRenderer from "@/components/renderers/TemplatedGameRenderer";
import TemplatedWorksheetRenderer from "@/components/renderers/TemplatedWorksheetRenderer";
import TemplatedLessonPlanRenderer from "@/components/renderers/TemplatedLessonPlanRenderer";
import TemplatedQuizRenderer from "@/components/renderers/TemplatedQuizRenderer";

import {
  analyzeDiagnostic,
  generateAssessment,
  generateDiagnostic,
  generateGame,
  generateLessonPlan,
  generatePresentation,
  generateWorksheet,
  validateTopic,
  type TopicValidation,
} from "@/lib/api";
import { quickTopicCheck } from "@/lib/topic-heuristic";
import { useStore, useActiveStudent } from "@/store/useStore";
import type {
  AnalysisResponse,
  AssessmentResponse,
  Country,
  DiagnosticResponse,
  FlexibleResponse,
  GamePayload,
  LessonPlanResponse,
  LibraryItemType,
  PresentationResponse,
  WorksheetResponse,
} from "@/lib/types";
import { inputCls } from "@/components/generators/shared";

type Tool = "diagnostic" | "assessment" | "worksheet" | "lessonplan" | "presentation" | "games";

const TOOL_INFO: Record<
  Tool,
  { label: string; icon: any; bg: string; libraryType: LibraryItemType }
> = {
  diagnostic: {
    label: "Diagnostic Test",
    icon: Stethoscope,
    bg: "bg-card-diagnostic",
    libraryType: "diagnostic",
  },
  assessment: {
    label: "Assessment",
    icon: ClipboardList,
    bg: "bg-card-assessment",
    libraryType: "assessment",
  },
  worksheet: {
    label: "Worksheet",
    icon: FileText,
    bg: "bg-card-worksheet",
    libraryType: "worksheet",
  },
  lessonplan: {
    label: "Lesson Plan",
    icon: BookOpen,
    bg: "bg-card-lessonplan",
    libraryType: "lesson_plan",
  },
  presentation: {
    label: "Presentation",
    icon: Presentation,
    bg: "bg-card-presentation",
    libraryType: "presentation",
  },
  games: {
    label: "Game",
    icon: Gamepad2,
    bg: "bg-card-games",
    libraryType: "game",
  },
};

const COUNTRIES: Country[] = ["UK", "Australia", "India", "USA", "Singapore", "NZ"];

type GenerationOutput =
  | { type: "diagnostic"; data: DiagnosticResponse | FlexibleResponse }
  | { type: "assessment"; data: AssessmentResponse | FlexibleResponse }
  | { type: "worksheet"; data: WorksheetResponse | FlexibleResponse }
  | { type: "lessonplan"; data: LessonPlanResponse | FlexibleResponse }
  | { type: "presentation"; data: PresentationResponse | FlexibleResponse }
  | { type: "games"; data: GamePayload | FlexibleResponse };

export default function Generate() {
  const [params, setParams] = useSearchParams();
  const initialTool = (params.get("tool") as Tool | null) ?? null;
  const [tool, setTool] = useState<Tool | null>(initialTool);

  const active = useActiveStudent();
  const { saveLibraryItem, saveAttempt, libraryItems } = useStore();

  // Class context (from active student, editable per-generation)
  const [grade, setGrade] = useState<number>(active?.grade ?? 5);
  const [country, setCountry] = useState<Country>(active?.country ?? "UK");
  const [subject, setSubject] = useState<string>(active?.subject ?? "Maths");
  const [model, setModel] = useState<string>(DEFAULT_MODEL_ID);

  useEffect(() => {
    if (active) {
      setGrade(active.grade);
      setCountry(active.country);
      setSubject(active.subject);
    }
  }, [active?.id]); // eslint-disable-line

  // If the current model isn't allowed for the newly selected tool, snap back to Claude.
  useEffect(() => {
    if (!tool) return;
    const allowed = modelsForTool(tool).map((m) => m.id);
    if (!allowed.includes(model)) setModel(DEFAULT_MODEL_ID);
  }, [tool]); // eslint-disable-line

  // Form states
  const [diagnosticForm, setDiagnosticForm] = useState<DiagnosticFormValues>({
    goal: "Curriculum Alignment",
    numQuestions: 20,
  });
  const [assessmentForm, setAssessmentForm] = useState<AssessmentFormValues>({
    topics: [],
    subtopics: [],
    timed: true,
    totalTime: 30,
    marks: 20,
    numQ: 10,
    difficulty: "Medium",
  });
  const [worksheetForm, setWorksheetForm] = useState<WorksheetFormValues>({
    topic: "",
    subtopic: "",
    type: "Homework",
    sections: ["MCQs", "Fill in the blanks", "Match the following"],
  });
  const [lessonPlanForm, setLessonPlanForm] = useState<LessonPlanFormValues>({
    topic: "",
    subtopic: "",
    duration: 60,
  });
  const [presentationForm, setPresentationForm] = useState<PresentationFormValues>({
    topic: "",
    subtopic: "",
    duration: 60,
    difficulty: "Medium",
  });
  const [gameForm, setGameForm] = useState<GameFormValues>({
    topic: "",
    subtopic: "",
    gameStyle: "sort",
  });

  const [output, setOutput] = useState<GenerationOutput | null>(null);
  const [savedLibraryItemId, setSavedLibraryItemId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topicValidation, setTopicValidation] = useState<TopicValidation | null>(null);
  // Hard-block from the instant heuristic (wrong subject). Separate from
  // the Groq grade-level check so we can keep that one a soft warning while
  // blocking on the unambiguous mismatch case.
  const [topicHardBlock, setTopicHardBlock] = useState<{ reason: string } | null>(null);
  // Teacher can force-override the hard block. Resets whenever the topic
  // or subject changes so the override is always a conscious decision.
  const [topicOverride, setTopicOverride] = useState<boolean>(false);

  // Compute the current topic for whatever tool is active. Used to drive
  // the background topic-vs-subject-vs-grade validator below.
  const currentTopic = useMemo(() => {
    if (tool === "presentation") return presentationForm.topic.trim();
    if (tool === "lessonplan") return lessonPlanForm.topic.trim();
    if (tool === "worksheet") return worksheetForm.topic.trim();
    if (tool === "games") return gameForm.topic.trim();
    if (tool === "assessment") return assessmentForm.topics[0]?.trim() || "";
    return "";
  }, [tool, presentationForm.topic, lessonPlanForm.topic, worksheetForm.topic, gameForm.topic, assessmentForm.topics]);

  // Two-layer topic validation:
  // 1. INSTANT client-side heuristic catches obvious subject mismatches
  //    ("python" for Maths, "Shakespeare" for Science) with no network call.
  // 2. DEBOUNCED Groq Llama call (~800ms after stop typing) catches the
  //    grade-appropriateness case the heuristic can't see ("addition" for
  //    Grade 11 Maths). Fails open — never blocks generation.
  useEffect(() => {
    setTopicValidation(null);
    setTopicHardBlock(null);
    setTopicOverride(false); // Override always resets when inputs change.
    if (!tool || !currentTopic || currentTopic.length < 3 || !subject) return;

    // Layer 1 — instant heuristic. Catches clear subject mismatches
    // (e.g. "python" entered as a Maths topic). HARD-BLOCKS generation —
    // a mismatch here would silently produce wrong-subject content.
    const quick = quickTopicCheck(currentTopic, subject);
    if (!quick.ok) {
      setTopicHardBlock({ reason: quick.reason ?? "Topic doesn't match the student's subject." });
      return; // Heuristic was confident; skip the LLM call.
    }

    // Layer 2 — debounced Groq grade-level check. Stays a soft advisory.
    const handle = setTimeout(() => {
      validateTopic({
        topic: currentTopic,
        subject,
        grade,
        region: country,
      })
        .then((v) => setTopicValidation(v))
        .catch(() => setTopicValidation(null));
    }, 800);
    return () => clearTimeout(handle);
  }, [tool, currentTopic, subject, grade, country]);

  const setToolAndUrl = (t: Tool | null) => {
    setTool(t);
    setOutput(null);
    setSavedLibraryItemId(null);
    setError(null);
    const np = new URLSearchParams(params);
    if (t) np.set("tool", t);
    else np.delete("tool");
    setParams(np, { replace: true });
  };

  const canGenerate =
    (!topicHardBlock || topicOverride) &&
    !!active &&
    !!tool &&
    (tool === "diagnostic"
      ? true
      : tool === "assessment"
      ? assessmentForm.topics.length > 0
      : tool === "worksheet"
      ? !!worksheetForm.topic && worksheetForm.sections.length > 0
      : tool === "lessonplan"
      ? !!lessonPlanForm.topic
      : tool === "presentation"
      ? !!presentationForm.topic
      : tool === "games"
      ? !!gameForm.topic
      : false);

  const handleGenerate = async () => {
    if (!tool || !active) return;
    setLoading(true);
    setError(null);
    setOutput(null);
    setSavedLibraryItemId(null);

    try {
      let result: GenerationOutput;
      let title = "";
      switch (tool) {
        case "diagnostic": {
          const data = await generateDiagnostic({
            studentId: active.id,
            name: active.name,
            grade,
            region: country,
            subject,
            goal: diagnosticForm.goal,
            numQuestions: diagnosticForm.numQuestions,
            ...modelToPayload(model),
          });
          result = { type: "diagnostic", data };
          title = `Diagnostic · Grade ${grade - 1} ${subject} review`;
          break;
        }
        case "assessment": {
          const data = await generateAssessment({
            topics: assessmentForm.topics,
            subtopics: assessmentForm.subtopics,
            timed: assessmentForm.timed,
            totalTime: assessmentForm.totalTime,
            marks: assessmentForm.marks,
            numQ: assessmentForm.numQ,
            difficulty: assessmentForm.difficulty,
            grade,
            subject,
            region: country,
            ...modelToPayload(model),
          });
          result = { type: "assessment", data };
          title = `Assessment · ${assessmentForm.topics.join(", ") || subject}`;
          break;
        }
        case "worksheet": {
          const data = await generateWorksheet({
            topic: worksheetForm.topic,
            subtopic: worksheetForm.subtopic,
            type: worksheetForm.type,
            sections: worksheetForm.sections,
            grade,
            subject,
            region: country,
            ...modelToPayload(model),
          });
          result = { type: "worksheet", data };
          title = `Worksheet · ${worksheetForm.topic}`;
          break;
        }
        case "lessonplan": {
          const data = await generateLessonPlan({
            topic: lessonPlanForm.topic,
            subtopic: lessonPlanForm.subtopic,
            duration: lessonPlanForm.duration,
            grade,
            subject,
            region: country,
            ...modelToPayload(model),
          });
          result = { type: "lessonplan", data };
          title = `Lesson Plan · ${lessonPlanForm.topic} (${lessonPlanForm.duration}m)`;
          break;
        }
        case "presentation": {
          const data = await generatePresentation({
            topic: presentationForm.topic,
            subtopic: presentationForm.subtopic,
            duration: presentationForm.duration,
            difficulty: presentationForm.difficulty,
            grade,
            subject,
            region: country,
            ...modelToPayload(model),
          });
          result = { type: "presentation", data };
          title = `Presentation · ${presentationForm.topic}`;
          break;
        }
        case "games": {
          const data = await generateGame({
            topic: gameForm.topic,
            subtopic: gameForm.subtopic,
            gameStyle: gameForm.gameStyle,
            grade,
            subject,
            region: country,
            ...modelToPayload(model),
          });
          result = { type: "games", data };
          title = `Game · ${gameForm.topic} (${gameForm.gameStyle})`;
          break;
        }
        default:
          return;
      }

      setOutput(result);

      // Auto-save to Library
      try {
        const saved = await saveLibraryItem({
          type: TOOL_INFO[tool].libraryType,
          title,
          studentId: active.id,
          payload: result.data,
        });
        setSavedLibraryItemId(saved.id);
        toast.success("Generated! Saved to library.");
      } catch (e) {
        toast.error("Generated, but couldn't save to library.");
      }
    } catch (_e) {
      // Generation failed across all backend fallbacks. The full error
      // is captured in the event log — the teacher sees only a friendly
      // panel inviting them to retry or browse already-generated work.
      setError("__failed__");
    } finally {
      setLoading(false);
    }
  };

  const renderOutput = useMemo(() => {
    if (!output) return null;

    const linkLibraryItem =
      savedLibraryItemId ??
      libraryItems.find((li) => li.payload === (output as any).data)?.id;

    const handleAnalyze = async (
      answers: { questionId: string; chosenIndex: number }[],
      questions: any[]
    ) =>
      analyzeDiagnostic({
        quizId: (output.data as DiagnosticResponse).quizId,
        answers,
        questions,
      }) as Promise<AnalysisResponse>;

    const onAttemptSaved = (data: any) => {
      if (!active || !linkLibraryItem) return;
      const skills = data.analysis?.skills ?? {};
      const strengths = data.analysis?.strengths ?? [];
      const weaknesses = data.analysis?.weaknesses ?? [];
      const recommendations = data.analysis?.recommendations ?? [];
      void saveAttempt({
        studentId: active.id,
        libraryItemId: linkLibraryItem,
        score: data.score,
        skills,
        strengths,
        weaknesses,
        recommendations,
        analysisText: data.analysis?.analysisText,
      });
      toast.success("Saved to Progress.");
    };

    // Flexible format dispatch — if AI returned HTML or Markdown, render via universal renderers.
    const data = output.data as any;
    if (data && typeof data === "object") {
      if (data.format === "html" && typeof data.html === "string") {
        return <HTMLContentRenderer html={data.html} filename={`${output.type}.html`} />;
      }
      if (data.format === "markdown" && typeof data.markdown === "string") {
        return <MarkdownContentRenderer markdown={data.markdown} title={output.type} />;
      }
      // Templated content (template-v1) — dispatch to iframe renderers
      if (data.format === "template-v1" && typeof data.template === "string") {
        if (data.template === "presentation-classic" || data.template === "presentation-academic") {
          return <TemplatedPresentationRenderer data={data} />;
        }
        if (data.template === "game-arcade") return <TemplatedGameRenderer data={data} />;
        if (data.template === "worksheet-print") return <TemplatedWorksheetRenderer data={data} />;
        if (data.template === "lessonplan-timeline") return <TemplatedLessonPlanRenderer data={data} />;
        if (data.template === "quiz-live") return <TemplatedQuizRenderer data={data} />;
      }
    }

    // After flexible-format check, output.data is the structured shape.
    const structured = output.data as any;
    switch (output.type) {
      case "diagnostic":
        return (
          <QuizRenderer
            mode="diagnostic"
            questions={structured.questions}
            onAnalyze={handleAnalyze}
            onAttemptSaved={onAttemptSaved}
          />
        );
      case "assessment":
        return (
          <QuizRenderer
            mode="assessment"
            questions={structured.questions}
            onAttemptSaved={onAttemptSaved}
          />
        );
      case "worksheet":
        return (
          <WorksheetRenderer data={structured} studentName={active?.name} />
        );
      case "lessonplan":
        return (
          <LessonPlanRenderer
            data={structured}
            studentName={active?.name}
            grade={grade}
            duration={lessonPlanForm.duration}
          />
        );
      case "presentation":
        return <PresentationRenderer data={structured} />;
      case "games":
        return <GameRenderer data={structured} />;
    }
  }, [output, active, grade, lessonPlanForm.duration, savedLibraryItemId, libraryItems, saveAttempt]);

  return (
    <div>
      <PageHero
        eyebrow="Generate"
        title="Pick a tool. Build it."
        subtitle="Fill the brief, watch Sheldon build it. Auto-saved to your library on success."
      />

      {!active && (
        <div className="bg-coral/5 border border-coral/20 rounded-2xl p-5 text-coral mb-6">
          You don't have any students yet. Add one in <b>Students</b> first.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT — form */}
        <div className="lg:col-span-5 space-y-4">
          {/* Class context */}
          <section className="bg-white dark:bg-deep-surface rounded-2xl shadow-soft border border-navy/5 p-5">
            <h3 className="font-display font-bold text-navy mb-3">
              Student & Class Information
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block">
                  <span className="pill bg-navy/5 text-navy/70">Student</span>
                  <input
                    readOnly
                    value={active?.name ?? "—"}
                    className={`mt-1.5 ${inputCls} bg-navy/5 cursor-not-allowed`}
                    aria-label="Student (set in Students page)"
                  />
                </label>
              </div>
              <label className="block">
                <span className="pill bg-navy/5 text-navy/70">Grade</span>
                <input
                  readOnly
                  value={`Grade ${grade}`}
                  className={`mt-1.5 ${inputCls} bg-navy/5 cursor-not-allowed`}
                  aria-label="Grade (set in Students page)"
                />
              </label>
              <label className="block">
                <span className="pill bg-navy/5 text-navy/70">Region</span>
                <input
                  readOnly
                  value={country}
                  className={`mt-1.5 ${inputCls} bg-navy/5 cursor-not-allowed`}
                  aria-label="Region (set in Students page)"
                />
              </label>
              <div className="col-span-2">
                <label className="block">
                  <span className="pill bg-navy/5 text-navy/70">Subject</span>
                  <input
                    readOnly
                    value={subject}
                    className={`mt-1.5 ${inputCls} bg-navy/5 cursor-not-allowed`}
                    aria-label="Subject (set in Students page)"
                  />
                </label>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-ss-ink-500 dark:text-ss-ink-300">
              To change any of these, edit the student profile in the{" "}
              <span className="font-semibold">Students</span> page.
            </p>
          </section>

          {/* Tool picker */}
          <section className="bg-white dark:bg-deep-surface rounded-2xl shadow-soft border border-navy/5 p-5">
            <h3 className="font-display font-bold text-navy mb-3">
              Select Requirement
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(TOOL_INFO) as Tool[]).map((t) => {
                const info = TOOL_INFO[t];
                const Icon = info.icon;
                const active = tool === t;
                return (
                  <button
                    key={t}
                    onClick={() => setToolAndUrl(t)}
                    className={`text-left p-3 rounded-xl border transition ${
                      active
                        ? `${info.bg} border-purple shadow-sm`
                        : "bg-white dark:bg-deep-surface border-navy/15 hover:bg-navy/5"
                    }`}
                  >
                    <Icon className="w-5 h-5 text-navy mb-2" />
                    <p className="font-display font-bold text-sm text-navy">
                      {info.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Dynamic form */}
          {tool && (
            <section className="bg-white dark:bg-deep-surface rounded-2xl shadow-soft border border-navy/5 p-5 animate-fade-up">
              <h3 className="font-display font-bold text-navy mb-3">
                {TOOL_INFO[tool].label} details
              </h3>
              {tool === "diagnostic" && (
                <DiagnosticForm
                  values={diagnosticForm}
                  onChange={setDiagnosticForm}
                />
              )}
              {tool === "assessment" && (
                <AssessmentForm
                  values={assessmentForm}
                  onChange={setAssessmentForm}
                />
              )}
              {tool === "worksheet" && (
                <WorksheetForm
                  values={worksheetForm}
                  onChange={setWorksheetForm}
                />
              )}
              {tool === "lessonplan" && (
                <LessonPlanForm
                  values={lessonPlanForm}
                  onChange={setLessonPlanForm}
                />
              )}
              {tool === "presentation" && (
                <PresentationForm
                  values={presentationForm}
                  onChange={setPresentationForm}
                />
              )}
              {tool === "games" && (
                <GameForm values={gameForm} onChange={setGameForm} />
              )}
            </section>
          )}

          {/* Model picker — appears after a tool is chosen, just above Generate */}
          {tool && (
            <ModelSelector value={model} onChange={setModel} compact tool={tool} />
          )}

          {/* Helper hint when Generate is disabled, so users know what's missing */}
          {tool && active && !canGenerate && !loading && (
            <div className="bg-soft-yellow dark:bg-deep-cream/40 border-2 border-ss-ink-900 dark:border-white/50 rounded-2xl px-4 py-3 text-sm text-ss-ink-900 dark:text-white">
              <span className="font-bold">Almost there — </span>
              {tool === "assessment" && "add at least one topic above (press Enter after typing) to enable Generate."}
              {tool === "worksheet" && "add a topic and pick at least one section to enable Generate."}
              {tool === "lessonplan" && "add a topic to enable Generate."}
              {tool === "presentation" && "add a topic to enable Generate."}
              {tool === "games" && "add a topic to enable Generate."}
            </div>
          )}

          {/* HARD BLOCK — clear subject mismatch (e.g. "python" in Maths).
              Generate is disabled until the teacher fixes it OR overrides. */}
          {tool && active && topicHardBlock && currentTopic && !topicOverride && (
            <div className="bg-ss-orange-500/10 dark:bg-ss-orange-500/15 border-2 border-ss-orange-500 rounded-2xl px-4 py-3 text-sm">
              <p className="font-bold text-ss-orange-600 dark:text-ss-orange-500 mb-1">
                Topic doesn't match the subject
              </p>
              <p className="text-ss-ink-900 dark:text-ss-ink-100 leading-relaxed">
                {topicHardBlock.reason}
              </p>
              <p className="text-[11px] text-ss-ink-500 dark:text-ss-ink-300 mt-2 mb-3">
                Sheldon won't generate until this is fixed — otherwise you'd end up with content that doesn't match what you asked for.
              </p>
              <button
                type="button"
                onClick={() => setTopicOverride(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-ss-orange-600 dark:text-ss-orange-500 hover:text-ss-orange-700 dark:hover:text-ss-orange-400 underline underline-offset-2"
              >
                Override — I know what I'm doing
              </button>
            </div>
          )}

          {/* Override active — teacher chose to bypass the block */}
          {tool && active && topicHardBlock && currentTopic && topicOverride && (
            <div className="bg-soft-yellow dark:bg-deep-cream/40 border-2 border-ss-ink-900 dark:border-white/50 rounded-2xl px-4 py-3 text-sm flex items-center justify-between gap-3">
              <p className="text-ss-ink-900 dark:text-white">
                <span className="font-bold">Override active — </span>
                generating "{currentTopic}" for {subject}. The result may not match the subject.
              </p>
              <button
                type="button"
                onClick={() => setTopicOverride(false)}
                className="shrink-0 text-xs font-bold text-ss-ink-900 dark:text-white underline underline-offset-2"
              >
                Undo
              </button>
            </div>
          )}

          {/* SOFT WARNING — Groq grade-level check (only when no hard block) */}
          {tool && active && !topicHardBlock && topicValidation && !topicValidation.ok && currentTopic && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-600/60 rounded-2xl px-4 py-3 text-sm">
              <p className="font-bold text-amber-900 dark:text-amber-200 mb-1">
                Hmm — "{currentTopic}" might not fit Grade {grade} {subject}.
              </p>
              {topicValidation.reason && (
                <p className="text-amber-800 dark:text-amber-300 mb-2">{topicValidation.reason}</p>
              )}
              {topicValidation.suggestions && topicValidation.suggestions.length > 0 && (
                <>
                  <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1.5">
                    Try one of these instead:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {topicValidation.suggestions.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white dark:bg-deep-surface text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-600/60"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </>
              )}
              <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-2 italic">
                You can still tap Generate — this is just a suggestion.
              </p>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!canGenerate || loading}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-ss-orange-500 text-white font-bold border-2 border-ss-ink-900 dark:border-white/50 hover:bg-ss-orange-600 hover:shadow-brand active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {loading ? (
              <>Sheldon is thinking…</>
            ) : (
              <>
                <Wand2 className="w-4 h-4" /> Generate{" "}
                {tool ? TOOL_INFO[tool].label : ""}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* RIGHT — output */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-deep-surface rounded-2xl shadow-soft border border-navy/5 min-h-[600px] p-5 lg:p-6">
            {error ? (
              <div className="flex flex-col items-center justify-center text-center py-10 px-6 animate-fade-up">
                <div className="animate-float mb-2">
                  <OwlMascot size={120} />
                </div>
                <h3 className="font-display font-extrabold text-2xl text-ss-ink-900 dark:text-white mt-4">
                  Sheldon Library couldn't fetch that one.
                </h3>
                <p className="text-sm text-ss-ink-500 dark:text-ss-ink-300 mt-2 max-w-md leading-relaxed">
                  We're working on it. Meanwhile, you can explore the{" "}
                  <span className="font-semibold text-ss-ink-900 dark:text-white">Library</span>{" "}
                  to find already-generated content for this student.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                  <button
                    onClick={handleGenerate}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-deep-surface text-ss-ink-900 dark:text-white font-bold border-2 border-ss-ink-900 dark:border-white/50 hover:-translate-y-0.5 hover:shadow-soft transition"
                  >
                    <RefreshCw className="w-4 h-4" /> Try again
                  </button>
                  <Link
                    to="/library"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-ss-orange-500 text-white font-bold border-2 border-ss-ink-900 dark:border-white/50 hover:bg-ss-orange-600 hover:shadow-brand transition"
                  >
                    <BookOpen className="w-4 h-4" /> Browse Library
                  </Link>
                </div>
              </div>
            ) : loading ? (
              <LoadingState />
            ) : output ? (
              renderOutput
            ) : (
              <EmptyState
                title="Your generated content will appear here."
                message={
                  tool
                    ? `Fill the brief and tap Generate ${TOOL_INFO[tool].label}.`
                    : "Pick a tool to begin."
                }
                action={
                  <div className="flex flex-col items-center gap-4">
                    <OwlMascot size={120} />
                  </div>
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
