import { useState, useEffect } from 'react';
import { Designer } from '../types';
import { supabase } from '../lib/supabase';
import DesignerCard from './DesignerCard';
import DesignerRow from './DesignerRow';
import DesignersModal from './DesignersModal';

export default function DesignerGrid() {
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesigner, setSelectedDesigner] = useState<Designer | null>(null);
  const [showAllModal, setShowAllModal] = useState(false);

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
    <>
      <DesignerRow
        title="Fashion Designers"
        designers={designers}
        onDesignerClick={setSelectedDesigner}
        onViewAll={() => setShowAllModal(true)}
      />

      {showAllModal && (
        <DesignersModal
          designers={designers}
          onClose={() => setShowAllModal(false)}
          onDesignerClick={setSelectedDesigner}
        />
      )}

      {selectedDesigner && (
        <DesignerCard
          designer={selectedDesigner}
          onClose={() => setSelectedDesigner(null)}
        />
      )}
    </>
  );
}
