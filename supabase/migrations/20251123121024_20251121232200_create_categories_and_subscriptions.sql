/*
  # Create Categories, Subcategories, User Profiles, and Subscriptions

  1. New Tables
    - `categories`
      - `id` (uuid, primary key) - Unique identifier
      - `name` (text) - Category name (e.g., "Sfilate")
      - `slug` (text, unique) - URL-friendly identifier
      - `created_at` (timestamptz) - Creation timestamp

    - `subcategories`
      - `id` (uuid, primary key) - Unique identifier
      - `name` (text) - Subcategory name
      - `slug` (text, unique) - URL-friendly identifier
      - `category_id` (uuid) - Reference to categories
      - `created_at` (timestamptz) - Creation timestamp

    - `user_profiles`
      - `id` (uuid, primary key) - References auth.users
      - `email` (text) - User email
      - `first_name` (text) - User first name
      - `last_name` (text) - User last name
      - `subscription_type` (text) - 'free', 'base', or 'premium'
      - `subscription_expires_at` (timestamptz) - Subscription expiration
      - `created_at` (timestamptz) - Profile creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `subscription_plans`
      - `id` (uuid, primary key) - Unique identifier
      - `name` (text) - Plan name
      - `slug` (text, unique) - URL-friendly identifier
      - `price` (numeric) - Monthly price
      - `has_ads` (boolean) - Whether plan includes ads
      - `features` (jsonb) - Plan features as JSON
      - `created_at` (timestamptz) - Creation timestamp

  2. Changes to Existing Tables
    - Add `category_id` and `subcategory_id` to `videos` table

  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users to read their own profiles
    - Add policies for all users to read categories, subcategories, and plans
    - Add policies for users to update their own profiles

  4. Initial Data
    - Insert two subscription plans: Base (5.99€) and Premium (9.99€)
    - Insert default categories and subcategories from mockData
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  USING (true);

-- Create subcategories table
CREATE TABLE IF NOT EXISTS subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view subcategories"
  ON subcategories FOR SELECT
  USING (true);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  first_name text DEFAULT '',
  last_name text DEFAULT '',
  subscription_type text DEFAULT 'free' CHECK (subscription_type IN ('free', 'base', 'premium')),
  subscription_expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  price numeric(10, 2) NOT NULL,
  has_ads boolean DEFAULT false,
  features jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view subscription plans"
  ON subscription_plans FOR SELECT
  USING (true);

-- Add category and subcategory columns to videos table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'videos' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE videos ADD COLUMN category_id uuid REFERENCES categories(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'videos' AND column_name = 'subcategory_id'
  ) THEN
    ALTER TABLE videos ADD COLUMN subcategory_id uuid REFERENCES subcategories(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Insert subscription plans
INSERT INTO subscription_plans (name, slug, price, has_ads, features)
VALUES 
  (
    'Base',
    'base',
    5.99,
    true,
    '["Accesso a tutti i contenuti", "Qualità video HD", "Include pubblicità"]'::jsonb
  ),
  (
    'Premium',
    'premium',
    9.99,
    false,
    '["Accesso a tutti i contenuti", "Qualità video HD", "Senza pubblicità", "Download per visualizzazione offline"]'::jsonb
  )
ON CONFLICT (slug) DO NOTHING;

-- Insert categories
INSERT INTO categories (name, slug)
VALUES 
  ('Sfilate', 'sfilate'),
  ('Backstage', 'backstage'),
  ('Interviste', 'interviste'),
  ('Tutorial', 'tutorial')
ON CONFLICT (slug) DO NOTHING;

-- Insert subcategories
INSERT INTO subcategories (name, slug, category_id)
SELECT 'Alta Moda', 'alta-moda', id FROM categories WHERE slug = 'sfilate'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO subcategories (name, slug, category_id)
SELECT 'Prêt-à-Porter', 'pret-a-porter', id FROM categories WHERE slug = 'sfilate'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO subcategories (name, slug, category_id)
SELECT 'Collezioni Resort', 'collezioni-resort', id FROM categories WHERE slug = 'sfilate'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO subcategories (name, slug, category_id)
SELECT 'Fashion Week', 'fashion-week', id FROM categories WHERE slug = 'backstage'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO subcategories (name, slug, category_id)
SELECT 'Dietro le Quinte', 'dietro-le-quinte', id FROM categories WHERE slug = 'backstage'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO subcategories (name, slug, category_id)
SELECT 'Designer', 'designer', id FROM categories WHERE slug = 'interviste'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO subcategories (name, slug, category_id)
SELECT 'Modelle', 'modelle', id FROM categories WHERE slug = 'interviste'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO subcategories (name, slug, category_id)
SELECT 'Make-up', 'make-up', id FROM categories WHERE slug = 'tutorial'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO subcategories (name, slug, category_id)
SELECT 'Styling', 'styling', id FROM categories WHERE slug = 'tutorial'
ON CONFLICT (slug) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS videos_category_id_idx ON videos(category_id);
CREATE INDEX IF NOT EXISTS videos_subcategory_id_idx ON videos(subcategory_id);
CREATE INDEX IF NOT EXISTS subcategories_category_id_idx ON subcategories(category_id);
CREATE INDEX IF NOT EXISTS user_profiles_subscription_type_idx ON user_profiles(subscription_type);

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for user_profiles updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();