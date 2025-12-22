import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { Designer } from '../types';

interface DesignerRowProps {
  title: string;
  designers: Designer[];
  onDesignerClick: (designer: Designer) => void;
  onViewAll: () => void;
}

export default function DesignerRow({ title, designers, onDesignerClick, onViewAll }: DesignerRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(designers.length > 4);

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

  if (designers.length === 0) return null;

  return (
    <div className="px-8 md:px-16 py-8 group">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{title}</h2>
        <button
          onClick={onViewAll}
          className="text-amber-500 hover:text-amber-400 font-semibold text-sm md:text-base transition-colors"
        >
          View All →
        </button>
      </div>

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
          {designers.map((designer) => (
            <div
              key={designer.id}
              onClick={() => onDesignerClick(designer)}
              className="flex-none w-48 md:w-56 cursor-pointer group/item transition-all duration-300 hover:scale-105"
            >
              <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-xl bg-neutral-900">
                <img
                  src={designer.photo_url || 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg'}
                  alt={designer.name}
                  className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="mt-3 px-1">
                <h3 className="text-white text-base font-semibold line-clamp-2 leading-tight">
                  {designer.name}
                </h3>
                {designer.birth_place && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                    {designer.birth_place}
                  </p>
                )}
                {designer.brands && designer.brands.length > 0 && (
                  <p className="text-xs text-amber-500 mt-1 line-clamp-1">
                    {designer.brands[0]}
                  </p>
                )}
              </div>
            </div>
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
