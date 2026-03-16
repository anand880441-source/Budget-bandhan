import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const SelectedArtistSidebar = ({ selectedArtists, onRemove, onConfirm, weddingId }) => {
  const navigate = useNavigate();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalCost = selectedArtists.reduce((sum, artist) => {
    return sum + (artist.priceRange?.medium || 0);
  }, 0);

  const handleConfirmSelection = async () => {
    if (!weddingId) {
      toast((t) => (
        <div className="flex flex-col gap-2">
          <p className="font-medium">Where do you want to add these artists?</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                navigate('/dashboard/budget-wizard');
              }}
              className="bg-saffron-500 text-white px-3 py-1 rounded text-sm"
            >
              Create New Wedding
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                // You could show a modal with existing weddings
              }}
              className="bg-emerald-500 text-white px-3 py-1 rounded text-sm"
            >
              Choose Existing
            </button>
          </div>
        </div>
      ), { duration: 5000 });
      return;
    }

    try {
      // Save artists to wedding
      await api.put(`/weddings/${weddingId}`, {
        selectedArtists: selectedArtists.map(artist => ({
          artistId: artist._id,
          name: artist.name,
          category: artist.category,
          estimatedCost: artist.priceRange?.medium || 0
        }))
      });
      
      toast.success(`Added ${selectedArtists.length} artists to your wedding plan!`);
      onConfirm();
      
      // Offer to view wedding
      toast((t) => (
        <div className="flex gap-2 items-center">
          <span>Artists added!</span>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              navigate(`/dashboard/wedding/${weddingId}`);
            }}
            className="bg-saffron-500 text-white px-3 py-1 rounded text-sm"
          >
            View Wedding
          </button>
        </div>
      ));
    } catch (error) {
      toast.error('Failed to save artists');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sticky top-4">
      <h3 className="font-heading text-lg text-saffron-600 mb-3">
        Selected Artists ({selectedArtists.length})
      </h3>

      {selectedArtists.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          No artists selected yet
        </p>
      ) : (
        <>
          <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
            {selectedArtists.map((artist) => (
              <div key={artist._id} className="flex gap-2 border-b pb-2">
                <img
                  src={artist.images?.[0]?.url || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=100&auto=format'}
                  alt={artist.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{artist.name}</h4>
                  <p className="text-xs text-gray-500 capitalize">{artist.category}</p>
                  <p className="text-xs text-emerald-600 font-bold">
                    {formatCurrency(artist.priceRange?.medium || 0)}
                  </p>
                </div>
                <button
                  onClick={() => onRemove(artist._id)}
                  className="text-indian-red-500 hover:text-indian-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between mb-2">
              <span className="text-sm">Total Artist Cost</span>
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

export default SelectedArtistSidebar;