import { d as getRequest } from "./esm-DfWlTJug.mjs";
import { n as createMiddleware } from "./createStart-DwZhSttb.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-middleware-8cCqfduu.js
var requireSupabaseAuth = createMiddleware({ type: "function" }).server(async ({ next }) => {
	const DEFAULT_URL = "https://pltxpwfmyoxgmgykkylv.supabase.co";
	const DEFAULT_KEY = "sb_publishable_Lupg429azDL1bHgPSUomWA_YkTPy-gR";
	const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || (typeof import.meta !== "undefined" && {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_SUPABASE_PROJECT_ID": "pltxpwfmyoxgmgykkylv",
		"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_Lupg429azDL1bHgPSUomWA_YkTPy-gR",
		"VITE_SUPABASE_URL": "https://pltxpwfmyoxgmgykkylv.supabase.co"
	} ? "https://pltxpwfmyoxgmgykkylv.supabase.co" : void 0) || DEFAULT_URL;
	const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || (typeof import.meta !== "undefined" && {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_SUPABASE_PROJECT_ID": "pltxpwfmyoxgmgykkylv",
		"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_Lupg429azDL1bHgPSUomWA_YkTPy-gR",
		"VITE_SUPABASE_URL": "https://pltxpwfmyoxgmgykkylv.supabase.co"
	} ? "sb_publishable_Lupg429azDL1bHgPSUomWA_YkTPy-gR" : void 0) || DEFAULT_KEY;
	const request = getRequest();
	if (!request?.headers) throw new Error("Unauthorized: No request headers available");
	const authHeader = request.headers.get("authorization");
	if (!authHeader) throw new Error("Unauthorized: No authorization header provided");
	if (!authHeader.startsWith("Bearer ")) throw new Error("Unauthorized: Only Bearer tokens are supported");
	const token = authHeader.replace("Bearer ", "");
	if (!token) throw new Error("Unauthorized: No token provided");
	const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
		global: { headers: { Authorization: `Bearer ${token}` } },
		auth: {
			storage: void 0,
			persistSession: false,
			autoRefreshToken: false
		}
	});
	const { data, error } = await supabase.auth.getClaims(token);
	if (error || !data?.claims) throw new Error("Unauthorized: Invalid token");
	if (!data.claims.sub) throw new Error("Unauthorized: No user ID found in token");
	return next({ context: {
		supabase,
		userId: data.claims.sub,
		claims: data.claims
	} });
});
//#endregion
export { requireSupabaseAuth as t };
