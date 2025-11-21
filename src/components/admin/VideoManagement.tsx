import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Eye, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
  duration: string;
  views: number;
  upload_date: string;
  category_id?: string;
  subcategory_id?: string;
}

export default function VideoManagement() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredVideos(
        videos.filter(
          (video) =>
            video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            video.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredVideos(videos);
    }
  }, [searchTerm, videos]);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('upload_date', { ascending: false });

      if (!error && data) {
        setVideos(data);
        setFilteredVideos(data);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, videoUrl: string, thumbnailUrl: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo video?')) return;

    try {
      const videoPath = videoUrl.split('/videos/').pop();
      const thumbnailPath = thumbnailUrl.split('/thumbnails/').pop();

      if (videoPath) {
        await supabase.storage.from('videos').remove([videoPath]);
      }
      if (thumbnailPath) {
        await supabase.storage.from('thumbnails').remove([thumbnailPath]);
      }

      const { error } = await supabase.from('videos').delete().eq('id', id);

      if (!error) {
        fetchVideos();
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Errore durante l\'eliminazione del video');
    }
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;

    try {
      const { error } = await supabase
        .from('videos')
        .update({
          title: editingVideo.title,
          description: editingVideo.description,
          duration: editingVideo.duration,
        })
        .eq('id', editingVideo.id);

      if (!error) {
        fetchVideos();
        setEditingVideo(null);
      }
    } catch (error) {
      console.error('Error updating video:', error);
      alert('Errore durante l\'aggiornamento del video');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">Caricamento video...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gestione Video</h2>
        <div className="text-sm text-gray-600">
          Totale: {filteredVideos.length} video
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cerca video per titolo o descrizione..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {filteredVideos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Nessun video trovato</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-40 h-24 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {video.views.toLocaleString()} visualizzazioni
                    </span>
                    {video.duration && <span>Durata: {video.duration}</span>}
                    <span>
                      {new Date(video.upload_date).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(video)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Modifica"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(video.id, video.video_url, video.thumbnail_url)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Elimina"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Modifica Video</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titolo
                </label>
                <input
                  type="text"
                  value={editingVideo.title}
                  onChange={(e) =>
                    setEditingVideo({ ...editingVideo, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrizione
                </label>
                <textarea
                  value={editingVideo.description}
                  onChange={(e) =>
                    setEditingVideo({ ...editingVideo, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durata
                </label>
                <input
                  type="text"
                  value={editingVideo.duration}
                  onChange={(e) =>
                    setEditingVideo({ ...editingVideo, duration: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Salva Modifiche
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
