import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { ht as stringType, pt as objectType, ut as booleanType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/publicProfile.functions-CyJiH_CK.js
var usernameRegex = /^[a-z0-9_-]{3,32}$/;
var getMyPublicProfile_createServerFn_handler = createServerRpc({
	id: "51706e5960a4f9303e13982f894b0be1c1e2b28d0d811d5834e09eb8b039ff80",
	name: "getMyPublicProfile",
	filename: "src/lib/publicProfile.functions.ts"
}, (opts) => getMyPublicProfile.__executeServer(opts));
var getMyPublicProfile = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getMyPublicProfile_createServerFn_handler, async ({ context }) => {
	const { data } = await context.supabase.from("public_profiles").select("*").eq("user_id", context.userId).maybeSingle();
	return data;
});
var upsertPublicProfile_createServerFn_handler = createServerRpc({
	id: "b856d74ade496ddf47f0d70d4432cd8c80725811d44989eec04dd597eebeec78",
	name: "upsertPublicProfile",
	filename: "src/lib/publicProfile.functions.ts"
}, (opts) => upsertPublicProfile.__executeServer(opts));
var upsertPublicProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	username: stringType().regex(usernameRegex, "lowercase letters, numbers, _ or -, 3-32 chars"),
	headline: stringType().max(120).nullable().optional(),
	bio: stringType().max(2e3).nullable().optional(),
	is_public: booleanType(),
	show_email: booleanType(),
	show_resume_score: booleanType(),
	show_problems: booleanType(),
	show_interview: booleanType(),
	show_badges: booleanType()
}).parse(input)).handler(upsertPublicProfile_createServerFn_handler, async ({ data, context }) => {
	const { data: row, error } = await context.supabase.from("public_profiles").upsert({
		user_id: context.userId,
		...data,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}, { onConflict: "user_id" }).select().single();
	if (error) throw new Error(error.message);
	return row;
});
var getPublicProfileByUsername_createServerFn_handler = createServerRpc({
	id: "5d2ba96e79a6f250a9c16173b38caf6b77aa7ca300d1fa995c9611327d9c6cc9",
	name: "getPublicProfileByUsername",
	filename: "src/lib/publicProfile.functions.ts"
}, (opts) => getPublicProfileByUsername.__executeServer(opts));
var getPublicProfileByUsername = createServerFn({ method: "GET" }).validator((input) => objectType({ username: stringType().min(1) }).parse(input)).handler(getPublicProfileByUsername_createServerFn_handler, async ({ data }) => {
	const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY, { auth: {
		persistSession: false,
		autoRefreshToken: false
	} });
	const { data: pp } = await supabase.from("public_profiles").select("*").eq("username", data.username).eq("is_public", true).maybeSingle();
	if (!pp) return null;
	const userId = pp.user_id;
	const [{ data: profile }, { data: bestInterview }, { count: solved }, { data: bestAts }, { data: badges }] = await Promise.all([
		supabase.from("profiles").select("full_name,email,college,degree,branch,graduation_year,skills,github,linkedin,portfolio").eq("id", userId).maybeSingle(),
		supabase.from("interviews").select("overall_score").eq("user_id", userId).eq("status", "completed").order("overall_score", { ascending: false }).limit(1).maybeSingle(),
		supabase.from("user_problem_progress").select("id", {
			count: "exact",
			head: true
		}).eq("user_id", userId).eq("status", "solved"),
		supabase.from("resume_analyses").select("ats_score").eq("user_id", userId).order("ats_score", { ascending: false }).limit(1).maybeSingle(),
		supabase.from("user_achievements").select("achievement_code, earned_at, achievements(*)").eq("user_id", userId)
	]);
	return {
		pp,
		profile: profile ?? null,
		stats: {
			problems_solved: solved ?? 0,
			best_interview: pp.show_interview ? bestInterview?.overall_score ?? null : null,
			best_ats: pp.show_resume_score ? bestAts?.ats_score ?? null : null
		},
		badges: pp.show_badges ? badges ?? [] : []
	};
});
//#endregion
export { getMyPublicProfile_createServerFn_handler, getPublicProfileByUsername_createServerFn_handler, upsertPublicProfile_createServerFn_handler };
