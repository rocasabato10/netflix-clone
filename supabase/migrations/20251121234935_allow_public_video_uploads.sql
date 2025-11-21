/*
  # Allow public video uploads

  1. Changes
    - Drop the restrictive INSERT policy for videos
    - Create new policy that allows anyone to insert videos
    - Make uploaded_by nullable to support anonymous uploads

  2. Security
    - Videos table remains with RLS enabled
    - Anyone can now INSERT videos without authentication
    - SELECT remains public
    - UPDATE/DELETE still restricted to owners
*/

-- Drop existing insert policy
DROP POLICY IF EXISTS "Authenticated users can insert videos" ON videos;

-- Make uploaded_by nullable for anonymous uploads
ALTER TABLE videos ALTER COLUMN uploaded_by DROP NOT NULL;

-- Create new public insert policy
CREATE POLICY "Anyone can insert videos"
  ON videos FOR INSERT
  WITH CHECK (true);
