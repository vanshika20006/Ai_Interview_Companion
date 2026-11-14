import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client-CHhZY1kc.js
function createSupabaseClient() {
	return createClient((typeof process !== "undefined" && process.env ? process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL : void 0) || "https://pltxpwfmyoxgmgykkylv.supabase.co", (typeof process !== "undefined" && process.env ? process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY : void 0) || "sb_publishable_Lupg429azDL1bHgPSUomWA_YkTPy-gR", { auth: {
		storage: typeof window !== "undefined" ? localStorage : void 0,
		persistSession: true,
		autoRefreshToken: true
	} });
}
var _supabase;
var supabase = new Proxy({}, { get(_, prop, receiver) {
	if (!_supabase) _supabase = createSupabaseClient();
	return Reflect.get(_supabase, prop, receiver);
} });
//#endregion
export { supabase as t };
