
-- Bootstrap first admin
CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _count int;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT COUNT(*) INTO _count FROM public.user_roles WHERE role = 'admin';
  IF _count > 0 THEN RAISE EXCEPTION 'Admin already exists'; END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (_uid, 'admin')
  ON CONFLICT DO NOTHING;
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_can_claim()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin');
$$;

-- List users (admin only)
CREATE OR REPLACE FUNCTION public.admin_list_users(_search text DEFAULT NULL, _limit int DEFAULT 50)
RETURNS TABLE(user_id uuid, email text, full_name text, roles text[])
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admin role required';
  END IF;
  RETURN QUERY
    SELECT p.id AS user_id,
           p.email,
           p.full_name,
           COALESCE(ARRAY(SELECT ur.role::text FROM public.user_roles ur WHERE ur.user_id = p.id ORDER BY ur.role::text), ARRAY[]::text[]) AS roles
    FROM public.profiles p
    WHERE _search IS NULL
       OR p.email ILIKE '%'||_search||'%'
       OR COALESCE(p.full_name,'') ILIKE '%'||_search||'%'
    ORDER BY p.created_at DESC NULLS LAST
    LIMIT GREATEST(_limit, 1);
END;
$$;

-- Grant/revoke a role (admin only)
CREATE OR REPLACE FUNCTION public.admin_set_role(_target uuid, _role public.app_role, _grant boolean)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _admin_count int;
BEGIN
  IF NOT public.has_role(_uid, 'admin') THEN
    RAISE EXCEPTION 'Admin role required';
  END IF;

  IF _grant THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (_target, _role)
    ON CONFLICT DO NOTHING;
  ELSE
    -- Prevent removing the last admin
    IF _role = 'admin' THEN
      SELECT COUNT(*) INTO _admin_count FROM public.user_roles WHERE role = 'admin';
      IF _admin_count <= 1 AND _target = _uid THEN
        RAISE EXCEPTION 'Cannot remove the last admin';
      END IF;
    END IF;
    DELETE FROM public.user_roles WHERE user_id = _target AND role = _role;
  END IF;
  RETURN true;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.claim_first_admin() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_can_claim() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_list_users(text, int) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_set_role(uuid, public.app_role, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_can_claim() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_users(text, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_role(uuid, public.app_role, boolean) TO authenticated;
