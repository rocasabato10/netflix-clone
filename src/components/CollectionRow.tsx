import { ChevronRight } from 'lucide-react';

export interface Collection {
  id: string;
  name: string;
  description: string;
  designer_id: string;
  year: number;
  season?: string;
  thumbnail_url?: string;
  display_order?: number;
}

interface CollectionRowProps {
  title: string;
  collections: Collection[];
  onCollectionClick: (collection: Collection) => void;
}

export default function CollectionRow({ title, collections, onCollectionClick }: CollectionRowProps) {
  if (collections.length === 0) return null;

  return (
    <div className="px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {collections.map((collection) => (
          <button
            key={collection.id}
            onClick={() => onCollectionClick(collection)}
            className="group relative bg-gray-900 rounded-lg overflow-hidden hover:ring-2 hover:ring-white transition-all duration-300 transform hover:scale-105"
          >
            {collection.thumbnail_url ? (
              <div className="aspect-[3/4] relative">
                <img
                  src={collection.thumbnail_url}
                  alt={collection.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>
            ) : (
              <div className="aspect-[3/4] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center px-4">
                  <div className="text-6xl font-bold text-white/20 mb-2">
                    {collection.year}
                  </div>
                </div>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-bold text-lg mb-1 group-hover:text-yellow-400 transition-colors">
                {collection.name}
              </h3>
              {collection.season && (
                <p className="text-gray-300 text-sm capitalize">{collection.season}</p>
              )}
              <div className="flex items-center text-gray-400 text-sm mt-2 group-hover:text-white transition-colors">
                <span>Esplora</span>
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
