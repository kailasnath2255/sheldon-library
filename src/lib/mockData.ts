import type {
  Student,
  LibraryItem,
  QuizAttempt,
  DiagnosticResponse,
  AnalysisResponse,
  AssessmentResponse,
  WorksheetResponse,
  LessonPlanResponse,
  PresentationResponse,
  GamePayload,
  GameStyle,
} from "./types";

const PASTEL_COLORS = ["#B6F2D7", "#FFD9B3", "#FFE066", "#C9B8FF", "#B3E0FF", "#FFC0DD"];

export const pickAvatarColor = (i: number) => PASTEL_COLORS[i % PASTEL_COLORS.length];

export const MOCK_STUDENTS: Student[] = [
  {
    id: "s_001",
    name: "Aarav Sharma",
    grade: 7,
    country: "India",
    subject: "Maths",
    parentEmail: "priya.sharma@example.com",
    avatarColor: PASTEL_COLORS[0],
  },
  {
    id: "s_002",
    name: "Maya Patel",
    grade: 5,
    country: "UK",
    subject: "English",
    parentEmail: "rohan.patel@example.com",
    avatarColor: PASTEL_COLORS[3],
  },
  {
    id: "s_003",
    name: "Liam O'Connor",
    grade: 9,
    country: "Australia",
    subject: "Science",
    avatarColor: PASTEL_COLORS[4],
  },
];

export const MOCK_DIAGNOSTIC: DiagnosticResponse = {
  quizId: "q_mock_diagnostic",
  questions: [
    {
      id: "q1",
      text: "What is 3/4 + 1/2?",
      options: ["1 1/4", "4/6", "1/2", "5/4"],
      correctIndex: 0,
      skill: "Fractions",
    },
    {
      id: "q2",
      text: "Which decimal is equal to 3/5?",
      options: ["0.35", "0.6", "0.5", "0.65"],
      correctIndex: 1,
      skill: "Decimals",
    },
    {
      id: "q3",
      text: "If a rectangle has length 8 cm and width 3 cm, what is its area?",
      options: ["11 cm²", "22 cm²", "24 cm²", "32 cm²"],
      correctIndex: 2,
      skill: "Geometry",
    },
    {
      id: "q4",
      text: "What is 25% of 80?",
      options: ["15", "20", "25", "30"],
      correctIndex: 1,
      skill: "Percentages",
    },
    {
      id: "q5",
      text: "Solve: 2x + 5 = 17",
      options: ["x = 5", "x = 6", "x = 11", "x = 12"],
      correctIndex: 1,
      skill: "Algebra",
    },
    {
      id: "q6",
      text: "Which fraction is largest?",
      options: ["1/2", "2/5", "3/8", "5/12"],
      correctIndex: 0,
      skill: "Fractions",
    },
    {
      id: "q7",
      text: "Round 4.567 to 1 decimal place.",
      options: ["4.5", "4.56", "4.6", "5.0"],
      correctIndex: 2,
      skill: "Decimals",
    },
    {
      id: "q8",
      text: "How many degrees in a right angle?",
      options: ["45°", "90°", "180°", "360°"],
      correctIndex: 1,
      skill: "Geometry",
    },
    {
      id: "q9",
      text: "If 12% of a number is 36, what is the number?",
      options: ["300", "288", "432", "200"],
      correctIndex: 0,
      skill: "Percentages",
    },
    {
      id: "q10",
      text: "Simplify: 3(x + 2) − 2x",
      options: ["x + 6", "5x + 6", "x + 2", "3x − 2"],
      correctIndex: 0,
      skill: "Algebra",
    },
  ],
};

export const MOCK_ANALYSIS: AnalysisResponse = {
  score: 70,
  skills: { Fractions: 100, Decimals: 50, Geometry: 100, Percentages: 50, Algebra: 50 },
  strengths: [
    "Confident with fraction comparison and addition",
    "Strong grasp of basic geometric properties",
    "Reads questions carefully before answering",
  ],
  weaknesses: [
    "Needs more practice converting decimals to fractions",
    "Struggling with multi-step percentage problems",
    "Algebraic simplification has occasional sign slips",
  ],
  recommendations: [
    "Practise 10 decimal-to-fraction conversions daily for one week",
    "Use visual percentage bars when solving 'find the whole' problems",
    "Review distributive property with 5 worked examples this weekend",
    "Re-attempt missed Algebra questions with a tutor on Tuesday",
  ],
  analysisText:
    "Aarav demonstrates secure understanding of fractions and basic geometry, scoring 100% in those skill areas. The diagnostic surfaces gaps in decimal-fraction equivalence and percentage word problems — both Year 6 staples that will block fluency in upcoming Year 7 ratio work. Recommended focus: short, daily practice on decimals + percentage problem cards before introducing new Year 7 content.",
};

export const MOCK_ASSESSMENT: AssessmentResponse = {
  questions: [
    {
      id: "a1",
      text: "Add: 5/8 + 1/4",
      options: ["6/12", "7/8", "5/12", "1 1/8"],
      correctIndex: 1,
      marks: 2,
      explanation: "Convert 1/4 to 2/8, then add: 5/8 + 2/8 = 7/8.",
    },
    {
      id: "a2",
      text: "Subtract: 11/12 − 1/3",
      options: ["7/12", "10/9", "1/3", "4/9"],
      correctIndex: 0,
      marks: 2,
      explanation: "1/3 = 4/12, so 11/12 − 4/12 = 7/12.",
    },
    {
      id: "a3",
      text: "Add: 2 1/2 + 3 1/4",
      options: ["5 3/4", "5 1/2", "5 1/4", "6"],
      correctIndex: 0,
      marks: 2,
      explanation: "Whole numbers: 2+3=5. Fractions: 1/2 + 1/4 = 3/4. Total: 5 3/4.",
    },
    {
      id: "a4",
      text: "Subtract: 7/10 − 1/5",
      options: ["6/5", "1/2", "3/5", "6/10"],
      correctIndex: 1,
      marks: 2,
      explanation: "1/5 = 2/10. 7/10 − 2/10 = 5/10 = 1/2.",
    },
    {
      id: "a5",
      text: "Mia ate 3/8 of a pizza, Sam ate 1/4. How much did they eat together?",
      options: ["4/12", "5/8", "1/2", "1/3"],
      correctIndex: 1,
      marks: 3,
      explanation: "1/4 = 2/8. Total = 3/8 + 2/8 = 5/8.",
    },
    {
      id: "a6",
      text: "Subtract: 1 − 5/9",
      options: ["4/9", "5/9", "1/9", "9/4"],
      correctIndex: 0,
      marks: 2,
      explanation: "1 = 9/9. 9/9 − 5/9 = 4/9.",
    },
    {
      id: "a7",
      text: "Add: 1/3 + 1/6 + 1/2",
      options: ["1", "2/3", "5/6", "3/11"],
      correctIndex: 0,
      marks: 3,
      explanation: "Common denominator 6: 2/6 + 1/6 + 3/6 = 6/6 = 1.",
    },
    {
      id: "a8",
      text: "Which is greater: 5/8 or 7/12?",
      options: ["5/8", "7/12", "Equal", "Cannot tell"],
      correctIndex: 0,
      marks: 2,
      explanation: "Common denom 24: 5/8 = 15/24, 7/12 = 14/24. So 5/8 is greater.",
    },
    {
      id: "a9",
      text: "Simplify: 18/24",
      options: ["3/4", "2/3", "6/8", "9/12"],
      correctIndex: 0,
      marks: 1,
      explanation: "GCD(18,24)=6. 18÷6=3, 24÷6=4 → 3/4.",
    },
    {
      id: "a10",
      text: "Add: 2/5 + 3/10 + 1/2",
      options: ["1 1/5", "1 2/5", "1 1/2", "6/17"],
      correctIndex: 0,
      marks: 3,
      explanation:
        "Common denom 10: 4/10 + 3/10 + 5/10 = 12/10 = 1 2/10 = 1 1/5.",
    },
  ],
};

export const MOCK_WORKSHEET: WorksheetResponse = {
  json: {
    topic: "Fractions",
    intro:
      "Today we'll practise adding and comparing fractions. Take your time, show your working and have fun!",
    sections: [
      {
        name: "MCQs",
        items: [
          {
            question: "Which is closer to 1?",
            options: ["3/4", "1/2", "5/9", "2/5"],
            answer: "3/4",
          },
          {
            question: "1/4 + 1/4 + 1/4 = ?",
            options: ["1/12", "3/4", "3/12", "1/2"],
            answer: "3/4",
          },
          {
            question: "Which fraction is in simplest form?",
            options: ["6/8", "9/12", "3/5", "10/15"],
            answer: "3/5",
          },
          {
            question: "2/3 of 12 = ?",
            options: ["4", "6", "8", "10"],
            answer: "8",
          },
        ],
      },
      {
        name: "Fill in the blanks",
        items: [
          { sentence: "1/2 + 1/2 = ___", answer: "1" },
          { sentence: "3/5 of 25 is ___", answer: "15" },
          { sentence: "The fraction equivalent to 0.25 is ___", answer: "1/4" },
          { sentence: "Half of 3/4 is ___", answer: "3/8" },
        ],
      },
      {
        name: "Match the following",
        items: [
          { pair: { left: "0.5", right: "1/2" } },
          { pair: { left: "0.25", right: "1/4" } },
          { pair: { left: "0.75", right: "3/4" } },
          { pair: { left: "0.2", right: "1/5" } },
        ],
      },
      {
        name: "Short answers",
        items: [
          { prompt: "Explain how you add two fractions with different denominators." },
          { prompt: "Why does multiplying top and bottom of a fraction by the same number not change its value?" },
        ],
      },
    ],
  },
};

export const MOCK_LESSON_PLAN: LessonPlanResponse = {
  json: {
    topic: "Adding fractions with unlike denominators",
    objectives: [
      "Find a common denominator for two fractions",
      "Add fractions with unlike denominators",
      "Simplify the resulting fraction",
    ],
    timeline: [
      { time: "0–5 min", activity: "Warm-up: 'Same or different?' fraction sort", materials: "Fraction cards", notes: "Listen for who flips numerator/denominator." },
      { time: "5–15 min", activity: "I-Do: model 1/3 + 1/4 with fraction strips", materials: "Fraction strips, whiteboard", notes: "Make the equivalent-fraction step explicit." },
      { time: "15–30 min", activity: "We-Do: solve 2/5 + 3/10 together", materials: "Mini-whiteboards", notes: "Pause at common-denominator step." },
      { time: "30–45 min", activity: "You-Do: 6 problems, increasing difficulty", materials: "Worksheet", notes: "Circulate; flag students who skip simplifying." },
      { time: "45–55 min", activity: "Mini-quiz: 4 questions, instant feedback", materials: "Quiz card", notes: "Use as exit ticket." },
      { time: "55–60 min", activity: "Closure: 'What was tricky today?' reflection", materials: "Reflection slip", notes: "Read these for tomorrow's review." },
    ],
    differentiation: {
      below: "Use pictorial fraction strips and limit to denominators 2, 4, 8 only.",
      at: "Standard worksheet — denominators up to 12, mixed numbers introduced at end.",
      above: "Three-fraction problems and word problems with extraneous information.",
    },
    assessment: "Exit-ticket quiz: 4 mixed problems. ≥3 correct = secure; 2 correct = practise; ≤1 = re-teach tomorrow.",
    homework: "10-minute worksheet: 6 fraction additions, simplify all answers.",
  },
};

export const MOCK_PRESENTATION: PresentationResponse = {
  slides: [
    {
      type: "title",
      title: "Fractions: Add Like a Pro",
      body: "Year 6 · Maths · 60 min",
      notes: "Greet the student warmly. Mention today is a fraction-mastery class.",
    },
    {
      type: "definition",
      title: "What is a fraction?",
      definition: { term: "Fraction", meaning: "A way to show parts of a whole. Top number = parts you have. Bottom number = total parts." },
      notes: "Use the pizza analogy. Confirm understanding before moving on.",
    },
    {
      type: "image_caption",
      title: "Fractions are everywhere",
      imageCaption: { caption: "Half a pizza, a quarter of a chocolate bar, three-fifths of a tank of fuel.", emoji: "🍕" },
      notes: "Ask the student for one fraction they spotted today.",
    },
    {
      type: "compare",
      title: "Like vs Unlike denominators",
      compare: {
        left: { title: "Like", points: ["Same bottom number", "Add tops directly", "Example: 1/4 + 2/4 = 3/4"] },
        right: { title: "Unlike", points: ["Different bottom numbers", "Need a common denominator first", "Example: 1/3 + 1/4"] },
      },
      notes: "Highlight that 'unlike' is today's focus.",
    },
    {
      type: "ido_wedo_youdo",
      title: "Add 1/3 + 1/4",
      iwy: {
        iDo: "I find a common denominator (12), convert 1/3 → 4/12 and 1/4 → 3/12, then add to get 7/12.",
        weDo: "Together let's solve 2/5 + 1/3. What's a common denominator?",
        youDo: "Your turn: 3/4 + 1/6. Show me your working step by step.",
      },
      notes: "Reveal columns one at a time. Pause for student input on We-Do.",
    },
    {
      type: "drag_sort",
      title: "Sort fractions by size",
      dragSort: {
        items: ["1/2", "3/8", "5/6", "1/4", "7/12"],
        buckets: [
          { name: "Less than 1/2", correctItems: ["3/8", "1/4"] },
          { name: "Equal to 1/2", correctItems: ["1/2"] },
          { name: "Greater than 1/2", correctItems: ["5/6", "7/12"] },
        ],
      },
      notes: "Encourage thinking aloud. Reset if all-or-nothing wrong.",
    },
    {
      type: "fill_blank",
      title: "Complete the equation",
      fillBlank: { sentence: "1/2 + ___ = 3/4", blanks: ["1/4"] },
      notes: "Connect back to common denominator step.",
    },
    {
      type: "quiz",
      title: "Quick check 1",
      quiz: {
        question: "What is 1/2 + 1/3?",
        options: ["2/5", "5/6", "1/6", "3/5"],
        correctIndex: 1,
        explanation: "Common denom 6: 3/6 + 2/6 = 5/6.",
      },
      notes: "Wait — let them try before revealing.",
    },
    {
      type: "quiz",
      title: "Quick check 2",
      quiz: {
        question: "Which is greater: 3/5 or 1/2?",
        options: ["3/5", "1/2", "Equal", "Cannot tell"],
        correctIndex: 0,
        explanation: "3/5 = 6/10, 1/2 = 5/10. So 3/5 is greater.",
      },
      notes: "Reinforce the common-denominator strategy.",
    },
    {
      type: "video",
      title: "Watch: Visual fraction addition",
      video: { url: "https://www.youtube.com/embed/0kqFmkN-Pi8", caption: "60-second visual: adding 1/3 + 1/4 with strips" },
      notes: "Pause at 0:30 and ask 'what's coming next?'",
    },
    {
      type: "takeaway",
      title: "Key takeaways",
      takeaway: {
        points: [
          "Same denominators? Add tops, keep the bottom.",
          "Different denominators? Find a common one first.",
          "Always simplify your answer.",
          "Check: does it make sense? (More than 1? Less than 1?)",
        ],
      },
      notes: "Have student paraphrase one takeaway.",
    },
    {
      type: "title",
      title: "Closure: Tell me one thing you learned today.",
      body: "Then: where would you use fractions outside maths class?",
      notes: "Capture the answer for the parent's progress note.",
    },
  ],
};

export const mockGameForStyle = (style: GameStyle): GamePayload => {
  switch (style) {
    case "sort":
      return {
        gameType: "sort",
        payload: {
          items: ["1/2", "0.5", "1/4", "0.25", "3/4", "0.75"],
          buckets: [
            { name: "Fractions", correctItems: ["1/2", "1/4", "3/4"] },
            { name: "Decimals", correctItems: ["0.5", "0.25", "0.75"] },
          ],
        },
      };
    case "match":
      return {
        gameType: "match",
        payload: {
          pairs: [
            { left: "1/2", right: "0.5" },
            { left: "1/4", right: "0.25" },
            { left: "3/4", right: "0.75" },
            { left: "1/5", right: "0.2" },
            { left: "1/10", right: "0.1" },
          ],
        },
      };
    case "sequence":
      return {
        gameType: "sequence",
        payload: {
          items: ["1/8", "1/4", "1/2", "3/4", "7/8"],
          correctOrder: [0, 1, 2, 3, 4],
        },
      };
    case "fill-blank":
      return {
        gameType: "fill-blank",
        payload: {
          sentence: "Half plus a quarter equals ___ . And one whole minus 1/3 equals ___ .",
          blanks: ["3/4", "2/3"],
        },
      };
    case "quiz":
      return {
        gameType: "quiz",
        payload: {
          questions: [
            { text: "What is 1/2 + 1/4?", options: ["1/6", "3/4", "2/6", "1/8"], correctIndex: 1 },
            { text: "Which is bigger: 2/3 or 3/5?", options: ["2/3", "3/5", "Equal", "Can't say"], correctIndex: 0 },
            { text: "1 − 3/8 = ?", options: ["5/8", "2/5", "3/8", "1/8"], correctIndex: 0 },
            { text: "Half of 1/2 is?", options: ["1", "1/4", "1/3", "2/4"], correctIndex: 1 },
          ],
        },
      };
  }
};

export const MOCK_LIBRARY_ITEMS: LibraryItem[] = [
  {
    id: "li_001",
    type: "diagnostic",
    title: "Diagnostic · Year 6 Maths Review",
    studentId: "s_001",
    payload: MOCK_DIAGNOSTIC,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "li_002",
    type: "lesson_plan",
    title: "Lesson Plan · Adding Fractions (60 min)",
    studentId: "s_001",
    payload: MOCK_LESSON_PLAN,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "li_003",
    type: "presentation",
    title: "Presentation · Fractions: Add Like a Pro",
    studentId: "s_001",
    payload: MOCK_PRESENTATION,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "li_004",
    type: "worksheet",
    title: "Worksheet · Fractions homework",
    studentId: "s_002",
    payload: MOCK_WORKSHEET,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
];

export const MOCK_ATTEMPTS: QuizAttempt[] = [
  {
    id: "att_001",
    studentId: "s_001",
    libraryItemId: "li_001",
    score: 60,
    skills: { Fractions: 100, Decimals: 50, Geometry: 50, Percentages: 50, Algebra: 50 },
    strengths: ["Confident with fraction comparison"],
    weaknesses: ["Decimal place-value rounding"],
    recommendations: ["Practise rounding with number-line games"],
    analysisText: "Solid baseline. Decimals & rounding need shoring up before percentages.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
  },
  {
    id: "att_002",
    studentId: "s_001",
    libraryItemId: "li_001",
    score: 70,
    skills: { Fractions: 100, Decimals: 50, Geometry: 100, Percentages: 50, Algebra: 50 },
    strengths: ["Geometry vocabulary rock solid", "Mixed-number arithmetic improved"],
    weaknesses: ["Word-problem percentages"],
    recommendations: ["Daily 10-min word problem set this week"],
    analysisText: "Steady improvement. Geometry now consistent. Focus next on word problems.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: "att_003",
    studentId: "s_001",
    libraryItemId: "li_001",
    score: 85,
    skills: { Fractions: 100, Decimals: 75, Geometry: 100, Percentages: 75, Algebra: 75 },
    strengths: ["Decimal/fraction conversion now automatic", "Algebra simplification cleaner"],
    weaknesses: ["Multi-step word problems still hesitant"],
    recommendations: ["Try 'translate the sentence' framework on next worksheet"],
    analysisText: "Big jump. Aarav's decimal work is now reliable. Recommend stretching with multi-step word problems.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];
