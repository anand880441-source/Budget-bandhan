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
      className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 relative
        ${isSelected ? 'ring-4 ring-saffron-500 transform scale-[1.02]' : 'hover:shadow-xl'}`}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
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
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-500 hover:scale-110
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
        />
        
        {/* Function Badge */}
        <div className="absolute top-2 left-2">
          <span className="bg-saffron-500 text-white text-xs px-2 py-1 rounded-full">
            {item.function === 'all' ? '✨ All' : item.function}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute top-2 right-2">
          <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
            {formatCurrency(item.priceRange.medium)}
          </span>
        </div>

        {/* Style Badge */}
        <div className="absolute bottom-2 left-2">
          <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
            {item.style}
          </span>
        </div>

        {/* Hover Details */}
        {showDetails && (
          <div className="absolute inset-0 bg-black/80 text-white p-4 flex flex-col justify-center items-center text-center transition-opacity duration-300">
            <p className="text-sm mb-2 line-clamp-3">{item.description}</p>
            <div className="space-y-1 text-sm">
              <p className="font-semibold">📦 Includes:</p>
              <ul className="text-xs opacity-90">
                {item.includes?.slice(0, 3).map((inc, idx) => (
                  <li key={idx}>• {inc}</li>
                ))}
              </ul>
            </div>
            {item.vendorName && (
              <p className="text-xs mt-2 opacity-75">✨ {item.vendorName}</p>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-heading text-lg text-saffron-600 mb-1">{item.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags?.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onSelect(item)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition z-10 relative
              ${isSelected 
                ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                : 'bg-saffron-500 text-white hover:bg-saffron-600'}`}
          >
            {isSelected ? '✓ Selected' : 'Select for Wedding'}
          </button>
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition z-10 relative"
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