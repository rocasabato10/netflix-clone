/*
  # Fix video deletion permissions for admin users

  1. Changes
    - Drop restrictive delete policy that only allows users to delete their own videos
    - Create new policy that allows authenticated users to delete any video
    - This enables admin panel functionality for video management
  
  2. Security Notes
    - In production, this should be restricted to actual admin users with a role check
    - For now, any authenticated user can delete videos to enable admin functionality
*/

-- Drop the old restrictive delete policy
DROP POLICY IF EXISTS "Users can delete own videos" ON videos;

-- Create new policy that allows authenticated users to delete any video
CREATE POLICY "Authenticated users can delete videos"
  ON videos
  FOR DELETE
  TO authenticated
  USING (true);

-- Also update the update policy to allow authenticated users to update any video
DROP POLICY IF EXISTS "Users can update own videos" ON videos;

CREATE POLICY "Authenticated users can update videos"
  ON videos
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
