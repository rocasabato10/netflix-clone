import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Designer {
  id: string;
  name: string;
  slug: string;
  bio: string;
  birth_date: string;
  birth_place: string;
  photo_url: string;
  brands: string[];
  achievements: string[];
  signature_style: string;
}

interface DesignerVideo {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
  duration: string;
  year: number;
  designer_id: string;
}

export default function DesignerManagement() {
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [selectedDesigner, setSelectedDesigner] = useState<Designer | null>(null);
  const [designerVideos, setDesignerVideos] = useState<DesignerVideo[]>([]);
  const [isAddingDesigner, setIsAddingDesigner] = useState(false);
  const [isEditingDesigner, setIsEditingDesigner] = useState(false);
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [runwaySubcategoryId, setRunwaySubcategoryId] = useState<string>('');
  const [homepageCategoryId, setHomepageCategoryId] = useState<string>('');

  const [designerForm, setDesignerForm] = useState({
    name: '',
    slug: '',
    bio: '',
    birth_date: '',
    birth_place: '',
    photo_url: '',
    brands: '',
    achievements: '',
    signature_style: '',
  });

  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    thumbnail_url: '',
    video_url: '',
    duration: '',
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    fetchDesigners();
    fetchRunwaySubcategory();
  }, []);

  useEffect(() => {
    if (selectedDesigner) {
      fetchDesignerVideos(selectedDesigner.id);
    }
  }, [selectedDesigner]);

  const fetchRunwaySubcategory = async () => {
    try {
      const { data: categories } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', 'homepage')
        .maybeSingle();

      if (categories) {
        setHomepageCategoryId(categories.id);

        const { data: subcategories } = await supabase
          .from('subcategories')
          .select('id')
          .eq('slug', 'runway')
          .eq('category_id', categories.id)
          .maybeSingle();

        if (subcategories) {
          setRunwaySubcategoryId(subcategories.id);
        }
      }
    } catch (error) {
      console.error('Error fetching runway subcategory:', error);
    }
  };

  const fetchDesigners = async () => {
    try {
      const { data, error } = await supabase
        .from('designers')
        .select('*')
        .order('name');

      if (!error && data) {
        setDesigners(data);
      }
    } catch (error) {
      console.error('Error fetching designers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDesignerVideos = async (designerId: string) => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('designer_id', designerId)
        .order('year', { ascending: false });

      if (!error && data) {
        setDesignerVideos(data);
      }
    } catch (error) {
      console.error('Error fetching designer videos:', error);
    }
  };

  const handleAddDesigner = async () => {
    try {
      const { error } = await supabase.from('designers').insert([
        {
          name: designerForm.name,
          slug: designerForm.slug,
          bio: designerForm.bio,
          birth_date: designerForm.birth_date,
          birth_place: designerForm.birth_place,
          photo_url: designerForm.photo_url,
          brands: designerForm.brands.split(',').map((b) => b.trim()),
          achievements: designerForm.achievements.split('\n').filter((a) => a.trim()),
          signature_style: designerForm.signature_style,
        },
      ]);

      if (!error) {
        fetchDesigners();
        setIsAddingDesigner(false);
        resetDesignerForm();
      }
    } catch (error) {
      console.error('Error adding designer:', error);
    }
  };

  const handleUpdateDesigner = async () => {
    if (!selectedDesigner) return;

    try {
      const { error } = await supabase
        .from('designers')
        .update({
          name: designerForm.name,
          slug: designerForm.slug,
          bio: designerForm.bio,
          birth_date: designerForm.birth_date,
          birth_place: designerForm.birth_place,
          photo_url: designerForm.photo_url,
          brands: designerForm.brands.split(',').map((b) => b.trim()),
          achievements: designerForm.achievements.split('\n').filter((a) => a.trim()),
          signature_style: designerForm.signature_style,
        })
        .eq('id', selectedDesigner.id);

      if (!error) {
        fetchDesigners();
        setIsEditingDesigner(false);
        resetDesignerForm();
      }
    } catch (error) {
      console.error('Error updating designer:', error);
    }
  };

  const handleDeleteDesigner = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo designer? Verranno eliminati anche tutti i video associati.')) return;

    try {
      const { error } = await supabase.from('designers').delete().eq('id', id);

      if (error) {
        alert(`Errore nell'eliminazione del designer: ${error.message}`);
        console.error('Error deleting designer:', error);
      } else {
        fetchDesigners();
        if (selectedDesigner?.id === id) {
          setSelectedDesigner(null);
        }
      }
    } catch (error) {
      console.error('Error deleting designer:', error);
      alert('Errore imprevisto durante l\'eliminazione del designer');
    }
  };

  const handleAddVideo = async () => {
    if (!selectedDesigner || !runwaySubcategoryId || !homepageCategoryId) return;

    try {
      const { error } = await supabase.from('videos').insert([
        {
          title: videoForm.title,
          description: videoForm.description,
          thumbnail_url: videoForm.thumbnail_url,
          video_url: videoForm.video_url,
          duration: videoForm.duration,
          year: videoForm.year,
          designer_id: selectedDesigner.id,
          subcategory_id: runwaySubcategoryId,
          category_id: homepageCategoryId,
        },
      ]);

      if (!error) {
        fetchDesignerVideos(selectedDesigner.id);
        setIsAddingVideo(false);
        resetVideoForm();
      }
    } catch (error) {
      console.error('Error adding video:', error);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo video?')) return;

    try {
      const { error } = await supabase.from('videos').delete().eq('id', id);

      if (error) {
        alert(`Errore nell'eliminazione del video: ${error.message}`);
        console.error('Error deleting video:', error);
      } else if (selectedDesigner) {
        fetchDesignerVideos(selectedDesigner.id);
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Errore imprevisto durante l\'eliminazione del video');
    }
  };

  const resetDesignerForm = () => {
    setDesignerForm({
      name: '',
      slug: '',
      bio: '',
      birth_date: '',
      birth_place: '',
      photo_url: '',
      brands: '',
      achievements: '',
      signature_style: '',
    });
  };

  const resetVideoForm = () => {
    setVideoForm({
      title: '',
      description: '',
      thumbnail_url: '',
      video_url: '',
      duration: '',
      year: new Date().getFullYear(),
    });
  };

  const editDesigner = (designer: Designer) => {
    setDesignerForm({
      name: designer.name,
      slug: designer.slug,
      bio: designer.bio,
      birth_date: designer.birth_date,
      birth_place: designer.birth_place,
      photo_url: designer.photo_url,
      brands: designer.brands.join(', '),
      achievements: designer.achievements.join('\n'),
      signature_style: designer.signature_style,
    });
    setSelectedDesigner(designer);
    setIsEditingDesigner(true);
  };

  if (loading) {
    return <div className="text-white">Caricamento...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestione Designer</h2>
        <button
          onClick={() => setIsAddingDesigner(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Aggiungi Designer
        </button>
      </div>

      {(isAddingDesigner || isEditingDesigner) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                {isEditingDesigner ? 'Modifica Designer' : 'Nuovo Designer'}
              </h3>
              <button
                onClick={() => {
                  setIsAddingDesigner(false);
                  setIsEditingDesigner(false);
                  resetDesignerForm();
                }}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nome"
                value={designerForm.name}
                onChange={(e) => setDesignerForm({ ...designerForm, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg"
              />
              <input
                type="text"
                placeholder="Slug (es: giorgio-armani)"
                value={designerForm.slug}
                onChange={(e) => setDesignerForm({ ...designerForm, slug: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg"
              />
              <textarea
                placeholder="Biografia"
                value={designerForm.bio}
                onChange={(e) => setDesignerForm({ ...designerForm, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg"
              />
              <input
                type="date"
                placeholder="Data di nascita"
                value={designerForm.birth_date}
                onChange={(e) => setDesignerForm({ ...designerForm, birth_date: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg"
              />
              <input
                type="text"
                placeholder="Luogo di nascita"
                value={designerForm.birth_place}
                onChange={(e) => setDesignerForm({ ...designerForm, birth_place: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg"
              />
              <input
                type="text"
                placeholder="URL foto"
                value={designerForm.photo_url}
                onChange={(e) => setDesignerForm({ ...designerForm, photo_url: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg"
              />
              <input
                type="text"
                placeholder="Brand (separati da virgola)"
                value={designerForm.brands}
                onChange={(e) => setDesignerForm({ ...designerForm, brands: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg"
              />
              <textarea
                placeholder="Achievements (uno per riga)"
                value={designerForm.achievements}
                onChange={(e) => setDesignerForm({ ...designerForm, achievements: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg"
              />
              <input
                type="text"
                placeholder="Stile distintivo"
                value={designerForm.signature_style}
                onChange={(e) => setDesignerForm({ ...designerForm, signature_style: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg"
              />

              <button
                onClick={isEditingDesigner ? handleUpdateDesigner : handleAddDesigner}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                {isEditingDesigner ? 'Aggiorna' : 'Crea'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-xl font-bold text-white mb-4">Lista Designer</h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {designers.map((designer) => (
              <div
                key={designer.id}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedDesigner?.id === designer.id ? 'bg-blue-900' : 'bg-gray-900 hover:bg-gray-700'
                }`}
                onClick={() => setSelectedDesigner(designer)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{designer.name}</h4>
                    <p className="text-gray-400 text-sm">{designer.birth_place}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        editDesigner(designer);
                      }}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDesigner(designer.id);
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">
              {selectedDesigner ? `Video di ${selectedDesigner.name}` : 'Seleziona un designer'}
            </h3>
            {selectedDesigner && (
              <button
                onClick={() => setIsAddingVideo(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                <Plus size={18} />
                Aggiungi Video
              </button>
            )}
          </div>

          {isAddingVideo && selectedDesigner && (
            <div className="mb-4 p-4 bg-gray-900 rounded-lg space-y-3">
              <input
                type="text"
                placeholder="Titolo video"
                value={videoForm.title}
                onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
              />
              <textarea
                placeholder="Descrizione"
                value={videoForm.description}
                onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
              />
              <input
                type="text"
                placeholder="URL thumbnail"
                value={videoForm.thumbnail_url}
                onChange={(e) => setVideoForm({ ...videoForm, thumbnail_url: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
              />
              <input
                type="text"
                placeholder="URL video"
                value={videoForm.video_url}
                onChange={(e) => setVideoForm({ ...videoForm, video_url: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
              />
              <input
                type="text"
                placeholder="Durata (es: 45:30)"
                value={videoForm.duration}
                onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
              />
              <input
                type="number"
                placeholder="Anno"
                value={videoForm.year}
                onChange={(e) => setVideoForm({ ...videoForm, year: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddVideo}
                  className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  <Save size={18} className="inline mr-2" />
                  Salva
                </button>
                <button
                  onClick={() => {
                    setIsAddingVideo(false);
                    resetVideoForm();
                  }}
                  className="flex-1 bg-gray-700 text-white py-2 rounded hover:bg-gray-600"
                >
                  Annulla
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {selectedDesigner ? (
              designerVideos.length > 0 ? (
                designerVideos.map((video) => (
                  <div key={video.id} className="p-3 bg-gray-900 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{video.title}</h4>
                        <p className="text-gray-400 text-sm">Anno: {video.year}</p>
                        <p className="text-gray-500 text-xs">Durata: {video.duration}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteVideo(video.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">Nessun video per questo designer</p>
              )
            ) : (
              <p className="text-gray-400 text-center py-8">Seleziona un designer per vedere i video</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
