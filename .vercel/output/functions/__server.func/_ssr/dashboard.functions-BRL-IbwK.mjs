import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.functions-BRL-IbwK.js
/**
* Aggregated snapshot for the production dashboard.
* One round-trip — used to compute Placement Readiness Score on the client.
*/
var getDashboardSummary_createServerFn_handler = createServerRpc({
	id: "28aa4566b749882446c5a87c8cda74ed6b85fd544aa67cdf3d0d14ad32634d59",
	name: "getDashboardSummary",
	filename: "src/lib/dashboard.functions.ts"
}, (opts) => getDashboardSummary.__executeServer(opts));
var getDashboardSummary = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getDashboardSummary_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	const [{ data: latestResume }, { data: interviews }, { data: progress }, { data: tasks }, { data: streak }] = await Promise.all([
		supabase.from("resume_analyses").select("ats_score, summary, suggestions, missing_keywords, missing_skills, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
		supabase.from("interviews").select("overall_score, communication_score, technical_score, confidence_score, problem_solving_score, interview_type, created_at").eq("user_id", userId).eq("status", "completed").order("created_at", { ascending: false }).limit(10),
		supabase.from("user_problem_progress").select("status").eq("user_id", userId),
		supabase.from("study_tasks").select("status").eq("user_id", userId),
		supabase.from("streaks").select("current_streak,best_streak,total_activity_days").eq("user_id", userId).maybeSingle()
	]);
	const solved = (progress ?? []).filter((p) => p.status === "solved").length;
	const avg = (arr) => {
		const xs = arr.filter((x) => typeof x === "number");
		return xs.length ? Math.round(xs.reduce((s, n) => s + n, 0) / xs.length) : null;
	};
	const totalTasks = (tasks ?? []).length;
	const doneTasks = (tasks ?? []).filter((t) => t.status === "done").length;
	const planPct = totalTasks > 0 ? Math.round(doneTasks / totalTasks * 100) : 0;
	return {
		resume: latestResume ? {
			ats_score: latestResume.ats_score,
			summary: latestResume.summary,
			suggestions: latestResume.suggestions ?? [],
			missing_keywords: latestResume.missing_keywords ?? [],
			missing_skills: latestResume.missing_skills ?? []
		} : null,
		interviews: {
			count: (interviews ?? []).length,
			avgOverall: avg((interviews ?? []).map((i) => i.overall_score)),
			avgCommunication: avg((interviews ?? []).map((i) => i.communication_score)),
			avgTechnical: avg((interviews ?? []).map((i) => i.technical_score)),
			avgConfidence: avg((interviews ?? []).map((i) => i.confidence_score)),
			avgProblemSolving: avg((interviews ?? []).map((i) => i.problem_solving_score))
		},
		problems: { solved },
		plan: {
			totalTasks,
			doneTasks,
			planPct
		},
		streak: {
			current: streak?.current_streak ?? 0,
			best: streak?.best_streak ?? 0,
			totalDays: streak?.total_activity_days ?? 0
		}
	};
});
//#endregion
export { getDashboardSummary_createServerFn_handler };
