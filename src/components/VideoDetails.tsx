import { X, Play, Plus, ThumbsUp, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Video } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface VideoDetailsProps {
  video: Video | null;
  onClose: () => void;
  onPlay: (video: Video) => void;
}

export default function VideoDetails({ video, onClose, onPlay }: VideoDetailsProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isInList, setIsInList] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (video && user) {
      checkUserInteractions();
      fetchLikesCount();
    } else if (video) {
      fetchLikesCount();
    }
  }, [video, user]);

  const fetchLikesCount = async () => {
    if (!video) return;
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('likes_count')
        .eq('id', video.id)
        .maybeSingle();

      if (!error && data) {
        setLikesCount(data.likes_count || 0);
      }
    } catch (error) {
      console.error('Error fetching likes count:', error);
    }
  };

  const checkUserInteractions = async () => {
    if (!video || !user) return;

    try {
      const [likesResult, listResult] = await Promise.all([
        supabase
          .from('user_video_likes')
          .select('id')
          .eq('user_id', user.id)
          .eq('video_id', video.id)
          .maybeSingle(),
        supabase
          .from('user_video_list')
          .select('id')
          .eq('user_id', user.id)
          .eq('video_id', video.id)
          .maybeSingle()
      ]);

      setIsLiked(!!likesResult.data);
      setIsInList(!!listResult.data);
    } catch (error) {
      console.error('Error checking user interactions:', error);
    }
  };

  const toggleLike = async () => {
    if (!user || !video || loading) return;

    setLoading(true);
    try {
      if (isLiked) {
        const { error } = await supabase
          .from('user_video_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('video_id', video.id);

        if (!error) {
          setIsLiked(false);
          setLikesCount(prev => Math.max(0, prev - 1));
        }
      } else {
        const { error } = await supabase
          .from('user_video_likes')
          .insert({ user_id: user.id, video_id: video.id });

        if (!error) {
          setIsLiked(true);
          setLikesCount(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleList = async () => {
    if (!user || !video || loading) return;

    setLoading(true);
    try {
      if (isInList) {
        const { error } = await supabase
          .from('user_video_list')
          .delete()
          .eq('user_id', user.id)
          .eq('video_id', video.id);

        if (!error) {
          setIsInList(false);
        }
      } else {
        const { error } = await supabase
          .from('user_video_list')
          .insert({ user_id: user.id, video_id: video.id });

        if (!error) {
          setIsInList(true);
        }
      }
    } catch (error) {
      console.error('Error toggling list:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-black rounded-lg overflow-hidden shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/80 hover:bg-black text-white rounded-full p-2 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative aspect-video bg-gray-900">
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
            <h2 className="text-4xl font-bold text-white drop-shadow-lg">{video.title}</h2>

            <div className="flex items-center gap-4">
              <button
                onClick={() => onPlay(video)}
                className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black font-semibold px-8 py-3 rounded-md transition"
              >
                <Play className="w-6 h-6 fill-current" />
                <span className="text-lg">Play</span>
              </button>

              {user && (
                <>
                  <button
                    onClick={toggleList}
                    disabled={loading}
                    className="flex items-center justify-center bg-gray-800/90 hover:bg-gray-700 text-white w-12 h-12 rounded-full border-2 border-gray-500 transition disabled:opacity-50"
                    title={isInList ? "Rimuovi dalla mia lista" : "Aggiungi alla mia lista"}
                  >
                    {isInList ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                  </button>

                  <button
                    onClick={toggleLike}
                    disabled={loading}
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition disabled:opacity-50 ${
                      isLiked
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-gray-800/90 hover:bg-gray-700 text-white border-gray-500'
                    }`}
                    title={isLiked ? "Rimuovi mi piace" : "Mi piace"}
                  >
                    <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex items-center gap-4 text-white">
            {video.year && (
              <span className="text-lg font-semibold text-green-400">{video.year}</span>
            )}
            {video.duration > 0 && (
              <span className="text-gray-400">
                {Math.floor(video.duration / 60)} min {video.duration % 60} sec
              </span>
            )}
            {likesCount > 0 && (
              <div className="flex items-center gap-2 text-gray-400">
                <ThumbsUp className="w-4 h-4" />
                <span>{likesCount} {likesCount === 1 ? 'mi piace' : 'mi piace'}</span>
              </div>
            )}
          </div>

          {video.description && (
            <div>
              <p className="text-gray-300 text-lg leading-relaxed">
                {video.description}
              </p>
            </div>
          )}

          {!user && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm">
                Accedi per aggiungere questo contenuto alla tua lista e mettere mi piace
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
