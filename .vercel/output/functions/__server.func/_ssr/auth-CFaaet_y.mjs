import { o as __toESM } from "../_runtime.mjs";
import { s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as useNavigate, g as Link, v as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { $ as GraduationCap, Et as Briefcase, K as LoaderCircle, dt as Copy, g as Sparkles, ot as Eye, r as WandSparkles, st as EyeOff } from "../_libs/lucide-react.mjs";
import { o as bootstrapMyRole } from "./admin.functions-DLfwtrvb.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as supabase } from "./client-QZpAg5-N.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-CFaaet_y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	const navigate = useNavigate();
	const search = useSearch({ from: "/auth" });
	const [tab, setTab] = (0, import_react.useState)(search.mode === "signup" ? "signup" : "signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [signupRole, setSignupRole] = (0, import_react.useState)("student");
	const [loading, setLoading] = (0, import_react.useState)(false);
	async function bootstrap() {
		try {
			const granted = await bootstrapMyRole();
			if (granted === "admin") toast.success("Admin access granted");
			else if (granted === "recruiter") toast.success("Recruiter access granted");
			return granted ?? "none";
		} catch {
			return "none";
		}
	}
	function landingFor(role) {
		if (role === "admin") return "/admin";
		if (role === "recruiter") return "/recruiter";
		return "/dashboard";
	}
	async function handleSignIn(e) {
		e.preventDefault();
		setLoading(true);
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		setLoading(false);
		if (error) return toast.error(error.message);
		toast.success("Welcome back!");
		const role = await bootstrap();
		navigate({ to: search.redirect ?? landingFor(role) });
	}
	async function handleSignUp(e) {
		e.preventDefault();
		if (password.length < 8) return toast.error("Password must be at least 8 characters");
		if (password !== confirmPassword) return toast.error("Passwords don't match");
		setLoading(true);
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${window.location.origin}/dashboard`,
				data: {
					full_name: fullName,
					signup_role: signupRole
				}
			}
		});
		setLoading(false);
		if (error) return toast.error(error.message);
		if (!data.session) {
			toast.success("Account created — check your email to verify.");
			navigate({ to: "/verify-email" });
			return;
		}
		toast.success("Account created — you're in!");
		navigate({ to: landingFor(await bootstrap()) });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-gradient-subtle px-4 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid w-full max-w-5xl gap-8 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden flex-col justify-between rounded-3xl bg-gradient-hero p-10 text-white shadow-elegant lg:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "inline-flex items-center gap-2 text-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold tracking-tight",
							children: "Placement AI"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-3xl font-semibold leading-tight",
							children: "Your AI-powered companion for landing the right placement."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-white/80",
							children: "Resume analysis, mock interviews, a curated LeetCode roadmap, and personalized analytics — all in one place."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-4 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Curated problems",
								value: "45+"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "AI models",
								value: "Gemini"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Free tier",
								value: "∞"
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-none shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-2xl",
					children: "Welcome"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Sign in or create your account to continue." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					value: tab,
					onValueChange: (v) => setTab(v),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
							className: "grid w-full grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "signin",
								children: "Sign in"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "signup",
								children: "Create account"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "signin",
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleSignIn,
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										id: "email",
										label: "Email",
										type: "email",
										value: email,
										onChange: setEmail,
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										id: "password",
										label: "Password",
										type: "password",
										value: password,
										onChange: setPassword,
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/forgot-password",
											className: "text-xs text-primary hover:underline",
											children: "Forgot password?"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "submit",
										className: "w-full",
										disabled: loading,
										children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), " Sign in"]
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "signup",
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleSignUp,
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "I am a" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleOption, {
												active: signupRole === "student",
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-4 w-4" }),
												label: "Student",
												desc: "Prep for placements",
												onClick: () => setSignupRole("student")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleOption, {
												active: signupRole === "recruiter",
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-4 w-4" }),
												label: "Recruiter",
												desc: "Find candidates",
												onClick: () => setSignupRole("recruiter")
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										id: "name",
										label: "Full name",
										value: fullName,
										onChange: setFullName,
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										id: "email",
										label: "Email",
										type: "email",
										value: email,
										onChange: setEmail,
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordField, {
										value: password,
										onChange: setPassword,
										onGenerate: (pwd) => {
											setPassword(pwd);
											setConfirmPassword(pwd);
										},
										label: "Password (min 8)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmPasswordField, {
										value: confirmPassword,
										onChange: setConfirmPassword,
										password
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "submit",
										className: "w-full",
										disabled: loading,
										children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), " Create account"]
									})
								]
							})
						})
					]
				}) })]
			})]
		})
	});
}
function RoleOption({ active, icon, label, desc, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: `rounded-lg border p-3 text-left transition ${active ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-input hover:bg-muted/50"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-sm font-medium",
			children: [icon, label]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-0.5 text-xs text-muted-foreground",
			children: desc
		})]
	});
}
function Field({ id, label, type = "text", value, onChange, required }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			htmlFor: id,
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			id,
			type,
			value,
			onChange: (e) => onChange(e.target.value),
			required
		})]
	});
}
function generateStrongPassword(length = 16) {
	const lower = "abcdefghijkmnpqrstuvwxyz";
	const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
	const digits = "23456789";
	const symbols = "!@#$%^&*-_=+?";
	const all = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%^&*-_=+?";
	const pick = (set) => {
		const buf = new Uint32Array(1);
		crypto.getRandomValues(buf);
		return set[buf[0] % set.length];
	};
	const required = [
		pick(lower),
		pick(upper),
		pick(digits),
		pick(symbols)
	];
	const rest = Array.from({ length: length - required.length }, () => pick(all));
	const chars = [...required, ...rest];
	for (let i = chars.length - 1; i > 0; i--) {
		const buf = new Uint32Array(1);
		crypto.getRandomValues(buf);
		const j = buf[0] % (i + 1);
		[chars[i], chars[j]] = [chars[j], chars[i]];
	}
	return chars.join("");
}
function PasswordField({ value, onChange, onGenerate, label }) {
	const [show, setShow] = (0, import_react.useState)(false);
	function handleGenerate() {
		const pwd = generateStrongPassword(16);
		if (onGenerate) onGenerate(pwd);
		else onChange(pwd);
		setShow(true);
		navigator.clipboard?.writeText(pwd).then(() => toast.success("Strong password generated & copied"), () => toast.success("Strong password generated"));
	}
	async function handleCopy() {
		if (!value) return;
		try {
			await navigator.clipboard.writeText(value);
			toast.success("Password copied");
		} catch {
			toast.error("Couldn't copy");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "password",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: handleGenerate,
				className: "inline-flex items-center gap-1 text-xs text-primary hover:underline",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "h-3 w-3" }), " Generate strong password"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "password",
				type: show ? "text" : "password",
				value,
				onChange: (e) => onChange(e.target.value),
				required: true,
				className: "pr-20",
				autoComplete: "new-password"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-y-0 right-1 flex items-center gap-0.5",
				children: [value && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					size: "icon",
					className: "h-7 w-7",
					onClick: handleCopy,
					"aria-label": "Copy password",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					size: "icon",
					className: "h-7 w-7",
					onClick: () => setShow((s) => !s),
					"aria-label": show ? "Hide password" : "Show password",
					children: show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" })
				})]
			})]
		})]
	});
}
function ConfirmPasswordField({ value, onChange, password }) {
	const [show, setShow] = (0, import_react.useState)(false);
	const mismatch = value.length > 0 && value !== password;
	const match = value.length > 0 && value === password;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "confirm-password",
				children: "Confirm password"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "confirm-password",
					type: show ? "text" : "password",
					value,
					onChange: (e) => onChange(e.target.value),
					required: true,
					className: "pr-10",
					autoComplete: "new-password",
					"aria-invalid": mismatch || void 0
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					size: "icon",
					className: "absolute inset-y-0 right-1 my-auto h-7 w-7",
					onClick: () => setShow((s) => !s),
					"aria-label": show ? "Hide password" : "Show password",
					children: show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" })
				})]
			}),
			mismatch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-destructive",
				children: "Passwords don't match"
			}),
			match && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-emerald-600 dark:text-emerald-400",
				children: "Passwords match"
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-2xl font-semibold",
		children: value
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-xs text-white/70",
		children: label
	})] });
}
//#endregion
export { AuthPage as component };
