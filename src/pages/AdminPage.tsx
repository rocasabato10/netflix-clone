import React, { useState } from 'react';
import { Upload, Video, Image, Users, Tag, DollarSign, List, BarChart3 } from 'lucide-react';
import VideoUpload from '../components/admin/VideoUpload';
import VideoManagement from '../components/admin/VideoManagement';
import CategoryManagement from '../components/admin/CategoryManagement';
import SubscriptionManagement from '../components/admin/SubscriptionManagement';
import UserManagement from '../components/admin/UserManagement';
import Dashboard from '../components/admin/Dashboard';

type TabType = 'dashboard' | 'upload' | 'videos' | 'categories' | 'subscriptions' | 'users';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: BarChart3 },
    { id: 'upload' as TabType, label: 'Carica Video', icon: Upload },
    { id: 'videos' as TabType, label: 'Gestione Video', icon: Video },
    { id: 'categories' as TabType, label: 'Categorie', icon: Tag },
    { id: 'subscriptions' as TabType, label: 'Abbonamenti', icon: DollarSign },
    { id: 'users' as TabType, label: 'Utenti', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <a
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Torna al sito
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap
                      ${
                        activeTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'upload' && <VideoUpload />}
            {activeTab === 'videos' && <VideoManagement />}
            {activeTab === 'categories' && <CategoryManagement />}
            {activeTab === 'subscriptions' && <SubscriptionManagement />}
            {activeTab === 'users' && <UserManagement />}
          </div>
        </div>
      </div>
    </div>
  );
}
