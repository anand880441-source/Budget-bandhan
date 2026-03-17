import React, { useState } from 'react';

const DecorCard = ({ item, onSelect, isSelected }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Use a reliable fallback image
  const fallbackImage = 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&auto=format';
  
  const primaryImage = item.images?.find(img => img.isPrimary) || item.images?.[0];
  
  // Determine which image to show
  const imageUrl = imageError 
    ? fallbackImage 
    : (primaryImage?.url || fallbackImage);

  return (
    <div 
      className={`card group overflow-hidden transition-all duration-500 animate-fade-in-up relative
        ${isSelected ? 'ring-4 ring-gold-foil border-transparent scale-[1.02] shadow-2xl kantha-glow' : 'hover:shadow-2xl hover:-translate-y-1'}`}
      style={isSelected ? { animation: 'peacockSheen 4s infinite linear' } : {}}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
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
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
        />
        
        {/* Status Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <div className="jharokha-icon w-10 h-10 bg-white/90 shadow-sm flex items-center justify-center !rounded-none transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
            <span className="text-xl">{item.function === 'all' ? '✨' : '🏮'}</span>
          </div>
          <span className="bandhani-badge bandhani-badge-saffron text-[8px] uppercase">{item.function}</span>
        </div>

        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
          <span className="bandhani-badge bandhani-badge-emerald text-[8px]">{formatCurrency(item.priceRange.medium)}</span>
          <span className="bandhani-badge text-[8px]" style={{ background: '#A855F7', color: '#fff' }}>{item.style.toUpperCase()}</span>
        </div>

        {/* Hover Details overlay with Saree Border */}
        {showDetails && (
          <div className="absolute inset-0 bg-black/85 text-white p-5 flex flex-col justify-center items-center text-center transition-opacity duration-300 saree-border-left border-saffron-500">
            <p className="font-heading text-lg text-saffron-400 mb-2">{item.name}</p>
            <p className="text-[10px] mb-3 line-clamp-3 opacity-90 italic">"{item.description}"</p>
            <div className="kantha-line !h-[1px] opacity-30 w-full mb-3"></div>
            <div className="space-y-1 text-xs">
              <p className="font-bold text-turmeric-400 uppercase tracking-widest text-[8px]">📦 Package Components:</p>
              <ul className="text-[10px] opacity-90">
                {item.includes?.slice(0, 3).map((inc, idx) => (
                  <li key={idx}>• {inc}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 saree-border-left border-transparent" style={{ borderLeftColor: isSelected ? '#FFD700' : 'rgba(239, 68, 68, 0.2)' }}>
        <h3 className="font-heading text-base text-saffron-600 mb-1 leading-snug uppercase tracking-wide">{item.name}</h3>
        <p className="text-[11px] text-gray-500 line-clamp-2 mb-3 leading-relaxed">{item.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {item.tags?.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="bandhani-badge !bg-gray-100 !text-gray-500 text-[8px]">
              #{tag.toUpperCase()}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onSelect(item)}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest transition z-10 relative
              ${isSelected ? 'btn-primary' : 'btn-secondary shadow-md'}`}
          >
            {isSelected ? '✓ In Plan' : 'Select Decor'}
          </button>
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="btn-outline !p-2 transition z-10 relative flex items-center justify-center grayscale hover:grayscale-0"
            title="View Details"
          >
             🔍
          </button>
        </div>
      </div>
    </div>
  );
};

export default DecorCard;