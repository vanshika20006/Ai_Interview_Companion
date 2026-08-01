import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createAiProvider } from "@/lib/ai-provider.server";

export const getWeeklyDigest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const supabase = context.supabase;

    const [problems, interviews, resumes, streak] = await Promise.all([
      supabase.from("user_problem_progress").select("status,updated_at").gte("updated_at", since),
      supabase
        .from("interviews")
        .select("overall_score,status,created_at")
        .gte("created_at", since),
      supabase.from("resume_analyses").select("ats_score,created_at").gte("created_at", since),
      supabase.from("streaks").select("current_streak,best_streak").maybeSingle(),
    ]);

    const solved = (problems.data ?? []).filter((p) => p.status === "solved").length;
    const interviewsDone = (interviews.data ?? []).filter((i) => i.status === "completed").length;
    const avgInterview = interviewsDone
      ? Math.round(
          (interviews.data ?? [])
            .filter((i) => i.status === "completed" && i.overall_score != null)
            .reduce((s, i) => s + (i.overall_score ?? 0), 0) / interviewsDone,
        )
      : 0;
    const bestAts = Math.max(0, ...(resumes.data ?? []).map((r) => r.ats_score ?? 0));
    const stats = {
      solved,
      interviewsDone,
      avgInterview,
      bestAts,
      currentStreak: streak.data?.current_streak ?? 0,
      bestStreak: streak.data?.best_streak ?? 0,
    };

    const key = process.env.GEMINI_API_KEY || process.env.LOVABLE_API_KEY;
    let summary = `This week: ${solved} problems solved, ${interviewsDone} interviews (avg ${avgInterview}/100). Streak: ${stats.currentStreak} days.`;
    if (key) {
      try {
        const provider = createAiProvider(key);
        const model = provider("google/gemini-2.5-flash");
        const { text } = await generateText({
          model,
          system:
            "You write short, motivating weekly progress digests (4-6 sentences, second person). Highlight wins, one focus area, and an encouraging next step. Use markdown bullets when helpful.",
          prompt: `Stats:\n- Problems solved: ${solved}\n- Interviews completed: ${interviewsDone}, avg score ${avgInterview}/100\n- Best ATS resume score: ${bestAts}\n- Current streak: ${stats.currentStreak} days (best ${stats.bestStreak})\n\nWrite the digest.`,
        });
        summary = text.trim();
      } catch {
        /* keep fallback */
      }
    }
    return { stats, summary, periodStart: since };
  });
