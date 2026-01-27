import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useRef, useState } from 'react';
import type { Video } from '../types';

interface VideoRowProps {
  title: string;
  videos: Video[];
  onVideoClick: (video: Video) => void;
  onInfoClick: (video: Video) => void;
  showRanking?: boolean;
}

export default function VideoRow({ title, videos, onVideoClick, onInfoClick, showRanking = false }: VideoRowProps) {
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
    <div className="px-4 sm:px-8 md:px-16 py-6 sm:py-8 group">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 tracking-tight">{title}</h2>

      <div className="relative">
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-0 top-0 bottom-0 z-10 w-12 bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center hover:bg-black/90"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}

        <div
          ref={rowRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide scroll-smooth -mx-4 sm:mx-0 px-4 sm:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="flex-none w-56 sm:w-64 md:w-72 group/item transition-all duration-300 md:hover:scale-110"
            >
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl cursor-pointer" onClick={() => onInfoClick(video)}>
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 md:group-hover/item:opacity-100 transition-opacity" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onInfoClick(video);
                  }}
                  className="absolute top-2 right-2 bg-black/80 hover:bg-black text-white rounded-full p-2 opacity-100 md:opacity-0 md:group-hover/item:opacity-100 transition-opacity z-10"
                  title="Maggiori informazioni"
                >
                  <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
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
            </div>
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-0 top-0 bottom-0 z-10 w-12 bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center hover:bg-black/90"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}
      </div>
    </div>
  );
}
