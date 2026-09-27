import { o as __toESM } from "../_runtime.mjs";
import { s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { O as Plus, Pt as ArrowRight, W as LogIn, a as UsersRound, g as Sparkles } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as DialogTrigger, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { a as listMyGroups, r as joinGroupByCode, t as createGroup } from "./studyGroups.functions-B5-chx4I.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/groups-DdrzQQgL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GroupsPage() {
	const qc = useQueryClient();
	const fetchGroups = useServerFn(listMyGroups);
	const createFn = useServerFn(createGroup);
	const joinFn = useServerFn(joinGroupByCode);
	const { data, isLoading } = useQuery({
		queryKey: ["myGroups"],
		queryFn: () => fetchGroups()
	});
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const [joinOpen, setJoinOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [goal, setGoal] = (0, import_react.useState)("");
	const [code, setCode] = (0, import_react.useState)("");
	const create = useMutation({
		mutationFn: () => createFn({ data: {
			name,
			description,
			goal
		} }),
		onSuccess: () => {
			toast.success("Group created");
			setCreateOpen(false);
			setName("");
			setDescription("");
			setGoal("");
			qc.invalidateQueries({ queryKey: ["myGroups"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const join = useMutation({
		mutationFn: () => joinFn({ data: { invite_code: code } }),
		onSuccess: (g) => {
			toast.success(`Joined ${g.name}`);
			setJoinOpen(false);
			setCode("");
			qc.invalidateQueries({ queryKey: ["myGroups"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "flex items-center gap-2 text-2xl font-semibold tracking-tight",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersRound, { className: "h-6 w-6 text-primary" }), " Study Groups"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Prep with friends — shared goals, accountability, leaderboards."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
					open: joinOpen,
					onOpenChange: setJoinOpen,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "mr-1.5 h-4 w-4" }), " Join with code"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Join a study group" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Paste the 8-character invite code your friend shared." })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "e.g. a1b2c3d4",
							value: code,
							onChange: (e) => setCode(e.target.value.trim())
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => join.mutate(),
							disabled: join.isPending || code.length < 4,
							children: "Join"
						}) })
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
					open: createOpen,
					onOpenChange: setCreateOpen,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-4 w-4" }), " New group"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Create a study group" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "You'll get an invite code to share." })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "g-name",
										children: "Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "g-name",
										value: name,
										onChange: (e) => setName(e.target.value),
										placeholder: "DSA Daily Squad"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "g-goal",
										children: "Goal"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "g-goal",
										value: goal,
										onChange: (e) => setGoal(e.target.value),
										placeholder: "Solve 5 problems/day"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "g-desc",
										children: "Description"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										id: "g-desc",
										rows: 3,
										value: description,
										onChange: (e) => setDescription(e.target.value),
										placeholder: "What's this group about?"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => create.mutate(),
							disabled: create.isPending || name.trim().length < 2,
							children: "Create"
						}) })
					] })]
				})]
			})]
		}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28" })]
		}) : (data?.length ?? 0) === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "flex flex-col items-center gap-3 py-12 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-8 w-8 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-medium",
				children: "No groups yet"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm text-muted-foreground",
				children: "Create one for your friends or join with an invite code."
			})] })]
		}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 md:grid-cols-2",
			children: data.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "transition-shadow hover:shadow-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: g.name
					}), g.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
						className: "mt-1",
						children: g.description
					})] }), g.role === "owner" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						children: "Owner"
					})]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: g.goal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Goal: ", g.goal] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						variant: "ghost",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/groups/$groupId",
							params: { groupId: g.id },
							children: ["Open ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-3.5 w-3.5" })]
						})
					})]
				})]
			}, g.id))
		})]
	});
}
//#endregion
export { GroupsPage as component };
