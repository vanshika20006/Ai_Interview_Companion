import { t as createGoogleGenerativeAI } from "../_libs/@ai-sdk/google+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-provider.server-JuGv6z_M.js
function createAiProvider(apiKey) {
	const google = createGoogleGenerativeAI({ apiKey });
	return (modelId) => {
		const cleanModelId = modelId.startsWith("google/") ? modelId.slice(7) : modelId;
		let mappedModelId = cleanModelId;
		if (cleanModelId.includes("gemini-3") || cleanModelId.includes("gemini-2.5") || cleanModelId.includes("gemini-1.5")) mappedModelId = "gemini-2.5-flash";
		return google(mappedModelId);
	};
}
//#endregion
export { createAiProvider as t };
