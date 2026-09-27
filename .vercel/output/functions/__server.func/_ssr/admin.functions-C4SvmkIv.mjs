import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { dt as enumType, ft as numberType, ht as stringType, pt as objectType, ut as booleanType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-C4SvmkIv.js
var bootstrapMyRole_createServerFn_handler = createServerRpc({
	id: "2f2c61d30a36fce0429808a2e705bf8ebb4da1c4ce31086966923f7fba76b304",
	name: "bootstrapMyRole",
	filename: "src/lib/admin.functions.ts"
}, (opts) => bootstrapMyRole.__executeServer(opts));
var bootstrapMyRole = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(bootstrapMyRole_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.rpc("bootstrap_my_role");
	if (error) throw new Error(error.message);
	return data ?? "none";
});
var ROLES = [
	"admin",
	"moderator",
	"recruiter"
];
var amIAdmin_createServerFn_handler = createServerRpc({
	id: "2b97112c91f9366ddeba9c0a0772794613596207065806955c5ef8594bbf3232",
	name: "amIAdmin",
	filename: "src/lib/admin.functions.ts"
}, (opts) => amIAdmin.__executeServer(opts));
var amIAdmin = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(amIAdmin_createServerFn_handler, async ({ context }) => {
	const { data } = await context.supabase.rpc("has_role", {
		_user_id: context.userId,
		_role: "admin"
	});
	return !!data;
});
var adminCanClaim_createServerFn_handler = createServerRpc({
	id: "011c26ebb1c3756c385740491b144939cd39ced7463fe5994f0ca85b9eaf66c4",
	name: "adminCanClaim",
	filename: "src/lib/admin.functions.ts"
}, (opts) => adminCanClaim.__executeServer(opts));
var adminCanClaim = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(adminCanClaim_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.rpc("admin_can_claim");
	if (error) throw new Error(error.message);
	return !!data;
});
var claimFirstAdmin_createServerFn_handler = createServerRpc({
	id: "d9425d3c7a250d7701d286efd0414683dc977e4fa309b10da0ac77fcbe4e9e2c",
	name: "claimFirstAdmin",
	filename: "src/lib/admin.functions.ts"
}, (opts) => claimFirstAdmin.__executeServer(opts));
var claimFirstAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(claimFirstAdmin_createServerFn_handler, async ({ context }) => {
	const { error } = await context.supabase.rpc("claim_first_admin");
	if (error) throw new Error(error.message);
	return true;
});
var adminListUsers_createServerFn_handler = createServerRpc({
	id: "35cf6cc28f61c798a570ec39672552de8ed250f60706565e25b34a66f0c5b240",
	name: "adminListUsers",
	filename: "src/lib/admin.functions.ts"
}, (opts) => adminListUsers.__executeServer(opts));
var adminListUsers = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	search: stringType().optional(),
	limit: numberType().int().min(1).max(200).optional()
}).parse(input ?? {})).handler(adminListUsers_createServerFn_handler, async ({ data, context }) => {
	const { data: rows, error } = await context.supabase.rpc("admin_list_users", {
		_search: data.search?.trim() ? data.search.trim() : void 0,
		_limit: data.limit ?? 50
	});
	if (error) throw new Error(error.message);
	return rows ?? [];
});
var adminSetRole_createServerFn_handler = createServerRpc({
	id: "154da85bc7e5915df5164155bbb68a97441082079312d44aab513dabc82f59c3",
	name: "adminSetRole",
	filename: "src/lib/admin.functions.ts"
}, (opts) => adminSetRole.__executeServer(opts));
var adminSetRole = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	userId: stringType().uuid(),
	role: enumType(ROLES),
	grant: booleanType()
}).parse(input)).handler(adminSetRole_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.rpc("admin_set_role", {
		_target: data.userId,
		_role: data.role,
		_grant: data.grant
	});
	if (error) throw new Error(error.message);
	return true;
});
var adminAnalytics_createServerFn_handler = createServerRpc({
	id: "ad0c092d9068302d584e4ee6c929270ef251348f837bd3ea129892db963c741d",
	name: "adminAnalytics",
	filename: "src/lib/admin.functions.ts"
}, (opts) => adminAnalytics.__executeServer(opts));
var adminAnalytics = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(adminAnalytics_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.rpc("admin_analytics");
	if (error) throw new Error(error.message);
	return data ?? {};
});
//#endregion
export { adminAnalytics_createServerFn_handler, adminCanClaim_createServerFn_handler, adminListUsers_createServerFn_handler, adminSetRole_createServerFn_handler, amIAdmin_createServerFn_handler, bootstrapMyRole_createServerFn_handler, claimFirstAdmin_createServerFn_handler };
