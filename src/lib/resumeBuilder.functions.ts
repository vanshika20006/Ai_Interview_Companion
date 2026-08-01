import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const linkSchema = z.object({ label: z.string().max(60), url: z.string().max(300) });

const dataSchema = z.object({
  personal: z
    .object({
      full_name: z.string().max(120).default(""),
      headline: z.string().max(160).default(""),
      email: z.string().max(160).default(""),
      phone: z.string().max(40).default(""),
      location: z.string().max(120).default(""),
      links: z.array(linkSchema).default([]),
      summary: z.string().max(2000).default(""),
    })
    .default({} as never),
  education: z
    .array(
      z.object({
        school: z.string().max(160).default(""),
        degree: z.string().max(160).default(""),
        field: z.string().max(160).default(""),
        start: z.string().max(40).default(""),
        end: z.string().max(40).default(""),
        score: z.string().max(60).default(""),
      }),
    )
    .default([]),
  experience: z
    .array(
      z.object({
        company: z.string().max(160).default(""),
        role: z.string().max(160).default(""),
        location: z.string().max(120).default(""),
        start: z.string().max(40).default(""),
        end: z.string().max(40).default(""),
        bullets: z.array(z.string().max(400)).default([]),
      }),
    )
    .default([]),
  projects: z
    .array(
      z.object({
        name: z.string().max(160).default(""),
        tech: z.string().max(240).default(""),
        link: z.string().max(300).default(""),
        bullets: z.array(z.string().max(400)).default([]),
      }),
    )
    .default([]),
  skills: z.array(z.string().max(60)).default([]),
  achievements: z.array(z.string().max(400)).default([]),
});

export type ResumeBuilderData = z.infer<typeof dataSchema>;

export const listBuilderResumes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("resume_builder_resumes")
      .select("id, title, template, updated_at")
      .eq("user_id", context.userId)
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getBuilderResume = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("resume_builder_resumes")
      .select("*")
      .eq("user_id", context.userId)
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const createBuilderResume = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) =>
    z
      .object({
        title: z.string().min(1).max(120).default("Untitled resume"),
        template: z.enum(["modern", "minimal", "compact"]).default("modern"),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    const empty = dataSchema.parse({});
    const { data: row, error } = await context.supabase
      .from("resume_builder_resumes")
      .insert({ user_id: context.userId, title: data.title, template: data.template, data: empty })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const updateBuilderResume = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        title: z.string().min(1).max(120).optional(),
        template: z.enum(["modern", "minimal", "compact"]).optional(),
        data: dataSchema.optional(),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    const update: {
      updated_at: string;
      title?: string;
      template?: string;
      data?: ResumeBuilderData;
    } = { updated_at: new Date().toISOString() };
    if (data.title !== undefined) update.title = data.title;
    if (data.template !== undefined) update.template = data.template;
    if (data.data !== undefined) update.data = data.data;
    const { data: row, error } = await context.supabase
      .from("resume_builder_resumes")
      .update(update)
      .eq("user_id", context.userId)
      .eq("id", data.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return row;
  });

export const deleteBuilderResume = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("resume_builder_resumes")
      .delete()
      .eq("user_id", context.userId)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
