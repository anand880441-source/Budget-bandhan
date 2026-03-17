import React, { useState } from 'react';
import { ROOM_TYPES } from '../../utils/constants/logisticsConstants';

const AccommodationCalculator = ({ wedding, onCalculate }) => {
  const [formData, setFormData] = useState({
    roomType: 'deluxe',
    nights: 2,
    sharing: 2,
    guestCount: wedding?.guestCount || 0,
    outstationPercentage: wedding?.outstationPercentage || 20
  });
  const [calculation, setCalculation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = () => {
    setLoading(true);
    setTimeout(() => {
      const roomRates = {
        standard: 4500,
        deluxe: 7500,
        suite: 12000,
        presidential: 25000
      };

      const outstationGuests = Math.ceil(formData.guestCount * (formData.outstationPercentage / 100));
      const roomsNeeded = Math.ceil(outstationGuests / formData.sharing);
      const rate = roomRates[formData.roomType];
      const totalCost = roomsNeeded * rate * formData.nights;

      const result = {
        outstationGuests,
        roomsNeeded,
        roomType: formData.roomType,
        rate,
        nights: formData.nights,
        totalCost
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
      <h3 className="font-heading text-xl text-saffron-600 mb-4">🏨 Accommodation</h3>
      
      <div className="space-y-4">
        {/* Room Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ROOM_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => setFormData({...formData, roomType: type.id})}
                className={`p-2 border rounded-lg text-center transition
                  ${formData.roomType === type.id 
                    ? 'border-saffron-500 bg-saffron-50' 
                    : 'border-gray-200 hover:border-saffron-300'}`}
              >
                <span className="text-xl block">{type.icon}</span>
                <span className="text-xs">{type.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Nights & Sharing */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nights</label>
            <input
              type="number"
              value={formData.nights}
              onChange={(e) => setFormData({...formData, nights: parseInt(e.target.value)})}
              className="input-field"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Sharing</label>
            <select
              value={formData.sharing}
              onChange={(e) => setFormData({...formData, sharing: parseInt(e.target.value)})}
              className="input-field"
            >
              <option value="1">Single</option>
              <option value="2">Double</option>
              <option value="3">Triple</option>
              <option value="4">Quad</option>
            </select>
          </div>
        </div>

        {/* Guest Summary */}
        <div className="bg-saffron-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Outstation Guests</p>
          <p className="text-2xl font-bold text-saffron-600">
            {Math.ceil(formData.guestCount * formData.outstationPercentage / 100)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            of {formData.guestCount} total guests
          </p>
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
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-600 mb-2">Accommodation Cost</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Rooms Needed:</span>
                <span className="font-bold">{calculation.roomsNeeded}</span>
              </div>
              <div className="flex justify-between">
                <span>Rate per Room:</span>
                <span>{formatCurrency(calculation.rate)}</span>
              </div>
              <div className="flex justify-between">
                <span>Nights:</span>
                <span>{calculation.nights}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">{formatCurrency(calculation.totalCost)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccommodationCalculator;