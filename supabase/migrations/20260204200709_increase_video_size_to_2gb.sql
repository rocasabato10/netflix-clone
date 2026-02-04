/*
  # Increase Video Upload Size Limit to 2GB

  1. Changes
    - Update videos bucket to allow files up to 2GB (2147483648 bytes)
    - Previous limit of 500MB was insufficient for high-quality video files

  2. Purpose
    - Support larger, high-quality video uploads
    - 2GB should accommodate most professional video content

  3. Notes
    - Thumbnail limit remains at 10MB
*/

-- Update the videos bucket with increased file size limit (2GB)
UPDATE storage.buckets
SET file_size_limit = 2147483648
WHERE id = 'videos';
