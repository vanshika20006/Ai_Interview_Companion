
-- Tighten trigger-function execute permissions (linter fix from Batch B)
REVOKE EXECUTE ON FUNCTION public.bump_post_like_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.bump_post_comment_count() FROM PUBLIC, anon, authenticated;

CREATE TABLE public.achievements (
  code text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'Trophy',
  criteria jsonb NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0
);
GRANT SELECT ON public.achievements TO anon, authenticated;
GRANT ALL ON public.achievements TO service_role;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "achievements readable by all" ON public.achievements FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.user_achievements (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_code text NOT NULL REFERENCES public.achievements(code) ON DELETE CASCADE,
  earned_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, achievement_code)
);
GRANT SELECT, INSERT, DELETE ON public.user_achievements TO authenticated;
GRANT ALL ON public.user_achievements TO service_role;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own achievements" ON public.user_achievements FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "users insert own achievements" ON public.user_achievements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.streaks (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak integer NOT NULL DEFAULT 0,
  best_streak integer NOT NULL DEFAULT 0,
  last_active_date date,
  total_activity_days integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.streaks TO authenticated;
GRANT ALL ON public.streaks TO service_role;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "streaks readable by authenticated" ON public.streaks FOR SELECT TO authenticated USING (true);
CREATE POLICY "users manage own streak" ON public.streaks FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.public_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  headline text,
  bio text,
  is_public boolean NOT NULL DEFAULT false,
  show_email boolean NOT NULL DEFAULT false,
  show_resume_score boolean NOT NULL DEFAULT true,
  show_problems boolean NOT NULL DEFAULT true,
  show_interview boolean NOT NULL DEFAULT true,
  show_badges boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.public_profiles TO authenticated;
GRANT ALL ON public.public_profiles TO service_role;
ALTER TABLE public.public_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public profiles visible when public" ON public.public_profiles FOR SELECT TO anon, authenticated USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "users manage own public profile" ON public.public_profiles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.recruiter_shortlists (
  recruiter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (recruiter_id, student_user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recruiter_shortlists TO authenticated;
GRANT ALL ON public.recruiter_shortlists TO service_role;
ALTER TABLE public.recruiter_shortlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "recruiters manage own shortlist" ON public.recruiter_shortlists FOR ALL TO authenticated USING (auth.uid() = recruiter_id AND public.has_role(auth.uid(), 'recruiter')) WITH CHECK (auth.uid() = recruiter_id AND public.has_role(auth.uid(), 'recruiter'));

INSERT INTO public.achievements (code, title, description, icon, sort_order) VALUES
  ('first_resume', 'Resume Ready', 'Analyzed your first resume', 'FileText', 10),
  ('first_interview', 'Interview Pioneer', 'Completed your first AI interview', 'MessagesSquare', 20),
  ('problems_50', 'Half Century', 'Solved 50 LeetCode problems', 'Code2', 30),
  ('problems_100', 'Centurion', 'Solved 100 LeetCode problems', 'Trophy', 40),
  ('streak_7', 'Week Warrior', '7-day preparation streak', 'Flame', 50),
  ('streak_30', 'Unstoppable', '30-day preparation streak', 'Flame', 60),
  ('interview_score_80', 'Star Candidate', 'Scored 80+ in an AI interview', 'Star', 70),
  ('ats_score_90', 'ATS Champion', 'Achieved an ATS score of 90+', 'Award', 80)
ON CONFLICT (code) DO NOTHING;

CREATE INDEX idx_public_profiles_username ON public.public_profiles(username) WHERE is_public = true;
