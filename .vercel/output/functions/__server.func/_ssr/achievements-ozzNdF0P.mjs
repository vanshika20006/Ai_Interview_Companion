import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { n as getMyAchievements, r as getMyStreak } from "./gamification.functions-Bf-fnQqq.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { Mt as Award, it as Flame, l as Trophy, t as lucide_react_exports } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/achievements-ozzNdF0P.js
var import_jsx_runtime = require_jsx_runtime();
function AchievementsPage() {
	const fetchA = useServerFn(getMyAchievements);
	const fetchS = useServerFn(getMyStreak);
	const { data: ach, isLoading } = useQuery({
		queryKey: ["achievements"],
		queryFn: () => fetchA()
	});
	const { data: streak } = useQuery({
		queryKey: ["streak"],
		queryFn: () => fetchS()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight",
				children: "Achievements"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Badges and streaks earned through consistent practice."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex items-center gap-3 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-12 w-12 items-center justify-center rounded-xl bg-warning/15 text-warning",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase text-muted-foreground",
							children: "Current streak"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-2xl font-semibold",
							children: [streak?.current_streak ?? 0, " days"]
						})] })]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex items-center gap-3 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase text-muted-foreground",
							children: "Best streak"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-2xl font-semibold",
							children: [streak?.best_streak ?? 0, " days"]
						})] })]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex items-center gap-3 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase text-muted-foreground",
							children: "Badges earned"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-2xl font-semibold",
							children: [
								ach?.filter((a) => a.earned_at).length ?? 0,
								"/",
								ach?.length ?? 0
							]
						})] })]
					}) })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Badge collection" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Earn by hitting milestones across the app." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-4",
				children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-32" }, i))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-3 lg:grid-cols-4",
				children: ach?.map((a) => {
					const Icon = lucide_react_exports[a.icon] ?? Trophy;
					const earned = !!a.earned_at;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `rounded-xl border p-4 text-center transition ${earned ? "bg-gradient-to-br from-primary/10 to-accent border-primary/30 shadow-sm" : "opacity-50 grayscale"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${earned ? "bg-primary/15 text-primary" : "bg-muted"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold",
								children: a.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-xs text-muted-foreground",
								children: a.description
							}),
							earned && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 text-[10px] uppercase tracking-wider text-primary",
								children: "Earned"
							})
						]
					}, a.code);
				})
			}) })] })
		]
	});
}
//#endregion
export { AchievementsPage as component };
