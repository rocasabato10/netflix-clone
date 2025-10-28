import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import type { Category, Subcategory, Video } from './lib/supabase';
import { useAuth } from './contexts/AuthContext';
import { useSubscription } from './hooks/useSubscription';
import Header from './components/Header';
import Hero from './components/Hero';
import VideoRow from './components/VideoRow';
import VideoModal from './components/VideoModal';
import AuthModal from './components/AuthModal';
import SubscriptionModal from './components/SubscriptionModal';
import VideoUpload from './components/VideoUpload';
import AdBanner from './components/AdBanner';

function App() {
  const { user, loading: authLoading } = useAuth();
  const { hasActiveSubscription, hasAds, createSubscription, loading: subLoading } = useSubscription();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
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

  useEffect(() => {
    if (!subLoading && user && !hasActiveSubscription) {
      setShowSubscriptionModal(true);
    }
  }, [subLoading, user, hasActiveSubscription]);

  const handleSubscribe = async (planId: string) => {
    const { error } = await createSubscription(planId);
    if (!error) {
      setShowSubscriptionModal(false);
    } else {
      alert('Errore durante la creazione dell\'abbonamento');
    }
  };

  if (loading || authLoading || subLoading) {
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

  if (!hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-black">
        {showSubscriptionModal && (
          <SubscriptionModal
            onClose={() => setShowSubscriptionModal(false)}
            onSubscribe={handleSubscribe}
          />
        )}
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
        {hasAds && (
          <div className="px-8">
            <AdBanner />
          </div>
        )}

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

      {showUploadModal && (
        <VideoUpload
          onClose={() => setShowUploadModal(false)}
          onUploadComplete={loadData}
        />
      )}

      <button
        onClick={() => setShowUploadModal(true)}
        className="fixed bottom-8 right-8 bg-rose-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-rose-700 transition font-semibold"
      >
        Carica Video
      </button>
    </div>
  );
}

export default App;
