import { o as __toESM } from "../_runtime.mjs";
import { s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CWLNe4_N.mjs";
import { dt as enumType, ht as stringType, lt as arrayType, pt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { K as LoaderCircle, O as Plus, at as FileText, d as Trash2, lt as Download, w as Save } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/resume-builder-DjOW-13Y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var linkSchema = objectType({
	label: stringType().max(60),
	url: stringType().max(300)
});
var dataSchema = objectType({
	personal: objectType({
		full_name: stringType().max(120).default(""),
		headline: stringType().max(160).default(""),
		email: stringType().max(160).default(""),
		phone: stringType().max(40).default(""),
		location: stringType().max(120).default(""),
		links: arrayType(linkSchema).default([]),
		summary: stringType().max(2e3).default("")
	}).default({}),
	education: arrayType(objectType({
		school: stringType().max(160).default(""),
		degree: stringType().max(160).default(""),
		field: stringType().max(160).default(""),
		start: stringType().max(40).default(""),
		end: stringType().max(40).default(""),
		score: stringType().max(60).default("")
	})).default([]),
	experience: arrayType(objectType({
		company: stringType().max(160).default(""),
		role: stringType().max(160).default(""),
		location: stringType().max(120).default(""),
		start: stringType().max(40).default(""),
		end: stringType().max(40).default(""),
		bullets: arrayType(stringType().max(400)).default([])
	})).default([]),
	projects: arrayType(objectType({
		name: stringType().max(160).default(""),
		tech: stringType().max(240).default(""),
		link: stringType().max(300).default(""),
		bullets: arrayType(stringType().max(400)).default([])
	})).default([]),
	skills: arrayType(stringType().max(60)).default([]),
	achievements: arrayType(stringType().max(400)).default([])
});
var listBuilderResumes = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("f096f1e331042bb3f1faf2275a13dba60ee3fcae851f8d48c150c0f2349b8f8a"));
var getBuilderResume = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator((i) => objectType({ id: stringType().uuid() }).parse(i)).handler(createSsrRpc("209a140627e100399c434f936e3d0b1ce16a63eb4bd8872a14890c1152dd2de6"));
var createBuilderResume = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((i) => objectType({
	title: stringType().min(1).max(120).default("Untitled resume"),
	template: enumType([
		"modern",
		"minimal",
		"compact"
	]).default("modern")
}).parse(i)).handler(createSsrRpc("f932973ad63dbbbb61de15132b2d3bd879e23dabb5489fd0c717989f2f597fe6"));
var updateBuilderResume = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((i) => objectType({
	id: stringType().uuid(),
	title: stringType().min(1).max(120).optional(),
	template: enumType([
		"modern",
		"minimal",
		"compact"
	]).optional(),
	data: dataSchema.optional()
}).parse(i)).handler(createSsrRpc("9d9cd5ee5ec54bcbdb748da2d9b672540ba95e9aa0a530b928763b3ede9d4e60"));
var deleteBuilderResume = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((i) => objectType({ id: stringType().uuid() }).parse(i)).handler(createSsrRpc("c2928ea06e2c3fd3e94f1a218cebb9230ee331686ea8ddc791c453c9a795620a"));
function ResumePreview({ data, template }) {
	if (template === "minimal") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minimal, { data });
	if (template === "compact") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compact, { data });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modern, { data });
}
function Section({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "border-b border-neutral-300 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-700",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 space-y-3 text-[11.5px] leading-snug text-neutral-800",
			children
		})]
	});
}
function Modern({ data }) {
	const p = data.personal;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white p-10 font-sans text-neutral-900",
		style: {
			width: 794,
			minHeight: 1123
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "border-b-2 border-indigo-600 pb-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold tracking-tight",
						children: p.full_name || "Your Name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-indigo-700",
						children: p.headline || "Headline / Target Role"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-[11px] text-neutral-600",
						children: [
							[
								p.email,
								p.phone,
								p.location
							].filter(Boolean).join(" · "),
							p.links.length > 0 && " · ",
							p.links.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [i > 0 && " · ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "underline",
								children: l.label || l.url
							})] }, i))
						]
					})
				]
			}),
			p.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Summary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p.summary })
			}),
			data.experience.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Experience",
				children: data.experience.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-semibold",
							children: [
								e.role || "Role",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-normal text-neutral-600",
									children: ["· ", e.company]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[10px] text-neutral-500",
							children: [e.start, e.end ? ` — ${e.end}` : ""]
						})]
					}),
					e.location && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] text-neutral-500",
						children: e.location
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "ml-4 list-disc space-y-0.5",
						children: e.bullets.filter(Boolean).map((b, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: b }, j))
					})
				] }, i))
			}),
			data.projects.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Projects",
				children: data.projects.map((pr, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-semibold",
						children: pr.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] text-neutral-500",
						children: pr.tech
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "ml-4 list-disc space-y-0.5",
					children: pr.bullets.filter(Boolean).map((b, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: b }, j))
				})] }, i))
			}),
			data.education.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Education",
				children: data.education.map((ed, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-semibold",
						children: ed.school
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[11px] text-neutral-600",
						children: [[ed.degree, ed.field].filter(Boolean).join(" — "), ed.score ? ` · ${ed.score}` : ""]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[10px] text-neutral-500",
						children: [ed.start, ed.end ? ` — ${ed.end}` : ""]
					})]
				}, i))
			}),
			data.skills.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Skills",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: data.skills.join(" · ") })
			}),
			data.achievements.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Achievements",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "ml-4 list-disc space-y-0.5",
					children: data.achievements.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: a }, i))
				})
			})
		]
	});
}
function Minimal({ data }) {
	const p = data.personal;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white p-12 font-serif text-neutral-900",
		style: {
			width: 794,
			minHeight: 1123
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl tracking-wide",
					children: p.full_name || "Your Name"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs uppercase tracking-[0.3em] text-neutral-500",
					children: p.headline
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-[10px] text-neutral-600",
					children: [
						p.email,
						p.phone,
						p.location
					].filter(Boolean).join(" · ")
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modern, { data })]
	});
}
function Compact({ data }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-white p-6 font-sans text-[10.5px] text-neutral-900",
		style: {
			width: 794,
			minHeight: 1123
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modern, { data })
	});
}
var AppError = class extends Error {
	code;
	status;
	constructor(code, message, status = 400) {
		super(message);
		this.name = "AppError";
		this.code = code;
		this.status = status;
	}
};
function isAppError(e) {
	return e instanceof AppError;
}
function toUserMessage(e) {
	if (isAppError(e)) return e.message;
	if (e instanceof Error) {
		if (e.message.includes("429")) return "Rate limited. Please try again in a moment.";
		if (e.message.includes("402")) return "AI credits exhausted. Please add credits to continue.";
		return e.message;
	}
	return "Something went wrong. Please try again.";
}
var EMPTY = {
	personal: {
		full_name: "",
		headline: "",
		email: "",
		phone: "",
		location: "",
		links: [],
		summary: ""
	},
	education: [],
	experience: [],
	projects: [],
	skills: [],
	achievements: []
};
function BuilderPage() {
	const list = useServerFn(listBuilderResumes);
	const create = useServerFn(createBuilderResume);
	const get = useServerFn(getBuilderResume);
	const update = useServerFn(updateBuilderResume);
	const remove = useServerFn(deleteBuilderResume);
	const { data: resumes, isLoading, refetch } = useQuery({
		queryKey: ["builderResumes"],
		queryFn: () => list()
	});
	const [activeId, setActiveId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!activeId && resumes && resumes.length > 0) setActiveId(resumes[0].id);
	}, [resumes, activeId]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight",
				children: "Resume Builder"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Build, preview, and export your resume as PDF."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: async () => {
					try {
						const r = await create({ data: {
							title: "Untitled resume",
							template: "modern"
						} });
						await refetch();
						setActiveId(r.id);
						toast.success("Created new resume");
					} catch (e) {
						toast.error(toUserMessage(e));
					}
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " New resume"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-[260px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-sm",
				children: "Your resumes"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-1",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-9 w-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-9 w-full" })] }) : resumes && resumes.length > 0 ? resumes.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setActiveId(r.id),
					className: `flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors ${activeId === r.id ? "bg-primary/10 text-primary" : "hover:bg-muted"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 shrink-0" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex-1 truncate",
							children: r.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "text-[10px]",
							children: r.template
						})
					]
				}, r.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-2 py-4 text-xs text-muted-foreground",
					children: "No resumes yet. Create one to start."
				})
			})] }), activeId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editor, {
				id: activeId,
				getFn: get,
				updateFn: update,
				removeFn: remove,
				onDeleted: async () => {
					setActiveId(null);
					await refetch();
				},
				onRenamed: async () => {
					await refetch();
				}
			}, activeId) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex flex-col items-center justify-center py-16 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-10 w-10 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "Create your first resume to start editing."
				})]
			}) })]
		})]
	});
}
function Editor({ id, getFn, updateFn, removeFn, onDeleted, onRenamed }) {
	const { data: row, isLoading } = useQuery({
		queryKey: ["builderResume", id],
		queryFn: () => getFn({ data: { id } })
	});
	const [title, setTitle] = (0, import_react.useState)("");
	const [template, setTemplate] = (0, import_react.useState)("modern");
	const [data, setData] = (0, import_react.useState)(EMPTY);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [exporting, setExporting] = (0, import_react.useState)(false);
	const previewRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!row) return;
		setTitle(row.title);
		setTemplate(row.template ?? "modern");
		setData({
			...EMPTY,
			...row.data ?? {}
		});
	}, [row]);
	const save = async () => {
		setSaving(true);
		try {
			await updateFn({ data: {
				id,
				title,
				template,
				data
			} });
			toast.success("Saved");
			onRenamed();
		} catch (e) {
			toast.error(toUserMessage(e));
		} finally {
			setSaving(false);
		}
	};
	const exportPdf = async () => {
		if (!previewRef.current) return;
		setExporting(true);
		try {
			const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([import("../_libs/html2canvas-pro.mjs").then((n) => n.t), import("../_libs/jspdf.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()))]);
			const canvas = await html2canvas(previewRef.current, {
				scale: 2,
				backgroundColor: "#ffffff"
			});
			const img = canvas.toDataURL("image/png");
			const pdf = new jsPDF({
				unit: "px",
				format: "a4",
				compress: true
			});
			const w = pdf.internal.pageSize.getWidth();
			const h = canvas.height * w / canvas.width;
			pdf.addImage(img, "PNG", 0, 0, w, h);
			pdf.save(`${title || "resume"}.pdf`);
		} catch (e) {
			toast.error(toUserMessage(e));
		} finally {
			setExporting(false);
		}
	};
	const dataMemo = (0, import_react.useMemo)(() => data, [data]);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-[600px] w-full" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "flex flex-wrap items-center gap-3 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: title,
					onChange: (e) => setTitle(e.target.value),
					className: "max-w-xs"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: template,
					onValueChange: (v) => setTemplate(v),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "modern",
							children: "Modern"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "minimal",
							children: "Minimal"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "compact",
							children: "Compact"
						})
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: save,
							disabled: saving,
							children: [
								saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-2 h-4 w-4" }),
								" ",
								"Save"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: exportPdf,
							disabled: exporting,
							children: [
								exporting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-4 w-4" }),
								" ",
								"Export PDF"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							"aria-label": "Delete resume",
							onClick: async () => {
								if (!confirm("Delete this resume?")) return;
								await removeFn({ data: { id } });
								onDeleted();
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
						})
					]
				})
			]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 xl:grid-cols-[1fr_auto]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					defaultValue: "personal",
					className: "w-full",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
							className: "flex flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "personal",
									children: "Personal"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "experience",
									children: "Experience"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "projects",
									children: "Projects"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "education",
									children: "Education"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "skills",
									children: "Skills"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "achievements",
									children: "Achievements"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "personal",
							className: "mt-4 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid2, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Full name",
									value: data.personal.full_name,
									onChange: (v) => setData({
										...data,
										personal: {
											...data.personal,
											full_name: v
										}
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Headline",
									value: data.personal.headline,
									onChange: (v) => setData({
										...data,
										personal: {
											...data.personal,
											headline: v
										}
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Email",
									value: data.personal.email,
									onChange: (v) => setData({
										...data,
										personal: {
											...data.personal,
											email: v
										}
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Phone",
									value: data.personal.phone,
									onChange: (v) => setData({
										...data,
										personal: {
											...data.personal,
											phone: v
										}
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Location",
									value: data.personal.location,
									onChange: (v) => setData({
										...data,
										personal: {
											...data.personal,
											location: v
										}
									})
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Summary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 4,
								value: data.personal.summary,
								onChange: (e) => setData({
									...data,
									personal: {
										...data.personal,
										summary: e.target.value
									}
								})
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "experience",
							className: "mt-4 space-y-3",
							children: [data.experience.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ItemCard, {
								onRemove: () => setData({
									...data,
									experience: data.experience.filter((_, j) => j !== i)
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid2, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Company",
										value: e.company,
										onChange: (v) => updateAt(data, setData, "experience", i, { company: v })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Role",
										value: e.role,
										onChange: (v) => updateAt(data, setData, "experience", i, { role: v })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Start",
										value: e.start,
										onChange: (v) => updateAt(data, setData, "experience", i, { start: v })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "End",
										value: e.end,
										onChange: (v) => updateAt(data, setData, "experience", i, { end: v })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Location",
										value: e.location,
										onChange: (v) => updateAt(data, setData, "experience", i, { location: v })
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulletEditor, {
									bullets: e.bullets,
									onChange: (b) => updateAt(data, setData, "experience", i, { bullets: b })
								})]
							}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setData({
									...data,
									experience: [...data.experience, {
										company: "",
										role: "",
										location: "",
										start: "",
										end: "",
										bullets: [""]
									}]
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " Add experience"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "projects",
							className: "mt-4 space-y-3",
							children: [data.projects.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ItemCard, {
								onRemove: () => setData({
									...data,
									projects: data.projects.filter((_, j) => j !== i)
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid2, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Name",
										value: p.name,
										onChange: (v) => updateAt(data, setData, "projects", i, { name: v })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Tech stack",
										value: p.tech,
										onChange: (v) => updateAt(data, setData, "projects", i, { tech: v })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Link",
										value: p.link,
										onChange: (v) => updateAt(data, setData, "projects", i, { link: v })
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulletEditor, {
									bullets: p.bullets,
									onChange: (b) => updateAt(data, setData, "projects", i, { bullets: b })
								})]
							}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setData({
									...data,
									projects: [...data.projects, {
										name: "",
										tech: "",
										link: "",
										bullets: [""]
									}]
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " Add project"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "education",
							className: "mt-4 space-y-3",
							children: [data.education.map((ed, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemCard, {
								onRemove: () => setData({
									...data,
									education: data.education.filter((_, j) => j !== i)
								}),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid2, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "School",
										value: ed.school,
										onChange: (v) => updateAt(data, setData, "education", i, { school: v })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Degree",
										value: ed.degree,
										onChange: (v) => updateAt(data, setData, "education", i, { degree: v })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Field",
										value: ed.field,
										onChange: (v) => updateAt(data, setData, "education", i, { field: v })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Start",
										value: ed.start,
										onChange: (v) => updateAt(data, setData, "education", i, { start: v })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "End",
										value: ed.end,
										onChange: (v) => updateAt(data, setData, "education", i, { end: v })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Score / CGPA",
										value: ed.score,
										onChange: (v) => updateAt(data, setData, "education", i, { score: v })
									})
								] })
							}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setData({
									...data,
									education: [...data.education, {
										school: "",
										degree: "",
										field: "",
										start: "",
										end: "",
										score: ""
									}]
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " Add education"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "skills",
							className: "mt-4 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Skills (comma-separated)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 3,
								value: data.skills.join(", "),
								onChange: (e) => setData({
									...data,
									skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "achievements",
							className: "mt-4 space-y-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulletEditor, {
								bullets: data.achievements,
								onChange: (b) => setData({
									...data,
									achievements: b
								})
							})
						})
					]
				})
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "overflow-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "origin-top-left scale-[0.65] xl:scale-[0.7]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							ref: previewRef,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResumePreview, {
								data: dataMemo,
								template
							})
						})
					})
				})
			})]
		})]
	});
}
function Grid2({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-3 sm:grid-cols-2",
		children
	});
}
function Field({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
		value,
		onChange: (e) => onChange(e.target.value)
	})] });
}
function ItemCard({ children, onRemove }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative rounded-lg border p-3 pr-10",
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "ghost",
			size: "icon",
			"aria-label": "Remove item",
			className: "absolute right-1 top-1",
			onClick: onRemove,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
		})]
	});
}
function BulletEditor({ bullets, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 space-y-2",
		children: [bullets.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: b,
				onChange: (e) => onChange(bullets.map((x, j) => j === i ? e.target.value : x)),
				placeholder: "Use action verbs + quantified impact"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "icon",
				"aria-label": "Remove bullet",
				onClick: () => onChange(bullets.filter((_, j) => j !== i)),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
			})]
		}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "outline",
			size: "sm",
			onClick: () => onChange([...bullets, ""]),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " Add bullet"]
		})]
	});
}
function updateAt(data, setData, key, index, patch) {
	const arr = [...data[key]];
	arr[index] = {
		...arr[index],
		...patch
	};
	setData({
		...data,
		[key]: arr
	});
}
//#endregion
export { BuilderPage as component };
