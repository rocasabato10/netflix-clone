import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LogIn, LogOut, User, ChevronDown, Menu, X } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileOpenCategory, setMobileOpenCategory] = useState<string | null>(null);

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

  const toggleMobileCategory = (categorySlug: string) => {
    setMobileOpenCategory(mobileOpenCategory === categorySlug ? null : categorySlug);
  };

  const handleMobileCategoryClick = (categorySlug: string) => {
    onCategoryChange(categorySlug);
    setMobileMenuOpen(false);
    setMobileOpenCategory(null);
  };

  const handleMobileSubcategoryClick = (subcategoryId: string) => {
    onSubcategorySelect(subcategoryId);
    setMobileMenuOpen(false);
    setMobileOpenCategory(null);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-black">
        <div className="flex items-center justify-between px-3 sm:px-8 py-3 sm:py-4 gap-2 sm:gap-8">
          <div className="flex items-center gap-3 sm:gap-8 flex-shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-md transition"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <button
              onClick={() => {
                onCategoryChange(null);
                setMobileMenuOpen(false);
              }}
              className="hover:opacity-80 transition"
            >
              <img
                src="/Senza titolo-1.png"
                alt="ModaFlicks"
                className="h-12 sm:h-16 w-auto"
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

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex-1 max-w-xl hidden md:block">
              <SearchBar videos={videos} onVideoSelect={onVideoSelect} />
            </div>

            <button
              onClick={handleAuthClick}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-md transition text-sm"
            >
              {user ? (
                <>
                  <User size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="text-xs sm:text-sm hidden lg:inline">
                    {user.email?.split('@')[0]}
                  </span>
                  <LogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
                </>
              ) : (
                <>
                  <LogIn size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="text-xs sm:text-sm">Accedi</span>
                </>
              )}
            </button>
          </div>
        </div>

      <div className="md:hidden px-3 sm:px-8 pb-3 sm:pb-4">
        <SearchBar videos={videos} onVideoSelect={onVideoSelect} />
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[140px] bg-black bg-opacity-98 z-40 overflow-y-auto">
          <nav className="flex flex-col px-4 py-6">
            <button
              onClick={() => {
                onCategoryChange(null);
                setMobileMenuOpen(false);
              }}
              className={`text-left px-4 py-3 text-base font-medium transition border-b border-gray-800 ${
                activeCategory === null
                  ? 'text-white bg-white bg-opacity-10'
                  : 'text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-5'
              }`}
            >
              Home
            </button>

            {categories.map((category) => {
              const categorySubcategories = getSubcategoriesForCategory(category.id);
              const hasSubcategories = categorySubcategories.length > 0;
              const isOpen = mobileOpenCategory === category.slug;

              return (
                <div key={category.slug} className="border-b border-gray-800">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleMobileCategoryClick(category.slug)}
                      className={`flex-1 text-left px-4 py-3 text-base font-medium transition ${
                        activeCategory === category.slug
                          ? 'text-white bg-white bg-opacity-10'
                          : 'text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-5'
                      }`}
                    >
                      {category.name}
                    </button>

                    {hasSubcategories && (
                      <button
                        onClick={() => toggleMobileCategory(category.slug)}
                        className="px-4 py-3 text-gray-300 hover:text-white"
                      >
                        <ChevronDown
                          size={18}
                          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                    )}
                  </div>

                  {hasSubcategories && isOpen && (
                    <div className="bg-black bg-opacity-50">
                      {categorySubcategories.map((subcategory) => (
                        <button
                          key={subcategory.id}
                          onClick={() => handleMobileSubcategoryClick(subcategory.id)}
                          className="w-full text-left px-8 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-5 transition"
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
      )}
    </header>

    <AuthModal
      isOpen={showAuthModal}
      onClose={() => setShowAuthModal(false)}
    />
  </>
  );
}
