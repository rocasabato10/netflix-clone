import { X, ArrowLeft } from 'lucide-react';
import { Designer } from '../types';

interface DesignersModalProps {
  designers: Designer[];
  onClose: () => void;
  onDesignerClick: (designer: Designer) => void;
}

export default function DesignersModal({ designers, onClose, onDesignerClick }: DesignersModalProps) {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCloseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-95 z-50 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="min-h-screen px-3 sm:px-4 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6 sm:mb-8 sticky top-0 bg-black bg-opacity-90 backdrop-blur-sm py-4 z-10">
            <div className="flex items-center gap-4">
              <button
                onClick={handleCloseClick}
                className="p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full transition-all flex items-center justify-center"
                title="Torna indietro"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>
              <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-white">
                Fashion Designers
              </h2>
            </div>
            <button
              onClick={handleCloseClick}
              className="p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full transition-all"
              title="Chiudi"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {designers.map((designer) => (
              <div
                key={designer.id}
                onClick={() => {
                  onDesignerClick(designer);
                  onClose();
                }}
                className="group cursor-pointer bg-neutral-900 rounded-lg overflow-hidden hover:ring-2 hover:ring-amber-500 transition-all duration-300"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={designer.photo_url || 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg'}
                    alt={designer.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-2 sm:p-4">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-1 line-clamp-2">
                    {designer.name}
                  </h3>
                  {designer.birth_place && (
                    <p className="text-xs sm:text-sm text-neutral-400 line-clamp-1">
                      {designer.birth_place}
                    </p>
                  )}
                  {designer.brands && designer.brands.length > 0 && (
                    <p className="text-xs text-amber-500 mt-1 sm:mt-2 line-clamp-1">
                      {designer.brands[0]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {designers.length === 0 && (
            <div className="text-center py-12 sm:py-20">
              <p className="text-neutral-500 text-base sm:text-lg">No designers found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
