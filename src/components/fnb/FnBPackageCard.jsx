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
      className={`card group overflow-hidden transition-all duration-500 animate-fade-in-up relative
        ${isSelected ? 'ring-4 ring-gold-foil border-transparent scale-[1.02] shadow-2xl kantha-glow' : 'hover:shadow-2xl hover:-translate-y-1'}`}
      style={isSelected ? { animation: 'peacockSheen 4s infinite linear' } : {}}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      {/* Image Container - Hover effect only on image */}
      <div className="relative h-60 overflow-hidden bg-gray-100">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="diya-spinner"></div>
          </div>
        )}
        <img
          src={primaryImage}
          alt={pkg.name}
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
            <span className="text-xl">{getCategoryIcon()}</span>
          </div>
          <span className="bandhani-badge bandhani-badge-saffron text-[8px] uppercase">{pkg.category}</span>
        </div>

        <div className="absolute top-2 right-2">
          <span className="bandhani-badge bandhani-badge-emerald text-[8px]">
             FROM {formatCurrency(pkg.pricePerPerson.low)}
          </span>
        </div>

        {/* Cuisine Tags */}
        <div className="absolute bottom-2 left-2 flex gap-1">
          {pkg.cuisineType?.slice(0, 2).map((cuisine, idx) => (
            <span key={idx} className="bandhani-badge text-[8px]" style={{ background: '#A855F7', color: '#fff' }}>
              {cuisine.toUpperCase()}
            </span>
          ))}
        </div>

        {/* Hover Details with Kantha Line */}
        {showDetails && (
          <div className="absolute inset-0 bg-black/85 text-white p-5 flex flex-col justify-center items-center text-center transition-opacity duration-300 saree-border-left border-emerald-500">
            <p className="font-heading text-lg text-emerald-400 mb-2">Package Highlights</p>
            <div className="kantha-line opacity-30 !h-[1px] w-full mb-3"></div>
            <div className="grid grid-cols-2 gap-3 text-[10px] w-full">
              {pkg.menuItems?.slice(0, 6).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white/5 p-1 rounded">
                  <span className={`${item.isVeg ? 'text-emerald-400' : 'text-red-400'}`}>{item.isVeg ? '🌱' : '🍗'}</span>
                  <span className="truncate opacity-90">{item.name}</span>
                </div>
              ))}
            </div>
            <p className="text-[8px] mt-4 opacity-70 italic tracking-widest font-bold uppercase">View full menu in details</p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 saree-border-left border-transparent" style={{ borderLeftColor: isSelected ? '#FFD700' : 'rgba(239, 68, 68, 0.2)' }}>
        <div className="flex justify-between items-start mb-1.5">
          <h3 className="font-heading text-base text-saffron-600 leading-snug">{pkg.name}</h3>
          {pkg.isFeatured && (
             <span className="bandhani-badge text-[8px] bg-yellow-100 text-yellow-700">FEATURED</span>
          )}
        </div>
        
        <p className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
          <span>{getMealTypeIcon()}</span>
          <span className="capitalize">{pkg.mealType}</span>
          <span className="mx-1">•</span>
          <span>Min {pkg.minimumGuests} guests</span>
        </p>
        
        <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">{pkg.description}</p>

        {/* Menu Preview */}
        <div className="mb-3">
          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Package Includes:</p>
          <div className="flex flex-wrap gap-1">
            {pkg.includes?.slice(0, 3).map((item, idx) => (
              <span key={idx} className="bandhani-badge !bg-gray-100 !text-gray-500 text-[8px]">
                {item.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Investment</p>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-emerald-600 font-heading">{formatCurrency(pkg.pricePerPerson.low)}</span>
              <span className="text-gray-300 text-xs">~</span>
              <span className="text-lg font-bold text-saffron-600 font-heading">{formatCurrency(pkg.pricePerPerson.high)}</span>
            </div>
            <p className="text-[8px] text-gray-400 italic">per hungry guest</p>
          </div>
          <div className="text-right">
             <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Service</p>
             <p className="text-[10px] font-bold text-saffron-600">{pkg.staffingRequired} STAFF / 50</p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onSelect(pkg)}
          className={`w-full mt-4 py-2 text-sm font-bold uppercase tracking-widest transition relative z-10 
            ${isSelected ? 'btn-primary' : 'btn-secondary shadow-lg'}`}
        >
          {isSelected ? '✓ In Wedding Menu' : 'Finalize Catering'}
        </button>
      </div>
    </div>
  );
};

export default FnBPackageCard;