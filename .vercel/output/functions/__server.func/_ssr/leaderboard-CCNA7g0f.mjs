import { o as __toESM } from "../_runtime.mjs";
import { s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as getLeaderboard } from "./gamification.functions-Bf-fnQqq.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { ut as Crown, z as Medal } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { i as TabsTrigger, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leaderboard-CCNA7g0f.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LeaderboardPage() {
	const fetchLb = useServerFn(getLeaderboard);
	const [scope, setScope] = (0, import_react.useState)("weekly");
	const [metric, setMetric] = (0, import_react.useState)("problems");
	const { data, isLoading } = useQuery({
		queryKey: [
			"leaderboard",
			scope,
			metric
		],
		queryFn: () => fetchLb({ data: {
			scope,
			metric
		} })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight",
				children: "Leaderboard"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Top performers across the community."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
					value: scope,
					onValueChange: (v) => setScope(v),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "weekly",
							children: "Weekly"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "monthly",
							children: "Monthly"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "all_time",
							children: "All time"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
					value: metric,
					onValueChange: (v) => setMetric(v),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "problems",
							children: "Problems"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "interview",
							children: "Interview"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "activity",
							children: "Activity"
						})
					] })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "text-base flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Medal, { className: "h-4 w-4 text-primary" }), " Ranking"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, { children: ["By ", data?.label ?? "—"] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full" }, i))
			}) : !data?.entries.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-8 text-center text-sm text-muted-foreground",
				children: "No data yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "space-y-2",
				children: data.entries.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: `flex items-center gap-3 rounded-lg border p-3 ${i < 3 ? "border-primary/30 bg-primary/5" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm ${i === 0 ? "bg-yellow-500/20 text-yellow-600" : i === 1 ? "bg-zinc-400/20 text-zinc-600" : i === 2 ? "bg-orange-500/20 text-orange-600" : "bg-muted text-muted-foreground"}`,
							children: i < 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-4 w-4" }) : i + 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 min-w-0",
							children: e.username ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/u/$username",
								params: { username: e.username },
								className: "font-medium hover:underline",
								children: e.full_name ?? `@${e.username}`
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: e.full_name ?? "Anonymous"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: e.score })
					]
				}, e.user_id))
			}) })] })
		]
	});
}
//#endregion
export { LeaderboardPage as component };
