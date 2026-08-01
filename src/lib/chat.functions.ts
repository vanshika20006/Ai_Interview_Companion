import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ScopeSchema = z.enum(["mentor", "coding", "guide", "general"]);

export const listThreads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("chat_threads")
      .select("id,title,scope,updated_at,created_at")
      .order("updated_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const searchThreads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ q: z.string().trim().min(1).max(200) }).parse(d))
  .handler(async ({ data, context }) => {
    const q = data.q;
    const like = `%${q.replace(/[%_]/g, (m) => `\\${m}`)}%`;
    // Search titles
    const { data: titleHits } = await context.supabase
      .from("chat_threads")
      .select("id,title,scope,updated_at")
      .ilike("title", like)
      .order("updated_at", { ascending: false })
      .limit(50);
    // Search message content -> thread ids
    const { data: msgHits } = await context.supabase
      .from("chat_messages")
      .select("thread_id,content,created_at")
      .eq("user_id", context.userId)
      .ilike("content", like)
      .order("created_at", { ascending: false })
      .limit(100);
    const threadIds = Array.from(new Set((msgHits ?? []).map((m) => m.thread_id)));
    let msgThreads: Array<{ id: string; title: string; scope: string; updated_at: string }> = [];
    if (threadIds.length > 0) {
      const { data: extra } = await context.supabase
        .from("chat_threads")
        .select("id,title,scope,updated_at")
        .in("id", threadIds);
      msgThreads = extra ?? [];
    }
    const snippetByThread = new Map<string, string>();
    for (const m of msgHits ?? []) {
      if (!snippetByThread.has(m.thread_id)) {
        const idx = m.content.toLowerCase().indexOf(q.toLowerCase());
        const start = Math.max(0, idx - 40);
        const end = Math.min(m.content.length, idx + q.length + 60);
        snippetByThread.set(
          m.thread_id,
          (start > 0 ? "…" : "") +
            m.content.slice(start, end) +
            (end < m.content.length ? "…" : ""),
        );
      }
    }
    const merged = new Map<
      string,
      { id: string; title: string; scope: string; updated_at: string; snippet?: string }
    >();
    for (const t of titleHits ?? []) merged.set(t.id, { ...t });
    for (const t of msgThreads) {
      const existing = merged.get(t.id);
      merged.set(t.id, { ...(existing ?? t), snippet: snippetByThread.get(t.id) });
    }
    return Array.from(merged.values()).sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1));
  });

export const createThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({ scope: ScopeSchema.default("general"), title: z.string().optional() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("chat_threads")
      .insert({
        user_id: context.userId,
        scope: data.scope,
        title: data.title ?? "New chat",
      })
      .select("id,title,scope,updated_at,created_at")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const getThread = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ threadId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const [{ data: thread }, { data: messages }] = await Promise.all([
      context.supabase
        .from("chat_threads")
        .select("id,title,scope")
        .eq("id", data.threadId)
        .maybeSingle(),
      context.supabase
        .from("chat_messages")
        .select("id,role,content,created_at")
        .eq("thread_id", data.threadId)
        .order("created_at", { ascending: true }),
    ]);
    if (!thread) throw new Error("Thread not found");
    return { thread, messages: messages ?? [] };
  });

export const renameThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({ threadId: z.string().uuid(), title: z.string().min(1).max(120) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("chat_threads")
      .update({ title: data.title })
      .eq("id", data.threadId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ threadId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("chat_threads").delete().eq("id", data.threadId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
