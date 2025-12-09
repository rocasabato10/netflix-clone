/*
  # Fix Security and Performance Issues

  1. RLS Policy Optimization
    - Update RLS policies on `videos` table to use `(select auth.uid())` instead of `auth.uid()`
    - Update RLS policies on `user_profiles` table to use `(select auth.uid())` instead of `auth.uid()`
    - This prevents re-evaluation of auth functions for each row, improving performance at scale

  2. Remove Unused Indexes
    - Drop `videos_uploaded_by_idx` - not being used
    - Drop `subcategories_category_id_idx` - not being used
    - Drop `user_profiles_subscription_type_idx` - not being used

  3. Fix Function Search Path Issues
    - Update `handle_new_user` function with explicit search_path
    - Update `update_updated_at_column` function with explicit search_path
    - This prevents potential security vulnerabilities from search_path manipulation
*/

-- Fix RLS policies on videos table
DROP POLICY IF EXISTS "Users can update own videos" ON videos;
DROP POLICY IF EXISTS "Users can delete own videos" ON videos;

CREATE POLICY "Users can update own videos"
  ON videos FOR UPDATE
  TO authenticated
  USING (uploaded_by = (select auth.uid()))
  WITH CHECK (uploaded_by = (select auth.uid()));

CREATE POLICY "Users can delete own videos"
  ON videos FOR DELETE
  TO authenticated
  USING (uploaded_by = (select auth.uid()));

-- Fix RLS policies on user_profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

-- Remove unused indexes
DROP INDEX IF EXISTS videos_uploaded_by_idx;
DROP INDEX IF EXISTS subcategories_category_id_idx;
DROP INDEX IF EXISTS user_profiles_subscription_type_idx;

-- Fix handle_new_user function with explicit search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, subscription_type)
  VALUES (new.id, new.email, 'free');
  RETURN new;
END;
$$;

-- Fix update_updated_at_column function with explicit search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$;