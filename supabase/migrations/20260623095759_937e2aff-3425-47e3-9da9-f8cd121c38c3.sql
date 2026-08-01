REVOKE EXECUTE ON FUNCTION public.admin_analytics() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_leaderboard(text, text) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, PUBLIC;