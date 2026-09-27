import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CWLNe4_N.mjs";
import { dt as enumType, ft as numberType, ht as stringType, lt as arrayType, pt as objectType, ut as booleanType } from "../_libs/@ai-sdk/gateway+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/recruiter.functions-DmG6WnDi.js
var amIRecruiter = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("10c57c4847c3199cc95474a24a5e0f53204195795ce99d459cdfd907edee86b0"));
var searchStudents = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	skills: arrayType(stringType()).optional(),
	search: stringType().optional(),
	minAts: numberType().int().min(0).max(100).optional()
}).parse(input ?? {})).handler(createSsrRpc("1ab9775937f1438d8ac50ea7ed359e426ae08044632da6c2b5bca64938a50b7f"));
var toggleShortlist = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	student_user_id: stringType().uuid(),
	shortlisted: booleanType()
}).parse(input)).handler(createSsrRpc("d5684d31817aba5273e431ed9a69e0ed5c5c8d5375dc4c13f80a510401ea76e3"));
var listShortlist = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("24feadfb0c990cb0b6e535154268feacb5636c19ed692a552e60900631345534"));
var SHORTLIST_STATUSES = [
	"new",
	"contacted",
	"interviewing",
	"offer",
	"rejected"
];
var updateShortlistEntry = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	student_user_id: stringType().uuid(),
	notes: stringType().max(2e3).optional(),
	status: enumType(SHORTLIST_STATUSES).optional()
}).parse(input)).handler(createSsrRpc("a76101355b23f672e02653a2ed5c4ae920fdf7e30f010c559b27db821c780315"));
//#endregion
export { updateShortlistEntry as a, toggleShortlist as i, listShortlist as n, searchStudents as r, amIRecruiter as t };
