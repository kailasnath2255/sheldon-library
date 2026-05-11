// ─── Theme definition ──────────────────────────────────────────
export type ThemeId =
  | "garden"
  | "space"
  | "theater"
  | "ocean"
  | "lab"
  | "studio";

export type ThemePreset = {
  id: ThemeId;
  label: string;
  description: string;
  // Best for: hint to the AI when picking a theme
  bestFor: string[];

  // Palette — every color baked into the slide chrome
  primary: string;
  primarySoft: string;       // 18% tint over white for accents
  accent: string;
  secondary: string;
  secondarySoft: string;
  bg1: string;
  bg2: string;
  bg3: string;
  ink: string;               // overrides the default ink if needed
  cream: string;             // body card surface

  // Fonts
  displayFont: string;       // headings (Google Fonts family name)
  bodyFont: string;          // body text

  // Mascot pair — inline SVG (no emoji fallback)
  mascot1: MascotSVG;
  mascot2: MascotSVG;

  // Background motif — small inline SVGs that float in the bg
  decorations: string[];     // SVG strings used as background flair
};

export type MascotSVG = {
  name: string;              // "Sprout", "Buzz", etc.
  svg: string;               // inline SVG markup, ~60-120 lines, 200x200 viewBox
};

// ─── Slide schema ──────────────────────────────────────────────
// Every slide type the template renderer supports.
// The AI emits one of these per slide; both the HTML renderer and
// the PPTX exporter consume the same shape.

export type SlideType =
  | "title"
  | "section"
  | "body"
  | "objectives"
  | "definition"
  | "compare"
  | "examples"
  | "fact"
  | "mnemonic"
  | "i-do"
  | "quiz"
  | "fill-blank"
  | "drag-sort"
  | "story"
  | "takeaway"
  | "hots"
  | "closure";

export interface BaseSlide {
  type: SlideType;
  section?: string;           // chip label like "Definition", "Quiz Time"
  title?: string;
  notes?: string;             // speaker notes (shown in N drawer, also embedded in PPTX)
}

export interface TitleSlide extends BaseSlide {
  type: "title";
  title: string;
  subtitle?: string;
  mascot1Says?: string;
  mascot2Says?: string;
}

export interface SectionSlide extends BaseSlide {
  type: "section";
  title: string;
  body?: string;
}

export interface BodySlide extends BaseSlide {
  type: "body";
  title?: string;
  body: string;
  icon?: string;              // ONE central emoji or short symbol
  mascotSays?: string;
}

export interface ObjectivesSlide extends BaseSlide {
  type: "objectives";
  title?: string;
  subtitle?: string;
  items: { icon?: string; text: string }[];
}

export interface DefinitionSlide extends BaseSlide {
  type: "definition";
  title?: string;
  term: string;
  formula?: string;           // short tag e.g. "uses 'like' or 'as'"
  meaning: string;
  example?: string;
}

export interface CompareSlide extends BaseSlide {
  type: "compare";
  title?: string;
  left: {
    title: string;
    formula?: string;
    example?: string;
    points?: string[];
  };
  right: {
    title: string;
    formula?: string;
    example?: string;
    points?: string[];
  };
}

export interface ExamplesSlide extends BaseSlide {
  type: "examples";
  title?: string;
  body?: string;
  items: { icon?: string; text: string }[];   // 4-6 items
}

export interface FactSlide extends BaseSlide {
  type: "fact";
  body: string;
  quote?: string;
  source?: string;
}

export interface MnemonicSlide extends BaseSlide {
  type: "mnemonic";
  title?: string;
  body: string;
}

export interface IDoSlide extends BaseSlide {
  type: "i-do";
  title?: string;
  sentence: string;            // the example sentence
  thinking: string[];          // 3 thinking steps
  conclusion: string;          // final identification
}

export interface QuizSlide extends BaseSlide {
  type: "quiz";
  title?: string;
  label?: string;              // small chip like "Multiple Choice" / "True/False"
  question: string;
  options: string[];           // 2-4 options
  correctIndex: number;
  explanation?: string;
}

export interface FillBlankSlide extends BaseSlide {
  type: "fill-blank";
  title?: string;
  before: string;              // text before the blank
  after: string;               // text after the blank
  options: string[];           // 2-4 word pills
  correctIndex: number;
  explanation?: string;
}

export interface DragSortSlide extends BaseSlide {
  type: "drag-sort";
  title?: string;
  body?: string;
  items: { type: "a" | "b"; text: string }[];        // 4-6 items
  zones: [{ label: string; accept: "a" }, { label: string; accept: "b" }];
}

export interface StorySlide extends BaseSlide {
  type: "story";
  title?: string;
  parts: { text: string; tag?: "a" | "b" }[];        // tagged words get highlighted
  legend?: string;
}

export interface TakeawaySlide extends BaseSlide {
  type: "takeaway";
  title?: string;
  points: { icon?: string; text: string }[];
}

export interface HOTSSlide extends BaseSlide {
  type: "hots";
  title?: string;
  question: string;
  icon?: string;
  mascotSays?: string;
}

export interface ClosureSlide extends BaseSlide {
  type: "closure";
  title?: string;
  body?: string;
  stars?: number;                // 1-5
  mascot1Says?: string;
  mascot2Says?: string;
}

export type AnySlide =
  | TitleSlide
  | SectionSlide
  | BodySlide
  | ObjectivesSlide
  | DefinitionSlide
  | CompareSlide
  | ExamplesSlide
  | FactSlide
  | MnemonicSlide
  | IDoSlide
  | QuizSlide
  | FillBlankSlide
  | DragSortSlide
  | StorySlide
  | TakeawaySlide
  | HOTSSlide
  | ClosureSlide;

// ─── Full presentation payload from the AI ────────────────────
//
// Two presentation templates share the same slide schema:
//   - presentation-classic  : playful, mascots, bright pastels (Grades 1-6)
//   - presentation-academic : dark navy, serif, gradient blobs, no mascots (Grades 7-12)
// AI picks the template based on the student's grade level.
export type PresentationTemplateId = "presentation-classic" | "presentation-academic";

export interface TemplatedPresentation {
  format: "template-v1";
  template: PresentationTemplateId;
  themeId: ThemeId;
  subjectId?: string;     // 'math' | 'science' | ... — drives background motif overlay
  title: string;
  slides: AnySlide[];
}

// ─── Game schema ──────────────────────────────────────────────
export type GameStyle = "sort" | "match" | "sequence" | "fill-blank" | "quiz";

export interface SortGameData {
  gameType: "sort";
  payload: {
    items: string[];
    buckets: { name: string; correctItems: string[] }[];
  };
}

export interface MatchGameData {
  gameType: "match";
  payload: { pairs: { left: string; right: string }[] };
}

export interface SequenceGameData {
  gameType: "sequence";
  payload: { items: string[]; correctOrder: number[] };
}

export interface FillBlankGameData {
  gameType: "fill-blank";
  payload: {
    questions: {
      sentence: string;        // use ___ for the blank
      options: string[];
      correctIndex: number;
      explanation?: string;
    }[];
  };
}

export interface QuizGameData {
  gameType: "quiz";
  payload: {
    questions: {
      text: string;
      options: string[];
      correctIndex: number;
      explanation?: string;
      difficulty?: "easy" | "medium" | "hard";
    }[];
  };
}

export type AnyGameData =
  | SortGameData
  | MatchGameData
  | SequenceGameData
  | FillBlankGameData
  | QuizGameData;

export interface TemplatedGame {
  format: "template-v1";
  template: "game-arcade";
  themeId: ThemeId;
  subjectId?: string;        // optional subject motif overlay
  title: string;
  intro: string;             // 1-2 sentence welcome
  achievement: {
    title: string;           // "Garden Master" / "Cosmic Champion" / etc.
    message: string;         // 1 sentence congrats
  };
  data: AnyGameData;
}

// ─── Worksheet schema ─────────────────────────────────────────
export type WorksheetSectionType =
  | "mcq"
  | "fill-blank"
  | "match"
  | "short-answer"
  | "true-false"
  | "creative";

export interface WorksheetMCQItem {
  question: string;
  options: string[];
  answer: string;          // the correct option text (not index — easier for teacher review)
}
export interface WorksheetFillBlankItem {
  sentence: string;        // use ___ for the blank
  answer: string;
}
export interface WorksheetMatchItem {
  left: string;
  right: string;
}
export interface WorksheetShortAnswerItem {
  question: string;
  answer: string;          // hidden in student copy, shown in teacher copy
}
export interface WorksheetTrueFalseItem {
  statement: string;
  answer: "True" | "False";
}
export interface WorksheetCreativeItem {
  prompt: string;
  lines?: number;          // suggested writing lines
}

export interface WorksheetSection {
  type: WorksheetSectionType;
  title: string;            // "Section A — Choose the correct answer"
  instructions?: string;    // brief instructions for the student
  items: (
    | WorksheetMCQItem
    | WorksheetFillBlankItem
    | WorksheetMatchItem
    | WorksheetShortAnswerItem
    | WorksheetTrueFalseItem
    | WorksheetCreativeItem
  )[];
}

export interface TemplatedWorksheet {
  format: "template-v1";
  template: "worksheet-print";
  themeId: ThemeId;
  title: string;
  subtitle?: string;        // e.g. "Year 4 · Maths · Homework"
  intro: string;            // "What you will practice today"
  studentNameLabel?: string; // default: "Name: __________"
  dateLabel?: string;        // default: "Date: __________"
  sections: WorksheetSection[];
  showAnswerKey?: boolean;   // teacher mode: appends answer key at the end
}

// ─── Lesson Plan schema ───────────────────────────────────────
export interface LessonPlanTimelineEntry {
  section:
    | "Icebreaker"
    | "Warm-up"
    | "Learning Objective"
    | "Definition"
    | "Explanation"
    | "Activity (I Do / We Do / You Do)"
    | "Skill Task"
    | "Quick Assessment"
    | "Key Takeaways"
    | "Closure (HOTS)";
  time: string;            // "0-5 min"
  durationMin: number;     // 5
  activity: string;        // what happens during this segment
  materials?: string;      // chat box, whiteboard, screen share, etc.
  notes: string;           // teacher script / coaching notes
}

export interface TemplatedLessonPlan {
  format: "template-v1";
  template: "lessonplan-timeline";
  themeId: ThemeId;
  title: string;
  subtitle?: string;        // "Year 4 · Maths · 55-min session"
  durationMin: number;      // e.g. 55
  objectives: string[];     // "By the end, the student will be able to..."
  timeline: LessonPlanTimelineEntry[];
  differentiation: {
    below: string;
    at: string;
    above: string;
  };
  assessment: string;       // description + the 5 quick assessment questions
  homework: string;
}

// ─── Quiz schema (shared by Diagnostic + Assessment) ──────────
export interface QuizQuestion {
  id: string;                // "q1", "q2", ...
  text: string;
  options: string[];         // 4 typically
  correctIndex: number;
  marks?: number;            // assessment only
  explanation?: string;      // shown in review screen
  skill?: string;            // diagnostic: tag per skill
  difficulty?: "easy" | "medium" | "hard";
}

export interface TemplatedQuiz {
  format: "template-v1";
  template: "quiz-live";
  themeId: ThemeId;
  title: string;
  subtitle?: string;          // "Grade 5 · Maths · Diagnostic"
  mode: "diagnostic" | "assessment";
  timed: boolean;
  totalTimeMin?: number;      // if timed
  totalMarks?: number;        // assessment
  passMarkPct?: number;       // assessment, default 60
  questions: QuizQuestion[];
  showAnalysis?: boolean;     // diagnostic: per-skill breakdown screen
}
