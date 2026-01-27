import { X } from 'lucide-react';
import type { Video } from '../types';

interface VideoModalProps {
  video: Video | null;
  onClose: () => void;
}

export default function VideoModal({ video, onClose }: VideoModalProps) {
  if (!video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 sm:p-4">
      <div className="relative w-full max-w-5xl bg-black rounded-lg overflow-hidden shadow-2xl max-h-[95vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-black/80 hover:bg-black text-white rounded-full p-2 transition"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="relative aspect-video bg-gray-900">
          <video
            src={video.video_url}
            className="w-full h-full"
            controls
            crossOrigin="anonymous"
            preload="metadata"
            title={video.title}
          >
            Il tuo browser non supporta il tag video.
          </video>
        </div>

        <div className="p-4 sm:p-8 space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{video.title}</h2>
              {video.year && (
                <span className="text-gray-400 text-sm sm:text-base md:text-lg">{video.year}</span>
              )}
            </div>
          </div>

          {video.description && (
            <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
              {video.description}
            </p>
          )}

          {video.duration > 0 && (
            <p className="text-gray-400 text-sm sm:text-base">
              Duration: {Math.floor(video.duration / 60)}m {video.duration % 60}s
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
