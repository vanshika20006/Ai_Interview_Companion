import { createGoogleGenerativeAI } from "@ai-sdk/google";

export function createAiProvider(apiKey: string) {
  const google = createGoogleGenerativeAI({ apiKey });

  return (modelId: string) => {
    // Strip "google/" prefix if present
    const cleanModelId = modelId.startsWith("google/") ? modelId.slice(7) : modelId;

    // Map custom or placeholder models to standard Gemini 2.5 flash
    let mappedModelId = cleanModelId;
    if (
      cleanModelId.includes("gemini-3") ||
      cleanModelId.includes("gemini-2.5") ||
      cleanModelId.includes("gemini-1.5")
    ) {
      mappedModelId = "gemini-2.5-flash";
    }

    return google(mappedModelId);
  };
}
