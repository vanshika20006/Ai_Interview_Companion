import { o as __toESM } from "../_runtime.mjs";
import { s as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { F as Mic, Ft as ArrowLeft, K as LoaderCircle, S as Send, g as Sparkles, gt as CircleCheck } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { t as Progress } from "./progress-DOIEKRJF.mjs";
import { r as getInterview, s as submitAnswer, t as completeInterview } from "./interview.functions-BHOOSDg0.mjs";
import { t as Route } from "./interview._id-CC5LUU2G.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/interview._id-BRywd1rm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useSpeechRecognition(lang = "en-US") {
	const [isListening, setIsListening] = (0, import_react.useState)(false);
	const [interim, setInterim] = (0, import_react.useState)("");
	const [finalTranscript, setFinalTranscript] = (0, import_react.useState)("");
	const [supported, setSupported] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const recRef = (0, import_react.useRef)(null);
	const baseRef = (0, import_react.useRef)("");
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
		setSupported(Boolean(Ctor));
	}, []);
	const start = (0, import_react.useCallback)((existingText = "") => {
		setError(null);
		const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
		if (!Ctor) {
			setError("Speech recognition is not supported in this browser. Try Chrome or Edge.");
			return;
		}
		const rec = new Ctor();
		rec.continuous = true;
		rec.interimResults = true;
		rec.lang = lang;
		baseRef.current = existingText ? existingText.trim() + " " : "";
		setFinalTranscript(baseRef.current);
		setInterim("");
		rec.onresult = (event) => {
			let interimChunk = "";
			let finalChunk = "";
			for (let i = event.resultIndex; i < event.results.length; i++) {
				const t = event.results[i][0].transcript;
				if (event.results[i].isFinal) finalChunk += t + " ";
				else interimChunk += t;
			}
			if (finalChunk) {
				baseRef.current += finalChunk;
				setFinalTranscript(baseRef.current);
			}
			setInterim(interimChunk);
		};
		rec.onerror = (e) => {
			setError(e?.error ? `Mic error: ${e.error}` : "Mic error");
			setIsListening(false);
		};
		rec.onend = () => {
			setIsListening(false);
			setInterim("");
		};
		try {
			rec.start();
			recRef.current = rec;
			setIsListening(true);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Could not start mic");
		}
	}, [lang]);
	const stop = (0, import_react.useCallback)(() => {
		recRef.current?.stop();
		recRef.current = null;
	}, []);
	(0, import_react.useEffect)(() => () => recRef.current?.stop(), []);
	return {
		isListening,
		interim,
		transcript: finalTranscript,
		supported,
		error,
		start,
		stop
	};
}
function InterviewSession() {
	const { id } = Route.useParams();
	const qc = useQueryClient();
	const fetchInterview = useServerFn(getInterview);
	const submit = useServerFn(submitAnswer);
	const complete = useServerFn(completeInterview);
	const { data, isLoading } = useQuery({
		queryKey: ["interview", id],
		queryFn: () => fetchInterview({ data: { id } })
	});
	const [answers, setAnswers] = (0, import_react.useState)({});
	const [recordingId, setRecordingId] = (0, import_react.useState)(null);
	const speech = useSpeechRecognition();
	(0, import_react.useEffect)(() => {
		if (!recordingId) return;
		const live = (speech.transcript + " " + speech.interim).trim();
		setAnswers((p) => ({
			...p,
			[recordingId]: live
		}));
	}, [
		speech.transcript,
		speech.interim,
		recordingId
	]);
	(0, import_react.useEffect)(() => {
		if (!speech.isListening && recordingId) setRecordingId(null);
	}, [speech.isListening, recordingId]);
	(0, import_react.useEffect)(() => {
		if (speech.error) toast.error(speech.error);
	}, [speech.error]);
	const toggleMic = (answerId, currentText) => {
		if (recordingId === answerId) {
			speech.stop();
			setRecordingId(null);
		} else {
			if (recordingId) speech.stop();
			setRecordingId(answerId);
			speech.start(currentText);
		}
	};
	const submitMutation = useMutation({
		mutationFn: (answerId) => submit({ data: {
			answer_id: answerId,
			answer_text: answers[answerId] ?? ""
		} }),
		onSuccess: () => {
			toast.success("Feedback ready");
			qc.invalidateQueries({ queryKey: ["interview", id] });
		},
		onError: (e) => toast.error(e.message)
	});
	const completeMutation = useMutation({
		mutationFn: () => complete({ data: { interview_id: id } }),
		onSuccess: () => {
			toast.success("Interview completed");
			qc.invalidateQueries({ queryKey: ["interview", id] });
			qc.invalidateQueries({ queryKey: ["interviews"] });
			qc.invalidateQueries({ queryKey: ["interviewAnalytics"] });
		},
		onError: (e) => toast.error(e.message)
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 w-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full" })]
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Not found" });
	const answered = data.answers.filter((a) => (a.interview_feedback?.length ?? 0) > 0).length;
	const total = data.answers.length;
	const allDone = total > 0 && answered === total;
	const isCompleted = data.interview.status === "completed";
	const progressValue = total > 0 ? answered / total * 100 : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "ghost",
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/interview",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-1.5 h-4 w-4" }), " Back"]
					})
				}), isCompleted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					className: "bg-success/15 text-success border-success/30",
					variant: "outline",
					children: [
						"Completed · Overall ",
						data.interview.overall_score,
						"/100"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5 text-primary" }),
					data.interview.role,
					" · ",
					data.interview.interview_type
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, { children: [
				data.interview.difficulty,
				" difficulty · ",
				answered,
				"/",
				total,
				" answered"
			] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
				value: progressValue,
				className: "h-2"
			}) })] }),
			total === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-warning bg-warning/5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-warning text-lg",
					children: "No questions in this session"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "This interview session was created without questions (likely due to a missing API Key when starting). Please go back, delete this session, and start a new interview." })] })
			}),
			isCompleted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-5",
				children: [
					["Overall", data.interview.overall_score],
					["Comm.", data.interview.communication_score],
					["Tech.", data.interview.technical_score],
					["Confidence", data.interview.confidence_score],
					["Problem", data.interview.problem_solving_score]
				].map(([l, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-4 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase text-muted-foreground",
						children: l
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-2xl font-semibold",
						children: v ?? "-"
					})]
				}) }, l))
			}),
			data.answers.map((a, i) => {
				const fb = a.interview_feedback?.[0];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, { children: [
						"Question ",
						i + 1,
						" · ",
						a.difficulty
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base font-medium leading-snug",
						children: a.question
					})] }), fb && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [fb.overall_score, "/100"] })]
				}), a.expected_topics?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5 pt-1",
					children: a.expected_topics.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						className: "text-[10px]",
						children: t
					}, t))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "space-y-3",
					children: fb ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-md border bg-muted/40 p-3 text-sm whitespace-pre-wrap",
								children: a.answer_text
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2 md:grid-cols-4 text-center text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, {
										label: "Comm.",
										v: fb.communication_score
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, {
										label: "Tech.",
										v: fb.technical_score
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, {
										label: "Confidence",
										v: fb.confidence_score
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, {
										label: "Problem-solving",
										v: fb.problem_solving_score
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 md:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulletList, {
									title: "Strengths",
									items: fb.strengths,
									tone: "success"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulletList, {
									title: "Weaknesses",
									items: fb.weaknesses,
									tone: "warning"
								})]
							}),
							fb.better_answer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1",
								children: "Better answer"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-md border-l-2 border-primary bg-primary/5 p-3 text-sm",
								children: fb.better_answer
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulletList, {
								title: "Suggestions",
								items: fb.suggestions,
								tone: "primary"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							placeholder: "Type your answer or click Voice to dictate…",
							rows: 6,
							value: answers[a.id] ?? a.answer_text ?? "",
							onChange: (e) => setAnswers((p) => ({
								...p,
								[a.id]: e.target.value
							})),
							disabled: isCompleted || recordingId === a.id
						}),
						recordingId === a.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-2 w-2 rounded-full bg-destructive animate-pulse" }),
								"Listening… speak now.",
								" ",
								speech.interim && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "italic",
									children: [
										"\"",
										speech.interim,
										"\""
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: () => submitMutation.mutate(a.id),
									disabled: submitMutation.isPending || !(answers[a.id] ?? "").trim() || isCompleted || recordingId === a.id,
									children: submitMutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), " Evaluating…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "mr-2 h-4 w-4" }), " Submit"] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: recordingId === a.id ? "destructive" : "outline",
									size: "sm",
									type: "button",
									onClick: () => toggleMic(a.id, answers[a.id] ?? a.answer_text ?? ""),
									disabled: isCompleted || !speech.supported || recordingId !== null && recordingId !== a.id,
									title: speech.supported ? "Toggle voice dictation" : "Voice not supported in this browser",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "mr-1.5 h-4 w-4" }), recordingId === a.id ? "Stop" : "Voice"]
								}),
								answers[a.id] && recordingId !== a.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									type: "button",
									onClick: () => setAnswers((p) => ({
										...p,
										[a.id]: ""
									})),
									children: "Clear"
								})
							]
						})
					] })
				})] }, a.id);
			}),
			allDone && !isCompleted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => completeMutation.mutate(),
				disabled: completeMutation.isPending,
				className: "w-full",
				size: "lg",
				children: completeMutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), " Finalizing…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-2 h-4 w-4" }), " Complete interview"] })
			})
		]
	});
}
function Score({ label, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border bg-card p-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] uppercase text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-lg font-semibold",
			children: v
		})]
	});
}
function BulletList({ title, items, tone }) {
	const toneClass = tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-primary";
	if (!items?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `text-xs font-semibold uppercase tracking-wider mb-1 ${toneClass}`,
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-1 text-sm",
		children: items.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex items-start gap-1.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `mt-1.5 h-1 w-1 shrink-0 rounded-full ${toneClass.replace("text-", "bg-")}` }), it]
		}, i))
	})] });
}
//#endregion
export { InterviewSession as component };
