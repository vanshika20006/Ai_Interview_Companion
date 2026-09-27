import { a as generateText, i as generateObject } from "../_libs/@ai-sdk/react+[...].mjs";
import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { dt as enumType, ft as numberType, ht as stringType, lt as arrayType, pt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
import { t as createAiProvider } from "./ai-provider.server-JuGv6z_M.mjs";
import { t as recordActivity } from "./activity.server-Bu1-YV1D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/interview.functions-DYQi0QXB.js
var ROLES = [
	"Frontend Developer",
	"Backend Developer",
	"Full Stack Developer",
	"SDE",
	"Data Analyst"
];
var DIFFICULTIES = [
	"Easy",
	"Medium",
	"Hard"
];
var TYPES = [
	"Technical",
	"HR",
	"Behavioral",
	"System Design"
];
var score = numberType().min(0).max(100).transform((n) => Math.round(n));
var feedbackSchema = objectType({
	communication_score: score,
	technical_score: score,
	confidence_score: score,
	problem_solving_score: score,
	overall_score: score,
	strengths: arrayType(stringType()).max(8),
	weaknesses: arrayType(stringType()).max(8),
	better_answer: stringType(),
	suggestions: arrayType(stringType()).max(8)
});
function gateway() {
	const apiKey = process.env.GEMINI_API_KEY || process.env.LOVABLE_API_KEY;
	if (!apiKey) throw new Error("AI provider not configured");
	return createAiProvider(apiKey)("google/gemini-2.5-flash");
}
function mapAiError(err) {
	const msg = err instanceof Error ? err.message : String(err);
	if (msg.includes("429")) return /* @__PURE__ */ new Error("AI rate limit reached. Please retry shortly.");
	if (msg.includes("402")) return /* @__PURE__ */ new Error("AI credits exhausted. Add credits in Workspace settings.");
	return /* @__PURE__ */ new Error(`AI request failed: ${msg}`);
}
var startInterview_createServerFn_handler = createServerRpc({
	id: "6fffea624c23763185d8883bc71dc6641e1b007518aad1b3c890fd60ad8bc926",
	name: "startInterview",
	filename: "src/lib/interview.functions.ts"
}, (opts) => startInterview.__executeServer(opts));
var startInterview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	role: enumType(ROLES),
	difficulty: enumType(DIFFICULTIES),
	interview_type: enumType(TYPES),
	total_questions: numberType().int().min(3).max(8).default(5)
}).parse(input)).handler(startInterview_createServerFn_handler, async ({ data, context }) => {
	const { data: profile } = await context.supabase.from("profiles").select("skills,target_roles,branch,degree").eq("id", context.userId).maybeSingle();
	const sanitizedProfileCtx = (profile ? `Candidate skills: ${(profile.skills ?? []).join(", ") || "n/a"}. Background: ${profile.degree ?? ""} ${profile.branch ?? ""}.` : "").replace(/\\/g, "\\\\");
	let questions;
	try {
		const { text } = await generateText({
			model: gateway(),
			system: `You are a senior interviewer conducting a ${data.difficulty} ${data.interview_type} interview for a ${data.role} role at a top tech company. ${sanitizedProfileCtx}

Return ONLY valid JSON (no markdown, no commentary) of the shape:
{"questions":[{"question":string,"expected_topics":string[],"difficulty":"Easy"|"Medium"|"Hard"}]}

Generate exactly ${data.total_questions} realistic, diverse interview questions. For each include 2-4 expected topics. Difficulty must match: Easy = fundamental, Medium = scenario-based, Hard = system/design or deep technical.`,
			prompt: `Generate ${data.total_questions} ${data.interview_type} interview questions for a ${data.role} role (${data.difficulty} difficulty). Respond with JSON only.`
		});
		let cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
		const start = cleaned.indexOf("{");
		const end = cleaned.lastIndexOf("}");
		if (start !== -1 && end > start) cleaned = cleaned.slice(start, end + 1);
		const parsed = JSON.parse(cleaned);
		questions = (Array.isArray(parsed.questions) ? parsed.questions : []).map((q) => {
			const o = q;
			return {
				question: String(o.question ?? "").trim(),
				expected_topics: Array.isArray(o.expected_topics) ? o.expected_topics.map(String) : [],
				difficulty: String(o.difficulty ?? data.difficulty)
			};
		}).filter((q) => q.question.length > 0);
		if (questions.length === 0) throw new Error("No questions generated");
	} catch (err) {
		throw mapAiError(err);
	}
	const { data: interview, error } = await context.supabase.from("interviews").insert({
		user_id: context.userId,
		role: data.role,
		difficulty: data.difficulty,
		interview_type: data.interview_type,
		total_questions: questions.length,
		status: "in_progress"
	}).select().single();
	if (error) throw new Error(error.message);
	const answerRows = questions.map((q, i) => {
		const normalized = DIFFICULTIES.find((d) => d.toLowerCase() === String(q.difficulty).toLowerCase()) ?? data.difficulty;
		return {
			interview_id: interview.id,
			user_id: context.userId,
			q_index: i,
			question: q.question,
			expected_topics: q.expected_topics ?? [],
			difficulty: normalized,
			answer_text: ""
		};
	});
	const { error: ansErr } = await context.supabase.from("interview_answers").insert(answerRows);
	if (ansErr) throw new Error(ansErr.message);
	return interview;
});
var submitAnswer_createServerFn_handler = createServerRpc({
	id: "8ab63f8c7ad7b6c5cbc1638767c518a46b72f5229345c810410a97461fc27e10",
	name: "submitAnswer",
	filename: "src/lib/interview.functions.ts"
}, (opts) => submitAnswer.__executeServer(opts));
var submitAnswer = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	answer_id: stringType().uuid(),
	answer_text: stringType().min(1).max(8e3)
}).parse(input)).handler(submitAnswer_createServerFn_handler, async ({ data, context }) => {
	const { data: answer, error: ansErr } = await context.supabase.from("interview_answers").select("*, interviews!inner(role, difficulty, interview_type)").eq("id", data.answer_id).eq("user_id", context.userId).single();
	if (ansErr || !answer) throw new Error("Answer not found");
	await context.supabase.from("interview_answers").update({ answer_text: data.answer_text }).eq("id", data.answer_id);
	const meta = answer.interviews;
	let feedback;
	try {
		const sanitizedAns = data.answer_text.replace(/\\/g, "\\\\");
		const sanitizedQ = answer.question.replace(/\\/g, "\\\\");
		feedback = (await generateObject({
			model: gateway(),
			schema: feedbackSchema,
			system: `You are a strict but fair interviewer evaluating a candidate's answer in a ${meta.difficulty} ${meta.interview_type} interview for a ${meta.role} role. Be specific and constructive. Scores are 0-100. Be honest — average answers score 50-65, strong answers 70-85, exceptional 90+.`,
			prompt: `Question: ${sanitizedQ}
Expected topics: ${(answer.expected_topics ?? []).join(", ")}

Candidate's answer:
${sanitizedAns}

Evaluate the answer. Provide all four scores, an overall score (weighted average), 2-4 strengths, 2-4 weaknesses, a concrete "better_answer" example (~150 words), and 3-5 actionable suggestions.`
		})).object;
	} catch (err) {
		throw mapAiError(err);
	}
	const { data: fb, error: fbErr } = await context.supabase.from("interview_feedback").insert({
		answer_id: data.answer_id,
		user_id: context.userId,
		...feedback,
		strengths: feedback.strengths,
		weaknesses: feedback.weaknesses,
		suggestions: feedback.suggestions
	}).select().single();
	if (fbErr) throw new Error(fbErr.message);
	return fb;
});
var completeInterview_createServerFn_handler = createServerRpc({
	id: "c4036c5b6a87116fb06b0bfdc104ec275fcf48f826db38937b316ef9983ce17c",
	name: "completeInterview",
	filename: "src/lib/interview.functions.ts"
}, (opts) => completeInterview.__executeServer(opts));
var completeInterview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ interview_id: stringType().uuid() }).parse(input)).handler(completeInterview_createServerFn_handler, async ({ data, context }) => {
	const { data: feedbacks } = await context.supabase.from("interview_feedback").select("*, interview_answers!inner(interview_id)").eq("user_id", context.userId).eq("interview_answers.interview_id", data.interview_id);
	const avg = (key) => {
		if (!feedbacks || feedbacks.length === 0) return 0;
		const sum = feedbacks.reduce((s, f) => s + (Number(f[key]) || 0), 0);
		return Math.round(sum / feedbacks.length);
	};
	const { data: updated, error } = await context.supabase.from("interviews").update({
		status: "completed",
		completed_at: (/* @__PURE__ */ new Date()).toISOString(),
		overall_score: avg("overall_score"),
		communication_score: avg("communication_score"),
		technical_score: avg("technical_score"),
		confidence_score: avg("confidence_score"),
		problem_solving_score: avg("problem_solving_score")
	}).eq("id", data.interview_id).eq("user_id", context.userId).select().single();
	if (error) throw new Error(error.message);
	await recordActivity(context.supabase, context.userId);
	return updated;
});
var getInterview_createServerFn_handler = createServerRpc({
	id: "20a75281ee124a3eca0a9f0750034de7e9b37a2ee573411fbb6a9d4763d548e5",
	name: "getInterview",
	filename: "src/lib/interview.functions.ts"
}, (opts) => getInterview.__executeServer(opts));
var getInterview = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(getInterview_createServerFn_handler, async ({ data, context }) => {
	const { data: interview, error } = await context.supabase.from("interviews").select("*").eq("id", data.id).eq("user_id", context.userId).single();
	if (error) throw new Error(error.message);
	const { data: answers } = await context.supabase.from("interview_answers").select("*, interview_feedback(*)").eq("interview_id", data.id).order("q_index");
	return {
		interview,
		answers: answers ?? []
	};
});
var listInterviews_createServerFn_handler = createServerRpc({
	id: "0b475ddb4ec72a18be61a89cf94267abe82da347927e181ad568eaa81b6d3442",
	name: "listInterviews",
	filename: "src/lib/interview.functions.ts"
}, (opts) => listInterviews.__executeServer(opts));
var listInterviews = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listInterviews_createServerFn_handler, async ({ context }) => {
	const { data } = await context.supabase.from("interviews").select("*").eq("user_id", context.userId).order("created_at", { ascending: false });
	return data ?? [];
});
var deleteInterview_createServerFn_handler = createServerRpc({
	id: "349d19e3833204543da40a783ac37ad28a947785ea58de735a9059cb37f5c007",
	name: "deleteInterview",
	filename: "src/lib/interview.functions.ts"
}, (opts) => deleteInterview.__executeServer(opts));
var deleteInterview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(deleteInterview_createServerFn_handler, async ({ data, context }) => {
	const { data: ans } = await context.supabase.from("interview_answers").select("id").eq("interview_id", data.id).eq("user_id", context.userId);
	const answerIds = (ans ?? []).map((a) => a.id);
	if (answerIds.length > 0) {
		await context.supabase.from("interview_feedback").delete().in("answer_id", answerIds).eq("user_id", context.userId);
		await context.supabase.from("interview_answers").delete().in("id", answerIds).eq("user_id", context.userId);
	}
	const { error } = await context.supabase.from("interviews").delete().eq("id", data.id).eq("user_id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var getInterviewAnalytics_createServerFn_handler = createServerRpc({
	id: "54b469af2c186fcfad579885bdc62e53265eed519c317c09d46fcde1d08df0a0",
	name: "getInterviewAnalytics",
	filename: "src/lib/interview.functions.ts"
}, (opts) => getInterviewAnalytics.__executeServer(opts));
var getInterviewAnalytics = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getInterviewAnalytics_createServerFn_handler, async ({ context }) => {
	const { data: completed } = await context.supabase.from("interviews").select("*").eq("user_id", context.userId).eq("status", "completed").order("created_at", { ascending: true });
	const list = completed ?? [];
	const attempts = list.length;
	const avg = attempts ? Math.round(list.reduce((s, i) => s + (i.overall_score ?? 0), 0) / attempts) : 0;
	const best = attempts ? Math.max(...list.map((i) => i.overall_score ?? 0)) : 0;
	const byType = {};
	for (const i of list) {
		const t = i.interview_type;
		byType[t] = byType[t] ?? {
			sum: 0,
			n: 0
		};
		byType[t].sum += i.overall_score ?? 0;
		byType[t].n += 1;
	}
	const categories = Object.entries(byType).map(([type, v]) => ({
		type,
		avg: Math.round(v.sum / v.n)
	}));
	return {
		attempts,
		avg,
		best,
		categories,
		strong: [...categories].sort((a, b) => b.avg - a.avg).slice(0, 2),
		weak: [...categories].sort((a, b) => a.avg - b.avg).slice(0, 2),
		trend: list.map((i) => ({
			date: i.created_at,
			score: i.overall_score ?? 0
		}))
	};
});
//#endregion
export { completeInterview_createServerFn_handler, deleteInterview_createServerFn_handler, getInterviewAnalytics_createServerFn_handler, getInterview_createServerFn_handler, listInterviews_createServerFn_handler, startInterview_createServerFn_handler, submitAnswer_createServerFn_handler };
