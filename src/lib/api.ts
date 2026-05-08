import {
  MOCK_STUDENTS,
  MOCK_LIBRARY_ITEMS,
  MOCK_ATTEMPTS,
  MOCK_DIAGNOSTIC,
  MOCK_ANALYSIS,
  MOCK_ASSESSMENT,
  MOCK_WORKSHEET,
  MOCK_LESSON_PLAN,
  MOCK_PRESENTATION,
  mockGameForStyle,
  pickAvatarColor,
} from "./mockData";
import type {
  AnalysisResponse,
  AssessmentResponse,
  DiagnosticResponse,
  GamePayload,
  GameStyle,
  LessonPlanResponse,
  LibraryItem,
  NewAttempt,
  NewLibraryItem,
  NewStudent,
  PresentationResponse,
  QuizAttempt,
  Student,
  SyncAction,
  WorksheetResponse,
} from "./types";

const baseUrl = (import.meta.env.VITE_N8N_BASE_URL ?? "").trim();
const sheldonKey = (import.meta.env.VITE_SHELDON_KEY ?? "").trim();

export const isMockMode =
  !baseUrl || baseUrl.startsWith("https://your-n8n");

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function callWebhook<T>(
  path: string,
  body: unknown,
  options: { mockResolver: () => T | Promise<T>; timeoutMs?: number }
): Promise<T> {
  if (isMockMode) {
    await wait(800 + Math.random() * 700);
    return await options.mockResolver();
  }

  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? 30_000;
  const timeout = setTimeout(
    () => controller.abort(new Error(`${path} timed out after ${timeoutMs / 1000}s`)),
    timeoutMs
  );

  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (sheldonKey) headers["x-sheldon-key"] = sheldonKey;
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`${path} failed (${res.status}): ${text.slice(0, 200)}`);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

// ────────────────────────────────────────────────────────────
// State / Sync
// ────────────────────────────────────────────────────────────

const localState = {
  students: [...MOCK_STUDENTS] as Student[],
  libraryItems: [...MOCK_LIBRARY_ITEMS] as LibraryItem[],
  attempts: [...MOCK_ATTEMPTS] as QuizAttempt[],
};

export type GetAllResponse = {
  students: Student[];
  libraryItems: LibraryItem[];
  attempts: QuizAttempt[];
};

export const syncState = async (
  action: SyncAction,
  payload?: any
): Promise<any> => {
  return callWebhook("sync-state", { action, payload }, {
    mockResolver: () => {
      switch (action) {
        case "getAll":
          return {
            students: [...localState.students],
            libraryItems: [...localState.libraryItems],
            attempts: [...localState.attempts],
          } as GetAllResponse;
        case "createStudent": {
          const ns = payload as NewStudent;
          const i = localState.students.length;
          const newStudent: Student = {
            ...ns,
            id: `s_${Date.now().toString(36)}`,
            avatarColor: ns.avatarColor || pickAvatarColor(i),
          };
          localState.students.push(newStudent);
          return newStudent;
        }
        case "deleteStudent": {
          const id = payload as string;
          localState.students = localState.students.filter((s) => s.id !== id);
          return { success: true };
        }
        case "saveLibraryItem": {
          const li = payload as NewLibraryItem;
          const newItem: LibraryItem = {
            ...li,
            id: `li_${Date.now().toString(36)}`,
            createdAt: new Date().toISOString(),
          };
          localState.libraryItems.unshift(newItem);
          return newItem;
        }
        case "saveAttempt": {
          const att = payload as NewAttempt;
          const newAttempt: QuizAttempt = {
            ...att,
            id: `att_${Date.now().toString(36)}`,
            createdAt: new Date().toISOString(),
          };
          localState.attempts.unshift(newAttempt);
          return newAttempt;
        }
        default:
          return null;
      }
    },
  });
};

// ────────────────────────────────────────────────────────────
// Generators
// ────────────────────────────────────────────────────────────

export type DiagnosticPayload = {
  studentId: string;
  name: string;
  grade: number;
  region: string;
  subject: string;
  goal: string;
  numQuestions: number;
  model?: string;
};

export const generateDiagnostic = (p: DiagnosticPayload) =>
  callWebhook<DiagnosticResponse>("diagnostic-generate", p, {
    mockResolver: () => ({
      ...MOCK_DIAGNOSTIC,
      questions: MOCK_DIAGNOSTIC.questions.slice(0, p.numQuestions || 10),
    }),
  });

export type AnalyzePayload = {
  quizId: string;
  answers: { questionId: string; chosenIndex: number }[];
  questions: DiagnosticResponse["questions"];
  model?: string;
};

export const analyzeDiagnostic = (p: AnalyzePayload) =>
  callWebhook<AnalysisResponse>("diagnostic-analyze", p, {
    mockResolver: () => {
      // Compute a real score from mock answers
      let correct = 0;
      const skills: Record<string, { correct: number; total: number }> = {};
      for (const q of p.questions) {
        const ans = p.answers.find((a) => a.questionId === q.id);
        skills[q.skill] = skills[q.skill] || { correct: 0, total: 0 };
        skills[q.skill].total += 1;
        if (ans && ans.chosenIndex === q.correctIndex) {
          correct += 1;
          skills[q.skill].correct += 1;
        }
      }
      const score = Math.round((correct / Math.max(1, p.questions.length)) * 100);
      const skillScores: Record<string, number> = {};
      Object.entries(skills).forEach(([k, v]) => {
        skillScores[k] = Math.round((v.correct / v.total) * 100);
      });
      return {
        ...MOCK_ANALYSIS,
        score,
        skills: skillScores,
      };
    },
  });

export type AssessmentPayload = {
  topics: string[];
  subtopics: string[];
  timed: boolean;
  totalTime?: number;
  marks: number;
  numQ: number;
  difficulty: "Easy" | "Medium" | "Hard";
  grade: number;
  subject: string;
  model?: string;
};

export const generateAssessment = (p: AssessmentPayload) =>
  callWebhook<AssessmentResponse>("assessment-generate", p, {
    mockResolver: () => ({
      questions: MOCK_ASSESSMENT.questions.slice(0, p.numQ || 10),
    }),
  });

export type WorksheetPayload = {
  topic: string;
  subtopic: string;
  type: "Homework" | "Classwork";
  sections: string[];
  grade: number;
  subject: string;
  model?: string;
};

export const generateWorksheet = (p: WorksheetPayload) =>
  callWebhook<WorksheetResponse>("worksheet-generate", p, {
    mockResolver: () => {
      const filtered = MOCK_WORKSHEET.json.sections.filter((s) =>
        p.sections.length ? p.sections.includes(s.name) : true
      );
      return {
        json: {
          ...MOCK_WORKSHEET.json,
          topic: p.topic || MOCK_WORKSHEET.json.topic,
          sections: filtered.length ? filtered : MOCK_WORKSHEET.json.sections,
        },
      };
    },
  });

export type LessonPlanPayload = {
  topic: string;
  subtopic: string;
  duration: number;
  grade: number;
  subject: string;
  model?: string;
};

export const generateLessonPlan = (p: LessonPlanPayload) =>
  callWebhook<LessonPlanResponse>("lessonplan-generate", p, {
    mockResolver: () => ({
      json: {
        ...MOCK_LESSON_PLAN.json,
        topic: p.topic || MOCK_LESSON_PLAN.json.topic,
      },
    }),
  });

export type PresentationPayload = {
  topic: string;
  subtopic: string;
  duration: number;
  difficulty: "Easy" | "Medium" | "Hard";
  grade: number;
  subject: string;
  model?: string;
};

export const generatePresentation = (p: PresentationPayload) =>
  callWebhook<PresentationResponse>("presentation-generate", p, {
    mockResolver: () => MOCK_PRESENTATION,
    timeoutMs: 180_000,
  });

export type GamePayloadInput = {
  topic: string;
  subtopic: string;
  gameStyle: GameStyle;
  grade: number;
  subject: string;
  model?: string;
};

export const generateGame = (p: GamePayloadInput) =>
  callWebhook<GamePayload>("game-generate", p, {
    mockResolver: () => mockGameForStyle(p.gameStyle),
  });

export const presentationToPptx = (slides: any[]) =>
  callWebhook<{ base64: string; filename: string }>(
    "presentation-to-pptx",
    { slides },
    {
      mockResolver: () => ({
        base64: "",
        filename: `presentation-${Date.now()}.pptx`,
      }),
      timeoutMs: 180_000,
    }
  );
