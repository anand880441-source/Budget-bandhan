import React, { useState } from 'react';
import { GHODI_TYPES, SFX_TYPES } from '../../utils/constants/logisticsConstants';

const BaraatCalculator = ({ onCalculate }) => {
  const [formData, setFormData] = useState({
    ghodiType: 'premium',
    dholiCount: 4,
    dholiHours: 2,
    sfxType: 'none'
  });
  const [calculation, setCalculation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = () => {
    setLoading(true);
    setTimeout(() => {
      const ghodiRates = { basic: 20000, premium: 35000, luxury: 55000 };
      const dholiRate = 2000;
      const sfxRates = { coldPyro: 15000, confetti: 10000, both: 20000, none: 0 };

      const ghodiCost = ghodiRates[formData.ghodiType] || 0;
      const dholiCost = formData.dholiCount * formData.dholiHours * dholiRate;
      const sfxCost = sfxRates[formData.sfxType] || 0;
      const total = ghodiCost + dholiCost + sfxCost;

      const result = {
        ghodi: { type: formData.ghodiType, cost: ghodiCost },
        dholi: { count: formData.dholiCount, hours: formData.dholiHours, cost: dholiCost },
        sfx: { type: formData.sfxType, cost: sfxCost },
        total,
        ghodiType: formData.ghodiType
      };

      setCalculation(result);
      
      // Call the onCalculate prop to send data to parent
      if (onCalculate) {
        onCalculate(result);
      }
      
      setLoading(false);
    }, 500);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="font-heading text-xl text-saffron-600 mb-4">🐎 Baraat Arrangements</h3>
      
      <div className="space-y-4">
        {/* Ghodi Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ghodi Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {GHODI_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => setFormData({...formData, ghodiType: type.id})}
                className={`p-2 border rounded-lg text-center transition
                  ${formData.ghodiType === type.id 
                    ? 'border-saffron-500 bg-saffron-50' 
                    : 'border-gray-200 hover:border-saffron-300'}`}
              >
                <span className="text-xl block">{type.icon}</span>
                <span className="text-xs">{type.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dholi Count & Hours */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Number of Dholis</label>
            <input
              type="number"
              value={formData.dholiCount}
              onChange={(e) => setFormData({...formData, dholiCount: parseInt(e.target.value)})}
              className="input-field"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Hours</label>
            <input
              type="number"
              value={formData.dholiHours}
              onChange={(e) => setFormData({...formData, dholiHours: parseInt(e.target.value)})}
              className="input-field"
              min="0"
            />
          </div>
        </div>

        {/* SFX Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Effects
          </label>
          <select
            value={formData.sfxType}
            onChange={(e) => setFormData({...formData, sfxType: e.target.value})}
            className="input-field"
          >
            <option value="none">None</option>
            {SFX_TYPES.map(sfx => (
              <option key={sfx.id} value={sfx.id}>{sfx.icon} {sfx.name}</option>
            ))}
          </select>
        </div>

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="w-full btn-primary py-2"
        >
          {loading ? 'Calculating...' : 'Calculate Cost'}
        </button>

        {/* Results */}
        {calculation && (
          <div className="mt-4 p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-600 mb-2">Cost Breakdown</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>🐎 Ghodi:</span>
                <span>{formatCurrency(calculation.ghodi.cost)}</span>
              </div>
              <div className="flex justify-between">
                <span>🥁 Dholi ({formData.dholiCount} × {formData.dholiHours}h):</span>
                <span>{formatCurrency(calculation.dholi.cost)}</span>
              </div>
              {formData.sfxType !== 'none' && (
                <div className="flex justify-between">
                  <span>✨ SFX:</span>
                  <span>{formatCurrency(calculation.sfx.cost)}</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-purple-600">{formatCurrency(calculation.total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BaraatCalculator;