import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { CITIES } from '../../utils/constants/weddingConstants';
import { VENUE_TIERS } from '../../utils/constants/weddingConstants';

const VenueCosts = () => {
  const [costs, setCosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchCosts();
  }, []);

  const fetchCosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/venue-costs');
      setCosts(response.data);
    } catch (error) {
      toast.error('Failed to load venue costs');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cost) => {
    setEditingId(cost._id);
    setEditForm(cost);
  };

  const handleSave = async () => {
    try {
      await api.put(`/admin/venue-costs/${editingId}`, editForm);
      toast.success('Venue cost updated');
      setEditingId(null);
      fetchCosts();
    } catch (error) {
      toast.error('Failed to update venue cost');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-saffron-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-cream-500 p-6">
      <div className="container mx-auto">
        <h1 className="font-heading text-3xl text-saffron-600 mb-6">Venue Base Costs</h1>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-saffron-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Venue Tier</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost/Plate (L/M/H)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Venue Rent (L/M/H)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {costs.map(cost => (
                <tr key={cost._id}>
                  {editingId === cost._id ? (
                    <>
                      <td className="px-4 py-2">{cost.city}</td>
                      <td className="px-4 py-2">{cost.venueTier}</td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={editForm.costPerPlate?.low || 0}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            costPerPlate: { ...editForm.costPerPlate, low: parseInt(e.target.value) }
                          })}
                          className="w-20 px-1 py-0.5 border rounded text-sm"
                        /> / 
                        <input
                          type="number"
                          value={editForm.costPerPlate?.medium || 0}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            costPerPlate: { ...editForm.costPerPlate, medium: parseInt(e.target.value) }
                          })}
                          className="w-20 px-1 py-0.5 border rounded text-sm ml-1"
                        /> / 
                        <input
                          type="number"
                          value={editForm.costPerPlate?.high || 0}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            costPerPlate: { ...editForm.costPerPlate, high: parseInt(e.target.value) }
                          })}
                          className="w-20 px-1 py-0.5 border rounded text-sm ml-1"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={editForm.venueRent?.low || 0}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            venueRent: { ...editForm.venueRent, low: parseInt(e.target.value) }
                          })}
                          className="w-20 px-1 py-0.5 border rounded text-sm"
                        /> / 
                        <input
                          type="number"
                          value={editForm.venueRent?.medium || 0}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            venueRent: { ...editForm.venueRent, medium: parseInt(e.target.value) }
                          })}
                          className="w-20 px-1 py-0.5 border rounded text-sm ml-1"
                        /> / 
                        <input
                          type="number"
                          value={editForm.venueRent?.high || 0}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            venueRent: { ...editForm.venueRent, high: parseInt(e.target.value) }
                          })}
                          className="w-20 px-1 py-0.5 border rounded text-sm ml-1"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <button onClick={handleSave} className="text-emerald-600 hover:text-emerald-700 mr-2">Save</button>
                        <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-gray-700">Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2">{cost.city}</td>
                      <td className="px-4 py-2 capitalize">{cost.venueTier.replace(/-/g, ' ')}</td>
                      <td className="px-4 py-2">
                        {formatCurrency(cost.costPerPlate?.low)} - {formatCurrency(cost.costPerPlate?.high)}
                      </td>
                      <td className="px-4 py-2">
                        {formatCurrency(cost.venueRent?.low)} - {formatCurrency(cost.venueRent?.high)}
                      </td>
                      <td className="px-4 py-2">
                        <button onClick={() => handleEdit(cost)} className="text-saffron-600 hover:text-saffron-700">
                          Edit
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VenueCosts;