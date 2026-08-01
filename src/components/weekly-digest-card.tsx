import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, RefreshCcw, Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { getWeeklyDigest } from "@/lib/digest.functions";

export function WeeklyDigestCard() {
  const qc = useQueryClient();
  const fetchFn = useServerFn(getWeeklyDigest);
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["weeklyDigest"],
    queryFn: () => fetchFn(),
    staleTime: 60 * 60 * 1000,
  });
  const refresh = useMutation({
    mutationFn: () => fetchFn(),
    onSuccess: (d) => qc.setQueryData(["weeklyDigest"], d),
  });

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4 text-primary" /> Weekly Progress Digest
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => refresh.mutate()}
            disabled={refresh.isPending || isFetching}
          >
            <RefreshCcw className="h-3.5 w-3.5" /> Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <Skeleton className="h-24" />
        ) : (
          <>
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge variant="secondary">{data.stats.solved} solved</Badge>
              <Badge variant="secondary">{data.stats.interviewsDone} interviews</Badge>
              <Badge variant="secondary">{data.stats.currentStreak}d streak</Badge>
              {data.stats.bestAts > 0 && (
                <Badge variant="secondary">ATS {data.stats.bestAts}</Badge>
              )}
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{data.summary}</ReactMarkdown>
            </div>
            <p className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground">
              <Sparkles className="h-3 w-3" /> AI-generated from your last 7 days
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
