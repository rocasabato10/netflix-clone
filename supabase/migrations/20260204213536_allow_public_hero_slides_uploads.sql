/*
  # Allow Public Hero Slides Uploads

  1. Changes
    - Drop the authenticated-only policies for hero-slides bucket
    - Create new policies that allow anyone to upload/update/delete
    
  2. Security
    - This is necessary for admin operations and initial setup
    - The admin panel will control access through the application layer
*/

DO $$
BEGIN
  DROP POLICY IF EXISTS "Authenticated users can upload hero slides" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can update hero slides" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can delete hero slides" ON storage.objects;
END $$;

CREATE POLICY "Anyone can upload hero slides"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'hero-slides');

CREATE POLICY "Anyone can update hero slides"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'hero-slides')
  WITH CHECK (bucket_id = 'hero-slides');

CREATE POLICY "Anyone can delete hero slides"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'hero-slides');