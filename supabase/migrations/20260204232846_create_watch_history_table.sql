/*
  # Create Watch History Table

  1. New Tables
    - `watch_history`
      - `id` (uuid, primary key) - Unique identifier for the watch history entry
      - `user_id` (uuid, foreign key to auth.users) - The user watching the video
      - `video_id` (uuid, foreign key to videos) - The video being watched
      - `progress_seconds` (integer) - How many seconds into the video the user watched
      - `last_watched_at` (timestamptz) - When the user last watched this video
      - `is_completed` (boolean) - Whether the user finished watching the video
      - `created_at` (timestamptz) - When the record was created
      - `updated_at` (timestamptz) - When the record was last updated

  2. Security
    - Enable RLS on `watch_history` table
    - Add policy for users to read their own watch history
    - Add policy for users to insert their own watch history
    - Add policy for users to update their own watch history
    - Add policy for users to delete their own watch history

  3. Indexes
    - Create index on user_id for faster queries
    - Create unique index on (user_id, video_id) to prevent duplicates
*/

-- Create watch_history table
CREATE TABLE IF NOT EXISTS watch_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id uuid NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  progress_seconds integer DEFAULT 0,
  last_watched_at timestamptz DEFAULT now(),
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS watch_history_user_id_idx ON watch_history(user_id);
CREATE INDEX IF NOT EXISTS watch_history_last_watched_at_idx ON watch_history(last_watched_at DESC);

-- Enable RLS
ALTER TABLE watch_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own watch history"
  ON watch_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own watch history"
  ON watch_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watch history"
  ON watch_history FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own watch history"
  ON watch_history FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);