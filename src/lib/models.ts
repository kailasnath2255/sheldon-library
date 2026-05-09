export type ModelChoice = {
  id: string;          // "claude" | "hf:<huggingface-id>"
  label: string;       // shown in UI
  hint: string;        // small description
  provider: "claude" | "hf";
};

export const MODEL_CHOICES: ModelChoice[] = [
  { id: "claude",                                              label: "Claude",     hint: "Primary · best quality",      provider: "claude" },
  { id: "hf:meta-llama/Llama-3.3-70B-Instruct",                label: "Llama 3.3",  hint: "Strongest open · 70B",         provider: "hf" },
  { id: "hf:Qwen/Qwen2.5-72B-Instruct",                        label: "Qwen 2.5",   hint: "Top tier open · 72B",          provider: "hf" },
  { id: "hf:deepseek-ai/DeepSeek-V3",                          label: "DeepSeek",   hint: "Reasoning-focused",            provider: "hf" },
  { id: "hf:mistralai/Mistral-Nemo-Instruct-2407",             label: "Mistral Nemo", hint: "Fast · balanced · 12B",      provider: "hf" },
];

export const DEFAULT_MODEL_ID = "claude";

/**
 * Per-tool allowed models. Claude is always first (recommended).
 * We hide weaker/slower models for tools where they consistently underperform.
 */
export const TOOL_MODELS: Record<string, string[]> = {
  diagnostic:   ["claude", "hf:meta-llama/Llama-3.3-70B-Instruct", "hf:Qwen/Qwen2.5-72B-Instruct"],
  assessment:   ["claude", "hf:meta-llama/Llama-3.3-70B-Instruct", "hf:Qwen/Qwen2.5-72B-Instruct", "hf:mistralai/Mistral-Nemo-Instruct-2407"],
  worksheet:    ["claude", "hf:meta-llama/Llama-3.3-70B-Instruct", "hf:mistralai/Mistral-Nemo-Instruct-2407"],
  lessonplan:   ["claude", "hf:meta-llama/Llama-3.3-70B-Instruct", "hf:deepseek-ai/DeepSeek-V3"],
  presentation: ["claude", "hf:meta-llama/Llama-3.3-70B-Instruct"],
  games:        ["claude", "hf:meta-llama/Llama-3.3-70B-Instruct", "hf:deepseek-ai/DeepSeek-V3"],
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
