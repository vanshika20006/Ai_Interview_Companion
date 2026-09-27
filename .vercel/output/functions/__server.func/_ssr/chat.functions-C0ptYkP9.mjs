import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { dt as enumType, ht as stringType, pt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat.functions-C0ptYkP9.js
var ScopeSchema = enumType([
	"mentor",
	"coding",
	"guide",
	"general"
]);
var listThreads_createServerFn_handler = createServerRpc({
	id: "81f8d6ada944895e886fc9c1b3ea8c0e3fdfbdbcd7073b5a3e588f55517524dd",
	name: "listThreads",
	filename: "src/lib/chat.functions.ts"
}, (opts) => listThreads.__executeServer(opts));
var listThreads = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listThreads_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("chat_threads").select("id,title,scope,updated_at,created_at").order("updated_at", { ascending: false }).limit(100);
	if (error) throw new Error(error.message);
	return data ?? [];
});
var searchThreads_createServerFn_handler = createServerRpc({
	id: "3e7caa473846af5a30c50c63f327458630afe1d9059113d72ca018a28c9a7418",
	name: "searchThreads",
	filename: "src/lib/chat.functions.ts"
}, (opts) => searchThreads.__executeServer(opts));
var searchThreads = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator((d) => objectType({ q: stringType().trim().min(1).max(200) }).parse(d)).handler(searchThreads_createServerFn_handler, async ({ data, context }) => {
	const q = data.q;
	const like = `%${q.replace(/[%_]/g, (m) => `\\${m}`)}%`;
	const { data: titleHits } = await context.supabase.from("chat_threads").select("id,title,scope,updated_at").ilike("title", like).order("updated_at", { ascending: false }).limit(50);
	const { data: msgHits } = await context.supabase.from("chat_messages").select("thread_id,content,created_at").eq("user_id", context.userId).ilike("content", like).order("created_at", { ascending: false }).limit(100);
	const threadIds = Array.from(new Set((msgHits ?? []).map((m) => m.thread_id)));
	let msgThreads = [];
	if (threadIds.length > 0) {
		const { data: extra } = await context.supabase.from("chat_threads").select("id,title,scope,updated_at").in("id", threadIds);
		msgThreads = extra ?? [];
	}
	const snippetByThread = /* @__PURE__ */ new Map();
	for (const m of msgHits ?? []) if (!snippetByThread.has(m.thread_id)) {
		const idx = m.content.toLowerCase().indexOf(q.toLowerCase());
		const start = Math.max(0, idx - 40);
		const end = Math.min(m.content.length, idx + q.length + 60);
		snippetByThread.set(m.thread_id, (start > 0 ? "…" : "") + m.content.slice(start, end) + (end < m.content.length ? "…" : ""));
	}
	const merged = /* @__PURE__ */ new Map();
	for (const t of titleHits ?? []) merged.set(t.id, { ...t });
	for (const t of msgThreads) {
		const existing = merged.get(t.id);
		merged.set(t.id, {
			...existing ?? t,
			snippet: snippetByThread.get(t.id)
		});
	}
	return Array.from(merged.values()).sort((a, b) => a.updated_at < b.updated_at ? 1 : -1);
});
var createThread_createServerFn_handler = createServerRpc({
	id: "0e7b69b1d91bc88e34354aa34e93348913ee48b5657a1700135375a79d4eb416",
	name: "createThread",
	filename: "src/lib/chat.functions.ts"
}, (opts) => createThread.__executeServer(opts));
var createThread = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => objectType({
	scope: ScopeSchema.default("general"),
	title: stringType().optional()
}).parse(d)).handler(createThread_createServerFn_handler, async ({ data, context }) => {
	const { data: row, error } = await context.supabase.from("chat_threads").insert({
		user_id: context.userId,
		scope: data.scope,
		title: data.title ?? "New chat"
	}).select("id,title,scope,updated_at,created_at").single();
	if (error) throw new Error(error.message);
	return row;
});
var getThread_createServerFn_handler = createServerRpc({
	id: "0c06be9c8b640c62ce6cd23fdcdb0fe02db0fdc6de4ac66905c6718fa21e3006",
	name: "getThread",
	filename: "src/lib/chat.functions.ts"
}, (opts) => getThread.__executeServer(opts));
var getThread = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator((d) => objectType({ threadId: stringType().uuid() }).parse(d)).handler(getThread_createServerFn_handler, async ({ data, context }) => {
	const [{ data: thread }, { data: messages }] = await Promise.all([context.supabase.from("chat_threads").select("id,title,scope").eq("id", data.threadId).maybeSingle(), context.supabase.from("chat_messages").select("id,role,content,created_at").eq("thread_id", data.threadId).order("created_at", { ascending: true })]);
	if (!thread) throw new Error("Thread not found");
	return {
		thread,
		messages: messages ?? []
	};
});
var renameThread_createServerFn_handler = createServerRpc({
	id: "152f66fb380cff85728c8839358f8222dd36daa7e513c551908a3b962311dbbc",
	name: "renameThread",
	filename: "src/lib/chat.functions.ts"
}, (opts) => renameThread.__executeServer(opts));
var renameThread = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => objectType({
	threadId: stringType().uuid(),
	title: stringType().min(1).max(120)
}).parse(d)).handler(renameThread_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("chat_threads").update({ title: data.title }).eq("id", data.threadId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var deleteThread_createServerFn_handler = createServerRpc({
	id: "e1c7e871a6ff3195deaf3eaa0b7cef206138273224933ee87c94a4e4f020e775",
	name: "deleteThread",
	filename: "src/lib/chat.functions.ts"
}, (opts) => deleteThread.__executeServer(opts));
var deleteThread = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => objectType({ threadId: stringType().uuid() }).parse(d)).handler(deleteThread_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("chat_threads").delete().eq("id", data.threadId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { createThread_createServerFn_handler, deleteThread_createServerFn_handler, getThread_createServerFn_handler, listThreads_createServerFn_handler, renameThread_createServerFn_handler, searchThreads_createServerFn_handler };
