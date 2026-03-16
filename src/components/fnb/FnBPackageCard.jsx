import React, { useState } from 'react';
import { MEAL_TYPES } from '../../utils/constants/fnbConstants';

const FnBPackageCard = ({ package: pkg, onSelect, isSelected }) => {
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

  const fallbackImage = 'https://images.unsplash.com/photo-1555244162-803834f70033?w=500&auto=format';
  const primaryImage = pkg.images?.[0]?.url || fallbackImage;

  const getCategoryIcon = () => {
    switch(pkg.category) {
      case 'meal': return '🍽️';
      case 'bar': return '🍸';
      case 'counter': return '🍛';
      case 'dessert': return '🍰';
      case 'beverage': return '🥤';
      default: return '🍽️';
    }
  };

  const getMealTypeIcon = () => {
    const meal = MEAL_TYPES.find(m => m.id === pkg.mealType);
    return meal?.icon || '🍽️';
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 relative
        ${isSelected ? 'ring-4 ring-saffron-500 transform scale-[1.02]' : 'hover:shadow-xl'}`}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      {/* Image Container - Hover effect only on image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-saffron-500 border-t-transparent"></div>
          </div>
        )}
        <img
          src={primaryImage}
          alt={pkg.name}
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
            <span>{getCategoryIcon()}</span>
            <span className="capitalize">{pkg.category}</span>
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute top-2 right-2">
          <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
            From {formatCurrency(pkg.pricePerPerson.low)}
          </span>
        </div>

        {/* Cuisine Tags */}
        <div className="absolute bottom-2 left-2 flex gap-1">
          {pkg.cuisineType?.slice(0, 2).map((cuisine, idx) => (
            <span key={idx} className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
              {cuisine}
            </span>
          ))}
        </div>

        {/* Hover Details - Only overlays the image, not the whole card */}
        {showDetails && (
          <div className="absolute inset-0 bg-black/80 text-white p-4 flex flex-col justify-center items-center text-center">
            <p className="text-sm font-medium mb-2">Full Menu:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {pkg.menuItems?.slice(0, 6).map((item, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  {item.isVeg ? '🟢' : '🔴'}
                  <span className="truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content - Always visible, never covered */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-heading text-lg text-saffron-600">{pkg.name}</h3>
          {pkg.isFeatured && (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
              Featured
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
          <span>{getMealTypeIcon()}</span>
          <span className="capitalize">{pkg.mealType}</span>
          <span className="mx-1">•</span>
          <span>Min {pkg.minimumGuests} guests</span>
        </p>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{pkg.description}</p>

        {/* Menu Preview */}
        <div className="mb-2">
          <p className="text-xs font-medium text-gray-500 mb-1">Includes:</p>
          <div className="flex flex-wrap gap-1">
            {pkg.includes?.slice(0, 3).map((item, idx) => (
              <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Price per person</p>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-emerald-600 font-bold">{formatCurrency(pkg.pricePerPerson.low)}</span>
              <span className="text-gray-400">-</span>
              <span className="text-saffron-600 font-bold">{formatCurrency(pkg.pricePerPerson.high)}</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            🤵 {pkg.staffingRequired} staff/50 guests
          </div>
        </div>

        {/* Action Button - Always clickable with high z-index */}
        <button
          onClick={() => onSelect(pkg)}
          className={`w-full mt-3 py-2 rounded-lg text-sm font-medium transition relative z-10
            ${isSelected 
              ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
              : 'bg-saffron-500 text-white hover:bg-saffron-600'}`}
        >
          {isSelected ? '✓ Selected' : 'Add to Wedding'}
        </button>
      </div>
    </div>
  );
};

export default FnBPackageCard;