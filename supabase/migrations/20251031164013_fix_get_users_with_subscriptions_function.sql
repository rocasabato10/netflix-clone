/*
  # Fix get_users_with_subscriptions function
  
  1. Changes
    - Drop and recreate the get_users_with_subscriptions function
    - Fix the return type mismatch for email column (varchar vs text)
    - Ensure the function returns the correct data types matching the database schema
*/

DROP FUNCTION IF EXISTS get_users_with_subscriptions();

CREATE OR REPLACE FUNCTION get_users_with_subscriptions()
RETURNS TABLE(
  user_id uuid,
  email character varying(255),
  created_at timestamp with time zone,
  plan_name text,
  has_ads boolean,
  status text,
  current_period_end timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id as user_id,
    u.email::character varying(255),
    u.created_at,
    sp.name as plan_name,
    sp.has_ads,
    us.status,
    us.current_period_end
  FROM auth.users u
  LEFT JOIN user_subscriptions us ON u.id = us.user_id
  LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
  ORDER BY u.created_at DESC;
END;
$$;
