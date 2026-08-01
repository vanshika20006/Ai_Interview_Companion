import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateObject, generateText } from "ai";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createAiProvider } from "./ai-provider.server";
import { recordActivity } from "./activity.server";

const analysisSchema = z.object({
  ats_score: z
    .number()
    .min(0)
    .max(100)
    .transform((n) => Math.round(n)),
  summary: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  missing_keywords: z.array(z.string()),
  missing_skills: z.array(z.string()),
  role_match: z.array(
    z.object({
      role: z.string(),
      match_percent: z
        .number()
        .min(0)
        .max(100)
        .transform((n) => Math.round(n)),
    }),
  ),
  suggestions: z.array(z.string()),
  recommended_topics: z.array(z.string()),
});

const MODEL_ID = "google/gemini-2.5-flash";

export const analyzeResume = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        file_name: z.string().min(1).max(200),
        raw_text: z.string().min(50).max(50000),
        target_roles: z.array(z.string()).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const apiKey = process.env.GEMINI_API_KEY || process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI provider not configured");

    // Persist resume
    const { data: resumeRow, error: resumeErr } = await context.supabase
      .from("resumes")
      .insert({
        user_id: context.userId,
        file_name: data.file_name,
        raw_text: data.raw_text,
      })
      .select()
      .single();
    if (resumeErr) throw new Error(resumeErr.message);

    const provider = createAiProvider(apiKey);
    const model = provider(MODEL_ID);

    const targetRolesText = data.target_roles?.length
      ? `Target roles: ${data.target_roles.join(", ")}.`
      : "Target roles: Software Engineer, Full Stack Developer.";

    const systemPrompt = `You are an expert technical recruiter and ATS (Applicant Tracking System) analyzer for campus placements in India and globally. Analyze the given resume rigorously. Give honest, actionable feedback. ${targetRolesText}

Scoring rubric:
- ats_score (0-100 integer): formatting, keyword density, action verbs, quantified impact, role match.
- strengths/weaknesses: 3-6 concise bullet points each.
- missing_keywords: ATS keywords for the target roles that are absent.
- missing_skills: technical skills the candidate should add.
- role_match: 3-5 roles with integer match percentage 0-100.
- suggestions: 4-8 specific, actionable rewrites.
- recommended_topics: LeetCode topics to prioritize (e.g. Arrays, Dynamic Programming, Graphs).`;

    const sanitizedText = data.raw_text.replace(/\\/g, "\\\\");
    const userPrompt = `Resume content:\n\n${sanitizedText.slice(0, 18000)}`;

    let analysis: z.infer<typeof analysisSchema> | undefined;
    try {
      const result = await generateObject({
        model,
        schema: analysisSchema,
        system: systemPrompt,
        prompt: userPrompt,
      });
      analysis = result.object;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("429"))
        throw new Error("AI rate limit reached. Please try again in a moment.");
      if (msg.includes("402"))
        throw new Error("AI credits exhausted. Add credits in Workspace settings.");
      // Fallback: ask for JSON text and parse manually
      try {
        const txt = await generateText({
          model,
          system:
            systemPrompt +
            "\n\nRespond with ONLY a valid JSON object matching this TypeScript type, no markdown, no commentary:\n{ ats_score:number; summary:string; strengths:string[]; weaknesses:string[]; missing_keywords:string[]; missing_skills:string[]; role_match:{role:string;match_percent:number}[]; suggestions:string[]; recommended_topics:string[] }",
          prompt: userPrompt,
        });
        const raw = txt.text
          .trim()
          .replace(/^```(?:json)?/i, "")
          .replace(/```$/, "")
          .trim();
        const start = raw.indexOf("{");
        const end = raw.lastIndexOf("}");
        const json = start >= 0 && end > start ? raw.slice(start, end + 1) : raw;
        analysis = analysisSchema.parse(JSON.parse(json));
      } catch (err2) {
        const msg2 = err2 instanceof Error ? err2.message : String(err2);
        throw new Error(`AI analysis failed: ${msg2}`);
      }
    }

    const { data: analysisRow, error: analysisErr } = await context.supabase
      .from("resume_analyses")
      .insert({
        user_id: context.userId,
        resume_id: resumeRow.id,
        ats_score: analysis.ats_score,
        summary: analysis.summary,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        missing_keywords: analysis.missing_keywords,
        missing_skills: analysis.missing_skills,
        role_match: analysis.role_match,
        suggestions: analysis.suggestions,
        recommended_topics: analysis.recommended_topics,
        model: MODEL_ID,
      })
      .select()
      .single();
    if (analysisErr) throw new Error(analysisErr.message);
    await recordActivity(context.supabase, context.userId);
    return analysisRow;
  });

export const getLatestAnalysis = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("resume_analyses")
      .select("*, resumes(file_name)")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

export const getAnalysisHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("resume_analyses")
      .select("id, ats_score, created_at, model")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(10);
    if (error) throw new Error(error.message);
    return data ?? [];
  });
