import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CWLNe4_N.mjs";
import { ht as stringType, pt as objectType, ut as booleanType } from "../_libs/@ai-sdk/gateway+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/publicProfile.functions-BAPo4zox.js
var usernameRegex = /^[a-z0-9_-]{3,32}$/;
var getMyPublicProfile = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("51706e5960a4f9303e13982f894b0be1c1e2b28d0d811d5834e09eb8b039ff80"));
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
}).parse(input)).handler(createSsrRpc("b856d74ade496ddf47f0d70d4432cd8c80725811d44989eec04dd597eebeec78"));
var getPublicProfileByUsername = createServerFn({ method: "GET" }).validator((input) => objectType({ username: stringType().min(1) }).parse(input)).handler(createSsrRpc("5d2ba96e79a6f250a9c16173b38caf6b77aa7ca300d1fa995c9611327d9c6cc9"));
//#endregion
export { getPublicProfileByUsername as n, upsertPublicProfile as r, getMyPublicProfile as t };
