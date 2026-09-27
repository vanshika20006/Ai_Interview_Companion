import { a as generateText, i as generateObject } from "../_libs/@ai-sdk/react+[...].mjs";
import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { ft as numberType, ht as stringType, lt as arrayType, pt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
import { t as createAiProvider } from "./ai-provider.server-JuGv6z_M.mjs";
import { t as recordActivity } from "./activity.server-Bu1-YV1D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/resume.functions-SN4eSygs.js
var analysisSchema = objectType({
	ats_score: numberType().min(0).max(100).transform((n) => Math.round(n)),
	summary: stringType(),
	strengths: arrayType(stringType()),
	weaknesses: arrayType(stringType()),
	missing_keywords: arrayType(stringType()),
	missing_skills: arrayType(stringType()),
	role_match: arrayType(objectType({
		role: stringType(),
		match_percent: numberType().min(0).max(100).transform((n) => Math.round(n))
	})),
	suggestions: arrayType(stringType()),
	recommended_topics: arrayType(stringType())
});
var MODEL_ID = "google/gemini-2.5-flash";
var analyzeResume_createServerFn_handler = createServerRpc({
	id: "c8f61b0afaae08e817dcd91bcf0654257dcb701d1ab06bf9bf2b1159856e40ce",
	name: "analyzeResume",
	filename: "src/lib/resume.functions.ts"
}, (opts) => analyzeResume.__executeServer(opts));
var analyzeResume = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	file_name: stringType().min(1).max(200),
	raw_text: stringType().min(50).max(5e4),
	target_roles: arrayType(stringType()).optional()
}).parse(input)).handler(analyzeResume_createServerFn_handler, async ({ data, context }) => {
	const apiKey = process.env.GEMINI_API_KEY || process.env.LOVABLE_API_KEY;
	if (!apiKey) throw new Error("AI provider not configured");
	const { data: resumeRow, error: resumeErr } = await context.supabase.from("resumes").insert({
		user_id: context.userId,
		file_name: data.file_name,
		raw_text: data.raw_text
	}).select().single();
	if (resumeErr) throw new Error(resumeErr.message);
	const model = createAiProvider(apiKey)(MODEL_ID);
	const systemPrompt = `You are an expert technical recruiter and ATS (Applicant Tracking System) analyzer for campus placements in India and globally. Analyze the given resume rigorously. Give honest, actionable feedback. ${data.target_roles?.length ? `Target roles: ${data.target_roles.join(", ")}.` : "Target roles: Software Engineer, Full Stack Developer."}

Scoring rubric:
- ats_score (0-100 integer): formatting, keyword density, action verbs, quantified impact, role match.
- strengths/weaknesses: 3-6 concise bullet points each.
- missing_keywords: ATS keywords for the target roles that are absent.
- missing_skills: technical skills the candidate should add.
- role_match: 3-5 roles with integer match percentage 0-100.
- suggestions: 4-8 specific, actionable rewrites.
- recommended_topics: LeetCode topics to prioritize (e.g. Arrays, Dynamic Programming, Graphs).`;
	const userPrompt = `Resume content:\n\n${data.raw_text.replace(/\\/g, "\\\\").slice(0, 18e3)}`;
	let analysis;
	try {
		analysis = (await generateObject({
			model,
			schema: analysisSchema,
			system: systemPrompt,
			prompt: userPrompt
		})).object;
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		if (msg.includes("429")) throw new Error("AI rate limit reached. Please try again in a moment.");
		if (msg.includes("402")) throw new Error("AI credits exhausted. Add credits in Workspace settings.");
		try {
			const raw = (await generateText({
				model,
				system: systemPrompt + "\n\nRespond with ONLY a valid JSON object matching this TypeScript type, no markdown, no commentary:\n{ ats_score:number; summary:string; strengths:string[]; weaknesses:string[]; missing_keywords:string[]; missing_skills:string[]; role_match:{role:string;match_percent:number}[]; suggestions:string[]; recommended_topics:string[] }",
				prompt: userPrompt
			})).text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
			const start = raw.indexOf("{");
			const end = raw.lastIndexOf("}");
			const json = start >= 0 && end > start ? raw.slice(start, end + 1) : raw;
			analysis = analysisSchema.parse(JSON.parse(json));
		} catch (err2) {
			const msg2 = err2 instanceof Error ? err2.message : String(err2);
			throw new Error(`AI analysis failed: ${msg2}`);
		}
	}
	const { data: analysisRow, error: analysisErr } = await context.supabase.from("resume_analyses").insert({
		user_id: context.userId,
		resume_id: resumeRow.id,
		ats_score: analysis.ats_score,
		summary: analysis.summary,
		strengths: analysis.strengths,
		weaknesses: analysis.weaknesses,
		missing_keywords: analysis.missing_keywords,
		missing_skills: analysis.missing_skills,
		role_match: analysis.role_match,
		suggestions: analysis.suggestions,
		recommended_topics: analysis.recommended_topics,
		model: MODEL_ID
	}).select().single();
	if (analysisErr) throw new Error(analysisErr.message);
	await recordActivity(context.supabase, context.userId);
	return analysisRow;
});
var getLatestAnalysis_createServerFn_handler = createServerRpc({
	id: "d868fd96972712ecd17d5e7b88aad0f3b2378ff30c7e5c9c3bad4787b6fd777a",
	name: "getLatestAnalysis",
	filename: "src/lib/resume.functions.ts"
}, (opts) => getLatestAnalysis.__executeServer(opts));
var getLatestAnalysis = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getLatestAnalysis_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("resume_analyses").select("*, resumes(file_name)").eq("user_id", context.userId).order("created_at", { ascending: false }).limit(1).maybeSingle();
	if (error) throw new Error(error.message);
	return data;
});
var getAnalysisHistory_createServerFn_handler = createServerRpc({
	id: "4d2623fdb3c95f1346e8b79b0826acc800c8742dbaf2fcc6ebf4178956f4fbc0",
	name: "getAnalysisHistory",
	filename: "src/lib/resume.functions.ts"
}, (opts) => getAnalysisHistory.__executeServer(opts));
var getAnalysisHistory = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getAnalysisHistory_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("resume_analyses").select("id, ats_score, created_at, model").eq("user_id", context.userId).order("created_at", { ascending: false }).limit(10);
	if (error) throw new Error(error.message);
	return data ?? [];
});
//#endregion
export { analyzeResume_createServerFn_handler, getAnalysisHistory_createServerFn_handler, getLatestAnalysis_createServerFn_handler };
