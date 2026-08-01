import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Plus, UsersRound, ArrowRight, LogIn, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { listMyGroups, createGroup, joinGroupByCode } from "@/lib/studyGroups.functions";

export const Route = createFileRoute("/_authenticated/groups")({
  head: () => ({ meta: [{ title: "Study Groups — Placement AI" }] }),
  component: GroupsPage,
});

function GroupsPage() {
  const qc = useQueryClient();
  const fetchGroups = useServerFn(listMyGroups);
  const createFn = useServerFn(createGroup);
  const joinFn = useServerFn(joinGroupByCode);

  const { data, isLoading } = useQuery({ queryKey: ["myGroups"], queryFn: () => fetchGroups() });

  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [code, setCode] = useState("");

  const create = useMutation({
    mutationFn: () => createFn({ data: { name, description, goal } }),
    onSuccess: () => {
      toast.success("Group created");
      setCreateOpen(false);
      setName("");
      setDescription("");
      setGoal("");
      qc.invalidateQueries({ queryKey: ["myGroups"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const join = useMutation({
    mutationFn: () => joinFn({ data: { invite_code: code } }),
    onSuccess: (g) => {
      toast.success(`Joined ${g.name}`);
      setJoinOpen(false);
      setCode("");
      qc.invalidateQueries({ queryKey: ["myGroups"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <UsersRound className="h-6 w-6 text-primary" /> Study Groups
          </h1>
          <p className="text-sm text-muted-foreground">
            Prep with friends — shared goals, accountability, leaderboards.
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <LogIn className="mr-1.5 h-4 w-4" /> Join with code
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join a study group</DialogTitle>
                <DialogDescription>
                  Paste the 8-character invite code your friend shared.
                </DialogDescription>
              </DialogHeader>
              <Input
                placeholder="e.g. a1b2c3d4"
                value={code}
                onChange={(e) => setCode(e.target.value.trim())}
              />
              <DialogFooter>
                <Button onClick={() => join.mutate()} disabled={join.isPending || code.length < 4}>
                  Join
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-1.5 h-4 w-4" /> New group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a study group</DialogTitle>
                <DialogDescription>You'll get an invite code to share.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="g-name">Name</Label>
                  <Input
                    id="g-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="DSA Daily Squad"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="g-goal">Goal</Label>
                  <Input
                    id="g-goal"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="Solve 5 problems/day"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="g-desc">Description</Label>
                  <Textarea
                    id="g-desc"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What's this group about?"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => create.mutate()}
                  disabled={create.isPending || name.trim().length < 2}
                >
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      ) : (data?.length ?? 0) === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Sparkles className="h-8 w-8 text-muted-foreground" />
            <div>
              <div className="font-medium">No groups yet</div>
              <div className="text-sm text-muted-foreground">
                Create one for your friends or join with an invite code.
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {data!.map((g) => (
            <Card key={g.id} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{g.name}</CardTitle>
                    {g.description && (
                      <CardDescription className="mt-1">{g.description}</CardDescription>
                    )}
                  </div>
                  {g.role === "owner" && <Badge variant="outline">Owner</Badge>}
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {g.goal && <span>Goal: {g.goal}</span>}
                </div>
                <Button asChild size="sm" variant="ghost">
                  <Link to="/groups/$groupId" params={{ groupId: g.id }}>
                    Open <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
