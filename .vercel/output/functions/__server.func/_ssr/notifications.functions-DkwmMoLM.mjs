import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CWLNe4_N.mjs";
import { ht as stringType, lt as arrayType, pt as objectType, ut as booleanType } from "../_libs/@ai-sdk/gateway+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications.functions-DkwmMoLM.js
var listNotifications = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("c017b24a4940a916334ff23b3f3461893d7b3f151e06bac76f968dd27c3f187b"));
var markRead = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => objectType({
	ids: arrayType(stringType().uuid()).optional(),
	all: booleanType().optional()
}).parse(d)).handler(createSsrRpc("e2ecc1f68f57dddaa680d1e56f33529318876089d71b0ecb31c21490b3f96daf"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => objectType({
	type: stringType().min(1).max(40),
	title: stringType().min(1).max(160),
	body: stringType().max(500).optional(),
	link: stringType().max(300).optional()
}).parse(d)).handler(createSsrRpc("cadf8c245a0ba6c3fa242d0b1680078a65669144f37900147e599084d00e6b1f"));
var deleteNotification = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("f06422965368cb200c820397c3202e17a495c2d964e585a6d01ab01406020d27"));
//#endregion
export { listNotifications as n, markRead as r, deleteNotification as t };
