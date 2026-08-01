import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Plus,
  Send,
  Trash2,
  MessageSquare,
  Bot,
  User as UserIcon,
  Briefcase,
  Code2,
  HelpCircle,
  Sparkles,
  Search,
  Pencil,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  listThreads,
  createThread,
  getThread,
  deleteThread,
  renameThread,
  searchThreads,
} from "@/lib/chat.functions";

export const Route = createFileRoute("/_authenticated/chat/$threadId")({
  head: () => ({ meta: [{ title: "AI Chat — Placement AI" }] }),
  component: ChatPage,
});

const SCOPES = [
  { value: "general", label: "General", icon: Sparkles },
  { value: "mentor", label: "Career mentor", icon: Briefcase },
  { value: "coding", label: "Coding helper", icon: Code2 },
  { value: "guide", label: "Site guide", icon: HelpCircle },
] as const;

function ChatPage() {
  const { threadId } = Route.useParams();
  return <ChatInner key={threadId} threadId={threadId} />;
}

function ChatInner({ threadId }: { threadId: string }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchThreads = useServerFn(listThreads);
  const fetchThread = useServerFn(getThread);
  const createFn = useServerFn(createThread);
  const deleteFn = useServerFn(deleteThread);
  const renameFn = useServerFn(renameThread);
  const searchFn = useServerFn(searchThreads);

  const [search, setSearch] = useState("");
  const [scopeFilter, setScopeFilter] = useState<string>("all");
  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    const id = setTimeout(() => setDebounced(search.trim()), 250);
    return () => clearTimeout(id);
  }, [search]);

  const { data: threads } = useQuery({
    queryKey: ["chatThreads"],
    queryFn: () => fetchThreads(),
  });
  const { data: searchResults, isFetching: searching } = useQuery({
    queryKey: ["chatThreadSearch", debounced],
    queryFn: () => searchFn({ data: { q: debounced } }),
    enabled: debounced.length > 0,
  });
  const { data: threadData, isLoading } = useQuery({
    queryKey: ["chatThread", threadId],
    queryFn: () => fetchThread({ data: { threadId } }),
  });

  const visibleThreads = useMemo(() => {
    const base = debounced ? (searchResults ?? []) : (threads ?? []);
    return scopeFilter === "all" ? base : base.filter((t) => t.scope === scopeFilter);
  }, [debounced, searchResults, threads, scopeFilter]);

  const initialMessages: UIMessage[] = useMemo(() => {
    if (!threadData) return [];
    return threadData.messages.map((m) => ({
      id: m.id,
      role: m.role as "user" | "assistant",
      parts: [{ type: "text", text: m.content }],
    }));
  }, [threadData]);

  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setToken(data.session?.access_token ?? null));
  }, []);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        headers: async (): Promise<Record<string, string>> => {
          const { data } = await supabase.auth.getSession();
          const t = data.session?.access_token;
          return t ? { Authorization: `Bearer ${t}` } : {};
        },
        body: { threadId, scope: threadData?.thread.scope ?? "general" },
      }),
    [threadId, threadData?.thread.scope],
  );

  const MAX_RETRIES = 3;
  const [retryAttempt, setRetryAttempt] = useState(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCountRef = useRef(0);

  const isTransientError = (msg: string) => {
    const m = msg.toLowerCase();
    if (/unauthorized|forbidden|not found|invalid|bad request|missing/.test(m)) return false;
    return (
      /fetch|network|timeout|rate limit|429|5\d\d|temporarily|overload|stream|aborted/.test(m) ||
      true
    );
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
        const delay = Math.min(8000, 600 * Math.pow(2, next - 1));
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
    },
  });

  useEffect(() => {
    return () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, []);

  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isRetrying =
    retryAttempt > 0 && (status === "submitted" || status === "streaming" || status === "error");
  const busy = status === "submitted" || status === "streaming" || isRetrying;

  useEffect(() => {
    inputRef.current?.focus();
  }, [threadId, busy]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const newThread = useMutation({
    mutationFn: (scope: "general" | "mentor" | "coding" | "guide") => createFn({ data: { scope } }),
    onSuccess: (t) => {
      qc.invalidateQueries({ queryKey: ["chatThreads"] });
      navigate({ to: "/chat/$threadId", params: { threadId: t!.id } });
    },
  });

  const removeThread = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { threadId: id } }),
    onSuccess: async (_, id) => {
      const next = (threads ?? []).find((t) => t.id !== id);
      qc.invalidateQueries({ queryKey: ["chatThreads"] });
      if (id === threadId) {
        if (next) navigate({ to: "/chat/$threadId", params: { threadId: next.id } });
        else navigate({ to: "/chat" });
      }
    },
  });

  const rename = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      renameFn({ data: { threadId: id, title } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["chatThreads"] });
      qc.invalidateQueries({ queryKey: ["chatThread", threadId] });
      setEditingId(null);
    },
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

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

  return (
    <div className="grid h-[calc(100vh-7rem)] grid-cols-1 gap-4 md:grid-cols-[260px_1fr]">
      {/* Threads sidebar */}
      <Card className="flex flex-col overflow-hidden">
        <div className="space-y-2 border-b p-3">
          <Select onValueChange={(v) => newThread.mutate(v as "general")} value="">
            <SelectTrigger className="w-full">
              <Plus className="h-4 w-4" />
              <SelectValue placeholder="New chat" />
            </SelectTrigger>
            <SelectContent>
              {SCOPES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  <span className="flex items-center gap-2">
                    <s.icon className="h-4 w-4" /> {s.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations…"
              className="h-8 pl-7 pr-7 text-sm"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:bg-accent"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <Select value={scopeFilter} onValueChange={setScopeFilter}>
            <SelectTrigger className="h-8 w-full text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All scopes</SelectItem>
              {SCOPES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ScrollArea className="flex-1">
          <ul className="p-2">
            {visibleThreads.map((t) => {
              const active = t.id === threadId;
              const Icon = SCOPES.find((s) => s.value === t.scope)?.icon ?? MessageSquare;
              const snippet = (t as { snippet?: string }).snippet;
              const isEditing = editingId === t.id;
              return (
                <li key={t.id} className="group flex items-start gap-1">
                  {isEditing ? (
                    <form
                      className="flex flex-1 items-center gap-1 px-1 py-1"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const title = editValue.trim();
                        if (title) rename.mutate({ id: t.id, title });
                      }}
                    >
                      <Input
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => setEditingId(null)}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        className="h-7 text-sm"
                      />
                    </form>
                  ) : (
                    <>
                      <Link
                        to="/chat/$threadId"
                        params={{ threadId: t.id }}
                        className={`flex flex-1 flex-col gap-0.5 rounded-md px-2 py-2 text-sm transition-colors ${
                          active ? "bg-accent" : "hover:bg-accent/60"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          <span className="line-clamp-1 flex-1">{t.title}</span>
                        </span>
                        {snippet && (
                          <span className="line-clamp-2 pl-5 text-[11px] text-muted-foreground">
                            {snippet}
                          </span>
                        )}
                      </Link>
                      <div className="flex shrink-0 flex-col opacity-0 group-hover:opacity-100">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.preventDefault();
                            setEditingId(t.id);
                            setEditValue(t.title);
                          }}
                          aria-label="Rename thread"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.preventDefault();
                            if (confirm("Delete this conversation?")) removeThread.mutate(t.id);
                          }}
                          aria-label="Delete thread"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </>
                  )}
                </li>
              );
            })}
            {visibleThreads.length === 0 && (
              <li className="p-3 text-xs text-muted-foreground">
                {debounced
                  ? searching
                    ? "Searching…"
                    : `No matches for "${debounced}"`
                  : "No conversations yet"}
              </li>
            )}
          </ul>
        </ScrollArea>
      </Card>

      {/* Chat area */}
      <Card className="flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-primary text-primary-foreground">
            <ScopeIcon className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium leading-tight">
              {threadData?.thread.title ?? "Loading…"}
            </div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {SCOPES.find((s) => s.value === scope)?.label}
            </div>
          </div>
          <Badge variant="secondary" className="hidden sm:inline-flex">
            Gemini 3 Flash
          </Badge>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-2/3" />
              <Skeleton className="ml-auto h-12 w-1/2" />
            </div>
          ) : messages.length === 0 ? (
            <EmptyState scope={scope} onPick={(p) => sendMessage({ text: p })} />
          ) : (
            <ul className="space-y-4">
              {messages.map((m) => {
                const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
                const isUser = m.role === "user";
                return (
                  <li key={m.id} className={`flex gap-3 ${isUser ? "justify-end" : ""}`}>
                    {!isUser && (
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}
                    <div
                      className={
                        isUser
                          ? "max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2 text-sm text-primary-foreground"
                          : "max-w-[85%] text-sm"
                      }
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{text}</p>
                      ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded-md [&_code]:text-xs">
                          <ReactMarkdown>{text}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                    {isUser && (
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                        <UserIcon className="h-4 w-4" />
                      </div>
                    )}
                  </li>
                );
              })}
              {(status === "submitted" || isRetrying) && (
                <li className="flex gap-3">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Bot className="h-4 w-4 animate-pulse" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {isRetrying
                      ? `Reconnecting… retry ${retryAttempt}/${MAX_RETRIES}`
                      : "Thinking…"}
                  </div>
                </li>
              )}
            </ul>
          )}
          {error && !isRetrying && <p className="mt-3 text-xs text-destructive">{error.message}</p>}
        </div>

        <form
          className="border-t p-3"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div className="flex items-end gap-2">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder="Ask anything — career advice, code help, app questions…"
              rows={1}
              className="min-h-[42px] max-h-40 resize-none"
              disabled={busy}
            />
            <Button type="submit" size="icon" disabled={busy || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-1.5 px-1 text-[11px] text-muted-foreground">
            Press Enter to send · Shift+Enter for newline
          </p>
        </form>
      </Card>
    </div>
  );
}

function EmptyState({ scope, onPick }: { scope: string; onPick: (prompt: string) => void }) {
  const prompts: Record<string, string[]> = {
    mentor: [
      "How do I prepare for SDE-1 interviews in 8 weeks?",
      "Review my resume bullet points for impact.",
      "How should I negotiate a first-job offer?",
    ],
    coding: [
      "Explain sliding window with an example.",
      "Give me the optimal solution for Trapping Rain Water.",
      "What's the difference between BFS and DFS?",
    ],
    guide: [
      "Where do I see my interview history?",
      "How do study groups work?",
      "How is my Placement Readiness score computed?",
    ],
    general: [
      "Suggest 3 weekend projects to put on my resume.",
      "Explain Big-O like I'm 12.",
      "Give me a 1-week LeetCode plan.",
    ],
  };
  const list = prompts[scope] ?? prompts.general;
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-elegant">
        <Bot className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">How can I help?</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        Ask anything — I'll keep this conversation so you can pick it back up later.
      </p>
      <div className="mt-5 grid w-full max-w-xl gap-2">
        {list.map((p) => (
          <button
            key={p}
            onClick={() => onPick(p)}
            className="rounded-lg border bg-card px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
