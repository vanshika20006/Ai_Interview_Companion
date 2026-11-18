import { l as createServerFn } from "./esm-DfWlTJug.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-8cCqfduu.mjs";
import { t as createSsrRpc } from "./createSsrRpc-Bw_RqZSW.mjs";
import { ht as stringType, pt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/studyGroups.functions-C9IkDtLz.js
var listMyGroups = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("f439bcfe0cd6dd7c895d483ceac74f6a506a0225e13fc067d984837434a10db7"));
var createGroup = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	name: stringType().min(2).max(80),
	description: stringType().max(500).optional(),
	goal: stringType().max(200).optional()
}).parse(input)).handler(createSsrRpc("3cd3fdda7e34b7bfd3005e7d9540a7496e70c997503b4d711da772825350fea6"));
var joinGroupByCode = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ invite_code: stringType().trim().min(4).max(20) }).parse(input)).handler(createSsrRpc("8ea39c6f890292200a098365931af0de11bde85436de57846310f76c39e8e265"));
var leaveGroup = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ group_id: stringType().uuid() }).parse(input)).handler(createSsrRpc("e778c034b6ece8f30464218c338e523c0190e8ef13a8df455291db4c2b3457f2"));
var getGroup = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(createSsrRpc("87acdc3241d8e830340e03482ca3a581226ce7156b95ffcfbbc51a60473abfee"));
var listGroupMessages = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ group_id: stringType().uuid() }).parse(input)).handler(createSsrRpc("f0f032991184bdd79bb7411fb3b6e1f74e336559c4f4a3a560f8efbf19ca8c7d"));
var sendGroupMessage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	group_id: stringType().uuid(),
	content: stringType().trim().min(1).max(2e3)
}).parse(input)).handler(createSsrRpc("9a6a8620eec20f917d72cb9db1a46ee36cebf88912548c29a898e00772df7fa5"));
//#endregion
export { listGroupMessages as a, leaveGroup as i, getGroup as n, listMyGroups as o, joinGroupByCode as r, sendGroupMessage as s, createGroup as t };
