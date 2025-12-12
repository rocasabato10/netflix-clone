import { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Award, Palette, Building2 } from 'lucide-react';
import { Designer, Video } from '../types';
import { supabase } from '../lib/supabase';
import VideoRow from './VideoRow';

interface DesignerCardProps {
  designer: Designer;
}

export default function DesignerCard({ designer }: DesignerCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadDesignerVideos();
    }
  }, [isOpen, designer.id]);

  const loadDesignerVideos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('designer_id', designer.id)
        .order('views', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error loading designer videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="group cursor-pointer bg-neutral-900 rounded-lg overflow-hidden hover:ring-2 hover:ring-amber-500 transition-all duration-300"
      >
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={designer.photo_url || 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg'}
            alt={designer.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-white mb-1">{designer.name}</h3>
          {designer.birth_place && (
            <p className="text-sm text-neutral-400">{designer.birth_place}</p>
          )}
          {designer.brands && designer.brands.length > 0 && (
            <p className="text-xs text-amber-500 mt-2">{designer.brands[0]}</p>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8">
            <div className="max-w-6xl mx-auto bg-neutral-900 rounded-lg shadow-2xl">
              <div className="relative">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
                >
                  <X className="w-6 h-6 text-white" />
                </button>

                <div className="grid md:grid-cols-3 gap-8 p-8">
                  <div className="md:col-span-1">
                    <div className="sticky top-8">
                      <img
                        src={designer.photo_url || 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg'}
                        alt={designer.name}
                        className="w-full rounded-lg shadow-xl mb-6"
                      />

                      <div className="space-y-4">
                        {designer.birth_date && (
                          <div className="flex items-start gap-3 text-neutral-300">
                            <Calendar className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs text-neutral-500 uppercase">Born</p>
                              <p>{formatDate(designer.birth_date)}</p>
                            </div>
                          </div>
                        )}

                        {designer.birth_place && (
                          <div className="flex items-start gap-3 text-neutral-300">
                            <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs text-neutral-500 uppercase">Birthplace</p>
                              <p>{designer.birth_place}</p>
                            </div>
                          </div>
                        )}

                        {designer.brands && designer.brands.length > 0 && (
                          <div className="flex items-start gap-3 text-neutral-300">
                            <Building2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs text-neutral-500 uppercase">Brands</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {designer.brands.map((brand, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-amber-500 bg-opacity-20 text-amber-500 rounded text-sm"
                                  >
                                    {brand}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-8">
                    <div>
                      <h1 className="text-4xl font-bold text-white mb-6">{designer.name}</h1>

                      <div className="prose prose-invert max-w-none">
                        <h2 className="text-2xl font-semibold text-amber-500 mb-3 flex items-center gap-2">
                          <Award className="w-6 h-6" />
                          Biography
                        </h2>
                        <p className="text-neutral-300 leading-relaxed whitespace-pre-line">
                          {designer.bio}
                        </p>
                      </div>
                    </div>

                    {designer.achievements && designer.achievements.length > 0 && (
                      <div>
                        <h2 className="text-2xl font-semibold text-amber-500 mb-3 flex items-center gap-2">
                          <Award className="w-6 h-6" />
                          Achievements
                        </h2>
                        <ul className="space-y-2">
                          {designer.achievements.map((achievement, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-neutral-300">
                              <span className="text-amber-500 mt-1">•</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {designer.signature_style && (
                      <div>
                        <h2 className="text-2xl font-semibold text-amber-500 mb-3 flex items-center gap-2">
                          <Palette className="w-6 h-6" />
                          Signature Style
                        </h2>
                        <p className="text-neutral-300 leading-relaxed">
                          {designer.signature_style}
                        </p>
                      </div>
                    )}

                    <div>
                      <h2 className="text-2xl font-semibold text-amber-500 mb-4">
                        Related Videos ({videos.length})
                      </h2>
                      {loading ? (
                        <div className="text-center py-8">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                        </div>
                      ) : videos.length > 0 ? (
                        <div className="space-y-4">
                          {videos.map((video) => (
                            <VideoRow key={video.id} video={video} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-neutral-500 text-center py-8">
                          No videos available for this designer yet.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
