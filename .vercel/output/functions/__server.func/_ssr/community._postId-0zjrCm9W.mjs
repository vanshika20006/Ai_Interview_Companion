import { o as __toESM } from "../_runtime.mjs";
import { s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { Ft as ArrowLeft, K as LoaderCircle, Q as Heart, S as Send } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as supabase } from "./client-QZpAg5-N.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { i as getPost, n as addComment, o as toggleLike } from "./community.functions-4VBtB-w6.mjs";
import { t as formatDistanceToNow } from "../_libs/date-fns.mjs";
import { t as Route } from "./community._postId-D-BGP-fd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/community._postId-0zjrCm9W.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PostPage() {
	const { postId } = Route.useParams();
	const qc = useQueryClient();
	const fetchPost = useServerFn(getPost);
	const add = useServerFn(addComment);
	const like = useServerFn(toggleLike);
	const [body, setBody] = (0, import_react.useState)("");
	const { data, isLoading } = useQuery({
		queryKey: ["post", postId],
		queryFn: () => fetchPost({ data: { id: postId } })
	});
	(0, import_react.useEffect)(() => {
		const ch = supabase.channel(`post-${postId}`).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "comments",
			filter: `post_id=eq.${postId}`
		}, () => {
			qc.invalidateQueries({ queryKey: ["post", postId] });
		}).subscribe();
		return () => {
			supabase.removeChannel(ch);
		};
	}, [postId, qc]);
	const addMut = useMutation({
		mutationFn: () => add({ data: {
			post_id: postId,
			body
		} }),
		onSuccess: () => {
			setBody("");
			qc.invalidateQueries({ queryKey: ["post", postId] });
		},
		onError: (e) => toast.error(e.message)
	});
	const likeMut = useMutation({
		mutationFn: () => like({ data: {
			post_id: postId,
			liked: !!data?.liked
		} }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["post", postId] })
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-32 w-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full" })]
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Not found" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "ghost",
				size: "sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/community",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-1.5 h-4 w-4" }), " Back"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: data.post.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "secondary",
					children: data.post.room
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, { children: [
				data.post.author?.full_name || data.post.author?.email || "Anonymous",
				" ·",
				" ",
				formatDistanceToNow(new Date(data.post.created_at), { addSuffix: true })
			] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "whitespace-pre-wrap text-sm",
					children: data.post.body
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "ghost",
					className: "gap-1.5",
					onClick: () => likeMut.mutate(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `h-4 w-4 ${data.liked ? "fill-primary text-primary" : ""}` }),
						" ",
						data.post.like_count
					]
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "text-base",
				children: [
					"Comments (",
					data.comments.length,
					")"
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 2,
						placeholder: "Add a comment…",
						value: body,
						onChange: (e) => setBody(e.target.value)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						onClick: () => addMut.mutate(),
						disabled: addMut.isPending || !body.trim(),
						children: addMut.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
					})]
				}), data.comments.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border bg-muted/40 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground mb-1",
						children: [
							c.author?.full_name || c.author?.email || "Anonymous",
							" ·",
							" ",
							formatDistanceToNow(new Date(c.created_at), { addSuffix: true })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm whitespace-pre-wrap",
						children: c.body
					})]
				}, c.id))]
			})] })
		]
	});
}
//#endregion
export { PostPage as component };
