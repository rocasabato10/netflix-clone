/*
  # Increase Video Upload Size Limit

  1. Changes
    - Update videos bucket to allow files up to 500MB (524288000 bytes)
    - Update thumbnails bucket to allow files up to 10MB (10485760 bytes)

  2. Purpose
    - Allow users to upload larger video files
    - Previous default limit was too restrictive for high-quality videos

  3. Notes
    - 500MB should be sufficient for most video uploads
    - Thumbnails limited to 10MB as they should be smaller image files
*/

-- Update the videos bucket with increased file size limit (500MB)
UPDATE storage.buckets
SET file_size_limit = 524288000
WHERE id = 'videos';

-- Update the thumbnails bucket with reasonable file size limit (10MB)
UPDATE storage.buckets
SET file_size_limit = 10485760
WHERE id = 'thumbnails';
