
-- Create storage bucket for portfolio media
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true);

-- Allow public read access
CREATE POLICY "Public read access for portfolio media"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-media');

-- Allow anyone to upload
CREATE POLICY "Allow upload to portfolio media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio-media');

-- Allow anyone to update
CREATE POLICY "Allow update portfolio media"
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio-media');

-- Allow anyone to delete
CREATE POLICY "Allow delete portfolio media"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio-media');
