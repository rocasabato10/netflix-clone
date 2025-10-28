import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Category } from '../lib/supabase';

interface CategoryManagerProps {
  categories: Category[];
  onUpdate: () => void;
}

export default function CategoryManager({ categories, onUpdate }: CategoryManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', order: 0 });

  const handleAdd = async () => {
    if (!formData.name || !formData.slug) {
      alert('Nome e slug sono obbligatori');
      return;
    }

    const { error } = await supabase.from('categories').insert([
      {
        name: formData.name,
        slug: formData.slug,
        order: formData.order || categories.length,
      },
    ]);

    if (error) {
      console.error('Error adding category:', error);
      alert('Errore durante l\'aggiunta della categoria');
      return;
    }

    setFormData({ name: '', slug: '', order: 0 });
    setIsAdding(false);
    onUpdate();
  };

  const handleEdit = async (categoryId: string) => {
    if (!formData.name || !formData.slug) {
      alert('Nome e slug sono obbligatori');
      return;
    }

    const { error } = await supabase
      .from('categories')
      .update({
        name: formData.name,
        slug: formData.slug,
        order: formData.order,
      })
      .eq('id', categoryId);

    if (error) {
      console.error('Error updating category:', error);
      alert('Errore durante l\'aggiornamento della categoria');
      return;
    }

    setFormData({ name: '', slug: '', order: 0 });
    setEditingId(null);
    onUpdate();
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa categoria?')) {
      return;
    }

    const { error } = await supabase.from('categories').delete().eq('id', categoryId);

    if (error) {
      console.error('Error deleting category:', error);
      alert('Errore durante l\'eliminazione della categoria');
      return;
    }

    onUpdate();
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      slug: category.slug,
      order: category.order,
    });
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: '', slug: '', order: 0 });
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({ name: '', slug: '', order: categories.length });
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestione Categorie</h2>
        <button
          onClick={startAdd}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
        >
          <Plus size={20} />
          Aggiungi Categoria
        </button>
      </div>

      <div className="p-6">
        {isAdding && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Nuova Categoria</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Es: Moda Donna"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="es: moda-donna"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ordine
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                <Check size={18} />
                Salva
              </button>
              <button
                onClick={cancelEdit}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition font-semibold"
              >
                <X size={18} />
                Annulla
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition"
            >
              {editingId === category.id ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nome
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Slug
                      </label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Ordine
                      </label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(category.id)}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                      <Check size={18} />
                      Salva
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition font-semibold"
                    >
                      <X size={18} />
                      Annulla
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                    <p className="text-sm text-gray-400">Slug: {category.slug} | Ordine: {category.order}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(category)}
                      className="p-2 text-blue-400 hover:text-blue-300 transition"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-red-400 hover:text-red-300 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
