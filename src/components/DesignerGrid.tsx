import { useState, useEffect } from 'react';
import { Designer } from '../types';
import { supabase } from '../lib/supabase';
import DesignerCard from './DesignerCard';

export default function DesignerGrid() {
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDesigners();
  }, []);

  const loadDesigners = async () => {
    try {
      const { data, error } = await supabase
        .from('designers')
        .select('*')
        .order('name');

      if (error) throw error;
      setDesigners(data || []);
    } catch (error) {
      console.error('Error loading designers:', error);
    } finally {
      setLoading(false);
    }
  };

if (loading) {
    return (
      <div className="flex items-center justify-center py-12 sm:py-20">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-12">
      <div className="mb-6 sm:mb-12 text-center px-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">Fashion Designers</h1>
        <p className="text-sm sm:text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto">
          Explore the lives and legacies of fashion's most iconic designers. Click on any designer to discover their story and watch related content.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
        {designers.map((designer) => (
          <DesignerCard key={designer.id} designer={designer} />
        ))}
      </div>

      {designers.length === 0 && (
        <div className="text-center py-12 sm:py-20">
          <p className="text-neutral-500 text-base sm:text-lg">No designers found.</p>
        </div>
      )}
    </div>
  );
}
