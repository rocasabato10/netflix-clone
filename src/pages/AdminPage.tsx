import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Video as VideoIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface VideoData {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
  duration: string;
  views: number;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchVideos();
  }, [user, navigate]);

  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('upload_date', { ascending: false });

    if (error) {
      console.error('Error fetching videos:', error);
    } else {
      setVideos(data || []);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !videoFile || !thumbnailFile) {
      setUploadStatus('Seleziona un video e una thumbnail');
      return;
    }

    setLoading(true);
    setUploadStatus('Caricamento in corso...');

    try {
      const videoFileName = `${user.id}/${Date.now()}-${videoFile.name}`;
      const thumbnailFileName = `${user.id}/${Date.now()}-${thumbnailFile.name}`;

      const { error: videoError } = await supabase.storage
        .from('videos')
        .upload(videoFileName, videoFile);

      if (videoError) throw videoError;

      const { error: thumbnailError } = await supabase.storage
        .from('thumbnails')
        .upload(thumbnailFileName, thumbnailFile);

      if (thumbnailError) throw thumbnailError;

      const { data: videoUrlData } = supabase.storage
        .from('videos')
        .getPublicUrl(videoFileName);

      const { data: thumbnailUrlData } = supabase.storage
        .from('thumbnails')
        .getPublicUrl(thumbnailFileName);

      const { error: insertError } = await supabase
        .from('videos')
        .insert({
          title,
          description,
          video_url: videoUrlData.publicUrl,
          thumbnail_url: thumbnailUrlData.publicUrl,
          duration,
          uploaded_by: user.id,
        });

      if (insertError) throw insertError;

      setUploadStatus('Video caricato con successo!');
      setTitle('');
      setDescription('');
      setDuration('');
      setVideoFile(null);
      setThumbnailFile(null);
      fetchVideos();

      const form = document.querySelector('form') as HTMLFormElement;
      if (form) form.reset();
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadStatus('Errore durante il caricamento: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, videoUrl: string, thumbnailUrl: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo video?')) return;

    try {
      const videoPath = videoUrl.split('/videos/')[1];
      const thumbnailPath = thumbnailUrl.split('/thumbnails/')[1];

      await supabase.storage.from('videos').remove([videoPath]);
      await supabase.storage.from('thumbnails').remove([thumbnailPath]);

      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchVideos();
    } catch (error: any) {
      alert('Errore durante l\'eliminazione: ' + error.message);
    }
  };

  if (!user) {
    return null;
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
          </div>

          <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Upload size={24} />
              Carica Nuovo Video
            </h2>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-white mb-2">Titolo</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2">Descrizione</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-white mb-2">Durata (es: 10:30)</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="0:00"
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2">File Video</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2">Thumbnail</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {uploadStatus && (
                <div className={`p-3 rounded-md ${uploadStatus.includes('successo') ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                  {uploadStatus}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Caricamento...' : 'Carica Video'}
              </button>
            </form>
          </div>

          <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <VideoIcon size={24} />
              Video Caricati ({videos.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-white font-bold mb-2">{video.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{video.description}</p>
                    <div className="flex justify-between items-center text-gray-500 text-sm mb-4">
                      <span>{video.duration}</span>
                      <span>{video.views} visualizzazioni</span>
                    </div>
                    <button
                      onClick={() => handleDelete(video.id, video.video_url, video.thumbnail_url)}
                      className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Elimina
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {videos.length === 0 && (
              <p className="text-gray-400 text-center py-8">
                Nessun video caricato
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
