import { o as __toESM } from "../_runtime.mjs";
import { s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { C as Search, Et as Briefcase, G as Lock, L as MessagesSquare, at as FileText, ft as CodeXml, i as Users, it as Flame, u as TrendingUp, ut as Crown, v as Shield } from "../_libs/lucide-react.mjs";
import { a as amIAdmin, i as adminSetRole, n as adminCanClaim, r as adminListUsers, s as claimFirstAdmin, t as adminAnalytics } from "./admin.functions-DLfwtrvb.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as YAxis, g as Tooltip, h as ResponsiveContainer, l as CartesianGrid, o as XAxis, s as Area, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-9l8x-rNJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MANAGED_ROLES = [
	"admin",
	"moderator",
	"recruiter"
];
function AdminPage() {
	const checkAdmin = useServerFn(amIAdmin);
	const checkClaim = useServerFn(adminCanClaim);
	const claim = useServerFn(claimFirstAdmin);
	const list = useServerFn(adminListUsers);
	const setRole = useServerFn(adminSetRole);
	const analytics = useServerFn(adminAnalytics);
	const qc = useQueryClient();
	const [search, setSearch] = (0, import_react.useState)("");
	const [submitted, setSubmitted] = (0, import_react.useState)("");
	const { data: isAdmin, isLoading: roleLoading } = useQuery({
		queryKey: ["amIAdmin"],
		queryFn: () => checkAdmin()
	});
	const { data: canClaim } = useQuery({
		queryKey: ["adminCanClaim"],
		queryFn: () => checkClaim(),
		enabled: !roleLoading && !isAdmin
	});
	const claimMut = useMutation({
		mutationFn: () => claim(),
		onSuccess: () => {
			toast.success("You are now admin");
			qc.invalidateQueries({ queryKey: ["amIAdmin"] });
			qc.invalidateQueries({ queryKey: ["adminCanClaim"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const { data: users, isFetching } = useQuery({
		queryKey: ["adminUsers", submitted],
		queryFn: () => list({ data: { search: submitted || void 0 } }),
		enabled: !!isAdmin
	});
	const { data: stats, isLoading: statsLoading } = useQuery({
		queryKey: ["adminAnalytics"],
		queryFn: () => analytics(),
		enabled: !!isAdmin,
		staleTime: 3e4
	});
	const roleMut = useMutation({
		mutationFn: (args) => setRole({ data: args }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["adminUsers"] });
			qc.invalidateQueries({ queryKey: ["adminAnalytics"] });
		},
		onError: (e) => toast.error(e.message)
	});
	if (roleLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full" });
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-2xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "flex flex-col items-center gap-4 p-12 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground",
					children: canClaim ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold",
					children: "Admin panel"
				}),
				canClaim ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-md text-sm text-muted-foreground",
					children: "No admin exists yet. Claim the admin seat to manage users and roles."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => claimMut.mutate(),
					disabled: claimMut.isPending,
					children: claimMut.isPending ? "Claiming…" : "Claim admin"
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-md text-sm text-muted-foreground",
					children: "This area is restricted to admins. Contact an existing admin to be granted access."
				})
			]
		}) })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight",
				children: "Admin console"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Platform analytics, users, and content moderation."
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "overview",
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "overview",
						children: "Overview"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "users",
						children: "Users"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "content",
						children: "Content"
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "overview",
					className: "space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OverviewTab, {
						loading: statsLoading,
						stats
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "users",
					className: "space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Users & roles" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Search by email or name, then toggle roles." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "flex gap-2",
							onSubmit: (e) => {
								e.preventDefault();
								setSubmitted(search);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Search users…",
									value: search,
									onChange: (e) => setSearch(e.target.value),
									className: "pl-9"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								variant: "secondary",
								children: "Search"
							})]
						}), isFetching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 w-full" }) : !users?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "No users found."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "divide-y rounded-md border",
							children: users.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate font-medium",
											children: u.full_name || u.email || u.user_id
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate text-xs text-muted-foreground",
											children: u.email
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1 flex flex-wrap gap-1",
											children: [(u.roles ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "secondary",
												className: "text-[10px] uppercase",
												children: r
											}, r)), !u.roles?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-muted-foreground",
												children: "no roles"
											})]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap items-center gap-4",
									children: MANAGED_ROLES.map((role) => {
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
												checked: (u.roles ?? []).includes(role),
												disabled: roleMut.isPending,
												onCheckedChange: (checked) => roleMut.mutate({
													userId: u.user_id,
													role,
													grant: checked
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "capitalize",
												children: role
											})]
										}, role);
									})
								})]
							}, u.user_id))
						})]
					})] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "content",
					className: "space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContentTab, {
						stats,
						loading: statsLoading
					})
				})
			]
		})]
	});
}
function StatCard({ icon: Icon, label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "flex items-center gap-4 p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs uppercase tracking-wide text-muted-foreground",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-2xl font-semibold leading-tight",
					children: value
				}),
				hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground",
					children: hint
				})
			]
		})]
	}) });
}
function OverviewTab({ loading, stats }) {
	if (loading || !stats) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
		children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 w-full" }, i))
	});
	const t = stats.totals ?? {};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					icon: Users,
					label: "Total users",
					value: t.users ?? 0
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					icon: MessagesSquare,
					label: "Interviews",
					value: t.interviews ?? 0,
					hint: `${t.completed_interviews ?? 0} completed`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					icon: FileText,
					label: "Resumes",
					value: t.resumes ?? 0
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					icon: CodeXml,
					label: "Problems solved",
					value: t.problems_solved ?? 0
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					icon: Briefcase,
					label: "Shortlists",
					value: t.shortlists ?? 0
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					icon: Users,
					label: "Study groups",
					value: t.study_groups ?? 0
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					icon: Flame,
					label: "Active streaks",
					value: t.active_streaks ?? 0
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					icon: TrendingUp,
					label: "Community posts",
					value: t.posts ?? 0
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Signups — last 14 days" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Daily new profiles created on the platform." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "h-64",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data: stats.signups ?? [],
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "signupFill",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: "hsl(var(--primary))",
										stopOpacity: .4
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: "hsl(var(--primary))",
										stopOpacity: 0
									})]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "hsl(var(--border))"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "day",
									tickFormatter: (v) => v.slice(5),
									tick: { fontSize: 11 },
									stroke: "hsl(var(--muted-foreground))"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									allowDecimals: false,
									tick: { fontSize: 11 },
									stroke: "hsl(var(--muted-foreground))"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									background: "hsl(var(--popover))",
									border: "1px solid hsl(var(--border))",
									borderRadius: 8,
									fontSize: 12
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "count",
									stroke: "hsl(var(--primary))",
									fill: "url(#signupFill)",
									strokeWidth: 2
								})
							]
						})
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Role distribution" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Granted roles across users." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-3",
				children: Object.entries(stats.roles ?? {}).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No roles assigned yet."
				}) : Object.entries(stats.roles ?? {}).sort((a, b) => Number(b[1]) - Number(a[1])).map(([role, count]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						className: "capitalize",
						children: role
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium",
						children: Number(count)
					})]
				}, role))
			})] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Recent signups" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Latest 8 accounts." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: !stats.recent_users?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "No users yet."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "divide-y rounded-md border",
			children: stats.recent_users.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 p-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "truncate font-medium",
						children: u.full_name || u.email || u.user_id
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "truncate text-xs text-muted-foreground",
						children: u.email
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0 text-xs text-muted-foreground",
					children: new Date(u.created_at).toLocaleDateString()
				})]
			}, u.user_id))
		}) })] })
	] });
}
function ContentTab({ loading, stats }) {
	if (loading || !stats) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Top community posts" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Ranked by likes." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: !stats.content?.top_posts?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "No posts yet."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "divide-y rounded-md border",
			children: stats.content.top_posts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 p-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate font-medium",
					children: p.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "shrink-0 text-xs text-muted-foreground",
					children: [
						"♥ ",
						p.like_count,
						" · 💬 ",
						p.comment_count
					]
				})]
			}, p.id))
		}) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Recent completed interviews" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Last 5 finished sessions." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: !stats.content?.recent_interviews?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "No interviews yet."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "divide-y rounded-md border",
			children: stats.content.recent_interviews.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 p-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "truncate font-medium",
						children: i.role || "Interview"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: new Date(i.created_at).toLocaleDateString()
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "secondary",
					children: i.overall_score ?? "—"
				})]
			}, i.id))
		}) })] })]
	});
}
//#endregion
export { AdminPage as component };
