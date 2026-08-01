
CREATE OR REPLACE FUNCTION public.get_leaderboard(_scope text, _metric text)
RETURNS TABLE(user_id uuid, score numeric)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _cutoff timestamptz;
BEGIN
  IF _scope = 'weekly' THEN _cutoff := now() - interval '7 days';
  ELSIF _scope = 'monthly' THEN _cutoff := now() - interval '30 days';
  ELSE _cutoff := now() - interval '10 years';
  END IF;

  IF _metric = 'problems' THEN
    RETURN QUERY
      SELECT p.user_id, COUNT(*)::numeric AS score
      FROM public.user_problem_progress p
      WHERE p.status = 'solved' AND p.solved_at >= _cutoff
      GROUP BY p.user_id
      ORDER BY score DESC
      LIMIT 25;
  ELSIF _metric = 'interview' THEN
    RETURN QUERY
      SELECT i.user_id, MAX(i.overall_score)::numeric AS score
      FROM public.interviews i
      WHERE i.status = 'completed' AND i.created_at >= _cutoff AND i.overall_score IS NOT NULL
      GROUP BY i.user_id
      ORDER BY score DESC
      LIMIT 25;
  ELSE
    RETURN QUERY
      SELECT s.user_id, COALESCE(s.current_streak, 0)::numeric AS score
      FROM public.streaks s
      WHERE COALESCE(s.current_streak, 0) > 0
      ORDER BY score DESC
      LIMIT 25;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_leaderboard(text, text) TO authenticated;
