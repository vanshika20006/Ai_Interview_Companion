import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, Mic, Send, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getInterview, submitAnswer, completeInterview } from "@/lib/interview.functions";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";

export const Route = createFileRoute("/_authenticated/interview/$id")({
  head: () => ({ meta: [{ title: "Interview Session — Placement AI" }] }),
  component: InterviewSession,
});

function InterviewSession() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const fetchInterview = useServerFn(getInterview);
  const submit = useServerFn(submitAnswer);
  const complete = useServerFn(completeInterview);

  const { data, isLoading } = useQuery({
    queryKey: ["interview", id],
    queryFn: () => fetchInterview({ data: { id } }),
  });

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const speech = useSpeechRecognition();

  // Sync live transcript into the active answer
  useEffect(() => {
    if (!recordingId) return;
    const live = (speech.transcript + " " + speech.interim).trim();
    setAnswers((p) => ({ ...p, [recordingId]: live }));
  }, [speech.transcript, speech.interim, recordingId]);

  useEffect(() => {
    if (!speech.isListening && recordingId) setRecordingId(null);
  }, [speech.isListening, recordingId]);

  useEffect(() => {
    if (speech.error) toast.error(speech.error);
  }, [speech.error]);

  const toggleMic = (answerId: string, currentText: string) => {
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
    mutationFn: (answerId: string) =>
      submit({ data: { answer_id: answerId, answer_text: answers[answerId] ?? "" } }),
    onSuccess: () => {
      toast.success("Feedback ready");
      qc.invalidateQueries({ queryKey: ["interview", id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const completeMutation = useMutation({
    mutationFn: () => complete({ data: { interview_id: id } }),
    onSuccess: () => {
      toast.success("Interview completed");
      qc.invalidateQueries({ queryKey: ["interview", id] });
      qc.invalidateQueries({ queryKey: ["interviews"] });
      qc.invalidateQueries({ queryKey: ["interviewAnalytics"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading)
    return (
      <div className="space-y-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  if (!data) return <p>Not found</p>;

  const answered = data.answers.filter((a) => (a.interview_feedback?.length ?? 0) > 0).length;
  const total = data.answers.length;
  const allDone = total > 0 && answered === total;
  const isCompleted = data.interview.status === "completed";
  const progressValue = total > 0 ? (answered / total) * 100 : 0;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link to="/interview">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
          </Link>
        </Button>
        {isCompleted && (
          <Badge className="bg-success/15 text-success border-success/30" variant="outline">
            Completed · Overall {data.interview.overall_score}/100
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {data.interview.role} · {data.interview.interview_type}
          </CardTitle>
          <CardDescription>
            {data.interview.difficulty} difficulty · {answered}/{total} answered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressValue} className="h-2" />
        </CardContent>
      </Card>

      {total === 0 && (
        <Card className="border-warning bg-warning/5">
          <CardHeader>
            <CardTitle className="text-warning text-lg">No questions in this session</CardTitle>
            <CardDescription>
              This interview session was created without questions (likely due to a missing API Key
              when starting). Please go back, delete this session, and start a new interview.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {isCompleted && (
        <div className="grid gap-3 md:grid-cols-5">
          {[
            ["Overall", data.interview.overall_score],
            ["Comm.", data.interview.communication_score],
            ["Tech.", data.interview.technical_score],
            ["Confidence", data.interview.confidence_score],
            ["Problem", data.interview.problem_solving_score],
          ].map(([l, v]) => (
            <Card key={l as string}>
              <CardContent className="p-4 text-center">
                <div className="text-xs uppercase text-muted-foreground">{l}</div>
                <div className="text-2xl font-semibold">{v ?? "-"}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {data.answers.map((a, i) => {
        const fb = a.interview_feedback?.[0];
        return (
          <Card key={a.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardDescription>
                    Question {i + 1} · {a.difficulty}
                  </CardDescription>
                  <CardTitle className="text-base font-medium leading-snug">{a.question}</CardTitle>
                </div>
                {fb && <Badge>{fb.overall_score}/100</Badge>}
              </div>
              {a.expected_topics?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {a.expected_topics.map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10px]">
                      {t}
                    </Badge>
                  ))}
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {fb ? (
                <div className="space-y-3">
                  <div className="rounded-md border bg-muted/40 p-3 text-sm whitespace-pre-wrap">
                    {a.answer_text}
                  </div>
                  <div className="grid gap-2 md:grid-cols-4 text-center text-xs">
                    <Score label="Comm." v={fb.communication_score} />
                    <Score label="Tech." v={fb.technical_score} />
                    <Score label="Confidence" v={fb.confidence_score} />
                    <Score label="Problem-solving" v={fb.problem_solving_score} />
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <BulletList title="Strengths" items={fb.strengths as string[]} tone="success" />
                    <BulletList
                      title="Weaknesses"
                      items={fb.weaknesses as string[]}
                      tone="warning"
                    />
                  </div>
                  {fb.better_answer && (
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Better answer
                      </div>
                      <div className="rounded-md border-l-2 border-primary bg-primary/5 p-3 text-sm">
                        {fb.better_answer}
                      </div>
                    </div>
                  )}
                  <BulletList
                    title="Suggestions"
                    items={fb.suggestions as string[]}
                    tone="primary"
                  />
                </div>
              ) : (
                <>
                  <Textarea
                    placeholder="Type your answer or click Voice to dictate…"
                    rows={6}
                    value={answers[a.id] ?? a.answer_text ?? ""}
                    onChange={(e) => setAnswers((p) => ({ ...p, [a.id]: e.target.value }))}
                    disabled={isCompleted || recordingId === a.id}
                  />
                  {recordingId === a.id && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="inline-block h-2 w-2 rounded-full bg-destructive animate-pulse" />
                      Listening… speak now.{" "}
                      {speech.interim && <span className="italic">"{speech.interim}"</span>}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => submitMutation.mutate(a.id)}
                      disabled={
                        submitMutation.isPending ||
                        !(answers[a.id] ?? "").trim() ||
                        isCompleted ||
                        recordingId === a.id
                      }
                    >
                      {submitMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Evaluating…
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" /> Submit
                        </>
                      )}
                    </Button>
                    <Button
                      variant={recordingId === a.id ? "destructive" : "outline"}
                      size="sm"
                      type="button"
                      onClick={() => toggleMic(a.id, answers[a.id] ?? a.answer_text ?? "")}
                      disabled={
                        isCompleted ||
                        !speech.supported ||
                        (recordingId !== null && recordingId !== a.id)
                      }
                      title={
                        speech.supported
                          ? "Toggle voice dictation"
                          : "Voice not supported in this browser"
                      }
                    >
                      <Mic className="mr-1.5 h-4 w-4" />
                      {recordingId === a.id ? "Stop" : "Voice"}
                    </Button>
                    {answers[a.id] && recordingId !== a.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={() => setAnswers((p) => ({ ...p, [a.id]: "" }))}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}

      {allDone && !isCompleted && (
        <Button
          onClick={() => completeMutation.mutate()}
          disabled={completeMutation.isPending}
          className="w-full"
          size="lg"
        >
          {completeMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finalizing…
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" /> Complete interview
            </>
          )}
        </Button>
      )}
    </div>
  );
}

function Score({ label, v }: { label: string; v: number }) {
  return (
    <div className="rounded-md border bg-card p-2">
      <div className="text-[10px] uppercase text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">{v}</div>
    </div>
  );
}

function BulletList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "success" | "warning" | "primary";
}) {
  const toneClass =
    tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-primary";
  if (!items?.length) return null;
  return (
    <div>
      <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${toneClass}`}>
        {title}
      </div>
      <ul className="space-y-1 text-sm">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-1.5">
            <span
              className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${toneClass.replace("text-", "bg-")}`}
            />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
