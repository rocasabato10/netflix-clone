/*
  # Add collection_id to videos table

  1. Changes
    - Add `collection_id` column to videos table
    - Create foreign key relationship with collections table
    - Create index for performance

  2. Notes
    - This column is optional (nullable) as not all videos belong to a collection
    - Videos can now be organized by collections in addition to categories/subcategories
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'videos' AND column_name = 'collection_id'
  ) THEN
    ALTER TABLE videos ADD COLUMN collection_id uuid REFERENCES collections(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_videos_collection_id ON videos(collection_id);
  END IF;
END $$;