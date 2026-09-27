import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { ft as numberType, ht as stringType, lt as arrayType, pt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile.functions-BgVT-THp.js
var profileSchema = objectType({
	full_name: stringType().trim().max(120).nullable().optional(),
	college: stringType().trim().max(160).nullable().optional(),
	degree: stringType().trim().max(80).nullable().optional(),
	branch: stringType().trim().max(80).nullable().optional(),
	graduation_year: numberType().int().min(1990).max(2100).nullable().optional(),
	skills: arrayType(stringType().trim().max(40)).max(60).optional(),
	github: stringType().trim().max(200).nullable().optional(),
	linkedin: stringType().trim().max(200).nullable().optional(),
	portfolio: stringType().trim().max(200).nullable().optional(),
	target_roles: arrayType(stringType().trim().max(60)).max(20).optional(),
	preferred_companies: arrayType(stringType().trim().max(60)).max(30).optional()
});
var getProfile_createServerFn_handler = createServerRpc({
	id: "9df9652da79c7ccc337ce62c64dcd11f1800a8eb6e0bd13747650358f67fe4e8",
	name: "getProfile",
	filename: "src/lib/profile.functions.ts"
}, (opts) => getProfile.__executeServer(opts));
var getProfile = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getProfile_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("profiles").select("*").eq("id", context.userId).maybeSingle();
	if (error) throw new Error(error.message);
	return data;
});
var upsertProfile_createServerFn_handler = createServerRpc({
	id: "c94a55e77ed040aeee875c7214bd13b250b802e5453e9d4b3f9f713ae4debcee",
	name: "upsertProfile",
	filename: "src/lib/profile.functions.ts"
}, (opts) => upsertProfile.__executeServer(opts));
var upsertProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => profileSchema.parse(input)).handler(upsertProfile_createServerFn_handler, async ({ data, context }) => {
	const { error, data: row } = await context.supabase.from("profiles").update(data).eq("id", context.userId).select().maybeSingle();
	if (error) throw new Error(error.message);
	return row;
});
//#endregion
export { getProfile_createServerFn_handler, upsertProfile_createServerFn_handler };
