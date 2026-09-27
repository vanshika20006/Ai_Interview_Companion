import { o as __toESM } from "../_runtime.mjs";
import { s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CWLNe4_N.mjs";
import { dt as enumType, gt as unknownType, ht as stringType, mt as recordType, pt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { Et as Briefcase, L as MessagesSquare, Ot as Bookmark, at as FileText, ct as ExternalLink, d as Trash2, ft as CodeXml, g as Sparkles } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { i as TabsTrigger, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bookmarks-CEhMySR5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ITEM_TYPES = [
	"job",
	"post",
	"problem",
	"interview",
	"resource"
];
var toggleSchema = objectType({
	item_type: enumType(ITEM_TYPES),
	item_id: stringType().min(1).max(200),
	title: stringType().min(1).max(300),
	subtitle: stringType().max(500).optional().nullable(),
	url: stringType().max(1e3).optional().nullable(),
	metadata: recordType(unknownType()).optional()
});
var listBookmarks = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ item_type: enumType(ITEM_TYPES).optional() }).parse(input ?? {})).handler(createSsrRpc("b93ad6471012e3db8e69819304c7a2c13f32937e5aafdb3ace07d91e38123dd6"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => toggleSchema.parse(input)).handler(createSsrRpc("4b1c9af19f43548f9eb9a9ec1e4116c814e648894b0c041d136e0bc5e644eda5"));
var removeBookmark = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(createSsrRpc("6d40a7caf482c5f9f3e2661c50c6d2e30f0a238703207554e7cfaf4d2cc2b8ae"));
var TYPE_META = {
	job: {
		label: "Jobs",
		icon: Briefcase
	},
	post: {
		label: "Community",
		icon: MessagesSquare
	},
	problem: {
		label: "Problems",
		icon: CodeXml
	},
	interview: {
		label: "Interviews",
		icon: MessagesSquare
	},
	resource: {
		label: "Resources",
		icon: FileText
	}
};
function BookmarksPage() {
	const qc = useQueryClient();
	const fetchBookmarks = useServerFn(listBookmarks);
	const removeFn = useServerFn(removeBookmark);
	const [tab, setTab] = (0, import_react.useState)("all");
	const { data, isLoading } = useQuery({
		queryKey: ["bookmarks"],
		queryFn: () => fetchBookmarks({ data: {} })
	});
	const del = useMutation({
		mutationFn: (id) => removeFn({ data: { id } }),
		onSuccess: () => {
			toast.success("Removed");
			qc.invalidateQueries({ queryKey: ["bookmarks"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const filtered = (data ?? []).filter((b) => tab === "all" || b.item_type === tab);
	const counts = (data ?? []).reduce((acc, b) => {
		acc[b.item_type] = (acc[b.item_type] ?? 0) + 1;
		return acc;
	}, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "flex items-center gap-2 text-2xl font-semibold tracking-tight",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "h-6 w-6 text-primary" }), " Bookmarks"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Saved jobs, problems, posts and resources in one place."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
				value: tab,
				onValueChange: setTab,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "flex flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
						value: "all",
						children: [
							"All",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: "ml-1.5",
								children: data?.length ?? 0
							})
						]
					}), Object.entries(TYPE_META).map(([k, m]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
						value: k,
						children: [
							m.label,
							" ",
							counts[k] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: "ml-1.5",
								children: counts[k]
							}) : null
						]
					}, k))]
				})
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 w-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 w-full" })]
			}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex flex-col items-center gap-3 py-12 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-8 w-8 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: "Nothing saved yet"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-muted-foreground",
						children: "Bookmark items from Jobs, Community or your roadmap to keep them handy."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/jobs",
								children: "Browse jobs"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/leetcode",
								children: "Open roadmap"
							})
						})]
					})
				]
			}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: filtered.map((b) => {
					const meta = TYPE_META[b.item_type] ?? {
						label: b.item_type,
						icon: Bookmark
					};
					const Icon = meta.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "group transition-shadow hover:shadow-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
							className: "pb-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-0.5 flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
										className: "text-base font-medium leading-tight",
										children: b.title
									}), b.subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
										className: "mt-0.5",
										children: b.subtitle
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									className: "opacity-60 hover:opacity-100",
									onClick: () => del.mutate(b.id),
									"aria-label": "Remove bookmark",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "flex items-center justify-between pt-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: "text-[10px]",
								children: meta.label
							}), b.url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								variant: "ghost",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: b.url,
									target: "_blank",
									rel: "noopener noreferrer",
									children: ["Open ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "ml-1.5 h-3.5 w-3.5" })]
								})
							})]
						})]
					}, b.id);
				})
			})
		]
	});
}
//#endregion
export { BookmarksPage as component };
