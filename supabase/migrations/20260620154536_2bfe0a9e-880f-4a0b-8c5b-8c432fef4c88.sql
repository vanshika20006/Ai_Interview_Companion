
DROP POLICY IF EXISTS "users insert own achievements" ON public.user_achievements;

CREATE OR REPLACE FUNCTION public.award_achievement(_code text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _ok boolean := false;
  _count int;
  _streak int;
BEGIN
  IF _uid IS NULL THEN RETURN false; END IF;
  IF EXISTS (SELECT 1 FROM public.user_achievements WHERE user_id = _uid AND achievement_code = _code) THEN
    RETURN true;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.achievements WHERE code = _code) THEN
    RETURN false;
  END IF;

  CASE _code
    WHEN 'first_resume' THEN
      SELECT COUNT(*) INTO _count FROM public.resume_analyses WHERE user_id = _uid;
      _ok := _count >= 1;
    WHEN 'ats_score_90' THEN
      SELECT COUNT(*) INTO _count FROM public.resume_analyses WHERE user_id = _uid AND ats_score >= 90;
      _ok := _count >= 1;
    WHEN 'first_interview' THEN
      SELECT COUNT(*) INTO _count FROM public.interviews WHERE user_id = _uid AND status = 'completed';
      _ok := _count >= 1;
    WHEN 'interview_score_80' THEN
      SELECT COUNT(*) INTO _count FROM public.interviews WHERE user_id = _uid AND overall_score >= 80;
      _ok := _count >= 1;
    WHEN 'problems_50' THEN
      SELECT COUNT(*) INTO _count FROM public.user_problem_progress WHERE user_id = _uid AND status = 'solved';
      _ok := _count >= 50;
    WHEN 'problems_100' THEN
      SELECT COUNT(*) INTO _count FROM public.user_problem_progress WHERE user_id = _uid AND status = 'solved';
      _ok := _count >= 100;
    WHEN 'streak_7' THEN
      SELECT COALESCE(best_streak, 0) INTO _streak FROM public.streaks WHERE user_id = _uid;
      _ok := COALESCE(_streak, 0) >= 7;
    WHEN 'streak_30' THEN
      SELECT COALESCE(best_streak, 0) INTO _streak FROM public.streaks WHERE user_id = _uid;
      _ok := COALESCE(_streak, 0) >= 30;
    ELSE _ok := false;
  END CASE;

  IF _ok THEN
    INSERT INTO public.user_achievements (user_id, achievement_code)
    VALUES (_uid, _code) ON CONFLICT DO NOTHING;
    RETURN true;
  END IF;
  RETURN false;
END;
$$;

REVOKE ALL ON FUNCTION public.award_achievement(text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.award_achievement(text) TO authenticated;

DROP POLICY IF EXISTS "Users can join as themselves" ON public.study_group_members;

CREATE OR REPLACE FUNCTION public.join_group_by_invite(_code text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _gid uuid;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _code IS NULL OR length(_code) < 4 THEN RAISE EXCEPTION 'Invalid invite code'; END IF;
  SELECT id INTO _gid FROM public.study_groups WHERE invite_code = lower(_code) LIMIT 1;
  IF _gid IS NULL THEN RAISE EXCEPTION 'Invalid invite code'; END IF;
  INSERT INTO public.study_group_members (group_id, user_id, role)
  VALUES (_gid, _uid, 'member') ON CONFLICT DO NOTHING;
  RETURN _gid;
END;
$$;

REVOKE ALL ON FUNCTION public.join_group_by_invite(text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.join_group_by_invite(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_display_names(_ids uuid[])
RETURNS TABLE(user_id uuid, display_name text, username text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    u.id AS user_id,
    COALESCE(p.full_name, split_part(p.email, '@', 1), 'Anonymous') AS display_name,
    CASE WHEN pp.is_public THEN pp.username ELSE NULL END AS username
  FROM unnest(_ids) AS u(id)
  LEFT JOIN public.profiles p ON p.id = u.id
  LEFT JOIN public.public_profiles pp ON pp.user_id = u.id;
$$;

REVOKE ALL ON FUNCTION public.get_display_names(uuid[]) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.get_display_names(uuid[]) TO authenticated;

-- Helpful indexes for hot paths
CREATE INDEX IF NOT EXISTS idx_user_problem_progress_user_status ON public.user_problem_progress(user_id, status);
CREATE INDEX IF NOT EXISTS idx_interviews_user_status ON public.interviews(user_id, status);
CREATE INDEX IF NOT EXISTS idx_resume_analyses_user_created ON public.resume_analyses(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_created ON public.bookmarks(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_created ON public.community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post ON public.comments(post_id, created_at);
