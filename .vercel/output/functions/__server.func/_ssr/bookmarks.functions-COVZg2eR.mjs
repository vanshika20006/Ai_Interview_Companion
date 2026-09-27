import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { dt as enumType, gt as unknownType, ht as stringType, mt as recordType, pt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bookmarks.functions-COVZg2eR.js
var ITEM_TYPES = [
	"job",
	"post",
	"problem",
	"interview",
	"resource"
];
var toggleSchema = objectType({
	item_type: enumType(ITEM_TYPES),
	item_id: stringType().min(1).max(200),
	title: stringType().min(1).max(300),
	subtitle: stringType().max(500).optional().nullable(),
	url: stringType().max(1e3).optional().nullable(),
	metadata: recordType(unknownType()).optional()
});
var listBookmarks_createServerFn_handler = createServerRpc({
	id: "b93ad6471012e3db8e69819304c7a2c13f32937e5aafdb3ace07d91e38123dd6",
	name: "listBookmarks",
	filename: "src/lib/bookmarks.functions.ts"
}, (opts) => listBookmarks.__executeServer(opts));
var listBookmarks = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ item_type: enumType(ITEM_TYPES).optional() }).parse(input ?? {})).handler(listBookmarks_createServerFn_handler, async ({ data, context }) => {
	let q = context.supabase.from("bookmarks").select("*").eq("user_id", context.userId).order("created_at", { ascending: false });
	if (data.item_type) q = q.eq("item_type", data.item_type);
	const { data: rows, error } = await q;
	if (error) throw new Error(error.message);
	return rows ?? [];
});
var toggleBookmark_createServerFn_handler = createServerRpc({
	id: "4b1c9af19f43548f9eb9a9ec1e4116c814e648894b0c041d136e0bc5e644eda5",
	name: "toggleBookmark",
	filename: "src/lib/bookmarks.functions.ts"
}, (opts) => toggleBookmark.__executeServer(opts));
var toggleBookmark = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => toggleSchema.parse(input)).handler(toggleBookmark_createServerFn_handler, async ({ data, context }) => {
	const { data: existing } = await context.supabase.from("bookmarks").select("id").eq("user_id", context.userId).eq("item_type", data.item_type).eq("item_id", data.item_id).maybeSingle();
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
		metadata: data.metadata ?? {}
	});
	if (error) throw new Error(error.message);
	return { bookmarked: true };
});
var removeBookmark_createServerFn_handler = createServerRpc({
	id: "6d40a7caf482c5f9f3e2661c50c6d2e30f0a238703207554e7cfaf4d2cc2b8ae",
	name: "removeBookmark",
	filename: "src/lib/bookmarks.functions.ts"
}, (opts) => removeBookmark.__executeServer(opts));
var removeBookmark = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(removeBookmark_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("bookmarks").delete().eq("id", data.id).eq("user_id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { listBookmarks_createServerFn_handler, removeBookmark_createServerFn_handler, toggleBookmark_createServerFn_handler };
