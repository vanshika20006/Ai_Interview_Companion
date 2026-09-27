import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics.functions-Cyy7r_Ep.js
var getAnalytics_createServerFn_handler = createServerRpc({
	id: "c491f292fda3d5d830370f062a74d0bc23cfc38facc1346ab53630f9411951c8",
	name: "getAnalytics",
	filename: "src/lib/analytics.functions.ts"
}, (opts) => getAnalytics.__executeServer(opts));
var getAnalytics = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getAnalytics_createServerFn_handler, async ({ context }) => {
	const [{ data: resumeTrend }, { data: problems }, { data: interviews }, { data: streak }] = await Promise.all([
		context.supabase.from("resume_analyses").select("created_at, ats_score").eq("user_id", context.userId).order("created_at"),
		context.supabase.from("user_problem_progress").select("problem_slug, status, solved_at").eq("user_id", context.userId),
		context.supabase.from("interviews").select("created_at, overall_score, interview_type, communication_score, technical_score, confidence_score, problem_solving_score").eq("user_id", context.userId).eq("status", "completed").order("created_at"),
		context.supabase.from("streaks").select("*").eq("user_id", context.userId).maybeSingle()
	]);
	const days = [];
	const map = /* @__PURE__ */ new Map();
	for (let i = 27; i >= 0; i--) {
		const d = /* @__PURE__ */ new Date();
		d.setDate(d.getDate() - i);
		const k = d.toISOString().slice(0, 10);
		map.set(k, {
			solved: 0,
			interviews: 0
		});
		days.push({
			date: k,
			solved: 0,
			interviews: 0
		});
	}
	for (const p of problems ?? []) if (p.solved_at) {
		const k = p.solved_at.slice(0, 10);
		const v = map.get(k);
		if (v) v.solved += 1;
	}
	for (const i of interviews ?? []) {
		const k = i.created_at.slice(0, 10);
		const v = map.get(k);
		if (v) v.interviews += 1;
	}
	const productivity = days.map((d) => ({
		date: d.date,
		...map.get(d.date)
	}));
	const solvedSorted = (problems ?? []).filter((p) => p.solved_at).sort((a, b) => a.solved_at < b.solved_at ? -1 : 1);
	let cum = 0;
	const leetcodeTrend = solvedSorted.map((p) => ({
		date: p.solved_at.slice(0, 10),
		total: ++cum
	}));
	return {
		resumeTrend: (resumeTrend ?? []).map((r) => ({
			date: r.created_at.slice(0, 10),
			score: r.ats_score
		})),
		leetcodeTrend,
		interviewTrend: (interviews ?? []).map((i) => ({
			date: i.created_at.slice(0, 10),
			overall: i.overall_score ?? 0,
			communication: i.communication_score ?? 0,
			technical: i.technical_score ?? 0,
			confidence: i.confidence_score ?? 0,
			problem_solving: i.problem_solving_score ?? 0
		})),
		productivity,
		streak: streak ?? {
			current_streak: 0,
			best_streak: 0,
			total_activity_days: 0
		},
		totals: {
			solved: (problems ?? []).filter((p) => p.status === "solved").length,
			interviews: (interviews ?? []).length,
			avgInterview: interviews && interviews.length ? Math.round(interviews.reduce((s, i) => s + (i.overall_score ?? 0), 0) / interviews.length) : 0
		}
	};
});
//#endregion
export { getAnalytics_createServerFn_handler };
