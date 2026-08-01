import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const amIRecruiter = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "recruiter",
    });
    return !!data;
  });

export const searchStudents = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        skills: z.array(z.string()).optional(),
        search: z.string().optional(),
        minAts: z.number().int().min(0).max(100).optional(),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    const { data: isRecruiter } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "recruiter",
    });
    if (!isRecruiter) throw new Error("Recruiter role required");

    let pq = context.supabase
      .from("profiles")
      .select("id,full_name,college,degree,branch,graduation_year,skills")
      .limit(60);
    if (data.search) pq = pq.ilike("full_name", `%${data.search}%`);
    const { data: profiles } = await pq;

    const ids = (profiles ?? []).map((p) => p.id);
    if (!ids.length) return [];

    const [{ data: pps }, { data: scores }, { data: solved }] = await Promise.all([
      context.supabase
        .from("public_profiles")
        .select("user_id,username,headline")
        .in("user_id", ids),
      context.supabase.from("resume_analyses").select("user_id,ats_score").in("user_id", ids),
      context.supabase.from("user_problem_progress").select("user_id,status").in("user_id", ids),
    ]);

    const ppMap = new Map((pps ?? []).map((p) => [p.user_id, p]));
    const bestAts = new Map<string, number>();
    for (const s of scores ?? [])
      bestAts.set(s.user_id, Math.max(bestAts.get(s.user_id) ?? 0, s.ats_score));
    const solvedCount = new Map<string, number>();
    for (const s of solved ?? [])
      if (s.status === "solved") solvedCount.set(s.user_id, (solvedCount.get(s.user_id) ?? 0) + 1);

    let students = (profiles ?? []).map((prof) => {
      const pp = ppMap.get(prof.id);
      return {
        user_id: prof.id,
        username: pp?.username ?? null,
        headline: pp?.headline ?? null,
        full_name: prof.full_name ?? null,
        college: prof.college ?? null,
        degree: prof.degree ?? null,
        branch: prof.branch ?? null,
        graduation_year: prof.graduation_year ?? null,
        skills: prof.skills ?? [],
        ats: bestAts.get(prof.id) ?? 0,
        problems_solved: solvedCount.get(prof.id) ?? 0,
      };
    });

    if (data.skills?.length) {
      const wanted = data.skills.map((s) => s.toLowerCase());
      students = students.filter((s) =>
        wanted.some((w) => (s.skills ?? []).some((k: string) => k.toLowerCase().includes(w))),
      );
    }
    if (data.minAts) students = students.filter((s) => s.ats >= data.minAts!);
    return students;
  });

export const toggleShortlist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z.object({ student_user_id: z.string().uuid(), shortlisted: z.boolean() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    if (data.shortlisted) {
      await context.supabase
        .from("recruiter_shortlists")
        .delete()
        .eq("recruiter_id", context.userId)
        .eq("student_user_id", data.student_user_id);
    } else {
      await context.supabase
        .from("recruiter_shortlists")
        .insert({ recruiter_id: context.userId, student_user_id: data.student_user_id });
    }
    return { ok: true };
  });

export const listShortlist = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("recruiter_shortlists")
      .select("student_user_id, notes, status, updated_at")
      .eq("recruiter_id", context.userId);
    return (data ?? []) as Array<{
      student_user_id: string;
      notes: string | null;
      status: string;
      updated_at: string;
    }>;
  });

const SHORTLIST_STATUSES = ["new", "contacted", "interviewing", "offer", "rejected"] as const;

export const updateShortlistEntry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        student_user_id: z.string().uuid(),
        notes: z.string().max(2000).optional(),
        status: z.enum(SHORTLIST_STATUSES).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const patch: { notes?: string; status?: (typeof SHORTLIST_STATUSES)[number] } = {};
    if (data.notes !== undefined) patch.notes = data.notes;
    if (data.status !== undefined) patch.status = data.status;
    if (!Object.keys(patch).length) return { ok: true };
    const { error } = await context.supabase
      .from("recruiter_shortlists")
      .update(patch)
      .eq("recruiter_id", context.userId)
      .eq("student_user_id", data.student_user_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
