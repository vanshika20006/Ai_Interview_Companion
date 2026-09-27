import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CWLNe4_N.mjs";
import { dt as enumType, ht as stringType, pt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/codeReview.functions-BU4v6MlK.js
var LangSchema = enumType([
	"javascript",
	"typescript",
	"python",
	"java",
	"cpp",
	"go",
	"rust",
	"csharp",
	"sql"
]);
var listReviews = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("8f9727296c19885f613b204d51f3e5416ffb73428bf36b765dcf05d107d70048"));
var getReview = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("c06d770edd464f1f17dc17211ca3ef45b5a0a84692f62bc12dcc36a6ac221679"));
var createReview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => objectType({
	title: stringType().min(3).max(140),
	language: LangSchema,
	code: stringType().min(10).max(2e4),
	description: stringType().max(2e3).optional()
}).parse(d)).handler(createSsrRpc("a8971ffaae225b916dcf41b627118e2c986be85d7212a61f88e1e4bec9eef087"));
var addReviewComment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => objectType({
	reviewId: stringType().uuid(),
	body: stringType().min(1).max(2e3)
}).parse(d)).handler(createSsrRpc("9466f09f5c236e258d5cefbfb4de702588a4ba5eeab1fd618a7d8f659ed1ab8b"));
//#endregion
export { listReviews as i, createReview as n, getReview as r, addReviewComment as t };
