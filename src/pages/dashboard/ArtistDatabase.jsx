import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { artistService } from '../../services/artistService';
import ArtistCard from '../../components/artist/ArtistCard';
import SelectedArtistSidebar from '../../components/artist/SelectedArtistSidebar';
import { ARTIST_CATEGORIES, ARTIST_CITIES, LANGUAGES, SORT_OPTIONS } from '../../utils/constants/artistConstants';
import api from '../../services/api';

const ArtistDatabase = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    city: 'all',
    language: 'all',
    minPrice: '',
    maxPrice: '',
    sort: 'recommended',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [currentWeddingId, setCurrentWeddingId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    fetchArtists();
  }, [filters, pagination.page]);

  useEffect(() => {
    checkActiveWedding();
  }, []);

  const checkActiveWedding = async () => {
    try {
      const response = await api.get('/weddings');
      if (response.data.length > 0) {
        setCurrentWeddingId(response.data[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch weddings');
    }
  };

  const fetchArtists = async () => {
    try {
      setLoading(true);
      const data = await artistService.getArtists({
        ...filters,
        page: pagination.page,
        limit: 12
      });
      setArtists(data.artists || []);
      setPagination({
        page: data.page || 1,
        pages: data.pages || 1,
        total: data.total || 0
      });
    } catch (error) {
      toast.error('Failed to load artists');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSelectArtist = (artist) => {
    setSelectedArtists(prev => {
      const exists = prev.find(a => a._id === artist._id);
      if (exists) {
        return prev.filter(a => a._id !== artist._id);
      } else {
        return [...prev, artist];
      }
    });
  };

  const handleRemoveSelected = (id) => {
    setSelectedArtists(prev => prev.filter(a => a._id !== id));
  };

  const handleConfirmSelection = () => {
    toast.success(`Added ${selectedArtists.length} artists to your wedding plan!`);
    setShowSidebar(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-cream-500 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-heading text-3xl text-saffron-600 mb-2">Artist Database</h1>
          <p className="text-gray-600">Find and book the best artists for your wedding</p>
        </div>

        {/* Mobile Selected Button */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="md:hidden fixed bottom-4 right-4 bg-saffron-500 text-white p-4 rounded-full shadow-lg z-10"
        >
          🎤 {selectedArtists.length}
        </button>

        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Filters Bar */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <input
                  type="text"
                  placeholder="Search artists..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="input-field"
                />

                {/* Category Filter */}
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Categories</option>
                  {ARTIST_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>

                {/* City Filter */}
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Cities</option>
                  {ARTIST_CITIES.map(city => (
                    <option key={city.id} value={city.id}>{city.icon} {city.name}</option>
                  ))}
                </select>

                {/* Sort */}
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="input-field"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                  ))}
                </select>
              </div>

              {/* Advanced Filters Toggle */}
              <details className="mt-4">
                <summary className="text-sm text-saffron-600 cursor-pointer">Advanced Filters</summary>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {/* Language Filter */}
                  <select
                    value={filters.language}
                    onChange={(e) => handleFilterChange('language', e.target.value)}
                    className="input-field"
                  >
                    <option value="all">All Languages</option>
                    {LANGUAGES.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>

                  {/* Price Range */}
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="input-field"
                    />
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>
              </details>
            </div>

            {/* Results Count */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                Showing {artists.length} of {pagination.total} artists
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

            {/* Artists Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
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
            ) : artists.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <span className="text-6xl mb-4 block">🎤</span>
                <p className="text-gray-500 text-lg">No artists found</p>
                <p className="text-gray-400">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {artists.map(artist => (
                  <ArtistCard
                    key={artist._id}
                    artist={artist}
                    onSelect={handleSelectArtist}
                    isSelected={selectedArtists.some(a => a._id === artist._id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Selected Artists Sidebar - Desktop */}
          <div className="hidden md:block w-80 flex-shrink-0">
            <SelectedArtistSidebar
              selectedArtists={selectedArtists}
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
                <SelectedArtistSidebar
                  selectedArtists={selectedArtists}
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
        )}
      </div>
    </div>
  );
};

export default ArtistDatabase;