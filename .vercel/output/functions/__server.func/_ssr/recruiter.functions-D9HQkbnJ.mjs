import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { dt as enumType, ft as numberType, ht as stringType, lt as arrayType, pt as objectType, ut as booleanType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/recruiter.functions-D9HQkbnJ.js
var amIRecruiter_createServerFn_handler = createServerRpc({
	id: "10c57c4847c3199cc95474a24a5e0f53204195795ce99d459cdfd907edee86b0",
	name: "amIRecruiter",
	filename: "src/lib/recruiter.functions.ts"
}, (opts) => amIRecruiter.__executeServer(opts));
var amIRecruiter = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(amIRecruiter_createServerFn_handler, async ({ context }) => {
	const { data } = await context.supabase.rpc("has_role", {
		_user_id: context.userId,
		_role: "recruiter"
	});
	return !!data;
});
var searchStudents_createServerFn_handler = createServerRpc({
	id: "1ab9775937f1438d8ac50ea7ed359e426ae08044632da6c2b5bca64938a50b7f",
	name: "searchStudents",
	filename: "src/lib/recruiter.functions.ts"
}, (opts) => searchStudents.__executeServer(opts));
var searchStudents = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	skills: arrayType(stringType()).optional(),
	search: stringType().optional(),
	minAts: numberType().int().min(0).max(100).optional()
}).parse(input ?? {})).handler(searchStudents_createServerFn_handler, async ({ data, context }) => {
	const { data: isRecruiter } = await context.supabase.rpc("has_role", {
		_user_id: context.userId,
		_role: "recruiter"
	});
	if (!isRecruiter) throw new Error("Recruiter role required");
	let pq = context.supabase.from("profiles").select("id,full_name,college,degree,branch,graduation_year,skills").limit(60);
	if (data.search) pq = pq.ilike("full_name", `%${data.search}%`);
	const { data: profiles } = await pq;
	const ids = (profiles ?? []).map((p) => p.id);
	if (!ids.length) return [];
	const [{ data: pps }, { data: scores }, { data: solved }] = await Promise.all([
		context.supabase.from("public_profiles").select("user_id,username,headline").in("user_id", ids),
		context.supabase.from("resume_analyses").select("user_id,ats_score").in("user_id", ids),
		context.supabase.from("user_problem_progress").select("user_id,status").in("user_id", ids)
	]);
	const ppMap = new Map((pps ?? []).map((p) => [p.user_id, p]));
	const bestAts = /* @__PURE__ */ new Map();
	for (const s of scores ?? []) bestAts.set(s.user_id, Math.max(bestAts.get(s.user_id) ?? 0, s.ats_score));
	const solvedCount = /* @__PURE__ */ new Map();
	for (const s of solved ?? []) if (s.status === "solved") solvedCount.set(s.user_id, (solvedCount.get(s.user_id) ?? 0) + 1);
	let students = (profiles ?? []).map((prof) => {
		const pp = ppMap.get(prof.id);
		return {
			user_id: prof.id,
			username: pp?.username ?? null,
			headline: pp?.headline ?? null,
			full_name: prof.full_name ?? null,
			college: prof.college ?? null,
			degree: prof.degree ?? null,
			branch: prof.branch ?? null,
			graduation_year: prof.graduation_year ?? null,
			skills: prof.skills ?? [],
			ats: bestAts.get(prof.id) ?? 0,
			problems_solved: solvedCount.get(prof.id) ?? 0
		};
	});
	if (data.skills?.length) {
		const wanted = data.skills.map((s) => s.toLowerCase());
		students = students.filter((s) => wanted.some((w) => (s.skills ?? []).some((k) => k.toLowerCase().includes(w))));
	}
	if (data.minAts) students = students.filter((s) => s.ats >= data.minAts);
	return students;
});
var toggleShortlist_createServerFn_handler = createServerRpc({
	id: "d5684d31817aba5273e431ed9a69e0ed5c5c8d5375dc4c13f80a510401ea76e3",
	name: "toggleShortlist",
	filename: "src/lib/recruiter.functions.ts"
}, (opts) => toggleShortlist.__executeServer(opts));
var toggleShortlist = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	student_user_id: stringType().uuid(),
	shortlisted: booleanType()
}).parse(input)).handler(toggleShortlist_createServerFn_handler, async ({ data, context }) => {
	if (data.shortlisted) await context.supabase.from("recruiter_shortlists").delete().eq("recruiter_id", context.userId).eq("student_user_id", data.student_user_id);
	else await context.supabase.from("recruiter_shortlists").insert({
		recruiter_id: context.userId,
		student_user_id: data.student_user_id
	});
	return { ok: true };
});
var listShortlist_createServerFn_handler = createServerRpc({
	id: "24feadfb0c990cb0b6e535154268feacb5636c19ed692a552e60900631345534",
	name: "listShortlist",
	filename: "src/lib/recruiter.functions.ts"
}, (opts) => listShortlist.__executeServer(opts));
var listShortlist = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listShortlist_createServerFn_handler, async ({ context }) => {
	const { data } = await context.supabase.from("recruiter_shortlists").select("student_user_id, notes, status, updated_at").eq("recruiter_id", context.userId);
	return data ?? [];
});
var SHORTLIST_STATUSES = [
	"new",
	"contacted",
	"interviewing",
	"offer",
	"rejected"
];
var updateShortlistEntry_createServerFn_handler = createServerRpc({
	id: "a76101355b23f672e02653a2ed5c4ae920fdf7e30f010c559b27db821c780315",
	name: "updateShortlistEntry",
	filename: "src/lib/recruiter.functions.ts"
}, (opts) => updateShortlistEntry.__executeServer(opts));
var updateShortlistEntry = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	student_user_id: stringType().uuid(),
	notes: stringType().max(2e3).optional(),
	status: enumType(SHORTLIST_STATUSES).optional()
}).parse(input)).handler(updateShortlistEntry_createServerFn_handler, async ({ data, context }) => {
	const patch = {};
	if (data.notes !== void 0) patch.notes = data.notes;
	if (data.status !== void 0) patch.status = data.status;
	if (!Object.keys(patch).length) return { ok: true };
	const { error } = await context.supabase.from("recruiter_shortlists").update(patch).eq("recruiter_id", context.userId).eq("student_user_id", data.student_user_id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { amIRecruiter_createServerFn_handler, listShortlist_createServerFn_handler, searchStudents_createServerFn_handler, toggleShortlist_createServerFn_handler, updateShortlistEntry_createServerFn_handler };
