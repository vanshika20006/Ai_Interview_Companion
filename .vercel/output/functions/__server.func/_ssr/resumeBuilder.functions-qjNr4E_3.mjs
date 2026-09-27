import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { dt as enumType, ht as stringType, lt as arrayType, pt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/resumeBuilder.functions-qjNr4E_3.js
var linkSchema = objectType({
	label: stringType().max(60),
	url: stringType().max(300)
});
var dataSchema = objectType({
	personal: objectType({
		full_name: stringType().max(120).default(""),
		headline: stringType().max(160).default(""),
		email: stringType().max(160).default(""),
		phone: stringType().max(40).default(""),
		location: stringType().max(120).default(""),
		links: arrayType(linkSchema).default([]),
		summary: stringType().max(2e3).default("")
	}).default({}),
	education: arrayType(objectType({
		school: stringType().max(160).default(""),
		degree: stringType().max(160).default(""),
		field: stringType().max(160).default(""),
		start: stringType().max(40).default(""),
		end: stringType().max(40).default(""),
		score: stringType().max(60).default("")
	})).default([]),
	experience: arrayType(objectType({
		company: stringType().max(160).default(""),
		role: stringType().max(160).default(""),
		location: stringType().max(120).default(""),
		start: stringType().max(40).default(""),
		end: stringType().max(40).default(""),
		bullets: arrayType(stringType().max(400)).default([])
	})).default([]),
	projects: arrayType(objectType({
		name: stringType().max(160).default(""),
		tech: stringType().max(240).default(""),
		link: stringType().max(300).default(""),
		bullets: arrayType(stringType().max(400)).default([])
	})).default([]),
	skills: arrayType(stringType().max(60)).default([]),
	achievements: arrayType(stringType().max(400)).default([])
});
var listBuilderResumes_createServerFn_handler = createServerRpc({
	id: "f096f1e331042bb3f1faf2275a13dba60ee3fcae851f8d48c150c0f2349b8f8a",
	name: "listBuilderResumes",
	filename: "src/lib/resumeBuilder.functions.ts"
}, (opts) => listBuilderResumes.__executeServer(opts));
var listBuilderResumes = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listBuilderResumes_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("resume_builder_resumes").select("id, title, template, updated_at").eq("user_id", context.userId).order("updated_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data ?? [];
});
var getBuilderResume_createServerFn_handler = createServerRpc({
	id: "209a140627e100399c434f936e3d0b1ce16a63eb4bd8872a14890c1152dd2de6",
	name: "getBuilderResume",
	filename: "src/lib/resumeBuilder.functions.ts"
}, (opts) => getBuilderResume.__executeServer(opts));
var getBuilderResume = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator((i) => objectType({ id: stringType().uuid() }).parse(i)).handler(getBuilderResume_createServerFn_handler, async ({ data, context }) => {
	const { data: row, error } = await context.supabase.from("resume_builder_resumes").select("*").eq("user_id", context.userId).eq("id", data.id).maybeSingle();
	if (error) throw new Error(error.message);
	return row;
});
var createBuilderResume_createServerFn_handler = createServerRpc({
	id: "f932973ad63dbbbb61de15132b2d3bd879e23dabb5489fd0c717989f2f597fe6",
	name: "createBuilderResume",
	filename: "src/lib/resumeBuilder.functions.ts"
}, (opts) => createBuilderResume.__executeServer(opts));
var createBuilderResume = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((i) => objectType({
	title: stringType().min(1).max(120).default("Untitled resume"),
	template: enumType([
		"modern",
		"minimal",
		"compact"
	]).default("modern")
}).parse(i)).handler(createBuilderResume_createServerFn_handler, async ({ data, context }) => {
	const empty = dataSchema.parse({});
	const { data: row, error } = await context.supabase.from("resume_builder_resumes").insert({
		user_id: context.userId,
		title: data.title,
		template: data.template,
		data: empty
	}).select().single();
	if (error) throw new Error(error.message);
	return row;
});
var updateBuilderResume_createServerFn_handler = createServerRpc({
	id: "9d9cd5ee5ec54bcbdb748da2d9b672540ba95e9aa0a530b928763b3ede9d4e60",
	name: "updateBuilderResume",
	filename: "src/lib/resumeBuilder.functions.ts"
}, (opts) => updateBuilderResume.__executeServer(opts));
var updateBuilderResume = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((i) => objectType({
	id: stringType().uuid(),
	title: stringType().min(1).max(120).optional(),
	template: enumType([
		"modern",
		"minimal",
		"compact"
	]).optional(),
	data: dataSchema.optional()
}).parse(i)).handler(updateBuilderResume_createServerFn_handler, async ({ data, context }) => {
	const update = { updated_at: (/* @__PURE__ */ new Date()).toISOString() };
	if (data.title !== void 0) update.title = data.title;
	if (data.template !== void 0) update.template = data.template;
	if (data.data !== void 0) update.data = data.data;
	const { data: row, error } = await context.supabase.from("resume_builder_resumes").update(update).eq("user_id", context.userId).eq("id", data.id).select().single();
	if (error) throw new Error(error.message);
	return row;
});
var deleteBuilderResume_createServerFn_handler = createServerRpc({
	id: "c2928ea06e2c3fd3e94f1a218cebb9230ee331686ea8ddc791c453c9a795620a",
	name: "deleteBuilderResume",
	filename: "src/lib/resumeBuilder.functions.ts"
}, (opts) => deleteBuilderResume.__executeServer(opts));
var deleteBuilderResume = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((i) => objectType({ id: stringType().uuid() }).parse(i)).handler(deleteBuilderResume_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("resume_builder_resumes").delete().eq("user_id", context.userId).eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { createBuilderResume_createServerFn_handler, deleteBuilderResume_createServerFn_handler, getBuilderResume_createServerFn_handler, listBuilderResumes_createServerFn_handler, updateBuilderResume_createServerFn_handler };
