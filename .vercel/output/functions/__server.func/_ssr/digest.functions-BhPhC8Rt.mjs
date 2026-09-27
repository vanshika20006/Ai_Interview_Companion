import { a as generateText } from "../_libs/@ai-sdk/react+[...].mjs";
import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
import { t as createAiProvider } from "./ai-provider.server-JuGv6z_M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/digest.functions-BhPhC8Rt.js
var getWeeklyDigest_createServerFn_handler = createServerRpc({
	id: "288e72e41e4b0cf9ce4a666a71004b5f37aed62540c3a2920512555bf9fb99d8",
	name: "getWeeklyDigest",
	filename: "src/lib/digest.functions.ts"
}, (opts) => getWeeklyDigest.__executeServer(opts));
var getWeeklyDigest = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(getWeeklyDigest_createServerFn_handler, async ({ context }) => {
	const since = (/* @__PURE__ */ new Date(Date.now() - 10080 * 60 * 1e3)).toISOString();
	const supabase = context.supabase;
	const [problems, interviews, resumes, streak] = await Promise.all([
		supabase.from("user_problem_progress").select("status,updated_at").gte("updated_at", since),
		supabase.from("interviews").select("overall_score,status,created_at").gte("created_at", since),
		supabase.from("resume_analyses").select("ats_score,created_at").gte("created_at", since),
		supabase.from("streaks").select("current_streak,best_streak").maybeSingle()
	]);
	const solved = (problems.data ?? []).filter((p) => p.status === "solved").length;
	const interviewsDone = (interviews.data ?? []).filter((i) => i.status === "completed").length;
	const avgInterview = interviewsDone ? Math.round((interviews.data ?? []).filter((i) => i.status === "completed" && i.overall_score != null).reduce((s, i) => s + (i.overall_score ?? 0), 0) / interviewsDone) : 0;
	const bestAts = Math.max(0, ...(resumes.data ?? []).map((r) => r.ats_score ?? 0));
	const stats = {
		solved,
		interviewsDone,
		avgInterview,
		bestAts,
		currentStreak: streak.data?.current_streak ?? 0,
		bestStreak: streak.data?.best_streak ?? 0
	};
	const key = process.env.GEMINI_API_KEY || process.env.LOVABLE_API_KEY;
	let summary = `This week: ${solved} problems solved, ${interviewsDone} interviews (avg ${avgInterview}/100). Streak: ${stats.currentStreak} days.`;
	if (key) try {
		const { text } = await generateText({
			model: createAiProvider(key)("google/gemini-2.5-flash"),
			system: "You write short, motivating weekly progress digests (4-6 sentences, second person). Highlight wins, one focus area, and an encouraging next step. Use markdown bullets when helpful.",
			prompt: `Stats:\n- Problems solved: ${solved}\n- Interviews completed: ${interviewsDone}, avg score ${avgInterview}/100\n- Best ATS resume score: ${bestAts}\n- Current streak: ${stats.currentStreak} days (best ${stats.bestStreak})\n\nWrite the digest.`
		});
		summary = text.trim();
	} catch {}
	return {
		stats,
		summary,
		periodStart: since
	};
});
//#endregion
export { getWeeklyDigest_createServerFn_handler };
