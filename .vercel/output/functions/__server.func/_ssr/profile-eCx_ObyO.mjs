import { o as __toESM } from "../_runtime.mjs";
import { s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-0togyjVc.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CWLNe4_N.mjs";
import { ft as numberType, ht as stringType, lt as arrayType, pt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { K as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-eCx_ObyO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var profileSchema = objectType({
	full_name: stringType().trim().max(120).nullable().optional(),
	college: stringType().trim().max(160).nullable().optional(),
	degree: stringType().trim().max(80).nullable().optional(),
	branch: stringType().trim().max(80).nullable().optional(),
	graduation_year: numberType().int().min(1990).max(2100).nullable().optional(),
	skills: arrayType(stringType().trim().max(40)).max(60).optional(),
	github: stringType().trim().max(200).nullable().optional(),
	linkedin: stringType().trim().max(200).nullable().optional(),
	portfolio: stringType().trim().max(200).nullable().optional(),
	target_roles: arrayType(stringType().trim().max(60)).max(20).optional(),
	preferred_companies: arrayType(stringType().trim().max(60)).max(30).optional()
});
var getProfile = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("9df9652da79c7ccc337ce62c64dcd11f1800a8eb6e0bd13747650358f67fe4e8"));
var upsertProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => profileSchema.parse(input)).handler(createSsrRpc("c94a55e77ed040aeee875c7214bd13b250b802e5453e9d4b3f9f713ae4debcee"));
var TARGET_ROLES = [
	"Frontend Developer",
	"Backend Developer",
	"Full Stack Developer",
	"Data Analyst",
	"SDE",
	"ML Engineer"
];
function ProfilePage() {
	const navigate = useNavigate();
	const fetchProfile = useServerFn(getProfile);
	const saveProfile = useServerFn(upsertProfile);
	const { data, isLoading } = useQuery({
		queryKey: ["profile"],
		queryFn: () => fetchProfile()
	});
	const [form, setForm] = (0, import_react.useState)({
		full_name: "",
		college: "",
		degree: "",
		branch: "",
		graduation_year: "",
		skills: "",
		github: "",
		linkedin: "",
		portfolio: "",
		target_roles: [],
		preferred_companies: ""
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!data) return;
		setForm({
			full_name: data.full_name ?? "",
			college: data.college ?? "",
			degree: data.degree ?? "",
			branch: data.branch ?? "",
			graduation_year: data.graduation_year?.toString() ?? "",
			skills: (data.skills ?? []).join(", "),
			github: data.github ?? "",
			linkedin: data.linkedin ?? "",
			portfolio: data.portfolio ?? "",
			target_roles: data.target_roles ?? [],
			preferred_companies: (data.preferred_companies ?? []).join(", ")
		});
	}, [data]);
	async function handleSubmit(e) {
		e.preventDefault();
		setSaving(true);
		try {
			await saveProfile({ data: {
				full_name: form.full_name || null,
				college: form.college || null,
				degree: form.degree || null,
				branch: form.branch || null,
				graduation_year: form.graduation_year ? parseInt(form.graduation_year, 10) : null,
				skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
				github: form.github || null,
				linkedin: form.linkedin || null,
				portfolio: form.portfolio || null,
				target_roles: form.target_roles,
				preferred_companies: form.preferred_companies.split(",").map((s) => s.trim()).filter(Boolean)
			} });
			toast.success("Profile saved");
			navigate({ to: "/dashboard" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to save");
		} finally {
			setSaving(false);
		}
	}
	function toggleRole(r) {
		setForm((f) => ({
			...f,
			target_roles: f.target_roles.includes(r) ? f.target_roles.filter((x) => x !== r) : [...f.target_roles, r]
		}));
	}
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-64 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-semibold tracking-tight",
			children: "Your profile"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Used to personalize resume analysis, job match, and AI feedback."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Personal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Basic details from your resume." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "grid gap-4 md:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							label: "Full name",
							v: form.full_name,
							on: (v) => setForm({
								...form,
								full_name: v
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							label: "College",
							v: form.college,
							on: (v) => setForm({
								...form,
								college: v
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							label: "Degree",
							v: form.degree,
							on: (v) => setForm({
								...form,
								degree: v
							}),
							placeholder: "B.Tech, M.Sc..."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							label: "Branch",
							v: form.branch,
							on: (v) => setForm({
								...form,
								branch: v
							}),
							placeholder: "CSE, ECE..."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							label: "Graduation year",
							v: form.graduation_year,
							on: (v) => setForm({
								...form,
								graduation_year: v
							}),
							type: "number"
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Skills & links"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "grid gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
						label: "Skills (comma separated)",
						v: form.skills,
						on: (v) => setForm({
							...form,
							skills: v
						}),
						placeholder: "React, Node.js, Python, SQL"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
								label: "GitHub URL",
								v: form.github,
								on: (v) => setForm({
									...form,
									github: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
								label: "LinkedIn URL",
								v: form.linkedin,
								on: (v) => setForm({
									...form,
									linkedin: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
								label: "Portfolio URL",
								v: form.portfolio,
								on: (v) => setForm({
									...form,
									portfolio: v
								})
							})
						]
					})]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Career targets"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Pick the roles you're preparing for." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: TARGET_ROLES.map((r) => {
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => toggleRole(r),
									className: `rounded-full border px-3 py-1.5 text-xs transition-colors ${form.target_roles.includes(r) ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"}`,
									children: r
								}, r);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							label: "Preferred companies (comma separated)",
							v: form.preferred_companies,
							on: (v) => setForm({
								...form,
								preferred_companies: v
							}),
							placeholder: "Google, Amazon, Razorpay"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5",
							children: form.preferred_companies.split(",").map((c) => c.trim()).filter(Boolean).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								children: c
							}, c))
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						size: "lg",
						disabled: saving,
						children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), " Save profile"]
					})
				})
			]
		})]
	});
}
function F({ label, v, on, type = "text", placeholder }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			type,
			value: v,
			onChange: (e) => on(e.target.value),
			placeholder
		})]
	});
}
//#endregion
export { ProfilePage as component };
