import { useNavigate } from 'react-router-dom';
import type { Video } from '../types';
import SearchBar from './SearchBar';

interface HeaderProps {
  onCategoryChange: (categorySlug: string | null) => void;
  categories: Array<{ slug: string; name: string }>;
  activeCategory: string | null;
  videos: Video[];
  onVideoSelect: (video: Video) => void;
}

export default function Header({ onCategoryChange, categories, activeCategory, videos, onVideoSelect }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-gradient-to-b from-black to-transparent">
      <div className="flex items-center justify-between px-8 py-4 gap-8">
        <div className="flex items-center gap-8 flex-shrink-0">
          <button
            onClick={() => onCategoryChange(null)}
            className="hover:opacity-80 transition"
          >
            <img
              src="/WhatsApp Image 2025-10-29 at 18.03.10.jpeg"
              alt="ModaFlix"
              className="h-16 w-auto"
            />
          </button>

          <nav className="hidden lg:flex gap-6">
            <button
              onClick={() => onCategoryChange(null)}
              className={`text-sm font-medium transition ${
                activeCategory === null
                  ? 'text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Home
            </button>
            {categories.map((category) => (
              <button
                key={category.slug}
                onClick={() => onCategoryChange(category.slug)}
                className={`text-sm font-medium transition ${
                  activeCategory === category.slug
                    ? 'text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {category.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 max-w-xl hidden md:block">
          <SearchBar videos={videos} onVideoSelect={onVideoSelect} />
        </div>
      </div>

      <div className="md:hidden px-8 pb-4">
        <SearchBar videos={videos} onVideoSelect={onVideoSelect} />
      </div>
    </header>
  );
}
