import React, { useState, useEffect } from 'react';
import { Search, User, Crown, Eye, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  subscription_type: string;
  subscription_expires_at: string | null;
  created_at: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubscription, setFilterSubscription] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.last_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterSubscription !== 'all') {
      filtered = filtered.filter((user) => user.subscription_type === filterSubscription);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, filterSubscription, users]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setUsers(data);
        setFilteredUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionBadge = (type: string) => {
    const badges = {
      free: { label: 'Free', color: 'bg-gray-100 text-gray-700' },
      base: { label: 'Base', color: 'bg-blue-100 text-blue-700' },
      premium: { label: 'Premium', color: 'bg-purple-100 text-purple-700' },
    };

    const badge = badges[type as keyof typeof badges] || badges.free;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const isSubscriptionExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const stats = {
    total: users.length,
    free: users.filter((u) => u.subscription_type === 'free').length,
    base: users.filter((u) => u.subscription_type === 'base').length,
    premium: users.filter((u) => u.subscription_type === 'premium').length,
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">Caricamento utenti...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestione Utenti</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <User size={20} className="text-gray-600" />
            <span className="text-sm text-gray-600">Totale Utenti</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <User size={20} className="text-gray-600" />
            <span className="text-sm text-gray-600">Free</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.free}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Crown size={20} className="text-blue-600" />
            <span className="text-sm text-blue-600">Base</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{stats.base}</p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Crown size={20} className="text-purple-600" />
            <span className="text-sm text-purple-600">Premium</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">{stats.premium}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cerca per email o nome..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <select
          value={filterSubscription}
          onChange={(e) => setFilterSubscription(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Tutti gli abbonamenti</option>
          <option value="free">Free</option>
          <option value="base">Base</option>
          <option value="premium">Premium</option>
        </select>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Nessun utente trovato</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Abbonamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scadenza
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registrato
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getSubscriptionBadge(user.subscription_type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.subscription_expires_at ? (
                        <div className="text-sm">
                          <div
                            className={
                              isSubscriptionExpired(user.subscription_expires_at)
                                ? 'text-red-600'
                                : 'text-gray-900'
                            }
                          >
                            {new Date(user.subscription_expires_at).toLocaleDateString('it-IT')}
                          </div>
                          {isSubscriptionExpired(user.subscription_expires_at) && (
                            <div className="text-xs text-red-500">Scaduto</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString('it-IT')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        Mostrando {filteredUsers.length} di {users.length} utenti
      </div>
    </div>
  );
}
