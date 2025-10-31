/*
  # Add Video Views and Likes Tracking

  1. New Tables
    - `video_views`
      - `id` (uuid, primary key)
      - `video_id` (uuid, references videos)
      - `user_id` (uuid, references auth.users, nullable for anonymous views)
      - `viewed_at` (timestamptz)
    
    - `video_likes`
      - `id` (uuid, primary key)
      - `video_id` (uuid, references videos)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - Unique constraint on (video_id, user_id)

  2. Security
    - Enable RLS on both tables
    - Users can view all views/likes
    - Only authenticated users can create likes
    - Anyone can record views
    - Users can only delete their own likes

  3. Notes
    - Views are tracked for both authenticated and anonymous users
    - Likes require authentication
    - One like per user per video
*/

CREATE TABLE IF NOT EXISTS video_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  viewed_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS video_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(video_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_video_views_video_id ON video_views(video_id);
CREATE INDEX IF NOT EXISTS idx_video_views_viewed_at ON video_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_video_likes_video_id ON video_likes(video_id);
CREATE INDEX IF NOT EXISTS idx_video_likes_user_id ON video_likes(user_id);

ALTER TABLE video_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view video views"
  ON video_views
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create video views"
  ON video_views
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view video likes"
  ON video_likes
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create likes"
  ON video_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
  ON video_likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);