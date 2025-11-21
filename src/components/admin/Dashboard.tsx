import React, { useEffect, useState } from 'react';
import { Video, Users, Eye, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalUsers: 0,
    totalViews: 0,
    activeSubscriptions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [videosData, usersData, subscriptionsData] = await Promise.all([
        supabase.from('videos').select('views', { count: 'exact' }),
        supabase.from('user_profiles').select('*', { count: 'exact' }),
        supabase
          .from('user_profiles')
          .select('*', { count: 'exact' })
          .in('subscription_type', ['base', 'premium']),
      ]);

      const totalViews = videosData.data?.reduce((sum, video) => sum + (video.views || 0), 0) || 0;

      setStats({
        totalVideos: videosData.count || 0,
        totalUsers: usersData.count || 0,
        totalViews,
        activeSubscriptions: subscriptionsData.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Totale Video',
      value: stats.totalVideos,
      icon: Video,
      color: 'bg-blue-500',
    },
    {
      label: 'Utenti Registrati',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      label: 'Visualizzazioni Totali',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'bg-purple-500',
    },
    {
      label: 'Abbonamenti Attivi',
      value: stats.activeSubscriptions,
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">Caricamento statistiche...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Benvenuto nel Pannello Admin</h3>
        <p className="text-blue-800">
          Da qui puoi gestire tutti gli aspetti della piattaforma: caricare nuovi video, gestire categorie,
          monitorare gli utenti e configurare i piani di abbonamento.
        </p>
      </div>
    </div>
  );
}
