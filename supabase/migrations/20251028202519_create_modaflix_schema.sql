/*
  # ModaFlix Database Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text) - Category name (Fashion Entertainment, Runway & Collections, Design & Style)
      - `slug` (text, unique) - URL-friendly identifier
      - `order` (integer) - Display order
      - `created_at` (timestamptz)
    
    - `subcategories`
      - `id` (uuid, primary key)
      - `category_id` (uuid, foreign key to categories)
      - `name` (text) - Subcategory name
      - `slug` (text) - URL-friendly identifier
      - `order` (integer) - Display order
      - `created_at` (timestamptz)
    
    - `videos`
      - `id` (uuid, primary key)
      - `title` (text) - Video title
      - `description` (text) - Video description
      - `thumbnail_url` (text) - Thumbnail image URL
      - `video_url` (text) - Video playback URL
      - `duration` (integer) - Duration in seconds
      - `year` (integer) - Release year
      - `subcategory_id` (uuid, foreign key to subcategories)
      - `featured` (boolean) - Whether video should be featured in hero
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add public read access policies (content is public like Netflix)
    - Restrict write access to authenticated users only

  3. Indexes
    - Add indexes for category and subcategory slugs for fast lookups
    - Add index on subcategory_id for videos for efficient filtering
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create subcategories table
CREATE TABLE IF NOT EXISTS subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(category_id, slug)
);

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  thumbnail_url text NOT NULL,
  video_url text NOT NULL,
  duration integer DEFAULT 0,
  year integer,
  subcategory_id uuid NOT NULL REFERENCES subcategories(id) ON DELETE CASCADE,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_subcategories_slug ON subcategories(category_id, slug);
CREATE INDEX IF NOT EXISTS idx_videos_subcategory ON videos(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_videos_featured ON videos(featured) WHERE featured = true;

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view subcategories"
  ON subcategories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view videos"
  ON videos FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated users can insert/update/delete (for admin purposes)
CREATE POLICY "Authenticated users can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert subcategories"
  ON subcategories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update subcategories"
  ON subcategories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete subcategories"
  ON subcategories FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert videos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update videos"
  ON videos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete videos"
  ON videos FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample categories
INSERT INTO categories (name, slug, "order") VALUES
  ('Fashion Entertainment', 'fashion-entertainment', 1),
  ('Runway & Collections', 'runway-collections', 2),
  ('Design & Style', 'design-style', 3)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample subcategories
DO $$
DECLARE
  fashion_ent_id uuid;
  runway_id uuid;
  design_id uuid;
BEGIN
  SELECT id INTO fashion_ent_id FROM categories WHERE slug = 'fashion-entertainment';
  SELECT id INTO runway_id FROM categories WHERE slug = 'runway-collections';
  SELECT id INTO design_id FROM categories WHERE slug = 'design-style';

  INSERT INTO subcategories (category_id, name, slug, "order") VALUES
    (fashion_ent_id, 'Fashion Films', 'fashion-films', 1),
    (fashion_ent_id, 'Documentaries', 'documentaries', 2),
    (fashion_ent_id, 'Behind the Scenes', 'behind-the-scenes', 3),
    (runway_id, 'Paris Fashion Week', 'paris-fashion-week', 1),
    (runway_id, 'Milan Fashion Week', 'milan-fashion-week', 2),
    (runway_id, 'New York Fashion Week', 'new-york-fashion-week', 3),
    (design_id, 'Designer Profiles', 'designer-profiles', 1),
    (design_id, 'Style Guides', 'style-guides', 2),
    (design_id, 'Trends', 'trends', 3)
  ON CONFLICT (category_id, slug) DO NOTHING;
END $$;
