import { X } from 'lucide-react';
import { useState } from 'react';

interface AdBannerProps {
  onClose?: () => void;
}

export default function AdBanner({ onClose }: AdBannerProps) {
  const [closed, setClosed] = useState(false);

  const handleClose = () => {
    setClosed(true);
    if (onClose) onClose();
  };

  if (closed) return null;

  return (
    <div className="relative bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-lg p-6 mb-4">
      {onClose && (
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white transition"
        >
          <X size={20} />
        </button>
      )}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">PUBBLICITÀ</p>
          <p className="text-white font-semibold mb-2">
            Passa a Premium per un'esperienza senza interruzioni
          </p>
          <p className="text-gray-300 text-sm">
            Elimina tutte le pubblicità e goditi i contenuti in modalità premium
          </p>
        </div>
        <div className="ml-4">
          <button className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition font-semibold whitespace-nowrap">
            Scopri Premium
          </button>
        </div>
      </div>
    </div>
  );
}
