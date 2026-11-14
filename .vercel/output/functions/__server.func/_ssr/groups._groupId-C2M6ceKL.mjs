import { o as __toESM } from "../_runtime.mjs";
import { s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { Ft as ArrowLeft, I as MessageSquare, S as Send, U as LogOut, a as UsersRound, dt as Copy, g as Sparkles } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { a as listGroupMessages, i as leaveGroup, n as getGroup, s as sendGroupMessage } from "./studyGroups.functions-BCj40pkJ.mjs";
import { t as Route } from "./groups._groupId-0HppG35G.mjs";
import { n as AvatarFallback, t as Avatar } from "./avatar-CiQwCJNR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/groups._groupId-C2M6ceKL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GroupDetail() {
	const { groupId } = Route.useParams();
	const qc = useQueryClient();
	const navigate = useNavigate();
	const fetchGroup = useServerFn(getGroup);
	const leaveFn = useServerFn(leaveGroup);
	const fetchMessages = useServerFn(listGroupMessages);
	const sendMsgFn = useServerFn(sendGroupMessage);
	const [message, setMessage] = (0, import_react.useState)("");
	const { data, isLoading } = useQuery({
		queryKey: ["group", groupId],
		queryFn: () => fetchGroup({ data: { id: groupId } })
	});
	const { data: messages, isLoading: loadingMsgs } = useQuery({
		queryKey: ["groupMessages", groupId],
		queryFn: () => fetchMessages({ data: { group_id: groupId } })
	});
	const postMsg = useMutation({
		mutationFn: () => sendMsgFn({ data: {
			group_id: groupId,
			content: message
		} }),
		onSuccess: () => {
			setMessage("");
			toast.success("Posted update to group");
			qc.invalidateQueries({ queryKey: ["groupMessages", groupId] });
		},
		onError: (e) => toast.error(e.message)
	});
	const leave = useMutation({
		mutationFn: () => leaveFn({ data: { group_id: groupId } }),
		onSuccess: () => {
			toast.success("Left group");
			qc.invalidateQueries({ queryKey: ["myGroups"] });
			navigate({ to: "/groups" });
		},
		onError: (e) => toast.error(e.message)
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full" });
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Not found" });
	const inviteUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/groups?code=${data.group.invite_code}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "ghost",
				size: "sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/groups",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-1.5 h-4 w-4" }), " Back"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersRound, { className: "h-5 w-5 text-primary" }),
					" ",
					data.group.name
				]
			}), data.group.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: data.group.description })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-4",
				children: [data.group.goal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border bg-muted/40 p-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: "Goal:"
						}),
						" ",
						data.group.goal
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "font-mono",
							children: data.group.invite_code
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => {
								navigator.clipboard.writeText(data.group.invite_code);
								toast.success("Invite code copied");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-1.5 h-3.5 w-3.5" }), " Copy code"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => {
								navigator.clipboard.writeText(inviteUrl);
								toast.success("Invite link copied");
							},
							children: "Copy link"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "ml-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "ghost",
								className: "text-destructive",
								onClick: () => leave.mutate(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-1.5 h-3.5 w-3.5" }), " Leave group"]
							})
						})
					]
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 md:grid-cols-[1fr_300px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "flex flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2 text-base",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-4 w-4 text-primary" }), " Group Discussions & Activity"]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-4 flex-1 flex flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								placeholder: "Share a study update, solution link, or ask the group...",
								value: message,
								onChange: (e) => setMessage(e.target.value),
								rows: 3
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: () => postMsg.mutate(),
								disabled: !message.trim() || postMsg.isPending,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "mr-1.5 h-3.5 w-3.5" }), " Post to Group"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3 pt-3 border-t",
							children: loadingMsgs ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20 w-full" }) : !messages?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-8 text-center text-sm text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mx-auto h-6 w-6 text-muted-foreground mb-1" }), "No group posts yet. Be the first to start a conversation!"]
							}) : messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border p-3 space-y-1 bg-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: m.author_name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground text-[10px]",
										children: new Date(m.created_at).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit"
										})
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm whitespace-pre-wrap",
									children: m.body
								})]
							}, m.id))
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "h-fit",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-base",
						children: [
							"Members (",
							data.members.length,
							")"
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y",
						children: data.members.map((m) => {
							const name = m.profile?.full_name ?? m.profile?.username ?? "Member";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-3 py-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
										className: "h-8 w-8",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
											className: "text-xs",
											children: name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase()
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-medium",
											children: name
										}), m.profile?.username && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-muted-foreground",
											children: ["@", m.profile.username]
										})]
									}),
									m.role === "owner" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										children: "Owner"
									})
								]
							}, m.user_id);
						})
					}) })]
				})]
			})
		]
	});
}
//#endregion
export { GroupDetail as component };
