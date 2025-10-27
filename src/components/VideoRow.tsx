import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import type { Video } from '../lib/supabase';

interface VideoRowProps {
  title: string;
  videos: Video[];
  onVideoClick: (video: Video) => void;
}

export default function VideoRow({ title, videos, onVideoClick }: VideoRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' ? -800 : 800;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });

      setTimeout(() => {
        if (rowRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
          setShowLeftArrow(scrollLeft > 0);
          setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
      }, 300);
    }
  };

  if (videos.length === 0) return null;

  return (
    <div className="px-8 md:px-16 py-6 group">
      <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>

      <div className="relative">
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/90"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}

        <div
          ref={rowRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {videos.map((video) => (
            <button
              key={video.id}
              onClick={() => onVideoClick(video)}
              className="flex-none w-64 group/item transition-transform hover:scale-105"
            >
              <div className="relative aspect-video rounded overflow-hidden">
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/30 transition-colors" />
              </div>
              <h3 className="text-white text-sm font-medium mt-2 line-clamp-1">
                {video.title}
              </h3>
              {video.year && (
                <p className="text-gray-400 text-xs">{video.year}</p>
              )}
            </button>
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/90"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}
      </div>
    </div>
  );
}
