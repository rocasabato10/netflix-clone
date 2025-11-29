/*
  # Fix RLS Policies and Security Issues

  1. RLS Policy Optimization
    - Update all RLS policies to use `(select auth.uid())` instead of `auth.uid()`
    - This prevents re-evaluation of auth functions for each row, improving performance

  2. Function Security
    - Add search_path to security definer functions to prevent search path attacks

  3. Notes
    - Unused indexes are kept as they will be needed when the application scales
    - They don't impact performance negatively and are good for future queries
*/

-- Drop existing policies and recreate with optimized auth function calls

-- user_profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

-- videos policies (if they exist)
DROP POLICY IF EXISTS "Users can update own videos" ON videos;
CREATE POLICY "Users can update own videos"
  ON videos FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = uploaded_by)
  WITH CHECK ((select auth.uid()) = uploaded_by);

DROP POLICY IF EXISTS "Users can delete own videos" ON videos;
CREATE POLICY "Users can delete own videos"
  ON videos FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = uploaded_by);

-- user_video_likes policies
DROP POLICY IF EXISTS "Users can view own likes" ON user_video_likes;
CREATE POLICY "Users can view own likes"
  ON user_video_likes FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can add own likes" ON user_video_likes;
CREATE POLICY "Users can add own likes"
  ON user_video_likes FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can remove own likes" ON user_video_likes;
CREATE POLICY "Users can remove own likes"
  ON user_video_likes FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- user_video_list policies
DROP POLICY IF EXISTS "Users can view own list" ON user_video_list;
CREATE POLICY "Users can view own list"
  ON user_video_list FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can add to own list" ON user_video_list;
CREATE POLICY "Users can add to own list"
  ON user_video_list FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can remove from own list" ON user_video_list;
CREATE POLICY "Users can remove from own list"
  ON user_video_list FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Fix function search paths to prevent security vulnerabilities
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_video_likes_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;