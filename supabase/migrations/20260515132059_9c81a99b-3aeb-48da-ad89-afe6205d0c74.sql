
-- 1. Storage: drop public listing, add admin-only listing
DROP POLICY IF EXISTS "Public read access for portfolio media" ON storage.objects;

CREATE POLICY "Admins can list portfolio media"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'portfolio-media' AND public.has_role(auth.uid(), 'admin'));

-- 2. Security findings (manual entry / exception log)
CREATE TYPE public.security_severity AS ENUM ('info','low','medium','high','critical');
CREATE TYPE public.security_finding_status AS ENUM ('open','ignored','fixed');

CREATE TABLE public.security_findings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  severity public.security_severity NOT NULL DEFAULT 'medium',
  status public.security_finding_status NOT NULL DEFAULT 'open',
  source text NOT NULL DEFAULT 'manual',
  ignored_reason text,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.security_findings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read findings"   ON public.security_findings FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins insert findings" ON public.security_findings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update findings" ON public.security_findings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete findings" ON public.security_findings FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER trg_security_findings_updated
BEFORE UPDATE ON public.security_findings
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 3. Scan runs (written by edge function via service role; admins read)
CREATE TABLE public.security_scan_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  status text NOT NULL DEFAULT 'running',
  passed int NOT NULL DEFAULT 0,
  failed int NOT NULL DEFAULT 0,
  results jsonb NOT NULL DEFAULT '[]'::jsonb,
  trigger text NOT NULL DEFAULT 'cron'
);

ALTER TABLE public.security_scan_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read scan runs"
ON public.security_scan_runs FOR SELECT TO authenticated
USING (public.has_role(auth.uid(),'admin'));
-- No INSERT/UPDATE/DELETE policies for non-service roles → service role bypasses RLS

-- 4. Extensions for scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
