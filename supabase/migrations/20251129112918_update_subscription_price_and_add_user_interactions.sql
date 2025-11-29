/*
  # Update subscription price and add user interactions

  1. Changes to Existing Tables
    - Update base plan price from 5.99 to 6.99
    
  2. New Tables
    - `user_video_likes`
      - `id` (uuid, primary key) - Unique identifier
      - `user_id` (uuid) - References auth.users
      - `video_id` (uuid) - References videos
      - `created_at` (timestamptz) - Creation timestamp
      - Unique constraint on (user_id, video_id)
    
    - `user_video_list`
      - `id` (uuid, primary key) - Unique identifier
      - `user_id` (uuid) - References auth.users
      - `video_id` (uuid) - References videos
      - `created_at` (timestamptz) - Creation timestamp
      - Unique constraint on (user_id, video_id)
  
  3. Changes to Videos Table
    - Add `year` (integer) - Year of production
    - Add `likes_count` (integer) - Total number of likes
  
  4. Security
    - Enable RLS on new tables
    - Add policies for authenticated users to manage their own likes and lists
    - Add policies for counting likes
*/

-- Update subscription plan price
UPDATE subscription_plans
SET price = 6.99
WHERE slug = 'base';

-- Add year and likes_count columns to videos table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'videos' AND column_name = 'year'
  ) THEN
    ALTER TABLE videos ADD COLUMN year integer DEFAULT 2025;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'videos' AND column_name = 'likes_count'
  ) THEN
    ALTER TABLE videos ADD COLUMN likes_count integer DEFAULT 0;
  END IF;
END $$;

-- Create user_video_likes table
CREATE TABLE IF NOT EXISTS user_video_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, video_id)
);

ALTER TABLE user_video_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own likes"
  ON user_video_likes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add own likes"
  ON user_video_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own likes"
  ON user_video_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create user_video_list table (My List)
CREATE TABLE IF NOT EXISTS user_video_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, video_id)
);

ALTER TABLE user_video_list ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own list"
  ON user_video_list FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to own list"
  ON user_video_list FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from own list"
  ON user_video_list FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS user_video_likes_user_id_idx ON user_video_likes(user_id);
CREATE INDEX IF NOT EXISTS user_video_likes_video_id_idx ON user_video_likes(video_id);
CREATE INDEX IF NOT EXISTS user_video_list_user_id_idx ON user_video_list(user_id);
CREATE INDEX IF NOT EXISTS user_video_list_video_id_idx ON user_video_list(video_id);

-- Function to update likes_count when a like is added or removed
CREATE OR REPLACE FUNCTION update_video_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE videos SET likes_count = likes_count + 1 WHERE id = NEW.video_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE videos SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.video_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically update likes_count
DROP TRIGGER IF EXISTS update_likes_count_trigger ON user_video_likes;
CREATE TRIGGER update_likes_count_trigger
  AFTER INSERT OR DELETE ON user_video_likes
  FOR EACH ROW EXECUTE FUNCTION update_video_likes_count();