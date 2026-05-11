// ─── Instant client-side topic check ─────────────────────────────
// Runs synchronously, no network call. Catches the most obvious
// subject mismatches (e.g. "python" / "shakespeare" / "photosynthesis"
// for Maths) so the teacher gets feedback even if the Groq validator
// is offline or the n8n endpoint isn't deployed yet.
//
// This is a complement to validateTopic() — it covers the "wrong
// subject" case instantly; the Groq call adds the "wrong grade level"
// case (which needs an LLM to judge).

const KW = {
  math: [
    "math", "maths", "arithmetic", "addition", "subtract", "multiply", "divide",
    "fraction", "decimal", "percent", "algebra", "equation", "expression",
    "geometry", "shape", "angle", "triangle", "circle", "polygon", "area",
    "perimeter", "volume", "calculus", "differentiat", "integral", "trig",
    "sine", "cosine", "tangent", "vector", "matrix", "matrices",
    "probability", "statistic", "mean", "median", "mode", "ratio", "proportion",
    "number", "integer", "prime", "factor", "surd", "logarith", "exponent",
    "quadratic", "linear", "graph", "coordinate", "pythagor", "sequence", "series",
    "set", "function",
  ],
  science: [
    "science", "physics", "chemistry", "biology", "atom", "molecule", "element",
    "compound", "reaction", "acid", "base", "ph", "cell", "tissue", "organ",
    "plant", "animal", "ecosystem", "photosynthes", "respiration", "digestion",
    "evolution", "genetic", "dna", "chromosome", "force", "motion", "energy",
    "gravity", "magnet", "electric", "current", "voltage", "circuit", "light",
    "sound", "wave", "heat", "thermo", "planet", "solar", "universe", "galaxy",
    "weather", "climate", "rock", "mineral", "organism", "bacteria", "microb",
    "enzyme",
  ],
  english: [
    "english", "grammar", "spelling", "punctuation", "sentence", "paragraph",
    "essay", "letter", "story", "novel", "poem", "poetry", "play", "drama",
    "shakespeare", "literature", "comprehension", "reading", "writing", "vocabular",
    "noun", "verb", "adjective", "adverb", "pronoun", "preposition", "conjunction",
    "tense", "phrase", "clause", "metaphor", "simile", "personificat", "irony",
    "alliteration", "rhyme", "stanza", "character", "plot", "theme", "narrat",
  ],
  history: [
    "history", "war", "revolution", "empire", "civilisation", "civilization",
    "ancient", "medieval", "renaissance", "industrial", "king", "queen",
    "president", "prime minister", "republic", "dynasty", "colony", "colonial",
    "independence", "treaty", "battle", "rome", "greek", "egypt", "mesopotam",
    "tudors", "victorian", "nazi", "weimar", "cold war", "ww1", "ww2",
    "first world war", "second world war", "mughal", "freedom struggle",
  ],
  geography: [
    "geography", "continent", "ocean", "country", "capital", "map", "river",
    "mountain", "lake", "desert", "forest", "rainforest", "tropic", "equator",
    "climate", "weather", "population", "urban", "rural", "migration", "tectonic",
    "volcano", "earthquake", "glacier", "biome",
  ],
  art: [
    "art", "draw", "paint", "color", "colour", "sketch", "sculpt", "ceramic",
    "design", "perspective", "shade", "texture", "composition", "monet",
    "picasso", "renaissance art", "still life", "portrait", "landscape",
  ],
  music: [
    "music", "rhythm", "melody", "harmony", "note", "scale", "chord", "piano",
    "guitar", "violin", "drum", "song", "lyric", "composer", "mozart", "beethoven",
    "tempo", "pitch", "instrument", "orchestra", "symphony",
  ],
  computer: [
    "python", "javascript", "java", "code", "coding", "program", "algorithm",
    "data structure", "loop", "function", "variable", "array", "object",
    "html", "css", "react", "computer", "software", "hardware", "cpu",
    "binary", "boolean", "string", "compiler",
  ],
  language: [
    "french", "spanish", "german", "italian", "mandarin", "chinese", "hindi",
    "arabic", "japanese", "korean", "language", "vocabulary", "conjugation",
    "translation", "pronoun", "verb conjugation",
  ],
};

type SubjectKey = keyof typeof KW;

function normalize(s: string): string {
  return s.toLowerCase().trim();
}

function matchesAny(topic: string, keywords: string[]): boolean {
  const t = normalize(topic);
  return keywords.some((kw) => t.includes(kw));
}

function detectTopicCategories(topic: string): SubjectKey[] {
  const hits: SubjectKey[] = [];
  for (const k of Object.keys(KW) as SubjectKey[]) {
    if (matchesAny(topic, KW[k])) hits.push(k);
  }
  return hits;
}

function subjectToCategory(subject: string): SubjectKey | "general" {
  const s = normalize(subject);
  if (/math/.test(s)) return "math";
  if (/scien|physics|chem|bio/.test(s)) return "science";
  if (/english|literature|writing/.test(s)) return "english";
  if (/histor/.test(s)) return "history";
  if (/geograph/.test(s)) return "geography";
  if (/\bart\b|paint|draw/.test(s)) return "art";
  if (/music/.test(s)) return "music";
  if (/comput|coding|programm/.test(s)) return "computer";
  if (/french|spanish|german|hindi|mandarin|chinese|language/.test(s)) return "language";
  return "general";
}

export type HeuristicResult = {
  ok: boolean;
  reason?: string;
};

// Returns a verdict if the topic CLEARLY belongs to a different subject.
// Conservative — only fires when the topic strongly matches another
// subject AND doesn't match the chosen subject. False positives are
// worse than false negatives here.
export function quickTopicCheck(
  topic: string,
  subject: string
): HeuristicResult {
  if (!topic || topic.trim().length < 2) return { ok: true };

  const targetCat = subjectToCategory(subject);
  if (targetCat === "general") return { ok: true };

  const matches = detectTopicCategories(topic);
  if (matches.length === 0) return { ok: true }; // Couldn't classify — let the LLM judge.

  if (matches.includes(targetCat)) return { ok: true };

  // Topic clearly belongs to a different subject than the one chosen.
  const wrongCat = matches[0];
  const labels: Record<SubjectKey, string> = {
    math: "Maths",
    science: "Science",
    english: "English",
    history: "History",
    geography: "Geography",
    art: "Art",
    music: "Music",
    computer: "Computer Science",
    language: "a foreign language",
  };
  return {
    ok: false,
    reason: `"${topic}" looks like ${labels[wrongCat]} — but the student's subject is ${subject}. Either pick a ${subject} topic or change the student's subject in the Students page.`,
  };
}
