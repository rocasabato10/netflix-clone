import { useState, useEffect } from 'react';
import { X, Play, Info } from 'lucide-react';
import { Video } from '../types';
import { supabase } from '../lib/supabase';
import { Collection } from './CollectionRow';

interface CollectionViewProps {
  collection: Collection;
  onClose: () => void;
  onVideoPlay: (video: Video) => void;
  onVideoInfo: (video: Video) => void;
}

export default function CollectionView({
  collection,
  onClose,
  onVideoPlay,
  onVideoInfo,
}: CollectionViewProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [designerName, setDesignerName] = useState<string>('');

  useEffect(() => {
    fetchCollectionVideos();
    fetchDesignerInfo();
  }, [collection.id]);

  const fetchDesignerInfo = async () => {
    if (!collection.designer_id) return;

    try {
      const { data, error } = await supabase
        .from('designers')
        .select('name')
        .eq('id', collection.designer_id)
        .maybeSingle();

      if (!error && data) {
        setDesignerName(data.name);
      }
    } catch (error) {
      console.error('Error fetching designer info:', error);
    }
  };

  const fetchCollectionVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('collection_id', collection.id)
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
            year: video.year || collection.year,
            subcategory_id: video.subcategory_id || 'general',
            featured: video.views > 30000,
            created_at: video.upload_date,
          };
        });

        setVideos(mappedVideos);

        const years = [...new Set(mappedVideos.map((v) => v.year))].sort((a, b) => b - a);
        setAvailableYears(years);
        if (years.length > 0 && !selectedYear) {
          setSelectedYear(years[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching collection videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos = selectedYear
    ? videos.filter((v) => v.year === selectedYear)
    : videos;

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
          <div className="mb-12">
            {collection.thumbnail_url && (
              <div className="w-full h-96 rounded-lg overflow-hidden shadow-2xl mb-8">
                <img
                  src={collection.thumbnail_url}
                  alt={collection.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div>
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  {collection.name}
                </h1>
                <span className="text-2xl text-gray-400">
                  {collection.year}
                </span>
              </div>

              {designerName && (
                <p className="text-amber-500 text-xl mb-4">
                  {designerName}
                </p>
              )}

              {collection.season && (
                <p className="text-gray-400 text-lg mb-4 capitalize">
                  {collection.season}
                </p>
              )}

              {collection.description && (
                <p className="text-gray-300 text-lg leading-relaxed max-w-4xl">
                  {collection.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-6">Video della Collezione</h2>

              {loading ? (
                <div className="text-white text-center py-12">Caricamento...</div>
              ) : filteredVideos.length === 0 ? (
                <div className="text-gray-400 text-center py-12">
                  Nessun video disponibile per questa collezione
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVideos.map((video) => (
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

            {availableYears.length > 1 && (
              <div className="w-48 flex-shrink-0">
                <h3 className="text-xl font-bold text-white mb-4">Anni</h3>
                <div className="space-y-2">
                  {availableYears.map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                        selectedYear === year
                          ? 'bg-amber-600 text-white font-semibold'
                          : 'bg-neutral-900 text-gray-300 hover:bg-neutral-800'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
