import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check, ChevronDown, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Category, Subcategory } from '../lib/supabase';

interface CategoryManagerProps {
  categories: Category[];
  onUpdate: () => void;
}

export default function CategoryManager({ categories, onUpdate }: CategoryManagerProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingSubcategory, setIsAddingSubcategory] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingSubcategoryId, setEditingSubcategoryId] = useState<string | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({ name: '', slug: '', order: 0 });
  const [subcategoryFormData, setSubcategoryFormData] = useState({ name: '', slug: '', order: 0, category_id: '' });

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAddCategory = async () => {
    if (!categoryFormData.name || !categoryFormData.slug) {
      alert('Nome e slug sono obbligatori');
      return;
    }

    const { error } = await supabase.from('categories').insert([
      {
        name: categoryFormData.name,
        slug: categoryFormData.slug,
        order: categoryFormData.order || categories.length,
      },
    ]);

    if (error) {
      console.error('Error adding category:', error);
      alert('Errore durante l\'aggiunta della categoria');
      return;
    }

    setCategoryFormData({ name: '', slug: '', order: 0 });
    setIsAddingCategory(false);
    onUpdate();
  };

  const handleEditCategory = async (categoryId: string) => {
    if (!categoryFormData.name || !categoryFormData.slug) {
      alert('Nome e slug sono obbligatori');
      return;
    }

    const { error } = await supabase
      .from('categories')
      .update({
        name: categoryFormData.name,
        slug: categoryFormData.slug,
        order: categoryFormData.order,
      })
      .eq('id', categoryId);

    if (error) {
      console.error('Error updating category:', error);
      alert('Errore durante l\'aggiornamento della categoria');
      return;
    }

    setCategoryFormData({ name: '', slug: '', order: 0 });
    setEditingCategoryId(null);
    onUpdate();
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa categoria e tutte le sue sottocategorie?')) {
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

  const handleAddSubcategory = async () => {
    if (!subcategoryFormData.name || !subcategoryFormData.slug || !subcategoryFormData.category_id) {
      alert('Nome, slug e categoria sono obbligatori');
      return;
    }

    const { error } = await supabase.from('subcategories').insert([
      {
        name: subcategoryFormData.name,
        slug: subcategoryFormData.slug,
        order: subcategoryFormData.order,
        category_id: subcategoryFormData.category_id,
      },
    ]);

    if (error) {
      console.error('Error adding subcategory:', error);
      alert('Errore durante l\'aggiunta della sottocategoria');
      return;
    }

    setSubcategoryFormData({ name: '', slug: '', order: 0, category_id: '' });
    setIsAddingSubcategory(null);
    onUpdate();
  };

  const handleEditSubcategory = async (subcategoryId: string) => {
    if (!subcategoryFormData.name || !subcategoryFormData.slug) {
      alert('Nome e slug sono obbligatori');
      return;
    }

    const { error } = await supabase
      .from('subcategories')
      .update({
        name: subcategoryFormData.name,
        slug: subcategoryFormData.slug,
        order: subcategoryFormData.order,
      })
      .eq('id', subcategoryId);

    if (error) {
      console.error('Error updating subcategory:', error);
      alert('Errore durante l\'aggiornamento della sottocategoria');
      return;
    }

    setSubcategoryFormData({ name: '', slug: '', order: 0, category_id: '' });
    setEditingSubcategoryId(null);
    onUpdate();
  };

  const handleDeleteSubcategory = async (subcategoryId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa sottocategoria?')) {
      return;
    }

    const { error } = await supabase.from('subcategories').delete().eq('id', subcategoryId);

    if (error) {
      console.error('Error deleting subcategory:', error);
      alert('Errore durante l\'eliminazione della sottocategoria');
      return;
    }

    onUpdate();
  };

  const startEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setCategoryFormData({
      name: category.name,
      slug: category.slug,
      order: category.order,
    });
    setIsAddingCategory(false);
  };

  const startEditSubcategory = (subcategory: Subcategory) => {
    setEditingSubcategoryId(subcategory.id);
    setSubcategoryFormData({
      name: subcategory.name,
      slug: subcategory.slug,
      order: subcategory.order,
      category_id: subcategory.category_id,
    });
    setIsAddingSubcategory(null);
  };

  const cancelEdit = () => {
    setEditingCategoryId(null);
    setEditingSubcategoryId(null);
    setIsAddingCategory(false);
    setIsAddingSubcategory(null);
    setCategoryFormData({ name: '', slug: '', order: 0 });
    setSubcategoryFormData({ name: '', slug: '', order: 0, category_id: '' });
  };

  const startAddCategory = () => {
    setIsAddingCategory(true);
    setEditingCategoryId(null);
    setCategoryFormData({ name: '', slug: '', order: categories.length });
  };

  const startAddSubcategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    const subcategoryCount = category?.subcategories?.length || 0;
    setIsAddingSubcategory(categoryId);
    setEditingSubcategoryId(null);
    setSubcategoryFormData({ name: '', slug: '', order: subcategoryCount, category_id: categoryId });
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestione Categorie e Sottocategorie</h2>
        <button
          onClick={startAddCategory}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
        >
          <Plus size={20} />
          Aggiungi Categoria
        </button>
      </div>

      <div className="p-6">
        {isAddingCategory && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Nuova Categoria</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                <input
                  type="text"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Es: Moda Donna"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Slug</label>
                <input
                  type="text"
                  value={categoryFormData.slug}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="es: moda-donna"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ordine</label>
                <input
                  type="number"
                  value={categoryFormData.order}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddCategory}
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
            <div key={category.id} className="bg-gray-800 rounded-lg overflow-hidden">
              {editingCategoryId === category.id ? (
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                      <input
                        type="text"
                        value={categoryFormData.name}
                        onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Slug</label>
                      <input
                        type="text"
                        value={categoryFormData.slug}
                        onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Ordine</label>
                      <input
                        type="number"
                        value={categoryFormData.order}
                        onChange={(e) => setCategoryFormData({ ...categoryFormData, order: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditCategory(category.id)}
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
                <>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="text-gray-400 hover:text-white transition"
                      >
                        {expandedCategories.has(category.id) ? (
                          <ChevronDown size={20} />
                        ) : (
                          <ChevronRight size={20} />
                        )}
                      </button>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                        <p className="text-sm text-gray-400">
                          Slug: {category.slug} | Ordine: {category.order} | Sottocategorie: {category.subcategories?.length || 0}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startAddSubcategory(category.id)}
                        className="flex items-center gap-1 text-green-400 hover:text-green-300 transition text-sm"
                      >
                        <Plus size={16} />
                        Sottocategoria
                      </button>
                      <button
                        onClick={() => startEditCategory(category)}
                        className="p-2 text-blue-400 hover:text-blue-300 transition"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-2 text-red-400 hover:text-red-300 transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  {expandedCategories.has(category.id) && (
                    <div className="px-4 pb-4 pl-12">
                      {isAddingSubcategory === category.id && (
                        <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                          <h4 className="text-md font-semibold text-white mb-3">Nuova Sottocategoria</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-300 mb-1">Nome</label>
                              <input
                                type="text"
                                value={subcategoryFormData.name}
                                onChange={(e) => setSubcategoryFormData({ ...subcategoryFormData, name: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                                placeholder="Es: Fashion Films"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-300 mb-1">Slug</label>
                              <input
                                type="text"
                                value={subcategoryFormData.slug}
                                onChange={(e) => setSubcategoryFormData({ ...subcategoryFormData, slug: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                                placeholder="es: fashion-films"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-300 mb-1">Ordine</label>
                              <input
                                type="number"
                                value={subcategoryFormData.order}
                                onChange={(e) => setSubcategoryFormData({ ...subcategoryFormData, order: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={handleAddSubcategory}
                              className="flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition text-sm font-semibold"
                            >
                              <Check size={16} />
                              Salva
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="flex items-center gap-2 bg-gray-600 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition text-sm font-semibold"
                            >
                              <X size={16} />
                              Annulla
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        {category.subcategories?.map((subcategory) => (
                          <div key={subcategory.id} className="bg-gray-700 rounded-lg p-3">
                            {editingSubcategoryId === subcategory.id ? (
                              <div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">Nome</label>
                                    <input
                                      type="text"
                                      value={subcategoryFormData.name}
                                      onChange={(e) => setSubcategoryFormData({ ...subcategoryFormData, name: e.target.value })}
                                      className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">Slug</label>
                                    <input
                                      type="text"
                                      value={subcategoryFormData.slug}
                                      onChange={(e) => setSubcategoryFormData({ ...subcategoryFormData, slug: e.target.value })}
                                      className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">Ordine</label>
                                    <input
                                      type="number"
                                      value={subcategoryFormData.order}
                                      onChange={(e) => setSubcategoryFormData({ ...subcategoryFormData, order: parseInt(e.target.value) })}
                                      className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditSubcategory(subcategory.id)}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                                  >
                                    <Check size={16} />
                                    Salva
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className="flex items-center gap-2 bg-gray-600 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition text-sm font-semibold"
                                  >
                                    <X size={16} />
                                    Annulla
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h4 className="text-md font-medium text-white">{subcategory.name}</h4>
                                  <p className="text-xs text-gray-400">
                                    Slug: {subcategory.slug} | Ordine: {subcategory.order}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => startEditSubcategory(subcategory)}
                                    className="p-1.5 text-blue-400 hover:text-blue-300 transition"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSubcategory(subcategory.id)}
                                    className="p-1.5 text-red-400 hover:text-red-300 transition"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
