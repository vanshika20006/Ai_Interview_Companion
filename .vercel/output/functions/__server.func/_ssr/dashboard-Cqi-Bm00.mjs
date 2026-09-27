import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CWLNe4_N.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { Ct as Calendar, D as RefreshCcw, Et as Briefcase, It as Activity, L as MessagesSquare, Nt as ArrowUpRight, Pt as ArrowRight, Y as Lightbulb, at as FileText, f as Target, ft as CodeXml, g as Sparkles, it as Flame, l as Trophy } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Markdown } from "../_libs/react-markdown+[...].mjs";
import { t as Progress } from "./progress-DOIEKRJF.mjs";
import { i as getProblemProgress, n as LEETCODE_PROBLEMS } from "./leetcode-problems-EVhD3SB1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-Cqi-Bm00.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Aggregated snapshot for the production dashboard.
* One round-trip — used to compute Placement Readiness Score on the client.
*/
var getDashboardSummary = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("28aa4566b749882446c5a87c8cda74ed6b85fd544aa67cdf3d0d14ad32634d59"));
var clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));
function computeReadiness(i) {
	const resume = clamp(i.atsScore ?? 0);
	const coding = clamp(i.totalProblems > 0 ? i.solvedProblems / i.totalProblems * 100 : 0);
	const interview = clamp(i.avgInterviewScore ?? 0);
	const plan = clamp(i.studyPlanCompletionPct);
	const consistency = clamp(Math.min(i.consistencyDays, 14) * (100 / 14));
	const score = clamp(interview * .3 + coding * .3 + resume * .25 + plan * .15 + consistency * .05);
	const hiringProbability = clamp(Math.round(100 / (1 + Math.exp(-(score - 55) / 10))) - 5);
	const band = score >= 85 ? "Recruiter-Ready" : score >= 70 ? "Job-Ready" : score >= 45 ? "Improving" : "Beginner";
	const suggestions = [];
	if (resume < 70) suggestions.push("Re-analyze your resume — push your ATS score above 70.");
	if (coding < 50) suggestions.push("Solve more DSA problems from the curated roadmap.");
	if (interview < 60) suggestions.push("Run an AI mock interview to lift your interview score.");
	if (plan < 40) suggestions.push("Generate a study plan and complete weekly tasks.");
	if (i.consistencyDays < 5) suggestions.push("Build a daily habit — aim for a 7-day streak.");
	if (suggestions.length === 0) suggestions.push("You're recruiter-ready. Share your public profile.");
	return {
		score,
		band,
		hiringProbability,
		breakdown: {
			resume,
			coding,
			interview,
			plan,
			consistency
		},
		suggestions
	};
}
function getDailyChallenge(date = /* @__PURE__ */ new Date()) {
	return LEETCODE_PROBLEMS[(Math.floor(date.getTime() / 864e5) % LEETCODE_PROBLEMS.length + LEETCODE_PROBLEMS.length) % LEETCODE_PROBLEMS.length];
}
function DailyChallengeCard() {
	const problem = getDailyChallenge();
	const fetchProgress = useServerFn(getProblemProgress);
	const { data: progress } = useQuery({
		queryKey: ["problemProgress"],
		queryFn: () => fetchProgress(),
		staleTime: 6e4
	});
	const status = progress?.find((p) => p.problem_slug === problem.slug)?.status ?? "todo";
	const today = (/* @__PURE__ */ new Date()).toLocaleDateString(void 0, {
		weekday: "long",
		month: "short",
		day: "numeric"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "relative overflow-hidden border-primary/30",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
						className: "flex items-center gap-1.5 text-xs uppercase tracking-wider",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5" }),
							" Daily Challenge · ",
							today
						]
					}), status === "solved" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						className: "gap-1 bg-success/15 text-success border-success/30",
						variant: "outline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-3 w-3" }), " Solved today"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-lg font-semibold leading-snug",
					children: problem.title
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: {
							Easy: "bg-success/15 text-success border-success/30",
							Medium: "bg-warning/15 text-warning border-warning/30",
							Hard: "bg-destructive/15 text-destructive border-destructive/30"
						}[problem.difficulty],
						children: problem.difficulty
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						children: problem.topic
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						children: problem.pattern
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"· ~",
						problem.estimatedMinutes,
						" min"
					] })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/leetcode",
						children: [status === "solved" ? "Review roadmap" : "Solve now", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "ml-1.5 h-3.5 w-3.5" })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "sm",
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: problem.url,
						target: "_blank",
						rel: "noopener noreferrer",
						children: ["Open on LeetCode ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "ml-1.5 h-3.5 w-3.5" })]
					})
				})]
			})] })
		]
	});
}
var getWeeklyDigest = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("288e72e41e4b0cf9ce4a666a71004b5f37aed62540c3a2920512555bf9fb99d8"));
function WeeklyDigestCard() {
	const qc = useQueryClient();
	const fetchFn = useServerFn(getWeeklyDigest);
	const { data, isLoading, isFetching } = useQuery({
		queryKey: ["weeklyDigest"],
		queryFn: () => fetchFn(),
		staleTime: 3600 * 1e3
	});
	const refresh = useMutation({
		mutationFn: () => fetchFn(),
		onSuccess: (d) => qc.setQueryData(["weeklyDigest"], d)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
			className: "pb-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "flex items-center gap-2 text-base",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-4 w-4 text-primary" }), " Weekly Progress Digest"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "ghost",
					onClick: () => refresh.mutate(),
					disabled: refresh.isPending || isFetching,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCcw, { className: "h-3.5 w-3.5" }), " Refresh"]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: isLoading || !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "secondary",
						children: [data.stats.solved, " solved"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "secondary",
						children: [data.stats.interviewsDone, " interviews"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "secondary",
						children: [data.stats.currentStreak, "d streak"]
					}),
					data.stats.bestAts > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "secondary",
						children: ["ATS ", data.stats.bestAts]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "prose prose-sm dark:prose-invert max-w-none",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, { children: data.summary })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 flex items-center gap-1 text-[11px] text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }), " AI-generated from your last 7 days"]
			})
		] }) })]
	});
}
function DashboardPage() {
	const fetchSummary = useServerFn(getDashboardSummary);
	const fetchProgress = useServerFn(getProblemProgress);
	const { data: summary, isLoading: loadingSummary } = useQuery({
		queryKey: ["dashboardSummary"],
		queryFn: () => fetchSummary()
	});
	const { data: progress } = useQuery({
		queryKey: ["problemProgress"],
		queryFn: () => fetchProgress()
	});
	const totalProblems = LEETCODE_PROBLEMS.length;
	const solved = progress?.filter((p) => p.status === "solved").length ?? summary?.problems.solved ?? 0;
	const readiness = computeReadiness({
		atsScore: summary?.resume?.ats_score ?? null,
		avgInterviewScore: summary?.interviews.avgOverall ?? null,
		solvedProblems: solved,
		totalProblems,
		studyPlanCompletionPct: summary?.plan.planPct ?? 0,
		communicationScore: summary?.interviews.avgCommunication ?? null,
		consistencyDays: summary?.streak.current ?? 0
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: "Welcome back 👋"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Your placement readiness, at a glance."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/analytics",
							children: ["View analytics ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1.5 h-3.5 w-3.5" })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/resume",
							children: ["Re-analyze resume ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 h-4 w-4" })]
						})
					})]
				})]
			}),
			loadingSummary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-56 w-full" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadinessHero, { readiness }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreCard, {
						icon: FileText,
						label: "Resume ATS",
						value: readiness.breakdown.resume,
						suffix: "/100",
						tone: "primary",
						hint: summary?.resume ? "Latest analysis" : "Not analyzed yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreCard, {
						icon: MessagesSquare,
						label: "Interview Avg",
						value: readiness.breakdown.interview,
						suffix: "/100",
						tone: "accent",
						hint: `${summary?.interviews.count ?? 0} sessions`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreCard, {
						icon: CodeXml,
						label: "DSA Roadmap",
						value: readiness.breakdown.coding,
						suffix: "%",
						tone: "success",
						hint: `${solved} / ${totalProblems} solved`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreCard, {
						icon: Flame,
						label: "Streak",
						value: summary?.streak.current ?? 0,
						suffix: " days",
						tone: "warning",
						hint: `Best: ${summary?.streak.best ?? 0}`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DailyChallengeCard, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeeklyDigestCard, {})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecruiterSummary, {
					readiness,
					interviews: summary?.interviews
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 lg:grid-cols-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2 text-base",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeXml, { className: "h-4 w-4" }), " DSA Roadmap Progress"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, { children: [
						solved,
						" of ",
						totalProblems,
						" curated problems"
					] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
								value: readiness.breakdown.coding,
								className: "h-2.5"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopicBreakdown, { progress: progress ?? [] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								size: "sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/leetcode",
									children: ["Open roadmap ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1.5 h-3.5 w-3.5" })]
								})
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "flex items-center gap-2 text-base",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "h-4 w-4" }), " Improve your score"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Personalized next moves" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2 text-sm",
					children: readiness.suggestions.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r })]
					}, i))
				}) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "flex items-center gap-2 text-base",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-4 w-4" }), " Next milestones"]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Task, {
							done: !!summary?.resume,
							text: "Upload and analyze your resume"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Task, {
							done: solved >= 5,
							text: "Solve 5 curated LeetCode problems"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Task, {
							done: (summary?.interviews.count ?? 0) >= 1,
							text: "Run your first AI mock interview"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Task, {
							done: solved >= 15,
							text: "Reach 15 problems solved"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Task, {
							done: (summary?.plan.doneTasks ?? 0) >= 5,
							text: "Complete 5 study plan tasks"
						})
					]
				}) })] })]
			})
		]
	});
}
function ReadinessHero({ readiness }) {
	const { score, band, hiringProbability, breakdown } = readiness;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "relative overflow-hidden border-primary/20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 -z-10 bg-gradient-to-br from-primary/15 via-violet-500/10 to-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "grid gap-6 p-6 md:grid-cols-[auto_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadinessRing, { value: score }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-wider text-muted-foreground",
						children: "Placement Readiness"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 text-3xl font-semibold",
						children: [score, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-base text-muted-foreground",
							children: "/100"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						className: "mt-2",
						children: band
					})
				] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-4 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pillar, {
						icon: Target,
						label: "Hiring odds",
						value: `${hiringProbability}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pillar, {
						icon: FileText,
						label: "Resume",
						value: `${breakdown.resume}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pillar, {
						icon: MessagesSquare,
						label: "Interview",
						value: `${breakdown.interview}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pillar, {
						icon: Activity,
						label: "Consistency",
						value: `${breakdown.consistency}`
					})
				]
			})]
		})]
	});
}
function ReadinessRing({ value }) {
	const r = 38;
	const c = 2 * Math.PI * r;
	const offset = c - value / 100 * c;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 100 100",
		className: "h-24 w-24 -rotate-90",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "50",
			cy: "50",
			r,
			className: "fill-none stroke-muted",
			strokeWidth: "8"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "50",
			cy: "50",
			r,
			className: "fill-none stroke-primary transition-all duration-700",
			strokeWidth: "8",
			strokeLinecap: "round",
			strokeDasharray: c,
			strokeDashoffset: offset
		})]
	});
}
function Pillar({ icon: Icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border bg-background/60 p-3 backdrop-blur",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-xs text-muted-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" }),
				" ",
				label
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 text-lg font-semibold",
			children: value
		})]
	});
}
function RecruiterSummary({ readiness, interviews }) {
	const rows = [
		{
			label: "Resume strength",
			value: readiness.breakdown.resume
		},
		{
			label: "Coding strength",
			value: readiness.breakdown.coding
		},
		{
			label: "Communication",
			value: interviews?.avgCommunication ?? 0
		},
		{
			label: "Technical depth",
			value: interviews?.avgTechnical ?? 0
		},
		{
			label: "Consistency",
			value: readiness.breakdown.consistency
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
		className: "flex items-center gap-2 text-base",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-4 w-4" }), " Recruiter view"]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "How recruiters will see you" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
		className: "space-y-3",
		children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-1 flex items-center justify-between text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground",
				children: r.label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-medium",
				children: [r.value, "/100"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
			value: r.value,
			className: "h-1.5"
		})] }, r.label))
	})] });
}
function ScoreCard({ icon: Icon, label, value, suffix, tone, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "shadow-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-wider text-muted-foreground",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `flex h-9 w-9 items-center justify-center rounded-lg ${{
							primary: "bg-primary/10 text-primary",
							accent: "bg-accent text-accent-foreground",
							success: "bg-success/15 text-success",
							warning: "bg-warning/15 text-warning-foreground dark:text-warning"
						}[tone]}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex items-baseline gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-3xl font-semibold",
						children: value
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted-foreground",
						children: suffix
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 text-xs text-muted-foreground",
					children: hint
				})
			]
		})
	});
}
function Task({ done, text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-4 w-4 shrink-0 rounded-full border-2 ${done ? "border-success bg-success" : "border-muted-foreground/40"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: done ? "text-muted-foreground line-through" : "",
			children: text
		})]
	});
}
function TopicBreakdown({ progress }) {
	const byTopic = /* @__PURE__ */ new Map();
	for (const p of LEETCODE_PROBLEMS) {
		const t = byTopic.get(p.topic) ?? {
			solved: 0,
			total: 0
		};
		t.total += 1;
		byTopic.set(p.topic, t);
	}
	for (const pr of progress) {
		if (pr.status !== "solved") continue;
		const prob = LEETCODE_PROBLEMS.find((p) => p.slug === pr.problem_slug);
		if (!prob) continue;
		const t = byTopic.get(prob.topic);
		t.solved += 1;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-2.5 text-xs",
		children: Array.from(byTopic.entries()).sort((a, b) => b[1].solved / b[1].total - a[1].solved / a[1].total).slice(0, 6).map(([topic, { solved, total }]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-[120px_1fr_40px] items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate text-muted-foreground",
					children: topic
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
					value: solved / total * 100,
					className: "h-1.5"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-right font-medium",
					children: [
						solved,
						"/",
						total
					]
				})
			]
		}, topic))
	});
}
//#endregion
export { DashboardPage as component };
