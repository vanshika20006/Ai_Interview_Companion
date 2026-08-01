
CREATE OR REPLACE FUNCTION public.bootstrap_my_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _email text;
  _meta_role text;
  _admin_email constant text := 'vannu7306@gmail.com';
  _granted text := 'none';
BEGIN
  IF _uid IS NULL THEN RETURN 'unauthenticated'; END IF;

  SELECT u.email, COALESCE(u.raw_user_meta_data->>'signup_role', '')
    INTO _email, _meta_role
  FROM auth.users u WHERE u.id = _uid;

  IF lower(COALESCE(_email,'')) = _admin_email THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (_uid, 'admin')
    ON CONFLICT DO NOTHING;
    _granted := 'admin';
  ELSIF _meta_role = 'recruiter' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (_uid, 'recruiter')
    ON CONFLICT DO NOTHING;
    _granted := 'recruiter';
  END IF;

  RETURN _granted;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.bootstrap_my_role() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bootstrap_my_role() TO authenticated;
