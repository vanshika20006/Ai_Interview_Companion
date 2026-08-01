import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateText } from "ai";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createAiProvider } from "@/lib/ai-provider.server";

const LangSchema = z.enum([
  "javascript",
  "typescript",
  "python",
  "java",
  "cpp",
  "go",
  "rust",
  "csharp",
  "sql",
]);

export const listReviews = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("code_reviews")
      .select("id,user_id,title,language,description,ai_score,created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    const ids = Array.from(new Set((data ?? []).map((r) => r.user_id)));
    let nameMap: Record<string, string> = {};
    if (ids.length) {
      const { data: names } = await context.supabase.rpc("get_display_names", { _ids: ids });
      nameMap = Object.fromEntries(
        (names ?? []).map((n: { user_id: string; display_name: string }) => [
          n.user_id,
          n.display_name,
        ]),
      );
    }
    return (data ?? []).map((r) => ({ ...r, author: nameMap[r.user_id] ?? "Anonymous" }));
  });

export const getReview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: review, error } = await context.supabase
      .from("code_reviews")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error || !review) throw new Error("Not found");
    const { data: comments } = await context.supabase
      .from("code_review_comments")
      .select("id,user_id,body,created_at")
      .eq("review_id", data.id)
      .order("created_at", { ascending: true });
    const ids = Array.from(new Set([review.user_id, ...(comments ?? []).map((c) => c.user_id)]));
    const { data: names } = await context.supabase.rpc("get_display_names", { _ids: ids });
    const nameMap = Object.fromEntries(
      (names ?? []).map((n: { user_id: string; display_name: string }) => [
        n.user_id,
        n.display_name,
      ]),
    );
    return {
      review: { ...review, author: nameMap[review.user_id] ?? "Anonymous" },
      comments: (comments ?? []).map((c) => ({ ...c, author: nameMap[c.user_id] ?? "Anonymous" })),
    };
  });

export const createReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        title: z.string().min(3).max(140),
        language: LangSchema,
        code: z.string().min(10).max(20000),
        description: z.string().max(2000).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const key = process.env.GEMINI_API_KEY || process.env.LOVABLE_API_KEY;
    let aiFeedback = "AI feedback unavailable.";
    let aiScore: number | null = null;
    if (key) {
      try {
        const provider = createAiProvider(key);
        const model = provider("google/gemini-2.5-flash");
        const sanitizedCode = data.code.replace(/\\/g, "\\\\");
        const sanitizedDesc = (data.description ?? "(none)").replace(/\\/g, "\\\\");
        const { text } = await generateText({
          model,
          system:
            'You are a senior code reviewer. Score the snippet 0-100 on quality. Return strict JSON: {"score": <int>, "review": "<markdown"}. The review covers correctness, readability, performance, edge cases, and concrete improvement suggestions.',
          prompt: `Language: ${data.language}\nContext: ${sanitizedDesc}\n\nCode:\n\`\`\`${data.language}\n${sanitizedCode.slice(0, 12000)}\n\`\`\``,
        });
        const m = text.match(/\{[\s\S]*\}/);
        if (m) {
          const j = JSON.parse(m[0]) as { score?: number; review?: string };
          aiScore = typeof j.score === "number" ? Math.max(0, Math.min(100, j.score)) : null;
          aiFeedback = j.review ?? text;
        } else {
          aiFeedback = text;
        }
      } catch (e) {
        aiFeedback = `AI review failed: ${e instanceof Error ? e.message : "unknown"}`;
      }
    }
    const { data: row, error } = await context.supabase
      .from("code_reviews")
      .insert({
        user_id: context.userId,
        title: data.title,
        language: data.language,
        code: data.code,
        description: data.description,
        ai_feedback: aiFeedback,
        ai_score: aiScore,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    await context.supabase.from("notifications").insert({
      user_id: context.userId,
      type: "code_review",
      title: `AI reviewed: ${data.title}`,
      body: aiScore != null ? `AI score: ${aiScore}/100` : "Your code review is ready",
      link: `/code-review/${row.id}`,
    });
    return { id: row.id };
  });

export const addReviewComment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({ reviewId: z.string().uuid(), body: z.string().min(1).max(2000) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("code_review_comments").insert({
      review_id: data.reviewId,
      user_id: context.userId,
      body: data.body,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
