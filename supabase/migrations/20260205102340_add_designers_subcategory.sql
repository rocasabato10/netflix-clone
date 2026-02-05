/*
  # Add Designers Subcategory to Homepage

  1. Changes
    - Update Collections display_order from 10 to 11
    - Add new "Designers" subcategory with display_order 10 (after Documentaries)
  
  2. Purpose
    - Create a dedicated section to showcase designers on the homepage
    - Display designer profiles with their bio, brands, and related videos
*/

-- Update Collections display order to make room for Designers
UPDATE subcategories 
SET display_order = 11 
WHERE slug = 'collections';

-- Insert Designers subcategory
INSERT INTO subcategories (id, name, slug, category_id, display_order)
SELECT 
  gen_random_uuid(),
  'Designers',
  'designers',
  id,
  10
FROM categories 
WHERE slug = 'homepage'
ON CONFLICT DO NOTHING;