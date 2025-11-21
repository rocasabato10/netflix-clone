import { X } from 'lucide-react';
import type { Video } from '../types';

interface VideoModalProps {
  video: Video | null;
  onClose: () => void;
}

export default function VideoModal({ video, onClose }: VideoModalProps) {
  if (!video) return null;

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
          <iframe
            src={video.video_url}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            title={video.title}
          />
        </div>

        <div className="p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold text-white">{video.title}</h2>
              {video.year && (
                <span className="text-gray-400 text-lg">{video.year}</span>
              )}
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
