import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { At as BookOpen, I as MessageSquare, Pt as ArrowRight, Tt as Building2, q as ListChecks } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as PREP_PACKS } from "./company-prep-2iY1fmFi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/prep-packs.index-CfBVJgpF.js
var import_jsx_runtime = require_jsx_runtime();
function PrepPacksPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "flex items-center gap-2 text-2xl font-semibold tracking-tight",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-6 w-6" }), " Company Prep Packs"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Curated problem sets, behavioral questions, and insider tips for top companies."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
				children: PREP_PACKS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "overflow-hidden transition-shadow hover:shadow-elegant",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-16 bg-gradient-to-r ${p.color}` }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: p.company }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									children: p.tag
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, { children: [
								p.rounds.length,
								" rounds · ",
								p.problems.length,
								" problems"
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/prep-packs/$slug",
							params: { slug: p.slug },
							className: "inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline",
							children: ["Open pack ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
						}) })
					]
				}, p.slug))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeaturePill, {
						icon: ListChecks,
						title: "Problem sets",
						body: "Hand-picked problems per company."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeaturePill, {
						icon: MessageSquare,
						title: "Behavioral",
						body: "Real questions & LP tags."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeaturePill, {
						icon: BookOpen,
						title: "Insider tips",
						body: "What graders actually look for."
					})
				]
			})
		]
	});
}
function FeaturePill({ icon: Icon, title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "flex items-start gap-3 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-medium",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: body
		})] })]
	}) });
}
//#endregion
export { PrepPacksPage as component };
