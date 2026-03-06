CREATE TABLE public.portfolio_content (
  section TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_content ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read portfolio content"
ON public.portfolio_content FOR SELECT
TO anon, authenticated
USING (true);

-- Public write (since auth is client-side only)
CREATE POLICY "Anyone can update portfolio content"
ON public.portfolio_content FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Anyone can insert portfolio content"
ON public.portfolio_content FOR INSERT
TO anon, authenticated
WITH CHECK (true);