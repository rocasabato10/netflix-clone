import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LogIn, LogOut, User, ChevronDown } from 'lucide-react';
import type { Video } from '../types';
import SearchBar from './SearchBar';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  category_id: string;
}

interface HeaderProps {
  onCategoryChange: (categorySlug: string | null) => void;
  categories: Category[];
  subcategories: Subcategory[];
  activeCategory: string | null;
  videos: Video[];
  onVideoSelect: (video: Video) => void;
  onSubcategorySelect: (subcategoryId: string) => void;
}

export default function Header({
  onCategoryChange,
  categories,
  subcategories,
  activeCategory,
  videos,
  onVideoSelect,
  onSubcategorySelect
}: HeaderProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      setShowAuthModal(true);
    }
  };

  const getSubcategoriesForCategory = (categoryId: string) => {
    return subcategories.filter(sub => sub.category_id === categoryId);
  };

  const handleCategoryHover = (categorySlug: string) => {
    setOpenDropdown(categorySlug);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  return (
    <>
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
              {categories.map((category) => {
                const categorySubcategories = getSubcategoriesForCategory(category.id);
                return (
                  <div
                    key={category.slug}
                    className="relative group"
                    onMouseEnter={() => handleCategoryHover(category.slug)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      onClick={() => onCategoryChange(category.slug)}
                      className={`text-sm font-medium transition flex items-center gap-1 ${
                        activeCategory === category.slug
                          ? 'text-white'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      {category.name}
                      {categorySubcategories.length > 0 && (
                        <ChevronDown size={14} className={`transition-transform ${openDropdown === category.slug ? 'rotate-180' : ''}`} />
                      )}
                    </button>

                    {categorySubcategories.length > 0 && openDropdown === category.slug && (
                      <div className="absolute top-full left-0 mt-2 bg-black bg-opacity-95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-800 min-w-[200px] py-2">
                        {categorySubcategories.map((subcategory) => (
                          <button
                            key={subcategory.id}
                            onClick={() => {
                              onSubcategorySelect(subcategory.id);
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition"
                          >
                            {subcategory.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-xl hidden md:block">
              <SearchBar videos={videos} onVideoSelect={onVideoSelect} />
            </div>

            <button
              onClick={handleAuthClick}
              className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-md transition"
            >
              {user ? (
                <>
                  <User size={18} />
                  <span className="text-sm hidden lg:inline">
                    {user.email?.split('@')[0]}
                  </span>
                  <LogOut size={18} />
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span className="text-sm">Accedi</span>
                </>
              )}
            </button>
          </div>
        </div>

      <div className="md:hidden px-8 pb-4">
        <SearchBar videos={videos} onVideoSelect={onVideoSelect} />
      </div>
    </header>

    <AuthModal
      isOpen={showAuthModal}
      onClose={() => setShowAuthModal(false)}
    />
  </>
  );
}
