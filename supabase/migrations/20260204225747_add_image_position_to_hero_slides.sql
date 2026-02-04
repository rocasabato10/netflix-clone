/*
  # Add image position control to hero slides

  1. Changes
    - Add `image_position` column to `hero_slides` table
      - Stores CSS object-position value (e.g., 'center', 'top', 'bottom')
      - Defaults to 'center' for existing slides
      - Allows admin to control which part of the image is visible
  
  2. Purpose
    - Give admins control over image cropping/positioning
    - Ensure important parts of images are always visible
    - Support various aspect ratios and compositions
*/

-- Add image_position column to hero_slides table
ALTER TABLE hero_slides 
ADD COLUMN IF NOT EXISTS image_position text DEFAULT 'center' NOT NULL;

-- Update existing slides to use 'top' position for better visibility
UPDATE hero_slides 
SET image_position = 'top'
WHERE image_position = 'center';

-- Add check constraint for valid position values
ALTER TABLE hero_slides
ADD CONSTRAINT valid_image_position 
CHECK (image_position IN (
  'top', 'center', 'bottom',
  'top left', 'top center', 'top right',
  'center left', 'center center', 'center right',
  'bottom left', 'bottom center', 'bottom right',
  'left', 'right'
));