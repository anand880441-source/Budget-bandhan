import React from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const SelectedDecorSidebar = ({ selectedItems, onRemove, onConfirm, weddingId }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalCost = selectedItems.reduce((sum, item) => {
    return sum + (item.priceRange?.medium || 0);
  }, 0);

  const handleConfirmSelection = async () => {
    if (!weddingId) {
      toast.error('Please select a wedding first');
      return;
    }

    try {
      // Get current wedding data
      const response = await api.get(`/weddings/${weddingId}`);
      const wedding = response.data;
      
      // Prepare new decor items with all necessary fields
      const newDecor = selectedItems.map(item => ({
        decorId: item._id,
        name: item.name,
        category: item.category,
        image: item.images?.[0]?.url,
        estimatedCost: item.priceRange?.medium || 0
      }));
      
      // Combine with existing decor (avoid duplicates)
      const existingDecor = wedding.selectedDecor || [];
      const allDecor = [...existingDecor, ...newDecor].filter((item, index, self) =>
        index === self.findIndex(t => t.decorId === item.decorId)
      );

      // Update wedding with new decor list
      await api.put(`/weddings/${weddingId}`, {
        selectedDecor: allDecor
      });
      
      toast.success(`Added ${selectedItems.length} items to your wedding plan!`);
      onConfirm(); // This should clear the selection
    } catch (error) {
      console.error('Error saving decor:', error);
      toast.error('Failed to save decor items');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sticky top-4">
      <h3 className="font-heading text-lg text-saffron-600 mb-3">
        Selected Decor ({selectedItems.length})
      </h3>

      {selectedItems.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          No items selected yet
        </p>
      ) : (
        <>
          <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
            {selectedItems.map((item) => {
              const imageUrl = item.images?.[0]?.url || 
                'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=100&auto=format';
              
              return (
                <div key={item._id} className="flex gap-2 border-b pb-2">
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=100&auto=format';
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.name}</h4>
                    <p className="text-xs text-gray-500 capitalize">{item.category || item.function}</p>
                    <p className="text-xs text-emerald-600 font-bold">
                      {formatCurrency(item.priceRange?.medium || 0)}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemove(item._id)}
                    className="text-indian-red-500 hover:text-indian-red-700"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between mb-2">
              <span className="text-sm">Estimated Total</span>
              <span className="font-bold text-saffron-600">{formatCurrency(totalCost)}</span>
            </div>
            <button
              onClick={handleConfirmSelection}
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

export default SelectedDecorSidebar;