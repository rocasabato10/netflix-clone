/*
  # Create Designers Profile Table and Link to Videos

  1. New Tables
    - `designers`
      - `id` (uuid, primary key)
      - `name` (text, unique) - Full name of the designer
      - `slug` (text, unique) - URL-friendly version of name
      - `bio` (text) - Full biography and career highlights
      - `birth_date` (date) - Date of birth
      - `birth_place` (text) - Place of birth
      - `photo_url` (text) - Profile photo URL
      - `brands` (jsonb) - Array of brands they worked for/founded
      - `achievements` (jsonb) - Notable achievements and awards
      - `signature_style` (text) - Description of their signature style
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Changes
    - Add `designer_id` field to `videos` table to link videos to designers
  
  3. Security
    - Enable RLS on `designers` table
    - Add policies for public read access (designers are public information)
    - Add policies for authenticated admin users to manage designer profiles
*/

-- Create designers table
CREATE TABLE IF NOT EXISTS designers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  bio text NOT NULL DEFAULT '',
  birth_date date,
  birth_place text DEFAULT '',
  photo_url text DEFAULT '',
  brands jsonb DEFAULT '[]'::jsonb,
  achievements jsonb DEFAULT '[]'::jsonb,
  signature_style text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add designer_id to videos table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'videos' AND column_name = 'designer_id'
  ) THEN
    ALTER TABLE videos ADD COLUMN designer_id uuid REFERENCES designers(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE designers ENABLE ROW LEVEL SECURITY;

-- Public can view all designers
CREATE POLICY "Anyone can view designers"
  ON designers FOR SELECT
  TO public
  USING (true);

-- Only authenticated users can insert designers (admin functionality)
CREATE POLICY "Authenticated users can insert designers"
  ON designers FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update designers (admin functionality)
CREATE POLICY "Authenticated users can update designers"
  ON designers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users can delete designers (admin functionality)
CREATE POLICY "Authenticated users can delete designers"
  ON designers FOR DELETE
  TO authenticated
  USING (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_videos_designer_id ON videos(designer_id);
CREATE INDEX IF NOT EXISTS idx_designers_slug ON designers(slug);
