import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Category, Subcategory, Video } from '../lib/supabase';
import { useSubscription } from '../hooks/useSubscription';
import Header from '../components/Header';
import Hero from '../components/Hero';
import VideoRow from '../components/VideoRow';
import VideoModal from '../components/VideoModal';
import AdBanner from '../components/AdBanner';

export default function HomePage() {
  const { hasAds } = useSubscription();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesRes, subcategoriesRes, videosRes] = await Promise.all([
        supabase.from('categories').select('*').order('order'),
        supabase.from('subcategories').select('*').order('category_id, order'),
        supabase.from('videos').select('*').order('created_at', { ascending: false }),
      ]);

      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (subcategoriesRes.data) setSubcategories(subcategoriesRes.data);
      if (videosRes.data) setVideos(videosRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const featuredVideos = videos.filter((v) => v.featured).slice(0, 5);
  const heroVideos = featuredVideos.length > 0 ? featuredVideos : videos.slice(0, 5);

  const getFilteredSubcategories = () => {
    if (!activeCategory) return subcategories;
    const category = categories.find((c) => c.slug === activeCategory);
    if (!category) return subcategories;
    return subcategories.filter((s) => s.category_id === category.id);
  };

  const getVideosBySubcategory = (subcategoryId: string) => {
    return videos.filter((v) => v.subcategory_id === subcategoryId);
  };

  const filteredSubcategories = getFilteredSubcategories();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading ModaFlix...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header
        onCategoryChange={setActiveCategory}
        categories={categories}
        activeCategory={activeCategory}
      />

      <Hero videos={heroVideos} onPlayClick={setSelectedVideo} />

      <div className="relative z-10 -mt-24 pb-20">
        {hasAds && (
          <div className="px-8 mb-8">
            <AdBanner />
          </div>
        )}

        {filteredSubcategories.map((subcategory) => {
          const subcategoryVideos = getVideosBySubcategory(subcategory.id);
          if (subcategoryVideos.length === 0) return null;
          return (
            <VideoRow
              key={subcategory.id}
              title={subcategory.name}
              videos={subcategoryVideos}
              onVideoClick={setSelectedVideo}
            />
          );
        })}
      </div>

      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </div>
  );
}
