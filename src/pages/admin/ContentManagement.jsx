import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('decor');
  const [decor, setDecor] = useState([]);
  const [artists, setArtists] = useState([]);
  const [fnb, setFnb] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, [activeTab]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      if (activeTab === 'decor') {
        const response = await api.get('/decor?limit=100');
        setDecor(response.data.decor || []);
      } else if (activeTab === 'artists') {
        const response = await api.get('/artists?limit=100');
        setArtists(response.data.artists || []);
      } else if (activeTab === 'fnb') {
        const response = await api.get('/fnb?limit=100');
        setFnb(response.data.packages || []);
      }
    } catch (error) {
      toast.error(`Failed to load ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/${type}/${id}`);
        toast.success(`${type} deleted successfully`);
        fetchContent();
      } catch (error) {
        toast.error(`Failed to delete ${type}`);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const tabs = [
    { id: 'decor', name: 'Decor Items', icon: '🎨', count: decor.length },
    { id: 'artists', name: 'Artists', icon: '🎤', count: artists.length },
    { id: 'fnb', name: 'F&B Packages', icon: '🍽️', count: fnb.length }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-cream-500 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-heading text-3xl text-saffron-600">Content Management</h1>
          <Link to="/admin" className="text-saffron-600 hover:text-saffron-700">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium flex items-center gap-2 transition
                ${activeTab === tab.id
                  ? 'text-saffron-600 border-b-2 border-saffron-500'
                  : 'text-gray-500 hover:text-saffron-600'}`}
            >
              <span>{tab.icon}</span>
              {tab.name}
              <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-saffron-500 border-t-transparent mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading {activeTab}...</p>
            </div>
          ) : (
            <>
              {/* Decor Table */}
              {activeTab === 'decor' && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-saffron-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Function</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price Range</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {decor.map(item => (
                      <tr key={item._id}>
                        <td className="px-6 py-4">
                          <img 
                            src={item.images?.[0]?.url || 'https://via.placeholder.com/50'} 
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        </td>
                        <td className="px-6 py-4 font-medium">{item.name}</td>
                        <td className="px-6 py-4 capitalize">{item.category}</td>
                        <td className="px-6 py-4 capitalize">{item.function}</td>
                        <td className="px-6 py-4">
                          {formatCurrency(item.priceRange?.low)} - {formatCurrency(item.priceRange?.high)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDelete('decor', item._id)}
                            className="text-indian-red-500 hover:text-indian-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Artists Table */}
              {activeTab === 'artists' && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-saffron-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price Range</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {artists.map(artist => (
                      <tr key={artist._id}>
                        <td className="px-6 py-4">
                          <img 
                            src={artist.images?.[0]?.url || 'https://via.placeholder.com/50'} 
                            alt={artist.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        </td>
                        <td className="px-6 py-4 font-medium">{artist.name}</td>
                        <td className="px-6 py-4 capitalize">{artist.category}</td>
                        <td className="px-6 py-4">{artist.basedIn?.city}</td>
                        <td className="px-6 py-4">
                          {formatCurrency(artist.priceRange?.low)} - {formatCurrency(artist.priceRange?.high)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className="text-yellow-400 mr-1">★</span>
                            {artist.rating} ({artist.reviewCount})
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDelete('artists', artist._id)}
                            className="text-indian-red-500 hover:text-indian-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* F&B Table */}
              {activeTab === 'fnb' && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-saffron-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cuisine</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price/Person</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Guests</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fnb.map(pkg => (
                      <tr key={pkg._id}>
                        <td className="px-6 py-4">
                          <img 
                            src={pkg.images?.[0]?.url || 'https://via.placeholder.com/50'} 
                            alt={pkg.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        </td>
                        <td className="px-6 py-4 font-medium">{pkg.name}</td>
                        <td className="px-6 py-4 capitalize">{pkg.category}</td>
                        <td className="px-6 py-4">{pkg.cuisineType?.join(', ')}</td>
                        <td className="px-6 py-4">
                          {formatCurrency(pkg.pricePerPerson?.low)} - {formatCurrency(pkg.pricePerPerson?.high)}
                        </td>
                        <td className="px-6 py-4">{pkg.minimumGuests}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDelete('fnb', pkg._id)}
                            className="text-indian-red-500 hover:text-indian-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {((activeTab === 'decor' && decor.length === 0) ||
                (activeTab === 'artists' && artists.length === 0) ||
                (activeTab === 'fnb' && fnb.length === 0)) && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No {activeTab} found</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;