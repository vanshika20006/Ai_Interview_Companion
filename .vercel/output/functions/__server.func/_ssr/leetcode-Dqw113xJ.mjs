import { o as __toESM } from "../_runtime.mjs";
import { s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { C as Search, M as NotebookPen, Ot as Bookmark, T as RotateCcw, ct as ExternalLink, kt as BookmarkCheck, mt as Circle, pt as Clock, xt as Check } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { t as Progress } from "./progress-DOIEKRJF.mjs";
import { a as upsertProblemProgress, i as getProblemProgress, n as LEETCODE_PROBLEMS, r as LEETCODE_TOPICS, t as COMPANIES } from "./leetcode-problems-EVhD3SB1.mjs";
import { t as Route } from "./leetcode-_ezOIM7z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leetcode-Dqw113xJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LeetCodePage() {
	const qc = useQueryClient();
	const initial = Route.useSearch();
	const fetchProgress = useServerFn(getProblemProgress);
	const upsert = useServerFn(upsertProblemProgress);
	const { data: progress } = useQuery({
		queryKey: ["problemProgress"],
		queryFn: () => fetchProgress()
	});
	const progressMap = (0, import_react.useMemo)(() => new Map((progress ?? []).map((p) => [p.problem_slug, p])), [progress]);
	const [q, setQ] = (0, import_react.useState)("");
	const [topic, setTopic] = (0, import_react.useState)(initial.topic ?? "all");
	const [difficulty, setDifficulty] = (0, import_react.useState)(initial.difficulty ?? "all");
	const [company, setCompany] = (0, import_react.useState)("all");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [notesFor, setNotesFor] = (0, import_react.useState)(null);
	const [notesDraft, setNotesDraft] = (0, import_react.useState)("");
	const filtered = (0, import_react.useMemo)(() => {
		return LEETCODE_PROBLEMS.filter((p) => {
			if (q && !p.title.toLowerCase().includes(q.toLowerCase())) return false;
			if (topic !== "all" && p.topic !== topic) return false;
			if (difficulty !== "all" && p.difficulty !== difficulty) return false;
			if (company !== "all" && !p.companies.includes(company)) return false;
			if (statusFilter !== "all") {
				const s = progressMap.get(p.slug)?.status ?? "not_started";
				if (statusFilter === "bookmarked") {
					if (!progressMap.get(p.slug)?.bookmarked) return false;
				} else if (s !== statusFilter) return false;
			}
			return true;
		});
	}, [
		q,
		topic,
		difficulty,
		company,
		statusFilter,
		progressMap
	]);
	const solved = (progress ?? []).filter((p) => p.status === "solved").length;
	const total = LEETCODE_PROBLEMS.length;
	async function update(slug, patch) {
		try {
			await upsert({ data: {
				problem_slug: slug,
				...patch
			} });
			qc.invalidateQueries({ queryKey: ["problemProgress"] });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to update");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: "LeetCode Roadmap"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						LEETCODE_PROBLEMS.length,
						" curated problems across ",
						LEETCODE_TOPICS.length,
						" topics."
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-48 space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Overall progress"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-medium",
							children: [
								solved,
								"/",
								total
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
						value: solved / total * 100,
						className: "h-2"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "grid gap-3 p-4 md:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "pl-9",
							placeholder: "Search problems...",
							value: q,
							onChange: (e) => setQ(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterSelect, {
						v: topic,
						on: setTopic,
						placeholder: "All topics",
						opts: [{
							v: "all",
							l: "All topics"
						}, ...LEETCODE_TOPICS.map((t) => ({
							v: t,
							l: t
						}))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterSelect, {
						v: difficulty,
						on: setDifficulty,
						placeholder: "All difficulty",
						opts: [
							{
								v: "all",
								l: "All difficulty"
							},
							{
								v: "Easy",
								l: "Easy"
							},
							{
								v: "Medium",
								l: "Medium"
							},
							{
								v: "Hard",
								l: "Hard"
							}
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterSelect, {
						v: company,
						on: setCompany,
						placeholder: "All companies",
						opts: [{
							v: "all",
							l: "All companies"
						}, ...COMPANIES.map((c) => ({
							v: c,
							l: c
						}))]
					})
				]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5",
				children: [
					{
						v: "all",
						l: "All"
					},
					{
						v: "not_started",
						l: "Not started"
					},
					{
						v: "in_progress",
						l: "In progress"
					},
					{
						v: "solved",
						l: "Solved"
					},
					{
						v: "bookmarked",
						l: "Bookmarked"
					}
				].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setStatusFilter(f.v),
					className: `rounded-full border px-3 py-1 text-xs ${statusFilter === f.v ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"}`,
					children: f.l
				}, f.v))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-xl border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden grid-cols-[1fr_140px_100px_140px_180px] gap-3 border-b bg-muted/30 px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground md:grid",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Problem" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Topic" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Difficulty" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Companies" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-right",
							children: "Actions"
						})
					]
				}), filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-10 text-center text-sm text-muted-foreground",
					children: "No problems match these filters."
				}) : filtered.map((p) => {
					const pr = progressMap.get(p.slug);
					const status = pr?.status ?? "not_started";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-3 border-b px-4 py-3 last:border-b-0 hover:bg-muted/30 md:grid-cols-[1fr_140px_100px_140px_180px] md:items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusIcon, { status }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate font-medium",
										children: p.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: [
											p.pattern,
											" · ",
											p.estimatedMinutes,
											" min",
											pr && pr.revision_count > 0 ? ` · ${pr.revision_count} revisions` : ""
										]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									children: p.topic
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DifficultyBadge, { d: p.difficulty }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-1",
								children: [p.companies.slice(0, 2).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[10px]",
									children: c
								}, c)), p.companies.length > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: ["+", p.companies.length - 2]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap justify-end gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										title: "Bookmark",
										onClick: () => update(p.slug, { bookmarked: !pr?.bookmarked }),
										children: pr?.bookmarked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkCheck, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										title: "Notes",
										onClick: () => {
											setNotesFor(p);
											setNotesDraft(pr?.notes ?? "");
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotebookPen, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										title: "Needs revision",
										onClick: () => update(p.slug, { revision_count: (pr?.revision_count ?? 0) + 1 }),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: status === "solved" ? "default" : "outline",
										onClick: () => update(p.slug, { status: status === "solved" ? "in_progress" : "solved" }),
										children: status === "solved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-1 h-3 w-3" }), "Solved"] }) : "Mark solved"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										asChild: true,
										title: "Open in LeetCode",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: p.url,
											target: "_blank",
											rel: "noreferrer",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-4 w-4" })
										})
									})
								]
							})
						]
					}, p.slug);
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!notesFor,
				onOpenChange: (o) => !o && setNotesFor(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Notes — ", notesFor?.title] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Save your approach, edge cases, and complexity." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: notesDraft,
						onChange: (e) => setNotesDraft(e.target.value),
						className: "min-h-40 w-full rounded-md border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
						placeholder: "My approach: ..."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setNotesFor(null),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: async () => {
							if (!notesFor) return;
							await update(notesFor.slug, { notes: notesDraft });
							toast.success("Notes saved");
							setNotesFor(null);
						},
						children: "Save notes"
					})] })
				] })
			})
		]
	});
}
function FilterSelect({ v, on, placeholder, opts }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
		value: v,
		onValueChange: on,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: opts.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
			value: o.v,
			children: o.l
		}, o.v)) })]
	});
}
function StatusIcon({ status }) {
	if (status === "solved") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-success/15 text-success",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" })
	});
	if (status === "in_progress") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-warning/15 text-warning-foreground dark:text-warning",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-3.5 w-3.5" })
	});
}
function DifficultyBadge({ d }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `rounded-full px-2 py-0.5 text-xs font-medium ${d === "Easy" ? "bg-success/15 text-success" : d === "Medium" ? "bg-warning/15 text-warning-foreground dark:text-warning" : "bg-destructive/15 text-destructive"}`,
		children: d
	});
}
//#endregion
export { LeetCodePage as component };
