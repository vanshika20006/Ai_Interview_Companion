import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { dt as enumType, pt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gamification.functions-a2Ttp9DJ.js
var getMyAchievements_createServerFn_handler = createServerRpc({
	id: "5b767a28baaf1456a0753d0d6bb7de67bb602f1a10814fcb35de17e0049bee69",
	name: "getMyAchievements",
	filename: "src/lib/gamification.functions.ts"
}, (opts) => getMyAchievements.__executeServer(opts));
var getMyAchievements = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getMyAchievements_createServerFn_handler, async ({ context }) => {
	const { data: catalog } = await context.supabase.from("achievements").select("*").order("sort_order");
	const { data: earned } = await context.supabase.from("user_achievements").select("*").eq("user_id", context.userId);
	const earnedMap = new Map((earned ?? []).map((e) => [e.achievement_code, e.earned_at]));
	return (catalog ?? []).map((a) => ({
		...a,
		earned_at: earnedMap.get(a.code) ?? null
	}));
});
var getMyStreak_createServerFn_handler = createServerRpc({
	id: "6684dff4829cf309ebdf2e92f9054cf20165b8321c5209b082924b1a852b0a2e",
	name: "getMyStreak",
	filename: "src/lib/gamification.functions.ts"
}, (opts) => getMyStreak.__executeServer(opts));
var getMyStreak = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getMyStreak_createServerFn_handler, async ({ context }) => {
	const { data } = await context.supabase.from("streaks").select("*").eq("user_id", context.userId).maybeSingle();
	return data ?? {
		current_streak: 0,
		best_streak: 0,
		total_activity_days: 0,
		last_active_date: null
	};
});
var getLeaderboard_createServerFn_handler = createServerRpc({
	id: "4748fe7d33b1f01a10237d9299052d06151693f30021fa6b4aa2b2ce4f6e4247",
	name: "getLeaderboard",
	filename: "src/lib/gamification.functions.ts"
}, (opts) => getLeaderboard.__executeServer(opts));
var getLeaderboard = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	scope: enumType([
		"weekly",
		"monthly",
		"all_time"
	]).default("weekly"),
	metric: enumType([
		"problems",
		"interview",
		"activity"
	]).default("problems")
}).parse(input ?? {})).handler(getLeaderboard_createServerFn_handler, async ({ data, context }) => {
	const { data: rows, error } = await context.supabase.rpc("get_leaderboard", {
		_scope: data.scope,
		_metric: data.metric
	});
	if (error) throw new Error(error.message);
	const scores = new Map((rows ?? []).map((r) => [r.user_id, Number(r.score) || 0]));
	const label = data.metric === "problems" ? "problems solved" : data.metric === "interview" ? "best interview score" : "day streak";
	return await hydrate(context.supabase, scores, label);
});
async function hydrate(supabase, scores, label) {
	const sorted = Array.from(scores.entries()).sort((a, b) => b[1] - a[1]).slice(0, 25);
	const ids = sorted.map((s) => s[0]);
	if (!ids.length) return {
		label,
		entries: []
	};
	const { data: names } = await supabase.rpc("get_display_names", { _ids: ids });
	const nameMap = new Map((names ?? []).map((n) => [n.user_id, n]));
	return {
		label,
		entries: sorted.map(([uid, score]) => {
			const n = nameMap.get(uid);
			return {
				user_id: uid,
				full_name: n?.display_name ?? "Anonymous",
				username: n?.username ?? null,
				score
			};
		})
	};
}
//#endregion
export { getLeaderboard_createServerFn_handler, getMyAchievements_createServerFn_handler, getMyStreak_createServerFn_handler };
