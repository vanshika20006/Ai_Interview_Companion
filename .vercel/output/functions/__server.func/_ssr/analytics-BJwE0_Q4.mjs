import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CWLNe4_N.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { L as MessagesSquare, at as FileText, ft as CodeXml, it as Flame, l as Trophy } from "../_libs/lucide-react.mjs";
import { _ as Legend, a as YAxis, c as Line, d as Radar, f as PolarAngleAxis, g as Tooltip, h as ResponsiveContainer, i as LineChart, l as CartesianGrid, m as PolarGrid, n as RadarChart, o as XAxis, p as PolarRadiusAxis, r as BarChart, s as Area, t as AreaChart, u as Bar } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics-BJwE0_Q4.js
var import_jsx_runtime = require_jsx_runtime();
var getAnalytics = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("c491f292fda3d5d830370f062a74d0bc23cfc38facc1346ab53630f9411951c8"));
function AnalyticsPage() {
	const fetchA = useServerFn(getAnalytics);
	const { data, isLoading } = useQuery({
		queryKey: ["analytics"],
		queryFn: () => fetchA()
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3",
		children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 w-full" }, i))
	});
	if (!data) return null;
	const radar = data.interviewTrend.length ? [
		{
			dim: "Communication",
			v: avg(data.interviewTrend.map((i) => i.communication))
		},
		{
			dim: "Technical",
			v: avg(data.interviewTrend.map((i) => i.technical))
		},
		{
			dim: "Confidence",
			v: avg(data.interviewTrend.map((i) => i.confidence))
		},
		{
			dim: "Problem-Solving",
			v: avg(data.interviewTrend.map((i) => i.problem_solving))
		},
		{
			dim: "Overall",
			v: avg(data.interviewTrend.map((i) => i.overall))
		}
	] : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight",
				children: "Analytics"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Track every dimension of your placement journey."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: Flame,
						label: "Current streak",
						value: data.streak.current_streak,
						suffix: " days"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: Trophy,
						label: "Best streak",
						value: data.streak.best_streak,
						suffix: " days"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: CodeXml,
						label: "Problems solved",
						value: data.totals.solved
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: MessagesSquare,
						label: "Avg interview",
						value: data.totals.avgInterview,
						suffix: "/100"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-base flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" }), " Resume ATS Trend"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Last analyses" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "h-64",
						children: data.resumeTrend.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
								data: data.resumeTrend,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										opacity: .2
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "date",
										fontSize: 11
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										domain: [0, 100],
										fontSize: 11
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "score",
										stroke: "hsl(var(--primary))",
										strokeWidth: 2,
										dot: { r: 4 }
									})
								]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Analyze a resume to see trends" })
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-base flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeXml, { className: "h-4 w-4" }), " LeetCode Cumulative"]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "h-64",
						children: data.leetcodeTrend.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: data.leetcodeTrend,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										opacity: .2
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "date",
										fontSize: 11
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { fontSize: 11 }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "total",
										stroke: "hsl(var(--primary))",
										fill: "hsl(var(--primary) / 0.2)"
									})
								]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Solve problems to see progress" })
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-base flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessagesSquare, { className: "h-4 w-4" }), " Interview Scores"]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "h-64",
						children: data.interviewTrend.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
								data: data.interviewTrend,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										opacity: .2
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "date",
										fontSize: 11
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										domain: [0, 100],
										fontSize: 11
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "overall",
										stroke: "hsl(var(--primary))",
										strokeWidth: 2
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "technical",
										stroke: "hsl(var(--success))"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "communication",
										stroke: "hsl(var(--warning))"
									})
								]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Complete an interview to see scores" })
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Weekly Productivity"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Last 28 days" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: data.productivity,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										opacity: .2
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "date",
										fontSize: 10,
										tickFormatter: (v) => v.slice(5)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { fontSize: 11 }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "solved",
										fill: "hsl(var(--primary))"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "interviews",
										fill: "hsl(var(--accent))"
									})
								]
							})
						})
					})] }),
					radar.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "lg:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base",
							children: "Skill Radar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Average across all interviews" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "h-72",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadarChart, {
									data: radar,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolarGrid, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolarAngleAxis, {
											dataKey: "dim",
											fontSize: 11
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolarRadiusAxis, { domain: [0, 100] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radar, {
											dataKey: "v",
											stroke: "hsl(var(--primary))",
											fill: "hsl(var(--primary) / 0.3)"
										})
									]
								})
							})
						})]
					})
				]
			})
		]
	});
}
function avg(arr) {
	return arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
}
function Stat({ icon: Icon, label, value, suffix }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "flex items-center gap-3 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs uppercase text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-xl font-semibold",
			children: [value, suffix]
		})] })]
	}) });
}
function Empty({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-full items-center justify-center text-sm text-muted-foreground",
		children
	});
}
//#endregion
export { AnalyticsPage as component };
