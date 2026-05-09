import PptxGenJS from "pptxgenjs";
import type { Slide } from "./types";

// Super Sheldon palette (matches the on-screen renderer roughly)
const COLORS = {
  ink: "0F1115",
  inkLight: "5B6271",
  white: "FFFFFF",
  cream: "FFF1E6",
  lavender: "E5DEFF",
  peach: "FFE0CC",
  mint: "D6F2E0",
  rose: "FFE0E8",
  sky: "DCEEFF",
  yellow: "FFF4C2",
  orange: "FF6B1F",
  orangeDeep: "C24808",
  purple: "7C3AED",
  teal: "0EA5A4",
};

const TONE_FOR_TYPE: Record<string, string> = {
  title: COLORS.lavender,
  definition: COLORS.lavender,
  image_caption: COLORS.sky,
  compare: COLORS.mint,
  ido_wedo_youdo: COLORS.peach,
  quiz: COLORS.rose,
  drag_sort: COLORS.yellow,
  fill_blank: COLORS.cream,
  video: COLORS.sky,
  takeaway: COLORS.peach,
};

export async function buildPptx(slides: Slide[], filenameBase = "presentation"): Promise<void> {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 inches
  pptx.author = "Super Sheldon";
  pptx.company = "Super Sheldon";
  pptx.title = filenameBase;

  for (const slide of slides) {
    const s = pptx.addSlide();
    const tone = TONE_FOR_TYPE[slide.type] ?? COLORS.cream;
    s.background = { color: tone };

    // Branding watermark — top-left
    s.addText("Super Sheldon", {
      x: 0.4,
      y: 0.3,
      w: 2.4,
      h: 0.4,
      fontSize: 11,
      bold: true,
      color: COLORS.ink,
      fontFace: "Calibri",
      charSpacing: 2,
    });

    switch (slide.type) {
      case "title": {
        if (slide.title) {
          s.addText(slide.title, {
            x: 0.6, y: 1.6, w: 12, h: 3,
            fontSize: 60, bold: true, color: COLORS.ink,
            fontFace: "Calibri", valign: "middle",
          });
        }
        if (slide.body) {
          s.addText(slide.body, {
            x: 0.6, y: 4.8, w: 12, h: 1.5,
            fontSize: 22, color: COLORS.inkLight,
            fontFace: "Calibri",
          });
        }
        break;
      }
      case "definition": {
        if (slide.title) {
          s.addText(slide.title, {
            x: 0.6, y: 1.0, w: 12, h: 1,
            fontSize: 36, bold: true, color: COLORS.ink, fontFace: "Calibri",
          });
        }
        // Card with term + meaning
        s.addShape("roundRect", {
          x: 0.8, y: 2.2, w: 11.7, h: 4.5,
          fill: { color: COLORS.white },
          line: { color: COLORS.ink, width: 2 },
          rectRadius: 0.2,
        });
        if (slide.definition?.term) {
          s.addText(slide.definition.term, {
            x: 1.2, y: 2.6, w: 10.9, h: 1.2,
            fontSize: 40, bold: true, color: COLORS.orange, fontFace: "Calibri",
          });
        }
        if (slide.definition?.meaning) {
          s.addText(slide.definition.meaning, {
            x: 1.2, y: 4.0, w: 10.9, h: 2.6,
            fontSize: 20, color: COLORS.ink, fontFace: "Calibri",
          });
        }
        break;
      }
      case "image_caption": {
        if (slide.title) {
          s.addText(slide.title, {
            x: 0.6, y: 0.9, w: 12, h: 0.9,
            fontSize: 32, bold: true, color: COLORS.ink, fontFace: "Calibri",
          });
        }
        // Big emoji
        s.addText(slide.imageCaption?.emoji ?? "🌟", {
          x: 0.6, y: 1.9, w: 12, h: 3.5,
          fontSize: 220, align: "center", valign: "middle",
        });
        if (slide.imageCaption?.caption || slide.body) {
          s.addText(slide.imageCaption?.caption ?? slide.body ?? "", {
            x: 0.6, y: 5.6, w: 12, h: 1.3,
            fontSize: 22, align: "center", color: COLORS.ink, fontFace: "Calibri",
          });
        }
        break;
      }
      case "compare": {
        if (slide.title) {
          s.addText(slide.title, {
            x: 0.6, y: 0.9, w: 12, h: 0.9,
            fontSize: 32, bold: true, color: COLORS.ink, fontFace: "Calibri",
          });
        }
        const cols = [slide.compare?.left, slide.compare?.right];
        const xs = [0.8, 6.85];
        cols.forEach((col, i) => {
          if (!col) return;
          s.addShape("roundRect", {
            x: xs[i], y: 2.0, w: 5.6, h: 4.8,
            fill: { color: COLORS.white },
            line: { color: COLORS.ink, width: 2 },
            rectRadius: 0.2,
          });
          s.addText(col.title, {
            x: xs[i] + 0.3, y: 2.2, w: 5.0, h: 0.7,
            fontSize: 22, bold: true, color: COLORS.orange, fontFace: "Calibri",
          });
          const points = (col.points ?? []).map((p) => ({
            text: p,
            options: { fontSize: 16, color: COLORS.ink, bullet: { code: "25CF" } },
          }));
          if (points.length) {
            s.addText(points, {
              x: xs[i] + 0.4, y: 2.95, w: 5.0, h: 3.7,
              fontFace: "Calibri", paraSpaceAfter: 8,
            });
          }
        });
        break;
      }
      case "ido_wedo_youdo": {
        if (slide.title) {
          s.addText(slide.title, {
            x: 0.6, y: 0.9, w: 12, h: 0.9,
            fontSize: 32, bold: true, color: COLORS.ink, fontFace: "Calibri",
          });
        }
        const labels = ["I Do", "We Do", "You Do"] as const;
        const texts = [slide.iwy?.iDo, slide.iwy?.weDo, slide.iwy?.youDo];
        const xs = [0.5, 4.6, 8.7];
        labels.forEach((lbl, i) => {
          s.addShape("roundRect", {
            x: xs[i], y: 2.0, w: 4.0, h: 4.8,
            fill: { color: COLORS.white },
            line: { color: COLORS.ink, width: 2 },
            rectRadius: 0.2,
          });
          s.addText(lbl, {
            x: xs[i] + 0.3, y: 2.2, w: 3.4, h: 0.7,
            fontSize: 20, bold: true, color: COLORS.orange, fontFace: "Calibri",
          });
          if (texts[i]) {
            s.addText(texts[i] ?? "", {
              x: xs[i] + 0.3, y: 3.0, w: 3.4, h: 3.6,
              fontSize: 16, color: COLORS.ink, fontFace: "Calibri",
            });
          }
        });
        break;
      }
      case "quiz": {
        if (slide.title) {
          s.addText(slide.title, {
            x: 0.6, y: 0.9, w: 12, h: 0.8,
            fontSize: 28, bold: true, color: COLORS.ink, fontFace: "Calibri",
          });
        }
        if (slide.quiz?.question) {
          s.addText(slide.quiz.question, {
            x: 0.6, y: 1.8, w: 12, h: 1.4,
            fontSize: 22, bold: true, color: COLORS.ink, fontFace: "Calibri",
          });
        }
        const options = slide.quiz?.options ?? [];
        const correctIdx = slide.quiz?.correctIndex ?? -1;
        const cols = 2, rowH = 1.0;
        options.forEach((opt, i) => {
          const col = i % cols, row = Math.floor(i / cols);
          const x = 0.6 + col * 6.2, y = 3.4 + row * (rowH + 0.2);
          const isCorrect = i === correctIdx;
          s.addShape("roundRect", {
            x, y, w: 5.9, h: rowH,
            fill: { color: isCorrect ? COLORS.mint : COLORS.white },
            line: { color: COLORS.ink, width: 2 },
            rectRadius: 0.15,
          });
          s.addText(`${String.fromCharCode(65 + i)}. ${opt}`, {
            x: x + 0.25, y, w: 5.5, h: rowH,
            fontSize: 16, bold: isCorrect, color: COLORS.ink,
            valign: "middle", fontFace: "Calibri",
          });
        });
        if (slide.quiz?.explanation) {
          s.addText(`Answer: ${slide.quiz.explanation}`, {
            x: 0.6, y: 6.5, w: 12, h: 0.6,
            fontSize: 12, italic: true, color: COLORS.inkLight, fontFace: "Calibri",
          });
        }
        break;
      }
      case "fill_blank": {
        if (slide.title) {
          s.addText(slide.title, {
            x: 0.6, y: 0.9, w: 12, h: 0.9,
            fontSize: 32, bold: true, color: COLORS.ink, fontFace: "Calibri",
          });
        }
        if (slide.fillBlank?.sentence) {
          s.addText(slide.fillBlank.sentence, {
            x: 0.6, y: 2.6, w: 12, h: 2,
            fontSize: 28, color: COLORS.ink, align: "center",
            valign: "middle", fontFace: "Calibri",
          });
        }
        if (slide.fillBlank?.blanks?.length) {
          s.addText(`Answers: ${slide.fillBlank.blanks.join(", ")}`, {
            x: 0.6, y: 5.0, w: 12, h: 1,
            fontSize: 18, italic: true, color: COLORS.orange, align: "center", fontFace: "Calibri",
          });
        }
        break;
      }
      case "takeaway": {
        if (slide.title) {
          s.addText(slide.title, {
            x: 0.6, y: 0.9, w: 12, h: 0.9,
            fontSize: 36, bold: true, color: COLORS.ink, fontFace: "Calibri",
          });
        }
        const items = (slide.takeaway?.points ?? []).map((p) => ({
          text: p,
          options: { fontSize: 22, color: COLORS.ink, bullet: { code: "2B50" } },
        }));
        if (items.length) {
          s.addText(items, {
            x: 1.0, y: 2.2, w: 11.5, h: 4.5,
            fontFace: "Calibri", paraSpaceAfter: 16,
          });
        }
        break;
      }
      default: {
        // Generic fallback: show title + body
        if (slide.title) {
          s.addText(slide.title, {
            x: 0.6, y: 1.0, w: 12, h: 1,
            fontSize: 36, bold: true, color: COLORS.ink, fontFace: "Calibri",
          });
        }
        if (slide.body) {
          s.addText(slide.body, {
            x: 0.6, y: 2.2, w: 12, h: 4,
            fontSize: 20, color: COLORS.ink, fontFace: "Calibri",
          });
        }
      }
    }

    // Speaker notes
    if (slide.notes) {
      s.addNotes(slide.notes);
    }
  }

  await pptx.writeFile({ fileName: `${filenameBase}-${Date.now()}.pptx` });
}
