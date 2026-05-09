export type Country = "UK" | "Australia" | "India" | "USA" | "Singapore" | "NZ";

export type Student = {
  id: string;
  name: string;
  grade: number;
  country: Country;
  subject: string;
  parentEmail?: string;
  avatarColor: string;
};

export type NewStudent = Omit<Student, "id">;

export type LibraryItemType =
  | "diagnostic"
  | "assessment"
  | "worksheet"
  | "lesson_plan"
  | "presentation"
  | "game";

export type LibraryItem = {
  id: string;
  type: LibraryItemType;
  title: string;
  studentId: string;
  payload: any;
  createdAt: string;
};

export type NewLibraryItem = Omit<LibraryItem, "id" | "createdAt">;

export type QuizAttempt = {
  id: string;
  studentId: string;
  libraryItemId: string;
  score: number;
  skills: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  analysisText?: string;
  createdAt: string;
};

export type NewAttempt = Omit<QuizAttempt, "id" | "createdAt">;

export type DiagnosticQuestion = {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  skill: string;
};

export type DiagnosticResponse = {
  quizId: string;
  questions: DiagnosticQuestion[];
};

export type AnalysisResponse = {
  score: number;
  skills: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  analysisText: string;
};

export type AssessmentQuestion = {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  marks: number;
  explanation: string;
};

export type AssessmentResponse = {
  questions: AssessmentQuestion[];
};

export type WorksheetItem = {
  question?: string;
  sentence?: string;
  options?: string[];
  answer?: string;
  pair?: { left: string; right: string };
  prompt?: string;
};

export type WorksheetSection = {
  name: string;
  items: WorksheetItem[];
};

export type WorksheetResponse = {
  json: {
    topic: string;
    intro: string;
    sections: WorksheetSection[];
  };
};

export type LessonPlanResponse = {
  json: {
    topic: string;
    objectives: string[];
    timeline: { time: string; activity: string; materials: string; notes: string }[];
    differentiation: { below: string; at: string; above: string };
    assessment: string;
    homework: string;
  };
};

export type Slide = {
  type:
    | "title"
    | "definition"
    | "image_caption"
    | "compare"
    | "ido_wedo_youdo"
    | "quiz"
    | "drag_sort"
    | "fill_blank"
    | "video"
    | "takeaway";
  title?: string;
  body?: string;
  media?: string;
  notes?: string;
  definition?: { term: string; meaning: string };
  imageCaption?: { caption: string; emoji?: string };
  compare?: {
    left: { title: string; points: string[] };
    right: { title: string; points: string[] };
  };
  iwy?: { iDo: string; weDo: string; youDo: string };
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
  };
  dragSort?: {
    items: string[];
    buckets: { name: string; correctItems: string[] }[];
  };
  fillBlank?: { sentence: string; blanks: string[] };
  video?: { url: string; caption: string };
  takeaway?: { points: string[] };
};

export type PresentationResponse = { slides: Slide[] };

export type GameStyle = "sort" | "match" | "sequence" | "fill-blank" | "quiz";

export type GamePayload =
  | { gameType: "sort"; payload: { items: string[]; buckets: { name: string; correctItems: string[] }[] } }
  | { gameType: "match"; payload: { pairs: { left: string; right: string }[] } }
  | { gameType: "sequence"; payload: { items: string[]; correctOrder: number[] } }
  | { gameType: "fill-blank"; payload: { sentence: string; blanks: string[] } }
  | { gameType: "quiz"; payload: { questions: { text: string; options: string[]; correctIndex: number }[] } };

// ── Generic content shapes (new format-aware payloads from upgraded prompts)
export type HTMLContent = {
  format: "html";
  html: string;
  _provider?: string;
  _model?: string;
};

export type MarkdownContent = {
  format: "markdown";
  markdown: string;
  _provider?: string;
  _model?: string;
};

export type FlexibleResponse = HTMLContent | MarkdownContent;

export type SyncAction =
  | "getAll"
  | "createStudent"
  | "deleteStudent"
  | "saveLibraryItem"
  | "saveAttempt";
