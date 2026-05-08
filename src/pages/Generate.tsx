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
import ErrorState from "@/components/shared/ErrorState";
import OwlMascot from "@/components/shared/OwlMascot";

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
import { DEFAULT_MODEL_ID } from "@/lib/models";

import QuizRenderer from "@/components/renderers/QuizRenderer";
import WorksheetRenderer from "@/components/renderers/WorksheetRenderer";
import LessonPlanRenderer from "@/components/renderers/LessonPlanRenderer";
import PresentationRenderer from "@/components/renderers/PresentationRenderer";
import GameRenderer from "@/components/renderers/GameRenderer";

import {
  analyzeDiagnostic,
  generateAssessment,
  generateDiagnostic,
  generateGame,
  generateLessonPlan,
  generatePresentation,
  generateWorksheet,
} from "@/lib/api";
import { useStore, useActiveStudent } from "@/store/useStore";
import type {
  AnalysisResponse,
  AssessmentResponse,
  Country,
  DiagnosticResponse,
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
  | { type: "diagnostic"; data: DiagnosticResponse }
  | { type: "assessment"; data: AssessmentResponse }
  | { type: "worksheet"; data: WorksheetResponse }
  | { type: "lessonplan"; data: LessonPlanResponse }
  | { type: "presentation"; data: PresentationResponse }
  | { type: "games"; data: GamePayload };

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

  // Form states
  const [diagnosticForm, setDiagnosticForm] = useState<DiagnosticFormValues>({
    goal: "Curriculum Alignment",
    numQuestions: 10,
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
            model: model || undefined,
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
            model: model || undefined,
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
            model: model || undefined,
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
            model: model || undefined,
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
            model: model || undefined,
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
            model: model || undefined,
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
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Generation failed.";
      setError(msg);
      toast.error("Something broke — try again.");
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

    switch (output.type) {
      case "diagnostic":
        return (
          <QuizRenderer
            mode="diagnostic"
            questions={output.data.questions}
            onAnalyze={handleAnalyze}
            onAttemptSaved={onAttemptSaved}
          />
        );
      case "assessment":
        return (
          <QuizRenderer
            mode="assessment"
            questions={output.data.questions}
            onAttemptSaved={onAttemptSaved}
          />
        );
      case "worksheet":
        return (
          <WorksheetRenderer data={output.data} studentName={active?.name} />
        );
      case "lessonplan":
        return (
          <LessonPlanRenderer
            data={output.data}
            studentName={active?.name}
            grade={grade}
            duration={lessonPlanForm.duration}
          />
        );
      case "presentation":
        return <PresentationRenderer data={output.data} />;
      case "games":
        return <GameRenderer data={output.data} />;
    }
  }, [output, active, grade, lessonPlanForm.duration, savedLibraryItemId, libraryItems, saveAttempt]);

  return (
    <div>
      <PageHero
        title="Generate"
        subtitle="Pick a tool, fill the brief, watch Sheldon build it. Saved to your library on success."
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
          <section className="bg-white rounded-2xl shadow-soft border border-navy/5 p-5">
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
                  />
                </label>
              </div>
              <label className="block">
                <span className="pill bg-navy/5 text-navy/70">Grade</span>
                <select
                  className={`mt-1.5 ${inputCls}`}
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                    <option key={g} value={g}>
                      Grade {g}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="pill bg-navy/5 text-navy/70">Region</span>
                <select
                  className={`mt-1.5 ${inputCls}`}
                  value={country}
                  onChange={(e) => setCountry(e.target.value as Country)}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <div className="col-span-2">
                <label className="block">
                  <span className="pill bg-navy/5 text-navy/70">Subject</span>
                  <input
                    className={`mt-1.5 ${inputCls}`}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </label>
              </div>
            </div>
          </section>

          {/* Model picker */}
          <ModelSelector value={model} onChange={setModel} />

          {/* Tool picker */}
          <section className="bg-white rounded-2xl shadow-soft border border-navy/5 p-5">
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
                        : "bg-white border-navy/15 hover:bg-navy/5"
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
            <section className="bg-white rounded-2xl shadow-soft border border-navy/5 p-5 animate-fade-up">
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

          <button
            onClick={handleGenerate}
            disabled={!canGenerate || loading}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-purple text-white font-bold hover:bg-purple/90 active:scale-[0.98] disabled:opacity-30 transition shadow-sm"
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
          <div className="bg-white rounded-2xl shadow-soft border border-navy/5 min-h-[600px] p-5 lg:p-6">
            {error ? (
              <ErrorState
                message="Something broke — try again."
                detail={error}
                onRetry={handleGenerate}
              />
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
                action={<OwlMascot size={120} />}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
