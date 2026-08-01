import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const usernameRegex = /^[a-z0-9_-]{3,32}$/;

export const getMyPublicProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("public_profiles")
      .select("*")
      .eq("user_id", context.userId)
      .maybeSingle();
    return data;
  });

export const upsertPublicProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        username: z.string().regex(usernameRegex, "lowercase letters, numbers, _ or -, 3-32 chars"),
        headline: z.string().max(120).nullable().optional(),
        bio: z.string().max(2000).nullable().optional(),
        is_public: z.boolean(),
        show_email: z.boolean(),
        show_resume_score: z.boolean(),
        show_problems: z.boolean(),
        show_interview: z.boolean(),
        show_badges: z.boolean(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("public_profiles")
      .upsert(
        { user_id: context.userId, ...data, updated_at: new Date().toISOString() },
        { onConflict: "user_id" },
      )
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const getPublicProfileByUsername = createServerFn({ method: "GET" })
  .validator((input: unknown) => z.object({ username: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const { data: pp } = await supabase
      .from("public_profiles")
      .select("*")
      .eq("username", data.username)
      .eq("is_public", true)
      .maybeSingle();
    if (!pp) return null;

    const userId = pp.user_id;
    const [
      { data: profile },
      { data: bestInterview },
      { count: solved },
      { data: bestAts },
      { data: badges },
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select(
          "full_name,email,college,degree,branch,graduation_year,skills,github,linkedin,portfolio",
        )
        .eq("id", userId)
        .maybeSingle(),
      supabase
        .from("interviews")
        .select("overall_score")
        .eq("user_id", userId)
        .eq("status", "completed")
        .order("overall_score", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("user_problem_progress")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "solved"),
      supabase
        .from("resume_analyses")
        .select("ats_score")
        .eq("user_id", userId)
        .order("ats_score", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("user_achievements")
        .select("achievement_code, earned_at, achievements(*)")
        .eq("user_id", userId),
    ]);

    return {
      pp,
      profile: profile ?? null,
      stats: {
        problems_solved: solved ?? 0,
        best_interview: pp.show_interview ? (bestInterview?.overall_score ?? null) : null,
        best_ats: pp.show_resume_score ? (bestAts?.ats_score ?? null) : null,
      },
      badges: pp.show_badges ? (badges ?? []) : [],
    };
  });
