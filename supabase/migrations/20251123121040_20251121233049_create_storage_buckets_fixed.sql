/*
  # Create Storage Buckets for Media Files

  1. New Storage Buckets
    - `videos` - For storing video files
    - `thumbnails` - For storing video thumbnail images

  2. Storage Policies
    - Anyone can view (SELECT) files from both buckets
    - Anyone can upload (INSERT) files to both buckets (temporary open access)
    - Anyone can update files in both buckets
    - Anyone can delete files from both buckets

  3. Notes
    - Buckets are set to public for easy access
    - File size limits can be configured later
    - MIME type restrictions can be added later
*/

INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('videos', 'videos', true),
  ('thumbnails', 'thumbnails', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can view videos'
  ) THEN
    CREATE POLICY "Anyone can view videos"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'videos');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can upload videos'
  ) THEN
    CREATE POLICY "Anyone can upload videos"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'videos');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can update videos'
  ) THEN
    CREATE POLICY "Anyone can update videos"
      ON storage.objects FOR UPDATE
      USING (bucket_id = 'videos')
      WITH CHECK (bucket_id = 'videos');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can delete videos'
  ) THEN
    CREATE POLICY "Anyone can delete videos"
      ON storage.objects FOR DELETE
      USING (bucket_id = 'videos');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can view thumbnails'
  ) THEN
    CREATE POLICY "Anyone can view thumbnails"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'thumbnails');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can upload thumbnails'
  ) THEN
    CREATE POLICY "Anyone can upload thumbnails"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'thumbnails');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can update thumbnails'
  ) THEN
    CREATE POLICY "Anyone can update thumbnails"
      ON storage.objects FOR UPDATE
      USING (bucket_id = 'thumbnails')
      WITH CHECK (bucket_id = 'thumbnails');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can delete thumbnails'
  ) THEN
    CREATE POLICY "Anyone can delete thumbnails"
      ON storage.objects FOR DELETE
      USING (bucket_id = 'thumbnails');
  END IF;
END $$;