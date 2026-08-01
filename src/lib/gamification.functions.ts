import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getMyAchievements = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: catalog } = await context.supabase
      .from("achievements")
      .select("*")
      .order("sort_order");
    const { data: earned } = await context.supabase
      .from("user_achievements")
      .select("*")
      .eq("user_id", context.userId);
    const earnedMap = new Map((earned ?? []).map((e) => [e.achievement_code, e.earned_at]));
    return (catalog ?? []).map((a) => ({ ...a, earned_at: earnedMap.get(a.code) ?? null }));
  });

export const getMyStreak = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("streaks")
      .select("*")
      .eq("user_id", context.userId)
      .maybeSingle();
    return (
      data ?? { current_streak: 0, best_streak: 0, total_activity_days: 0, last_active_date: null }
    );
  });

export const getLeaderboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        scope: z.enum(["weekly", "monthly", "all_time"]).default("weekly"),
        metric: z.enum(["problems", "interview", "activity"]).default("problems"),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    type Row = { user_id: string; score: number };
    const { data: rows, error } = await context.supabase.rpc("get_leaderboard", {
      _scope: data.scope,
      _metric: data.metric,
    });
    if (error) throw new Error(error.message);
    const scores = new Map<string, number>(
      ((rows ?? []) as Row[]).map((r) => [r.user_id, Number(r.score) || 0]),
    );
    const label =
      data.metric === "problems"
        ? "problems solved"
        : data.metric === "interview"
          ? "best interview score"
          : "day streak";
    return await hydrate(context.supabase, scores, label);
  });

async function hydrate(
  supabase: import("@supabase/supabase-js").SupabaseClient,
  scores: Map<string, number>,
  label: string,
) {
  const sorted = Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25);
  const ids = sorted.map((s) => s[0]);
  if (!ids.length)
    return {
      label,
      entries: [] as Array<{
        user_id: string;
        full_name: string | null;
        score: number;
        username: string | null;
      }>,
    };
  type DisplayName = { user_id: string; display_name: string | null; username: string | null };
  const { data: names } = await supabase.rpc("get_display_names", { _ids: ids });
  const nameMap = new Map<string, DisplayName>(
    ((names ?? []) as DisplayName[]).map((n) => [n.user_id, n]),
  );
  return {
    label,
    entries: sorted.map(([uid, score]) => {
      const n = nameMap.get(uid);
      return {
        user_id: uid,
        full_name: n?.display_name ?? "Anonymous",
        username: n?.username ?? null,
        score,
      };
    }),
  };
}
