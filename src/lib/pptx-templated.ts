import PptxGenJS from "pptxgenjs";
import type { TemplatedPresentation, AnySlide } from "./template-types";
import { themeForId } from "./themes";

// Translate hex from theme → pptxgenjs hex (no '#')
const hex = (c: string) => (c || "").replace("#", "").toUpperCase();

export async function buildPptxFromTemplated(data: TemplatedPresentation): Promise<void> {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 inches
  pptx.author = "Super Sheldon";
  pptx.company = "Super Sheldon";
  pptx.title = data.title;

  const theme = themeForId(data.themeId);
  const C = {
    primary: hex(theme.primary),
    accent: hex(theme.accent),
    secondary: hex(theme.secondary),
    bg: hex(theme.bg2),
    ink: hex(theme.ink === "#FFFFFF" ? "#0F1115" : theme.ink), // pptx slides always use dark text
    inkSoft: "5B6271",
    cream: hex(theme.cream),
    white: "FFFFFF",
  };

  // Fetch logo as base64 (one-shot, reused)
  let logoData = "";
  try {
    const res = await fetch("/logo.webp");
    const blob = await res.blob();
    logoData = await new Promise<string>((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(typeof r.result === "string" ? r.result : "");
      r.readAsDataURL(blob);
    });
  } catch {
    // skip logo
  }

  for (const slide of data.slides as AnySlide[]) {
    const s = pptx.addSlide();
    s.background = { color: hex(theme.bg1) };

    // ── Branding chip (top-left) ─────────────────────────────
    if (logoData) {
      s.addImage({ data: logoData, x: 0.4, y: 0.3, w: 0.5, h: 0.5 });
    }
    s.addText("Super Sheldon", {
      x: 1.0, y: 0.32, w: 2.4, h: 0.4,
      fontSize: 11, bold: true, color: C.ink, fontFace: "Calibri", charSpacing: 2,
    });

    // ── Section badge ────────────────────────────────────────
    if (slide.section) {
      s.addShape("roundRect", {
        x: 4.5, y: 0.32, w: 4.3, h: 0.4,
        fill: { color: C.ink }, line: { color: C.ink },
        rectRadius: 0.2,
      });
      s.addText(slide.section.toUpperCase(), {
        x: 4.5, y: 0.32, w: 4.3, h: 0.4,
        fontSize: 11, bold: true, color: C.white, fontFace: "Calibri",
        align: "center", valign: "middle", charSpacing: 2,
      });
    }

    renderSlide(pptx, s, slide, C);

    if (slide.notes) s.addNotes(slide.notes);
  }

  await pptx.writeFile({ fileName: `${data.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${Date.now()}.pptx` });
}

// ── Per-slide-type rendering ──────────────────────────────────
function renderSlide(_pptx: PptxGenJS, s: PptxGenJS.Slide, slide: AnySlide, C: any) {
  switch (slide.type) {
    case "title":
      s.addText(slide.title, {
        x: 0.6, y: 1.6, w: 12, h: 2.8,
        fontSize: 60, bold: true, color: C.ink, align: "center",
        valign: "middle", fontFace: "Calibri",
      });
      if (slide.subtitle) {
        s.addText(slide.subtitle, {
          x: 0.6, y: 4.6, w: 12, h: 0.8,
          fontSize: 22, color: C.inkSoft, align: "center", fontFace: "Calibri",
        });
      }
      if (slide.mascot1Says || slide.mascot2Says) {
        const say1 = (slide as any).mascot1Says;
        const say2 = (slide as any).mascot2Says;
        if (say1) drawBubble(s, 1.0, 5.6, 5.5, 1.2, say1, C);
        if (say2) drawBubble(s, 6.8, 5.6, 5.5, 1.2, say2, C);
      }
      break;

    case "section":
      s.addText(slide.title, {
        x: 0.6, y: 2.2, w: 12, h: 2,
        fontSize: 52, bold: true, color: C.ink, align: "center",
        valign: "middle", fontFace: "Calibri",
      });
      if (slide.body) {
        s.addText(slide.body, {
          x: 0.6, y: 4.4, w: 12, h: 1.5,
          fontSize: 22, color: C.inkSoft, align: "center", fontFace: "Calibri",
        });
      }
      break;

    case "body":
      if (slide.title) {
        s.addText(slide.title, {
          x: 0.6, y: 1.0, w: 12, h: 1,
          fontSize: 36, bold: true, color: C.primary, fontFace: "Calibri", align: "center",
        });
      }
      drawBigCard(s, 1.0, 2.3, 11.3, 4.2, C);
      if (slide.icon) {
        s.addText(slide.icon, { x: 1.0, y: 2.4, w: 11.3, h: 0.8, fontSize: 36, align: "center" });
      }
      s.addText(slide.body, {
        x: 1.4, y: 3.4, w: 10.5, h: 2.9,
        fontSize: 20, color: C.ink, align: "center", valign: "middle", fontFace: "Calibri",
      });
      break;

    case "objectives":
      if (slide.title) {
        s.addText(slide.title, {
          x: 0.6, y: 1.0, w: 12, h: 1,
          fontSize: 38, bold: true, color: C.ink, fontFace: "Calibri", align: "center",
        });
      }
      drawBulletList(s, (slide.items || []).map(it => ({ icon: it.icon, text: it.text })), 2.2, 2.3, C);
      break;

    case "definition":
      if (slide.title) {
        s.addText(slide.title, {
          x: 0.6, y: 1.0, w: 12, h: 1,
          fontSize: 36, bold: true, color: C.primary, fontFace: "Calibri", align: "center",
        });
      }
      drawBigCard(s, 1.0, 2.2, 11.3, 4.5, C);
      s.addText(slide.term, {
        x: 1.4, y: 2.5, w: 10.5, h: 1,
        fontSize: 40, bold: true, color: C.primary, fontFace: "Calibri", align: "center",
      });
      if (slide.formula) {
        s.addShape("roundRect", {
          x: 4.0, y: 3.7, w: 5.3, h: 0.55,
          fill: { color: C.cream }, line: { color: C.ink, width: 2 }, rectRadius: 0.1,
        });
        s.addText(slide.formula, {
          x: 4.0, y: 3.7, w: 5.3, h: 0.55,
          fontSize: 16, bold: true, color: C.ink, align: "center", valign: "middle", fontFace: "Calibri",
        });
      }
      s.addText(slide.meaning, {
        x: 1.4, y: 4.5, w: 10.5, h: 1.4,
        fontSize: 20, color: C.ink, fontFace: "Calibri", align: "center",
      });
      if (slide.example) {
        s.addText(`Example: ${slide.example}`, {
          x: 1.4, y: 5.9, w: 10.5, h: 0.6,
          fontSize: 16, italic: true, color: C.inkSoft, align: "center", fontFace: "Calibri",
        });
      }
      break;

    case "compare": {
      if (slide.title) {
        s.addText(slide.title, {
          x: 0.6, y: 1.0, w: 12, h: 1,
          fontSize: 36, bold: true, color: C.ink, fontFace: "Calibri", align: "center",
        });
      }
      const cols = [slide.left, slide.right];
      const xs = [0.7, 6.85];
      const toneColors = [C.primary, C.secondary];
      cols.forEach((col, i) => {
        if (!col) return;
        s.addShape("roundRect", {
          x: xs[i], y: 2.3, w: 5.6, h: 4.6,
          fill: { color: C.white }, line: { color: toneColors[i], width: 3 }, rectRadius: 0.2,
        });
        s.addText(col.title, {
          x: xs[i] + 0.3, y: 2.5, w: 5.0, h: 0.7,
          fontSize: 26, bold: true, color: toneColors[i], align: "center", fontFace: "Calibri",
        });
        if (col.formula) {
          s.addText(col.formula, {
            x: xs[i] + 0.3, y: 3.2, w: 5.0, h: 0.5,
            fontSize: 14, bold: true, color: C.ink, align: "center", fontFace: "Calibri",
          });
        }
        if (col.example) {
          s.addText(col.example, {
            x: xs[i] + 0.3, y: 3.7, w: 5.0, h: 0.6,
            fontSize: 14, italic: true, color: C.inkSoft, align: "center", fontFace: "Calibri",
          });
        }
        if (col.points?.length) {
          const items = col.points.map(p => ({
            text: p,
            options: { fontSize: 14, color: C.ink, bullet: { code: "25CF" } },
          }));
          s.addText(items, {
            x: xs[i] + 0.4, y: 4.35, w: 5.0, h: 2.4,
            fontFace: "Calibri", paraSpaceAfter: 6,
          });
        }
      });
      break;
    }

    case "examples": {
      if (slide.title) {
        s.addText(slide.title, {
          x: 0.6, y: 1.0, w: 12, h: 0.9,
          fontSize: 36, bold: true, color: C.ink, fontFace: "Calibri", align: "center",
        });
      }
      if (slide.body) {
        s.addText(slide.body, {
          x: 0.6, y: 1.9, w: 12, h: 0.5,
          fontSize: 16, color: C.inkSoft, align: "center", fontFace: "Calibri",
        });
      }
      (slide.items || []).slice(0, 6).forEach((it, i) => {
        const col = i % 2, row = Math.floor(i / 2);
        const x = 1.0 + col * 5.85, y = 2.6 + row * 1.4;
        s.addShape("roundRect", {
          x, y, w: 5.6, h: 1.2,
          fill: { color: C.white }, line: { color: C.ink, width: 2 }, rectRadius: 0.15,
        });
        s.addText(it.icon || "★", {
          x: x + 0.1, y, w: 0.9, h: 1.2,
          fontSize: 32, align: "center", valign: "middle",
        });
        s.addText(it.text, {
          x: x + 1.0, y, w: 4.5, h: 1.2,
          fontSize: 15, color: C.ink, valign: "middle", fontFace: "Calibri",
        });
      });
      break;
    }

    case "fact":
      s.addShape("roundRect", {
        x: 1.2, y: 1.8, w: 10.9, h: 4.6,
        fill: { color: hex("#FFD43B") }, line: { color: C.ink, width: 3 }, rectRadius: 0.25,
      });
      s.addShape("roundRect", {
        x: 5.0, y: 1.55, w: 3.3, h: 0.4,
        fill: { color: C.ink }, line: { color: C.ink },
        rectRadius: 0.2,
      });
      s.addText("DID YOU KNOW?", {
        x: 5.0, y: 1.55, w: 3.3, h: 0.4,
        fontSize: 11, bold: true, color: C.white, align: "center", valign: "middle", fontFace: "Calibri", charSpacing: 2,
      });
      s.addText(slide.body, {
        x: 2.0, y: 2.5, w: 9.3, h: 1.5,
        fontSize: 22, bold: true, color: C.ink, align: "center", valign: "middle", fontFace: "Calibri",
      });
      if (slide.quote) {
        s.addShape("roundRect", {
          x: 2.0, y: 4.1, w: 9.3, h: 1.8,
          fill: { color: C.white }, line: { color: C.ink, width: 2 }, rectRadius: 0.15,
        });
        s.addText(`"${slide.quote}"`, {
          x: 2.3, y: 4.2, w: 8.7, h: 1.1,
          fontSize: 16, italic: true, color: C.ink, fontFace: "Calibri",
        });
        if (slide.source) {
          s.addText(`— ${slide.source}`, {
            x: 2.3, y: 5.3, w: 8.7, h: 0.5,
            fontSize: 12, bold: true, color: C.primary, fontFace: "Calibri",
          });
        }
      }
      break;

    case "mnemonic":
      s.addShape("roundRect", {
        x: 1.5, y: 1.9, w: 10.3, h: 4.4,
        fill: { color: C.accent }, line: { color: C.ink, width: 3 }, rectRadius: 0.3,
      });
      if (slide.title) {
        s.addText(slide.title, {
          x: 1.5, y: 2.2, w: 10.3, h: 1.0,
          fontSize: 36, bold: true, color: C.ink, align: "center", fontFace: "Calibri",
        });
      }
      s.addText(slide.body, {
        x: 2.0, y: 3.4, w: 9.3, h: 2.5,
        fontSize: 22, bold: true, color: C.ink, align: "center", valign: "middle", fontFace: "Calibri",
      });
      break;

    case "i-do": {
      if (slide.title) {
        s.addText(slide.title, {
          x: 0.6, y: 1.0, w: 12, h: 0.9,
          fontSize: 32, bold: true, color: C.ink, fontFace: "Calibri", align: "center",
        });
      }
      drawBigCard(s, 1.0, 2.0, 11.3, 5.0, C);
      s.addShape("roundRect", {
        x: 1.4, y: 2.3, w: 10.5, h: 0.9,
        fill: { color: C.cream }, line: { color: C.ink, width: 2 }, rectRadius: 0.15,
      });
      s.addText(slide.sentence, {
        x: 1.4, y: 2.3, w: 10.5, h: 0.9,
        fontSize: 20, bold: true, color: C.ink, align: "center", valign: "middle", fontFace: "Calibri",
      });
      const steps = slide.thinking.map((t, i) => ({
        text: `Step ${i + 1}: ${t}`,
        options: { fontSize: 16, color: C.ink },
      }));
      s.addText(steps, {
        x: 1.6, y: 3.4, w: 10.1, h: 2.6,
        fontFace: "Calibri", paraSpaceAfter: 8,
      });
      s.addText(slide.conclusion, {
        x: 1.4, y: 6.2, w: 10.5, h: 0.7,
        fontSize: 20, bold: true, color: C.secondary, align: "center", fontFace: "Calibri",
      });
      break;
    }

    case "quiz": {
      if (slide.title) {
        s.addText(slide.title, {
          x: 0.6, y: 1.0, w: 12, h: 0.9,
          fontSize: 32, bold: true, color: C.ink, fontFace: "Calibri", align: "center",
        });
      }
      drawBigCard(s, 1.0, 2.0, 11.3, 5.0, C);
      if (slide.label) {
        s.addShape("roundRect", {
          x: 5.5, y: 2.15, w: 2.3, h: 0.4,
          fill: { color: C.secondary }, line: { color: C.secondary }, rectRadius: 0.2,
        });
        s.addText(slide.label.toUpperCase(), {
          x: 5.5, y: 2.15, w: 2.3, h: 0.4,
          fontSize: 11, bold: true, color: C.white, align: "center", valign: "middle", fontFace: "Calibri", charSpacing: 2,
        });
      }
      s.addText(slide.question, {
        x: 1.4, y: 2.7, w: 10.5, h: 1.2,
        fontSize: 22, bold: true, color: C.ink, align: "center", valign: "middle", fontFace: "Calibri",
      });
      const opts = slide.options || [];
      const cols = 2;
      const rowH = 0.85;
      opts.forEach((opt, i) => {
        const col = i % cols, row = Math.floor(i / cols);
        const x = 1.5 + col * 5.2, y = 4.1 + row * (rowH + 0.2);
        const isCorrect = i === slide.correctIndex;
        s.addShape("roundRect", {
          x, y, w: 4.9, h: rowH,
          fill: { color: isCorrect ? hex("#D6F2E0") : C.white },
          line: { color: C.ink, width: 2 }, rectRadius: 0.12,
        });
        s.addText(`${String.fromCharCode(65 + i)}. ${opt}`, {
          x: x + 0.2, y, w: 4.6, h: rowH,
          fontSize: 14, bold: isCorrect, color: C.ink, valign: "middle", fontFace: "Calibri",
        });
      });
      if (slide.explanation) {
        s.addText(`✓ ${slide.explanation}`, {
          x: 1.4, y: 6.4, w: 10.5, h: 0.6,
          fontSize: 13, italic: true, color: C.inkSoft, align: "center", fontFace: "Calibri",
        });
      }
      break;
    }

    case "fill-blank":
      if (slide.title) {
        s.addText(slide.title, {
          x: 0.6, y: 1.0, w: 12, h: 0.9,
          fontSize: 32, bold: true, color: C.ink, fontFace: "Calibri", align: "center",
        });
      }
      drawBigCard(s, 1.0, 2.2, 11.3, 4.5, C);
      s.addText(`${slide.before}  ____  ${slide.after}`, {
        x: 1.4, y: 2.8, w: 10.5, h: 1.6,
        fontSize: 22, color: C.ink, align: "center", valign: "middle", fontFace: "Calibri",
      });
      s.addText(`Answer: ${slide.options[slide.correctIndex] || ""}`, {
        x: 1.4, y: 4.8, w: 10.5, h: 0.7,
        fontSize: 18, bold: true, color: C.primary, align: "center", fontFace: "Calibri",
      });
      if (slide.explanation) {
        s.addText(slide.explanation, {
          x: 1.4, y: 5.6, w: 10.5, h: 0.7,
          fontSize: 14, italic: true, color: C.inkSoft, align: "center", fontFace: "Calibri",
        });
      }
      break;

    case "drag-sort":
      if (slide.title) {
        s.addText(slide.title, {
          x: 0.6, y: 1.0, w: 12, h: 0.9,
          fontSize: 32, bold: true, color: C.ink, fontFace: "Calibri", align: "center",
        });
      }
      [slide.zones[0], slide.zones[1]].forEach((z, i) => {
        const x = i === 0 ? 0.7 : 6.85;
        const items = (slide.items || []).filter(it => it.type === z.accept).map(it => ({
          text: it.text,
          options: { fontSize: 14, color: C.ink, bullet: { code: "25CF" } },
        }));
        s.addShape("roundRect", {
          x, y: 2.2, w: 5.6, h: 4.7,
          fill: { color: i === 0 ? "F0FFF5" : "FFF5F5" },
          line: { color: i === 0 ? C.primary : C.secondary, width: 3, dashType: "dash" },
          rectRadius: 0.2,
        });
        s.addText(z.label, {
          x: x + 0.3, y: 2.4, w: 5.0, h: 0.6,
          fontSize: 18, bold: true, color: i === 0 ? C.primary : C.secondary, align: "center", fontFace: "Calibri",
        });
        if (items.length) {
          s.addText(items, {
            x: x + 0.5, y: 3.1, w: 4.8, h: 3.6,
            fontFace: "Calibri", paraSpaceAfter: 6,
          });
        }
      });
      break;

    case "story":
      if (slide.title) {
        s.addText(slide.title, {
          x: 0.6, y: 1.0, w: 12, h: 0.9,
          fontSize: 32, bold: true, color: C.ink, fontFace: "Calibri", align: "center",
        });
      }
      drawBigCard(s, 1.0, 2.0, 11.3, 5.0, C);
      {
        const runs = (slide.parts || []).map(p => {
          if (p.tag === "a") return { text: p.text, options: { color: C.primary, bold: true } };
          if (p.tag === "b") return { text: p.text, options: { color: C.secondary, bold: true } };
          return { text: p.text, options: { color: C.ink } };
        });
        s.addText(runs, {
          x: 1.4, y: 2.5, w: 10.5, h: 4.0,
          fontSize: 18, fontFace: "Calibri",
        });
      }
      if (slide.legend) {
        s.addText(slide.legend, {
          x: 1.4, y: 6.6, w: 10.5, h: 0.5,
          fontSize: 12, italic: true, color: C.inkSoft, align: "center", fontFace: "Calibri",
        });
      }
      break;

    case "takeaway":
      if (slide.title) {
        s.addText(slide.title, {
          x: 0.6, y: 1.0, w: 12, h: 0.9,
          fontSize: 38, bold: true, color: C.ink, fontFace: "Calibri", align: "center",
        });
      }
      drawBulletList(s, slide.points, 2.2, 2.2, C);
      break;

    case "hots":
      if (slide.title) {
        s.addText(slide.title, {
          x: 0.6, y: 1.0, w: 12, h: 0.9,
          fontSize: 36, bold: true, color: C.ink, fontFace: "Calibri", align: "center",
        });
      }
      drawBigCard(s, 1.5, 2.4, 10.3, 4.0, C);
      s.addText(slide.question, {
        x: 1.9, y: 2.8, w: 9.5, h: 3.2,
        fontSize: 22, color: C.ink, align: "center", valign: "middle", fontFace: "Calibri",
      });
      if ((slide as any).mascotSays) {
        drawBubble(s, 1.5, 6.7, 10.3, 0.8, (slide as any).mascotSays, C);
      }
      break;

    case "closure":
      s.addText(slide.title || "AMAZING!", {
        x: 0.6, y: 1.4, w: 12, h: 2,
        fontSize: 72, bold: true, color: C.ink, align: "center", valign: "middle", fontFace: "Calibri",
      });
      s.addText("★ ".repeat(Math.min(5, Math.max(1, Number(slide.stars) || 3))), {
        x: 0.6, y: 3.5, w: 12, h: 1,
        fontSize: 48, color: C.accent, align: "center", fontFace: "Calibri",
      });
      if (slide.body) {
        s.addText(slide.body, {
          x: 0.6, y: 4.7, w: 12, h: 1,
          fontSize: 22, color: C.ink, align: "center", fontFace: "Calibri",
        });
      }
      if (slide.mascot1Says) drawBubble(s, 1.5, 5.9, 5.0, 1.2, slide.mascot1Says, C);
      if (slide.mascot2Says) drawBubble(s, 6.8, 5.9, 5.0, 1.2, slide.mascot2Says, C);
      break;
  }
}

// ── Helpers ────────────────────────────────────────────────────
function drawBigCard(s: PptxGenJS.Slide, x: number, y: number, w: number, h: number, C: any) {
  s.addShape("roundRect", {
    x, y, w, h,
    fill: { color: C.white },
    line: { color: C.ink, width: 3 },
    rectRadius: 0.22,
  });
}

function drawBubble(s: PptxGenJS.Slide, x: number, y: number, w: number, h: number, text: string, C: any) {
  s.addShape("roundRect", {
    x, y, w, h,
    fill: { color: C.white },
    line: { color: C.ink, width: 2 },
    rectRadius: 0.18,
  });
  s.addText(text, {
    x: x + 0.3, y, w: w - 0.6, h,
    fontSize: 14, color: C.ink, valign: "middle", fontFace: "Calibri",
  });
}

function drawBulletList(s: PptxGenJS.Slide, items: { icon?: string; text: string }[], x: number, y: number, C: any) {
  const list = (items || []).map(it => ({
    text: it.text,
    options: { fontSize: 18, color: C.ink, bullet: { code: "25CF" } },
  }));
  s.addText(list, {
    x, y, w: 9, h: 4.5,
    fontFace: "Calibri", paraSpaceAfter: 10,
  });
}
