import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const bootstrapMyRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("bootstrap_my_role");
    if (error) throw new Error(error.message);
    return (data ?? "none") as "admin" | "recruiter" | "none" | "unauthenticated";
  });

const ROLES = ["admin", "moderator", "recruiter"] as const;

export const amIAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return !!data;
  });

export const adminCanClaim = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("admin_can_claim");
    if (error) throw new Error(error.message);
    return !!data;
  });

export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { error } = await context.supabase.rpc("claim_first_admin");
    if (error) throw new Error(error.message);
    return true;
  });

export const adminListUsers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({ search: z.string().optional(), limit: z.number().int().min(1).max(200).optional() })
      .parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase.rpc("admin_list_users", {
      _search: data.search?.trim() ? data.search.trim() : undefined,
      _limit: data.limit ?? 50,
    });
    if (error) throw new Error(error.message);
    return (rows ?? []) as Array<{
      user_id: string;
      email: string | null;
      full_name: string | null;
      roles: string[];
    }>;
  });

export const adminSetRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        userId: z.string().uuid(),
        role: z.enum(ROLES),
        grant: z.boolean(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.rpc("admin_set_role", {
      _target: data.userId,
      _role: data.role,
      _grant: data.grant,
    });
    if (error) throw new Error(error.message);
    return true;
  });

export type AdminAnalytics = {
  totals: Record<string, number>;
  roles: Record<string, number>;
  signups: Array<{ day: string; count: number }>;
  recent_users: Array<{
    user_id: string;
    email: string | null;
    full_name: string | null;
    created_at: string;
  }>;
  content: {
    top_posts: Array<{ id: string; title: string; like_count: number; comment_count: number }>;
    recent_interviews: Array<{
      id: string;
      role: string | null;
      overall_score: number | null;
      created_at: string;
    }>;
  };
};

export const adminAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("admin_analytics");
    if (error) throw new Error(error.message);
    return (data ?? {}) as unknown as AdminAnalytics;
  });
