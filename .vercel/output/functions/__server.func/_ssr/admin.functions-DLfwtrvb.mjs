import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CWLNe4_N.mjs";
import { dt as enumType, ft as numberType, ht as stringType, pt as objectType, ut as booleanType } from "../_libs/@ai-sdk/gateway+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-DLfwtrvb.js
var bootstrapMyRole = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("2f2c61d30a36fce0429808a2e705bf8ebb4da1c4ce31086966923f7fba76b304"));
var ROLES = [
	"admin",
	"moderator",
	"recruiter"
];
var amIAdmin = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("2b97112c91f9366ddeba9c0a0772794613596207065806955c5ef8594bbf3232"));
var adminCanClaim = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("011c26ebb1c3756c385740491b144939cd39ced7463fe5994f0ca85b9eaf66c4"));
var claimFirstAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("d9425d3c7a250d7701d286efd0414683dc977e4fa309b10da0ac77fcbe4e9e2c"));
var adminListUsers = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	search: stringType().optional(),
	limit: numberType().int().min(1).max(200).optional()
}).parse(input ?? {})).handler(createSsrRpc("35cf6cc28f61c798a570ec39672552de8ed250f60706565e25b34a66f0c5b240"));
var adminSetRole = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	userId: stringType().uuid(),
	role: enumType(ROLES),
	grant: booleanType()
}).parse(input)).handler(createSsrRpc("154da85bc7e5915df5164155bbb68a97441082079312d44aab513dabc82f59c3"));
var adminAnalytics = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("ad0c092d9068302d584e4ee6c929270ef251348f837bd3ea129892db963c741d"));
//#endregion
export { amIAdmin as a, adminSetRole as i, adminCanClaim as n, bootstrapMyRole as o, adminListUsers as r, claimFirstAdmin as s, adminAnalytics as t };
