import { Play, Info } from 'lucide-react';
import type { Video } from '../lib/supabase';

interface HeroProps {
  video: Video | null;
  onPlayClick: (video: Video) => void;
}

export default function Hero({ video, onPlayClick }: HeroProps) {
  if (!video) return null;

  return (
    <div className="relative h-[80vh] w-full">
      <div className="absolute inset-0">
        <img
          src={video.thumbnail_url}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
      </div>

      <div className="relative h-full flex items-center px-8 md:px-16">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-2xl">
            {video.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 drop-shadow-lg line-clamp-3">
            {video.description}
          </p>
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => onPlayClick(video)}
              className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded font-semibold hover:bg-gray-200 transition"
            >
              <Play className="w-6 h-6 fill-current" />
              Play
            </button>
            <button
              onClick={() => onPlayClick(video)}
              className="flex items-center gap-2 bg-gray-500/70 text-white px-8 py-3 rounded font-semibold hover:bg-gray-500/50 transition backdrop-blur-sm"
            >
              <Info className="w-6 h-6" />
              More Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
