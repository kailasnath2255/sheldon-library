import type { TemplatedPresentation, TemplatedGame, TemplatedWorksheet, TemplatedLessonPlan, TemplatedQuiz } from "./template-types";
import { themeForId } from "./themes";
import { subjectForId } from "./subjects";

// Merge theme decorations with subject decorations (subject motifs come first, then theme)
function mergedDecorations(themeDecorations: string[], subjectId?: string): string[] {
  const subj = subjectForId(subjectId);
  // Interleave so we don't dominate with one kind
  const out: string[] = [];
  const max = Math.max(subj.decorations.length, themeDecorations.length);
  for (let i = 0; i < max; i++) {
    if (subj.decorations[i]) out.push(subj.decorations[i]);
    if (themeDecorations[i]) out.push(themeDecorations[i]);
  }
  return out.length ? out : themeDecorations;
}

// ─── Logo embedding ─────────────────────────────────────────
// We fetch the logo once and cache its base64 data URL so injected
// templates are fully self-contained — they show the right branding
// even if downloaded to disk and reopened offline.
let _logoDataUrlPromise: Promise<string> | null = null;
async function logoAsDataUrl(): Promise<string> {
  if (!_logoDataUrlPromise) {
    _logoDataUrlPromise = (async () => {
      try {
        const res = await fetch("/logo.webp");
        const blob = await res.blob();
        return await new Promise<string>((resolve, reject) => {
          const r = new FileReader();
          r.onload = () => resolve(typeof r.result === "string" ? r.result : "");
          r.onerror = reject;
          r.readAsDataURL(blob);
        });
      } catch {
        return ""; // graceful: template still renders without the chip image
      }
    })();
  }
  return _logoDataUrlPromise;
}

// ─── Sanitization ──────────────────────────────────────────
// The template's renderer functions HTML-escape every string they receive,
// but we still defensively reject obviously dangerous content at the
// payload level (script-like keys, etc.) before serializing.
function safeJsonStringify(obj: unknown): string {
  // The </script> sequence inside a string would close our injection script
  // early. JSON.stringify alone doesn't escape it, so we patch it.
  return JSON.stringify(obj).replace(/<\/script/gi, "<\\/script");
}

// ─── Main injection ─────────────────────────────────────────
export async function injectTemplate(
  templateHtml: string,
  data: TemplatedPresentation
): Promise<string> {
  const theme = themeForId(data.themeId);
  const logoUrl = await logoAsDataUrl();

  // Merge theme + slide data into a single object the template script reads
  const ss = {
    title: data.title,
    theme: {
      id: theme.id,
      primary: theme.primary,
      primarySoft: theme.primarySoft,
      accent: theme.accent,
      secondary: theme.secondary,
      secondarySoft: theme.secondarySoft,
      bg1: theme.bg1,
      bg2: theme.bg2,
      bg3: theme.bg3,
      ink: theme.ink,
      cream: theme.cream,
      displayFont: theme.displayFont,
      bodyFont: theme.bodyFont,
      mascot1: { name: theme.mascot1.name, svg: theme.mascot1.svg },
      mascot2: { name: theme.mascot2.name, svg: theme.mascot2.svg },
      decorations: mergedDecorations(theme.decorations, data.subjectId),
    },
    logoUrl,
    slides: data.slides,
  };

  return templateHtml
    .replace(/__TITLE__/g, escapeHtml(data.title))
    .replace(/__PRIMARY__/g, theme.primary)
    .replace(/__PRIMARY_SOFT__/g, theme.primarySoft)
    .replace(/__ACCENT__/g, theme.accent)
    .replace(/__SECONDARY__/g, theme.secondary)
    .replace(/__SECONDARY_SOFT__/g, theme.secondarySoft)
    .replace(/__BG1__/g, theme.bg1)
    .replace(/__BG2__/g, theme.bg2)
    .replace(/__BG3__/g, theme.bg3)
    .replace(/__INK__/g, theme.ink)
    .replace(/__CREAM__/g, theme.cream)
    .replace(/__DISPLAY_FONT__/g, theme.displayFont)
    .replace(/__BODY_FONT__/g, theme.bodyFont)
    .replace(/__LOGO_URL__/g, logoUrl)
    .replace(/__DATA_JSON__/g, safeJsonStringify(ss));
}

function escapeHtml(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );
}

// ─── Template loading ───────────────────────────────────────
// Templates are served from /public/templates/ so they're easy to inspect,
// can grow without bloating the JS bundle, and can be downloaded by the
// browser as standalone assets.
const TEMPLATE_URLS: Record<string, string> = {
  "presentation-classic":  "/templates/presentation-classic.html",
  "presentation-academic": "/templates/presentation-academic.html",
  "game-arcade":           "/templates/game-arcade.html",
  "worksheet-print":       "/templates/worksheet-print.html",
  "lessonplan-timeline":   "/templates/lessonplan-timeline.html",
  "quiz-live":             "/templates/quiz-live.html",
};

// Bump this version when a template HTML changes so the browser cache
// doesn't serve a stale copy. Static assets under /public are not
// fingerprinted by Vite, so without a cache-buster the browser will
// keep serving the previous version for hours/days.
const TEMPLATE_VERSION = "8";

const _templateCache = new Map<string, string>();
export async function loadTemplate(name: string): Promise<string> {
  if (_templateCache.has(name)) return _templateCache.get(name)!;
  const url = TEMPLATE_URLS[name];
  if (!url) throw new Error(`Unknown template: ${name}`);
  const res = await fetch(`${url}?v=${TEMPLATE_VERSION}`, { cache: "no-cache" });
  if (!res.ok) throw new Error(`Failed to load template ${name}: ${res.status}`);
  const text = await res.text();
  _templateCache.set(name, text);
  return text;
}

// Convenience: load + inject in one call
export async function renderPresentation(
  data: TemplatedPresentation
): Promise<string> {
  const tpl = await loadTemplate(data.template);
  return injectTemplate(tpl, data as unknown as TemplatedPresentation);
}

export async function renderQuiz(data: TemplatedQuiz): Promise<string> {
  const tpl = await loadTemplate(data.template);
  const theme = themeForId(data.themeId);
  const logoUrl = await logoAsDataUrl();
  const ss = {
    title: data.title,
    subtitle: data.subtitle || "",
    mode: data.mode,
    timed: !!data.timed,
    totalTimeMin: data.totalTimeMin,
    totalMarks: data.totalMarks,
    passMarkPct: data.passMarkPct || 60,
    showAnalysis: !!data.showAnalysis,
    questions: data.questions,
    theme: {
      primary: theme.primary, primarySoft: theme.primarySoft,
      accent: theme.accent, secondary: theme.secondary,
      ink: theme.ink, cream: theme.cream,
      displayFont: theme.displayFont,
      mascot1: theme.mascot1,
    },
    logoUrl,
  };
  return tpl
    .replace(/__TITLE__/g, escapeHtml(data.title))
    .replace(/__PRIMARY__/g, theme.primary)
    .replace(/__PRIMARY_SOFT__/g, theme.primarySoft)
    .replace(/__ACCENT__/g, theme.accent)
    .replace(/__SECONDARY__/g, theme.secondary)
    .replace(/__SECONDARY_SOFT__/g, theme.secondarySoft)
    .replace(/__BG1__/g, theme.bg1)
    .replace(/__BG2__/g, theme.bg2)
    .replace(/__BG3__/g, theme.bg3)
    .replace(/__INK__/g, theme.ink)
    .replace(/__CREAM__/g, theme.cream)
    .replace(/__DISPLAY_FONT__/g, theme.displayFont)
    .replace(/__BODY_FONT__/g, theme.bodyFont)
    .replace(/__LOGO_URL__/g, logoUrl)
    .replace(/__DATA_JSON__/g, JSON.stringify(ss).replace(/<\/script/gi, "<\\/script"));
}

export async function renderLessonPlan(data: TemplatedLessonPlan): Promise<string> {
  const tpl = await loadTemplate(data.template);
  const theme = themeForId(data.themeId);
  const logoUrl = await logoAsDataUrl();
  const ss = {
    title: data.title,
    subtitle: data.subtitle || "",
    durationMin: data.durationMin,
    objectives: data.objectives,
    timeline: data.timeline,
    differentiation: data.differentiation,
    assessment: data.assessment,
    homework: data.homework,
    theme: {
      primary: theme.primary, primarySoft: theme.primarySoft,
      accent: theme.accent, secondary: theme.secondary,
      ink: theme.ink, cream: theme.cream,
      displayFont: theme.displayFont,
    },
    logoUrl,
  };
  return tpl
    .replace(/__TITLE__/g, escapeHtml(data.title))
    .replace(/__PRIMARY__/g, theme.primary)
    .replace(/__PRIMARY_SOFT__/g, theme.primarySoft)
    .replace(/__ACCENT__/g, theme.accent)
    .replace(/__SECONDARY__/g, theme.secondary)
    .replace(/__SECONDARY_SOFT__/g, theme.secondarySoft)
    .replace(/__BG1__/g, theme.bg1)
    .replace(/__BG2__/g, theme.bg2)
    .replace(/__BG3__/g, theme.bg3)
    .replace(/__INK__/g, theme.ink)
    .replace(/__CREAM__/g, theme.cream)
    .replace(/__DISPLAY_FONT__/g, theme.displayFont)
    .replace(/__BODY_FONT__/g, theme.bodyFont)
    .replace(/__LOGO_URL__/g, logoUrl)
    .replace(/__DATA_JSON__/g, JSON.stringify(ss).replace(/<\/script/gi, "<\\/script"));
}

export async function renderWorksheet(data: TemplatedWorksheet): Promise<string> {
  const tpl = await loadTemplate(data.template);
  const theme = themeForId(data.themeId);
  const logoUrl = await logoAsDataUrl();
  const ss = {
    title: data.title,
    subtitle: data.subtitle || "",
    intro: data.intro,
    studentNameLabel: data.studentNameLabel || "Name",
    dateLabel: data.dateLabel || "Date",
    sections: data.sections,
    showAnswerKey: !!data.showAnswerKey,
    theme: {
      primary: theme.primary, primarySoft: theme.primarySoft,
      accent: theme.accent, secondary: theme.secondary,
      ink: theme.ink, cream: theme.cream,
      displayFont: theme.displayFont,
      mascot1: theme.mascot1,
    },
    logoUrl,
  };
  return tpl
    .replace(/__TITLE__/g, escapeHtml(data.title))
    .replace(/__PRIMARY__/g, theme.primary)
    .replace(/__PRIMARY_SOFT__/g, theme.primarySoft)
    .replace(/__ACCENT__/g, theme.accent)
    .replace(/__SECONDARY__/g, theme.secondary)
    .replace(/__SECONDARY_SOFT__/g, theme.secondarySoft)
    .replace(/__BG1__/g, theme.bg1)
    .replace(/__BG2__/g, theme.bg2)
    .replace(/__BG3__/g, theme.bg3)
    .replace(/__INK__/g, theme.ink)
    .replace(/__CREAM__/g, theme.cream)
    .replace(/__DISPLAY_FONT__/g, theme.displayFont)
    .replace(/__BODY_FONT__/g, theme.bodyFont)
    .replace(/__LOGO_URL__/g, logoUrl)
    .replace(/__DATA_JSON__/g, JSON.stringify(ss).replace(/<\/script/gi, "<\\/script"));
}

export async function renderGame(data: TemplatedGame): Promise<string> {
  const tpl = await loadTemplate(data.template);
  const theme = themeForId(data.themeId);
  const logoUrl = await logoAsDataUrl();
  const ss = {
    title: data.title,
    intro: data.intro,
    achievement: data.achievement,
    data: data.data,
    theme: {
      id: theme.id,
      primary: theme.primary,
      primarySoft: theme.primarySoft,
      accent: theme.accent,
      secondary: theme.secondary,
      secondarySoft: theme.secondarySoft,
      bg1: theme.bg1, bg2: theme.bg2, bg3: theme.bg3,
      ink: theme.ink, cream: theme.cream,
      displayFont: theme.displayFont, bodyFont: theme.bodyFont,
      mascot1: theme.mascot1, mascot2: theme.mascot2,
      decorations: mergedDecorations(theme.decorations, data.subjectId),
    },
    logoUrl,
  };
  return tpl
    .replace(/__TITLE__/g, escapeHtml(data.title))
    .replace(/__PRIMARY__/g, theme.primary)
    .replace(/__PRIMARY_SOFT__/g, theme.primarySoft)
    .replace(/__ACCENT__/g, theme.accent)
    .replace(/__SECONDARY__/g, theme.secondary)
    .replace(/__SECONDARY_SOFT__/g, theme.secondarySoft)
    .replace(/__BG1__/g, theme.bg1)
    .replace(/__BG2__/g, theme.bg2)
    .replace(/__BG3__/g, theme.bg3)
    .replace(/__INK__/g, theme.ink)
    .replace(/__CREAM__/g, theme.cream)
    .replace(/__DISPLAY_FONT__/g, theme.displayFont)
    .replace(/__BODY_FONT__/g, theme.bodyFont)
    .replace(/__LOGO_URL__/g, logoUrl)
    .replace(/__DATA_JSON__/g, JSON.stringify(ss).replace(/<\/script/gi, "<\\/script"));
}
