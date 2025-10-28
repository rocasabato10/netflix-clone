import { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Category, Subcategory } from '../lib/supabase';

interface VideoUploadProps {
  onClose: () => void;
  onUploadComplete: () => void;
}

export default function VideoUpload({ onClose, onUploadComplete }: VideoUploadProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState('');
  const [duration, setDuration] = useState('');
  const [featured, setFeatured] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadSubcategories(selectedCategory);
    }
  }, [selectedCategory]);

  const loadCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('order');
    if (data) setCategories(data);
  };

  const loadSubcategories = async (categoryId: string) => {
    const { data } = await supabase
      .from('subcategories')
      .select('*')
      .eq('category_id', categoryId)
      .order('order');
    if (data) setSubcategories(data);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || !thumbnailFile || !selectedSubcategory) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const videoFileName = `${Date.now()}-${videoFile.name}`;
      const thumbnailFileName = `${Date.now()}-${thumbnailFile.name}`;

      setUploadProgress(25);

      const { error: videoError } = await supabase.storage
        .from('videos')
        .upload(videoFileName, videoFile);

      if (videoError) throw videoError;

      setUploadProgress(50);

      const { error: thumbnailError } = await supabase.storage
        .from('thumbnails')
        .upload(thumbnailFileName, thumbnailFile);

      if (thumbnailError) throw thumbnailError;

      setUploadProgress(75);

      const { data: { publicUrl: videoUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(videoFileName);

      const { data: { publicUrl: thumbnailUrl } } = supabase.storage
        .from('thumbnails')
        .getPublicUrl(thumbnailFileName);

      const { error: insertError } = await supabase.from('videos').insert({
        title,
        description,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        duration: parseInt(duration) || 0,
        year: year ? parseInt(year) : null,
        subcategory_id: selectedSubcategory,
        featured,
      });

      if (insertError) throw insertError;

      setUploadProgress(100);
      onUploadComplete();
      onClose();
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Errore durante il caricamento del video');
    } finally {
      setUploading(false);
    }
  };

  const filteredSubcategories = selectedCategory
    ? subcategories
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 overflow-y-auto">
      <div className="relative bg-gray-900 rounded-lg p-8 max-w-2xl w-full mx-4 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold text-white mb-6">Carica Video</h2>

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Titolo
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-rose-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descrizione
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-rose-600 h-24"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Categoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubcategory('');
                }}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-rose-600"
                required
              >
                <option value="">Seleziona categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sottocategoria
              </label>
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-rose-600"
                required
                disabled={!selectedCategory}
              >
                <option value="">Seleziona sottocategoria</option>
                {filteredSubcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Anno
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-rose-600"
                min="1900"
                max="2100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Durata (secondi)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-rose-600"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-rose-600 bg-gray-800 border-gray-700 rounded focus:ring-rose-600"
              />
              <span className="text-sm font-medium">Video in evidenza</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              File Video
            </label>
            <div className="relative">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                className="hidden"
                id="video-upload"
                required
              />
              <label
                htmlFor="video-upload"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-800 text-gray-300 rounded border border-gray-700 hover:border-rose-600 cursor-pointer transition"
              >
                <Upload size={20} />
                {videoFile ? videoFile.name : 'Scegli file video'}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Thumbnail
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                className="hidden"
                id="thumbnail-upload"
                required
              />
              <label
                htmlFor="thumbnail-upload"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-800 text-gray-300 rounded border border-gray-700 hover:border-rose-600 cursor-pointer transition"
              >
                <Upload size={20} />
                {thumbnailFile ? thumbnailFile.name : 'Scegli thumbnail'}
              </label>
            </div>
          </div>

          {uploading && (
            <div className="bg-gray-800 rounded p-4">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Caricamento in corso...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-rose-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading || !videoFile || !thumbnailFile}
            className="w-full bg-rose-600 text-white py-3 rounded font-semibold hover:bg-rose-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Caricamento...' : 'Carica Video'}
          </button>
        </form>
      </div>
    </div>
  );
}
