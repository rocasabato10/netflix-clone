import { LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onCategoryChange: (categorySlug: string | null) => void;
  categories: Array<{ slug: string; name: string }>;
  activeCategory: string | null;
  onAuthClick?: () => void;
}

export default function Header({ onCategoryChange, categories, activeCategory, onAuthClick }: HeaderProps) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-gradient-to-b from-black to-transparent">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-8">
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

          <nav className="hidden md:flex gap-6">
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

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-300 hidden md:block">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded hover:bg-rose-700 transition"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={onAuthClick}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded hover:bg-rose-700 transition"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
