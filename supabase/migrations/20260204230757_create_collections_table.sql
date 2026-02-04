/*
  # Create Collections Table

  1. New Tables
    - `collections`
      - `id` (uuid, primary key)
      - `name` (text) - Name of the collection (e.g., "Spring/Summer 2025")
      - `description` (text) - Brief description of the collection
      - `designer_id` (uuid, foreign key) - Reference to designers table
      - `year` (integer) - Year of the collection
      - `season` (text) - Season of the collection (optional: "spring", "summer", "fall", "winter")
      - `thumbnail_url` (text) - Thumbnail image for the collection
      - `display_order` (integer) - Order for displaying collections
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on `collections` table
    - Add policy for public read access
    - Add policy for authenticated admin users to manage collections
*/

CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  designer_id uuid REFERENCES designers(id) ON DELETE CASCADE,
  year integer NOT NULL,
  season text,
  thumbnail_url text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view collections"
  ON collections FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert collections"
  ON collections FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update collections"
  ON collections FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete collections"
  ON collections FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_collections_designer_id ON collections(designer_id);
CREATE INDEX IF NOT EXISTS idx_collections_year ON collections(year);
CREATE INDEX IF NOT EXISTS idx_collections_display_order ON collections(display_order);