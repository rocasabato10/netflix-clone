/*
  # Add display order to subcategories and reorder homepage subcategories

  1. Changes
    - Add `display_order` column to subcategories table
    - Remove duplicate "Fashion Week" subcategory
    - Remove "Because You Watched" subcategory
    - Set correct display order for homepage subcategories:
      1. New Releases
      2. Fashion Weeks
      3. Keep Watching
      4. Suggested For You
      5. Runway
      6. Interviews
      7. Movies
      8. TV Series
      9. Documentaries
      10. Collections
  
  2. Security
    - No changes to RLS policies
*/

-- Add display_order column to subcategories if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subcategories' AND column_name = 'display_order'
  ) THEN
    ALTER TABLE subcategories ADD COLUMN display_order INTEGER DEFAULT 0;
  END IF;
END $$;

-- Remove duplicate "Fashion Week" (keep "Fashion Weeks")
DELETE FROM subcategories 
WHERE name = 'Fashion Week' 
AND slug = 'fashion-week-home'
AND category_id = 'e43f99a5-bd7a-48c2-adfa-66254d08d34f';

-- Remove "Because You Watched" (not in requested list)
DELETE FROM subcategories 
WHERE name = 'Because You Watched' 
AND category_id = 'e43f99a5-bd7a-48c2-adfa-66254d08d34f';

-- Update TV Series name to match requested format
UPDATE subcategories 
SET name = 'TV Series'
WHERE name = 'Series Tv' 
AND category_id = 'e43f99a5-bd7a-48c2-adfa-66254d08d34f';

-- Set display order for homepage subcategories
UPDATE subcategories SET display_order = 1 WHERE name = 'New Releases' AND category_id = 'e43f99a5-bd7a-48c2-adfa-66254d08d34f';
UPDATE subcategories SET display_order = 2 WHERE name = 'Fashion Weeks' AND category_id = 'e43f99a5-bd7a-48c2-adfa-66254d08d34f';
UPDATE subcategories SET display_order = 3 WHERE name = 'Keep Watching' AND category_id = 'e43f99a5-bd7a-48c2-adfa-66254d08d34f';
UPDATE subcategories SET display_order = 4 WHERE name = 'Suggested For You' AND category_id = 'e43f99a5-bd7a-48c2-adfa-66254d08d34f';
UPDATE subcategories SET display_order = 5 WHERE name = 'Runway' AND category_id = 'e43f99a5-bd7a-48c2-adfa-66254d08d34f';
UPDATE subcategories SET display_order = 6 WHERE name = 'Interviews' AND category_id = 'e43f99a5-bd7a-48c2-adfa-66254d08d34f';
UPDATE subcategories SET display_order = 7 WHERE name = 'Movies' AND category_id = 'e43f99a5-bd7a-48c2-adfa-66254d08d34f';
UPDATE subcategories SET display_order = 8 WHERE name = 'TV Series' AND category_id = 'e43f99a5-bd7a-48c2-adfa-66254d08d34f';
UPDATE subcategories SET display_order = 9 WHERE name = 'Documentaries' AND category_id = 'e43f99a5-bd7a-48c2-adfa-66254d08d34f';
UPDATE subcategories SET display_order = 10 WHERE name = 'Collections' AND category_id = 'e43f99a5-bd7a-48c2-adfa-66254d08d34f';
