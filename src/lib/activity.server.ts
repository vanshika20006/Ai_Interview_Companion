import type { SupabaseClient } from "@supabase/supabase-js";

type DB = SupabaseClient;

/** Update streak and check for new achievements. Safe to call multiple times per day. */
export async function recordActivity(supabase: DB, userId: string): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const { data: cur } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!cur) {
    await supabase.from("streaks").insert({
      user_id: userId,
      current_streak: 1,
      best_streak: 1,
      last_active_date: today,
      total_activity_days: 1,
    });
  } else if (cur.last_active_date !== today) {
    const last = cur.last_active_date ? new Date(cur.last_active_date) : null;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isConsecutive =
      last && last.toISOString().slice(0, 10) === yesterday.toISOString().slice(0, 10);
    const nextCurrent = isConsecutive ? cur.current_streak + 1 : 1;
    await supabase
      .from("streaks")
      .update({
        current_streak: nextCurrent,
        best_streak: Math.max(cur.best_streak, nextCurrent),
        last_active_date: today,
        total_activity_days: cur.total_activity_days + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);
  }

  await checkAchievements(supabase);
}

/**
 * Server-side achievement check. The `award_achievement` SECURITY DEFINER fn
 * re-validates eligibility against the database, so users cannot self-grant.
 */
export async function checkAchievements(supabase: DB): Promise<void> {
  const codes = [
    "first_resume",
    "ats_score_90",
    "first_interview",
    "interview_score_80",
    "problems_50",
    "problems_100",
    "streak_7",
    "streak_30",
  ];
  await Promise.allSettled(codes.map((code) => supabase.rpc("award_achievement", { _code: code })));
}
