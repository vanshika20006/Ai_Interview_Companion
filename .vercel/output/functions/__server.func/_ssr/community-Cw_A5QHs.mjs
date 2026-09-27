import { o as __toESM } from "../_runtime.mjs";
import { s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { C as Search, K as LoaderCircle, O as Plus, Ot as Bookmark, Q as Heart, R as MessageCircle, kt as BookmarkCheck } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { i as TabsTrigger, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as supabase } from "./client-QZpAg5-N.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { a as listPosts, o as toggleLike, r as createPost, s as toggleSavePost, t as ROOMS } from "./community.functions-4VBtB-w6.mjs";
import { t as formatDistanceToNow } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/community-Cw_A5QHs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CommunityPage() {
	const qc = useQueryClient();
	const fetchPosts = useServerFn(listPosts);
	const create = useServerFn(createPost);
	const like = useServerFn(toggleLike);
	const savePost = useServerFn(toggleSavePost);
	const [room, setRoom] = (0, import_react.useState)("DSA");
	const [search, setSearch] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [title, setTitle] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const [newRoom, setNewRoom] = (0, import_react.useState)("DSA");
	const { data: posts, isLoading } = useQuery({
		queryKey: [
			"posts",
			room,
			search
		],
		queryFn: () => fetchPosts({ data: {
			room,
			search: search || void 0
		} })
	});
	(0, import_react.useEffect)(() => {
		const ch = supabase.channel("community-posts").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "community_posts"
		}, () => {
			qc.invalidateQueries({ queryKey: ["posts"] });
		}).subscribe();
		return () => {
			supabase.removeChannel(ch);
		};
	}, [qc]);
	const createMut = useMutation({
		mutationFn: () => create({ data: {
			room: newRoom,
			title,
			body
		} }),
		onSuccess: () => {
			toast.success("Posted!");
			setOpen(false);
			setTitle("");
			setBody("");
			qc.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const likeMut = useMutation({
		mutationFn: (args) => like({ data: args }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] })
	});
	const saveMut = useMutation({
		mutationFn: (args) => savePost({ data: args }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: "Community"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Discuss prep, share experiences, and learn together."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
					open,
					onOpenChange: setOpen,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " New post"] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Create post" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: newRoom,
									onValueChange: setNewRoom,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: ROOMS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: r,
										children: r
									}, r)) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Title",
									value: title,
									onChange: (e) => setTitle(e.target.value),
									maxLength: 200
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 6,
									placeholder: "Write your post…",
									value: body,
									onChange: (e) => setBody(e.target.value)
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => createMut.mutate(),
							disabled: createMut.isPending || !title.trim() || !body.trim(),
							children: [createMut.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), " Post"]
						}) })
					] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
				value: room,
				onValueChange: setRoom,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, {
					className: "flex flex-wrap h-auto",
					children: ROOMS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: r,
						children: r
					}, r))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Search posts…",
					value: search,
					onChange: (e) => setSearch(e.target.value),
					className: "pl-9"
				})]
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 w-full" }, i))
			}) : !posts?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-12 text-center text-sm text-muted-foreground",
				children: [
					"Be the first to post in ",
					room,
					"."
				]
			}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: posts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "transition hover:shadow-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/community/$postId",
									params: { postId: p.id },
									className: "hover:underline",
									children: p.title
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: "text-[10px]",
								children: p.room
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								p.author?.full_name || p.author?.email || "Anonymous",
								" ·",
								" ",
								formatDistanceToNow(new Date(p.created_at), { addSuffix: true })
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground line-clamp-3",
							children: p.body
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "ghost",
									className: "h-8 gap-1.5",
									onClick: () => likeMut.mutate({
										post_id: p.id,
										liked: p.liked
									}),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `h-3.5 w-3.5 ${p.liked ? "fill-primary text-primary" : ""}` }),
										" ",
										p.like_count
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									className: "h-8 gap-1.5",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/community/$postId",
										params: { postId: p.id },
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-3.5 w-3.5" }),
											" ",
											p.comment_count
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									className: "h-8",
									onClick: () => saveMut.mutate({
										post_id: p.id,
										saved: p.saved
									}),
									children: p.saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkCheck, { className: "h-3.5 w-3.5 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "h-3.5 w-3.5" })
								})
							]
						})]
					})]
				}, p.id))
			})
		]
	});
}
//#endregion
export { CommunityPage as component };
