// The open tokenizers and the model the widgets load from the Hugging Face Hub, in the reader's
// browser. Choices and sizes are in content/decisions/0006-widget-models.md.

export type TokenizerId = "gpt-4o" | "gpt-4" | "llama-3" | "gemma-3" | "qwen-3" | "smollm2";

export const TOKENIZERS: { id: TokenizerId; name: string; repo: string; mb: number }[] = [
  { id: "gpt-4o", name: "GPT-4o", repo: "Xenova/gpt-4o", mb: 9.7 },
  { id: "gpt-4", name: "GPT-4", repo: "Xenova/gpt-4", mb: 4.2 },
  { id: "llama-3", name: "Llama 3", repo: "Xenova/llama3-tokenizer-new", mb: 9.1 },
  { id: "gemma-3", name: "Gemma 3", repo: "onnx-community/gemma-3-270m-it-ONNX", mb: 20.3 },
  { id: "qwen-3", name: "Qwen3", repo: "Qwen/Qwen3-0.6B", mb: 11.4 },
  { id: "smollm2", name: "SmolLM2", repo: "HuggingFaceTB/SmolLM2-135M-Instruct", mb: 2.1 },
];

/** The one model behind the next-token explorer and the request timer. */
export const MODEL = {
  name: "SmolLM2-135M-Instruct",
  repo: "HuggingFaceTB/SmolLM2-135M-Instruct",
  // Download size of each ONNX file, by how the worker runs it.
  mb: { q4f16: 118, q4: 182, q8: 137 },
} as const;
