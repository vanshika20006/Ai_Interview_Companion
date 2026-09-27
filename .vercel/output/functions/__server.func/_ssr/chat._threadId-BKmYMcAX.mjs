import { o as __toESM } from "../_runtime.mjs";
import { n as DefaultChatTransport, s as require_react, t as useChat } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Card } from "./card-CtX3ithx.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { A as Pencil, C as Search, Dt as Bot, Et as Briefcase, I as MessageSquare, O as Plus, S as Send, d as Trash2, ft as CodeXml, g as Sparkles, ht as CircleQuestionMark, n as X, o as User } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as supabase } from "./client-QZpAg5-N.mjs";
import { a as listThreads, i as getThread, n as createThread, o as renameThread, r as deleteThread, s as searchThreads, t as Route } from "./chat._threadId-BFKRAa2p.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { t as Markdown } from "../_libs/react-markdown+[...].mjs";
import { a as Viewport, i as ScrollAreaThumb, n as Root, r as ScrollAreaScrollbar, t as Corner } from "../_libs/radix-ui__react-scroll-area.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat._threadId-BKmYMcAX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ScrollArea = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root, {
	ref,
	className: cn("relative overflow-hidden", className),
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
			className: "h-full w-full rounded-[inherit]",
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollBar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Corner, {})
	]
}));
ScrollArea.displayName = Root.displayName;
var ScrollBar = import_react.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbar, {
	ref,
	orientation,
	className: cn("flex touch-none select-none transition-colors", orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]", orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
}));
ScrollBar.displayName = ScrollAreaScrollbar.displayName;
var SCOPES = [
	{
		value: "general",
		label: "General",
		icon: Sparkles
	},
	{
		value: "mentor",
		label: "Career mentor",
		icon: Briefcase
	},
	{
		value: "coding",
		label: "Coding helper",
		icon: CodeXml
	},
	{
		value: "guide",
		label: "Site guide",
		icon: CircleQuestionMark
	}
];
function ChatPage() {
	const { threadId } = Route.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatInner, { threadId }, threadId);
}
function ChatInner({ threadId }) {
	const navigate = useNavigate();
	const qc = useQueryClient();
	const fetchThreads = useServerFn(listThreads);
	const fetchThread = useServerFn(getThread);
	const createFn = useServerFn(createThread);
	const deleteFn = useServerFn(deleteThread);
	const renameFn = useServerFn(renameThread);
	const searchFn = useServerFn(searchThreads);
	const [search, setSearch] = (0, import_react.useState)("");
	const [scopeFilter, setScopeFilter] = (0, import_react.useState)("all");
	const [debounced, setDebounced] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const id = setTimeout(() => setDebounced(search.trim()), 250);
		return () => clearTimeout(id);
	}, [search]);
	const { data: threads } = useQuery({
		queryKey: ["chatThreads"],
		queryFn: () => fetchThreads()
	});
	const { data: searchResults, isFetching: searching } = useQuery({
		queryKey: ["chatThreadSearch", debounced],
		queryFn: () => searchFn({ data: { q: debounced } }),
		enabled: debounced.length > 0
	});
	const { data: threadData, isLoading } = useQuery({
		queryKey: ["chatThread", threadId],
		queryFn: () => fetchThread({ data: { threadId } })
	});
	const visibleThreads = (0, import_react.useMemo)(() => {
		const base = debounced ? searchResults ?? [] : threads ?? [];
		return scopeFilter === "all" ? base : base.filter((t) => t.scope === scopeFilter);
	}, [
		debounced,
		searchResults,
		threads,
		scopeFilter
	]);
	const initialMessages = (0, import_react.useMemo)(() => {
		if (!threadData) return [];
		return threadData.messages.map((m) => ({
			id: m.id,
			role: m.role,
			parts: [{
				type: "text",
				text: m.content
			}]
		}));
	}, [threadData]);
	const [token, setToken] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => setToken(data.session?.access_token ?? null));
	}, []);
	const transport = (0, import_react.useMemo)(() => new DefaultChatTransport({
		api: "/api/chat",
		headers: async () => {
			const { data } = await supabase.auth.getSession();
			const t = data.session?.access_token;
			return t ? { Authorization: `Bearer ${t}` } : {};
		},
		body: {
			threadId,
			scope: threadData?.thread.scope ?? "general"
		}
	}), [threadId, threadData?.thread.scope]);
	const MAX_RETRIES = 3;
	const [retryAttempt, setRetryAttempt] = (0, import_react.useState)(0);
	const retryTimerRef = (0, import_react.useRef)(null);
	const retryCountRef = (0, import_react.useRef)(0);
	const isTransientError = (msg) => {
		const m = msg.toLowerCase();
		if (/unauthorized|forbidden|not found|invalid|bad request|missing/.test(m)) return false;
		return /fetch|network|timeout|rate limit|429|5\d\d|temporarily|overload|stream|aborted/.test(m) || true;
	};
	const { messages, sendMessage, status, error, regenerate } = useChat({
		id: threadId,
		messages: initialMessages,
		transport,
		onError: (e) => {
			const msg = e.message || "Chat failed";
			if (retryCountRef.current < MAX_RETRIES && isTransientError(msg)) {
				const next = retryCountRef.current + 1;
				retryCountRef.current = next;
				setRetryAttempt(next);
				const delay = Math.min(8e3, 600 * Math.pow(2, next - 1));
				toast.message(`Connection hiccup — retrying (${next}/${MAX_RETRIES})…`);
				retryTimerRef.current = setTimeout(() => {
					regenerate().catch(() => {});
				}, delay);
			} else {
				setRetryAttempt(0);
				retryCountRef.current = 0;
				toast.error(msg);
			}
		},
		onFinish: () => {
			retryCountRef.current = 0;
			setRetryAttempt(0);
			if (retryTimerRef.current) {
				clearTimeout(retryTimerRef.current);
				retryTimerRef.current = null;
			}
			qc.invalidateQueries({ queryKey: ["chatThreads"] });
		}
	});
	(0, import_react.useEffect)(() => {
		return () => {
			if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
		};
	}, []);
	const [input, setInput] = (0, import_react.useState)("");
	const inputRef = (0, import_react.useRef)(null);
	const scrollRef = (0, import_react.useRef)(null);
	const isRetrying = retryAttempt > 0 && (status === "submitted" || status === "streaming" || status === "error");
	const busy = status === "submitted" || status === "streaming" || isRetrying;
	(0, import_react.useEffect)(() => {
		inputRef.current?.focus();
	}, [threadId, busy]);
	(0, import_react.useEffect)(() => {
		scrollRef.current?.scrollTo({
			top: scrollRef.current.scrollHeight,
			behavior: "smooth"
		});
	}, [messages]);
	const newThread = useMutation({
		mutationFn: (scope) => createFn({ data: { scope } }),
		onSuccess: (t) => {
			qc.invalidateQueries({ queryKey: ["chatThreads"] });
			navigate({
				to: "/chat/$threadId",
				params: { threadId: t.id }
			});
		}
	});
	const removeThread = useMutation({
		mutationFn: (id) => deleteFn({ data: { threadId: id } }),
		onSuccess: async (_, id) => {
			const next = (threads ?? []).find((t) => t.id !== id);
			qc.invalidateQueries({ queryKey: ["chatThreads"] });
			if (id === threadId) if (next) navigate({
				to: "/chat/$threadId",
				params: { threadId: next.id }
			});
			else navigate({ to: "/chat" });
		}
	});
	const rename = useMutation({
		mutationFn: ({ id, title }) => renameFn({ data: {
			threadId: id,
			title
		} }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["chatThreads"] });
			qc.invalidateQueries({ queryKey: ["chatThread", threadId] });
			setEditingId(null);
		}
	});
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [editValue, setEditValue] = (0, import_react.useState)("");
	const submit = () => {
		const text = input.trim();
		if (!text || busy || !token) return;
		setInput("");
		retryCountRef.current = 0;
		setRetryAttempt(0);
		sendMessage({ text });
	};
	const scope = threadData?.thread.scope ?? "general";
	const ScopeIcon = SCOPES.find((s) => s.value === scope)?.icon ?? Sparkles;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid h-[calc(100vh-7rem)] grid-cols-1 gap-4 md:grid-cols-[260px_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "flex flex-col overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 border-b p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						onValueChange: (v) => newThread.mutate(v),
						value: "",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger, {
							className: "w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "New chat" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: SCOPES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s.value,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "h-4 w-4" }),
									" ",
									s.label
								]
							})
						}, s.value)) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: search,
								onChange: (e) => setSearch(e.target.value),
								placeholder: "Search conversations…",
								className: "h-8 pl-7 pr-7 text-sm"
							}),
							search && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSearch(""),
								className: "absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:bg-accent",
								"aria-label": "Clear search",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: scopeFilter,
						onValueChange: setScopeFilter,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-8 w-full text-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All scopes"
						}), SCOPES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s.value,
							children: s.label
						}, s.value))] })]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
				className: "flex-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "p-2",
					children: [visibleThreads.map((t) => {
						const active = t.id === threadId;
						const Icon = SCOPES.find((s) => s.value === t.scope)?.icon ?? MessageSquare;
						const snippet = t.snippet;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "group flex items-start gap-1",
							children: editingId === t.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
								className: "flex flex-1 items-center gap-1 px-1 py-1",
								onSubmit: (e) => {
									e.preventDefault();
									const title = editValue.trim();
									if (title) rename.mutate({
										id: t.id,
										title
									});
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									autoFocus: true,
									value: editValue,
									onChange: (e) => setEditValue(e.target.value),
									onBlur: () => setEditingId(null),
									onKeyDown: (e) => {
										if (e.key === "Escape") setEditingId(null);
									},
									className: "h-7 text-sm"
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/chat/$threadId",
								params: { threadId: t.id },
								className: `flex flex-1 flex-col gap-0.5 rounded-md px-2 py-2 text-sm transition-colors ${active ? "bg-accent" : "hover:bg-accent/60"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "line-clamp-1 flex-1",
										children: t.title
									})]
								}), snippet && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "line-clamp-2 pl-5 text-[11px] text-muted-foreground",
									children: snippet
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 flex-col opacity-0 group-hover:opacity-100",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "h-6 w-6",
									onClick: (e) => {
										e.preventDefault();
										setEditingId(t.id);
										setEditValue(t.title);
									},
									"aria-label": "Rename thread",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3 w-3" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "h-6 w-6",
									onClick: (e) => {
										e.preventDefault();
										if (confirm("Delete this conversation?")) removeThread.mutate(t.id);
									},
									"aria-label": "Delete thread",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
								})]
							})] })
						}, t.id);
					}), visibleThreads.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "p-3 text-xs text-muted-foreground",
						children: debounced ? searching ? "Searching…" : `No matches for "${debounced}"` : "No conversations yet"
					})]
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "flex flex-col overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 border-b px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-8 w-8 items-center justify-center rounded-md bg-gradient-primary text-primary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScopeIcon, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium leading-tight",
								children: threadData?.thread.title ?? "Loading…"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] uppercase tracking-wide text-muted-foreground",
								children: SCOPES.find((s) => s.value === scope)?.label
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							className: "hidden sm:inline-flex",
							children: "Gemini 3 Flash"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: scrollRef,
					className: "flex-1 overflow-y-auto p-4",
					children: [isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 w-2/3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "ml-auto h-12 w-1/2" })]
					}) : messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						scope,
						onPick: (p) => sendMessage({ text: p })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "space-y-4",
						children: [messages.map((m) => {
							const text = m.parts.map((p) => p.type === "text" ? p.text : "").join("");
							const isUser = m.role === "user";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: `flex gap-3 ${isUser ? "justify-end" : ""}`,
								children: [
									!isUser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: isUser ? "max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2 text-sm text-primary-foreground" : "max-w-[85%] text-sm",
										children: isUser ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "whitespace-pre-wrap",
											children: text
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "prose prose-sm dark:prose-invert max-w-none [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded-md [&_code]:text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, { children: text })
										})
									}),
									isUser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" })
									})
								]
							}, m.id);
						}), (status === "submitted" || isRetrying) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-4 w-4 animate-pulse" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-muted-foreground",
								children: isRetrying ? `Reconnecting… retry ${retryAttempt}/${MAX_RETRIES}` : "Thinking…"
							})]
						})]
					}), error && !isRetrying && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-destructive",
						children: error.message
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "border-t p-3",
					onSubmit: (e) => {
						e.preventDefault();
						submit();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							ref: inputRef,
							value: input,
							onChange: (e) => setInput(e.target.value),
							onKeyDown: (e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									submit();
								}
							},
							placeholder: "Ask anything — career advice, code help, app questions…",
							rows: 1,
							className: "min-h-[42px] max-h-40 resize-none",
							disabled: busy
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "icon",
							disabled: busy || !input.trim(),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 px-1 text-[11px] text-muted-foreground",
						children: "Press Enter to send · Shift+Enter for newline"
					})]
				})
			]
		})]
	});
}
function EmptyState({ scope, onPick }) {
	const prompts = {
		mentor: [
			"How do I prepare for SDE-1 interviews in 8 weeks?",
			"Review my resume bullet points for impact.",
			"How should I negotiate a first-job offer?"
		],
		coding: [
			"Explain sliding window with an example.",
			"Give me the optimal solution for Trapping Rain Water.",
			"What's the difference between BFS and DFS?"
		],
		guide: [
			"Where do I see my interview history?",
			"How do study groups work?",
			"How is my Placement Readiness score computed?"
		],
		general: [
			"Suggest 3 weekend projects to put on my resume.",
			"Explain Big-O like I'm 12.",
			"Give me a 1-week LeetCode plan."
		]
	};
	const list = prompts[scope] ?? prompts.general;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col items-center justify-center text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-elegant",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-6 w-6" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-4 text-lg font-semibold",
				children: "How can I help?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-md text-sm text-muted-foreground",
				children: "Ask anything — I'll keep this conversation so you can pick it back up later."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid w-full max-w-xl gap-2",
				children: list.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => onPick(p),
					className: "rounded-lg border bg-card px-3 py-2 text-left text-sm transition-colors hover:bg-accent",
					children: p
				}, p))
			})
		]
	});
}
//#endregion
export { ChatPage as component };
