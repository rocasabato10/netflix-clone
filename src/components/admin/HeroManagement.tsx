import { useState, useEffect } from 'react';
import { Upload, X, Edit2, Trash2, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface HeroSlide {
  id: string;
  title: string;
  description: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function HeroManagement() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setSlides(data || []);
    } catch (err) {
      console.error('Error fetching hero slides:', err);
      setError('Errore nel caricamento delle slide');
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('hero-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('hero-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError('');

    try {
      let imageUrl = formData.image_url;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      if (!imageUrl) {
        throw new Error('Immagine obbligatoria');
      }

      if (editingSlide) {
        const { error } = await supabase
          .from('hero_slides')
          .update({
            title: formData.title,
            description: formData.description,
            image_url: imageUrl,
          })
          .eq('id', editingSlide.id);

        if (error) throw error;
      } else {
        const maxOrder = Math.max(...slides.map(s => s.display_order), -1);
        const { error } = await supabase
          .from('hero_slides')
          .insert({
            title: formData.title,
            description: formData.description,
            image_url: imageUrl,
            display_order: maxOrder + 1,
          });

        if (error) throw error;
      }

      setIsModalOpen(false);
      setEditingSlide(null);
      setFormData({ title: '', description: '', image_url: '' });
      setImageFile(null);
      fetchSlides();
    } catch (err) {
      console.error('Error saving slide:', err);
      setError('Errore nel salvataggio della slide');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      description: slide.description,
      image_url: slide.image_url,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa slide?')) return;

    try {
      const { error } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchSlides();
    } catch (err) {
      console.error('Error deleting slide:', err);
      setError('Errore nell\'eliminazione della slide');
    }
  };

  const toggleActive = async (slide: HeroSlide) => {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .update({ is_active: !slide.is_active })
        .eq('id', slide.id);

      if (error) throw error;
      fetchSlides();
    } catch (err) {
      console.error('Error toggling slide:', err);
      setError('Errore nell\'aggiornamento della slide');
    }
  };

  const moveSlide = async (slide: HeroSlide, direction: 'up' | 'down') => {
    const currentIndex = slides.findIndex(s => s.id === slide.id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === slides.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const otherSlide = slides[newIndex];

    try {
      await supabase
        .from('hero_slides')
        .update({ display_order: otherSlide.display_order })
        .eq('id', slide.id);

      await supabase
        .from('hero_slides')
        .update({ display_order: slide.display_order })
        .eq('id', otherSlide.id);

      fetchSlides();
    } catch (err) {
      console.error('Error moving slide:', err);
      setError('Errore nello spostamento della slide');
    }
  };

  const openModal = () => {
    setEditingSlide(null);
    setFormData({ title: '', description: '', image_url: '' });
    setImageFile(null);
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="text-center py-8">Caricamento...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestione Hero Section</h2>
        <button
          onClick={openModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Aggiungi Slide
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4"
          >
            <img
              src={slide.image_url}
              alt={slide.title}
              className="w-48 h-32 object-cover rounded"
            />

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold">{slide.title}</h3>
                  <p className="text-gray-600 mt-1">{slide.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      slide.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {slide.is_active ? 'Attiva' : 'Disattivata'}
                    </span>
                    <span className="text-sm text-gray-500">
                      Ordine: {slide.display_order}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => moveSlide(slide, 'up')}
                    disabled={index === 0}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30"
                    title="Sposta su"
                  >
                    <ChevronUp className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => moveSlide(slide, 'down')}
                    disabled={index === slides.length - 1}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30"
                    title="Sposta giù"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => toggleActive(slide)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                    title={slide.is_active ? 'Disattiva' : 'Attiva'}
                  >
                    {slide.is_active ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>

                  <button
                    onClick={() => handleEdit(slide)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="Modifica"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Elimina"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {slides.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nessuna slide hero presente. Aggiungine una!
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-2xl font-bold">
                {editingSlide ? 'Modifica Slide' : 'Nuova Slide'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Titolo *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Descrizione
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Immagine Hero *
                </label>
                {formData.image_url && !imageFile && (
                  <div className="mb-4">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                    <Upload className="w-5 h-5" />
                    <span>{imageFile ? imageFile.name : 'Carica immagine'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Formato consigliato: 1920x1080px (16:9)
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  disabled={uploading}
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  disabled={uploading}
                >
                  {uploading ? 'Salvataggio...' : 'Salva'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
