import { o as __toESM } from "../_runtime.mjs";
import { s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { K as LoaderCircle, N as Moon, P as Monitor, U as LogOut, b as Share2, et as Globe, p as Sun } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as supabase } from "./client-QZpAg5-N.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { n as z } from "../_libs/next-themes.mjs";
import { r as upsertPublicProfile, t as getMyPublicProfile } from "./publicProfile.functions-BAPo4zox.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-C74gIZM8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const { theme, setTheme } = z();
	const navigate = useNavigate();
	const qc = useQueryClient();
	const fetchPP = useServerFn(getMyPublicProfile);
	const savePP = useServerFn(upsertPublicProfile);
	const { data: pp } = useQuery({
		queryKey: ["myPublicProfile"],
		queryFn: () => fetchPP()
	});
	const [form, setForm] = (0, import_react.useState)({
		username: "",
		headline: "",
		bio: "",
		is_public: false,
		show_email: false,
		show_resume_score: true,
		show_problems: true,
		show_interview: true,
		show_badges: true
	});
	(0, import_react.useEffect)(() => {
		if (pp) setForm({
			username: pp.username ?? "",
			headline: pp.headline ?? "",
			bio: pp.bio ?? "",
			is_public: pp.is_public,
			show_email: pp.show_email,
			show_resume_score: pp.show_resume_score,
			show_problems: pp.show_problems,
			show_interview: pp.show_interview,
			show_badges: pp.show_badges
		});
	}, [pp]);
	const saveMut = useMutation({
		mutationFn: () => savePP({ data: form }),
		onSuccess: () => {
			toast.success("Public profile updated");
			qc.invalidateQueries({ queryKey: ["myPublicProfile"] });
		},
		onError: (e) => toast.error(e.message)
	});
	async function handleSignOut() {
		await qc.cancelQueries();
		qc.clear();
		await supabase.auth.signOut();
		toast.success("Signed out");
		navigate({
			to: "/auth",
			replace: true
		});
	}
	const publicUrl = form.username ? `${typeof window !== "undefined" ? window.location.origin : ""}/u/${form.username}` : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight",
				children: "Settings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Account, theme, and public portfolio."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "text-base flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-4 w-4" }), " Public portfolio"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Make your placement profile shareable at /u/your-username." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Username" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.username,
								onChange: (e) => setForm({
									...form,
									username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "")
								}),
								placeholder: "your-handle"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "3-32 lowercase letters, numbers, _ or -"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Headline" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.headline,
							onChange: (e) => setForm({
								...form,
								headline: e.target.value
							}),
							placeholder: "e.g. Final year CS · Open to SDE roles",
							maxLength: 120
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Bio" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: form.bio,
							onChange: (e) => setForm({
								...form,
								bio: e.target.value
							}),
							rows: 3,
							placeholder: "A short intro for recruiters…",
							maxLength: 2e3
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 rounded-lg border p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								label: "Make profile public",
								v: form.is_public,
								on: (v) => setForm({
									...form,
									is_public: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								label: "Show email",
								v: form.show_email,
								on: (v) => setForm({
									...form,
									show_email: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								label: "Show resume ATS score",
								v: form.show_resume_score,
								on: (v) => setForm({
									...form,
									show_resume_score: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								label: "Show problems solved",
								v: form.show_problems,
								on: (v) => setForm({
									...form,
									show_problems: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								label: "Show interview scores",
								v: form.show_interview,
								on: (v) => setForm({
									...form,
									show_interview: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
								label: "Show badges",
								v: form.show_badges,
								on: (v) => setForm({
									...form,
									show_badges: v
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => saveMut.mutate(),
							disabled: saveMut.isPending || form.username.length < 3,
							children: [saveMut.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), " Save profile"]
						}), pp?.is_public && publicUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => {
								navigator.clipboard.writeText(publicUrl);
								toast.success("Link copied");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "mr-1.5 h-4 w-4" }), " Copy share link"]
						})]
					}),
					publicUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: ["Public URL: ", publicUrl]
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Theme"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Choose how Placement AI looks." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "flex gap-2",
				children: [
					{
						v: "light",
						icon: Sun,
						l: "Light"
					},
					{
						v: "dark",
						icon: Moon,
						l: "Dark"
					},
					{
						v: "system",
						icon: Monitor,
						l: "System"
					}
				].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setTheme(t.v),
					className: `flex flex-1 flex-col items-center gap-2 rounded-lg border px-4 py-3 text-sm ${theme === t.v ? "border-primary bg-accent" : "hover:bg-accent"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(t.icon, { className: "h-4 w-4" }),
						" ",
						t.l
					]
				}, t.v))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base text-destructive",
				children: "Sign out"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "You'll need to sign in again." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "destructive",
				onClick: handleSignOut,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-2 h-4 w-4" }), " Sign out"]
			}) })] })
		]
	});
}
function Toggle({ label, v, on }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-sm font-normal",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
			checked: v,
			onCheckedChange: on
		})]
	});
}
//#endregion
export { SettingsPage as component };
