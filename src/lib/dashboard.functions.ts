import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Aggregated snapshot for the production dashboard.
 * One round-trip — used to compute Placement Readiness Score on the client.
 */
export const getDashboardSummary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const [
      { data: latestResume },
      { data: interviews },
      { data: progress },
      { data: tasks },
      { data: streak },
    ] = await Promise.all([
      supabase
        .from("resume_analyses")
        .select("ats_score, summary, suggestions, missing_keywords, missing_skills, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("interviews")
        .select(
          "overall_score, communication_score, technical_score, confidence_score, problem_solving_score, interview_type, created_at",
        )
        .eq("user_id", userId)
        .eq("status", "completed")
        .order("created_at", { ascending: false })
        .limit(10),
      supabase.from("user_problem_progress").select("status").eq("user_id", userId),
      supabase.from("study_tasks").select("status").eq("user_id", userId),
      supabase
        .from("streaks")
        .select("current_streak,best_streak,total_activity_days")
        .eq("user_id", userId)
        .maybeSingle(),
    ]);

    const solved = (progress ?? []).filter((p) => p.status === "solved").length;
    const avg = (arr: Array<number | null | undefined>) => {
      const xs = arr.filter((x): x is number => typeof x === "number");
      return xs.length ? Math.round(xs.reduce((s, n) => s + n, 0) / xs.length) : null;
    };

    const totalTasks = (tasks ?? []).length;
    const doneTasks = (tasks ?? []).filter((t) => t.status === "done").length;
    const planPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    return {
      resume: latestResume
        ? {
            ats_score: latestResume.ats_score,
            summary: latestResume.summary,
            suggestions: (latestResume.suggestions as string[]) ?? [],
            missing_keywords: (latestResume.missing_keywords as string[]) ?? [],
            missing_skills: (latestResume.missing_skills as string[]) ?? [],
          }
        : null,
      interviews: {
        count: (interviews ?? []).length,
        avgOverall: avg((interviews ?? []).map((i) => i.overall_score)),
        avgCommunication: avg((interviews ?? []).map((i) => i.communication_score)),
        avgTechnical: avg((interviews ?? []).map((i) => i.technical_score)),
        avgConfidence: avg((interviews ?? []).map((i) => i.confidence_score)),
        avgProblemSolving: avg((interviews ?? []).map((i) => i.problem_solving_score)),
      },
      problems: { solved },
      plan: { totalTasks, doneTasks, planPct },
      streak: {
        current: streak?.current_streak ?? 0,
        best: streak?.best_streak ?? 0,
        totalDays: streak?.total_activity_days ?? 0,
      },
    };
  });
