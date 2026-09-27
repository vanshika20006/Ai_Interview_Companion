import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CWLNe4_N.mjs";
import { dt as enumType, ft as numberType, ht as stringType, pt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/interview.functions-BHOOSDg0.js
var ROLES = [
	"Frontend Developer",
	"Backend Developer",
	"Full Stack Developer",
	"SDE",
	"Data Analyst"
];
var DIFFICULTIES = [
	"Easy",
	"Medium",
	"Hard"
];
var TYPES = [
	"Technical",
	"HR",
	"Behavioral",
	"System Design"
];
var startInterview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	role: enumType(ROLES),
	difficulty: enumType(DIFFICULTIES),
	interview_type: enumType(TYPES),
	total_questions: numberType().int().min(3).max(8).default(5)
}).parse(input)).handler(createSsrRpc("6fffea624c23763185d8883bc71dc6641e1b007518aad1b3c890fd60ad8bc926"));
var submitAnswer = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	answer_id: stringType().uuid(),
	answer_text: stringType().min(1).max(8e3)
}).parse(input)).handler(createSsrRpc("8ab63f8c7ad7b6c5cbc1638767c518a46b72f5229345c810410a97461fc27e10"));
var completeInterview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ interview_id: stringType().uuid() }).parse(input)).handler(createSsrRpc("c4036c5b6a87116fb06b0bfdc104ec275fcf48f826db38937b316ef9983ce17c"));
var getInterview = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(createSsrRpc("20a75281ee124a3eca0a9f0750034de7e9b37a2ee573411fbb6a9d4763d548e5"));
var listInterviews = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("0b475ddb4ec72a18be61a89cf94267abe82da347927e181ad568eaa81b6d3442"));
var deleteInterview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(createSsrRpc("349d19e3833204543da40a783ac37ad28a947785ea58de735a9059cb37f5c007"));
var getInterviewAnalytics = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("54b469af2c186fcfad579885bdc62e53265eed519c317c09d46fcde1d08df0a0"));
//#endregion
export { listInterviews as a, getInterviewAnalytics as i, deleteInterview as n, startInterview as o, getInterview as r, submitAnswer as s, completeInterview as t };
