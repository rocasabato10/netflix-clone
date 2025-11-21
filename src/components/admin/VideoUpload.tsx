import React, { useState, useEffect } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  category_id: string;
}

export default function VideoUpload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ video: 0, thumbnail: 0 });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  useEffect(() => {
    if (categoryId) {
      setFilteredSubcategories(
        subcategories.filter((sub) => sub.category_id === categoryId)
      );
      setSubcategoryId('');
    } else {
      setFilteredSubcategories([]);
    }
  }, [categoryId, subcategories]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (!error && data) {
      setCategories(data);
    }
  };

  const fetchSubcategories = async () => {
    const { data, error } = await supabase
      .from('subcategories')
      .select('*')
      .order('name');

    if (!error && data) {
      setSubcategories(data);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!title || !description || !videoFile || !thumbnailFile) {
      setError('Tutti i campi obbligatori devono essere compilati');
      return;
    }

    setUploading(true);

    try {
      const timestamp = Date.now();
      const videoFileName = `${timestamp}_${videoFile.name.replace(/\s+/g, '_')}`;
      const thumbnailFileName = `${timestamp}_${thumbnailFile.name.replace(/\s+/g, '_')}`;

      setUploadProgress({ video: 0, thumbnail: 0 });

      const { data: videoData, error: videoError } = await supabase.storage
        .from('videos')
        .upload(videoFileName, videoFile);

      if (videoError) throw videoError;

      setUploadProgress({ video: 50, thumbnail: 0 });

      const { data: thumbnailData, error: thumbnailError } = await supabase.storage
        .from('thumbnails')
        .upload(thumbnailFileName, thumbnailFile);

      if (thumbnailError) throw thumbnailError;

      setUploadProgress({ video: 100, thumbnail: 50 });

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
        duration,
        category_id: categoryId || null,
        subcategory_id: subcategoryId || null,
        views: 0,
        upload_date: new Date().toISOString(),
      });

      if (insertError) throw insertError;

      setUploadProgress({ video: 100, thumbnail: 100 });
      setSuccess(true);

      setTitle('');
      setDescription('');
      setDuration('');
      setCategoryId('');
      setSubcategoryId('');
      setVideoFile(null);
      setThumbnailFile(null);

      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Errore durante il caricamento');
    } finally {
      setUploading(false);
      setUploadProgress({ video: 0, thumbnail: 0 });
    }
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Carica Nuovo Video</h2>

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
          <div>
            <p className="text-green-800 font-medium">Video caricato con successo!</p>
            <p className="text-green-700 text-sm">Il video è ora disponibile sulla piattaforma.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
          <div>
            <p className="text-red-800 font-medium">Errore</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titolo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Inserisci il titolo del video"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrizione <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Inserisci la descrizione del video"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Durata</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="es. 10:30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleziona una categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {categoryId && filteredSubcategories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sottocategoria</label>
            <select
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleziona una sottocategoria</option>
              {filteredSubcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File Video <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
                id="video-upload"
                required
              />
              <label
                htmlFor="video-upload"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
              >
                <Upload size={20} className="text-gray-500" />
                <span className="text-sm text-gray-600">
                  {videoFile ? videoFile.name : 'Carica video'}
                </span>
              </label>
            </div>
            {videoFile && (
              <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                <span>{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                <button
                  type="button"
                  onClick={() => setVideoFile(null)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
                id="thumbnail-upload"
                required
              />
              <label
                htmlFor="thumbnail-upload"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
              >
                <Upload size={20} className="text-gray-500" />
                <span className="text-sm text-gray-600">
                  {thumbnailFile ? thumbnailFile.name : 'Carica thumbnail'}
                </span>
              </label>
            </div>
            {thumbnailFile && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(thumbnailFile)}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setThumbnailFile(null)}
                  className="mt-2 text-sm text-red-600 hover:text-red-700"
                >
                  Rimuovi
                </button>
              </div>
            )}
          </div>
        </div>

        {uploading && (
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Caricamento video</span>
                <span>{uploadProgress.video}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.video}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Caricamento thumbnail</span>
                <span>{uploadProgress.thumbnail}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.thumbnail}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={uploading}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Caricamento in corso...
              </>
            ) : (
              <>
                <Upload size={20} />
                Carica Video
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
