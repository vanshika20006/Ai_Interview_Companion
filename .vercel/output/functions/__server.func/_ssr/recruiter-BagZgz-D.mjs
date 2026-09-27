import { o as __toESM } from "../_runtime.mjs";
import { s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { $ as GraduationCap, C as Search, G as Lock, Ot as Bookmark, Tt as Building2, ct as ExternalLink, m as StickyNote, w as Save } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { a as updateShortlistEntry, i as toggleShortlist, n as listShortlist, r as searchStudents, t as amIRecruiter } from "./recruiter.functions-DmG6WnDi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/recruiter-BagZgz-D.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUSES = [
	"new",
	"contacted",
	"interviewing",
	"offer",
	"rejected"
];
var STATUS_VARIANT = {
	new: "secondary",
	contacted: "outline",
	interviewing: "default",
	offer: "default",
	rejected: "destructive"
};
function RecruiterPage() {
	const fetchRole = useServerFn(amIRecruiter);
	const search = useServerFn(searchStudents);
	const toggle = useServerFn(toggleShortlist);
	const fetchShort = useServerFn(listShortlist);
	const [skills, setSkills] = (0, import_react.useState)("");
	const [query, setQuery] = (0, import_react.useState)("");
	const [minAts, setMinAts] = (0, import_react.useState)("");
	const qc = useQueryClient();
	const updateEntry = useServerFn(updateShortlistEntry);
	const { data: isRecruiter, isLoading: roleLoading } = useQuery({
		queryKey: ["recruiterRole"],
		queryFn: () => fetchRole()
	});
	const { data: shortlist } = useQuery({
		queryKey: ["shortlist"],
		queryFn: () => fetchShort(),
		enabled: !!isRecruiter
	});
	const [results, setResults] = (0, import_react.useState)(null);
	const searchMut = useMutation({
		mutationFn: () => search({ data: {
			search: query || void 0,
			skills: skills ? skills.split(",").map((s) => s.trim()).filter(Boolean) : void 0,
			minAts: typeof minAts === "number" ? minAts : void 0
		} }),
		onSuccess: (r) => setResults(r),
		onError: (e) => toast.error(e.message)
	});
	const shortMut = useMutation({
		mutationFn: (args) => toggle({ data: {
			student_user_id: args.id,
			shortlisted: args.on
		} }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["shortlist"] })
	});
	const entryMut = useMutation({
		mutationFn: (args) => updateEntry({ data: {
			student_user_id: args.id,
			notes: args.notes,
			status: args.status
		} }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["shortlist"] });
			toast.success("Saved");
		},
		onError: (e) => toast.error(e.message)
	});
	if (roleLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full" });
	if (!isRecruiter) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-2xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "flex flex-col items-center gap-3 p-12 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold",
					children: "Recruiter mode"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-md text-sm text-muted-foreground",
					children: "This area is restricted to users with the recruiter role. Contact an admin to be granted access."
				})
			]
		}) })
	});
	const shortEntries = shortlist ?? [];
	const shortMap = new Map(shortEntries.map((e) => [e.student_user_id, e]));
	const shortSet = new Set(shortMap.keys());
	const shortlistedResults = (results ?? []).filter((s) => shortSet.has(s.user_id));
	const renderCard = (s) => {
		const entry = shortMap.get(s.user_id);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
			className: "pb-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: s.full_name ?? `@${s.username}`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
					className: "flex flex-wrap items-center gap-2 mt-1 text-xs",
					children: [s.college && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3 w-3" }), s.college]
					}), s.branch && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-3 w-3" }),
							s.branch,
							" ",
							s.graduation_year ?? ""
						]
					})]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					variant: s.ats >= 80 ? "default" : "secondary",
					children: ["ATS ", s.ats]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground",
					children: [s.problems_solved, " problems solved"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1",
					children: (s.skills ?? []).slice(0, 6).map((sk) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "text-[10px]",
						children: sk
					}, sk))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						variant: "outline",
						className: "flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/u/$username",
							params: { username: s.username },
							children: ["View ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "ml-1 h-3 w-3" })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: shortSet.has(s.user_id) ? "default" : "outline",
						onClick: () => shortMut.mutate({
							id: s.user_id,
							on: shortSet.has(s.user_id)
						}),
						children: shortSet.has(s.user_id) ? "Shortlisted" : "Shortlist"
					})]
				}),
				entry && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackerPanel, {
					studentId: s.user_id,
					status: entry.status ?? "new",
					notes: entry.notes ?? "",
					onSave: (payload) => entryMut.mutate({
						id: s.user_id,
						...payload
					}),
					saving: entryMut.isPending
				})
			]
		})] }, s.user_id);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-semibold tracking-tight",
			children: "Find students"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Search public student portfolios by skill, score, and more."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "search",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
					value: "search",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "mr-2 h-4 w-4" }), "Search"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
					value: "shortlist",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "mr-2 h-4 w-4" }),
						"Shortlist (",
						shortSet.size,
						")"
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "search",
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "grid gap-3 p-4 md:grid-cols-[1fr_1fr_140px_auto]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Username search…",
									value: query,
									onChange: (e) => setQuery(e.target.value),
									className: "pl-9"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Skills (comma-separated)",
								value: skills,
								onChange: (e) => setSkills(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								placeholder: "Min ATS",
								value: minAts,
								onChange: (e) => setMinAts(e.target.value ? Number(e.target.value) : ""),
								min: 0,
								max: 100
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => searchMut.mutate(),
								disabled: searchMut.isPending,
								children: "Search"
							})
						]
					}) }), results === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Run a search to find candidates."
					}) : !results.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "p-8 text-center text-sm text-muted-foreground",
						children: "No matching students."
					}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3 md:grid-cols-2",
						children: results.map(renderCard)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "shortlist",
					className: "space-y-4",
					children: !shortEntries.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "p-8 text-center text-sm text-muted-foreground",
						children: "No shortlisted students yet. Use search to add some."
					}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [shortlistedResults.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-3 md:grid-cols-2",
							children: shortlistedResults.map(renderCard)
						}), shortEntries.filter((e) => !shortlistedResults.some((r) => r.user_id === e.student_user_id)).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base font-mono text-xs",
								children: e.student_user_id
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
								className: "text-xs",
								children: "Run a search to load full profile. Status & notes editable below."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackerPanel, {
							studentId: e.student_user_id,
							status: e.status ?? "new",
							notes: e.notes ?? "",
							onSave: (payload) => entryMut.mutate({
								id: e.student_user_id,
								...payload
							}),
							saving: entryMut.isPending
						}) })] }, e.student_user_id))]
					})
				})
			]
		})]
	});
}
function TrackerPanel({ studentId, status, notes, onSave, saving }) {
	const [localStatus, setLocalStatus] = (0, import_react.useState)(status);
	const [localNotes, setLocalNotes] = (0, import_react.useState)(notes);
	(0, import_react.useEffect)(() => {
		setLocalStatus(status);
		setLocalNotes(notes);
	}, [
		studentId,
		status,
		notes
	]);
	const dirty = localStatus !== status || localNotes !== notes;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 space-y-2 rounded-md border bg-muted/30 p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-xs font-medium text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickyNote, { className: "h-3.5 w-3.5" }), " Tracker"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: STATUS_VARIANT[status],
						className: "text-[10px] uppercase",
						children: status
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: localStatus,
						onValueChange: (v) => {
							const next = v;
							setLocalStatus(next);
							onSave({ status: next });
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-7 w-32 text-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s,
							className: "text-xs capitalize",
							children: s
						}, s)) })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				value: localNotes,
				onChange: (e) => setLocalNotes(e.target.value),
				placeholder: "Notes about this candidate…",
				rows: 3,
				className: "text-xs"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "secondary",
					disabled: !dirty || saving,
					onClick: () => onSave({
						notes: localNotes,
						status: localStatus
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-1 h-3 w-3" }), " Save notes"]
				})
			})
		]
	});
}
//#endregion
export { RecruiterPage as component };
