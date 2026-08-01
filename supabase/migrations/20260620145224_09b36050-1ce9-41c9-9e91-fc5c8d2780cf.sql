CREATE TABLE public.resume_builder_resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Untitled resume',
  template text NOT NULL DEFAULT 'modern',
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.resume_builder_resumes TO authenticated;
GRANT ALL ON public.resume_builder_resumes TO service_role;

ALTER TABLE public.resume_builder_resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own builder resumes"
  ON public.resume_builder_resumes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER set_updated_at_resume_builder
  BEFORE UPDATE ON public.resume_builder_resumes
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE INDEX idx_resume_builder_user ON public.resume_builder_resumes(user_id, updated_at DESC);