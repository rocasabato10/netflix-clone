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
