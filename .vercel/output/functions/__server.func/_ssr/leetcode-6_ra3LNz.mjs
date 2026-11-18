import { _ as lazyRouteComponent, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { ht as stringType, pt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leetcode-6_ra3LNz.js
var $$splitComponentImporter = () => import("./leetcode-DN12ryHY.mjs");
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
