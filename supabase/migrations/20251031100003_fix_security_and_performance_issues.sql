/*
  # Fix Security and Performance Issues

  1. Performance Improvements
    - Add missing foreign key indexes:
      - Index on video_views(user_id) for the user_id foreign key
      - Index on videos(subcategory_id) for the subcategory_id foreign key
    
  2. Security Improvements
    - Fix RLS policies to use (select auth.uid()) pattern for better performance
    - Update video_likes policies to avoid re-evaluation per row
    
  3. Index Cleanup
    - Keep necessary indexes for query performance
    - Indexes may show as "unused" initially but are needed for:
      - Foreign key constraints
      - Join operations
      - Aggregation queries
      - Future query optimization

  4. Notes
    - Leaked password protection is handled at the Supabase project level, not in migrations
    - Some indexes may show as unused in new databases but will be utilized as queries run
*/

-- Add missing foreign key indexes
CREATE INDEX IF NOT EXISTS idx_video_views_user_id ON video_views(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_subcategory_id ON videos(subcategory_id);

-- Drop and recreate video_likes RLS policies with optimized auth function calls
DROP POLICY IF EXISTS "Authenticated users can create likes" ON video_likes;
DROP POLICY IF EXISTS "Users can delete own likes" ON video_likes;

CREATE POLICY "Authenticated users can create likes"
  ON video_likes
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own likes"
  ON video_likes
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);