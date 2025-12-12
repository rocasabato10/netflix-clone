export interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  duration: number;
  year: number;
  subcategory_id: string;
  featured: boolean;
  created_at: string;
  views?: number;
  designer_id?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
  created_at: string;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  order: number;
  created_at: string;
}

export interface Designer {
  id: string;
  name: string;
  slug: string;
  bio: string;
  birth_date?: string;
  birth_place?: string;
  photo_url?: string;
  brands: string[];
  achievements: string[];
  signature_style?: string;
  created_at: string;
  updated_at: string;
}
