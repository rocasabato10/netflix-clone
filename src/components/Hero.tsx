import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Video } from '../types';

interface HeroProps {
  videos: Video[];
  onPlayClick: (video: Video) => void;
}

export default function Hero({ videos, onPlayClick }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || videos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, videos.length]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  if (videos.length === 0) return null;

  const currentVideo = videos[currentIndex];

  return (
    <div className="relative h-[95vh] w-full overflow-hidden">
      {videos.map((video, index) => (
        <div
          key={video.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="w-full h-full object-cover object-[center_20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
        </div>
      ))}

      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-7 h-7" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="w-7 h-7" />
      </button>

      <div className="relative h-full flex flex-col justify-end px-8 md:px-16 pb-32 z-10">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white drop-shadow-2xl leading-tight">
            {currentVideo.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 drop-shadow-lg line-clamp-3 max-w-2xl">
            {currentVideo.description}
          </p>
          <div className="flex items-center gap-3 text-sm text-gray-300">
            {currentVideo.year && <span className="font-medium">{currentVideo.year}</span>}
            {currentVideo.duration && (
              <>
                <span className="text-gray-500">•</span>
                <span>{Math.floor(currentVideo.duration / 60)} min</span>
              </>
            )}
          </div>
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => onPlayClick(currentVideo)}
              className="flex items-center gap-3 bg-white text-black px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-200 transition shadow-xl"
            >
              <Play className="w-7 h-7 fill-current" />
              Play
            </button>
            <button
              onClick={() => onPlayClick(currentVideo)}
              className="flex items-center gap-3 bg-gray-600/80 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-600/60 transition backdrop-blur-sm shadow-xl"
            >
              <Info className="w-7 h-7" />
              More Info
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1 rounded-full transition-all ${
              index === currentIndex
                ? 'w-8 bg-white'
                : 'w-6 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
