import { useState, useEffect } from 'react';
import { videos as mockVideos } from '../mockData';
import type { Video } from '../types';
import Header from '../components/Header';
import Hero from '../components/Hero';
import VideoRow from '../components/VideoRow';
import VideoModal from '../components/VideoModal';
import VideoDetails from '../components/VideoDetails';
import { SubscriptionPlans } from '../components/SubscriptionPlans';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  category_id: string;
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedVideoForDetails, setSelectedVideoForDetails] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>(mockVideos);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSubscription, setUserSubscription] = useState<string>('free');
  const { user } = useAuth();

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchVideos();
    if (user) {
      fetchUserSubscription();
    }
  }, [user]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (!error && data) {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .order('name');

      if (!error && data) {
        setSubcategories(data);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('upload_date', { ascending: false });

      if (error) {
        console.error('Error fetching videos:', error);
        setVideos(mockVideos);
      } else if (data && data.length > 0) {
        const mappedVideos: Video[] = data.map((video) => {
          const durationMatch = video.duration?.match(/(\d+):(\d+)/);
          let durationInSeconds = 0;
          if (durationMatch) {
            const minutes = parseInt(durationMatch[1]);
            const seconds = parseInt(durationMatch[2]);
            durationInSeconds = (minutes * 60) + seconds;
          }

          return {
            id: video.id,
            title: video.title,
            description: video.description,
            thumbnail_url: video.thumbnail_url,
            video_url: video.video_url,
            duration: durationInSeconds,
            year: 2025,
            subcategory_id: video.subcategory_id || 'general',
            featured: video.views > 30000,
            created_at: video.upload_date,
          };
        });
        setVideos([...mockVideos, ...mappedVideos]);
      } else {
        setVideos(mockVideos);
      }
    } catch (error) {
      console.error('Error:', error);
      setVideos(mockVideos);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSubscription = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('subscription_type')
        .eq('id', user.id)
        .maybeSingle();

      if (!error && data) {
        setUserSubscription(data.subscription_type || 'free');
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const handleSubscriptionSelect = async (planSlug: string) => {
    if (!user) return;
    try {
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);

      const { error } = await supabase
        .from('user_profiles')
        .update({
          subscription_type: planSlug,
          subscription_expires_at: expiresAt.toISOString()
        })
        .eq('id', user.id);

      if (!error) {
        setUserSubscription(planSlug);
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  const featuredVideos = videos.filter((v) => v.featured).slice(0, 5);
  const heroVideos = featuredVideos.length > 0 ? featuredVideos : videos.slice(0, 5);

  const mostViewedVideos = [...videos]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 10);

  const trendingVideos = [...videos]
    .filter(v => {
      const uploadDate = new Date(v.created_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return uploadDate >= thirtyDaysAgo;
    })
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 10);

  const keepWatchingVideos = videos.slice(0, 1);
  const suggestedVideos = videos.filter(v => v.subcategory_id === 'alta-moda').slice(0, 8);
  const newReleasesVideos = [...videos]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);
  const becauseYouWatchedVideos = videos.filter(v => v.subcategory_id === 'fashion-week').slice(0, 8);
  const popularInCountryVideos = videos.filter(v => v.featured).slice(0, 8);
  const fashionWeekHighlights = videos.filter(v => v.subcategory_id === 'fashion-week').slice(0, 8);
  const designerSpotlight = videos.filter(v => v.subcategory_id === 'dietro-le-quinte').slice(0, 8);
  const todaysFeaturedShow = videos.filter(v => v.subcategory_id === 'pret-a-porter').slice(0, 8);

  const getFilteredSubcategories = () => {
    if (!activeCategory) {
      return subcategories;
    }
    const category = categories.find((c) => c.slug === activeCategory);
    if (!category) return [];
    return subcategories.filter((s) => s.category_id === category.id);
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    const subcategory = subcategories.find(s => s.id === subcategoryId);
    if (subcategory) {
      setActiveCategory(null);
      const element = document.getElementById(`subcategory-${subcategoryId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const getVideosBySubcategory = (subcategoryId: string) => {
    const subcategory = subcategories.find(s => s.id === subcategoryId);
    if (!subcategory) return [];

    // Filter videos by both ID and slug to support both database videos and mock videos
    const filtered = videos.filter((v) =>
      v.subcategory_id === subcategoryId || v.subcategory_id === subcategory.slug
    );

    if (activeCategory) {
      return filtered;
    }
    return filtered.slice(0, 10);
  };

  const filteredSubcategories = getFilteredSubcategories();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        onCategoryChange={setActiveCategory}
        categories={categories}
        subcategories={subcategories}
        activeCategory={activeCategory}
        videos={videos}
        onVideoSelect={setSelectedVideo}
        onSubcategorySelect={handleSubcategorySelect}
      />

      {!activeCategory && <Hero videos={heroVideos} onPlayClick={setSelectedVideoForDetails} />}

      <div className={`relative z-10 pb-20 ${!activeCategory ? '-mt-24' : 'pt-32'}`}>
        {!activeCategory && mostViewedVideos.length > 0 && (
          <VideoRow
            title="Top 10 in Italy"
            videos={mostViewedVideos}
            onVideoClick={setSelectedVideo}
            onInfoClick={setSelectedVideoForDetails}
            showRanking={true}
          />
        )}

        {!activeCategory && trendingVideos.length > 0 && (
          <VideoRow
            title="Trending Now"
            videos={trendingVideos}
            onVideoClick={setSelectedVideo}
            onInfoClick={setSelectedVideoForDetails}
          />
        )}

        {!activeCategory && keepWatchingVideos.length > 0 && (
          <VideoRow
            title="Keep Watching"
            videos={keepWatchingVideos}
            onVideoClick={setSelectedVideo}
            onInfoClick={setSelectedVideoForDetails}
          />
        )}

        {!activeCategory && suggestedVideos.length > 0 && (
          <VideoRow
            title="Suggested For You"
            videos={suggestedVideos}
            onVideoClick={setSelectedVideo}
            onInfoClick={setSelectedVideoForDetails}
          />
        )}

        {!activeCategory && newReleasesVideos.length > 0 && (
          <VideoRow
            title="New Releases"
            videos={newReleasesVideos}
            onVideoClick={setSelectedVideo}
            onInfoClick={setSelectedVideoForDetails}
          />
        )}

        {!activeCategory && becauseYouWatchedVideos.length > 0 && (
          <VideoRow
            title="Because You Watched"
            videos={becauseYouWatchedVideos}
            onVideoClick={setSelectedVideo}
            onInfoClick={setSelectedVideoForDetails}
          />
        )}

        {!activeCategory && popularInCountryVideos.length > 0 && (
          <VideoRow
            title="Popular in Your Country"
            videos={popularInCountryVideos}
            onVideoClick={setSelectedVideo}
            onInfoClick={setSelectedVideoForDetails}
          />
        )}

        {!activeCategory && fashionWeekHighlights.length > 0 && (
          <VideoRow
            title="Fashion Week Highlights"
            videos={fashionWeekHighlights}
            onVideoClick={setSelectedVideo}
            onInfoClick={setSelectedVideoForDetails}
          />
        )}

        {!activeCategory && designerSpotlight.length > 0 && (
          <VideoRow
            title="Designer Spotlight"
            videos={designerSpotlight}
            onVideoClick={setSelectedVideo}
            onInfoClick={setSelectedVideoForDetails}
          />
        )}

        {!activeCategory && todaysFeaturedShow.length > 0 && (
          <VideoRow
            title="Today's Featured Show"
            videos={todaysFeaturedShow}
            onVideoClick={setSelectedVideo}
            onInfoClick={setSelectedVideoForDetails}
          />
        )}

        {filteredSubcategories.map((subcategory) => {
          const subcategoryVideos = getVideosBySubcategory(subcategory.id);
          if (subcategoryVideos.length === 0) return null;
          return (
            <div key={subcategory.id} id={`subcategory-${subcategory.id}`}>
              <VideoRow
                title={subcategory.name}
                videos={subcategoryVideos}
                onVideoClick={setSelectedVideo}
                onInfoClick={setSelectedVideoForDetails}
              />
            </div>
          );
        })}
      </div>

      <div className="relative z-10 pb-20">
        <div className="px-8 mt-16">
          <div className="max-w-6xl mx-auto bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
              Scegli il piano perfetto per te
            </h2>
            <p className="text-gray-300 text-center mb-8 text-lg">
              Accedi a contenuti esclusivi di moda con i nostri piani di abbonamento
            </p>

            {user ? (
              <div className="mb-6">
                <div className="bg-blue-600 bg-opacity-20 border border-blue-500 rounded-lg p-4 mb-6 text-center">
                  <p className="text-white">
                    Piano attuale: <span className="font-bold capitalize">{userSubscription}</span>
                  </p>
                </div>
                <SubscriptionPlans
                  onSelectPlan={handleSubscriptionSelect}
                  selectedPlan={userSubscription}
                  showTitle={false}
                />
              </div>
            ) : (
              <div>
                <SubscriptionPlans
                  onSelectPlan={() => {}}
                  showTitle={false}
                />
                <p className="text-center text-gray-300 mt-6">
                  <button className="text-blue-400 hover:text-blue-300 font-medium">
                    Accedi per sottoscrivere un abbonamento
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {selectedVideoForDetails && (
        <VideoDetails
          video={selectedVideoForDetails}
          onClose={() => setSelectedVideoForDetails(null)}
          onPlay={(video) => {
            setSelectedVideoForDetails(null);
            setSelectedVideo(video);
          }}
        />
      )}

      <Footer />
    </div>
  );
}
