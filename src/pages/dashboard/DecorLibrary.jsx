import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { decorService } from '../../services/decorService';
import DecorCard from '../../components/decor/DecorCard';
import DecorFilters from '../../components/decor/DecorFilters';
import SelectedDecorSidebar from '../../components/decor/SelectedDecorSidebar';
import api from '../../services/api';

const DecorLibrary = () => {
  const [decorItems, setDecorItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    function: 'all',
    style: 'all',
    minPrice: '',
    maxPrice: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentWeddingId, setCurrentWeddingId] = useState(null);

  useEffect(() => {
    fetchDecorItems();
  }, [filters, pagination.page]);

  // Check for active wedding
  useEffect(() => {
    const checkActiveWedding = async () => {
      try {
        const response = await api.get('/weddings');
        if (response.data.length > 0) {
          // Set the most recent wedding as active
          setCurrentWeddingId(response.data[0]._id);
        }
      } catch (error) {
        console.error('Failed to fetch weddings');
      }
    };
    checkActiveWedding();
  }, []);

  const fetchDecorItems = async () => {
    try {
      setLoading(true);
      console.log('Fetching with filters:', filters);
      console.log('Page:', pagination.page);

      const data = await decorService.getDecorItems({
        ...filters,
        page: pagination.page,
        limit: 12
      });

      console.log('API Response:', data);
      console.log('Decor items:', data.decor);

      setDecorItems(data.decor || []);
      setPagination({
        page: data.page || 1,
        pages: data.pages || 1,
        total: data.total || 0
      });
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load decor items');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSelectItem = (item) => {
    setSelectedItems(prev => {
      const exists = prev.find(i => i._id === item._id);
      if (exists) {
        return prev.filter(i => i._id !== item._id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleRemoveSelected = (id) => {
    setSelectedItems(prev => prev.filter(i => i._id !== id));
  };

  const handleConfirmSelection = () => {
    // Clear selected items
    setSelectedItems([]);
    setShowSidebar(false);

    // Show success message
    toast.success('Decor items added to your wedding plan!');

    // Optionally refresh wedding data if you want to see updated budget
    // You could emit an event or refresh context here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-cream-500 p-6">
      <div className="max-w-[1700px] mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-gold-foil text-4xl mb-2">Decor Library</h1>
            <p className="text-gray-500 font-medium italic">Transform your venue into a royal celebration space</p>
          </div>
          <div className="kantha-line md:w-48 !h-[2px] opacity-40"></div>
        </div>

        {/* Mobile Selected Button */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="md:hidden fixed bottom-4 right-4 bg-saffron-500 text-white p-4 rounded-full shadow-lg z-10"
        >
          🛒 {selectedItems.length}
        </button>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="hidden md:block w-72 flex-shrink-0">
            <div className="sticky top-6">
              <div className="card !p-5 bg-white/80 backdrop-blur-sm border-saffron-200/50">
                <h2 className="font-heading text-lg text-saffron-600 mb-4 flex items-center gap-2">
                  <span>🎨</span> Refine Decor
                </h2>
                <DecorFilters filters={filters} onFilterChange={handleFilterChange} />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filters Toggle */}
            <div className="md:hidden mb-4">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="w-full bg-white p-3 rounded-lg shadow flex justify-between items-center"
              >
                <span>Filters</span>
                <span>▼</span>
              </button>
            </div>

            {/* Results Count */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                Showing {decorItems.length} of {pagination.total} items
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  ←
                </button>
                <span className="px-3 py-1">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  →
                </button>
              </div>
            </div>

            {/* Decor Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="bg-white rounded-xl shadow-lg h-64 animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-t-xl"></div>
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : decorItems.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <span className="text-6xl mb-4 block">🎨</span>
                <p className="text-gray-500 text-lg">No decor items found</p>
                <p className="text-gray-400">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                {decorItems.map(item => (
                  <DecorCard
                    key={item._id}
                    item={item}
                    onSelect={handleSelectItem}
                    isSelected={selectedItems.some(i => i._id === item._id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Selected Items Sidebar - Desktop */}
          <div className="hidden md:block w-72 flex-shrink-0">
            <SelectedDecorSidebar
              selectedItems={selectedItems}
              onRemove={handleRemoveSelected}
              onConfirm={handleConfirmSelection}
              weddingId={currentWeddingId}
            />
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {showSidebar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden">
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
              <div className="p-4">
                <button
                  onClick={() => setShowSidebar(false)}
                  className="float-right text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <DecorFilters filters={filters} onFilterChange={handleFilterChange} />
                <div className="mt-4">
                  <SelectedDecorSidebar
                    selectedItems={selectedItems}
                    onRemove={handleRemoveSelected}
                    onConfirm={() => {
                      handleConfirmSelection();
                      setShowSidebar(false);
                    }}
                    weddingId={currentWeddingId}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DecorLibrary;