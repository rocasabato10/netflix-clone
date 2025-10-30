import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://udhqanabbpnjlxhxftsn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHFhbmFiYnBuamx4aHhmdHNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NTc4MTcsImV4cCI6MjA3NzQzMzgxN30.7HdB_lclJMi0eKrTubf0eDG1ff8Q-8G89MOPo8APj0U';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

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
