import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { Ft as ArrowLeft, U as LogOut, a as UsersRound, dt as Copy } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as leaveGroup, n as getGroup } from "./studyGroups.functions-B5-chx4I.mjs";
import { t as Route } from "./groups._groupId-Bng5VZmq.mjs";
import { n as AvatarFallback, t as Avatar } from "./avatar-CiQwCJNR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/groups._groupId-pDU1s5Al.js
var import_jsx_runtime = require_jsx_runtime();
function GroupDetail() {
	const { groupId } = Route.useParams();
	const qc = useQueryClient();
	const navigate = useNavigate();
	const fetchGroup = useServerFn(getGroup);
	const leaveFn = useServerFn(leaveGroup);
	const { data, isLoading } = useQuery({
		queryKey: ["group", groupId],
		queryFn: () => fetchGroup({ data: { id: groupId } })
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
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
			}) })] })
		]
	});
}
//#endregion
export { GroupDetail as component };
