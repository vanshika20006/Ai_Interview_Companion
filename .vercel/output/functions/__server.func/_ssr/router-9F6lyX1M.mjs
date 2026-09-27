import { o as __toESM } from "../_runtime.mjs";
import { o as streamText, r as convertToModelMessages, s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { M as redirect, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { dt as enumType, ht as stringType, pt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { a as amIAdmin } from "./admin.functions-DLfwtrvb.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as supabase } from "./client-QZpAg5-N.mjs";
import { a as listThreads, n as createThread, t as Route$31 } from "./chat._threadId-BFKRAa2p.mjs";
import { t as Route$32 } from "./code-review._id-BIe_Wqq3.mjs";
import { t as createAiProvider } from "./ai-provider.server-JuGv6z_M.mjs";
import { t as Route$33 } from "./community._postId-D-BGP-fd.mjs";
import { t as Route$34 } from "./groups._groupId-Bng5VZmq.mjs";
import { t as Route$35 } from "./interview._id-CC5LUU2G.mjs";
import { t as Route$36 } from "./leetcode-_ezOIM7z.mjs";
import { t as Route$37 } from "./prep-packs._slug-CIqssSSC.mjs";
import { t as amIRecruiter } from "./recruiter.functions-DmG6WnDi.mjs";
import { t as J } from "../_libs/next-themes.mjs";
import { t as Route$38 } from "./u._username-VVKFi-3b.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-9F6lyX1M.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DktJrMdJ.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function ThemeProvider$1({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(J, {
		attribute: "class",
		defaultTheme: "light",
		enableSystem: true,
		disableTransitionOnChange: true,
		children
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong. Try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$30 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{
				name: "theme-color",
				content: "#4f46e5"
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-title",
				content: "PlacementAI"
			},
			{ title: "AI Placement Companion — Your AI-Powered Placement Prep" },
			{
				name: "description",
				content: "Master campus placements with AI resume analysis, mock interviews, a curated LeetCode roadmap, and personalized progress analytics."
			},
			{
				property: "og:title",
				content: "AI Placement Companion"
			},
			{
				property: "og:description",
				content: "AI-powered placement prep: resume analysis, mock interviews, LeetCode roadmap, and analytics."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "192x192",
				href: "/icon-192.png"
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "512x512",
				href: "/icon-512.png"
			},
			{
				rel: "apple-touch-icon",
				href: "/icon-192.png"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$30.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((event) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
		});
		return () => sub.subscription.unsubscribe();
	}, [router, queryClient]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeProvider$1, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			richColors: true,
			position: "top-right"
		})]
	}) });
}
var $$splitComponentImporter$28 = () => import("./verify-email-B9NSbehi.mjs");
var Route$29 = createFileRoute("/verify-email")({
	ssr: false,
	head: () => ({ meta: [{ title: "Verify your email — AI Placement Companion" }, {
		name: "description",
		content: "Confirm your email address to access your account."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$28, "component")
});
var $$splitComponentImporter$27 = () => import("./reset-password-SrYB5Sxg.mjs");
var Route$28 = createFileRoute("/reset-password")({
	ssr: false,
	head: () => ({ meta: [{ title: "Set new password — AI Placement Companion" }] }),
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
var $$splitComponentImporter$26 = () => import("./forgot-password-C6UWO8s0.mjs");
var Route$27 = createFileRoute("/forgot-password")({
	ssr: false,
	head: () => ({ meta: [{ title: "Reset password — AI Placement Companion" }] }),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
var $$splitComponentImporter$25 = () => import("./auth-CFaaet_y.mjs");
var searchSchema = objectType({
	redirect: stringType().optional(),
	mode: enumType(["signin", "signup"]).optional()
});
var Route$26 = createFileRoute("/auth")({
	ssr: false,
	validateSearch: searchSchema,
	head: () => ({ meta: [{ title: "Sign in — AI Placement Companion" }, {
		name: "description",
		content: "Sign in or create your account to access AI-powered placement preparation."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./route-DCOJTh1T.mjs");
var Route$25 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		if (!data.user.email_confirmed_at && !data.user.confirmed_at) throw redirect({ to: "/verify-email" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("./routes-i164_ZX6.mjs");
var Route$24 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Placement AI — Your AI-Powered Placement Companion" },
		{
			name: "description",
			content: "Resume analysis, mock interviews, LeetCode roadmap, study planner, analytics, jobs, community and more — everything you need to land your dream placement."
		},
		{
			property: "og:title",
			content: "Placement AI — Land your dream placement"
		},
		{
			property: "og:description",
			content: "12 AI-powered tools to crack campus placements."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var SCOPE_SYSTEM = {
	mentor: "You are a friendly, supportive career mentor for engineering students preparing for placements. Give concrete, actionable advice on resumes, interviews, internships, salary negotiation, and career strategy. Use short paragraphs and bullets.",
	coding: "You are an expert competitive-programming tutor. Explain LeetCode/DSA problems step by step. When asked for a solution, give intuition, complexity, and clean code in the requested language. Use markdown code fences.",
	guide: "You are the in-product guide for 'Placement AI Companion'. Help users navigate features: Resume Analyzer, Resume Builder, AI Interview, LeetCode Roadmap, Jobs, Community, Study Groups, Bookmarks, Achievements, Leaderboard, Planner, Code Review, Prep Packs. Reply with direct links like /resume, /interview, /leetcode when relevant.",
	general: "You are a helpful, concise AI assistant for an engineering student. Be accurate and friendly. Use markdown when helpful."
};
var Route$23 = createFileRoute("/api/chat")({ server: { handlers: { POST: async ({ request }) => {
	try {
		const { messages, threadId, scope = "general" } = await request.json();
		if (!Array.isArray(messages) || !threadId) return new Response("messages and threadId required", { status: 400 });
		const token = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
		if (!token) return new Response("Unauthorized: missing token", { status: 401 });
		const url = (process.env.SUPABASE_URL ?? "").replace(/^['"]|['"]$/g, "");
		const anon = (process.env.SUPABASE_PUBLISHABLE_KEY ?? "").replace(/^['"]|['"]$/g, "");
		if (!url || !anon) return new Response("Server misconfigured: SUPABASE env missing", { status: 500 });
		const supabase = createClient(url, anon, {
			global: { headers: { Authorization: `Bearer ${token}` } },
			auth: {
				persistSession: false,
				autoRefreshToken: false
			}
		});
		const { data: claimsData, error: claimsErr } = await supabase.auth.getClaims(token);
		if (claimsErr || !claimsData?.claims?.sub) {
			console.error("[/api/chat] getClaims failed:", claimsErr?.message, "tokenLen:", token.length);
			return new Response(`Unauthorized: ${claimsErr?.message ?? "invalid token"}`, { status: 401 });
		}
		const userId = claimsData.claims.sub;
		const { data: thread } = await supabase.from("chat_threads").select("id,title,scope").eq("id", threadId).maybeSingle();
		if (!thread) return new Response("Thread not found", { status: 404 });
		const last = messages[messages.length - 1];
		const lastText = last?.parts?.map((p) => p.type === "text" ? p.text : "").join("").trim() ?? "";
		if (last?.role === "user" && lastText) {
			await supabase.from("chat_messages").insert({
				thread_id: threadId,
				user_id: userId,
				role: "user",
				content: lastText
			});
			if (thread.title === "New chat") await supabase.from("chat_threads").update({ title: lastText.slice(0, 60) }).eq("id", threadId);
			else await supabase.from("chat_threads").update({ updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", threadId);
		}
		const key = process.env.GEMINI_API_KEY || process.env.LOVABLE_API_KEY;
		if (!key) return new Response("Missing GEMINI_API_KEY", { status: 500 });
		return streamText({
			model: createAiProvider(key)("google/gemini-2.5-flash"),
			system: SCOPE_SYSTEM[thread.scope ?? scope] ?? SCOPE_SYSTEM.general,
			messages: await convertToModelMessages(messages.map((m) => {
				if (typeof m.content === "string") return {
					...m,
					content: m.content.replace(/\\/g, "\\\\")
				};
				if (Array.isArray(m.parts)) return {
					...m,
					parts: m.parts.map((p) => {
						if (p.type === "text") return {
							...p,
							text: p.text.replace(/\\/g, "\\\\")
						};
						return p;
					})
				};
				return m;
			}))
		}).toUIMessageStreamResponse({
			originalMessages: messages,
			onFinish: async ({ messages: finalMessages }) => {
				const assistant = finalMessages[finalMessages.length - 1];
				const text = assistant?.parts?.map((p) => p.type === "text" ? p.text : "").join("").trim() ?? "";
				if (assistant?.role === "assistant" && text) await supabase.from("chat_messages").insert({
					thread_id: threadId,
					user_id: userId,
					role: "assistant",
					content: text
				});
			}
		});
	} catch (e) {
		const msg = e instanceof Error ? e.message : "Chat failed";
		return new Response(msg, { status: 500 });
	}
} } } });
var $$splitComponentImporter$22 = () => import("./settings-C74gIZM8.mjs");
var Route$22 = createFileRoute("/_authenticated/settings")({
	head: () => ({ meta: [{ title: "Settings — Placement AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./resume-builder-DjOW-13Y.mjs");
var Route$21 = createFileRoute("/_authenticated/resume-builder")({
	head: () => ({ meta: [{ title: "Resume Builder — Placement AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./resume-DkeEiWzt.mjs");
var Route$20 = createFileRoute("/_authenticated/resume")({
	head: () => ({ meta: [{ title: "Resume Analyzer — Placement AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./recruiter-BagZgz-D.mjs");
var Route$19 = createFileRoute("/_authenticated/recruiter")({
	head: () => ({ meta: [{ title: "Recruiter — Placement AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./profile-eCx_ObyO.mjs");
var Route$18 = createFileRoute("/_authenticated/profile")({
	head: () => ({ meta: [{ title: "Profile — Placement AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./prep-packs-B9bqQOU_.mjs");
var Route$17 = createFileRoute("/_authenticated/prep-packs")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./planner-zj9hVHV1.mjs");
var Route$16 = createFileRoute("/_authenticated/planner")({
	head: () => ({ meta: [{ title: "Study Planner — Placement AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./notifications-B1LlRtR6.mjs");
var Route$15 = createFileRoute("/_authenticated/notifications")({
	head: () => ({ meta: [{ title: "Notifications — Placement AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./leaderboard-CCNA7g0f.mjs");
var Route$14 = createFileRoute("/_authenticated/leaderboard")({
	head: () => ({ meta: [{ title: "Leaderboard — Placement AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./jobs-DgLTVVaR.mjs");
var Route$13 = createFileRoute("/_authenticated/jobs")({
	head: () => ({ meta: [{ title: "Jobs — Placement AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./interview-Ds8l1fn4.mjs");
var Route$12 = createFileRoute("/_authenticated/interview")({
	head: () => ({ meta: [{ title: "AI Interview — Placement AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./groups-DdrzQQgL.mjs");
var Route$11 = createFileRoute("/_authenticated/groups")({
	head: () => ({ meta: [{ title: "Study Groups — Placement AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./dashboard-Cqi-Bm00.mjs");
var Route$10 = createFileRoute("/_authenticated/dashboard")({
	head: () => ({ meta: [{ title: "Dashboard — Placement AI" }] }),
	beforeLoad: async () => {
		try {
			if (await amIAdmin()) throw redirect({ to: "/admin" });
			if (await amIRecruiter()) throw redirect({ to: "/recruiter" });
		} catch (e) {
			if (e && typeof e === "object" && "to" in e) throw e;
		}
	},
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./community-Cw_A5QHs.mjs");
var Route$9 = createFileRoute("/_authenticated/community")({
	head: () => ({ meta: [{ title: "Community — Placement AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./code-review-XhCPhHay.mjs");
var Route$8 = createFileRoute("/_authenticated/code-review")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./chat-Bng-bBX-.mjs");
var Route$7 = createFileRoute("/_authenticated/chat")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./bookmarks-CEhMySR5.mjs");
var Route$6 = createFileRoute("/_authenticated/bookmarks")({
	head: () => ({ meta: [{ title: "Bookmarks — Placement AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./analytics-BJwE0_Q4.mjs");
var Route$5 = createFileRoute("/_authenticated/analytics")({
	head: () => ({ meta: [{ title: "Analytics — Placement AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./admin-9l8x-rNJ.mjs");
var Route$4 = createFileRoute("/_authenticated/admin")({
	head: () => ({ meta: [{ title: "Admin — Placement AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./achievements-ozzNdF0P.mjs");
var Route$3 = createFileRoute("/_authenticated/achievements")({
	head: () => ({ meta: [{ title: "Achievements — Placement AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./prep-packs.index-CfBVJgpF.mjs");
var Route$2 = createFileRoute("/_authenticated/prep-packs/")({
	head: () => ({ meta: [{ title: "Company Prep Packs — Placement AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./code-review.index-IE-XUBhT.mjs");
var Route$1 = createFileRoute("/_authenticated/code-review/")({
	head: () => ({ meta: [{ title: "Code Review — Placement AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./chat.index-sfaEiTUB.mjs");
var Route = createFileRoute("/_authenticated/chat/")({
	loader: async () => {
		const threads = await listThreads();
		if (threads.length > 0) throw redirect({
			to: "/chat/$threadId",
			params: { threadId: threads[0].id }
		});
		throw redirect({
			to: "/chat/$threadId",
			params: { threadId: (await createThread({ data: { scope: "general" } })).id }
		});
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var VerifyEmailRoute = Route$29.update({
	id: "/verify-email",
	path: "/verify-email",
	getParentRoute: () => Route$30
});
var ResetPasswordRoute = Route$28.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$30
});
var ForgotPasswordRoute = Route$27.update({
	id: "/forgot-password",
	path: "/forgot-password",
	getParentRoute: () => Route$30
});
var AuthRoute = Route$26.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$30
});
var AuthenticatedRouteRoute = Route$25.update({
	id: "/_authenticated",
	getParentRoute: () => Route$30
});
var IndexRoute = Route$24.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$30
});
var UUsernameRoute = Route$38.update({
	id: "/u/$username",
	path: "/u/$username",
	getParentRoute: () => Route$30
});
var ApiChatRoute = Route$23.update({
	id: "/api/chat",
	path: "/api/chat",
	getParentRoute: () => Route$30
});
var AuthenticatedSettingsRoute = Route$22.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedResumeBuilderRoute = Route$21.update({
	id: "/resume-builder",
	path: "/resume-builder",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedResumeRoute = Route$20.update({
	id: "/resume",
	path: "/resume",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedRecruiterRoute = Route$19.update({
	id: "/recruiter",
	path: "/recruiter",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedProfileRoute = Route$18.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPrepPacksRoute = Route$17.update({
	id: "/prep-packs",
	path: "/prep-packs",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPlannerRoute = Route$16.update({
	id: "/planner",
	path: "/planner",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedNotificationsRoute = Route$15.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedLeetcodeRoute = Route$36.update({
	id: "/leetcode",
	path: "/leetcode",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedLeaderboardRoute = Route$14.update({
	id: "/leaderboard",
	path: "/leaderboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedJobsRoute = Route$13.update({
	id: "/jobs",
	path: "/jobs",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedInterviewRoute = Route$12.update({
	id: "/interview",
	path: "/interview",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedGroupsRoute = Route$11.update({
	id: "/groups",
	path: "/groups",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDashboardRoute = Route$10.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedCommunityRoute = Route$9.update({
	id: "/community",
	path: "/community",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedCodeReviewRoute = Route$8.update({
	id: "/code-review",
	path: "/code-review",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedChatRoute = Route$7.update({
	id: "/chat",
	path: "/chat",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedBookmarksRoute = Route$6.update({
	id: "/bookmarks",
	path: "/bookmarks",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAnalyticsRoute = Route$5.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminRoute = Route$4.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAchievementsRoute = Route$3.update({
	id: "/achievements",
	path: "/achievements",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPrepPacksIndexRoute = Route$2.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedPrepPacksRoute
});
var AuthenticatedCodeReviewIndexRoute = Route$1.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedCodeReviewRoute
});
var AuthenticatedChatIndexRoute = Route.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedChatRoute
});
var AuthenticatedPrepPacksSlugRoute = Route$37.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => AuthenticatedPrepPacksRoute
});
var AuthenticatedInterviewIdRoute = Route$35.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AuthenticatedInterviewRoute
});
var AuthenticatedGroupsGroupIdRoute = Route$34.update({
	id: "/$groupId",
	path: "/$groupId",
	getParentRoute: () => AuthenticatedGroupsRoute
});
var AuthenticatedCommunityPostIdRoute = Route$33.update({
	id: "/$postId",
	path: "/$postId",
	getParentRoute: () => AuthenticatedCommunityRoute
});
var AuthenticatedCodeReviewIdRoute = Route$32.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AuthenticatedCodeReviewRoute
});
var AuthenticatedChatRouteChildren = {
	AuthenticatedChatThreadIdRoute: Route$31.update({
		id: "/$threadId",
		path: "/$threadId",
		getParentRoute: () => AuthenticatedChatRoute
	}),
	AuthenticatedChatIndexRoute
};
var AuthenticatedChatRouteWithChildren = AuthenticatedChatRoute._addFileChildren(AuthenticatedChatRouteChildren);
var AuthenticatedCodeReviewRouteChildren = {
	AuthenticatedCodeReviewIdRoute,
	AuthenticatedCodeReviewIndexRoute
};
var AuthenticatedCodeReviewRouteWithChildren = AuthenticatedCodeReviewRoute._addFileChildren(AuthenticatedCodeReviewRouteChildren);
var AuthenticatedCommunityRouteChildren = { AuthenticatedCommunityPostIdRoute };
var AuthenticatedCommunityRouteWithChildren = AuthenticatedCommunityRoute._addFileChildren(AuthenticatedCommunityRouteChildren);
var AuthenticatedGroupsRouteChildren = { AuthenticatedGroupsGroupIdRoute };
var AuthenticatedGroupsRouteWithChildren = AuthenticatedGroupsRoute._addFileChildren(AuthenticatedGroupsRouteChildren);
var AuthenticatedInterviewRouteChildren = { AuthenticatedInterviewIdRoute };
var AuthenticatedInterviewRouteWithChildren = AuthenticatedInterviewRoute._addFileChildren(AuthenticatedInterviewRouteChildren);
var AuthenticatedPrepPacksRouteChildren = {
	AuthenticatedPrepPacksSlugRoute,
	AuthenticatedPrepPacksIndexRoute
};
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAchievementsRoute,
	AuthenticatedAdminRoute,
	AuthenticatedAnalyticsRoute,
	AuthenticatedBookmarksRoute,
	AuthenticatedChatRoute: AuthenticatedChatRouteWithChildren,
	AuthenticatedCodeReviewRoute: AuthenticatedCodeReviewRouteWithChildren,
	AuthenticatedCommunityRoute: AuthenticatedCommunityRouteWithChildren,
	AuthenticatedDashboardRoute,
	AuthenticatedGroupsRoute: AuthenticatedGroupsRouteWithChildren,
	AuthenticatedInterviewRoute: AuthenticatedInterviewRouteWithChildren,
	AuthenticatedJobsRoute,
	AuthenticatedLeaderboardRoute,
	AuthenticatedLeetcodeRoute,
	AuthenticatedNotificationsRoute,
	AuthenticatedPlannerRoute,
	AuthenticatedPrepPacksRoute: AuthenticatedPrepPacksRoute._addFileChildren(AuthenticatedPrepPacksRouteChildren),
	AuthenticatedProfileRoute,
	AuthenticatedRecruiterRoute,
	AuthenticatedResumeRoute,
	AuthenticatedResumeBuilderRoute,
	AuthenticatedSettingsRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute,
	ForgotPasswordRoute,
	ResetPasswordRoute,
	VerifyEmailRoute,
	ApiChatRoute,
	UUsernameRoute
};
var routeTree = Route$30._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient({ defaultOptions: { queries: {
			staleTime: 6e4,
			gcTime: 5 * 6e4,
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
			retry: 1
		} } }) },
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		defaultPendingMs: 200
	});
};
//#endregion
export { getRouter };
