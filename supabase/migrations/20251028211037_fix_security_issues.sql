/*
  # Fix Security and Performance Issues

  1. Performance Improvements
    - Add missing foreign key index for plan_id
    - Remove unused indexes
    - Fix RLS policies to use (select auth.uid()) for better performance
    
  2. Security
    - Fix function search paths to prevent search_path mutable issues
    
  3. Changes
    - Add index on user_subscriptions(plan_id)
    - Drop unused indexes
    - Recreate RLS policies with optimized auth function calls
    - Update function search paths
*/

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_plan_id 
ON user_subscriptions(plan_id);

DROP INDEX IF EXISTS idx_user_subscriptions_stripe_customer;
DROP INDEX IF EXISTS idx_user_subscriptions_stripe_subscription;
DROP INDEX IF EXISTS idx_user_subscriptions_status;
DROP INDEX IF EXISTS idx_videos_subcategory;
DROP INDEX IF EXISTS idx_videos_featured;

DROP POLICY IF EXISTS "Users can view their own subscription" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can insert their own subscription" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscription" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can delete their own subscription" ON user_subscriptions;

CREATE POLICY "Users can view their own subscription"
  ON user_subscriptions FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert their own subscription"
  ON user_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own subscription"
  ON user_subscriptions FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete their own subscription"
  ON user_subscriptions FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  RETURN COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean,
    false
  );
END;
$$;
