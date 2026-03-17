import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { fnbService } from '../../services/fnbService';

const FnBCalculator = ({ wedding, onCalculate }) => {
  const [mealPackages, setMealPackages] = useState([]);
  const [barPackage, setBarPackage] = useState(null);
  const [specialtyCounters, setSpecialtyCounters] = useState([]);
  const [eventDuration, setEventDuration] = useState(1);
  const [calculating, setCalculating] = useState(false);
  const [results, setResults] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleCalculate = async () => {
    if (!wedding?.guestCount) {
      toast.error('Please set guest count first');
      return;
    }

    try {
      setCalculating(true);
      const data = await fnbService.calculateFnBCost({
        guestCount: wedding.guestCount,
        mealPackages: mealPackages.map(m => ({ packageId: m._id })),
        barPackage: barPackage ? { packageId: barPackage._id, hours: 4 } : null,
        specialtyCounters: specialtyCounters.map(c => ({ packageId: c._id })),
        eventDuration
      });
      setResults(data);
      if (onCalculate) onCalculate(data);
    } catch (error) {
      toast.error('Failed to calculate F&B cost');
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="font-heading text-xl text-saffron-600 mb-4">F&B Cost Calculator</h3>

      {/* Selected Items Summary */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center p-3 bg-saffron-50 rounded-lg">
          <span className="font-medium">Guest Count</span>
          <span className="text-lg font-bold text-saffron-600">{wedding?.guestCount || 0}</span>
        </div>

        {mealPackages.length > 0 && (
          <div className="p-3 bg-emerald-50 rounded-lg">
            <p className="font-medium mb-2">Meal Packages ({mealPackages.length})</p>
            {mealPackages.map((pkg, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{pkg.name}</span>
                <span className="text-emerald-600">{formatCurrency(pkg.pricePerPerson.medium)}/person</span>
              </div>
            ))}
          </div>
        )}

        {barPackage && (
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="font-medium mb-1">Bar Package</p>
            <div className="flex justify-between text-sm">
              <span>{barPackage.name}</span>
              <span className="text-purple-600">{formatCurrency(barPackage.pricePerPerson.medium)}/person</span>
            </div>
          </div>
        )}

        {specialtyCounters.length > 0 && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="font-medium mb-2">Specialty Counters ({specialtyCounters.length})</p>
            {specialtyCounters.map((counter, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{counter.name}</span>
                <span className="text-blue-600">{formatCurrency(counter.pricePerPerson.medium)}/person</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Event Duration */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Duration (days)
        </label>
        <input
          type="number"
          min="1"
          max="5"
          value={eventDuration}
          onChange={(e) => setEventDuration(parseInt(e.target.value))}
          className="input-field"
        />
      </div>

      {/* Calculate Button */}
      <button
        onClick={handleCalculate}
        disabled={calculating || mealPackages.length === 0}
        className="w-full btn-primary py-3 mb-4 disabled:opacity-50"
      >
        {calculating ? 'Calculating...' : 'Calculate Total Cost'}
      </button>

      {/* Results */}
      {results && (
        <div className="mt-4 p-4 bg-gradient-to-r from-saffron-500 to-emerald-500 text-white rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <span className="font-medium">Total F&B Cost</span>
            <span className="text-2xl font-bold">{formatCurrency(results.totalCost)}</span>
          </div>
          <p className="text-sm opacity-90">
            Cost per person: {formatCurrency(results.summary.costPerPerson)}
          </p>
          <div className="mt-3 text-sm">
            <p>🍽️ Meals: {results.summary.meals}</p>
            <p>🍸 Bar: {results.summary.hasBar ? 'Yes' : 'No'}</p>
            <p>🍛 Counters: {results.summary.counters}</p>
            <p>👥 Staff required: {results.summary.staffCount}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FnBCalculator;