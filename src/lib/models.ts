export type ModelChoice = {
  id: string;          // value sent to webhook (e.g. "claude-sonnet-4-5")
  label: string;       // shown in UI (e.g. "Sonnet 4.5")
  tier: "auto" | "premium" | "fast" | "open";
  hint: string;        // small description
};

// "" means "let n8n use its default for this generator"
export const MODEL_CHOICES: ModelChoice[] = [
  { id: "",                    label: "Auto",         tier: "auto",    hint: "Best fit per tool" },
  { id: "claude-sonnet-4-5",   label: "Sonnet 4.5",   tier: "premium", hint: "Best quality, slower" },
  { id: "claude-haiku-4-5",    label: "Haiku 4.5",    tier: "fast",    hint: "Fast, cheaper" },
  { id: "claude-opus-4-7",     label: "Opus 4.7",     tier: "premium", hint: "Premium reasoning" },
];

export const DEFAULT_MODEL_ID = "";
