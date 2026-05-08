import React, { useState } from "react";
import {
  GraduationCap,
  Sparkles,
  FileText,
  ClipboardList,
  BookOpen,
  Presentation,
  Gamepad2,
  Stethoscope,
  Loader2,
  Copy,
  Download,
  Check,
  ChevronRight,
  ArrowRight,
  Wand2,
  AlertCircle,
} from "lucide-react";

// ────────────────────────────────────────────────────────────
// SHELDON'S LIBRARY — Teacher AI Assistant
// Dark navy editorial aesthetic, gold + teal + coral accents
// ────────────────────────────────────────────────────────────

const REQUIREMENTS = [
  { id: "diagnostic", label: "Diagnostic Test", icon: Stethoscope, accent: "teal", desc: "Assess prior-year understanding" },
  { id: "assessment", label: "Assessment", icon: ClipboardList, accent: "gold", desc: "Graded paper with marking scheme" },
  { id: "worksheet", label: "Worksheet", icon: FileText, accent: "coral", desc: "Downloadable practice sheet" },
  { id: "lessonplan", label: "Lesson Plan", icon: BookOpen, accent: "purple", desc: "Structured teacher guide" },
  { id: "presentation", label: "Presentation", icon: Presentation, accent: "teal", desc: "45–50 slide deck with notes" },
  { id: "games", label: "Games / Activities", icon: Gamepad2, accent: "gold", desc: "Interactive 1-to-1 games" },
];

const YEARS = ["Year 1","Year 2","Year 3","Year 4","Year 5","Year 6","Year 7","Year 8","Year 9","Year 10","Year 11","Year 12","Year 13"];
const REGIONS = ["UK","Australia"];
const SUBJECTS = ["English","Maths","Science","Chemistry","Physics","Biology","Coding","AI","Chess","Public Speaking"];
const DIFFICULTIES = ["Easy","Medium","Hard"];
const PARENT_GOALS = ["Curriculum Alignment","Skill Development","Exam Preparation"];

const WORKSHEET_SECTIONS = [
  "MCQs","Fill in the blanks","Match the following","Short answers",
  "Choose the correct option","Find the error","Sentence making",
  "Sorting game","Creative challenges","Passage","Comprehension"
];

// ────────────────────────────────────────────────────────────
// PROMPT BUILDERS — one per vertical, returns JSON-only output
// ────────────────────────────────────────────────────────────

const buildPrompt = (req, ctx, fields) => {
  const { studentName, year, region, subject } = ctx;
  const header = `Student: ${studentName || "Student"} | ${year} | ${region} | ${subject}`;

  const jsonRule = `\n\nCRITICAL: Return ONLY valid JSON. No markdown, no code fences, no preamble. Just the JSON object.`;

  switch (req) {
    case "diagnostic": {
      const prevYear = `Year ${Math.max(1, parseInt(year.replace("Year ","")) - 1)}`;
      return `You are an expert ${region} curriculum designer. Generate a diagnostic test for ${header}.

The test must assess ${prevYear} level understanding (the YEAR BEFORE current).
Parent goal: ${fields.parentGoal}.
Evaluate: Grammar, Reading, Writing, Speaking, Comprehension.

Return JSON in this exact shape:
{
  "title": "string",
  "targetLevel": "${prevYear}",
  "instructions": "string",
  "sections": [
    { "name": "Grammar|Reading|Writing|Speaking|Comprehension",
      "questions": [
        { "q": "string", "type": "mcq|short|written", "options": ["..."] (only if mcq),
          "answer": "string", "skill": "string", "explanation": "string" }
      ]
    }
  ],
  "rubric": { "strengthsToWatch": ["..."], "weaknessesToWatch": ["..."] },
  "teacherDashboard": {
    "strongAreas": ["..."], "weakAreas": ["..."],
    "recommendations": ["..."]
  }
}

Include 3-4 questions per section. Make questions age-appropriate and curriculum-aligned.${jsonRule}`;
    }

    case "assessment": {
      return `You are an expert ${region} curriculum assessor. Generate an assessment for ${header}.

Topic: ${fields.topic}
Sub-topics: ${fields.subtopic}
Timed: ${fields.timed ? "Yes" : "No"} | Duration: ${fields.duration} min
Total marks: ${fields.totalMarks} | Total questions: ${fields.totalQuestions}
Difficulty: ${fields.difficulty}

Return JSON:
{
  "title": "string",
  "instructions": "string",
  "totalMarks": ${fields.totalMarks},
  "duration": "${fields.duration} minutes",
  "questions": [
    { "no": 1, "type": "mcq|short|long|fill", "question": "string",
      "options": ["..."] (only if mcq), "marks": number,
      "answer": "string", "explanation": "string for incorrect-answer feedback",
      "difficulty": "easy|medium|hard" }
  ],
  "markingScheme": { "totalMarks": ${fields.totalMarks}, "passingMark": number, "breakdown": "string" }
}

Distribute marks logically. Mix question types.${jsonRule}`;
    }

    case "worksheet": {
      return `You are an expert ${region} teacher creating a child-friendly, colourful worksheet for ${header}.

Topic: ${fields.topic} | Sub-topic: ${fields.subtopic}
Type: ${fields.workType}
Selected sections: ${fields.sections.join(", ")}

The worksheet MUST start with a crisp topic explanation and 2-3 worked examples.

Return JSON:
{
  "title": "string",
  "topicRevision": {
    "explanation": "string (2-3 short paragraphs, simple words)",
    "keyPoints": ["..."],
    "examples": [{ "problem": "string", "solution": "string", "why": "string" }]
  },
  "sections": [
    { "type": "${WORKSHEET_SECTIONS.join("|")}",
      "instructions": "string",
      "items": [
        { "q": "string", "options": ["..."] (if applicable), "answer": "string" }
      ]
    }
  ],
  "answerKey": [{ "section": "string", "answers": ["..."] }],
  "decorativeTheme": "fun age-appropriate theme name (e.g. 'space explorers', 'jungle safari')"
}

Aim for 4-6 items per section. Use playful language for younger years.${jsonRule}`;
    }

    case "lessonplan": {
      return `You are an expert ${region} teacher writing a structured lesson plan for ${header}.

Topic: ${fields.topic} | Sub-topic: ${fields.subtopic}
Class duration: ${fields.duration} minutes

Return JSON (NO presentation slides — just the plan):
{
  "title": "string",
  "duration": "${fields.duration} minutes",
  "learningObjectives": ["..."],
  "materials": ["..."],
  "priorKnowledge": ["..."],
  "stages": [
    { "stage": "Icebreaker|Warm-up|Introduction|Teach|We Do|You Do|Assessment|Closure",
      "minutes": number,
      "teacherActions": ["..."],
      "studentActions": ["..."],
      "teacherNotes": "string (key tips for the teacher)",
      "questions": ["..."] }
  ],
  "assessmentStrategy": "string",
  "homework": "string",
  "differentiation": { "support": ["..."], "stretch": ["..."] }
}

Use simple, friendly language. Be specific, not generic.${jsonRule}`;
    }

    case "presentation": {
      return `You are a senior ${region} curriculum designer + frontend designer building a fully visual, presentation-grade HTML slide deck for ${header}.

Topic: ${fields.topic} | Sub-topic: ${fields.subtopic}
Class duration: ${fields.duration} minutes | Difficulty: ${fields.difficulty}
Extra material: ${fields.material || "(none)"}

OUTPUT: A SINGLE complete self-contained HTML file. No markdown, no commentary, no JSON. Start with <!DOCTYPE html> and end with </html>.

MANDATORY 10-stage structure (target 30 slides total — concise but covers full 60-min class):
1. Icebreaker / Rapport (2 slides)
2. Warm-up (2 slides)
3. Learning Objective (1 slide)
4. Definition (2 slides)
5. Explanation with Examples (8 slides)
6. Activity — I Do / We Do / You Do (6 slides)
7. Skill Task (3 slides)
8. Quick Assessment — 5 questions (5 slides — one per question)
9. Key Takeaways (1 slide)
10. Closure with HOTS questions (1 slide → label section as "Closure")

DECK FEATURES (build these into the HTML):
- Each slide is a full-screen <section class="slide"> inside a <main class="deck">
- Slide navigation: ← / → arrow keys, on-screen prev/next buttons, click anywhere to advance
- Progress bar at top showing current section + slide number (e.g. "Explanation · 12 / 30")
- Section indicator pill in top-right with section colour
- "T" key toggles teacher notes panel at bottom; small "Notes" button in corner
- "F" key toggles fullscreen; "P" prints (browser print → PDF)
- Smooth slide transition (200-300ms fade-slide)
- Title slide first (slide 0) with student name, topic, ${ctx.year} ${ctx.subject}

VISUAL DESIGN (Sheldon Labs brand — must look professional, NOT generic):
- Body bg: linear-gradient(135deg, #0a0e27 0%, #1e1b4b 50%, #0a0e27 100%)
- Each slide has its own gradient overlay matching its section
- Section colours: Icebreaker=coral #fb7185, Warm-up=gold #fbbf24, Objective=teal #14b8a6, Definition=violet #a78bfa, Explanation=sky #38bdf8, Activity=emerald #34d399, Skill Task=fuchsia #e879f9, Assessment=orange #fb923c, Takeaways=cyan #22d3ee, Closure=pink #f472b6
- Display font: Fraunces (Google Fonts); body: Plus Jakarta Sans
- Big bold titles (4-6rem on title slides, 3rem otherwise)
- Each content slide includes a LARGE visual element:
  * For abstract concepts → giant relevant emoji (8-10rem) inside a soft glowing circle
  * For comparisons → side-by-side cards with emojis + labels
  * For processes → numbered step-cards in a row
  * For definitions → large keyword in display font with decorative quote marks
  * For activities → pictogram instruction cards
- Decorative geometric SVG shapes (circles, blobs) in slide corners for depth
- Confetti/celebration CSS animation on the Key Takeaways slide
- Avoid plain bullet-point-only slides — every slide must feel designed

CONTENT QUALITY:
- ${parseInt(ctx.year.replace("Year ","")) <= 5 ? "Friendly, simple language for young learners. Use colourful emojis liberally." : "Age-appropriate language for older students. Visuals stay vibrant but more refined."}
- Genuinely curriculum-aligned for ${ctx.region} ${ctx.year} ${ctx.subject}
- Each slide has 1-3 short bullets MAX (no walls of text)
- Quick Assessment slides: question on top, 4 option cards below, click an option to reveal correct answer with green/red feedback + explanation
- Activity slides: clearly labelled "I Do / We Do / You Do" with what teacher does and what student does
- Closure slide: 1-2 HOTS open-ended questions

TEACHER NOTES:
- Each slide has hidden <aside class="notes"> with 1-2 sentences of teacher script
- Notes panel slides up from bottom when toggled, doesn't break layout

ACCESSIBILITY & POLISH:
- Min font size 18px
- High contrast (text always readable on gradient)
- Smooth focus states
- Works on touchscreen (tap to advance)
- Print stylesheet: each slide on its own page

Now output the entire HTML file. Start with <!DOCTYPE html>.`;
    }

    case "games": {
      return `You are a senior educational game developer for Super Sheldon. Build ONE complete, fully playable drag-and-drop HTML5 game for ${header}.

Topic: ${fields.topic} | Sub-topic: ${fields.subtopic}

GAME DESIGN REQUIREMENTS:
- Game style: ${fields.gameStyle === "Auto (best fit for topic)" ? "Pick the best drag-drop pattern for this topic (sort/match/sequence/fill-blank)" : `Use the "${fields.gameStyle}" pattern as the core mechanic`}
- Drag-and-drop mechanic central to the gameplay
- 8–12 items the student drags
- Live score + progress display (e.g. "3 / 10 correct")
- Animated visual feedback: correct = green pulse + sparkle/emoji burst; wrong = gentle red shake + retry allowed
- Vibrant, age-appropriate palette (use Sheldon brand: deep navy #0a1027, teal #2dd4bf, gold #fbbf24, coral #fb7185, soft purple #a78bfa)
- Big readable fonts (rounded sans-serif), large hit areas (min 80px) for child-friendly UX
- End screen with final score, encouraging message, "Play Again" button
- Recurring student characters allowed: Maya, Noah, Priya, Liam (use one as a friendly guide/mascot via emoji or simple SVG)
- Works on desktop (mouse drag) AND touch devices (pointer events)

TECHNICAL REQUIREMENTS:
- Output a SINGLE complete self-contained HTML file
- Inline CSS in <style>, inline JS in <script>
- NO external libraries except optional Google Fonts via <link>
- Must work standalone if saved as .html and opened in any browser
- Use HTML5 Drag and Drop API + Pointer Events for mobile fallback
- Optional: Web Audio API for tiny click/correct sounds (no external audio files)

CRITICAL OUTPUT RULES:
- Return ONLY raw HTML code
- NO markdown code fences
- NO commentary, explanation, or preamble
- Start your response with <!DOCTYPE html>
- End your response with </html>
- Nothing else outside the HTML`;
    }

    default:
      return "";
  }
};

// ────────────────────────────────────────────────────────────
// API CALL
// ────────────────────────────────────────────────────────────

const callClaude = async (prompt, format = "json") => {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 32000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API error ${response.status}: ${errText.slice(0, 200)}`);
  }

  const data = await response.json();
  const text = data.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");

  if (format === "html") {
    // Extract HTML — find <!DOCTYPE or <html start
    let html = text.replace(/```html\s*/gi, "").replace(/```/g, "").trim();
    const docIdx = html.search(/<!DOCTYPE/i);
    if (docIdx > 0) html = html.slice(docIdx);
    const endIdx = html.lastIndexOf("</html>");
    if (endIdx !== -1) html = html.slice(0, endIdx + 7);
    if (!html.toLowerCase().includes("<html")) {
      throw new Error(`Game generation returned no HTML. Preview: ${text.slice(0, 300)}…`);
    }
    return html;
  }

  // Robust JSON extraction — find the outermost JSON object
  let jsonStr = text.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
  const firstBrace = jsonStr.indexOf("{");
  const lastBrace = jsonStr.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    jsonStr = jsonStr.slice(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(jsonStr);
  } catch (parseErr) {
    const preview = text.slice(0, 500);
    throw new Error(
      `Claude returned non-JSON or truncated output. Try a smaller request (e.g. shorter presentation). Preview: ${preview}…`
    );
  }
};

// ────────────────────────────────────────────────────────────
// UI ATOMS
// ────────────────────────────────────────────────────────────

const accentColor = {
  gold: { bg: "bg-amber-400/10", text: "text-amber-300", border: "border-amber-400/30", solid: "bg-amber-400" },
  teal: { bg: "bg-teal-400/10", text: "text-teal-300", border: "border-teal-400/30", solid: "bg-teal-400" },
  coral: { bg: "bg-rose-400/10", text: "text-rose-300", border: "border-rose-400/30", solid: "bg-rose-400" },
  purple: { bg: "bg-violet-400/10", text: "text-violet-300", border: "border-violet-400/30", solid: "bg-violet-400" },
};

const Field = ({ label, children, hint }) => (
  <div className="space-y-1.5">
    <label className="text-xs uppercase tracking-widest text-slate-400 font-medium">{label}</label>
    {children}
    {hint && <p className="text-[11px] text-slate-500 italic">{hint}</p>}
  </div>
);

const inputCls =
  "w-full bg-slate-900/60 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/30 transition";

// ────────────────────────────────────────────────────────────
// MAIN APP
// ────────────────────────────────────────────────────────────

export default function SheldonsLibrary() {
  // Layer 1
  const [ctx, setCtx] = useState({ studentName: "", year: "Year 5", region: "UK", subject: "English" });
  // Layer 2
  const [requirement, setRequirement] = useState("");
  // Layer 3 (dynamic)
  const [fields, setFields] = useState({
    parentGoal: "Curriculum Alignment",
    topic: "",
    subtopic: "",
    timed: true,
    duration: 60,
    totalMarks: 50,
    totalQuestions: 25,
    difficulty: "Medium",
    workType: "Homework",
    sections: ["MCQs", "Fill in the blanks"],
    material: "",
    gameStyle: "Auto (best fit for topic)",
  });
  // Output
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [output, setOutput] = useState(null);
  const [copied, setCopied] = useState(false);

  const updateField = (k, v) => setFields((s) => ({ ...s, [k]: v }));
  const toggleSection = (s) =>
    updateField(
      "sections",
      fields.sections.includes(s) ? fields.sections.filter((x) => x !== s) : [...fields.sections, s]
    );

  const handleGenerate = async () => {
    setError("");
    setOutput(null);
    setLoading(true);
    try {
      const prompt = buildPrompt(requirement, ctx, fields);
      const format = (requirement === "games" || requirement === "presentation") ? "html" : "json";
      const result = await callClaude(prompt, format);
      setOutput({ type: requirement, format, data: result });
    } catch (e) {
      setError(e.message || "Generation failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const payload = output.format === "html" ? output.data : JSON.stringify(output.data, null, 2);
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const isHtml = output.format === "html";
    const blob = new Blob(
      [isHtml ? output.data : JSON.stringify(output.data, null, 2)],
      { type: isHtml ? "text/html" : "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${output.type}-${ctx.year.replace(" ", "")}-${Date.now()}.${isHtml ? "html" : "json"}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const canGenerate = ctx.studentName && requirement && (
    requirement === "diagnostic" ? true :
    requirement === "games" ? fields.topic :
    fields.topic
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100" style={{
      backgroundImage: "radial-gradient(circle at 20% 0%, rgba(251, 191, 36, 0.06), transparent 50%), radial-gradient(circle at 80% 100%, rgba(45, 212, 191, 0.05), transparent 50%)"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Fraunces', serif; font-feature-settings: "ss01"; }
        .font-body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.2); border-radius: 3px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-up { animation: fadeUp 0.4s ease-out forwards; }
      `}</style>

      <div className="font-body max-w-7xl mx-auto px-6 py-8">
        {/* HEADER */}
        <header className="flex items-center justify-between mb-10 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
              <GraduationCap className="w-5 h-5 text-slate-900" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight">
                Sheldon's <span className="text-amber-400 italic">Library</span>
              </h1>
              <p className="text-xs text-slate-400 -mt-0.5">AI-powered teacher assistant · Super Sheldon</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 bg-slate-900/60 px-3 py-1.5 rounded-full border border-slate-800">
            <Sparkles className="w-3 h-3 text-amber-400" /> Powered by Claude Sonnet 4
          </div>
        </header>

        {/* TWO-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT — INPUT FORM */}
          <div className="lg:col-span-5 space-y-5">
            {/* LAYER 1 */}
            <section className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-mono text-amber-400">01</span>
                <h2 className="font-display text-lg font-semibold">Student & Class Context</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Field label="Student Name">
                    <input
                      className={inputCls}
                      placeholder="e.g. Maya Patel"
                      value={ctx.studentName}
                      onChange={(e) => setCtx({ ...ctx, studentName: e.target.value })}
                    />
                  </Field>
                </div>
                <Field label="Year / Grade">
                  <select className={inputCls} value={ctx.year} onChange={(e) => setCtx({ ...ctx, year: e.target.value })}>
                    {YEARS.map((y) => <option key={y}>{y}</option>)}
                  </select>
                </Field>
                <Field label="Region">
                  <select className={inputCls} value={ctx.region} onChange={(e) => setCtx({ ...ctx, region: e.target.value })}>
                    {REGIONS.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </Field>
                <div className="col-span-2">
                  <Field label="Subject">
                    <select className={inputCls} value={ctx.subject} onChange={(e) => setCtx({ ...ctx, subject: e.target.value })}>
                      {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>
              </div>
            </section>

            {/* LAYER 2 */}
            <section className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-mono text-amber-400">02</span>
                <h2 className="font-display text-lg font-semibold">Select Requirement</h2>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {REQUIREMENTS.map((r) => {
                  const Icon = r.icon;
                  const selected = requirement === r.id;
                  const c = accentColor[r.accent];
                  return (
                    <button
                      key={r.id}
                      onClick={() => setRequirement(r.id)}
                      className={`text-left p-3 rounded-lg border transition-all ${
                        selected
                          ? `${c.bg} ${c.border} ring-1 ring-amber-400/30`
                          : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-2 ${selected ? c.text : "text-slate-500"}`} />
                      <div className={`text-sm font-medium ${selected ? "text-white" : "text-slate-300"}`}>
                        {r.label}
                      </div>
                      <div className="text-[11px] text-slate-500 leading-snug mt-0.5">{r.desc}</div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* LAYER 3 — DYNAMIC */}
            {requirement && (
              <section className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 animate-fade-up">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-mono text-amber-400">03</span>
                  <h2 className="font-display text-lg font-semibold">
                    {REQUIREMENTS.find((r) => r.id === requirement)?.label} Details
                  </h2>
                </div>

                {requirement === "diagnostic" && (
                  <div className="space-y-3">
                    <Field label="Parent Goal" hint={`Test will assess ONE year below ${ctx.year}.`}>
                      <select className={inputCls} value={fields.parentGoal} onChange={(e) => updateField("parentGoal", e.target.value)}>
                        {PARENT_GOALS.map((g) => <option key={g}>{g}</option>)}
                      </select>
                    </Field>
                  </div>
                )}

                {requirement === "assessment" && (
                  <div className="space-y-3">
                    <Field label="Topic"><input className={inputCls} value={fields.topic} onChange={(e) => updateField("topic", e.target.value)} placeholder="e.g. Fractions" /></Field>
                    <Field label="Sub-topics"><input className={inputCls} value={fields.subtopic} onChange={(e) => updateField("subtopic", e.target.value)} placeholder="e.g. Adding & subtracting" /></Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Total Marks"><input type="number" className={inputCls} value={fields.totalMarks} onChange={(e) => updateField("totalMarks", +e.target.value)} /></Field>
                      <Field label="Total Questions"><input type="number" className={inputCls} value={fields.totalQuestions} onChange={(e) => updateField("totalQuestions", +e.target.value)} /></Field>
                      <Field label="Duration (min)"><input type="number" className={inputCls} value={fields.duration} onChange={(e) => updateField("duration", +e.target.value)} /></Field>
                      <Field label="Difficulty">
                        <select className={inputCls} value={fields.difficulty} onChange={(e) => updateField("difficulty", e.target.value)}>
                          {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
                        </select>
                      </Field>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-slate-300">
                      <input type="checkbox" checked={fields.timed} onChange={(e) => updateField("timed", e.target.checked)} className="accent-amber-400" />
                      Timed Assessment
                    </label>
                  </div>
                )}

                {requirement === "worksheet" && (
                  <div className="space-y-3">
                    <Field label="Topic"><input className={inputCls} value={fields.topic} onChange={(e) => updateField("topic", e.target.value)} /></Field>
                    <Field label="Sub-topic"><input className={inputCls} value={fields.subtopic} onChange={(e) => updateField("subtopic", e.target.value)} /></Field>
                    <Field label="Type">
                      <select className={inputCls} value={fields.workType} onChange={(e) => updateField("workType", e.target.value)}>
                        <option>Homework</option><option>Classwork</option>
                      </select>
                    </Field>
                    <Field label="Sections (multi-select)">
                      <div className="grid grid-cols-2 gap-1.5 mt-1">
                        {WORKSHEET_SECTIONS.map((s) => {
                          const on = fields.sections.includes(s);
                          return (
                            <button key={s} onClick={() => toggleSection(s)}
                              className={`text-xs text-left px-2.5 py-1.5 rounded border transition ${
                                on ? "bg-amber-400/10 border-amber-400/40 text-amber-200" : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
                              }`}>
                              {on ? "✓ " : ""}{s}
                            </button>
                          );
                        })}
                      </div>
                    </Field>
                  </div>
                )}

                {requirement === "lessonplan" && (
                  <div className="space-y-3">
                    <Field label="Topic"><input className={inputCls} value={fields.topic} onChange={(e) => updateField("topic", e.target.value)} /></Field>
                    <Field label="Sub-topic"><input className={inputCls} value={fields.subtopic} onChange={(e) => updateField("subtopic", e.target.value)} /></Field>
                    <Field label="Class Duration (minutes)"><input type="number" className={inputCls} value={fields.duration} onChange={(e) => updateField("duration", +e.target.value)} /></Field>
                  </div>
                )}

                {requirement === "presentation" && (
                  <div className="space-y-3">
                    <Field label="Topic"><input className={inputCls} value={fields.topic} onChange={(e) => updateField("topic", e.target.value)} /></Field>
                    <Field label="Sub-topic"><input className={inputCls} value={fields.subtopic} onChange={(e) => updateField("subtopic", e.target.value)} /></Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Class Duration (min)"><input type="number" className={inputCls} value={fields.duration} onChange={(e) => updateField("duration", +e.target.value)} /></Field>
                      <Field label="Difficulty">
                        <select className={inputCls} value={fields.difficulty} onChange={(e) => updateField("difficulty", e.target.value)}>
                          {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
                        </select>
                      </Field>
                    </div>
                    <Field label="Extra Material (optional)" hint="Will be transformed into the 10-stage structure.">
                      <textarea rows={3} className={inputCls} value={fields.material} onChange={(e) => updateField("material", e.target.value)} placeholder="Paste any reference text…" />
                    </Field>
                  </div>
                )}

                {requirement === "games" && (
                  <div className="space-y-3">
                    <Field label="Topic"><input className={inputCls} value={fields.topic} onChange={(e) => updateField("topic", e.target.value)} placeholder="e.g. Verb Tenses" /></Field>
                    <Field label="Sub-topic"><input className={inputCls} value={fields.subtopic} onChange={(e) => updateField("subtopic", e.target.value)} placeholder="e.g. Past, Present, Future" /></Field>
                    <Field label="Game Style" hint="Choose the drag-drop pattern. 'Auto' picks what fits your topic best.">
                      <select className={inputCls} value={fields.gameStyle} onChange={(e) => updateField("gameStyle", e.target.value)}>
                        <option>Auto (best fit for topic)</option>
                        <option>Sort (drag items into category buckets)</option>
                        <option>Match (pair items with their counterparts)</option>
                        <option>Sequence (drag items into correct order)</option>
                        <option>Fill-blank (drag words into sentence gaps)</option>
                      </select>
                    </Field>
                  </div>
                )}
              </section>
            )}

            {/* GENERATE BUTTON */}
            <button
              onClick={handleGenerate}
              disabled={!canGenerate || loading}
              className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-900 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
              ) : (
                <><Wand2 className="w-4 h-4" /> Generate <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>

          {/* RIGHT — OUTPUT */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl min-h-[600px] overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="font-display text-lg font-semibold">AI Output</h3>
                </div>
                {output && (
                  <div className="flex gap-2">
                    <button onClick={handleCopy} className="text-xs text-slate-400 hover:text-amber-300 px-2.5 py-1 rounded border border-slate-800 hover:border-slate-700 flex items-center gap-1.5">
                      {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                    </button>
                    <button onClick={handleDownload} className="text-xs text-slate-400 hover:text-amber-300 px-2.5 py-1 rounded border border-slate-800 hover:border-slate-700 flex items-center gap-1.5">
                      <Download className="w-3 h-3" /> {output.format === "html" ? "HTML" : "JSON"}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
                {error && (
                  <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-lg p-3 text-sm flex gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {error}
                  </div>
                )}

                {!output && !error && !loading && (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16">
                    <div className="w-14 h-14 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mb-4">
                      <Wand2 className="w-6 h-6 text-amber-400" />
                    </div>
                    <p className="font-display text-xl text-slate-200 mb-1">Ready when you are</p>
                    <p className="text-sm text-slate-500 max-w-xs">Fill the form on the left and your generated content will appear here in seconds.</p>
                  </div>
                )}

                {loading && (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16">
                    <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-4" />
                    <p className="text-sm text-slate-400">Crafting your {REQUIREMENTS.find((r) => r.id === requirement)?.label.toLowerCase()}…</p>
                    <p className="text-xs text-slate-600 mt-1">This may take 10–30 seconds.</p>
                  </div>
                )}

                {output && <OutputRenderer type={output.type} format={output.format} data={output.data} />}
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-10 pt-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col md:flex-row gap-2 justify-between">
          <p>Sheldon's Library · Built for Super Sheldon teachers</p>
          <p>Presentations & Games render as live HTML — share the file or print to PDF.</p>
        </footer>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// OUTPUT RENDERERS — pretty per-type display
// ────────────────────────────────────────────────────────────

const OutputRenderer = ({ type, format, data }) => {
  if (!data) return null;
  if (format === "html") return <GameFrame html={data} type={type} />;
  switch (type) {
    case "diagnostic": return <DiagnosticView d={data} />;
    case "assessment": return <AssessmentView d={data} />;
    case "worksheet":  return <WorksheetView d={data} />;
    case "lessonplan": return <LessonPlanView d={data} />;
    case "presentation": return <PresentationView d={data} />;
    case "games":      return <GamesView d={data} />;
    default: return <pre className="text-xs text-slate-300 whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>;
  }
};

const GameFrame = ({ html, type }) => {
  const [fullscreen, setFullscreen] = useState(false);
  const isDeck = type === "presentation";
  const label = isDeck
    ? "🎤 Live presentation deck · ← → to navigate · T = teacher notes · F = fullscreen · P = print"
    : "🎮 Playable game · drag-and-drop interactive";
  const tip = isDeck
    ? "💡 Press F inside the deck for fullscreen, P to print as PDF. Click HTML above to download the deck."
    : "💡 Click HTML above to download. Open the file in any browser, or share the link with the student.";
  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-3 gap-2">
        <p className="text-xs text-slate-400 leading-snug">{label}</p>
        <button
          onClick={() => setFullscreen(!fullscreen)}
          className="text-xs text-amber-300 hover:text-amber-200 px-2 py-1 rounded border border-amber-400/30 hover:border-amber-400/50 shrink-0"
        >
          {fullscreen ? "Compact view" : "Expand"}
        </button>
      </div>
      <iframe
        srcDoc={html}
        title={isDeck ? "Sheldon's Library Presentation" : "Sheldon's Library Game"}
        sandbox="allow-scripts allow-same-origin allow-pointer-lock"
        className="w-full bg-white rounded-lg border border-slate-800"
        style={{ height: fullscreen ? "90vh" : (isDeck ? "720px" : "640px") }}
      />
      <p className="text-xs text-slate-500 italic mt-2">{tip}</p>
    </div>
  );
};

const SectionHead = ({ children }) => (
  <h4 className="font-display text-base font-semibold text-amber-300 mt-5 mb-2 flex items-center gap-2">
    <ChevronRight className="w-4 h-4" /> {children}
  </h4>
);

const Pill = ({ children, color = "slate" }) => (
  <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-${color}-400/10 text-${color}-300 border border-${color}-400/20`}>{children}</span>
);

const DiagnosticView = ({ d }) => (
  <div className="space-y-4 animate-fade-up">
    <div>
      <h3 className="font-display text-2xl font-bold">{d.title}</h3>
      <p className="text-sm text-slate-400 mt-1">Target Level: <span className="text-amber-300">{d.targetLevel}</span></p>
      <p className="text-sm text-slate-300 mt-2">{d.instructions}</p>
    </div>

    {d.sections?.map((s, i) => (
      <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
        <h4 className="font-display text-lg font-semibold text-teal-300 mb-3">{s.name}</h4>
        <div className="space-y-3">
          {s.questions?.map((q, j) => (
            <div key={j} className="border-l-2 border-slate-700 pl-3">
              <p className="text-sm text-slate-200">{j + 1}. {q.q}</p>
              {q.options && (
                <ul className="text-xs text-slate-400 mt-1 ml-3 space-y-0.5">
                  {q.options.map((o, k) => <li key={k}>{String.fromCharCode(97 + k)}) {o}</li>)}
                </ul>
              )}
              <p className="text-xs text-amber-300 mt-1.5">✓ {q.answer}</p>
              {q.explanation && <p className="text-xs text-slate-500 italic mt-0.5">{q.explanation}</p>}
            </div>
          ))}
        </div>
      </div>
    ))}

    {d.teacherDashboard && (
      <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-400/30 rounded-lg p-4">
        <h4 className="font-display text-lg font-semibold text-amber-300 mb-3">Teacher Dashboard</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wider text-teal-400 mb-1">Strong Areas</p>
            <ul className="text-slate-300 space-y-1">{d.teacherDashboard.strongAreas?.map((x, i) => <li key={i}>• {x}</li>)}</ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-rose-400 mb-1">Weak Areas</p>
            <ul className="text-slate-300 space-y-1">{d.teacherDashboard.weakAreas?.map((x, i) => <li key={i}>• {x}</li>)}</ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-violet-400 mb-1">Recommendations</p>
            <ul className="text-slate-300 space-y-1">{d.teacherDashboard.recommendations?.map((x, i) => <li key={i}>• {x}</li>)}</ul>
          </div>
        </div>
      </div>
    )}
  </div>
);

const AssessmentView = ({ d }) => (
  <div className="space-y-4 animate-fade-up">
    <div>
      <h3 className="font-display text-2xl font-bold">{d.title}</h3>
      <div className="flex gap-3 text-xs text-slate-400 mt-1">
        <span>Total: <b className="text-amber-300">{d.totalMarks} marks</b></span>
        <span>Duration: {d.duration}</span>
      </div>
      <p className="text-sm text-slate-300 mt-2">{d.instructions}</p>
    </div>

    <div className="space-y-3">
      {d.questions?.map((q, i) => (
        <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-lg p-3.5">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <p className="text-sm text-slate-100"><b className="text-amber-300">Q{q.no}.</b> {q.question}</p>
            <div className="flex gap-1.5 shrink-0">
              <span className="text-[10px] text-slate-500">{q.type}</span>
              <span className="text-[10px] text-amber-400">[{q.marks}m]</span>
            </div>
          </div>
          {q.options && (
            <ul className="text-xs text-slate-400 ml-4 space-y-0.5 mb-1.5">
              {q.options.map((o, k) => <li key={k}>{String.fromCharCode(65 + k)}. {o}</li>)}
            </ul>
          )}
          <details className="text-xs">
            <summary className="text-teal-400 cursor-pointer hover:text-teal-300">Show answer & explanation</summary>
            <p className="text-amber-300 mt-1">✓ {q.answer}</p>
            <p className="text-slate-400 italic mt-0.5">{q.explanation}</p>
          </details>
        </div>
      ))}
    </div>

    {d.markingScheme && (
      <div className="bg-amber-400/5 border border-amber-400/20 rounded-lg p-3 text-xs">
        <p className="text-amber-300 font-semibold mb-1">Marking Scheme</p>
        <p className="text-slate-300">Pass: {d.markingScheme.passingMark}/{d.markingScheme.totalMarks}</p>
        <p className="text-slate-400 mt-0.5">{d.markingScheme.breakdown}</p>
      </div>
    )}
  </div>
);

const WorksheetView = ({ d }) => (
  <div className="space-y-4 animate-fade-up">
    <div className="bg-gradient-to-br from-rose-400/10 to-amber-400/10 border border-rose-300/20 rounded-lg p-4">
      <h3 className="font-display text-2xl font-bold">{d.title}</h3>
      {d.decorativeTheme && <p className="text-xs text-rose-300 mt-1">🎨 Theme: {d.decorativeTheme}</p>}
    </div>

    {d.topicRevision && (
      <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
        <h4 className="font-display text-lg font-semibold text-teal-300 mb-2">📖 Topic Revision</h4>
        <p className="text-sm text-slate-300 leading-relaxed">{d.topicRevision.explanation}</p>
        {d.topicRevision.keyPoints && (
          <ul className="text-sm text-slate-300 mt-3 space-y-1">
            {d.topicRevision.keyPoints.map((p, i) => <li key={i}>✦ {p}</li>)}
          </ul>
        )}
        {d.topicRevision.examples && (
          <div className="mt-3 space-y-2">
            <p className="text-xs uppercase tracking-wider text-amber-400">Worked Examples</p>
            {d.topicRevision.examples.map((ex, i) => (
              <div key={i} className="bg-slate-950/50 border border-slate-800 rounded p-2.5 text-xs">
                <p className="text-slate-200"><b>Q:</b> {ex.problem}</p>
                <p className="text-amber-300 mt-1"><b>A:</b> {ex.solution}</p>
                <p className="text-slate-500 italic mt-0.5">{ex.why}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    )}

    {d.sections?.map((s, i) => (
      <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
        <h4 className="font-display text-lg font-semibold text-amber-300">{s.type}</h4>
        <p className="text-xs text-slate-400 italic mb-3">{s.instructions}</p>
        <ol className="space-y-1.5 text-sm text-slate-200 list-decimal list-inside">
          {s.items?.map((it, j) => (
            <li key={j}>
              {it.q}
              {it.options && <span className="text-xs text-slate-500 ml-2">({it.options.join(" / ")})</span>}
            </li>
          ))}
        </ol>
      </div>
    ))}

    {d.answerKey && (
      <details className="bg-emerald-400/5 border border-emerald-400/20 rounded-lg p-3">
        <summary className="text-sm font-semibold text-emerald-300 cursor-pointer">🔑 Answer Key</summary>
        <div className="mt-2 space-y-2 text-xs">
          {d.answerKey.map((k, i) => (
            <div key={i}><b className="text-emerald-300">{k.section}:</b> <span className="text-slate-300">{k.answers?.join(" · ")}</span></div>
          ))}
        </div>
      </details>
    )}
  </div>
);

const LessonPlanView = ({ d }) => (
  <div className="space-y-4 animate-fade-up">
    <div>
      <h3 className="font-display text-2xl font-bold">{d.title}</h3>
      <p className="text-xs text-slate-400 mt-0.5">{d.duration}</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
      <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3">
        <p className="text-xs uppercase tracking-wider text-violet-400 mb-2">Learning Objectives</p>
        <ul className="space-y-1 text-slate-300">{d.learningObjectives?.map((o, i) => <li key={i}>• {o}</li>)}</ul>
      </div>
      <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3">
        <p className="text-xs uppercase tracking-wider text-teal-400 mb-2">Materials</p>
        <ul className="space-y-1 text-slate-300">{d.materials?.map((o, i) => <li key={i}>• {o}</li>)}</ul>
      </div>
    </div>

    <div className="space-y-2">
      <p className="font-display text-lg font-semibold text-amber-300">Lesson Stages</p>
      {d.stages?.map((s, i) => (
        <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-lg p-3.5 border-l-2 border-l-amber-400">
          <div className="flex items-center justify-between mb-1.5">
            <p className="font-semibold text-slate-100">{s.stage}</p>
            <span className="text-xs text-amber-300">{s.minutes} min</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-teal-400 font-medium mb-1">Teacher</p>
              <ul className="text-slate-300 space-y-0.5">{s.teacherActions?.map((a, k) => <li key={k}>· {a}</li>)}</ul>
            </div>
            <div>
              <p className="text-rose-400 font-medium mb-1">Student</p>
              <ul className="text-slate-300 space-y-0.5">{s.studentActions?.map((a, k) => <li key={k}>· {a}</li>)}</ul>
            </div>
          </div>
          {s.teacherNotes && <p className="text-xs text-amber-400/90 italic mt-2">📝 {s.teacherNotes}</p>}
        </div>
      ))}
    </div>

    {d.differentiation && (
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-emerald-400/5 border border-emerald-400/20 rounded-lg p-3">
          <p className="text-emerald-300 font-semibold mb-1">Support</p>
          <ul className="text-slate-300 space-y-0.5">{d.differentiation.support?.map((x, i) => <li key={i}>• {x}</li>)}</ul>
        </div>
        <div className="bg-violet-400/5 border border-violet-400/20 rounded-lg p-3">
          <p className="text-violet-300 font-semibold mb-1">Stretch</p>
          <ul className="text-slate-300 space-y-0.5">{d.differentiation.stretch?.map((x, i) => <li key={i}>• {x}</li>)}</ul>
        </div>
      </div>
    )}

    {d.homework && <p className="text-sm text-slate-300"><b className="text-amber-300">Homework: </b>{d.homework}</p>}
  </div>
);

const PresentationView = ({ d }) => {
  const [openSlide, setOpenSlide] = useState(0);
  const sectionColors = {
    "Icebreaker": "bg-rose-400/10 text-rose-300 border-rose-400/30",
    "Warm-up": "bg-amber-400/10 text-amber-300 border-amber-400/30",
    "Objective": "bg-teal-400/10 text-teal-300 border-teal-400/30",
    "Definition": "bg-violet-400/10 text-violet-300 border-violet-400/30",
    "Explanation": "bg-blue-400/10 text-blue-300 border-blue-400/30",
    "Activity": "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
    "Skill Task": "bg-fuchsia-400/10 text-fuchsia-300 border-fuchsia-400/30",
    "Assessment": "bg-orange-400/10 text-orange-300 border-orange-400/30",
    "Takeaways": "bg-cyan-400/10 text-cyan-300 border-cyan-400/30",
    "Closure": "bg-pink-400/10 text-pink-300 border-pink-400/30",
  };
  return (
    <div className="space-y-3 animate-fade-up">
      <div>
        <h3 className="font-display text-2xl font-bold">{d.title}</h3>
        <p className="text-xs text-amber-300 mt-1">{d.totalSlides} slides · 10-stage Sheldon structure</p>
      </div>
      <div className="space-y-1.5">
        {d.slides?.map((s, i) => {
          const open = openSlide === i;
          const c = sectionColors[s.section] || "bg-slate-700 text-slate-300";
          return (
            <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden">
              <button onClick={() => setOpenSlide(open ? -1 : i)} className="w-full p-3 flex items-center gap-3 hover:bg-slate-900 text-left">
                <span className="text-xs font-mono text-slate-500 w-6 shrink-0">{String(s.no).padStart(2, "0")}</span>
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${c} shrink-0`}>{s.section}</span>
                <span className="text-sm text-slate-200 flex-1 truncate">{s.title}</span>
                <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${open ? "rotate-90" : ""}`} />
              </button>
              {open && (
                <div className="px-4 pb-3 space-y-2 text-sm">
                  {s.bullets && (
                    <ul className="text-slate-300 space-y-0.5">{s.bullets.map((b, k) => <li key={k}>• {b}</li>)}</ul>
                  )}
                  {s.teacherNotes && <p className="text-xs text-amber-400/90 italic bg-amber-400/5 p-2 rounded">📝 Teacher: {s.teacherNotes}</p>}
                  {s.imagePrompt && (
                    <p className="text-xs text-violet-300 bg-violet-400/5 p-2 rounded">
                      🎨 <b>Gemini Image Prompt:</b> {s.imagePrompt}
                    </p>
                  )}
                  {s.interactivity && <p className="text-xs text-teal-300">⚡ {s.interactivity}</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const GamesView = ({ d }) => (
  <div className="space-y-4 animate-fade-up">
    {d.games?.map((g, i) => (
      <div key={i} className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-800 rounded-lg p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-display text-lg font-semibold text-amber-300">🎮 {g.title}</h4>
            <p className="text-xs text-slate-400">{g.type} · {g.duration}</p>
          </div>
        </div>
        <p className="text-sm text-slate-300 mb-3"><b className="text-teal-300">Objective:</b> {g.objective}</p>
        {g.rules && (
          <div className="mb-3">
            <p className="text-xs uppercase tracking-wider text-violet-400 mb-1">Rules</p>
            <ul className="text-xs text-slate-300 space-y-0.5">{g.rules.map((r, k) => <li key={k}>{k + 1}. {r}</li>)}</ul>
          </div>
        )}
        {g.rounds && (
          <div className="space-y-1.5 mb-3">
            <p className="text-xs uppercase tracking-wider text-rose-400">Rounds</p>
            {g.rounds.map((r, k) => (
              <div key={k} className="text-xs bg-slate-950/50 rounded p-2 border border-slate-800">
                <p className="text-slate-200"><b>Round {r.round}:</b> {r.prompt}</p>
                <p className="text-slate-500 italic">→ {r.expectedResponse} ({r.scoring})</p>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-amber-400/80 italic">🎯 {g.learningOutcome}</p>
      </div>
    ))}
  </div>
);
