import { Search, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { Video } from '../types';

interface SearchBarProps {
  videos: Video[];
  onVideoSelect: (video: Video) => void;
}

export default function SearchBar({ videos, onVideoSelect }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [results, setResults] = useState<Video[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowSearchBar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setResults([]);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = videos.filter(
      (video) =>
        video.title.toLowerCase().includes(searchLower) ||
        video.description.toLowerCase().includes(searchLower)
    );

    setResults(filtered);
  }, [searchTerm, videos]);

  const handleVideoClick = (video: Video) => {
    onVideoSelect(video);
    setSearchTerm('');
    setResults([]);
    setIsOpen(false);
    setShowSearchBar(false);
  };

  const handleClear = () => {
    setSearchTerm('');
    setResults([]);
  };

  const handleSearchIconClick = () => {
    setShowSearchBar(true);
    setIsOpen(true);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      {!showSearchBar ? (
        <button
          onClick={handleSearchIconClick}
          className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-full transition"
        >
          <Search className="w-5 h-5" />
        </button>
      ) : (
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="Search videos, designers..."
            className="w-full bg-gray-900/80 text-white placeholder-gray-400 rounded-full pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm transition"
            autoFocus
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          {searchTerm && (
            <button
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {isOpen && searchTerm && (
        <div className="absolute top-full mt-2 w-full bg-gray-900 rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50 border border-gray-800">
          {results.length > 0 ? (
            <div className="py-2">
              {results.map((video) => (
                <button
                  key={video.id}
                  onClick={() => handleVideoClick(video)}
                  className="w-full px-4 py-3 hover:bg-gray-800 transition flex items-center gap-4 text-left"
                >
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-24 h-14 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold truncate">{video.title}</h4>
                    <p className="text-gray-400 text-sm truncate">{video.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
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
          ) : (
            <div className="px-4 py-8 text-center text-gray-400">
              No results found for "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
