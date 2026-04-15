
-- Drop permissive write policies on portfolio_content
DROP POLICY IF EXISTS "Anyone can insert portfolio content" ON public.portfolio_content;
DROP POLICY IF EXISTS "Anyone can update portfolio content" ON public.portfolio_content;

-- Add authenticated-only write policies
CREATE POLICY "Authenticated users can insert portfolio content"
ON public.portfolio_content
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update portfolio content"
ON public.portfolio_content
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Drop permissive storage write policies
DROP POLICY IF EXISTS "Allow upload to portfolio media" ON storage.objects;
DROP POLICY IF EXISTS "Allow update portfolio media" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete portfolio media" ON storage.objects;

-- Add authenticated-only storage write policies
CREATE POLICY "Authenticated users can upload portfolio media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-media');

CREATE POLICY "Authenticated users can update portfolio media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-media');

CREATE POLICY "Authenticated users can delete portfolio media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-media');
