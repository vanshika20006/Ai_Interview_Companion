import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { ht as stringType, pt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/studyGroups.functions-D3dwDXiB.js
var listMyGroups_createServerFn_handler = createServerRpc({
	id: "f439bcfe0cd6dd7c895d483ceac74f6a506a0225e13fc067d984837434a10db7",
	name: "listMyGroups",
	filename: "src/lib/studyGroups.functions.ts"
}, (opts) => listMyGroups.__executeServer(opts));
var listMyGroups = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listMyGroups_createServerFn_handler, async ({ context }) => {
	const { data: memberships } = await context.supabase.from("study_group_members").select("group_id, role, joined_at").eq("user_id", context.userId);
	const ids = (memberships ?? []).map((m) => m.group_id);
	if (ids.length === 0) return [];
	const { data: groups } = await context.supabase.from("study_groups").select("*").in("id", ids).order("created_at", { ascending: false });
	return (groups ?? []).map((g) => ({
		...g,
		role: memberships?.find((m) => m.group_id === g.id)?.role ?? "member"
	}));
});
var createGroup_createServerFn_handler = createServerRpc({
	id: "3cd3fdda7e34b7bfd3005e7d9540a7496e70c997503b4d711da772825350fea6",
	name: "createGroup",
	filename: "src/lib/studyGroups.functions.ts"
}, (opts) => createGroup.__executeServer(opts));
var createGroup = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	name: stringType().min(2).max(80),
	description: stringType().max(500).optional(),
	goal: stringType().max(200).optional()
}).parse(input)).handler(createGroup_createServerFn_handler, async ({ data, context }) => {
	const { data: group, error } = await context.supabase.from("study_groups").insert({
		owner_id: context.userId,
		name: data.name,
		description: data.description ?? null,
		goal: data.goal ?? null
	}).select().single();
	if (error) throw new Error(error.message);
	return group;
});
var joinGroupByCode_createServerFn_handler = createServerRpc({
	id: "8ea39c6f890292200a098365931af0de11bde85436de57846310f76c39e8e265",
	name: "joinGroupByCode",
	filename: "src/lib/studyGroups.functions.ts"
}, (opts) => joinGroupByCode.__executeServer(opts));
var joinGroupByCode = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ invite_code: stringType().trim().min(4).max(20) }).parse(input)).handler(joinGroupByCode_createServerFn_handler, async ({ data, context }) => {
	const { data: gid, error } = await context.supabase.rpc("join_group_by_invite", { _code: data.invite_code });
	if (error) throw new Error(error.message || "Invalid invite code");
	const { data: group } = await context.supabase.from("study_groups").select("id, name").eq("id", gid).maybeSingle();
	return group ?? {
		id: gid,
		name: ""
	};
});
var leaveGroup_createServerFn_handler = createServerRpc({
	id: "e778c034b6ece8f30464218c338e523c0190e8ef13a8df455291db4c2b3457f2",
	name: "leaveGroup",
	filename: "src/lib/studyGroups.functions.ts"
}, (opts) => leaveGroup.__executeServer(opts));
var leaveGroup = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ group_id: stringType().uuid() }).parse(input)).handler(leaveGroup_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("study_group_members").delete().eq("group_id", data.group_id).eq("user_id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var getGroup_createServerFn_handler = createServerRpc({
	id: "87acdc3241d8e830340e03482ca3a581226ce7156b95ffcfbbc51a60473abfee",
	name: "getGroup",
	filename: "src/lib/studyGroups.functions.ts"
}, (opts) => getGroup.__executeServer(opts));
var getGroup = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(getGroup_createServerFn_handler, async ({ data, context }) => {
	const { data: group, error } = await context.supabase.from("study_groups").select("*").eq("id", data.id).single();
	if (error) throw new Error(error.message);
	const { data: members } = await context.supabase.from("study_group_members").select("user_id, role, joined_at").eq("group_id", data.id);
	const memberIds = (members ?? []).map((m) => m.user_id);
	let profiles = [];
	if (memberIds.length > 0) {
		const { data: names } = await context.supabase.rpc("get_display_names", { _ids: memberIds });
		profiles = (names ?? []).map((n) => ({
			id: n.user_id,
			full_name: n.display_name,
			username: n.username
		}));
	}
	return {
		group,
		members: (members ?? []).map((m) => ({
			...m,
			profile: profiles.find((p) => p.id === m.user_id) ?? null
		}))
	};
});
//#endregion
export { createGroup_createServerFn_handler, getGroup_createServerFn_handler, joinGroupByCode_createServerFn_handler, leaveGroup_createServerFn_handler, listMyGroups_createServerFn_handler };
