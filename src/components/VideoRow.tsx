import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import type { Video } from '../types';

interface VideoRowProps {
  title: string;
  videos: Video[];
  onVideoClick: (video: Video) => void;
  showRanking?: boolean;
}

export default function VideoRow({ title, videos, onVideoClick, showRanking = false }: VideoRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(videos.length > 4);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' ? -900 : 900;
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
    <div className="px-8 md:px-16 py-8 group">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">{title}</h2>

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
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {videos.map((video, index) => (
            <button
              key={video.id}
              onClick={() => onVideoClick(video)}
              className="flex-none w-72 group/item transition-all duration-300 hover:scale-110"
            >
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl">
                {showRanking && index < 10 && (
                  <div className="absolute left-0 bottom-0 z-20 text-[180px] font-black leading-none text-transparent pointer-events-none" style={{
                    WebkitTextStroke: '3px white',
                    textShadow: '4px 4px 8px rgba(0,0,0,0.9)',
                    fontFamily: 'Arial Black, sans-serif',
                    transform: 'translateY(20%)',
                    paddingLeft: '0.1em'
                  }}>
                    {index + 1}
                  </div>
                )}
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover/item:translate-y-0 transition-transform">
                  <p className="text-white text-sm line-clamp-2">{video.description}</p>
                </div>
              </div>
              <div className="mt-3 px-1">
                <h3 className="text-white text-base font-semibold line-clamp-2 leading-tight">
                  {video.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                  {video.year && <span>{video.year}</span>}
                  {video.duration && (
                    <>
                      {video.year && <span>•</span>}
                      <span>{Math.floor(video.duration / 60)} min</span>
                    </>
                  )}
                </div>
              </div>
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
