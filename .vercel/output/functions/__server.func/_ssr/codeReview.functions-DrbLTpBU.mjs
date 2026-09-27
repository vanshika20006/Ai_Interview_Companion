import { a as generateText } from "../_libs/@ai-sdk/react+[...].mjs";
import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { dt as enumType, ht as stringType, pt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
import { t as createAiProvider } from "./ai-provider.server-JuGv6z_M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/codeReview.functions-DrbLTpBU.js
var LangSchema = enumType([
	"javascript",
	"typescript",
	"python",
	"java",
	"cpp",
	"go",
	"rust",
	"csharp",
	"sql"
]);
var listReviews_createServerFn_handler = createServerRpc({
	id: "8f9727296c19885f613b204d51f3e5416ffb73428bf36b765dcf05d107d70048",
	name: "listReviews",
	filename: "src/lib/codeReview.functions.ts"
}, (opts) => listReviews.__executeServer(opts));
var listReviews = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listReviews_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("code_reviews").select("id,user_id,title,language,description,ai_score,created_at").order("created_at", { ascending: false }).limit(50);
	if (error) throw new Error(error.message);
	const ids = Array.from(new Set((data ?? []).map((r) => r.user_id)));
	let nameMap = {};
	if (ids.length) {
		const { data: names } = await context.supabase.rpc("get_display_names", { _ids: ids });
		nameMap = Object.fromEntries((names ?? []).map((n) => [n.user_id, n.display_name]));
	}
	return (data ?? []).map((r) => ({
		...r,
		author: nameMap[r.user_id] ?? "Anonymous"
	}));
});
var getReview_createServerFn_handler = createServerRpc({
	id: "c06d770edd464f1f17dc17211ca3ef45b5a0a84692f62bc12dcc36a6ac221679",
	name: "getReview",
	filename: "src/lib/codeReview.functions.ts"
}, (opts) => getReview.__executeServer(opts));
var getReview = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(getReview_createServerFn_handler, async ({ data, context }) => {
	const { data: review, error } = await context.supabase.from("code_reviews").select("*").eq("id", data.id).maybeSingle();
	if (error || !review) throw new Error("Not found");
	const { data: comments } = await context.supabase.from("code_review_comments").select("id,user_id,body,created_at").eq("review_id", data.id).order("created_at", { ascending: true });
	const ids = Array.from(new Set([review.user_id, ...(comments ?? []).map((c) => c.user_id)]));
	const { data: names } = await context.supabase.rpc("get_display_names", { _ids: ids });
	const nameMap = Object.fromEntries((names ?? []).map((n) => [n.user_id, n.display_name]));
	return {
		review: {
			...review,
			author: nameMap[review.user_id] ?? "Anonymous"
		},
		comments: (comments ?? []).map((c) => ({
			...c,
			author: nameMap[c.user_id] ?? "Anonymous"
		}))
	};
});
var createReview_createServerFn_handler = createServerRpc({
	id: "a8971ffaae225b916dcf41b627118e2c986be85d7212a61f88e1e4bec9eef087",
	name: "createReview",
	filename: "src/lib/codeReview.functions.ts"
}, (opts) => createReview.__executeServer(opts));
var createReview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => objectType({
	title: stringType().min(3).max(140),
	language: LangSchema,
	code: stringType().min(10).max(2e4),
	description: stringType().max(2e3).optional()
}).parse(d)).handler(createReview_createServerFn_handler, async ({ data, context }) => {
	const key = process.env.GEMINI_API_KEY || process.env.LOVABLE_API_KEY;
	let aiFeedback = "AI feedback unavailable.";
	let aiScore = null;
	if (key) try {
		const model = createAiProvider(key)("google/gemini-2.5-flash");
		const sanitizedCode = data.code.replace(/\\/g, "\\\\");
		const sanitizedDesc = (data.description ?? "(none)").replace(/\\/g, "\\\\");
		const { text } = await generateText({
			model,
			system: "You are a senior code reviewer. Score the snippet 0-100 on quality. Return strict JSON: {\"score\": <int>, \"review\": \"<markdown\"}. The review covers correctness, readability, performance, edge cases, and concrete improvement suggestions.",
			prompt: `Language: ${data.language}\nContext: ${sanitizedDesc}\n\nCode:\n\`\`\`${data.language}\n${sanitizedCode.slice(0, 12e3)}\n\`\`\``
		});
		const m = text.match(/\{[\s\S]*\}/);
		if (m) {
			const j = JSON.parse(m[0]);
			aiScore = typeof j.score === "number" ? Math.max(0, Math.min(100, j.score)) : null;
			aiFeedback = j.review ?? text;
		} else aiFeedback = text;
	} catch (e) {
		aiFeedback = `AI review failed: ${e instanceof Error ? e.message : "unknown"}`;
	}
	const { data: row, error } = await context.supabase.from("code_reviews").insert({
		user_id: context.userId,
		title: data.title,
		language: data.language,
		code: data.code,
		description: data.description,
		ai_feedback: aiFeedback,
		ai_score: aiScore
	}).select("id").single();
	if (error) throw new Error(error.message);
	await context.supabase.from("notifications").insert({
		user_id: context.userId,
		type: "code_review",
		title: `AI reviewed: ${data.title}`,
		body: aiScore != null ? `AI score: ${aiScore}/100` : "Your code review is ready",
		link: `/code-review/${row.id}`
	});
	return { id: row.id };
});
var addReviewComment_createServerFn_handler = createServerRpc({
	id: "9466f09f5c236e258d5cefbfb4de702588a4ba5eeab1fd618a7d8f659ed1ab8b",
	name: "addReviewComment",
	filename: "src/lib/codeReview.functions.ts"
}, (opts) => addReviewComment.__executeServer(opts));
var addReviewComment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => objectType({
	reviewId: stringType().uuid(),
	body: stringType().min(1).max(2e3)
}).parse(d)).handler(addReviewComment_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("code_review_comments").insert({
		review_id: data.reviewId,
		user_id: context.userId,
		body: data.body
	});
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { addReviewComment_createServerFn_handler, createReview_createServerFn_handler, getReview_createServerFn_handler, listReviews_createServerFn_handler };
