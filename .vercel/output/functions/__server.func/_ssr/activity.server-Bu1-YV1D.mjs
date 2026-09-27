//#region node_modules/.nitro/vite/services/ssr/assets/activity.server-Bu1-YV1D.js
/** Update streak and check for new achievements. Safe to call multiple times per day. */
async function recordActivity(supabase, userId) {
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const { data: cur } = await supabase.from("streaks").select("*").eq("user_id", userId).maybeSingle();
	if (!cur) await supabase.from("streaks").insert({
		user_id: userId,
		current_streak: 1,
		best_streak: 1,
		last_active_date: today,
		total_activity_days: 1
	});
	else if (cur.last_active_date !== today) {
		const last = cur.last_active_date ? new Date(cur.last_active_date) : null;
		const yesterday = /* @__PURE__ */ new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		const nextCurrent = last && last.toISOString().slice(0, 10) === yesterday.toISOString().slice(0, 10) ? cur.current_streak + 1 : 1;
		await supabase.from("streaks").update({
			current_streak: nextCurrent,
			best_streak: Math.max(cur.best_streak, nextCurrent),
			last_active_date: today,
			total_activity_days: cur.total_activity_days + 1,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("user_id", userId);
	}
	await checkAchievements(supabase);
}
/**
* Server-side achievement check. The `award_achievement` SECURITY DEFINER fn
* re-validates eligibility against the database, so users cannot self-grant.
*/
async function checkAchievements(supabase) {
	await Promise.allSettled([
		"first_resume",
		"ats_score_90",
		"first_interview",
		"interview_score_80",
		"problems_50",
		"problems_100",
		"streak_7",
		"streak_30"
	].map((code) => supabase.rpc("award_achievement", { _code: code })));
}
//#endregion
export { recordActivity as t };
