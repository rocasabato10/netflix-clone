import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function AdminPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-white transition"
              >
                <ArrowLeft size={32} />
              </button>
              <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden p-8">
            <p className="text-white text-lg">
              Admin panel functionality has been removed along with Supabase integration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
