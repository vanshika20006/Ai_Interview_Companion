import { o as __toESM } from "../_runtime.mjs";
import { s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { H as MailCheck, K as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as supabase } from "./client-QZpAg5-N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verify-email-B9NSbehi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VerifyEmailPage() {
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)(null);
	const [checking, setChecking] = (0, import_react.useState)(true);
	const [resending, setResending] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let mounted = true;
		(async () => {
			const { data } = await supabase.auth.getUser();
			if (!mounted) return;
			if (!data.user) {
				navigate({ to: "/auth" });
				return;
			}
			if (data.user.email_confirmed_at || data.user.confirmed_at) {
				navigate({ to: "/dashboard" });
				return;
			}
			setEmail(data.user.email ?? null);
			setChecking(false);
		})();
		const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
			if (event === "USER_UPDATED" && (session?.user.email_confirmed_at || session?.user.confirmed_at)) {
				toast.success("Email verified!");
				navigate({ to: "/dashboard" });
			}
			if (event === "SIGNED_OUT") navigate({ to: "/auth" });
		});
		return () => {
			mounted = false;
			sub.subscription.unsubscribe();
		};
	}, [navigate]);
	async function handleResend() {
		if (!email) return;
		setResending(true);
		const { error } = await supabase.auth.resend({
			type: "signup",
			email,
			options: { emailRedirectTo: `${window.location.origin}/dashboard` }
		});
		setResending(false);
		if (error) return toast.error(error.message);
		toast.success("Verification email sent — check your inbox.");
	}
	async function handleRefresh() {
		const { data, error } = await supabase.auth.refreshSession();
		if (error) return toast.error(error.message);
		if (data.user?.email_confirmed_at || data.user?.confirmed_at) {
			toast.success("Email verified!");
			navigate({ to: "/dashboard" });
		} else toast.info("Not verified yet — please click the link in your email.");
	}
	async function handleSignOut() {
		await supabase.auth.signOut();
		navigate({ to: "/auth" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-gradient-subtle px-4 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "w-full max-w-md border-none shadow-card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MailCheck, { className: "h-6 w-6 text-primary" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-2xl",
						children: "Verify your email"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: checking ? "Loading…" : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						"We sent a confirmation link to",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-foreground",
							children: email
						}),
						". Click it to activate your account."
					] }) })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: handleRefresh,
						className: "w-full",
						disabled: checking,
						children: "I've verified — continue"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: handleResend,
						variant: "outline",
						className: "w-full",
						disabled: resending || checking,
						children: [resending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), " Resend email"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pt-2 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleSignOut,
							className: "hover:text-foreground underline-offset-4 hover:underline",
							children: "Use a different account"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "hover:text-foreground underline-offset-4 hover:underline",
							children: "Back to home"
						})]
					})
				]
			})]
		})
	});
}
//#endregion
export { VerifyEmailPage as component };
