import React from 'react';
import { useNavigate } from 'react-router-dom';

const BudgetResultsStep = ({ data, budgetResults, onSave, onBack, isEditing = false }) => {
  const navigate = useNavigate();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getConfidenceLevel = () => {
    if (!budgetResults) return 'medium';
    const range = budgetResults.total.high - budgetResults.total.low;
    const percentage = (range / budgetResults.total.medium) * 100;
    if (percentage < 20) return 'high';
    if (percentage < 40) return 'medium';
    return 'low';
  };

  if (!budgetResults) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-saffron-500 border-t-transparent"></div>
        <p className="mt-2 text-gray-600">Calculating your budget...</p>
      </div>
    );
  }

  const confidenceLevel = getConfidenceLevel();
  const confidenceColors = {
    high: 'text-emerald-600 bg-emerald-100',
    medium: 'text-saffron-600 bg-saffron-100',
    low: 'text-indian-red-600 bg-indian-red-100'
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="text-center">
        <h2 className="font-heading text-3xl mb-1">
          <span className="text-gold-foil">Your Wedding Budget 💍</span>
        </h2>
        <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">Estimated for {data.city}</p>
        <div className="rangoli-divider !my-4"></div>
      </div>

      {/* Total Budget Card */}
      <div
        className="text-white rounded-2xl p-6 shadow-xl relative overflow-hidden marigold-glow"
        style={{
          background: 'linear-gradient(135deg, #FF9933, #FFD700 50%, #046A38)',
          backgroundSize: '200% 200%',
          animation: 'peacockSheen 5s ease infinite'
        }}
      >
        <p className="text-[10px] opacity-80 mb-1 font-bold uppercase tracking-widest">Estimated Total Investment</p>
        <div className="flex items-baseline justify-center gap-4 my-2">
          <span className="text-4xl font-bold font-heading">{formatCurrency(budgetResults.total.low)}</span>
          <span className="text-xl opacity-60">to</span>
          <span className="text-4xl font-bold font-heading">{formatCurrency(budgetResults.total.high)}</span>
        </div>
        <div className="kantha-line !h-[1px] opacity-30 my-3"></div>
        <p className="text-sm opacity-90">
          Standard Medium estimate: <strong>{formatCurrency(budgetResults.total.medium)}</strong>
        </p>
        <div className="mt-4 flex justify-center">
          <span className={`bandhani-badge !px-4 !py-1 text-[10px] shadow-sm ${confidenceLevel === 'high' ? 'bandhani-badge-emerald' : ''}`}>
             CALCULATION CONFIDENCE: {confidenceLevel.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="card">
        <h3 className="font-heading text-xl text-saffron-600 mb-0.5">Budget Breakdown</h3>
        <p className="text-[10px] text-gray-400 mb-4 uppercase tracking-widest font-bold italic">Low &nbsp; • &nbsp; Medium &nbsp; • &nbsp; High</p>
        
        <div className="space-y-4">
          {/* Food & Beverage */}
          <div className="saree-border-left pl-3 py-1" style={{ borderLeftColor: '#046A38' }}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-sm text-gray-700">Food & Beverage</span>
              <span className="text-[10px] text-gray-400 italic">per plate</span>
            </div>
            <div className="flex justify-between text-xs font-medium">
              <span className="text-emerald-700">{formatCurrency(budgetResults.foodCost.low)}</span>
              <span className="text-saffron-600">{formatCurrency(budgetResults.foodCost.medium)}</span>
              <span className="text-purple-600">{formatCurrency(budgetResults.foodCost.high)}</span>
            </div>
          </div>
          <div className="kantha-line opacity-20 !h-[1px]"></div>

          {/* Venue Rent */}
          <div className="saree-border-left pl-3 py-1" style={{ borderLeftColor: '#FF9933' }}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-sm text-gray-700">Venue Rent</span>
            </div>
            <div className="flex justify-between text-xs font-medium">
              <span className="text-emerald-700">{formatCurrency(budgetResults.venueRent.low)}</span>
              <span className="text-saffron-600">{formatCurrency(budgetResults.venueRent.medium)}</span>
              <span className="text-purple-600">{formatCurrency(budgetResults.venueRent.high)}</span>
            </div>
          </div>
          <div className="kantha-line opacity-20 !h-[1px]"></div>

          {/* Decor */}
          <div className="saree-border-left pl-3 py-1" style={{ borderLeftColor: '#CC7A29' }}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-sm text-gray-700">Decor & Lighting</span>
            </div>
            <div className="flex justify-between text-xs font-medium">
              <span className="text-emerald-700">{formatCurrency(budgetResults.decorCost.low)}</span>
              <span className="text-saffron-600">{formatCurrency(budgetResults.decorCost.medium)}</span>
              <span className="text-purple-600">{formatCurrency(budgetResults.decorCost.high)}</span>
            </div>
          </div>
          <div className="kantha-line opacity-20 !h-[1px]"></div>

          {/* Accommodation */}
          <div className="saree-border-left pl-3 py-1" style={{ borderLeftColor: '#3B82F6' }}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-sm text-gray-700">Accommodation</span>
              <span className="text-[10px] text-gray-400 italic">{data.outstationPercentage}% guests</span>
            </div>
            <div className="flex justify-between text-xs font-medium">
              <span className="text-emerald-700">{formatCurrency(budgetResults.accommodationCost.low)}</span>
              <span className="text-saffron-600">{formatCurrency(budgetResults.accommodationCost.medium)}</span>
              <span className="text-purple-600">{formatCurrency(budgetResults.accommodationCost.high)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Per Person */}
      <div className="bandhani-bg rounded-2xl p-5 border border-saffron-100 saree-border-left marigold-glow" style={{ borderLeftColor: '#FFD700' }}>
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-700 uppercase tracking-widest text-[10px]">Average Cost Per Guest</span>
          <div className="flex gap-3 text-xs font-bold">
            <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-lg border border-emerald-200">{formatCurrency(budgetResults.breakdown.perPerson.low)}</span>
            <span className="bg-saffron-100 text-saffron-800 px-2 py-1 rounded-lg border border-saffron-200">{formatCurrency(budgetResults.breakdown.perPerson.medium)}</span>
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-lg border border-purple-200">{formatCurrency(budgetResults.breakdown.perPerson.high)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="btn-outline px-6 py-2"
        >
          ← Adjust Details
        </button>
        <button
          type="button"
          onClick={onSave}
          className="btn-primary px-8"
        >
          {isEditing ? 'Update Wedding Plan' : 'Save Wedding Plan 💍'}
        </button>
      </div>
    </div>
  );
};

export default BudgetResultsStep;