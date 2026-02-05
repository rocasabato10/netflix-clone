import { useState, useEffect } from 'react';
import { X, Play, Info } from 'lucide-react';
import { Designer, Video } from '../types';
import { supabase } from '../lib/supabase';

interface DesignerVideoViewProps {
  designer: Designer;
  onClose: () => void;
  onVideoPlay: (video: Video) => void;
  onVideoInfo: (video: Video) => void;
}

export default function DesignerVideoView({
  designer,
  onClose,
  onVideoPlay,
  onVideoInfo,
}: DesignerVideoViewProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDesignerVideos();
  }, [designer.id]);

  const fetchDesignerVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('designer_id', designer.id)
        .order('year', { ascending: false })
        .order('upload_date', { ascending: false });

      if (!error && data) {
        const mappedVideos: Video[] = data.map((video) => {
          const durationMatch = video.duration?.match(/(\d+):(\d+)/);
          let durationInSeconds = 0;
          if (durationMatch) {
            const minutes = parseInt(durationMatch[1]);
            const seconds = parseInt(durationMatch[2]);
            durationInSeconds = minutes * 60 + seconds;
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
          };
        });

        setVideos(mappedVideos);
      }
    } catch (error) {
      console.error('Error fetching designer videos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-50 p-2 bg-black/80 rounded-full text-white hover:bg-black transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="min-h-screen pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-start gap-8 mb-12">
            <div className="w-48 h-64 rounded-lg overflow-hidden shadow-2xl flex-shrink-0">
              <img
                src={designer.photo_url || 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg'}
                alt={designer.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {designer.name}
              </h1>
              {designer.birth_place && (
                <p className="text-gray-300 text-lg mb-2">
                  <span className="text-gray-500">Born:</span> {designer.birth_place}
                </p>
              )}
              {designer.brands && designer.brands.length > 0 && (
                <p className="text-amber-500 text-lg mb-4">
                  {designer.brands.join(', ')}
                </p>
              )}
              {designer.bio && (
                <p className="text-gray-300 leading-relaxed max-w-3xl">
                  {designer.bio}
                </p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Related videos {videos.length > 0 && `(${videos.length})`}
            </h2>

            {loading ? (
              <div className="text-white text-center py-12">Caricamento...</div>
            ) : videos.length === 0 ? (
              <div className="text-gray-400 text-center py-12">
                Nessun video disponibile per questo designer
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {videos.map((video) => (
                    <div
                      key={video.id}
                      className="group relative bg-neutral-900 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                      <div className="aspect-video relative">
                        <img
                          src={video.thumbnail_url}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center gap-4">
                          <button
                            onClick={() => onVideoPlay(video)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-3 bg-white rounded-full hover:bg-gray-200"
                          >
                            <Play className="w-6 h-6 text-black fill-black" />
                          </button>
                          <button
                            onClick={() => onVideoInfo(video)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-3 bg-neutral-800 rounded-full hover:bg-neutral-700"
                          >
                            <Info className="w-6 h-6 text-white" />
                          </button>
                        </div>
                        {video.duration && (
                          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
                            {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-semibold line-clamp-2 mb-1">
                          {video.title}
                        </h3>
                        {video.description && (
                          <p className="text-gray-400 text-sm line-clamp-2">
                            {video.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
