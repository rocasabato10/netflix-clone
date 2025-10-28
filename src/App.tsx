import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import type { Category, Subcategory, Video } from './lib/supabase';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import VideoRow from './components/VideoRow';
import VideoModal from './components/VideoModal';
import AuthModal from './components/AuthModal';

function App() {
  const { user, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesRes, subcategoriesRes, videosRes] = await Promise.all([
        supabase.from('categories').select('*').order('order'),
        supabase.from('subcategories').select('*').order('order'),
        supabase.from('videos').select('*'),
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

  const featuredVideo = videos.find((v) => v.featured) || videos[0] || null;

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

  useEffect(() => {
    if (!authLoading && !user) {
      setShowAuthModal(true);
    }
  }, [authLoading, user]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading ModaFlix...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black">
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
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

      <Hero video={featuredVideo} onPlayClick={setSelectedVideo} />

      <div className="relative z-10 -mt-32 space-y-8 pb-16">
        {filteredSubcategories.map((subcategory) => {
          const subcategoryVideos = getVideosBySubcategory(subcategory.id);
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

export default App;
