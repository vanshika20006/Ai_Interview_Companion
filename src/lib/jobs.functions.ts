import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateText } from "ai";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createAiProvider } from "./ai-provider.server";

const EMPLOYMENT_TYPES = ["Internship", "Full Time", "Fresher", "Contract"] as const;
type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

type GeneratedJob = {
  title: string;
  company: string;
  location: string;
  employment_type: EmploymentType;
  match_pct: number;
  description: string;
  matched_skills: string[];
  missing_skills: string[];
  tags: string[];
  recommended_prep: string[];
  apply_url: string;
};

function extractJson(text: string): unknown {
  let s = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start !== -1 && end > start) s = s.slice(start, end + 1);
  return JSON.parse(s);
}

function normalizeJobs(raw: unknown): GeneratedJob[] {
  const obj = raw as { jobs?: unknown };
  const arr = Array.isArray(obj?.jobs) ? obj.jobs : [];
  return arr
    .map((j) => {
      const o = j as Record<string, unknown>;
      const t = String(o.employment_type ?? "Full Time");
      const employment_type = (EMPLOYMENT_TYPES.find((e) => e.toLowerCase() === t.toLowerCase()) ??
        "Full Time") as EmploymentType;
      return {
        title: String(o.title ?? "").trim(),
        company: String(o.company ?? "").trim(),
        location: String(o.location ?? "Remote"),
        employment_type,
        match_pct: Math.max(0, Math.min(100, Math.round(Number(o.match_pct) || 0))),
        description: String(o.description ?? ""),
        matched_skills: Array.isArray(o.matched_skills) ? o.matched_skills.map(String) : [],
        missing_skills: Array.isArray(o.missing_skills) ? o.missing_skills.map(String) : [],
        tags: Array.isArray(o.tags) ? o.tags.map(String) : [],
        recommended_prep: Array.isArray(o.recommended_prep) ? o.recommended_prep.map(String) : [],
        apply_url: String(o.apply_url ?? "https://www.linkedin.com/jobs/"),
      };
    })
    .filter((j) => j.title && j.company);
}

export const generateJobRecommendations = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const apiKey = process.env.GEMINI_API_KEY || process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI provider not configured");

    const [{ data: profile }, { data: analysis }, { count: solvedCount }] = await Promise.all([
      context.supabase.from("profiles").select("*").eq("id", context.userId).maybeSingle(),
      context.supabase
        .from("resume_analyses")
        .select("missing_skills,role_match,recommended_topics")
        .eq("user_id", context.userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      context.supabase
        .from("user_problem_progress")
        .select("id", { count: "exact", head: true })
        .eq("user_id", context.userId)
        .eq("status", "solved"),
    ]);

    const ctx = {
      skills: profile?.skills ?? [],
      targetRoles: profile?.target_roles ?? [],
      preferredCompanies: profile?.preferred_companies ?? [],
      branch: profile?.branch,
      graduationYear: profile?.graduation_year,
      problemsSolved: solvedCount ?? 0,
      missingSkills: (analysis?.missing_skills as string[] | undefined) ?? [],
    };

    const model = createAiProvider(apiKey)("google/gemini-2.5-flash");
    let jobs: GeneratedJob[];
    try {
      const { text } = await generateText({
        model,
        system: `You are a placement advisor. Return ONLY valid JSON (no markdown, no commentary) of shape:
{"jobs":[{"title":string,"company":string,"location":string,"employment_type":"Internship"|"Full Time"|"Fresher"|"Contract","match_pct":number(0-100),"description":string,"matched_skills":string[],"missing_skills":string[],"tags":string[],"recommended_prep":string[],"apply_url":string}]}

Generate 6-10 realistic job recommendations matched to the candidate. Use real well-known companies (Google, Microsoft, Amazon, Razorpay, Zoho, Flipkart, Swiggy, Atlassian, Stripe, etc.). Calculate match_pct honestly based on skills overlap. apply_url should be a realistic careers URL (e.g. https://careers.google.com).`,
        prompt: `Candidate context:\n${JSON.stringify(ctx, null, 2)}\n\nGenerate diverse job recommendations spanning internship/full-time/fresher roles. Respond with JSON only.`,
      });
      jobs = normalizeJobs(extractJson(text));
      if (jobs.length === 0) throw new Error("No jobs generated");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("429")) throw new Error("AI rate limit reached.");
      if (msg.includes("402")) throw new Error("AI credits exhausted.");
      throw new Error(`Job recommendation failed: ${msg}`);
    }

    // Replace previous unsaved recommendations
    await context.supabase
      .from("saved_jobs")
      .delete()
      .eq("user_id", context.userId)
      .eq("saved", false);

    const rows = jobs.map((j) => ({
      user_id: context.userId,
      ...j,
      source: { generated_at: new Date().toISOString() },
    }));
    const { error } = await context.supabase.from("saved_jobs").insert(rows);
    if (error) throw new Error(error.message);
    return { count: rows.length };
  });

export const listJobs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("saved_jobs")
      .select("*")
      .eq("user_id", context.userId)
      .order("match_pct", { ascending: false });
    return data ?? [];
  });

export const toggleSaveJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z.object({ id: z.string().uuid(), saved: z.boolean() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("saved_jobs")
      .update({ saved: data.saved })
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
