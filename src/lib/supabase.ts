import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Category = {
  id: string;
  name: string;
  slug: string;
  order: number;
  created_at: string;
  subcategories?: Subcategory[];
};

export type Subcategory = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  order: number;
  created_at: string;
};

export type Video = {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
  duration: number;
  year: number | null;
  subcategory_id: string;
  featured: boolean;
  created_at: string;
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  stripe_price_id: string | null;
  has_ads: boolean;
  features: string[];
  active: boolean;
  created_at: string;
};

export type UserSubscription = {
  id: string;
  user_id: string;
  plan_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
};

export type VideoView = {
  id: string;
  video_id: string;
  user_id: string | null;
  viewed_at: string;
};

export type VideoLike = {
  id: string;
  video_id: string;
  user_id: string;
  created_at: string;
};

export type VideoWithStats = Video & {
  views_count?: number;
  likes_count?: number;
  user_has_liked?: boolean;
};
