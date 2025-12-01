import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xyyiptkoepqefcodfvxc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5eWlwdGtvZXBxZWZjb2RmdnhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODk1MTgsImV4cCI6MjA4MDE2NTUxOH0.h_nPysbDCZBSokfoGuTwbR4PuFOXRP0P7oy2YwZekHo';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      videos: {
        Row: {
          id: string;
          title: string;
          description: string;
          video_url: string;
          thumbnail_url: string;
          duration: string;
          views: number;
          upload_date: string;
          uploaded_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          video_url: string;
          thumbnail_url: string;
          duration?: string;
          views?: number;
          upload_date?: string;
          uploaded_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          video_url?: string;
          thumbnail_url?: string;
          duration?: string;
          views?: number;
          upload_date?: string;
          uploaded_by?: string;
          created_at?: string;
        };
      };
    };
  };
};
