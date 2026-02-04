import { useState, useEffect } from 'react';
import { videos as mockVideos } from '../mockData';
import type { Video, Designer } from '../types';
import Header from '../components/Header';
import Hero from '../components/Hero';
import VideoRow from '../components/VideoRow';
import KeepWatchingRow from '../components/KeepWatchingRow';
import VideoModal from '../components/VideoModal';
import VideoDetails from '../components/VideoDetails';
import { SubscriptionPlans } from '../components/SubscriptionPlans';
import Footer from '../components/Footer';
import DesignerGrid from '../components/DesignerGrid';
import DesignerRow from '../components/DesignerRow';
import DesignerVideoView from '../components/DesignerVideoView';
import CollectionRow, { Collection } from '../components/CollectionRow';
import CollectionView from '../components/CollectionView';
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
  display_order?: number;
}

interface WatchHistoryVideo extends Video {
  progress_seconds: number;
  last_watched_at: string;
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedVideoForDetails, setSelectedVideoForDetails] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>(mockVideos);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [selectedDesigner, setSelectedDesigner] = useState<Designer | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [watchHistory, setWatchHistory] = useState<WatchHistoryVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSubscription, setUserSubscription] = useState<string>('free');
  const { user } = useAuth();

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchVideos();
    fetchDesigners();
    fetchCollections();
    if (user) {
      fetchUserSubscription();
      fetchWatchHistory();
    }
  }, [user]);

  useEffect(() => {
    if (user && !selectedVideo) {
      fetchWatchHistory();
    }
  }, [selectedVideo, user]);

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
        .order('display_order', { ascending: true })
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

  const fetchDesigners = async () => {
    try {
      const { data, error } = await supabase
        .from('designers')
        .select('*')
        .order('name');

      if (!error && data) {
        const mappedDesigners: Designer[] = data.map((designer) => ({
          id: designer.id,
          name: designer.name,
          slug: designer.slug,
          photo_url: designer.photo_url,
          bio: designer.bio,
          birth_date: designer.birth_date,
          birth_place: designer.birth_place,
          brands: designer.brands || [],
          achievements: designer.achievements || [],
          signature_style: designer.signature_style,
          created_at: designer.created_at,
          updated_at: designer.updated_at,
        }));
        setDesigners(mappedDesigners);
      }
    } catch (error) {
      console.error('Error fetching designers:', error);
    }
  };

  const fetchCollections = async () => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('display_order', { ascending: true })
        .order('year', { ascending: false });

      if (!error && data) {
        setCollections(data);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const fetchWatchHistory = async () => {
    if (!user) return;

    try {
      const { data: historyData, error } = await supabase
        .from('watch_history')
        .select('video_id, progress_seconds, last_watched_at')
        .eq('user_id', user.id)
        .eq('is_completed', false)
        .order('last_watched_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching watch history:', error);
        return;
      }

      if (!historyData || historyData.length === 0) {
        setWatchHistory([]);
        return;
      }

      const videoIds = historyData.map(h => h.video_id);
      const { data: videosData, error: videosError } = await supabase
        .from('videos')
        .select('*')
        .in('id', videoIds);

      if (videosError) {
        console.error('Error fetching videos for watch history:', videosError);
        return;
      }

      const historyVideos: WatchHistoryVideo[] = historyData
        .map(history => {
          const video = videosData?.find(v => v.id === history.video_id);
          if (!video) return null;

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
            year: video.year || 2025,
            subcategory_id: video.subcategory_id || 'general',
            featured: video.views > 30000,
            created_at: video.upload_date,
            progress_seconds: history.progress_seconds,
            last_watched_at: history.last_watched_at,
          };
        })
        .filter((v): v is WatchHistoryVideo => v !== null);

      setWatchHistory(historyVideos);
    } catch (error) {
      console.error('Error fetching watch history:', error);
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


  const getFilteredSubcategories = () => {
    if (!activeCategory) {
      const homepageCategory = categories.find((c) => c.slug === 'homepage');
      if (homepageCategory) {
        return subcategories.filter((s) => s.category_id === homepageCategory.id);
      }
      return [];
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
    <div className="min-h-screen bg-black">
      <Header
        onCategoryChange={setActiveCategory}
        categories={categories}
        subcategories={subcategories}
        activeCategory={activeCategory}
        videos={videos}
        onVideoSelect={setSelectedVideo}
        onSubcategorySelect={handleSubcategorySelect}
      />

      {!activeCategory && <Hero />}

      <div className={`relative z-10 pb-20 ${!activeCategory ? 'mt-0' : 'pt-32'}`}>
        {user && watchHistory.length > 0 && (
          <KeepWatchingRow
            title="Continua a guardare"
            videos={watchHistory}
            onVideoClick={setSelectedVideo}
            onInfoClick={setSelectedVideoForDetails}
          />
        )}

        {filteredSubcategories.map((subcategory) => {
          if (subcategory.slug === 'designers') {
            return (
              <div key={subcategory.id} id={`subcategory-${subcategory.id}`}>
                <DesignerGrid />
              </div>
            );
          }

          if (subcategory.slug === 'runway') {
            return (
              <div key={subcategory.id} id={`subcategory-${subcategory.id}`}>
                <DesignerRow
                  title={subcategory.name}
                  designers={designers}
                  onDesignerClick={setSelectedDesigner}
                  onViewAll={() => {}}
                />
              </div>
            );
          }

          if (subcategory.slug === 'collections') {
            return (
              <div key={subcategory.id} id={`subcategory-${subcategory.id}`}>
                <CollectionRow
                  title={subcategory.name}
                  collections={collections}
                  onCollectionClick={setSelectedCollection}
                />
              </div>
            );
          }

          const subcategoryVideos = getVideosBySubcategory(subcategory.id);
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

      {selectedDesigner && (
        <DesignerVideoView
          designer={selectedDesigner}
          onClose={() => setSelectedDesigner(null)}
          onVideoPlay={(video) => {
            setSelectedDesigner(null);
            setSelectedVideo(video);
          }}
          onVideoInfo={(video) => {
            setSelectedDesigner(null);
            setSelectedVideoForDetails(video);
          }}
        />
      )}

      {selectedCollection && (
        <CollectionView
          collection={selectedCollection}
          onClose={() => setSelectedCollection(null)}
          onVideoPlay={(video) => {
            setSelectedCollection(null);
            setSelectedVideo(video);
          }}
          onVideoInfo={(video) => {
            setSelectedCollection(null);
            setSelectedVideoForDetails(video);
          }}
        />
      )}

      <Footer />
    </div>
  );
}
