import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listMyGroups = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: memberships } = await context.supabase
      .from("study_group_members")
      .select("group_id, role, joined_at")
      .eq("user_id", context.userId);
    const ids = (memberships ?? []).map((m) => m.group_id);
    if (ids.length === 0) return [];
    const { data: groups } = await context.supabase
      .from("study_groups")
      .select("*")
      .in("id", ids)
      .order("created_at", { ascending: false });
    return (groups ?? []).map((g) => ({
      ...g,
      role: memberships?.find((m) => m.group_id === g.id)?.role ?? "member",
    }));
  });

export const createGroup = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        name: z.string().min(2).max(80),
        description: z.string().max(500).optional(),
        goal: z.string().max(200).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: group, error } = await context.supabase
      .from("study_groups")
      .insert({
        owner_id: context.userId,
        name: data.name,
        description: data.description ?? null,
        goal: data.goal ?? null,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return group;
  });

export const joinGroupByCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z.object({ invite_code: z.string().trim().min(4).max(20) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    // Server-side SECURITY DEFINER validates the invite code and inserts membership.
    // Direct INSERT on study_group_members is no longer allowed via RLS.
    const { data: gid, error } = await context.supabase.rpc("join_group_by_invite", {
      _code: data.invite_code,
    });
    if (error) throw new Error(error.message || "Invalid invite code");
    const { data: group } = await context.supabase
      .from("study_groups")
      .select("id, name")
      .eq("id", gid as string)
      .maybeSingle();
    return group ?? { id: gid as string, name: "" };
  });

export const leaveGroup = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ group_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("study_group_members")
      .delete()
      .eq("group_id", data.group_id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getGroup = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: group, error } = await context.supabase
      .from("study_groups")
      .select("*")
      .eq("id", data.id)
      .single();
    if (error) throw new Error(error.message);

    const { data: members } = await context.supabase
      .from("study_group_members")
      .select("user_id, role, joined_at")
      .eq("group_id", data.id);

    const memberIds = (members ?? []).map((m) => m.user_id);
    let profiles: { id: string; full_name: string | null; username: string | null }[] = [];
    if (memberIds.length > 0) {
      const { data: names } = await context.supabase.rpc("get_display_names", { _ids: memberIds });
      profiles = (names ?? []).map(
        (n: { user_id: string; display_name: string | null; username: string | null }) => ({
          id: n.user_id,
          full_name: n.display_name,
          username: n.username,
        }),
      );
    }

    return {
      group,
      members: (members ?? []).map((m) => ({
        ...m,
        profile: profiles.find((p) => p.id === m.user_id) ?? null,
      })),
    };
  });
