export type ModelChoice = {
  id: string;          // "claude" | "hf:<huggingface-id>"
  label: string;       // shown in UI
  hint: string;        // small description
  provider: "claude" | "hf";
};

export const MODEL_CHOICES: ModelChoice[] = [
  { id: "claude",                                              label: "Claude",     hint: "Primary · best quality",  provider: "claude" },
  { id: "hf:Qwen/Qwen2.5-7B-Instruct",                         label: "Qwen 2.5",   hint: "Fast · STEM friendly",    provider: "hf" },
  { id: "hf:meta-llama/Meta-Llama-3.1-8B-Instruct",            label: "Llama 3.1",  hint: "Balanced · 8B",            provider: "hf" },
  { id: "hf:mistralai/Mixtral-8x7B-Instruct-v0.1",             label: "Mixtral",    hint: "Strongest open · 8x7B",   provider: "hf" },
];

export const DEFAULT_MODEL_ID = "claude";

/**
 * Per-tool allowed models. Claude is always first (recommended).
 * We hide weak models for tools where they consistently underperform —
 * e.g., Qwen on long lesson plans, Llama on 24-slide presentations.
 */
export const TOOL_MODELS: Record<string, string[]> = {
  diagnostic:   ["claude", "hf:mistralai/Mixtral-8x7B-Instruct-v0.1", "hf:Qwen/Qwen2.5-7B-Instruct"],
  assessment:   ["claude", "hf:mistralai/Mixtral-8x7B-Instruct-v0.1", "hf:meta-llama/Meta-Llama-3.1-8B-Instruct"],
  worksheet:    ["claude", "hf:mistralai/Mixtral-8x7B-Instruct-v0.1", "hf:meta-llama/Meta-Llama-3.1-8B-Instruct"],
  lessonplan:   ["claude", "hf:mistralai/Mixtral-8x7B-Instruct-v0.1"],
  presentation: ["claude", "hf:mistralai/Mixtral-8x7B-Instruct-v0.1"],
  games:        ["claude", "hf:mistralai/Mixtral-8x7B-Instruct-v0.1"],
};

export const modelsForTool = (tool?: string | null): ModelChoice[] => {
  if (!tool) return MODEL_CHOICES;
  const allowed = TOOL_MODELS[tool];
  if (!allowed) return MODEL_CHOICES;
  return allowed
    .map((id) => MODEL_CHOICES.find((m) => m.id === id))
    .filter((m): m is ModelChoice => !!m);
};

/** Convert a UI selection into the webhook payload fields */
export const modelToPayload = (id: string): { model?: string; hfModel?: string } => {
  if (!id || id === "claude") return {}; // let n8n use its per-tool default
  if (id.startsWith("hf:")) {
    return {
      model: "force-fallback-trigger",   // any non-existent Claude id forces HF branch
      hfModel: id.slice(3),
    };
  }
  return { model: id };
};
