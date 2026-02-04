/*
  # Add video_id to hero_slides table

  1. Changes
    - Add `video_id` column to `hero_slides` table
    - Add foreign key constraint to `videos` table
    - Allow null values for slides without video

  2. Notes
    - This allows hero slides to be linked to videos for playback
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hero_slides' AND column_name = 'video_id'
  ) THEN
    ALTER TABLE hero_slides ADD COLUMN video_id uuid REFERENCES videos(id) ON DELETE SET NULL;
  END IF;
END $$;