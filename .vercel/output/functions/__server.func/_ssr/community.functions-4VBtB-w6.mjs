import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CWLNe4_N.mjs";
import { dt as enumType, ht as stringType, pt as objectType, ut as booleanType } from "../_libs/@ai-sdk/gateway+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/community.functions-4VBtB-w6.js
var ROOMS = [
	"DSA",
	"Resume Review",
	"Mock Interview",
	"Placement Experience",
	"General"
];
var listPosts = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	room: stringType().optional(),
	search: stringType().optional()
}).parse(input ?? {})).handler(createSsrRpc("94e899766a0c721d1b8724465f14dd02daf9582ba9fd2807659763bd59bbc446"));
var getPost = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(createSsrRpc("3dd27fa7fc60e8552afa360b16b366e8bc4fa9a37819fdad602b9d123b745c88"));
var createPost = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	room: enumType(ROOMS),
	title: stringType().trim().min(3).max(200),
	body: stringType().trim().min(5).max(8e3)
}).parse(input)).handler(createSsrRpc("ac184656e59f24eca82ff88ae9a59c2b81bf4604b4cb9f0c0ce779dec4364845"));
var addComment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	post_id: stringType().uuid(),
	body: stringType().trim().min(1).max(4e3)
}).parse(input)).handler(createSsrRpc("4432f076204f77c063c07fcf1cf87adfb73c5010426695f7f5e7d212edbace24"));
var toggleLike = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	post_id: stringType().uuid(),
	liked: booleanType()
}).parse(input)).handler(createSsrRpc("504d31aec5fccb900c5e50d7e77f296d6e2f30914f697a9a5b4c6c016722211d"));
var toggleSavePost = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	post_id: stringType().uuid(),
	saved: booleanType()
}).parse(input)).handler(createSsrRpc("1a3414d687c3912b75e3fcad8d90e1dfb27432ce41fbb212c82b760eee6c7563"));
//#endregion
export { listPosts as a, getPost as i, addComment as n, toggleLike as o, createPost as r, toggleSavePost as s, ROOMS as t };
