
-- chat_threads
CREATE TABLE public.chat_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'New chat',
  scope text NOT NULL DEFAULT 'general' CHECK (scope IN ('mentor','coding','guide','general')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_threads TO authenticated;
GRANT ALL ON public.chat_threads TO service_role;
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own threads" ON public.chat_threads FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX chat_threads_user_idx ON public.chat_threads(user_id, updated_at DESC);
CREATE TRIGGER chat_threads_updated BEFORE UPDATE ON public.chat_threads FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- chat_messages
CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.chat_threads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user','assistant','system')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own messages" ON public.chat_messages FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX chat_messages_thread_idx ON public.chat_messages(thread_id, created_at);

-- notifications
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX notifications_user_idx ON public.notifications(user_id, created_at DESC);

-- code_reviews
CREATE TABLE public.code_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  language text NOT NULL DEFAULT 'javascript',
  code text NOT NULL,
  description text,
  ai_feedback text,
  ai_score int,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.code_reviews TO authenticated;
GRANT ALL ON public.code_reviews TO service_role;
ALTER TABLE public.code_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "code reviews public read" ON public.code_reviews FOR SELECT USING (true);
CREATE POLICY "code reviews own insert" ON public.code_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "code reviews own update" ON public.code_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "code reviews own delete" ON public.code_reviews FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX code_reviews_created_idx ON public.code_reviews(created_at DESC);
CREATE TRIGGER code_reviews_updated BEFORE UPDATE ON public.code_reviews FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- code_review_comments
CREATE TABLE public.code_review_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid NOT NULL REFERENCES public.code_reviews(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.code_review_comments TO authenticated;
GRANT ALL ON public.code_review_comments TO service_role;
ALTER TABLE public.code_review_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "review comments public read" ON public.code_review_comments FOR SELECT USING (true);
CREATE POLICY "review comments own insert" ON public.code_review_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "review comments own delete" ON public.code_review_comments FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX code_review_comments_review_idx ON public.code_review_comments(review_id, created_at);
