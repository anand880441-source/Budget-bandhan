import React, { useState } from 'react';
import { VEHICLE_TYPES } from '../../utils/constants/logisticsConstants';

const TransportCalculator = ({ wedding, onCalculate }) => {
  const [formData, setFormData] = useState({
    vehicleType: 'innova',
    distance: 20,
    guestCount: wedding?.guestCount || 0,
    outstationPercentage: wedding?.outstationPercentage || 20
  });
  const [calculation, setCalculation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    // Simulate calculation (replace with API call)
    setTimeout(() => {
      const vehicle = VEHICLE_TYPES.find(v => v.id === formData.vehicleType);
      const outstationGuests = Math.ceil(formData.guestCount * (formData.outstationPercentage / 100));
      const vehiclesNeeded = Math.ceil(outstationGuests / vehicle.capacity);
      const perKmCost = vehiclesNeeded * vehicle.ratePerKm * formData.distance * 2;
      const perDayCost = vehiclesNeeded * vehicle.ratePerDay;
      const total = perKmCost + perDayCost;
      
      const result = {
        total,
        vehiclesNeeded,
        distance: formData.distance,
        vehicleType: formData.vehicleType,
        outstationGuests,
        perKmCost,
        perDayCost
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
      <h3 className="font-heading text-xl text-saffron-600 mb-4">🚗 Guest Transportation</h3>
      
      <div className="space-y-4">
        {/* Vehicle Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {VEHICLE_TYPES.map(vehicle => (
              <button
                key={vehicle.id}
                onClick={() => setFormData({...formData, vehicleType: vehicle.id})}
                className={`p-3 border rounded-lg text-center transition
                  ${formData.vehicleType === vehicle.id 
                    ? 'border-saffron-500 bg-saffron-50' 
                    : 'border-gray-200 hover:border-saffron-300'}`}
              >
                <span className="text-2xl block">{vehicle.icon}</span>
                <span className="text-sm font-medium">{vehicle.name}</span>
                <span className="text-xs text-gray-500">Cap. {vehicle.capacity}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Distance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Distance from Venue (km)
          </label>
          <input
            type="number"
            value={formData.distance}
            onChange={(e) => setFormData({...formData, distance: parseInt(e.target.value)})}
            className="input-field"
            min="1"
          />
        </div>

        {/* Guest Count (read-only from wedding) */}
        <div className="bg-saffron-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Total Guests</p>
          <p className="text-2xl font-bold text-saffron-600">{formData.guestCount}</p>
          <p className="text-xs text-gray-500 mt-1">
            Outstation: {formData.outstationPercentage}% 
            ({Math.ceil(formData.guestCount * formData.outstationPercentage / 100)} guests)
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
          <div className="mt-4 p-4 bg-emerald-50 rounded-lg">
            <h4 className="font-medium text-emerald-600 mb-2">Cost Breakdown</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Vehicles Needed:</span>
                <span className="font-bold">{calculation.vehiclesNeeded}</span>
              </div>
              <div className="flex justify-between">
                <span>Per KM Cost:</span>
                <span>{formatCurrency(calculation.perKmCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Per Day Cost:</span>
                <span>{formatCurrency(calculation.perDayCost)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-emerald-600">{formatCurrency(calculation.total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransportCalculator;