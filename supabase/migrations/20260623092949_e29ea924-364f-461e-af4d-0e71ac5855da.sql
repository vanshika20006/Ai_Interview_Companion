
CREATE OR REPLACE FUNCTION public.admin_analytics()
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _totals jsonb;
  _roles jsonb;
  _signups jsonb;
  _recent jsonb;
  _content jsonb;
BEGIN
  IF NOT public.has_role(_uid, 'admin') THEN
    RAISE EXCEPTION 'Admin role required';
  END IF;

  SELECT jsonb_build_object(
    'users', (SELECT count(*) FROM public.profiles),
    'interviews', (SELECT count(*) FROM public.interviews),
    'completed_interviews', (SELECT count(*) FROM public.interviews WHERE status = 'completed'),
    'resumes', (SELECT count(*) FROM public.resume_analyses),
    'problems_solved', (SELECT count(*) FROM public.user_problem_progress WHERE status = 'solved'),
    'posts', (SELECT count(*) FROM public.community_posts),
    'shortlists', (SELECT count(*) FROM public.recruiter_shortlists),
    'study_groups', (SELECT count(*) FROM public.study_groups),
    'active_streaks', (SELECT count(*) FROM public.streaks WHERE current_streak > 0)
  ) INTO _totals;

  SELECT jsonb_object_agg(role, c) INTO _roles
  FROM (SELECT role::text AS role, count(*) AS c FROM public.user_roles GROUP BY role) r;

  SELECT jsonb_agg(jsonb_build_object('day', day, 'count', c) ORDER BY day) INTO _signups
  FROM (
    SELECT to_char(d::date, 'YYYY-MM-DD') AS day,
           COALESCE(count(p.id), 0) AS c
    FROM generate_series(current_date - interval '13 days', current_date, interval '1 day') d
    LEFT JOIN public.profiles p ON p.created_at::date = d::date
    GROUP BY d
  ) s;

  SELECT jsonb_agg(jsonb_build_object(
    'user_id', id, 'email', email, 'full_name', full_name, 'created_at', created_at
  ) ORDER BY created_at DESC) INTO _recent
  FROM (SELECT id, email, full_name, created_at FROM public.profiles ORDER BY created_at DESC NULLS LAST LIMIT 8) p;

  SELECT jsonb_build_object(
    'top_posts', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', id, 'title', title, 'like_count', like_count, 'comment_count', comment_count
      ) ORDER BY like_count DESC)
      FROM (SELECT id, title, like_count, comment_count FROM public.community_posts ORDER BY like_count DESC NULLS LAST LIMIT 5) tp
    ), '[]'::jsonb),
    'recent_interviews', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', id, 'role', role, 'overall_score', overall_score, 'created_at', created_at
      ) ORDER BY created_at DESC)
      FROM (SELECT id, role, overall_score, created_at FROM public.interviews WHERE status = 'completed' ORDER BY created_at DESC LIMIT 5) ri
    ), '[]'::jsonb)
  ) INTO _content;

  RETURN jsonb_build_object(
    'totals', _totals,
    'roles', COALESCE(_roles, '{}'::jsonb),
    'signups', COALESCE(_signups, '[]'::jsonb),
    'recent_users', COALESCE(_recent, '[]'::jsonb),
    'content', _content
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_analytics() TO authenticated;
