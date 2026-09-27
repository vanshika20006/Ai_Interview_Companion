import { o as __toESM } from "../_runtime.mjs";
import { s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CWLNe4_N.mjs";
import { ht as stringType, lt as arrayType, pt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { K as LoaderCircle, _t as CircleAlert, at as FileText, ct as ExternalLink, g as Sparkles, gt as CircleCheck, rt as FolderOpen, s as Upload } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Progress } from "./progress-DOIEKRJF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/resume-DkeEiWzt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var analyzeResume = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => objectType({
	file_name: stringType().min(1).max(200),
	raw_text: stringType().min(50).max(5e4),
	target_roles: arrayType(stringType()).optional()
}).parse(input)).handler(createSsrRpc("c8f61b0afaae08e817dcd91bcf0654257dcb701d1ab06bf9bf2b1159856e40ce"));
var getLatestAnalysis = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("d868fd96972712ecd17d5e7b88aad0f3b2378ff30c7e5c9c3bad4787b6fd777a"));
createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("4d2623fdb3c95f1346e8b79b0826acc800c8742dbaf2fcc6ebf4178956f4fbc0"));
function ResumePage() {
	const qc = useQueryClient();
	const fetchAnalysis = useServerFn(getLatestAnalysis);
	const runAnalyze = useServerFn(analyzeResume);
	const { data: analysis, isLoading } = useQuery({
		queryKey: ["latestAnalysis"],
		queryFn: () => fetchAnalysis()
	});
	const [text, setText] = (0, import_react.useState)("");
	const [fileName, setFileName] = (0, import_react.useState)("");
	const [analyzing, setAnalyzing] = (0, import_react.useState)(false);
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const dragDepth = (0, import_react.useRef)(0);
	const inputRef = (0, import_react.useRef)(null);
	async function handleFile(file) {
		setFileName(file.name);
		if (file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
			setText(await file.text());
			return;
		}
		if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
			try {
				const pdfjs = await import("../_libs/pdfjs-dist.mjs").then((n) => n.t);
				const workerSrc = (await import("./pdf.worker.min-7lBPow20.mjs")).default;
				pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
				const buf = await file.arrayBuffer();
				const pdf = await pdfjs.getDocument({ data: buf }).promise;
				let out = "";
				for (let i = 1; i <= pdf.numPages; i++) {
					const tc = await (await pdf.getPage(i)).getTextContent();
					out += tc.items.map((it) => "str" in it ? it.str : "").join(" ") + "\n";
				}
				setText(out);
			} catch (err) {
				console.error(err);
				toast.error("Could not parse PDF. Try pasting the text below.");
			}
			return;
		}
		toast.error("Unsupported file. Upload .pdf or .txt or paste below.");
	}
	async function handleAnalyze() {
		if (text.trim().length < 50) return toast.error("Resume text is too short (min 50 chars).");
		setAnalyzing(true);
		try {
			await runAnalyze({ data: {
				file_name: fileName || "Pasted resume",
				raw_text: text
			} });
			toast.success("Analysis complete");
			qc.invalidateQueries({ queryKey: ["latestAnalysis"] });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Analysis failed");
		} finally {
			setAnalyzing(false);
		}
	}
	(0, import_react.useEffect)(() => {
		function onDragEnter(e) {
			if (!e.dataTransfer?.types?.includes("Files")) return;
			e.preventDefault();
			dragDepth.current += 1;
			setIsDragging(true);
		}
		function onDragOver(e) {
			if (!e.dataTransfer?.types?.includes("Files")) return;
			e.preventDefault();
		}
		function onDragLeave(e) {
			if (!e.dataTransfer?.types?.includes("Files")) return;
			dragDepth.current = Math.max(0, dragDepth.current - 1);
			if (dragDepth.current === 0) setIsDragging(false);
		}
		function onDrop(e) {
			if (!e.dataTransfer?.files?.length) return;
			e.preventDefault();
			dragDepth.current = 0;
			setIsDragging(false);
			const f = e.dataTransfer.files[0];
			if (f) handleFile(f);
		}
		window.addEventListener("dragenter", onDragEnter);
		window.addEventListener("dragover", onDragOver);
		window.addEventListener("dragleave", onDragLeave);
		window.addEventListener("drop", onDrop);
		return () => {
			window.removeEventListener("dragenter", onDragEnter);
			window.removeEventListener("dragover", onDragOver);
			window.removeEventListener("dragleave", onDragLeave);
			window.removeEventListener("drop", onDrop);
		};
	}, []);
	function openPicker() {
		try {
			inputRef.current?.click();
		} catch {
			toast.error("File picker unavailable. Drag your file onto this page or paste the text below.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl space-y-6",
		children: [
			isDragging && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-primary/10 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border-2 border-dashed border-primary bg-background/90 px-10 py-8 text-center shadow-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mx-auto h-8 w-8 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 text-base font-semibold",
							children: "Drop your resume anywhere"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "PDF, TXT or MD"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight",
				children: "AI Resume Analyzer"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Upload your resume to get an ATS score, missing keywords, and actionable suggestions powered by Gemini."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Upload or paste your resume"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Drag & drop, browse, or paste — whichever works best. PDF or TXT, max 50,000 characters." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onDragOver: (e) => {
							e.preventDefault();
							e.dataTransfer.dropEffect = "copy";
						},
						onDrop: (e) => {
							e.preventDefault();
							const f = e.dataTransfer.files[0];
							if (f) handleFile(f);
						},
						className: `flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-border bg-muted/30"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-6 w-6 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: fileName || "Drag your resume here"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: "PDF, TXT, MD · drop anywhere on this page"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: openPicker,
								className: "mt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { className: "mr-2 h-4 w-4" }), " Browse files"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: inputRef,
						id: "resume-file-input",
						type: "file",
						accept: ".pdf,.txt,.md,application/pdf,text/plain",
						className: "hidden",
						onChange: (e) => {
							const f = e.target.files?.[0];
							if (f) handleFile(f);
							e.target.value = "";
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: text,
						onChange: (e) => setText(e.target.value),
						placeholder: "Or paste your resume text here...",
						className: "min-h-40 w-full resize-y rounded-md border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground",
							children: [text.length, " characters"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: handleAnalyze,
							disabled: analyzing || text.length < 50,
							size: "lg",
							children: analyzing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), " Analyzing with Gemini..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-2 h-4 w-4" }), " Analyze Resume"] })
						})]
					})
				]
			})] }),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-32 items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" })
			}) : analysis ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalysisReport, { analysis }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-8 w-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm",
					children: "No analysis yet. Upload a resume to get started."
				})]
			}) })
		]
	});
}
function asStringArray(v) {
	return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
}
function asRoleMatch(v) {
	if (!Array.isArray(v)) return [];
	return v.flatMap((item) => {
		if (item && typeof item === "object" && "role" in item && "match_percent" in item) {
			const r = item.role;
			const m = item.match_percent;
			if (typeof r === "string" && typeof m === "number") return [{
				role: r,
				match_percent: m
			}];
		}
		return [];
	});
}
function AnalysisReport({ analysis }) {
	const strengths = asStringArray(analysis.strengths);
	const weaknesses = asStringArray(analysis.weaknesses);
	const missingKw = asStringArray(analysis.missing_keywords);
	const missingSkills = asStringArray(analysis.missing_skills);
	const suggestions = asStringArray(analysis.suggestions);
	const topics = asStringArray(analysis.recommended_topics);
	const roleMatch = asRoleMatch(analysis.role_match);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "lg:col-span-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "ATS Score"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-5xl font-bold text-gradient",
							children: [analysis.ats_score, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xl text-muted-foreground",
								children: "/100"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: analysis.ats_score,
							className: "h-2.5"
						}),
						analysis.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: analysis.summary
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Role match"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "space-y-3",
					children: roleMatch.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No role match data."
					}) : roleMatch.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[1fr_auto] items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: r.role
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
								value: r.match_percent,
								className: "h-1.5"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm font-semibold",
							children: [r.match_percent, "%"]
						})]
					}, r.role))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulletCard, {
				icon: CircleCheck,
				title: "Strengths",
				items: strengths,
				tone: "success"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulletCard, {
				icon: CircleAlert,
				title: "Weaknesses",
				items: weaknesses,
				tone: "destructive"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulletCard, {
				icon: Sparkles,
				title: "Suggestions",
				items: suggestions,
				tone: "primary"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Missing keywords"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: missingKw.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Looks great!"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5",
				children: missingKw.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "secondary",
					children: k
				}, k))
			}) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Missing skills"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: missingSkills.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "No critical gaps detected."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5",
				children: missingSkills.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: k }, k))
			}) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "lg:col-span-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Recommended LeetCode topics"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Based on your resume's tech stack and target roles." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "flex flex-wrap gap-2",
					children: topics.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: `/leetcode?topic=${encodeURIComponent(t)}`,
						className: "inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs font-medium hover:border-primary hover:bg-accent",
						children: [
							t,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })
						]
					}, t))
				})]
			})
		]
	});
}
function BulletCard({ icon: Icon, title, items, tone }) {
	const toneMap = {
		success: "text-success",
		destructive: "text-destructive",
		primary: "text-primary"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
		className: "flex items-center gap-2 text-base",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-4 w-4 ${toneMap[tone]}` }),
			" ",
			title
		]
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "—"
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-2 text-sm",
		children: items.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex items-start gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current ${toneMap[tone]}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s })]
		}, i))
	}) })] });
}
//#endregion
export { ResumePage as component };
