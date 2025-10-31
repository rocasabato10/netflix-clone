/*
  # Add Subscription Plans and User Subscriptions

  1. New Tables
    - `subscription_plans`
      - `id` (uuid, primary key)
      - `name` (text) - Plan name (e.g., "Basic with Ads", "Premium")
      - `description` (text) - Plan description
      - `price` (numeric) - Monthly price in euros
      - `stripe_price_id` (text) - Stripe Price ID for payment processing
      - `has_ads` (boolean) - Whether this plan includes advertisements
      - `features` (jsonb) - Additional features as JSON
      - `active` (boolean) - Whether plan is currently available
      - `created_at` (timestamptz)
    
    - `user_subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `plan_id` (uuid, foreign key to subscription_plans)
      - `stripe_customer_id` (text) - Stripe Customer ID
      - `stripe_subscription_id` (text) - Stripe Subscription ID
      - `status` (text) - Subscription status (active, canceled, past_due, etc.)
      - `current_period_start` (timestamptz) - Start of current billing period
      - `current_period_end` (timestamptz) - End of current billing period
      - `cancel_at_period_end` (boolean) - Whether subscription will cancel at period end
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on subscription_plans and user_subscriptions tables
    - Public can view available subscription plans
    - Users can only view their own subscriptions
    - Only authenticated users can create/update their subscriptions

  3. Indexes
    - Add index on user_id for user_subscriptions
    - Add index on stripe_customer_id and stripe_subscription_id for webhooks
*/

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

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer ON user_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_subscription ON user_subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);

-- Enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Subscription plans policies (public read for active plans)
CREATE POLICY "Anyone can view active subscription plans"
  ON subscription_plans FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Authenticated users can insert subscription plans"
  ON subscription_plans FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update subscription plans"
  ON subscription_plans FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- User subscriptions policies
CREATE POLICY "Users can view their own subscription"
  ON user_subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription"
  ON user_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
  ON user_subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscription"
  ON user_subscriptions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

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

-- Create trigger for user_subscriptions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_subscriptions_updated_at'
  ) THEN
    CREATE TRIGGER update_user_subscriptions_updated_at
      BEFORE UPDATE ON user_subscriptions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;