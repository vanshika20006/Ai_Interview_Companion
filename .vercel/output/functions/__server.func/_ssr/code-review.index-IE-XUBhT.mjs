import { o as __toESM } from "../_runtime.mjs";
import { s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { O as Plus, Pt as ArrowRight, ft as CodeXml, g as Sparkles } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { i as listReviews, n as createReview } from "./codeReview.functions-BU4v6MlK.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as DialogTrigger, t as Dialog } from "./dialog-DIo89e4g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/code-review.index-IE-XUBhT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LANGS = [
	"javascript",
	"typescript",
	"python",
	"java",
	"cpp",
	"go",
	"rust",
	"csharp",
	"sql"
];
function CodeReviewPage() {
	const qc = useQueryClient();
	const navigate = useNavigate();
	const fetchFn = useServerFn(listReviews);
	const createFn = useServerFn(createReview);
	const { data, isLoading } = useQuery({
		queryKey: ["codeReviews"],
		queryFn: () => fetchFn()
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [title, setTitle] = (0, import_react.useState)("");
	const [language, setLanguage] = (0, import_react.useState)("javascript");
	const [description, setDescription] = (0, import_react.useState)("");
	const [code, setCode] = (0, import_react.useState)("");
	const create = useMutation({
		mutationFn: () => createFn({ data: {
			title,
			language,
			description,
			code
		} }),
		onSuccess: (r) => {
			toast.success("AI reviewed your code");
			qc.invalidateQueries({ queryKey: ["codeReviews"] });
			setOpen(false);
			setTitle("");
			setDescription("");
			setCode("");
			navigate({
				to: "/code-review/$id",
				params: { id: r.id }
			});
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Failed")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "flex items-center gap-2 text-2xl font-semibold tracking-tight",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeXml, { className: "h-6 w-6" }), " Peer Code Review"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Share a snippet, get instant AI feedback, and discuss with the community."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New review"] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Submit code for review" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "AI will score your code 0–100 and suggest improvements. The community can comment." })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: title,
									onChange: (e) => setTitle(e.target.value),
									placeholder: "Binary search refactor"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Context (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: description,
										onChange: (e) => setDescription(e.target.value),
										placeholder: "What does this do? What do you want feedback on?"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Language" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: language,
										onValueChange: setLanguage,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: LANGS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: l,
											children: l
										}, l)) })]
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Code" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: code,
									onChange: (e) => setCode(e.target.value),
									rows: 12,
									className: "font-mono text-xs",
									placeholder: "Paste your code here..."
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => create.mutate(),
							disabled: create.isPending || title.length < 3 || code.length < 10,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), create.isPending ? "Reviewing…" : "Submit for AI review"]
						}) })
					]
				})]
			})]
		}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24" })]
		}) : (data?.length ?? 0) === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "py-12 text-center text-sm text-muted-foreground",
			children: "No reviews yet. Be the first to share a snippet."
		}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 md:grid-cols-2",
			children: data.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "transition-shadow hover:shadow-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "pb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base",
							children: r.title
						}), r.ai_score != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: r.ai_score >= 80 ? "default" : "secondary",
							children: [r.ai_score, "/100"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, { children: [
						r.language,
						" · by ",
						r.author
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [r.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "line-clamp-2 text-sm text-muted-foreground",
					children: r.description
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "link",
					className: "mt-2 h-auto p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/code-review/$id",
						params: { id: r.id },
						children: ["Open review ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
					})
				})] })]
			}, r.id))
		})]
	});
}
//#endregion
export { CodeReviewPage as component };
