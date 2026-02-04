/*
  # Create Hero Slides Management Table

  1. New Tables
    - `hero_slides`
      - `id` (uuid, primary key) - Unique identifier for each slide
      - `title` (text) - Title displayed on the hero slide
      - `description` (text) - Description text for the slide
      - `image_url` (text) - URL of the hero image
      - `display_order` (integer) - Order in which slides appear
      - `is_active` (boolean) - Whether the slide is currently active
      - `created_at` (timestamptz) - Timestamp of creation
      - `updated_at` (timestamptz) - Timestamp of last update

  2. Security
    - Enable RLS on `hero_slides` table
    - Add policy for public read access to active slides
    - Add policy for authenticated admin users to manage slides

  3. Storage
    - Create storage bucket for hero images
    - Set up public access policies for hero images
*/

-- Create hero_slides table
CREATE TABLE IF NOT EXISTS hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  image_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

-- Public can view active hero slides
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'hero_slides' 
    AND policyname = 'Anyone can view active hero slides'
  ) THEN
    CREATE POLICY "Anyone can view active hero slides"
      ON hero_slides
      FOR SELECT
      USING (is_active = true);
  END IF;
END $$;

-- Authenticated users can view all hero slides
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'hero_slides' 
    AND policyname = 'Authenticated users can view all hero slides'
  ) THEN
    CREATE POLICY "Authenticated users can view all hero slides"
      ON hero_slides
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Authenticated users can insert hero slides
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'hero_slides' 
    AND policyname = 'Authenticated users can insert hero slides'
  ) THEN
    CREATE POLICY "Authenticated users can insert hero slides"
      ON hero_slides
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

-- Authenticated users can update hero slides
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'hero_slides' 
    AND policyname = 'Authenticated users can update hero slides'
  ) THEN
    CREATE POLICY "Authenticated users can update hero slides"
      ON hero_slides
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Authenticated users can delete hero slides
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'hero_slides' 
    AND policyname = 'Authenticated users can delete hero slides'
  ) THEN
    CREATE POLICY "Authenticated users can delete hero slides"
      ON hero_slides
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create storage bucket for hero images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero-images', 'hero-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist and recreate them
DROP POLICY IF EXISTS "Public access to hero images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload hero images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update hero images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete hero images" ON storage.objects;

-- Allow public access to hero images
CREATE POLICY "Public access to hero images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'hero-images');

-- Allow authenticated users to upload hero images
CREATE POLICY "Authenticated users can upload hero images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'hero-images');

-- Allow authenticated users to update hero images
CREATE POLICY "Authenticated users can update hero images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'hero-images')
  WITH CHECK (bucket_id = 'hero-images');

-- Allow authenticated users to delete hero images
CREATE POLICY "Authenticated users can delete hero images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'hero-images');

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_hero_slides_order ON hero_slides(display_order, is_active);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_hero_slides_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_hero_slides_updated_at_trigger'
  ) THEN
    CREATE TRIGGER update_hero_slides_updated_at_trigger
      BEFORE UPDATE ON hero_slides
      FOR EACH ROW
      EXECUTE FUNCTION update_hero_slides_updated_at();
  END IF;
END $$;