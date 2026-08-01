import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const profileSchema = z.object({
  full_name: z.string().trim().max(120).nullable().optional(),
  college: z.string().trim().max(160).nullable().optional(),
  degree: z.string().trim().max(80).nullable().optional(),
  branch: z.string().trim().max(80).nullable().optional(),
  graduation_year: z.number().int().min(1990).max(2100).nullable().optional(),
  skills: z.array(z.string().trim().max(40)).max(60).optional(),
  github: z.string().trim().max(200).nullable().optional(),
  linkedin: z.string().trim().max(200).nullable().optional(),
  portfolio: z.string().trim().max(200).nullable().optional(),
  target_roles: z.array(z.string().trim().max(60)).max(20).optional(),
  preferred_companies: z.array(z.string().trim().max(60)).max(30).optional(),
});

export const getProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("*")
      .eq("id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

export const upsertProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => profileSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { error, data: row } = await context.supabase
      .from("profiles")
      .update(data)
      .eq("id", context.userId)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });
