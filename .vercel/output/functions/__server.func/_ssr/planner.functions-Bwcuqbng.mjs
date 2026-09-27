import { a as generateText, i as generateObject } from "../_libs/@ai-sdk/react+[...].mjs";
import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { dt as enumType, ft as numberType, ht as stringType, lt as arrayType, pt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
import { t as createAiProvider } from "./ai-provider.server-JuGv6z_M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/planner.functions-Bwcuqbng.js
var planSchema = objectType({
	summary: stringType(),
	days: arrayType(objectType({
		day_index: numberType().min(0).max(6).transform((n) => Math.round(n)),
		topic: stringType(),
		tasks: arrayType(objectType({
			title: stringType(),
			kind: enumType([
				"practice",
				"study",
				"project",
				"interview",
				"review"
			]),
			estimated_minutes: numberType().min(10).max(240).transform((n) => Math.round(n)),
			problem_slug: stringType().optional().nullable()
		})).min(1).max(5)
	})).length(7)
});
var MODEL_ID = "google/gemini-2.5-flash";
function gateway() {
	const apiKey = process.env.GEMINI_API_KEY || process.env.LOVABLE_API_KEY;
	if (!apiKey) throw new Error("AI provider not configured");
	return createAiProvider(apiKey)(MODEL_ID);
}
function startOfWeek() {
	const d = /* @__PURE__ */ new Date();
	const diff = (d.getDay() + 6) % 7;
	d.setDate(d.getDate() - diff);
	return d.toISOString().slice(0, 10);
}
var generateWeeklyPlan_createServerFn_handler = createServerRpc({
	id: "7fa4b27ddf60825224fabcc2f335cd1d492e93daa41e700150470d3d8532504f",
	name: "generateWeeklyPlan",
	filename: "src/lib/planner.functions.ts"
}, (opts) => generateWeeklyPlan.__executeServer(opts));
var generateWeeklyPlan = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(generateWeeklyPlan_createServerFn_handler, async ({ context }) => {
	const [{ data: profile }, { data: progress }, { data: analysis }] = await Promise.all([
		context.supabase.from("profiles").select("skills,target_roles,branch").eq("id", context.userId).maybeSingle(),
		context.supabase.from("user_problem_progress").select("problem_slug,status").eq("user_id", context.userId),
		context.supabase.from("resume_analyses").select("recommended_topics,missing_skills,ats_score").eq("user_id", context.userId).order("created_at", { ascending: false }).limit(1).maybeSingle()
	]);
	const solved = (progress ?? []).filter((p) => p.status === "solved").length;
	const ctx = {
		skills: profile?.skills ?? [],
		targetRoles: profile?.target_roles ?? [],
		solvedCount: solved,
		recommendedTopics: analysis?.recommended_topics ?? [],
		missingSkills: analysis?.missing_skills ?? [],
		atsScore: analysis?.ats_score ?? null
	};
	const systemPrompt = `You are a placement-prep coach. Generate a 7-day study plan (Monday=0 ... Sunday=6) for a student. Tasks must mix DSA practice (with problem_slug like 'two-sum', 'binary-search', 'climbing-stairs'), concept study, system-design reading, and 1 mock interview. Prioritize the student's weak topics, missing skills, and target roles. Each day: 1 topic + 1-4 actionable tasks, total under ~2 hours. day_index and estimated_minutes must be integers.`;
	const userPrompt = `Student context:\n${JSON.stringify(ctx, null, 2)}\n\nGenerate the 7-day plan.`;
	let plan;
	try {
		plan = (await generateObject({
			model: gateway(),
			schema: planSchema,
			system: systemPrompt,
			prompt: userPrompt
		})).object;
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		if (msg.includes("429")) throw new Error("AI rate limit reached. Please retry shortly.");
		if (msg.includes("402")) throw new Error("AI credits exhausted.");
		try {
			const raw = (await generateText({
				model: gateway(),
				system: systemPrompt + `\n\nRespond with ONLY a valid JSON object, no markdown or commentary, matching this TypeScript type:\n{ summary:string; days: { day_index:number; topic:string; tasks: { title:string; kind:"practice"|"study"|"project"|"interview"|"review"; estimated_minutes:number; problem_slug?:string|null }[] }[] }\nThe days array MUST have exactly 7 entries with day_index 0..6.`,
				prompt: userPrompt
			})).text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
			const start = raw.indexOf("{");
			const end = raw.lastIndexOf("}");
			const json = start >= 0 && end > start ? raw.slice(start, end + 1) : raw;
			plan = planSchema.parse(JSON.parse(json));
		} catch (err2) {
			const msg2 = err2 instanceof Error ? err2.message : String(err2);
			throw new Error(`Plan generation failed: ${msg2}`);
		}
	}
	const weekStart = startOfWeek();
	await context.supabase.from("study_plans").update({ status: "archived" }).eq("user_id", context.userId).eq("status", "active");
	const { data: row, error } = await context.supabase.from("study_plans").insert({
		user_id: context.userId,
		week_start: weekStart,
		status: "active",
		generated_from: ctx,
		summary: plan.summary
	}).select().single();
	if (error) throw new Error(error.message);
	const tasks = plan.days.flatMap((d) => d.tasks.map((t) => ({
		plan_id: row.id,
		user_id: context.userId,
		day_index: d.day_index,
		topic: d.topic,
		title: t.title,
		kind: t.kind,
		problem_slug: t.problem_slug ?? null,
		estimated_minutes: t.estimated_minutes
	})));
	await context.supabase.from("study_tasks").insert(tasks);
	return row;
});
var getCurrentPlan_createServerFn_handler = createServerRpc({
	id: "5831547eca494bcb978740bc68596c6cb6fa7eb77b9d78bb8ef78473d640a917",
	name: "getCurrentPlan",
	filename: "src/lib/planner.functions.ts"
}, (opts) => getCurrentPlan.__executeServer(opts));
var getCurrentPlan = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getCurrentPlan_createServerFn_handler, async ({ context }) => {
	const { data: plan } = await context.supabase.from("study_plans").select("*").eq("user_id", context.userId).eq("status", "active").order("created_at", { ascending: false }).limit(1).maybeSingle();
	if (!plan) return null;
	const { data: tasks } = await context.supabase.from("study_tasks").select("*").eq("plan_id", plan.id).order("day_index").order("created_at");
	return {
		plan,
		tasks: tasks ?? []
	};
});
var updateTaskStatus_createServerFn_handler = createServerRpc({
	id: "80aff8e3e006205ef295de0ba7319a528075fafa25a498d33c0612e06b44a457",
	name: "updateTaskStatus",
	filename: "src/lib/planner.functions.ts"
}, (opts) => updateTaskStatus.__executeServer(opts));
var updateTaskStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	task_id: stringType().uuid(),
	status: enumType([
		"pending",
		"done",
		"skipped"
	])
}).parse(input)).handler(updateTaskStatus_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("study_tasks").update({ status: data.status }).eq("id", data.task_id).eq("user_id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { generateWeeklyPlan_createServerFn_handler, getCurrentPlan_createServerFn_handler, updateTaskStatus_createServerFn_handler };
