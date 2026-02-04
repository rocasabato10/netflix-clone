/*
  # Create Hero Slides Storage Bucket

  1. New Storage Bucket
    - `hero-slides` - For storing hero carousel images

  2. Storage Policies
    - Anyone can view (SELECT) files from the bucket (public access)
    - Authenticated admins can upload (INSERT) files to the bucket
    - Authenticated admins can update files in the bucket
    - Authenticated admins can delete files from the bucket

  3. Notes
    - Bucket is set to public for easy access on homepage
    - Only authenticated users can upload/modify/delete
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('hero-slides', 'hero-slides', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can view hero slides'
  ) THEN
    CREATE POLICY "Anyone can view hero slides"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'hero-slides');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can upload hero slides'
  ) THEN
    CREATE POLICY "Authenticated users can upload hero slides"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'hero-slides');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can update hero slides'
  ) THEN
    CREATE POLICY "Authenticated users can update hero slides"
      ON storage.objects FOR UPDATE
      TO authenticated
      USING (bucket_id = 'hero-slides')
      WITH CHECK (bucket_id = 'hero-slides');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can delete hero slides'
  ) THEN
    CREATE POLICY "Authenticated users can delete hero slides"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (bucket_id = 'hero-slides');
  END IF;
END $$;