import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Category, Subcategory, Video } from '../lib/supabase';
import { useSubscription } from '../hooks/useSubscription';
import Header from '../components/Header';
import Hero from '../components/Hero';
import VideoRow from '../components/VideoRow';
import VideoModal from '../components/VideoModal';
import AdBanner from '../components/AdBanner';
import AuthModal from '../components/AuthModal';
import SubscriptionModal from '../components/SubscriptionModal';

export default function HomePage() {
  const { hasAds, createSubscription } = useSubscription();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [mostViewedIds, setMostViewedIds] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  useEffect(() => {
    loadData();
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('Data loading timeout');
        setLoading(false);
        setError('Timeout loading data. Please refresh the page.');
      }
    }, 10000);
    return () => clearTimeout(timeout);
  }, []);

  const loadData = async () => {
    try {
      const [categoriesRes, subcategoriesRes, videosRes, mostViewedRes] = await Promise.all([
        supabase.from('categories').select('*').order('order'),
        supabase.from('subcategories').select('*').order('category_id, order'),
        supabase.from('videos').select('*').order('created_at', { ascending: false }),
        supabase
          .from('video_views')
          .select('video_id')
          .order('viewed_at', { ascending: false })
          .limit(100),
      ]);

      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (subcategoriesRes.data) setSubcategories(subcategoriesRes.data);
      if (videosRes.data) setVideos(videosRes.data);

      if (mostViewedRes.data) {
        const viewCounts = mostViewedRes.data.reduce((acc: Record<string, number>, view: any) => {
          acc[view.video_id] = (acc[view.video_id] || 0) + 1;
          return acc;
        }, {});

        const sortedByViews = Object.entries(viewCounts)
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .slice(0, 10)
          .map(([videoId]) => videoId);

        setMostViewedIds(sortedByViews);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const featuredVideos = videos.filter((v) => v.featured).slice(0, 5);
  const heroVideos = featuredVideos.length > 0 ? featuredVideos : videos.slice(0, 5);

  const mostViewedVideos = mostViewedIds
    .map((id) => videos.find((v) => v.id === id))
    .filter((v): v is Video => !!v);

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

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              loadData();
            }}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header
        onCategoryChange={setActiveCategory}
        categories={categories}
        activeCategory={activeCategory}
        onAuthClick={() => setShowAuthModal(true)}
      />

      <Hero videos={heroVideos} onPlayClick={setSelectedVideo} />

      <div className="relative z-10 -mt-24 pb-20">
        {hasAds && (
          <div className="px-8 mb-8">
            <AdBanner onUpgradeClick={() => setShowSubscriptionModal(true)} />
          </div>
        )}

        {mostViewedVideos.length > 0 && (
          <VideoRow
            title="Top 10 in Italy"
            videos={mostViewedVideos}
            onVideoClick={setSelectedVideo}
            showRanking={true}
          />
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
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
          onAuthRequired={() => setShowAuthModal(true)}
        />
      )}

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {showSubscriptionModal && (
        <SubscriptionModal
          onClose={() => setShowSubscriptionModal(false)}
          onSubscribe={async (planId) => {
            const { error } = await createSubscription(planId);
            if (!error) {
              setShowSubscriptionModal(false);
            } else {
              alert('Errore durante la creazione dell\'abbonamento');
            }
          }}
        />
      )}
    </div>
  );
}
