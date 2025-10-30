-- ModaFlix Database Initialization Script
-- This script creates all necessary tables and inserts sample data

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create subcategories table
CREATE TABLE IF NOT EXISTS subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(category_id, slug)
);

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  thumbnail_url text NOT NULL,
  video_url text NOT NULL,
  duration integer DEFAULT 0,
  year integer,
  subcategory_id uuid NOT NULL REFERENCES subcategories(id) ON DELETE CASCADE,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price numeric(10, 2) NOT NULL,
  stripe_price_id text,
  has_ads boolean DEFAULT false,
  features jsonb DEFAULT '[]'::jsonb,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create users table (simplified auth)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  encrypted_password text NOT NULL,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES subscription_plans(id),
  stripe_customer_id text,
  stripe_subscription_id text,
  status text DEFAULT 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create video_views table
CREATE TABLE IF NOT EXISTS video_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  viewed_at timestamptz DEFAULT now() NOT NULL
);

-- Create video_likes table
CREATE TABLE IF NOT EXISTS video_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(video_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_subcategories_slug ON subcategories(category_id, slug);
CREATE INDEX IF NOT EXISTS idx_videos_subcategory ON videos(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_videos_featured ON videos(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer ON user_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_subscription ON user_subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_video_views_video_id ON video_views(video_id);
CREATE INDEX IF NOT EXISTS idx_video_views_viewed_at ON video_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_video_likes_video_id ON video_likes(video_id);
CREATE INDEX IF NOT EXISTS idx_video_likes_user_id ON video_likes(user_id);

-- Insert sample categories
INSERT INTO categories (name, slug, "order") VALUES
  ('Fashion Entertainment', 'fashion-entertainment', 1),
  ('Runway & Collections', 'runway-collections', 2),
  ('Design & Style', 'design-style', 3)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample subcategories
DO $$
DECLARE
  fashion_ent_id uuid;
  runway_id uuid;
  design_id uuid;
BEGIN
  SELECT id INTO fashion_ent_id FROM categories WHERE slug = 'fashion-entertainment';
  SELECT id INTO runway_id FROM categories WHERE slug = 'runway-collections';
  SELECT id INTO design_id FROM categories WHERE slug = 'design-style';

  INSERT INTO subcategories (category_id, name, slug, "order") VALUES
    (fashion_ent_id, 'Fashion Films', 'fashion-films', 1),
    (fashion_ent_id, 'Documentaries', 'documentaries', 2),
    (fashion_ent_id, 'Behind the Scenes', 'behind-the-scenes', 3),
    (runway_id, 'Paris Fashion Week', 'paris-fashion-week', 1),
    (runway_id, 'Milan Fashion Week', 'milan-fashion-week', 2),
    (runway_id, 'New York Fashion Week', 'new-york-fashion-week', 3),
    (design_id, 'Designer Profiles', 'designer-profiles', 1),
    (design_id, 'Style Guides', 'style-guides', 2),
    (design_id, 'Trends', 'trends', 3)
  ON CONFLICT (category_id, slug) DO NOTHING;
END $$;

-- Insert sample videos
DO $$
DECLARE
  fashion_films_id uuid;
  documentaries_id uuid;
  behind_scenes_id uuid;
  paris_fw_id uuid;
  milan_fw_id uuid;
  ny_fw_id uuid;
  designer_profiles_id uuid;
  style_guides_id uuid;
  trends_id uuid;
BEGIN
  SELECT id INTO fashion_films_id FROM subcategories WHERE slug = 'fashion-films';
  SELECT id INTO documentaries_id FROM subcategories WHERE slug = 'documentaries';
  SELECT id INTO behind_scenes_id FROM subcategories WHERE slug = 'behind-the-scenes';
  SELECT id INTO paris_fw_id FROM subcategories WHERE slug = 'paris-fashion-week';
  SELECT id INTO milan_fw_id FROM subcategories WHERE slug = 'milan-fashion-week';
  SELECT id INTO ny_fw_id FROM subcategories WHERE slug = 'new-york-fashion-week';
  SELECT id INTO designer_profiles_id FROM subcategories WHERE slug = 'designer-profiles';
  SELECT id INTO style_guides_id FROM subcategories WHERE slug = 'style-guides';
  SELECT id INTO trends_id FROM subcategories WHERE slug = 'trends';

  INSERT INTO videos (title, description, thumbnail_url, video_url, duration, year, subcategory_id, featured) VALUES
    -- Fashion Films
    ('The Art of Fashion', 'A mesmerizing journey through haute couture', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 3600, 2023, fashion_films_id, true),
    ('Vogue: The Story', 'Behind the scenes of the iconic magazine', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 5400, 2023, fashion_films_id, false),
    ('Fashion Revolution', 'How fashion changed the world', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 4800, 2022, fashion_films_id, false),

    -- Documentaries
    ('Dior and I', 'Inside the iconic fashion house', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 5400, 2023, documentaries_id, false),
    ('The First Monday in May', 'The Met Gala story', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 5100, 2022, documentaries_id, false),
    ('McQueen', 'The life of Alexander McQueen', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 6600, 2023, documentaries_id, false),

    -- Behind the Scenes
    ('Making of Couture', 'Craftsmanship in fashion', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 2700, 2023, behind_scenes_id, false),
    ('Atelier Secrets', 'Inside haute couture workshops', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 3000, 2023, behind_scenes_id, false),
    ('The Fashion Show Process', 'From concept to runway', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 3300, 2022, behind_scenes_id, false),

    -- Paris Fashion Week
    ('Paris FW 2024 Highlights', 'Best moments from Paris', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 4200, 2024, paris_fw_id, false),
    ('Chanel Spring/Summer 2024', 'Complete runway show', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 1800, 2024, paris_fw_id, false),
    ('Louis Vuitton FW 2024', 'Exclusive runway presentation', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 2100, 2024, paris_fw_id, false),

    -- Milan Fashion Week
    ('Milan FW 2024 Highlights', 'Best of Milan', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 3900, 2024, milan_fw_id, false),
    ('Gucci Spring/Summer 2024', 'Complete runway show', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 1950, 2024, milan_fw_id, false),
    ('Prada FW 2024', 'Full runway presentation', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 2250, 2024, milan_fw_id, false),

    -- New York Fashion Week
    ('NYFW 2024 Highlights', 'Best moments from New York', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 3600, 2024, ny_fw_id, false),
    ('Marc Jacobs Spring 2024', 'Complete runway show', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 1800, 2024, ny_fw_id, false),
    ('Tom Ford FW 2024', 'Exclusive presentation', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 2100, 2024, ny_fw_id, false),

    -- Designer Profiles
    ('In Conversation: Virgil Abloh', 'The visionary designer', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 3300, 2023, designer_profiles_id, false),
    ('Coco Chanel: The Legend', 'Life and legacy', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 4500, 2023, designer_profiles_id, false),
    ('Karl Lagerfeld: A Portrait', 'The kaiser of fashion', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 4200, 2022, designer_profiles_id, false),

    -- Style Guides
    ('How to Wear: Tailoring', 'Perfect fit guide', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 1200, 2024, style_guides_id, false),
    ('Seasonal Style Tips', 'Dress for every season', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 1500, 2024, style_guides_id, false),
    ('Accessorizing 101', 'Complete your look', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 1350, 2023, style_guides_id, false),

    -- Trends
    ('2024 Fashion Trends', 'What is hot this year', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 1800, 2024, trends_id, false),
    ('Sustainable Fashion', 'The future of fashion', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 2400, 2024, trends_id, false),
    ('Street Style Evolution', 'How street style changed fashion', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 2100, 2023, trends_id, false);
END $$;

-- Insert default subscription plans
INSERT INTO subscription_plans (name, description, price, has_ads, features, active)
VALUES
  (
    'Basic with Ads',
    'Accedi a tutti i contenuti con pubblicità',
    4.99,
    true,
    '["Accesso illimitato", "Qualità HD", "Pubblicità durante i video"]'::jsonb,
    true
  ),
  (
    'Premium',
    'Esperienza premium senza pubblicità',
    9.99,
    false,
    '["Accesso illimitato", "Qualità HD", "Nessuna pubblicità", "Download offline"]'::jsonb,
    true
  )
ON CONFLICT DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
