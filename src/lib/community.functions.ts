import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const ROOMS = [
  "DSA",
  "Resume Review",
  "Mock Interview",
  "Placement Experience",
  "General",
] as const;

export const listPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z.object({ room: z.string().optional(), search: z.string().optional() }).parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    let q = context.supabase
      .from("community_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (data.room) q = q.eq("room", data.room);
    if (data.search) q = q.ilike("title", `%${data.search}%`);
    const { data: posts, error } = await q;
    if (error) throw new Error(error.message);

    const ids = (posts ?? []).map((p) => p.id);
    const authorIds = Array.from(new Set((posts ?? []).map((p) => p.author_id)));
    const [{ data: profiles }, { data: myLikes }, { data: mySaves }] = await Promise.all([
      authorIds.length
        ? context.supabase.from("profiles").select("id,full_name,email").in("id", authorIds)
        : Promise.resolve({
            data: [] as { id: string; full_name: string | null; email: string | null }[],
          }),
      ids.length
        ? context.supabase
            .from("post_likes")
            .select("post_id")
            .eq("user_id", context.userId)
            .in("post_id", ids)
        : Promise.resolve({ data: [] as { post_id: string }[] }),
      ids.length
        ? context.supabase
            .from("saved_posts")
            .select("post_id")
            .eq("user_id", context.userId)
            .in("post_id", ids)
        : Promise.resolve({ data: [] as { post_id: string }[] }),
    ]);
    const pmap = new Map((profiles ?? []).map((p) => [p.id, p]));
    const liked = new Set((myLikes ?? []).map((l) => l.post_id));
    const saved = new Set((mySaves ?? []).map((s) => s.post_id));
    return (posts ?? []).map((p) => ({
      ...p,
      author: pmap.get(p.author_id) ?? null,
      liked: liked.has(p.id),
      saved: saved.has(p.id),
    }));
  });

export const getPost = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: post, error } = await context.supabase
      .from("community_posts")
      .select("*")
      .eq("id", data.id)
      .single();
    if (error) throw new Error(error.message);
    const { data: comments } = await context.supabase
      .from("comments")
      .select("*")
      .eq("post_id", data.id)
      .order("created_at");
    const authorIds = Array.from(
      new Set([post.author_id, ...(comments ?? []).map((c) => c.author_id)]),
    );
    const { data: profiles } = await context.supabase
      .from("profiles")
      .select("id,full_name,email")
      .in("id", authorIds);
    const pmap = new Map((profiles ?? []).map((p) => [p.id, p]));
    const { data: like } = await context.supabase
      .from("post_likes")
      .select("post_id")
      .eq("user_id", context.userId)
      .eq("post_id", data.id)
      .maybeSingle();
    return {
      post: { ...post, author: pmap.get(post.author_id) ?? null },
      comments: (comments ?? []).map((c) => ({ ...c, author: pmap.get(c.author_id) ?? null })),
      liked: !!like,
    };
  });

export const createPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        room: z.enum(ROOMS),
        title: z.string().trim().min(3).max(200),
        body: z.string().trim().min(5).max(8000),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("community_posts")
      .insert({ author_id: context.userId, ...data })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const addComment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z.object({ post_id: z.string().uuid(), body: z.string().trim().min(1).max(4000) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("comments")
      .insert({ post_id: data.post_id, author_id: context.userId, body: data.body })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const toggleLike = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z.object({ post_id: z.string().uuid(), liked: z.boolean() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    if (data.liked) {
      await context.supabase
        .from("post_likes")
        .delete()
        .eq("post_id", data.post_id)
        .eq("user_id", context.userId);
    } else {
      await context.supabase
        .from("post_likes")
        .insert({ post_id: data.post_id, user_id: context.userId });
    }
    return { ok: true };
  });

export const toggleSavePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z.object({ post_id: z.string().uuid(), saved: z.boolean() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    if (data.saved) {
      await context.supabase
        .from("saved_posts")
        .delete()
        .eq("post_id", data.post_id)
        .eq("user_id", context.userId);
    } else {
      await context.supabase
        .from("saved_posts")
        .insert({ post_id: data.post_id, user_id: context.userId });
    }
    return { ok: true };
  });
