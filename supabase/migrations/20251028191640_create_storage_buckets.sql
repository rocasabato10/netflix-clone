/*
  # Create Storage Buckets for Videos and Thumbnails

  1. Storage Buckets
    - `videos` - For storing video files
    - `thumbnails` - For storing thumbnail images

  2. Security
    - Videos bucket: authenticated users can read based on subscription
    - Thumbnails bucket: public read access, authenticated write
    - Admin users (authenticated) can upload videos and thumbnails

  3. Important Notes
    - Storage policies will allow authenticated users to upload
    - Video access will be controlled through application logic
    - Thumbnails are publicly accessible for browsing
*/

-- Create videos storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'videos',
  'videos',
  false,
  524288000,
  ARRAY['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']
)
ON CONFLICT (id) DO NOTHING;

-- Create thumbnails storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'thumbnails',
  'thumbnails',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Videos bucket policies
CREATE POLICY "Authenticated users can upload videos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Authenticated users can update videos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'videos')
  WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Authenticated users can delete videos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users with subscription can view videos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'videos' AND
    EXISTS (
      SELECT 1 FROM user_subscriptions
      WHERE user_subscriptions.user_id = auth.uid()
      AND user_subscriptions.status = 'active'
    )
  );

-- Thumbnails bucket policies
CREATE POLICY "Anyone can view thumbnails"
  ON storage.objects FOR SELECT
  TO public, anon, authenticated
  USING (bucket_id = 'thumbnails');

CREATE POLICY "Authenticated users can upload thumbnails"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'thumbnails');

CREATE POLICY "Authenticated users can update thumbnails"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'thumbnails')
  WITH CHECK (bucket_id = 'thumbnails');

CREATE POLICY "Authenticated users can delete thumbnails"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'thumbnails');
