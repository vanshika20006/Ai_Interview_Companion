import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { dt as enumType, ft as numberType, ht as stringType, pt as objectType, ut as booleanType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
import { t as recordActivity } from "./activity.server-Bu1-YV1D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leetcode.functions-BEdKixll.js
var getProblemProgress_createServerFn_handler = createServerRpc({
	id: "4a97cdfde31a12981bd6f026476e9b08b5010a56e78f6c15ed200c0d13e48dbf",
	name: "getProblemProgress",
	filename: "src/lib/leetcode.functions.ts"
}, (opts) => getProblemProgress.__executeServer(opts));
var getProblemProgress = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getProblemProgress_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("user_problem_progress").select("*").eq("user_id", context.userId);
	if (error) throw new Error(error.message);
	return data ?? [];
});
var upsertSchema = objectType({
	problem_slug: stringType().min(1).max(120),
	status: enumType([
		"not_started",
		"in_progress",
		"solved"
	]).optional(),
	revision_count: numberType().int().min(0).max(999).optional(),
	bookmarked: booleanType().optional(),
	notes: stringType().max(5e3).nullable().optional()
});
var upsertProblemProgress_createServerFn_handler = createServerRpc({
	id: "38c2af4a94f0ca4a476a9d9eb1e53a43e66fa4b3ddc52aa1c7f36642f6b591eb",
	name: "upsertProblemProgress",
	filename: "src/lib/leetcode.functions.ts"
}, (opts) => upsertProblemProgress.__executeServer(opts));
var upsertProblemProgress = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => upsertSchema.parse(input)).handler(upsertProblemProgress_createServerFn_handler, async ({ data, context }) => {
	const payload = {
		user_id: context.userId,
		problem_slug: data.problem_slug,
		...data.status !== void 0 ? { status: data.status } : {},
		...data.status === "solved" ? { solved_at: (/* @__PURE__ */ new Date()).toISOString() } : {},
		...data.revision_count !== void 0 ? { revision_count: data.revision_count } : {},
		...data.bookmarked !== void 0 ? { bookmarked: data.bookmarked } : {},
		...data.notes !== void 0 ? { notes: data.notes } : {}
	};
	const { data: row, error } = await context.supabase.from("user_problem_progress").upsert(payload, { onConflict: "user_id,problem_slug" }).select().maybeSingle();
	if (error) throw new Error(error.message);
	if (data.status === "solved") await recordActivity(context.supabase, context.userId);
	return row;
});
//#endregion
export { getProblemProgress_createServerFn_handler, upsertProblemProgress_createServerFn_handler };
