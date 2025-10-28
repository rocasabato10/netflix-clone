import { Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onCategoryChange: (categorySlug: string | null) => void;
  categories: Array<{ slug: string; name: string }>;
  activeCategory: string | null;
}

export default function Header({ onCategoryChange, categories, activeCategory }: HeaderProps) {
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
            className="flex items-center gap-2 text-2xl font-bold text-white hover:opacity-80 transition"
          >
            <Sparkles className="w-8 h-8 text-rose-500" />
            <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              ModaFlix
            </span>
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

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300 hidden md:block">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded hover:bg-rose-700 transition"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
