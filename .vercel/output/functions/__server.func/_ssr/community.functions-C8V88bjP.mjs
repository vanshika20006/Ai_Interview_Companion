import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { dt as enumType, ht as stringType, pt as objectType, ut as booleanType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/community.functions-C8V88bjP.js
var ROOMS = [
	"DSA",
	"Resume Review",
	"Mock Interview",
	"Placement Experience",
	"General"
];
var listPosts_createServerFn_handler = createServerRpc({
	id: "94e899766a0c721d1b8724465f14dd02daf9582ba9fd2807659763bd59bbc446",
	name: "listPosts",
	filename: "src/lib/community.functions.ts"
}, (opts) => listPosts.__executeServer(opts));
var listPosts = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	room: stringType().optional(),
	search: stringType().optional()
}).parse(input ?? {})).handler(listPosts_createServerFn_handler, async ({ data, context }) => {
	let q = context.supabase.from("community_posts").select("*").order("created_at", { ascending: false }).limit(100);
	if (data.room) q = q.eq("room", data.room);
	if (data.search) q = q.ilike("title", `%${data.search}%`);
	const { data: posts, error } = await q;
	if (error) throw new Error(error.message);
	const ids = (posts ?? []).map((p) => p.id);
	const authorIds = Array.from(new Set((posts ?? []).map((p) => p.author_id)));
	const [{ data: profiles }, { data: myLikes }, { data: mySaves }] = await Promise.all([
		authorIds.length ? context.supabase.from("profiles").select("id,full_name,email").in("id", authorIds) : Promise.resolve({ data: [] }),
		ids.length ? context.supabase.from("post_likes").select("post_id").eq("user_id", context.userId).in("post_id", ids) : Promise.resolve({ data: [] }),
		ids.length ? context.supabase.from("saved_posts").select("post_id").eq("user_id", context.userId).in("post_id", ids) : Promise.resolve({ data: [] })
	]);
	const pmap = new Map((profiles ?? []).map((p) => [p.id, p]));
	const liked = new Set((myLikes ?? []).map((l) => l.post_id));
	const saved = new Set((mySaves ?? []).map((s) => s.post_id));
	return (posts ?? []).map((p) => ({
		...p,
		author: pmap.get(p.author_id) ?? null,
		liked: liked.has(p.id),
		saved: saved.has(p.id)
	}));
});
var getPost_createServerFn_handler = createServerRpc({
	id: "3dd27fa7fc60e8552afa360b16b366e8bc4fa9a37819fdad602b9d123b745c88",
	name: "getPost",
	filename: "src/lib/community.functions.ts"
}, (opts) => getPost.__executeServer(opts));
var getPost = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(getPost_createServerFn_handler, async ({ data, context }) => {
	const { data: post, error } = await context.supabase.from("community_posts").select("*").eq("id", data.id).single();
	if (error) throw new Error(error.message);
	const { data: comments } = await context.supabase.from("comments").select("*").eq("post_id", data.id).order("created_at");
	const authorIds = Array.from(new Set([post.author_id, ...(comments ?? []).map((c) => c.author_id)]));
	const { data: profiles } = await context.supabase.from("profiles").select("id,full_name,email").in("id", authorIds);
	const pmap = new Map((profiles ?? []).map((p) => [p.id, p]));
	const { data: like } = await context.supabase.from("post_likes").select("post_id").eq("user_id", context.userId).eq("post_id", data.id).maybeSingle();
	return {
		post: {
			...post,
			author: pmap.get(post.author_id) ?? null
		},
		comments: (comments ?? []).map((c) => ({
			...c,
			author: pmap.get(c.author_id) ?? null
		})),
		liked: !!like
	};
});
var createPost_createServerFn_handler = createServerRpc({
	id: "ac184656e59f24eca82ff88ae9a59c2b81bf4604b4cb9f0c0ce779dec4364845",
	name: "createPost",
	filename: "src/lib/community.functions.ts"
}, (opts) => createPost.__executeServer(opts));
var createPost = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	room: enumType(ROOMS),
	title: stringType().trim().min(3).max(200),
	body: stringType().trim().min(5).max(8e3)
}).parse(input)).handler(createPost_createServerFn_handler, async ({ data, context }) => {
	const { data: row, error } = await context.supabase.from("community_posts").insert({
		author_id: context.userId,
		...data
	}).select().single();
	if (error) throw new Error(error.message);
	return row;
});
var addComment_createServerFn_handler = createServerRpc({
	id: "4432f076204f77c063c07fcf1cf87adfb73c5010426695f7f5e7d212edbace24",
	name: "addComment",
	filename: "src/lib/community.functions.ts"
}, (opts) => addComment.__executeServer(opts));
var addComment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	post_id: stringType().uuid(),
	body: stringType().trim().min(1).max(4e3)
}).parse(input)).handler(addComment_createServerFn_handler, async ({ data, context }) => {
	const { data: row, error } = await context.supabase.from("comments").insert({
		post_id: data.post_id,
		author_id: context.userId,
		body: data.body
	}).select().single();
	if (error) throw new Error(error.message);
	return row;
});
var toggleLike_createServerFn_handler = createServerRpc({
	id: "504d31aec5fccb900c5e50d7e77f296d6e2f30914f697a9a5b4c6c016722211d",
	name: "toggleLike",
	filename: "src/lib/community.functions.ts"
}, (opts) => toggleLike.__executeServer(opts));
var toggleLike = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	post_id: stringType().uuid(),
	liked: booleanType()
}).parse(input)).handler(toggleLike_createServerFn_handler, async ({ data, context }) => {
	if (data.liked) await context.supabase.from("post_likes").delete().eq("post_id", data.post_id).eq("user_id", context.userId);
	else await context.supabase.from("post_likes").insert({
		post_id: data.post_id,
		user_id: context.userId
	});
	return { ok: true };
});
var toggleSavePost_createServerFn_handler = createServerRpc({
	id: "1a3414d687c3912b75e3fcad8d90e1dfb27432ce41fbb212c82b760eee6c7563",
	name: "toggleSavePost",
	filename: "src/lib/community.functions.ts"
}, (opts) => toggleSavePost.__executeServer(opts));
var toggleSavePost = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	post_id: stringType().uuid(),
	saved: booleanType()
}).parse(input)).handler(toggleSavePost_createServerFn_handler, async ({ data, context }) => {
	if (data.saved) await context.supabase.from("saved_posts").delete().eq("post_id", data.post_id).eq("user_id", context.userId);
	else await context.supabase.from("saved_posts").insert({
		post_id: data.post_id,
		user_id: context.userId
	});
	return { ok: true };
});
//#endregion
export { addComment_createServerFn_handler, createPost_createServerFn_handler, getPost_createServerFn_handler, listPosts_createServerFn_handler, toggleLike_createServerFn_handler, toggleSavePost_createServerFn_handler };
