import { useState, useEffect } from 'react';
import { categories, subcategories } from '../mockData';
import type { Video } from '../types';
import Header from '../components/Header';
import Hero from '../components/Hero';
import VideoRow from '../components/VideoRow';
import VideoModal from '../components/VideoModal';
import { supabase } from '../lib/supabase';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('upload_date', { ascending: false });

      if (error) {
        console.error('Error fetching videos:', error);
        setVideos([]);
      } else {
        const mappedVideos: Video[] = (data || []).map((video) => ({
          id: video.id,
          title: video.title,
          description: video.description,
          thumbnail: video.thumbnail_url,
          videoUrl: video.video_url,
          duration: video.duration,
          views: video.views.toString(),
          uploadDate: new Date(video.upload_date).toLocaleDateString('it-IT'),
          subcategory_id: 'general',
          featured: false,
        }));
        setVideos(mappedVideos);
      }
    } catch (error) {
      console.error('Error:', error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const featuredVideos = videos.filter((v) => v.featured).slice(0, 5);
  const heroVideos = featuredVideos.length > 0 ? featuredVideos : videos.slice(0, 5);

  const mostViewedVideos = [...videos]
    .sort((a, b) => parseInt(b.views) - parseInt(a.views))
    .slice(0, 10);

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
        <div className="text-white text-2xl">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header
        onCategoryChange={setActiveCategory}
        categories={categories}
        activeCategory={activeCategory}
        videos={videos}
        onVideoSelect={setSelectedVideo}
      />

      <Hero videos={heroVideos} onPlayClick={setSelectedVideo} />

      <div className="relative z-10 -mt-24 pb-20">
        {mostViewedVideos.length > 0 && (
          <VideoRow
            title="Top 10 in Italy"
            videos={mostViewedVideos}
            onVideoClick={setSelectedVideo}
            showRanking={true}
          />
        )}

        {videos.length > 0 && (
          <VideoRow
            title="Tutti i Video"
            videos={videos}
            onVideoClick={setSelectedVideo}
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

        {videos.length === 0 && (
          <div className="text-center text-gray-400 py-20">
            <p className="text-xl">Nessun video disponibile</p>
            <p className="mt-2">Accedi come amministratore per caricare i primi video</p>
          </div>
        )}
      </div>

      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
}
