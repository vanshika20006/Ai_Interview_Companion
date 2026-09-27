import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CWLNe4_N.mjs";
import { dt as enumType, ht as stringType, pt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat._threadId-BFKRAa2p.js
var ScopeSchema = enumType([
	"mentor",
	"coding",
	"guide",
	"general"
]);
var listThreads = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("81f8d6ada944895e886fc9c1b3ea8c0e3fdfbdbcd7073b5a3e588f55517524dd"));
var searchThreads = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator((d) => objectType({ q: stringType().trim().min(1).max(200) }).parse(d)).handler(createSsrRpc("3e7caa473846af5a30c50c63f327458630afe1d9059113d72ca018a28c9a7418"));
var createThread = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => objectType({
	scope: ScopeSchema.default("general"),
	title: stringType().optional()
}).parse(d)).handler(createSsrRpc("0e7b69b1d91bc88e34354aa34e93348913ee48b5657a1700135375a79d4eb416"));
var getThread = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator((d) => objectType({ threadId: stringType().uuid() }).parse(d)).handler(createSsrRpc("0c06be9c8b640c62ce6cd23fdcdb0fe02db0fdc6de4ac66905c6718fa21e3006"));
var renameThread = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => objectType({
	threadId: stringType().uuid(),
	title: stringType().min(1).max(120)
}).parse(d)).handler(createSsrRpc("152f66fb380cff85728c8839358f8222dd36daa7e513c551908a3b962311dbbc"));
var deleteThread = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => objectType({ threadId: stringType().uuid() }).parse(d)).handler(createSsrRpc("e1c7e871a6ff3195deaf3eaa0b7cef206138273224933ee87c94a4e4f020e775"));
var $$splitComponentImporter = () => import("./chat._threadId-BKmYMcAX.mjs");
var Route = createFileRoute("/_authenticated/chat/$threadId")({
	head: () => ({ meta: [{ title: "AI Chat — Placement AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { listThreads as a, getThread as i, createThread as n, renameThread as o, deleteThread as r, searchThreads as s, Route as t };
