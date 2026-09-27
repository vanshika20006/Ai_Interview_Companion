import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { ht as stringType, lt as arrayType, pt as objectType, ut as booleanType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications.functions-CkEb531S.js
var listNotifications_createServerFn_handler = createServerRpc({
	id: "c017b24a4940a916334ff23b3f3461893d7b3f151e06bac76f968dd27c3f187b",
	name: "listNotifications",
	filename: "src/lib/notifications.functions.ts"
}, (opts) => listNotifications.__executeServer(opts));
var listNotifications = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listNotifications_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("notifications").select("id,type,title,body,link,read_at,created_at").order("created_at", { ascending: false }).limit(100);
	if (error) throw new Error(error.message);
	const unread = (data ?? []).filter((n) => !n.read_at).length;
	return {
		items: data ?? [],
		unread
	};
});
var markRead_createServerFn_handler = createServerRpc({
	id: "e2ecc1f68f57dddaa680d1e56f33529318876089d71b0ecb31c21490b3f96daf",
	name: "markRead",
	filename: "src/lib/notifications.functions.ts"
}, (opts) => markRead.__executeServer(opts));
var markRead = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => objectType({
	ids: arrayType(stringType().uuid()).optional(),
	all: booleanType().optional()
}).parse(d)).handler(markRead_createServerFn_handler, async ({ data, context }) => {
	const q = context.supabase.from("notifications").update({ read_at: (/* @__PURE__ */ new Date()).toISOString() });
	if (data.all) await q.is("read_at", null);
	else if (data.ids?.length) await q.in("id", data.ids);
	return { ok: true };
});
var createNotification_createServerFn_handler = createServerRpc({
	id: "cadf8c245a0ba6c3fa242d0b1680078a65669144f37900147e599084d00e6b1f",
	name: "createNotification",
	filename: "src/lib/notifications.functions.ts"
}, (opts) => createNotification.__executeServer(opts));
var createNotification = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => objectType({
	type: stringType().min(1).max(40),
	title: stringType().min(1).max(160),
	body: stringType().max(500).optional(),
	link: stringType().max(300).optional()
}).parse(d)).handler(createNotification_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("notifications").insert({
		user_id: context.userId,
		type: data.type,
		title: data.title,
		body: data.body,
		link: data.link
	});
	if (error) throw new Error(error.message);
	return { ok: true };
});
var deleteNotification_createServerFn_handler = createServerRpc({
	id: "f06422965368cb200c820397c3202e17a495c2d964e585a6d01ab01406020d27",
	name: "deleteNotification",
	filename: "src/lib/notifications.functions.ts"
}, (opts) => deleteNotification.__executeServer(opts));
var deleteNotification = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deleteNotification_createServerFn_handler, async ({ data, context }) => {
	await context.supabase.from("notifications").delete().eq("id", data.id);
	return { ok: true };
});
//#endregion
export { createNotification_createServerFn_handler, deleteNotification_createServerFn_handler, listNotifications_createServerFn_handler, markRead_createServerFn_handler };
