
DO $$ BEGIN
  CREATE TYPE public.shortlist_status AS ENUM ('new','contacted','interviewing','offer','rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.recruiter_shortlists
  ADD COLUMN IF NOT EXISTS status public.shortlist_status NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS trg_recruiter_shortlists_updated_at ON public.recruiter_shortlists;
CREATE TRIGGER trg_recruiter_shortlists_updated_at
  BEFORE UPDATE ON public.recruiter_shortlists
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
