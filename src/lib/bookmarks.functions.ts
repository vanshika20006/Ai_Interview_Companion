import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ITEM_TYPES = ["job", "post", "problem", "interview", "resource"] as const;

const toggleSchema = z.object({
  item_type: z.enum(ITEM_TYPES),
  item_id: z.string().min(1).max(200),
  title: z.string().min(1).max(300),
  subtitle: z.string().max(500).optional().nullable(),
  url: z.string().max(1000).optional().nullable(),
  metadata: z.record(z.unknown()).optional(),
});

export const listBookmarks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z.object({ item_type: z.enum(ITEM_TYPES).optional() }).parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    let q = context.supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (data.item_type) q = q.eq("item_type", data.item_type);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const toggleBookmark = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => toggleSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: existing } = await context.supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", context.userId)
      .eq("item_type", data.item_type)
      .eq("item_id", data.item_id)
      .maybeSingle();

    if (existing) {
      const { error } = await context.supabase.from("bookmarks").delete().eq("id", existing.id);
      if (error) throw new Error(error.message);
      return { bookmarked: false };
    }

    const { error } = await context.supabase.from("bookmarks").insert({
      user_id: context.userId,
      item_type: data.item_type,
      item_id: data.item_id,
      title: data.title,
      subtitle: data.subtitle ?? null,
      url: data.url ?? null,
      metadata: (data.metadata ?? {}) as never,
    });
    if (error) throw new Error(error.message);
    return { bookmarked: true };
  });

export const removeBookmark = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("bookmarks")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
