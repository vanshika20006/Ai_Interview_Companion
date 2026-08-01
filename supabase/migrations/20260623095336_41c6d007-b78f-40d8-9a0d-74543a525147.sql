DROP POLICY IF EXISTS "code reviews public read" ON public.code_reviews;
CREATE POLICY "code reviews authenticated read" ON public.code_reviews FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "review comments public read" ON public.code_review_comments;
CREATE POLICY "review comments authenticated read" ON public.code_review_comments FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "streaks readable by authenticated" ON public.streaks;
CREATE POLICY "streaks own read" ON public.streaks FOR SELECT TO authenticated USING (auth.uid() = user_id);

REVOKE SELECT ON public.code_reviews FROM anon;
REVOKE SELECT ON public.code_review_comments FROM anon;