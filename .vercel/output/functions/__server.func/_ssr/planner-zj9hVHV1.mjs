import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CWLNe4_N.mjs";
import { dt as enumType, ht as stringType, pt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { E as RefreshCw, K as LoaderCircle, _ as SkipForward, g as Sparkles, gt as CircleCheck, wt as CalendarDays } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Progress } from "./progress-DOIEKRJF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/planner-zj9hVHV1.js
var import_jsx_runtime = require_jsx_runtime();
var generateWeeklyPlan = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("7fa4b27ddf60825224fabcc2f335cd1d492e93daa41e700150470d3d8532504f"));
var getCurrentPlan = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("5831547eca494bcb978740bc68596c6cb6fa7eb77b9d78bb8ef78473d640a917"));
var updateTaskStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	task_id: stringType().uuid(),
	status: enumType([
		"pending",
		"done",
		"skipped"
	])
}).parse(input)).handler(createSsrRpc("80aff8e3e006205ef295de0ba7319a528075fafa25a498d33c0612e06b44a457"));
var DAYS = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday"
];
function PlannerPage() {
	const qc = useQueryClient();
	const fetchPlan = useServerFn(getCurrentPlan);
	const gen = useServerFn(generateWeeklyPlan);
	const update = useServerFn(updateTaskStatus);
	const { data, isLoading } = useQuery({
		queryKey: ["currentPlan"],
		queryFn: () => fetchPlan()
	});
	const genMut = useMutation({
		mutationFn: () => gen({}),
		onSuccess: () => {
			toast.success("Plan generated");
			qc.invalidateQueries({ queryKey: ["currentPlan"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const updMut = useMutation({
		mutationFn: (args) => update({ data: args }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["currentPlan"] })
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 w-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96 w-full" })]
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-2xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "flex flex-col items-center gap-4 p-12 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-elegant",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-6 w-6" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: "AI Weekly Study Planner"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-md text-sm text-muted-foreground",
					children: "Generate a personalized 7-day prep plan based on your resume, skills, and DSA progress."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "lg",
					onClick: () => genMut.mutate(),
					disabled: genMut.isPending,
					children: genMut.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), " Generating…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-2 h-4 w-4" }), " Generate my plan"] })
				})
			]
		}) })
	});
	const { plan, tasks } = data;
	const done = tasks.filter((t) => t.status === "done").length;
	const skipped = tasks.filter((t) => t.status === "skipped").length;
	const pct = tasks.length ? Math.round(done / tasks.length * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: "This week's plan"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: plan.summary
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => genMut.mutate(),
					disabled: genMut.isPending,
					children: [genMut.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-2 h-4 w-4" }), "Regenerate"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Progress: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: done }),
						" done · ",
						skipped,
						" skipped ·",
						" ",
						tasks.length - done - skipped,
						" pending"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-medium",
						children: [pct, "%"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
					value: pct,
					className: "mt-2 h-2"
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
				children: DAYS.map((d, idx) => {
					const dayTasks = tasks.filter((t) => t.day_index === idx);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "flex flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-sm",
								children: d
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
								className: "text-xs",
								children: dayTasks[0]?.topic ?? "Rest"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "space-y-2 flex-1",
							children: dayTasks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "No tasks"
							}) : dayTasks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `rounded-md border p-2 text-xs ${t.status === "done" ? "border-success/40 bg-success/5" : t.status === "skipped" ? "opacity-60" : ""}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `font-medium ${t.status === "done" ? "line-through" : ""}`,
											children: t.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "outline",
											className: "text-[9px]",
											children: [t.estimated_minutes, "m"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 text-[10px] text-muted-foreground",
										children: [t.kind, t.problem_slug ? ` · ${t.problem_slug}` : ""]
									}),
									t.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1.5 flex gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "ghost",
											className: "h-6 px-2 text-[10px]",
											onClick: () => updMut.mutate({
												task_id: t.id,
												status: "done"
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-1 h-3 w-3" }), " Done"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "ghost",
											className: "h-6 px-2 text-[10px]",
											onClick: () => updMut.mutate({
												task_id: t.id,
												status: "skipped"
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { className: "mr-1 h-3 w-3" }), " Skip"]
										})]
									})
								]
							}, t.id))
						})]
					}, d);
				})
			})
		]
	});
}
//#endregion
export { PlannerPage as component };
