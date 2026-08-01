import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createClient } from "@supabase/supabase-js";
import { createAiProvider } from "@/lib/ai-provider.server";
import type { Database } from "@/integrations/supabase/types";

const SCOPE_SYSTEM: Record<string, string> = {
  mentor:
    "You are a friendly, supportive career mentor for engineering students preparing for placements. Give concrete, actionable advice on resumes, interviews, internships, salary negotiation, and career strategy. Use short paragraphs and bullets.",
  coding:
    "You are an expert competitive-programming tutor. Explain LeetCode/DSA problems step by step. When asked for a solution, give intuition, complexity, and clean code in the requested language. Use markdown code fences.",
  guide:
    "You are the in-product guide for 'Placement AI Companion'. Help users navigate features: Resume Analyzer, Resume Builder, AI Interview, LeetCode Roadmap, Jobs, Community, Study Groups, Bookmarks, Achievements, Leaderboard, Planner, Code Review, Prep Packs. Reply with direct links like /resume, /interview, /leetcode when relevant.",
  general:
    "You are a helpful, concise AI assistant for an engineering student. Be accurate and friendly. Use markdown when helpful.",
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            messages?: UIMessage[];
            threadId?: string;
            scope?: keyof typeof SCOPE_SYSTEM;
          };
          const { messages, threadId, scope = "general" } = body;
          if (!Array.isArray(messages) || !threadId) {
            return new Response("messages and threadId required", { status: 400 });
          }

          const auth = request.headers.get("authorization") ?? "";
          const token = auth.replace(/^Bearer\s+/i, "").trim();
          if (!token) return new Response("Unauthorized: missing token", { status: 401 });

          const url = (process.env.SUPABASE_URL ?? "").replace(/^['"]|['"]$/g, "");
          const anon = (process.env.SUPABASE_PUBLISHABLE_KEY ?? "").replace(/^['"]|['"]$/g, "");
          if (!url || !anon) {
            return new Response("Server misconfigured: SUPABASE env missing", { status: 500 });
          }
          const supabase = createClient<Database>(url, anon, {
            global: { headers: { Authorization: `Bearer ${token}` } },
            auth: { persistSession: false, autoRefreshToken: false },
          });

          const { data: claimsData, error: claimsErr } = await supabase.auth.getClaims(token);
          if (claimsErr || !claimsData?.claims?.sub) {
            console.error(
              "[/api/chat] getClaims failed:",
              claimsErr?.message,
              "tokenLen:",
              token.length,
            );
            return new Response(`Unauthorized: ${claimsErr?.message ?? "invalid token"}`, {
              status: 401,
            });
          }
          const userId = claimsData.claims.sub;

          // Verify thread ownership
          const { data: thread } = await supabase
            .from("chat_threads")
            .select("id,title,scope")
            .eq("id", threadId)
            .maybeSingle();
          if (!thread) return new Response("Thread not found", { status: 404 });

          // Persist the latest user message
          const last = messages[messages.length - 1];
          const lastText =
            last?.parts
              ?.map((p) => (p.type === "text" ? p.text : ""))
              .join("")
              .trim() ?? "";
          if (last?.role === "user" && lastText) {
            await supabase.from("chat_messages").insert({
              thread_id: threadId,
              user_id: userId,
              role: "user",
              content: lastText,
            });
            // Auto-title from first message
            if (thread.title === "New chat") {
              await supabase
                .from("chat_threads")
                .update({ title: lastText.slice(0, 60) })
                .eq("id", threadId);
            } else {
              await supabase
                .from("chat_threads")
                .update({ updated_at: new Date().toISOString() })
                .eq("id", threadId);
            }
          }

          const key = process.env.GEMINI_API_KEY || process.env.LOVABLE_API_KEY;
          if (!key) return new Response("Missing GEMINI_API_KEY", { status: 500 });

          const provider = createAiProvider(key);
          const model = provider("google/gemini-2.5-flash");

          const system = SCOPE_SYSTEM[thread.scope ?? scope] ?? SCOPE_SYSTEM.general;

          const sanitizedMessages = messages.map((m) => {
            if (typeof m.content === "string") {
              return { ...m, content: m.content.replace(/\\/g, "\\\\") };
            }
            if (Array.isArray(m.parts)) {
              return {
                ...m,
                parts: m.parts.map((p) => {
                  if (p.type === "text") {
                    return { ...p, text: p.text.replace(/\\/g, "\\\\") };
                  }
                  return p;
                }),
              };
            }
            return m;
          });

          const result = streamText({
            model,
            system,
            messages: await convertToModelMessages(sanitizedMessages),
          });

          return result.toUIMessageStreamResponse({
            originalMessages: messages,
            onFinish: async ({ messages: finalMessages }) => {
              const assistant = finalMessages[finalMessages.length - 1];
              const text =
                assistant?.parts
                  ?.map((p) => (p.type === "text" ? p.text : ""))
                  .join("")
                  .trim() ?? "";
              if (assistant?.role === "assistant" && text) {
                await supabase.from("chat_messages").insert({
                  thread_id: threadId,
                  user_id: userId,
                  role: "assistant",
                  content: text,
                });
              }
            },
          });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Chat failed";
          return new Response(msg, { status: 500 });
        }
      },
    },
  },
});
