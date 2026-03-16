import React from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const SelectedFnBSidebar = ({ 
  selectedMeals, 
  selectedBar, 
  selectedCounters, 
  onRemoveMeal, 
  onRemoveBar, 
  onRemoveCounter,
  onConfirm,
  weddingId 
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateTotal = () => {
    let total = 0;
    selectedMeals.forEach(meal => total += meal.pricePerPerson.medium);
    if (selectedBar) total += selectedBar.pricePerPerson.medium;
    selectedCounters.forEach(counter => total += counter.pricePerPerson.medium);
    return total;
  };

  const handleConfirm = async () => {
    if (!weddingId) {
      toast.error('Please select a wedding first');
      return;
    }

    try {
      // Get current wedding data
      const response = await api.get(`/weddings/${weddingId}`);
      const wedding = response.data;
      
      // Prepare F&B selection data
      const fnbSelection = {
        mealPackages: selectedMeals.map(meal => ({
          packageId: meal._id,
          name: meal.name,
          pricePerPerson: meal.pricePerPerson.medium
        })),
        barPackage: selectedBar ? {
          packageId: selectedBar._id,
          name: selectedBar.name,
          pricePerPerson: selectedBar.pricePerPerson.medium
        } : null,
        specialtyCounters: selectedCounters.map(counter => ({
          packageId: counter._id,
          name: counter.name,
          pricePerPerson: counter.pricePerPerson.medium
        }))
      };

      // Update wedding with F&B selection
      await api.put(`/weddings/${weddingId}`, {
        fnbSelection,
        totalFnBCost: calculateTotal() * (wedding.guestCount || 1)
      });
      
      toast.success('F&B selection saved successfully!');
      onConfirm();
    } catch (error) {
      toast.error('Failed to save F&B selection');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sticky top-4">
      <h3 className="font-heading text-lg text-saffron-600 mb-3">
        F&B Selection
      </h3>

      {selectedMeals.length === 0 && !selectedBar && selectedCounters.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          No items selected yet
        </p>
      ) : (
        <>
          <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
            {/* Meals */}
            {selectedMeals.map((meal) => (
              <div key={meal._id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <h4 className="text-sm font-medium">{meal.name}</h4>
                  <p className="text-xs text-gray-500">Meal Package</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-600 font-bold">
                    {formatCurrency(meal.pricePerPerson.medium)}
                  </span>
                  <button
                    onClick={() => onRemoveMeal(meal._id)}
                    className="text-indian-red-500 hover:text-indian-red-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            {/* Bar */}
            {selectedBar && (
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <h4 className="text-sm font-medium">{selectedBar.name}</h4>
                  <p className="text-xs text-gray-500">Bar Package</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-600 font-bold">
                    {formatCurrency(selectedBar.pricePerPerson.medium)}
                  </span>
                  <button
                    onClick={() => onRemoveBar()}
                    className="text-indian-red-500 hover:text-indian-red-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Counters */}
            {selectedCounters.map((counter) => (
              <div key={counter._id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <h4 className="text-sm font-medium">{counter.name}</h4>
                  <p className="text-xs text-gray-500">Specialty Counter</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-600 font-bold">
                    {formatCurrency(counter.pricePerPerson.medium)}
                  </span>
                  <button
                    onClick={() => onRemoveCounter(counter._id)}
                    className="text-indian-red-500 hover:text-indian-red-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between mb-2">
              <span className="text-sm">Total per person</span>
              <span className="font-bold text-saffron-600">{formatCurrency(calculateTotal())}</span>
            </div>
            <button
              onClick={handleConfirm}
              className="w-full btn-primary py-2 text-sm"
            >
              Confirm Selection
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SelectedFnBSidebar;