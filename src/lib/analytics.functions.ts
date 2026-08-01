import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [{ data: resumeTrend }, { data: problems }, { data: interviews }, { data: streak }] =
      await Promise.all([
        context.supabase
          .from("resume_analyses")
          .select("created_at, ats_score")
          .eq("user_id", context.userId)
          .order("created_at"),
        context.supabase
          .from("user_problem_progress")
          .select("problem_slug, status, solved_at")
          .eq("user_id", context.userId),
        context.supabase
          .from("interviews")
          .select(
            "created_at, overall_score, interview_type, communication_score, technical_score, confidence_score, problem_solving_score",
          )
          .eq("user_id", context.userId)
          .eq("status", "completed")
          .order("created_at"),
        context.supabase.from("streaks").select("*").eq("user_id", context.userId).maybeSingle(),
      ]);

    // Weekly productivity: count solves per day for last 28 days
    const days: { date: string; solved: number; interviews: number }[] = [];
    const map = new Map<string, { solved: number; interviews: number }>();
    for (let i = 27; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = d.toISOString().slice(0, 10);
      map.set(k, { solved: 0, interviews: 0 });
      days.push({ date: k, solved: 0, interviews: 0 });
    }
    for (const p of problems ?? []) {
      if (p.solved_at) {
        const k = p.solved_at.slice(0, 10);
        const v = map.get(k);
        if (v) v.solved += 1;
      }
    }
    for (const i of interviews ?? []) {
      const k = i.created_at.slice(0, 10);
      const v = map.get(k);
      if (v) v.interviews += 1;
    }
    const productivity = days.map((d) => ({ date: d.date, ...map.get(d.date)! }));

    // LeetCode cumulative
    const solvedSorted = (problems ?? [])
      .filter((p) => p.solved_at)
      .sort((a, b) => (a.solved_at! < b.solved_at! ? -1 : 1));
    let cum = 0;
    const leetcodeTrend = solvedSorted.map((p) => ({
      date: p.solved_at!.slice(0, 10),
      total: ++cum,
    }));

    return {
      resumeTrend: (resumeTrend ?? []).map((r) => ({
        date: r.created_at.slice(0, 10),
        score: r.ats_score,
      })),
      leetcodeTrend,
      interviewTrend: (interviews ?? []).map((i) => ({
        date: i.created_at.slice(0, 10),
        overall: i.overall_score ?? 0,
        communication: i.communication_score ?? 0,
        technical: i.technical_score ?? 0,
        confidence: i.confidence_score ?? 0,
        problem_solving: i.problem_solving_score ?? 0,
      })),
      productivity,
      streak: streak ?? { current_streak: 0, best_streak: 0, total_activity_days: 0 },
      totals: {
        solved: (problems ?? []).filter((p) => p.status === "solved").length,
        interviews: (interviews ?? []).length,
        avgInterview:
          interviews && interviews.length
            ? Math.round(
                interviews.reduce((s, i) => s + (i.overall_score ?? 0), 0) / interviews.length,
              )
            : 0,
      },
    };
  });
