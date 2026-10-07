import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateObject, generateText } from "ai";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createAiProvider } from "./ai-provider.server";
import { recordActivity } from "./activity.server";

const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "SDE",
  "Data Analyst",
] as const;
const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
const TYPES = ["Technical", "HR", "Behavioral", "System Design"] as const;

const score = z
  .number()
  .min(0)
  .max(100)
  .transform((n) => Math.round(n));

const feedbackSchema = z.object({
  communication_score: score,
  technical_score: score,
  confidence_score: score,
  problem_solving_score: score,
  overall_score: score,
  strengths: z.array(z.string()).max(8),
  weaknesses: z.array(z.string()).max(8),
  better_answer: z.string(),
  suggestions: z.array(z.string()).max(8),
});

function gateway() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");
  return createAiProvider(apiKey)("google/gemini-2.5-flash");
}

function getFallbackQuestions(role: string, type: string, count: number, difficulty: string) {
  const pool: Record<string, Array<{ question: string; expected_topics: string[] }>> = {
    "Frontend Developer": [
      { question: "Explain Event Delegation in JavaScript and how it improves DOM performance.", expected_topics: ["DOM", "Event Bubbling", "Performance"] },
      { question: "How does the React virtual DOM diffing algorithm work and why is key prop important?", expected_topics: ["Virtual DOM", "React", "Reconciliation"] },
      { question: "Explain CSS Flexbox vs Grid and layout responsiveness strategies.", expected_topics: ["CSS", "Flexbox", "Grid", "Responsive Design"] },
      { question: "How do you optimize Core Web Vitals (LCP, FID/INP, CLS) in a modern web application?", expected_topics: ["Web Vitals", "Performance Optimization", "Caching"] },
      { question: "Explain the difference between Client-Side Rendering (CSR), Server-Side Rendering (SSR), and Static Site Generation (SSG).", expected_topics: ["SSR", "CSR", "SSG", "Next.js/TanStack"] },
    ],
    "Backend Developer": [
      { question: "Explain SQL vs NoSQL databases and how to choose the right database for a service.", expected_topics: ["SQL", "NoSQL", "Database Design"] },
      { question: "How does JWT (JSON Web Token) authentication work and how do you handle token revocation?", expected_topics: ["JWT", "Authentication", "Security"] },
      { question: "Explain Database Indexing, B-Trees, and how indexing improves query performance.", expected_topics: ["Indexing", "SQL", "Database Tuning"] },
      { question: "What is Connection Pooling in backend servers and why is it essential?", expected_topics: ["Connection Pool", "Performance", "Concurrency"] },
      { question: "How do you design RESTful APIs vs GraphQL APIs for scalable microservices?", expected_topics: ["REST", "GraphQL", "API Architecture"] },
    ],
    "Full Stack Developer": [
      { question: "Walk through the full lifecycle of a web request from browser URL bar to database and back.", expected_topics: ["HTTP/HTTPS", "DNS", "Web Server", "Database"] },
      { question: "How do you handle authentication, session state, and security (CORS, XSS, CSRF) in a full-stack app?", expected_topics: ["Security", "CORS", "CSRF", "Auth"] },
      { question: "How do you design database schemas and manage async background tasks/queues?", expected_topics: ["Schema Design", "Message Queues", "Background Processing"] },
      { question: "Explain state management strategies in modern frontend applications paired with backend APIs.", expected_topics: ["State Management", "API Cache", "TanStack Query/Redux"] },
      { question: "How do you deploy and monitor a full-stack production application for high availability?", expected_topics: ["CI/CD", "Monitoring", "Vercel/Docker", "Cloud"] },
    ],
    "Behavioral": [
      { question: "Tell me about a challenging technical bug or problem you solved and your step-by-step approach.", expected_topics: ["Problem Solving", "Debugging", "Communication"] },
      { question: "Describe a situation where you had a conflict or disagreement with a team member or requirement. How did you resolve it?", expected_topics: ["Conflict Resolution", "Teamwork", "Empathy"] },
      { question: "Tell me about a project you worked on that failed or faced major setbacks. What did you learn?", expected_topics: ["Resilience", "Learning", "Project Management"] },
      { question: "How do you prioritize your work when facing tight deadlines and multiple competing requirements?", expected_topics: ["Time Management", "Prioritization"] },
      { question: "Describe a time when you had to learn a new technology or framework quickly for a project.", expected_topics: ["Adaptability", "Learning Curve"] },
    ],
  };

  const selected = pool[role] || pool[type] || pool["Full Stack Developer"];
  return selected.slice(0, count).map((q) => ({
    ...q,
    difficulty,
  }));
}

function mapAiError(err: unknown): Error {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes("429")) return new Error("AI rate limit reached. Please retry shortly.");
  if (msg.includes("402"))
    return new Error("AI credits exhausted. Add credits in Workspace settings.");
  return new Error(`AI request failed: ${msg}`);
}

export const startInterview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        role: z.enum(ROLES),
        difficulty: z.enum(DIFFICULTIES),
        interview_type: z.enum(TYPES),
        total_questions: z.number().int().min(3).max(8).default(5),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: profile } = await context.supabase
      .from("profiles")
      .select("skills,target_roles,branch,degree")
      .eq("id", context.userId)
      .maybeSingle();

    const profileCtx = profile
      ? `Candidate skills: ${(profile.skills ?? []).join(", ") || "n/a"}. Background: ${profile.degree ?? ""} ${profile.branch ?? ""}.`
      : "";
    const sanitizedProfileCtx = profileCtx.replace(/\\/g, "\\\\");

    let questions: Array<{ question: string; expected_topics: string[]; difficulty: string }> = [];
    try {
      const { text } = await generateText({
        model: gateway(),
        system: `You are a senior interviewer conducting a ${data.difficulty} ${data.interview_type} interview for a ${data.role} role at a top tech company. ${sanitizedProfileCtx}

Return ONLY valid JSON (no markdown, no commentary) of the shape:
{"questions":[{"question":string,"expected_topics":string[],"difficulty":"Easy"|"Medium"|"Hard"}]}

Generate exactly ${data.total_questions} realistic, diverse interview questions. For each include 2-4 expected topics. Difficulty must match: Easy = fundamental, Medium = scenario-based, Hard = system/design or deep technical.`,
        prompt: `Generate ${data.total_questions} ${data.interview_type} interview questions for a ${data.role} role (${data.difficulty} difficulty). Respond with JSON only.`,
      });

      let cleaned = text
        .trim()
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();
      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}");
      if (start !== -1 && end > start) cleaned = cleaned.slice(start, end + 1);
      const parsed = JSON.parse(cleaned) as { questions?: unknown };
      const arr = Array.isArray(parsed.questions) ? parsed.questions : [];
      questions = arr
        .map((q) => {
          const o = q as Record<string, unknown>;
          return {
            question: String(o.question ?? "").trim(),
            expected_topics: Array.isArray(o.expected_topics) ? o.expected_topics.map(String) : [],
            difficulty: String(o.difficulty ?? data.difficulty),
          };
        })
        .filter((q) => q.question.length > 0);
    } catch (err) {
      console.warn("[startInterview] AI generation warning, using fallback questions:", err);
    }

    if (questions.length === 0) {
      questions = getFallbackQuestions(data.role, data.interview_type, data.total_questions, data.difficulty);
    }

    const { data: interview, error } = await context.supabase
      .from("interviews")
      .insert({
        user_id: context.userId,
        role: data.role,
        difficulty: data.difficulty,
        interview_type: data.interview_type,
        total_questions: questions.length,
        status: "in_progress",
      })
      .select()
      .single();
    if (error) throw new Error(error.message);

    const answerRows = questions.map((q, i) => {
      const normalized =
        DIFFICULTIES.find((d) => d.toLowerCase() === String(q.difficulty).toLowerCase()) ??
        data.difficulty;
      return {
        interview_id: interview.id,
        user_id: context.userId,
        q_index: i,
        question: q.question,
        expected_topics: q.expected_topics ?? [],
        difficulty: normalized,
        answer_text: "",
      };
    });
    const { error: ansErr } = await context.supabase.from("interview_answers").insert(answerRows);
    if (ansErr) throw new Error(ansErr.message);

    return interview;
  });

export const submitAnswer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({ answer_id: z.string().uuid(), answer_text: z.string().min(1).max(8000) })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: answer, error: ansErr } = await context.supabase
      .from("interview_answers")
      .select("*, interviews!inner(role, difficulty, interview_type)")
      .eq("id", data.answer_id)
      .eq("user_id", context.userId)
      .single();
    if (ansErr || !answer) throw new Error("Answer not found");

    await context.supabase
      .from("interview_answers")
      .update({ answer_text: data.answer_text })
      .eq("id", data.answer_id);

    const meta = answer.interviews as { role: string; difficulty: string; interview_type: string };

    let feedback;
    try {
      const sanitizedAns = data.answer_text.replace(/\\/g, "\\\\");
      const sanitizedQ = answer.question.replace(/\\/g, "\\\\");
      const result = await generateObject({
        model: gateway(),
        schema: feedbackSchema,
        system: `You are a strict but fair interviewer evaluating a candidate's answer in a ${meta.difficulty} ${meta.interview_type} interview for a ${meta.role} role. Be specific and constructive. Scores are 0-100. Be honest — average answers score 50-65, strong answers 70-85, exceptional 90+.`,
        prompt: `Question: ${sanitizedQ}
Expected topics: ${(answer.expected_topics ?? []).join(", ")}

Candidate's answer:
${sanitizedAns}

Evaluate the answer. Provide all four scores, an overall score (weighted average), 2-4 strengths, 2-4 weaknesses, a concrete "better_answer" example (~150 words), and 3-5 actionable suggestions.`,
      });
      feedback = result.object;
    } catch (err) {
      throw mapAiError(err);
    }

    const { data: fb, error: fbErr } = await context.supabase
      .from("interview_feedback")
      .insert({
        answer_id: data.answer_id,
        user_id: context.userId,
        ...feedback,
        strengths: feedback.strengths,
        weaknesses: feedback.weaknesses,
        suggestions: feedback.suggestions,
      })
      .select()
      .single();
    if (fbErr) throw new Error(fbErr.message);

    return fb;
  });

export const completeInterview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ interview_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: feedbacks } = await context.supabase
      .from("interview_feedback")
      .select("*, interview_answers!inner(interview_id)")
      .eq("user_id", context.userId)
      .eq("interview_answers.interview_id", data.interview_id);

    const avg = (key: keyof NonNullable<typeof feedbacks>[number]): number => {
      if (!feedbacks || feedbacks.length === 0) return 0;
      const sum = feedbacks.reduce((s, f) => s + (Number(f[key]) || 0), 0);
      return Math.round(sum / feedbacks.length);
    };

    const { data: updated, error } = await context.supabase
      .from("interviews")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        overall_score: avg("overall_score"),
        communication_score: avg("communication_score"),
        technical_score: avg("technical_score"),
        confidence_score: avg("confidence_score"),
        problem_solving_score: avg("problem_solving_score"),
      })
      .eq("id", data.interview_id)
      .eq("user_id", context.userId)
      .select()
      .single();
    if (error) throw new Error(error.message);

    await recordActivity(context.supabase, context.userId);
    return updated;
  });

export const getInterview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: interview, error } = await context.supabase
      .from("interviews")
      .select("*")
      .eq("id", data.id)
      .eq("user_id", context.userId)
      .single();
    if (error) throw new Error(error.message);

    const { data: answers } = await context.supabase
      .from("interview_answers")
      .select("*, interview_feedback(*)")
      .eq("interview_id", data.id)
      .order("q_index");

    return { interview, answers: answers ?? [] };
  });

export const listInterviews = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("interviews")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    return data ?? [];
  });

export const deleteInterview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: ans } = await context.supabase
      .from("interview_answers")
      .select("id")
      .eq("interview_id", data.id)
      .eq("user_id", context.userId);
    const answerIds = (ans ?? []).map((a) => a.id);
    if (answerIds.length > 0) {
      await context.supabase
        .from("interview_feedback")
        .delete()
        .in("answer_id", answerIds)
        .eq("user_id", context.userId);
      await context.supabase
        .from("interview_answers")
        .delete()
        .in("id", answerIds)
        .eq("user_id", context.userId);
    }
    const { error } = await context.supabase
      .from("interviews")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getInterviewAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: completed } = await context.supabase
      .from("interviews")
      .select("*")
      .eq("user_id", context.userId)
      .eq("status", "completed")
      .order("created_at", { ascending: true });
    const list = completed ?? [];
    const attempts = list.length;
    const avg = attempts
      ? Math.round(list.reduce((s, i) => s + (i.overall_score ?? 0), 0) / attempts)
      : 0;
    const best = attempts ? Math.max(...list.map((i) => i.overall_score ?? 0)) : 0;

    const byType: Record<string, { sum: number; n: number }> = {};
    for (const i of list) {
      const t = i.interview_type;
      byType[t] = byType[t] ?? { sum: 0, n: 0 };
      byType[t].sum += i.overall_score ?? 0;
      byType[t].n += 1;
    }
    const categories = Object.entries(byType).map(([type, v]) => ({
      type,
      avg: Math.round(v.sum / v.n),
    }));
    const strong = [...categories].sort((a, b) => b.avg - a.avg).slice(0, 2);
    const weak = [...categories].sort((a, b) => a.avg - b.avg).slice(0, 2);

    return {
      attempts,
      avg,
      best,
      categories,
      strong,
      weak,
      trend: list.map((i) => ({ date: i.created_at, score: i.overall_score ?? 0 })),
    };
  });
