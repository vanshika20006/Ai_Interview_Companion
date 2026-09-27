import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { J as Linkedin, b as Share2, et as Globe, g as Sparkles, l as Trophy, t as lucide_react_exports, tt as Github } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Route } from "./u._username-VVKFi-3b.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/u._username-DkwydfzL.js
var import_jsx_runtime = require_jsx_runtime();
function PublicProfile() {
	const { pp, profile, stats, badges } = Route.useLoaderData();
	const handleShare = () => {
		const url = window.location.href;
		if (navigator.share) navigator.share({
			title: `${profile?.full_name ?? pp.username}'s portfolio`,
			url
		}).catch(() => {});
		else {
			navigator.clipboard.writeText(url);
			toast.success("Link copied");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-gradient-to-b from-background to-muted/20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-4xl items-center justify-between px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-semibold",
						children: "Placement AI"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					onClick: handleShare,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "mr-1.5 h-3.5 w-3.5" }), " Share"]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-4xl px-4 py-10 space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 bg-gradient-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "-mt-12 space-y-3 p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-background bg-primary text-primary-foreground text-2xl font-bold shadow-elegant",
								children: (profile?.full_name ?? pp.username)[0]?.toUpperCase()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl font-semibold",
								children: profile?.full_name ?? `@${pp.username}`
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: [
									"@",
									pp.username,
									pp.headline ? ` · ${pp.headline}` : ""
								]
							})] }),
							pp.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: pp.bio
							}),
							profile && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2 text-xs text-muted-foreground",
								children: [
									profile.college && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: profile.college }),
									profile.degree && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"· ",
										profile.degree,
										" ",
										profile.branch ?? ""
									] }),
									profile.graduation_year && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["· ", profile.graduation_year] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2 pt-2",
								children: [
									profile?.github && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "sm",
										variant: "outline",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: profile.github,
											target: "_blank",
											rel: "noopener noreferrer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Github, { className: "mr-1.5 h-3.5 w-3.5" }), " GitHub"]
										})
									}),
									profile?.linkedin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "sm",
										variant: "outline",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: profile.linkedin,
											target: "_blank",
											rel: "noopener noreferrer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linkedin, { className: "mr-1.5 h-3.5 w-3.5" }), " LinkedIn"]
										})
									}),
									profile?.portfolio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "sm",
										variant: "outline",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: profile.portfolio,
											target: "_blank",
											rel: "noopener noreferrer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "mr-1.5 h-3.5 w-3.5" }), " Portfolio"]
										})
									}),
									pp.show_email && profile?.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: `mailto:${profile.email}`,
											children: profile.email
										})
									})
								]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 md:grid-cols-3",
					children: [
						stats.best_ats !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Resume ATS",
							value: `${stats.best_ats}/100`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Problems solved",
							value: String(stats.problems_solved)
						}),
						stats.best_interview !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Best interview",
							value: `${stats.best_interview}/100`
						})
					]
				}),
				profile?.skills && profile.skills.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Skills"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "flex flex-wrap gap-1.5",
					children: profile.skills.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						children: s
					}, s))
				})] }),
				badges.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "text-base flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-4 w-4" }), " Achievements"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, { children: [badges.length, " badges earned"] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-3 md:grid-cols-4",
					children: badges.map((b) => {
						const a = b.achievements;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border bg-gradient-to-br from-primary/10 to-accent border-primary/30 p-3 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(lucide_react_exports[a.icon] ?? Trophy, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold",
								children: a.title
							})]
						}, b.achievement_code);
					})
				}) })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center text-xs text-muted-foreground pt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "hover:underline",
						children: "Powered by Placement AI Companion"
					})
				})
			]
		})]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs uppercase text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 text-2xl font-semibold",
			children: value
		})]
	}) });
}
//#endregion
export { PublicProfile as component };
