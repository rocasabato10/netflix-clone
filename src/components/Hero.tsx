import { Play, Info, Sparkles } from 'lucide-react';
import type { Video } from '../lib/supabase';

interface HeroProps {
  video: Video | null;
  onPlayClick: (video: Video) => void;
}

export default function Hero({ video, onPlayClick }: HeroProps) {
  if (!video) return null;

  return (
    <div className="relative h-[90vh] w-full">
      <div className="absolute inset-0">
        <img
          src={video.thumbnail_url}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
      </div>

      <div className="relative h-full flex flex-col justify-end px-8 md:px-16 pb-32">
        <div className="max-w-3xl space-y-6">
          <div className="flex items-center gap-2 text-rose-500">
            <Sparkles className="w-6 h-6" />
            <span className="text-sm font-semibold uppercase tracking-wider">Featured</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white drop-shadow-2xl leading-tight">
            {video.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 drop-shadow-lg line-clamp-3 max-w-2xl">
            {video.description}
          </p>
          <div className="flex items-center gap-3 text-sm text-gray-300">
            {video.year && <span className="font-medium">{video.year}</span>}
            {video.duration && (
              <>
                <span className="text-gray-500">•</span>
                <span>{Math.floor(video.duration / 60)} min</span>
              </>
            )}
          </div>
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => onPlayClick(video)}
              className="flex items-center gap-3 bg-white text-black px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-200 transition shadow-xl"
            >
              <Play className="w-7 h-7 fill-current" />
              Play
            </button>
            <button
              onClick={() => onPlayClick(video)}
              className="flex items-center gap-3 bg-gray-600/80 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-600/60 transition backdrop-blur-sm shadow-xl"
            >
              <Info className="w-7 h-7" />
              More Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
