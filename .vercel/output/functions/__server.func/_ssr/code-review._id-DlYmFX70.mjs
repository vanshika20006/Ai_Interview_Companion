import { o as __toESM } from "../_runtime.mjs";
import { s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { Ft as ArrowLeft, S as Send, g as Sparkles } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { t as Markdown } from "../_libs/react-markdown+[...].mjs";
import { t as Route } from "./code-review._id-BIe_Wqq3.mjs";
import { r as getReview, t as addReviewComment } from "./codeReview.functions-BU4v6MlK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/code-review._id-DlYmFX70.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReviewDetail() {
	const { id } = Route.useParams();
	const qc = useQueryClient();
	const fetchFn = useServerFn(getReview);
	const commentFn = useServerFn(addReviewComment);
	const { data, isLoading } = useQuery({
		queryKey: ["codeReview", id],
		queryFn: () => fetchFn({ data: { id } })
	});
	const [body, setBody] = (0, import_react.useState)("");
	const post = useMutation({
		mutationFn: () => commentFn({ data: {
			reviewId: id,
			body
		} }),
		onSuccess: () => {
			setBody("");
			qc.invalidateQueries({ queryKey: ["codeReview", id] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Failed")
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96" });
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Not found." });
	const { review, comments } = data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "ghost",
				size: "sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/code-review",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " All reviews"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: review.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: [
						review.language,
						" · by ",
						review.author
					]
				})] }), review.ai_score != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					variant: review.ai_score >= 80 ? "default" : "secondary",
					children: [
						"AI score ",
						review.ai_score,
						"/100"
					]
				})]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-4",
				children: [review.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: review.description
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "overflow-x-auto rounded-md border bg-muted p-3 text-xs",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: review.code })
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "flex items-center gap-2 text-base",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary" }), " AI Feedback"]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "prose prose-sm dark:prose-invert max-w-none",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, { children: review.ai_feedback ?? "_No AI feedback._" })
			}) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "text-base",
				children: [
					"Community (",
					comments.length,
					")"
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3",
				children: [
					comments.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Be the first to comment."
					}),
					comments.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium text-muted-foreground",
							children: c.author
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 whitespace-pre-wrap text-sm",
							children: c.body
						})]
					}, c.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: body,
							onChange: (e) => setBody(e.target.value),
							placeholder: "Share feedback…",
							rows: 3
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => post.mutate(),
							disabled: !body.trim() || post.isPending,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }), " Comment"]
						})]
					})
				]
			})] })
		]
	});
}
//#endregion
export { ReviewDetail as component };
