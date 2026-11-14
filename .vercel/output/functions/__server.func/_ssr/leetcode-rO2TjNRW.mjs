import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { ht as stringType, pt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leetcode-rO2TjNRW.js
var $$splitComponentImporter = () => import("./leetcode-CxgIqtOJ.mjs");
var searchSchema = objectType({
	topic: stringType().optional(),
	difficulty: stringType().optional()
});
var Route = createFileRoute("/_authenticated/leetcode")({
	head: () => ({ meta: [{ title: "LeetCode Roadmap — Placement AI" }] }),
	validateSearch: searchSchema,
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
