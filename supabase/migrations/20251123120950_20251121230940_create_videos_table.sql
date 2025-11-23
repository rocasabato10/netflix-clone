/*
  # Create videos table and storage setup

  1. New Tables
    - `videos`
      - `id` (uuid, primary key) - Unique identifier for each video
      - `title` (text) - Video title
      - `description` (text) - Video description
      - `video_url` (text) - Path/URL to video file in storage
      - `thumbnail_url` (text) - Path/URL to thumbnail in storage
      - `duration` (text) - Video duration (e.g., "10:30")
      - `views` (integer) - Number of views
      - `upload_date` (timestamptz) - When video was uploaded
      - `uploaded_by` (uuid) - Reference to auth.users
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on `videos` table
    - Add policy for anyone to read videos (public access)
    - Add policy for authenticated users to insert videos
    - Add policy for users to update their own videos
    - Add policy for users to delete their own videos

  3. Storage
    - Storage buckets will be created via Supabase Dashboard
    - Buckets needed: 'videos' and 'thumbnails'
*/

CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  video_url text NOT NULL,
  thumbnail_url text NOT NULL,
  duration text DEFAULT '0:00',
  views integer DEFAULT 0,
  upload_date timestamptz DEFAULT now(),
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view videos"
  ON videos FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert videos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update own videos"
  ON videos FOR UPDATE
  TO authenticated
  USING (auth.uid() = uploaded_by)
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete own videos"
  ON videos FOR DELETE
  TO authenticated
  USING (auth.uid() = uploaded_by);

CREATE INDEX IF NOT EXISTS videos_upload_date_idx ON videos(upload_date DESC);
CREATE INDEX IF NOT EXISTS videos_uploaded_by_idx ON videos(uploaded_by);