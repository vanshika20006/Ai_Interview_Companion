import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { Z as Inbox, ct as ExternalLink, d as Trash2, g as Sparkles, jt as Bell, xt as Check } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as listNotifications, r as markRead, t as deleteNotification } from "./notifications.functions-DkwmMoLM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-B1LlRtR6.js
var import_jsx_runtime = require_jsx_runtime();
function timeAgo(date) {
	const diff = Date.now() - new Date(date).getTime();
	const m = Math.floor(diff / 6e4);
	if (m < 1) return "just now";
	if (m < 60) return `${m}m ago`;
	const h = Math.floor(m / 60);
	if (h < 24) return `${h}h ago`;
	return `${Math.floor(h / 24)}d ago`;
}
function NotificationsPage() {
	const qc = useQueryClient();
	const fetchFn = useServerFn(listNotifications);
	const markFn = useServerFn(markRead);
	const delFn = useServerFn(deleteNotification);
	const { data, isLoading } = useQuery({
		queryKey: ["notifications"],
		queryFn: () => fetchFn()
	});
	const mark = useMutation({
		mutationFn: (vars) => markFn({ data: vars }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["notifications"] });
			qc.invalidateQueries({ queryKey: ["dashboardSummary"] });
		}
	});
	const remove = useMutation({
		mutationFn: (id) => delFn({ data: { id } }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "flex items-center gap-2 text-2xl font-semibold tracking-tight",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "h-6 w-6" }), " Notifications"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [
					data?.unread ?? 0,
					" unread of ",
					data?.items.length ?? 0
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => mark.mutate({ all: true }),
				disabled: !data?.unread,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), " Mark all read"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
			className: "pb-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Inbox"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "p-0",
			children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12" })
				]
			}) : (data?.items.length ?? 0) === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-6 py-12 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "mx-auto h-8 w-8 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "No notifications yet."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Activity from interviews, achievements, and reviews will show up here."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y",
				children: data.items.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: `flex items-start gap-3 px-4 py-3 ${!n.read_at ? "bg-primary/5" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate font-medium",
										children: n.title
									}), !n.read_at && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										children: "New"
									})]
								}),
								n.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "line-clamp-2 text-sm text-muted-foreground",
									children: n.body
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-0.5 text-[11px] text-muted-foreground",
									children: [
										n.type,
										" · ",
										timeAgo(n.created_at)
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 items-center gap-1",
							children: [
								n.link && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "ghost",
									size: "icon",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: n.link,
										onClick: () => !n.read_at && mark.mutate({ ids: [n.id] }),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-4 w-4" })
									})
								}),
								!n.read_at && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onClick: () => mark.mutate({ ids: [n.id] }),
									"aria-label": "Mark read",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onClick: () => remove.mutate(n.id),
									"aria-label": "Delete",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								})
							]
						})
					]
				}, n.id))
			})
		})] })]
	});
}
//#endregion
export { NotificationsPage as component };
