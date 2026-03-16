import React, { useState } from 'react';
import { ARTIST_CATEGORIES } from '../../utils/constants/artistConstants';

const ArtistCard = ({ artist, onSelect, isSelected }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format';
  const primaryImage = artist.images?.find(img => img.isPrimary) || artist.images?.[0];
  
  const imageUrl = imageError ? fallbackImage : (primaryImage?.url || fallbackImage);
  
  const categoryIcon = ARTIST_CATEGORIES.find(c => c.id === artist.category)?.icon || '🎤';

  return (
    <div 
      className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300
        ${isSelected ? 'ring-4 ring-saffron-500 transform scale-[1.02]' : 'hover:shadow-xl'}`}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-saffron-500 border-t-transparent"></div>
          </div>
        )}
        <img
          src={imageUrl}
          alt={artist.name}
          className={`w-full h-full object-cover transition-transform duration-500 hover:scale-110
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
        />
        
        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <span className="bg-saffron-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <span>{categoryIcon}</span>
            <span>{artist.category}</span>
          </span>
        </div>

        {/* Verified Badge */}
        {artist.isVerified && (
          <div className="absolute top-2 right-2">
            <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
              ✓ Verified
            </span>
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute bottom-2 left-2">
          <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <span>⭐</span>
            <span>{artist.rating} ({artist.reviewCount})</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-heading text-lg text-saffron-600">{artist.name}</h3>
          {artist.isFeatured && (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
              Featured
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-600 mb-2">
          {artist.experience}+ years • {artist.basedIn.city}
        </p>
        
        <p className="text-sm text-gray-500 line-clamp-2 mb-2">{artist.description}</p>

        {/* Languages */}
        <div className="flex flex-wrap gap-1 mb-2">
          {artist.languages?.slice(0, 3).map((lang, idx) => (
            <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              {lang}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="mt-2">
          <p className="text-xs text-gray-500">Starting from</p>
          <p className="text-lg font-bold text-emerald-600">
            {formatCurrency(artist.priceRange.low)}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onSelect(artist)}
          className={`w-full mt-3 py-2 rounded-lg text-sm font-medium transition
            ${isSelected 
              ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
              : 'bg-saffron-500 text-white hover:bg-saffron-600'}`}
        >
          {isSelected ? '✓ Selected' : 'Book Artist'}
        </button>
      </div>
    </div>
  );
};

export default ArtistCard;