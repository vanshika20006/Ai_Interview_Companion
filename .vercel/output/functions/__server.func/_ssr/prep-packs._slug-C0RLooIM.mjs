import { _ as lazyRouteComponent, qt as notFound, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as findPrepPack } from "./company-prep-2iY1fmFi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/prep-packs._slug-C0RLooIM.js
var $$splitErrorComponentImporter = () => import("./prep-packs._slug-hU6HgBFB.mjs");
var $$splitNotFoundComponentImporter = () => import("./prep-packs._slug-BaY9WZYb.mjs");
var $$splitComponentImporter = () => import("./prep-packs._slug-CX3OIPfZ.mjs");
var Route = createFileRoute("/_authenticated/prep-packs/$slug")({
	head: ({ params }) => ({ meta: [{ title: `${params.slug} prep — Placement AI` }] }),
	loader: ({ params }) => {
		const pack = findPrepPack(params.slug);
		if (!pack) throw notFound();
		return pack;
	},
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
//#endregion
export { Route as t };
