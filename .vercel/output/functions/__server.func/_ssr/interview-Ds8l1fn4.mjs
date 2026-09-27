import { o as __toESM } from "../_runtime.mjs";
import { s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { K as LoaderCircle, L as MessagesSquare, d as Trash2, k as Play, l as Trophy, pt as Clock, u as TrendingUp } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { t as formatDistanceToNow } from "../_libs/date-fns.mjs";
import { a as listInterviews, i as getInterviewAnalytics, n as deleteInterview, o as startInterview } from "./interview.functions-BHOOSDg0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/interview-Ds8l1fn4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ROLES = [
	"Frontend Developer",
	"Backend Developer",
	"Full Stack Developer",
	"SDE",
	"Data Analyst"
];
var DIFFICULTIES = [
	"Easy",
	"Medium",
	"Hard"
];
var TYPES = [
	"Technical",
	"HR",
	"Behavioral",
	"System Design"
];
function InterviewPage() {
	const navigate = useNavigate();
	const qc = useQueryClient();
	const fetchList = useServerFn(listInterviews);
	const fetchAnalytics = useServerFn(getInterviewAnalytics);
	const start = useServerFn(startInterview);
	const remove = useServerFn(deleteInterview);
	const [role, setRole] = (0, import_react.useState)("Full Stack Developer");
	const [difficulty, setDifficulty] = (0, import_react.useState)("Medium");
	const [type, setType] = (0, import_react.useState)("Technical");
	const [count, setCount] = (0, import_react.useState)(5);
	const { data: list, isLoading } = useQuery({
		queryKey: ["interviews"],
		queryFn: () => fetchList()
	});
	const { data: analytics } = useQuery({
		queryKey: ["interviewAnalytics"],
		queryFn: () => fetchAnalytics()
	});
	const startMutation = useMutation({
		mutationFn: () => start({ data: {
			role,
			difficulty,
			interview_type: type,
			total_questions: count
		} }),
		onSuccess: (data) => {
			toast.success("Interview ready");
			qc.invalidateQueries({ queryKey: ["interviews"] });
			navigate({
				to: "/interview/$id",
				params: { id: data.id }
			});
		},
		onError: (e) => toast.error(e.message)
	});
	const deleteMutation = useMutation({
		mutationFn: (id) => remove({ data: { id } }),
		onSuccess: () => {
			toast.success("Session deleted");
			qc.invalidateQueries({ queryKey: ["interviews"] });
			qc.invalidateQueries({ queryKey: ["interviewAnalytics"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight",
				children: "AI Interview Simulator"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Practice with role-specific questions and instant Gemini-powered feedback."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: MessagesSquare,
						label: "Attempts",
						value: analytics?.attempts ?? 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: TrendingUp,
						label: "Avg score",
						value: analytics?.avg ?? 0,
						suffix: "/100"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: Trophy,
						label: "Best score",
						value: analytics?.best ?? 0,
						suffix: "/100"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: Clock,
						label: "In progress",
						value: list?.filter((i) => i.status === "in_progress").length ?? 0
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-[1fr_1.1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Start a new session" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Pick role, difficulty, and interview type." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Role",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: role,
									onValueChange: setRole,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: r,
										children: r
									}, r)) })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Difficulty",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: difficulty,
									onValueChange: setDifficulty,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: DIFFICULTIES.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: d,
										children: d
									}, d)) })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Type",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: type,
									onValueChange: setType,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: t,
										children: t
									}, t)) })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Questions",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: String(count),
									onValueChange: (v) => setCount(Number(v)),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
										3,
										5,
										7
									].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: String(n),
										children: [n, " questions"]
									}, n)) })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => startMutation.mutate(),
								disabled: startMutation.isPending,
								className: "w-full",
								children: startMutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), " Generating questions…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "mr-2 h-4 w-4" }), " Start interview"] })
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Recent sessions" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Review past interviews and feedback." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "space-y-2",
					children: isLoading ? Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 w-full" }, i)) : !list?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-8 text-center text-sm text-muted-foreground",
						children: "No interviews yet — start your first session."
					}) : list.slice(0, 10).map((iv) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group flex items-center gap-2 rounded-lg border bg-card p-3 transition hover:border-primary hover:shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/interview/$id",
							params: { id: iv.id },
							className: "flex-1 min-w-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-medium truncate",
										children: iv.role
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground truncate",
										children: [
											iv.interview_type,
											" · ",
											iv.difficulty,
											" ·",
											" ",
											formatDistanceToNow(new Date(iv.created_at), { addSuffix: true })
										]
									})]
								}), iv.status === "completed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "default",
									children: [iv.overall_score, "/100"]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									children: "In progress"
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "h-8 w-8 text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:text-destructive",
							onClick: (e) => {
								e.preventDefault();
								if (confirm("Delete this interview session?")) deleteMutation.mutate(iv.id);
							},
							disabled: deleteMutation.isPending,
							"aria-label": "Delete session",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
						})]
					}, iv.id))
				})] })]
			}),
			analytics && analytics.categories.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Strong categories"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "flex flex-wrap gap-2",
					children: analytics.strong.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						className: "bg-success/15 text-success border-success/30",
						variant: "outline",
						children: [
							c.type,
							" · ",
							c.avg
						]
					}, c.type))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Areas to improve"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "flex flex-wrap gap-2",
					children: analytics.weak.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "border-warning/30 text-warning",
						children: [
							c.type,
							" · ",
							c.avg
						]
					}, c.type))
				})] })]
			})
		]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
			children: label
		}), children]
	});
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
//#endregion
export { InterviewPage as component };
