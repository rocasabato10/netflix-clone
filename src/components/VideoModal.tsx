import { X, Play, Lock, Heart, Eye } from 'lucide-react';
import type { Video } from '../lib/supabase';
import { useSubscription } from '../hooks/useSubscription';
import { useAuth } from '../contexts/AuthContext';
import { useVideoInteractions } from '../hooks/useVideoInteractions';
import AdBanner from './AdBanner';
import { useEffect } from 'react';

interface VideoModalProps {
  video: Video | null;
  onClose: () => void;
  onAuthRequired: () => void;
}

export default function VideoModal({ video, onClose, onAuthRequired }: VideoModalProps) {
  const { hasAds } = useSubscription();
  const { user } = useAuth();
  const { likesCount, viewsCount, hasLiked, recordView, toggleLike } = useVideoInteractions(
    video?.id || ''
  );

  useEffect(() => {
    if (video && user) {
      recordView();
    }
  }, [video?.id, user]);

  if (!video) return null;

  const handleLikeClick = async () => {
    if (!user) {
      onClose();
      onAuthRequired();
      return;
    }
    await toggleLike();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="relative w-full max-w-5xl bg-black rounded-lg overflow-hidden shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/80 hover:bg-black text-white rounded-full p-2 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative aspect-video bg-gray-900">
          {!user ? (
            <>
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                <div className="text-center space-y-6 px-8">
                  <div className="bg-rose-500 rounded-full p-8 inline-block">
                    <Lock className="w-20 h-20 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white">Authentication Required</h3>
                  <p className="text-gray-300 text-lg max-w-md">
                    Please sign in or create an account to watch this video
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onAuthRequired();
                    }}
                    className="bg-white text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-200 transition shadow-xl"
                  >
                    Sign In to Watch
                  </button>
                </div>
              </div>
            </>
          ) : (
            <iframe
              src={video.video_url}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              title={video.title}
            />
          )}
        </div>

        <div className="p-8 space-y-4">
          {hasAds && <AdBanner />}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold text-white">{video.title}</h2>
              {video.year && (
                <span className="text-gray-400 text-lg">{video.year}</span>
              )}
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-400">
                <Eye className="w-5 h-5" />
                <span className="text-lg font-medium">{viewsCount}</span>
              </div>
              <button
                onClick={handleLikeClick}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  hasLiked
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
                <span className="text-lg font-medium">{likesCount}</span>
              </button>
            </div>
          </div>

          {video.description && (
            <p className="text-gray-300 text-lg leading-relaxed">
              {video.description}
            </p>
          )}

          {video.duration > 0 && (
            <p className="text-gray-400">
              Duration: {Math.floor(video.duration / 60)}m {video.duration % 60}s
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
