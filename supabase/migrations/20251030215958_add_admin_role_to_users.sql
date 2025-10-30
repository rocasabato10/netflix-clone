/*
  # Add Admin Role to Users

  1. Changes
    - Add `is_admin` boolean column to auth.users metadata
    - Create function to check if user is admin
    - Set test@modaflix.com as admin user

  2. Security
    - Only admins can access admin panel
    - Function to verify admin status
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'auth'
    AND table_name = 'users'
    AND column_name = 'raw_app_meta_data'
  ) THEN
    RAISE NOTICE 'Column raw_app_meta_data already exists';
  END IF;
END $$;

UPDATE auth.users
SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'::jsonb),
  '{is_admin}',
  'true'
)
WHERE email = 'test@modaflix.com';

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean,
    false
  );
END;
$$;