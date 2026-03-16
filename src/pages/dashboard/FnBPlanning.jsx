import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { fnbService } from '../../services/fnbService';
import FnBPackageCard from '../../components/fnb/FnBPackageCard';
import FnBFilters from '../../components/fnb/FnBFilters';
import FnBCalculator from '../../components/fnb/FnBCalculator';
import SelectedFnBSidebar from '../../components/fnb/SelectedFnBSidebar';
import api from '../../services/api';

const FnBPlanning = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    mealType: 'all',
    cuisine: 'all',
    dietary: 'all',
    minPrice: '',
    maxPrice: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });
  
  // Selection states
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [selectedBar, setSelectedBar] = useState(null);
  const [selectedCounters, setSelectedCounters] = useState([]);
  const [currentWeddingId, setCurrentWeddingId] = useState(null);
  const [currentWedding, setCurrentWedding] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, [filters, pagination.page]);

  useEffect(() => {
    checkActiveWedding();
  }, []);

  const checkActiveWedding = async () => {
    try {
      const response = await api.get('/weddings');
      if (response.data.length > 0) {
        const wedding = response.data[0];
        setCurrentWeddingId(wedding._id);
        setCurrentWedding(wedding);
      }
    } catch (error) {
      console.error('Failed to fetch weddings');
    }
  };

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await fnbService.getFnBPackages({
        ...filters,
        page: pagination.page,
        limit: 12
      });
      setPackages(data.packages || []);
      setPagination({
        page: data.page || 1,
        pages: data.pages || 1,
        total: data.total || 0
      });
    } catch (error) {
      toast.error('Failed to load F&B packages');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSelectPackage = (pkg) => {
    switch(pkg.category) {
      case 'meal':
        setSelectedMeals(prev => {
          const exists = prev.find(p => p._id === pkg._id);
          if (exists) return prev.filter(p => p._id !== pkg._id);
          if (prev.length >= 2) {
            toast.error('You can select up to 2 meal packages');
            return prev;
          }
          return [...prev, pkg];
        });
        break;
      case 'bar':
        if (selectedBar && selectedBar._id === pkg._id) {
          setSelectedBar(null);
        } else {
          setSelectedBar(pkg);
        }
        break;
      case 'counter':
        setSelectedCounters(prev => {
          const exists = prev.find(p => p._id === pkg._id);
          if (exists) return prev.filter(p => p._id !== pkg._id);
          if (prev.length >= 3) {
            toast.error('You can select up to 3 specialty counters');
            return prev;
          }
          return [...prev, pkg];
        });
        break;
      default:
        break;
    }
  };

  const handleRemoveMeal = (id) => {
    setSelectedMeals(prev => prev.filter(p => p._id !== id));
  };

  const handleRemoveBar = () => {
    setSelectedBar(null);
  };

  const handleRemoveCounter = (id) => {
    setSelectedCounters(prev => prev.filter(p => p._id !== id));
  };

  const handleConfirmSelection = () => {
    setShowSidebar(false);
    toast.success('F&B selection saved!');
  };

  const isSelected = (pkg) => {
    switch(pkg.category) {
      case 'meal':
        return selectedMeals.some(p => p._id === pkg._id);
      case 'bar':
        return selectedBar?._id === pkg._id;
      case 'counter':
        return selectedCounters.some(p => p._id === pkg._id);
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-cream-500 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-heading text-3xl text-saffron-600 mb-2">Food & Beverage Planning</h1>
          <p className="text-gray-600">Plan the perfect menu for your wedding celebrations</p>
        </div>

        {/* Mobile Selected Button */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="md:hidden fixed bottom-4 right-4 bg-saffron-500 text-white p-4 rounded-full shadow-lg z-10"
        >
          🍽️ {selectedMeals.length + (selectedBar ? 1 : 0) + selectedCounters.length}
        </button>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <FnBFilters filters={filters} onFilterChange={handleFilterChange} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                Showing {packages.length} of {pagination.total} packages
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

            {/* Packages Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="bg-white rounded-xl shadow-lg h-80 animate-pulse">
                    <div className="h-40 bg-gray-200 rounded-t-xl"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-8 bg-gray-200 rounded w-full mt-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : packages.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <span className="text-6xl mb-4 block">🍽️</span>
                <p className="text-gray-500 text-lg">No packages found</p>
                <p className="text-gray-400">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map(pkg => (
                  <FnBPackageCard
                    key={pkg._id}
                    package={pkg}
                    onSelect={handleSelectPackage}
                    isSelected={isSelected(pkg)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden md:block w-80 flex-shrink-0 space-y-6">
            <FnBCalculator 
              wedding={currentWedding}
            />
            <SelectedFnBSidebar
              selectedMeals={selectedMeals}
              selectedBar={selectedBar}
              selectedCounters={selectedCounters}
              onRemoveMeal={handleRemoveMeal}
              onRemoveBar={handleRemoveBar}
              onRemoveCounter={handleRemoveCounter}
              onConfirm={handleConfirmSelection}
              weddingId={currentWeddingId}
            />
          </div>
        </div>

        {/* Mobile Sidebar */}
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
                <FnBCalculator 
                  wedding={currentWedding}
                />
                <SelectedFnBSidebar
                  selectedMeals={selectedMeals}
                  selectedBar={selectedBar}
                  selectedCounters={selectedCounters}
                  onRemoveMeal={handleRemoveMeal}
                  onRemoveBar={handleRemoveBar}
                  onRemoveCounter={handleRemoveCounter}
                  onConfirm={handleConfirmSelection}
                  weddingId={currentWeddingId}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FnBPlanning;