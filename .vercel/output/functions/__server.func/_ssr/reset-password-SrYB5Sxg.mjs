import { o as __toESM } from "../_runtime.mjs";
import { s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { K as LoaderCircle, y as ShieldCheck } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as supabase } from "./client-QZpAg5-N.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reset-password-SrYB5Sxg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ResetPasswordPage() {
	const navigate = useNavigate();
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((event) => {
			if (event === "PASSWORD_RECOVERY") setReady(true);
		});
		supabase.auth.getSession().then(({ data }) => {
			if (data.session) setReady(true);
			else if (!window.location.hash.includes("type=recovery")) setError("This reset link is invalid or has expired. Request a new one.");
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	async function handleSubmit(e) {
		e.preventDefault();
		if (password.length < 8) return toast.error("Password must be at least 8 characters");
		if (password !== confirm) return toast.error("Passwords do not match");
		setLoading(true);
		const { error } = await supabase.auth.updateUser({ password });
		setLoading(false);
		if (error) return toast.error(error.message);
		toast.success("Password updated — you're signed in");
		navigate({
			to: "/dashboard",
			replace: true
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-gradient-subtle px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "w-full max-w-md shadow-card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Set a new password" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Pick a strong password — at least 8 characters." })
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive",
					children: error
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					className: "w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/forgot-password",
						children: "Request a new link"
					})
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "pw",
							children: "New password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "pw",
							type: "password",
							autoComplete: "new-password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							required: true,
							disabled: !ready
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "confirm",
							children: "Confirm password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "confirm",
							type: "password",
							autoComplete: "new-password",
							value: confirm,
							onChange: (e) => setConfirm(e.target.value),
							required: true,
							disabled: !ready
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						className: "w-full",
						disabled: loading || !ready,
						children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), ready ? "Update password" : "Waiting for reset link…"]
					})
				]
			}) })]
		})
	});
}
//#endregion
export { ResetPasswordPage as component };
