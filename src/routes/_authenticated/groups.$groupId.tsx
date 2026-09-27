import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ArrowLeft, Copy, LogOut, UsersRound, MessageSquare, Send, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getGroup, leaveGroup, listGroupMessages, sendGroupMessage } from "@/lib/studyGroups.functions";

export const Route = createFileRoute("/_authenticated/groups/$groupId")({
  head: () => ({ meta: [{ title: "Study Group — Placement AI" }] }),
  component: GroupDetail,
});

function GroupDetail() {
  const { groupId } = Route.useParams();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const fetchGroup = useServerFn(getGroup);
  const leaveFn = useServerFn(leaveGroup);
  const fetchMessages = useServerFn(listGroupMessages);
  const sendMsgFn = useServerFn(sendGroupMessage);

  const [message, setMessage] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => fetchGroup({ data: { id: groupId } }),
  });

  const { data: messages, isLoading: loadingMsgs } = useQuery({
    queryKey: ["groupMessages", groupId],
    queryFn: () => fetchMessages({ data: { group_id: groupId } }),
  });

  const postMsg = useMutation({
    mutationFn: () => sendMsgFn({ data: { group_id: groupId, content: message } }),
    onSuccess: () => {
      setMessage("");
      toast.success("Posted update to group");
      qc.invalidateQueries({ queryKey: ["groupMessages", groupId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const leave = useMutation({
    mutationFn: () => leaveFn({ data: { group_id: groupId } }),
    onSuccess: () => {
      toast.success("Left group");
      qc.invalidateQueries({ queryKey: ["myGroups"] });
      navigate({ to: "/groups" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!data) return <p>Not found</p>;

  const inviteUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/groups?code=${data.group.invite_code}`;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link to="/groups">
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersRound className="h-5 w-5 text-primary" /> {data.group.name}
          </CardTitle>
          {data.group.description && <CardDescription>{data.group.description}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-4">
          {data.group.goal && (
            <div className="rounded-md border bg-muted/40 p-3 text-sm">
              <span className="font-medium">Goal:</span> {data.group.goal}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {data.group.invite_code}
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(data.group.invite_code);
                toast.success("Invite code copied");
              }}
            >
              <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy code
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(inviteUrl);
                toast.success("Invite link copied");
              }}
            >
              Copy link
            </Button>
            <div className="ml-auto">
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive"
                onClick={() => leave.mutate()}
              >
                <LogOut className="mr-1.5 h-3.5 w-3.5" /> Leave group
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="h-4 w-4 text-primary" /> Group Discussions & Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 flex flex-col">
            <div className="space-y-3">
              <Textarea
                placeholder="Share a study update, solution link, or ask the group..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
              <Button
                size="sm"
                onClick={() => postMsg.mutate()}
                disabled={!message.trim() || postMsg.isPending}
              >
                <Send className="mr-1.5 h-3.5 w-3.5" /> Post to Group
              </Button>
            </div>

            <div className="space-y-3 pt-3 border-t">
              {loadingMsgs ? (
                <Skeleton className="h-20 w-full" />
              ) : !messages?.length ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  <Sparkles className="mx-auto h-6 w-6 text-muted-foreground mb-1" />
                  No group posts yet. Be the first to start a conversation!
                </div>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className="rounded-lg border p-3 space-y-1 bg-card">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">{m.author_name}</span>
                      <span className="text-muted-foreground text-[10px]">
                        {new Date(m.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{m.body}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Members ({data.members.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {data.members.map((m) => {
                const name = m.profile?.full_name ?? m.profile?.username ?? "Member";
                const initials = name
                  .split(" ")
                  .map((s) => s[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                return (
                  <li key={m.user_id} className="flex items-center gap-3 py-2.5">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{name}</div>
                      {m.profile?.username && (
                        <div className="text-xs text-muted-foreground">@{m.profile.username}</div>
                      )}
                    </div>
                    {m.role === "owner" && <Badge variant="outline">Owner</Badge>}
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

