// ─── Frontend content correctness checker ────────────────────────
// Runs on every templated payload after it arrives. Catches malformed
// or thin content that slipped past the n8n Parse validators and
// surfaces a clear list of issues so the teacher knows whether to
// re-generate.

export type ValidationIssue = {
  severity: "error" | "warning";
  message: string;
};

export type ValidationResult = {
  ok: boolean;
  errors: string[];
  warnings: string[];
};

function check(cond: boolean, msg: string, bucket: ValidationIssue[], severity: ValidationIssue["severity"] = "error") {
  if (!cond) bucket.push({ severity, message: msg });
}

export function validateTemplated(payload: any): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (!payload || typeof payload !== "object") {
    return { ok: false, errors: ["Empty payload"], warnings: [] };
  }
  if (payload.format !== "template-v1") {
    // Not a templated payload — skip (legacy renderers handle their own validation)
    return { ok: true, errors: [], warnings: [] };
  }

  const t = payload.template;

  if (t === "presentation-classic" || t === "presentation-academic") {
    check(Array.isArray(payload.slides), "Missing slides", issues);
    if (Array.isArray(payload.slides)) {
      check(payload.slides.length >= 8, `Only ${payload.slides.length} slides — expected at least 8`, issues);
      let missingNotes = 0;
      for (const s of payload.slides) {
        if (!s || !s.type) { issues.push({ severity: "error", message: "Slide missing type" }); continue; }
        if (!s.notes || String(s.notes).trim().length < 5) missingNotes++;
      }
      check(missingNotes < payload.slides.length / 3, `${missingNotes}/${payload.slides.length} slides missing teacher notes`, issues, "warning");
    }
  } else if (t === "quiz-live") {
    check(Array.isArray(payload.questions), "Missing questions", issues);
    if (Array.isArray(payload.questions)) {
      check(payload.questions.length >= 5, `Only ${payload.questions.length} questions — expected at least 5`, issues);
      for (let i = 0; i < payload.questions.length; i++) {
        const q = payload.questions[i];
        if (!q || !q.text) { issues.push({ severity: "error", message: `Q${i + 1} missing text` }); continue; }
        if (!Array.isArray(q.options) || q.options.length < 2) {
          issues.push({ severity: "error", message: `Q${i + 1} needs >= 2 options` }); continue;
        }
        if (typeof q.correctIndex !== "number" || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
          issues.push({ severity: "error", message: `Q${i + 1} correctIndex out of range` });
        }
      }
    }
  } else if (t === "game-arcade") {
    check(!!payload.data && !!payload.data.gameType, "Missing data.gameType", issues);
    check(!!payload.data && !!payload.data.payload, "Missing data.payload", issues);
  } else if (t === "worksheet-print") {
    check(Array.isArray(payload.sections) && payload.sections.length > 0, "No sections", issues);
    if (Array.isArray(payload.sections)) {
      for (const sec of payload.sections) {
        if (!sec.type || !Array.isArray(sec.items) || sec.items.length === 0) {
          issues.push({ severity: "warning", message: `Section "${sec.title || sec.type}" has no items` });
        }
      }
    }
  } else if (t === "lessonplan-timeline") {
    check(Array.isArray(payload.timeline) && payload.timeline.length >= 6, "Timeline needs >= 6 entries", issues);
    check(Array.isArray(payload.objectives) && payload.objectives.length > 0, "Missing objectives", issues, "warning");
    if (Array.isArray(payload.timeline)) {
      const totalMin = payload.timeline.reduce((sum: number, t: any) => sum + (Number(t.durationMin) || 0), 0);
      const target = Number(payload.durationMin) || 55;
      if (Math.abs(totalMin - target) > 5) {
        issues.push({ severity: "warning", message: `Timeline durations sum to ${totalMin}min, expected ~${target}min` });
      }
    }
  }

  return {
    ok: !issues.some((i) => i.severity === "error"),
    errors: issues.filter((i) => i.severity === "error").map((i) => i.message),
    warnings: issues.filter((i) => i.severity === "warning").map((i) => i.message),
  };
}
