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
      className={`card group overflow-hidden transition-all duration-500 animate-fade-in-up
        ${isSelected ? 'ring-4 ring-gold-foil border-transparent scale-[1.02] shadow-2xl kantha-glow' : 'hover:shadow-2xl hover:-translate-y-1'}`}
      style={isSelected ? { animation: 'peacockSheen 4s infinite linear' } : {}}
    >
      {/* Image Container */}
      <div className="relative h-60 overflow-hidden bg-gray-100">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="diya-spinner"></div>
          </div>
        )}
        <img
          src={imageUrl}
          alt={artist.name}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
        />
        
        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <div className="jharokha-icon w-10 h-10 bg-white/90 shadow-sm flex items-center justify-center !rounded-none transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
            <span className="text-xl">{categoryIcon}</span>
          </div>
          <span className="bandhani-badge bandhani-badge-saffron absolute -bottom-1 -right-4 scale-75 text-[8px]">
             {artist.category.toUpperCase()}
          </span>
        </div>

        {/* Verified & Rating */}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
          {artist.isVerified && (
            <span className="bandhani-badge bandhani-badge-emerald text-[8px]">✓ VERIFIED</span>
          )}
          <span className="bandhani-badge text-[8px]" style={{ background: '#A855F7', color: '#fff' }}>
            ⭐ {artist.rating} ({artist.reviewCount})
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 saree-border-left border-transparent" style={{ borderLeftColor: isSelected ? '#FFD700' : 'rgba(239, 68, 68, 0.2)' }}>
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-heading text-base text-saffron-600 leading-snug">{artist.name}</h3>
          {artist.isFeatured && (
            <span className="bandhani-badge text-[8px] bg-yellow-100 text-yellow-700">FEATURED</span>
          )}
        </div>
        
        <p className="text-xs text-gray-600 mb-1.5">
          {artist.experience}+ years • {artist.basedIn.city}
        </p>
        
        <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{artist.description}</p>

        {/* Languages */}
        <div className="flex flex-wrap gap-1 mb-2">
          {artist.languages?.slice(0, 3).map((lang, idx) => (
            <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              {lang}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Starts At</p>
            <p className="text-xl font-bold text-emerald-600 font-heading">
              {formatCurrency(artist.priceRange.low)}
            </p>
          </div>
          <div className="text-right">
             <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Experience</p>
             <p className="text-xs font-bold text-saffron-600">{artist.experience} YEARS</p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onSelect(artist)}
          className={`w-full mt-4 py-2 text-sm font-bold uppercase tracking-widest ${isSelected ? 'btn-primary' : 'btn-secondary shadow-lg'}`}
        >
          {isSelected ? '✓ Selected' : 'Experience Artistry'}
        </button>
      </div>
    </div>
  );
};

export default ArtistCard;