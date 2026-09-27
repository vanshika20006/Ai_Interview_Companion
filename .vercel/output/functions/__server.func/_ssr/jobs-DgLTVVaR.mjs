import { o as __toESM } from "../_runtime.mjs";
import { s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CWLNe4_N.mjs";
import { ht as stringType, pt as objectType, ut as booleanType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { B as MapPin, Et as Briefcase, K as LoaderCircle, Ot as Bookmark, Tt as Building2, ct as ExternalLink, g as Sparkles, kt as BookmarkCheck } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { i as TabsTrigger, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/jobs-DgLTVVaR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var generateJobRecommendations = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("37f329fd0b035d7859cb6dd0043634c5f0bd1cdc6bd6cafaeba6cbba42f18c15"));
var listJobs = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("0f6b44b459f0f5a7154aecdbd6de5f39fc93825d0d32caf19f26936089e5a107"));
var toggleSaveJob = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	id: stringType().uuid(),
	saved: booleanType()
}).parse(input)).handler(createSsrRpc("702b9359b7913381e3b818f46684f0ed1b39bd979cdfa85f3856c27775156b6e"));
var FILTERS = [
	"All",
	"Internship",
	"Full Time",
	"Fresher",
	"Saved"
];
function JobsPage() {
	const qc = useQueryClient();
	const fetchJobs = useServerFn(listJobs);
	const gen = useServerFn(generateJobRecommendations);
	const save = useServerFn(toggleSaveJob);
	const [filter, setFilter] = (0, import_react.useState)("All");
	const { data: jobs, isLoading } = useQuery({
		queryKey: ["jobs"],
		queryFn: () => fetchJobs()
	});
	const genMut = useMutation({
		mutationFn: () => gen({}),
		onSuccess: (r) => {
			toast.success(`${r.count} new jobs matched`);
			qc.invalidateQueries({ queryKey: ["jobs"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const saveMut = useMutation({
		mutationFn: (args) => save({ data: args }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] })
	});
	const filtered = (0, import_react.useMemo)(() => {
		const j = jobs ?? [];
		if (filter === "All") return j;
		if (filter === "Saved") return j.filter((x) => x.saved);
		return j.filter((x) => x.employment_type === filter);
	}, [jobs, filter]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: "Smart Job Matches"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "AI-curated opportunities based on your skills, resume, and DSA progress."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => genMut.mutate(),
					disabled: genMut.isPending,
					children: genMut.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), " Matching…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-2 h-4 w-4" }), " Refresh matches"] })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
				value: filter,
				onValueChange: setFilter,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, { children: FILTERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: f,
					children: f
				}, f)) })
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 w-full" }, i))
			}) : !filtered.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex flex-col items-center gap-3 p-12 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: jobs?.length ? "No jobs match this filter." : "No jobs yet — click 'Refresh matches' to generate."
				})]
			}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: filtered.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "flex flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base",
							children: j.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
							className: "flex items-center gap-2 mt-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3.5 w-3.5" }),
								j.company,
								j.location ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "opacity-40",
										children: "·"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5" }),
									j.location
								] }) : null
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-end gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: j.match_pct >= 80 ? "default" : j.match_pct >= 60 ? "secondary" : "outline",
								children: [j.match_pct, "% match"]
							}), j.employment_type && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "text-[10px]",
								children: j.employment_type
							})]
						})]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-3 flex-1 flex flex-col",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground line-clamp-3",
								children: j.description
							}),
							j.matched_skills?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] font-semibold uppercase text-success mb-1",
								children: "Matched skills"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1",
								children: j.matched_skills.slice(0, 6).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: "text-[10px]",
									children: s
								}, s))
							})] }),
							j.missing_skills?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] font-semibold uppercase text-warning mb-1",
								children: "Missing skills"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1",
								children: j.missing_skills.slice(0, 5).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[10px] border-warning/40",
									children: s
								}, s))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 pt-2 mt-auto",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "sm",
									className: "flex-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: j.apply_url ?? "#",
										target: "_blank",
										rel: "noopener noreferrer",
										children: ["Apply ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "ml-1.5 h-3 w-3" })]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => saveMut.mutate({
										id: j.id,
										saved: !j.saved
									}),
									children: j.saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkCheck, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "h-4 w-4" })
								})]
							})
						]
					})]
				}, j.id))
			})
		]
	});
}
//#endregion
export { JobsPage as component };
