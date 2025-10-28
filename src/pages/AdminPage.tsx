import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Users, TrendingUp, Upload, ArrowLeft } from 'lucide-react';
import VideoUpload from '../components/VideoUpload';

interface UserWithSubscription {
  id: string;
  email: string;
  created_at: string;
  subscription?: {
    plan_name: string;
    has_ads: boolean;
    status: string;
    current_period_end: string;
  };
}

interface SubscriptionStats {
  totalUsers: number;
  premiumUsers: number;
  basicUsers: number;
  noSubscription: number;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserWithSubscription[]>([]);
  const [stats, setStats] = useState<SubscriptionStats>({
    totalUsers: 0,
    premiumUsers: 0,
    basicUsers: 0,
    noSubscription: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: usersData, error: usersError } = await supabase.rpc('get_users_with_subscriptions');

      if (usersError) {
        console.error('Error loading users:', usersError);
        return;
      }

      const formattedUsers: UserWithSubscription[] = usersData.map((user: any) => ({
        id: user.user_id,
        email: user.email,
        created_at: user.created_at,
        subscription: user.plan_name ? {
          plan_name: user.plan_name,
          has_ads: user.has_ads,
          status: user.status,
          current_period_end: user.current_period_end,
        } : undefined,
      }));

      setUsers(formattedUsers);

      const totalUsers = formattedUsers.length;
      const premiumUsers = formattedUsers.filter(
        (u) => u.subscription && !u.subscription.has_ads
      ).length;
      const basicUsers = formattedUsers.filter(
        (u) => u.subscription && u.subscription.has_ads
      ).length;
      const noSubscription = formattedUsers.filter((u) => !u.subscription).length;

      setStats({ totalUsers, premiumUsers, basicUsers, noSubscription });
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading admin panel...</div>
      </div>
    );
  }

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
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition font-semibold"
            >
              <Upload size={20} />
              Carica Video
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <Users className="text-white opacity-80" size={32} />
                <span className="text-3xl font-bold text-white">{stats.totalUsers}</span>
              </div>
              <h3 className="text-white text-sm font-medium">Total Users</h3>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="text-white opacity-80" size={32} />
                <span className="text-3xl font-bold text-white">{stats.premiumUsers}</span>
              </div>
              <h3 className="text-white text-sm font-medium">Premium Subscribers</h3>
            </div>

            <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-lg p-6 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <Users className="text-white opacity-80" size={32} />
                <span className="text-3xl font-bold text-white">{stats.basicUsers}</span>
              </div>
              <h3 className="text-white text-sm font-medium">Basic Subscribers</h3>
            </div>

            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-lg p-6 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <Users className="text-white opacity-80" size={32} />
                <span className="text-3xl font-bold text-white">{stats.noSubscription}</span>
              </div>
              <h3 className="text-white text-sm font-medium">No Subscription</h3>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-2xl font-bold text-white">Users List</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Subscription Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Period End
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Registered
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-800 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.subscription ? (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.subscription.has_ads
                                ? 'bg-yellow-900 text-yellow-200'
                                : 'bg-green-900 text-green-200'
                            }`}
                          >
                            {user.subscription.plan_name}
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-900 text-red-200">
                            No Subscription
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.subscription ? (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.subscription.status === 'active'
                                ? 'bg-green-900 text-green-200'
                                : 'bg-gray-700 text-gray-300'
                            }`}
                          >
                            {user.subscription.status}
                          </span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {user.subscription
                          ? new Date(user.subscription.current_period_end).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showUploadModal && (
        <VideoUpload
          onClose={() => setShowUploadModal(false)}
          onUploadComplete={loadData}
        />
      )}
    </div>
  );
}
