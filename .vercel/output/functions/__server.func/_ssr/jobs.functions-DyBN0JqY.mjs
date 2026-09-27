import { a as generateText } from "../_libs/@ai-sdk/react+[...].mjs";
import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { ht as stringType, pt as objectType, ut as booleanType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
import { t as createAiProvider } from "./ai-provider.server-JuGv6z_M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/jobs.functions-DyBN0JqY.js
var EMPLOYMENT_TYPES = [
	"Internship",
	"Full Time",
	"Fresher",
	"Contract"
];
function extractJson(text) {
	let s = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
	const start = s.indexOf("{");
	const end = s.lastIndexOf("}");
	if (start !== -1 && end > start) s = s.slice(start, end + 1);
	return JSON.parse(s);
}
function normalizeJobs(raw) {
	const obj = raw;
	return (Array.isArray(obj?.jobs) ? obj.jobs : []).map((j) => {
		const o = j;
		const t = String(o.employment_type ?? "Full Time");
		const employment_type = EMPLOYMENT_TYPES.find((e) => e.toLowerCase() === t.toLowerCase()) ?? "Full Time";
		return {
			title: String(o.title ?? "").trim(),
			company: String(o.company ?? "").trim(),
			location: String(o.location ?? "Remote"),
			employment_type,
			match_pct: Math.max(0, Math.min(100, Math.round(Number(o.match_pct) || 0))),
			description: String(o.description ?? ""),
			matched_skills: Array.isArray(o.matched_skills) ? o.matched_skills.map(String) : [],
			missing_skills: Array.isArray(o.missing_skills) ? o.missing_skills.map(String) : [],
			tags: Array.isArray(o.tags) ? o.tags.map(String) : [],
			recommended_prep: Array.isArray(o.recommended_prep) ? o.recommended_prep.map(String) : [],
			apply_url: String(o.apply_url ?? "https://www.linkedin.com/jobs/")
		};
	}).filter((j) => j.title && j.company);
}
var generateJobRecommendations_createServerFn_handler = createServerRpc({
	id: "37f329fd0b035d7859cb6dd0043634c5f0bd1cdc6bd6cafaeba6cbba42f18c15",
	name: "generateJobRecommendations",
	filename: "src/lib/jobs.functions.ts"
}, (opts) => generateJobRecommendations.__executeServer(opts));
var generateJobRecommendations = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(generateJobRecommendations_createServerFn_handler, async ({ context }) => {
	const apiKey = process.env.GEMINI_API_KEY || process.env.LOVABLE_API_KEY;
	if (!apiKey) throw new Error("AI provider not configured");
	const [{ data: profile }, { data: analysis }, { count: solvedCount }] = await Promise.all([
		context.supabase.from("profiles").select("*").eq("id", context.userId).maybeSingle(),
		context.supabase.from("resume_analyses").select("missing_skills,role_match,recommended_topics").eq("user_id", context.userId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
		context.supabase.from("user_problem_progress").select("id", {
			count: "exact",
			head: true
		}).eq("user_id", context.userId).eq("status", "solved")
	]);
	const ctx = {
		skills: profile?.skills ?? [],
		targetRoles: profile?.target_roles ?? [],
		preferredCompanies: profile?.preferred_companies ?? [],
		branch: profile?.branch,
		graduationYear: profile?.graduation_year,
		problemsSolved: solvedCount ?? 0,
		missingSkills: analysis?.missing_skills ?? []
	};
	const model = createAiProvider(apiKey)("google/gemini-2.5-flash");
	let jobs;
	try {
		const { text } = await generateText({
			model,
			system: `You are a placement advisor. Return ONLY valid JSON (no markdown, no commentary) of shape:
{"jobs":[{"title":string,"company":string,"location":string,"employment_type":"Internship"|"Full Time"|"Fresher"|"Contract","match_pct":number(0-100),"description":string,"matched_skills":string[],"missing_skills":string[],"tags":string[],"recommended_prep":string[],"apply_url":string}]}

Generate 6-10 realistic job recommendations matched to the candidate. Use real well-known companies (Google, Microsoft, Amazon, Razorpay, Zoho, Flipkart, Swiggy, Atlassian, Stripe, etc.). Calculate match_pct honestly based on skills overlap. apply_url should be a realistic careers URL (e.g. https://careers.google.com).`,
			prompt: `Candidate context:\n${JSON.stringify(ctx, null, 2)}\n\nGenerate diverse job recommendations spanning internship/full-time/fresher roles. Respond with JSON only.`
		});
		jobs = normalizeJobs(extractJson(text));
		if (jobs.length === 0) throw new Error("No jobs generated");
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		if (msg.includes("429")) throw new Error("AI rate limit reached.");
		if (msg.includes("402")) throw new Error("AI credits exhausted.");
		throw new Error(`Job recommendation failed: ${msg}`);
	}
	await context.supabase.from("saved_jobs").delete().eq("user_id", context.userId).eq("saved", false);
	const rows = jobs.map((j) => ({
		user_id: context.userId,
		...j,
		source: { generated_at: (/* @__PURE__ */ new Date()).toISOString() }
	}));
	const { error } = await context.supabase.from("saved_jobs").insert(rows);
	if (error) throw new Error(error.message);
	return { count: rows.length };
});
var listJobs_createServerFn_handler = createServerRpc({
	id: "0f6b44b459f0f5a7154aecdbd6de5f39fc93825d0d32caf19f26936089e5a107",
	name: "listJobs",
	filename: "src/lib/jobs.functions.ts"
}, (opts) => listJobs.__executeServer(opts));
var listJobs = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listJobs_createServerFn_handler, async ({ context }) => {
	const { data } = await context.supabase.from("saved_jobs").select("*").eq("user_id", context.userId).order("match_pct", { ascending: false });
	return data ?? [];
});
var toggleSaveJob_createServerFn_handler = createServerRpc({
	id: "702b9359b7913381e3b818f46684f0ed1b39bd979cdfa85f3856c27775156b6e",
	name: "toggleSaveJob",
	filename: "src/lib/jobs.functions.ts"
}, (opts) => toggleSaveJob.__executeServer(opts));
var toggleSaveJob = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	id: stringType().uuid(),
	saved: booleanType()
}).parse(input)).handler(toggleSaveJob_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("saved_jobs").update({ saved: data.saved }).eq("id", data.id).eq("user_id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { generateJobRecommendations_createServerFn_handler, listJobs_createServerFn_handler, toggleSaveJob_createServerFn_handler };
