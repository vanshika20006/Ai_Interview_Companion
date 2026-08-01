import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { recordActivity } from "./activity.server";

export const getProblemProgress = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_problem_progress")
      .select("*")
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const upsertSchema = z.object({
  problem_slug: z.string().min(1).max(120),
  status: z.enum(["not_started", "in_progress", "solved"]).optional(),
  revision_count: z.number().int().min(0).max(999).optional(),
  bookmarked: z.boolean().optional(),
  notes: z.string().max(5000).nullable().optional(),
});

export const upsertProblemProgress = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => upsertSchema.parse(input))
  .handler(async ({ data, context }) => {
    const payload = {
      user_id: context.userId,
      problem_slug: data.problem_slug,
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.status === "solved" ? { solved_at: new Date().toISOString() } : {}),
      ...(data.revision_count !== undefined ? { revision_count: data.revision_count } : {}),
      ...(data.bookmarked !== undefined ? { bookmarked: data.bookmarked } : {}),
      ...(data.notes !== undefined ? { notes: data.notes } : {}),
    };

    const { data: row, error } = await context.supabase
      .from("user_problem_progress")
      .upsert(payload, { onConflict: "user_id,problem_slug" })
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (data.status === "solved") await recordActivity(context.supabase, context.userId);
    return row;
  });
