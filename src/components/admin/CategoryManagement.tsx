import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
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

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showSubcategoryForm, setShowSubcategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [subcategorySlug, setSubcategorySlug] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

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

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCategory) {
      const { error } = await supabase
        .from('categories')
        .update({ name: categoryName, slug: categorySlug })
        .eq('id', editingCategory.id);

      if (!error) {
        fetchCategories();
        resetCategoryForm();
      }
    } else {
      const { error } = await supabase
        .from('categories')
        .insert({ name: categoryName, slug: categorySlug });

      if (!error) {
        fetchCategories();
        resetCategoryForm();
      }
    }
  };

  const handleSaveSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingSubcategory) {
      const { error } = await supabase
        .from('subcategories')
        .update({
          name: subcategoryName,
          slug: subcategorySlug,
          category_id: selectedCategoryId,
        })
        .eq('id', editingSubcategory.id);

      if (!error) {
        fetchSubcategories();
        resetSubcategoryForm();
      }
    } else {
      const { error } = await supabase.from('subcategories').insert({
        name: subcategoryName,
        slug: subcategorySlug,
        category_id: selectedCategoryId,
      });

      if (!error) {
        fetchSubcategories();
        resetSubcategoryForm();
      }
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Sei sicuro? Verranno eliminate anche tutte le sottocategorie associate.')) return;

    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (!error) {
      fetchCategories();
      fetchSubcategories();
    }
  };

  const handleDeleteSubcategory = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa sottocategoria?')) return;

    const { error } = await supabase.from('subcategories').delete().eq('id', id);

    if (!error) {
      fetchSubcategories();
    }
  };

  const resetCategoryForm = () => {
    setCategoryName('');
    setCategorySlug('');
    setEditingCategory(null);
    setShowCategoryForm(false);
  };

  const resetSubcategoryForm = () => {
    setSubcategoryName('');
    setSubcategorySlug('');
    setSelectedCategoryId('');
    setEditingSubcategory(null);
    setShowSubcategoryForm(false);
  };

  const startEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategorySlug(category.slug);
    setShowCategoryForm(true);
  };

  const startEditSubcategory = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setSubcategoryName(subcategory.name);
    setSubcategorySlug(subcategory.slug);
    setSelectedCategoryId(subcategory.category_id);
    setShowSubcategoryForm(true);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : '';
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Categorie</h2>
          <button
            onClick={() => setShowCategoryForm(!showCategoryForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Nuova Categoria
          </button>
        </div>

        {showCategoryForm && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingCategory ? 'Modifica Categoria' : 'Nuova Categoria'}
            </h3>
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => {
                    setCategoryName(e.target.value);
                    if (!editingCategory) {
                      setCategorySlug(generateSlug(e.target.value));
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={resetCategoryForm}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingCategory ? 'Salva' : 'Crea'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Tag size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-xs text-gray-500">{category.slug}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => startEditCategory(category)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Sottocategorie</h2>
          <button
            onClick={() => setShowSubcategoryForm(!showSubcategoryForm)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={18} />
            Nuova Sottocategoria
          </button>
        </div>

        {showSubcategoryForm && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingSubcategory ? 'Modifica Sottocategoria' : 'Nuova Sottocategoria'}
            </h3>
            <form onSubmit={handleSaveSubcategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria Principale
                </label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleziona una categoria</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  value={subcategoryName}
                  onChange={(e) => {
                    setSubcategoryName(e.target.value);
                    if (!editingSubcategory) {
                      setSubcategorySlug(generateSlug(e.target.value));
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={subcategorySlug}
                  onChange={(e) => setSubcategorySlug(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={resetSubcategoryForm}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {editingSubcategory ? 'Salva' : 'Crea'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subcategories.map((subcategory) => (
            <div
              key={subcategory.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{subcategory.name}</h3>
                  <p className="text-xs text-gray-500 mb-1">{subcategory.slug}</p>
                  <p className="text-xs text-blue-600">
                    {getCategoryName(subcategory.category_id)}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => startEditSubcategory(subcategory)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteSubcategory(subcategory.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
