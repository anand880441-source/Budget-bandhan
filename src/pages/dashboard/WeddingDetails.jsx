import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const WeddingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wedding, setWedding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchWeddingDetails();
  }, [id]);

  const fetchWeddingDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/weddings/${id}`);
      console.log('Wedding data:', response.data);

      // Fetch logistics data separately
      try {
        const logisticsRes = await api.get(`/logistics/${id}`);
        response.data.logistics = logisticsRes.data;
      } catch (logisticsError) {
        console.log('No logistics data found');
      }

      setWedding(response.data);
    } catch (error) {
      console.error('Failed to fetch wedding details:', error);
      toast.error('Failed to load wedding details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-cream-500 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-saffron-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading wedding details...</p>
        </div>
      </div>
    );
  }

  if (!wedding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-cream-500 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Wedding not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-cream-500">
      {/* Navigation */}
      <nav className="bg-saffron-500 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="font-heading text-2xl">BudgetBandhan</h1>
            <div className="flex items-center space-x-6">
              <Link to="/dashboard" className="hover:text-saffron-200 transition">Dashboard</Link>
              <Link to="/dashboard/guests" className="hover:text-saffron-200 transition">Guest Management</Link>
              <Link to="/dashboard/budget-wizard" className="hover:text-saffron-200 transition">Budget Wizard</Link>
              <Link to="/dashboard/decor" className="hover:text-saffron-200 transition">Decor Library</Link>
              <Link to="/dashboard/artists" className="hover:text-saffron-200 transition">Artists</Link>
              <Link to="/dashboard/fnb" className="hover:text-saffron-200 transition">F&B Planning</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-saffron-100 rounded-lg transition"
          >
            ← Back
          </button>
          <h2 className="font-heading text-3xl text-saffron-600">Wedding Details</h2>
        </div>

        {/* Couple Names Card */}
        <div className="bg-gradient-to-r from-saffron-500 to-emerald-500 text-white rounded-xl p-8 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">💒 Couple</p>
              <h1 className="font-heading text-4xl">{wedding.coupleNames}</h1>
              <p className="mt-2 opacity-90">{formatDate(wedding.weddingDate)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90 mb-1">📍 Location</p>
              <p className="text-2xl">{wedding.city}</p>
              <p className="text-sm opacity-90 mt-1">{wedding.venueTier.replace(/-/g, ' ')}</p>
            </div>
          </div>
        </div>

        {/* Total Budget Card */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-heading text-xl">Total Wedding Budget</h3>
            <span className="text-3xl font-bold">{formatCurrency(wedding.totalBudget?.total || 0)}</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
            <div className="bg-white/20 rounded p-2 text-center">
              <p className="text-xs opacity-90">Base</p>
              <p className="font-bold">{formatCurrency(wedding.totalBudget?.base || 0)}</p>
            </div>
            <div className="bg-white/20 rounded p-2 text-center">
              <p className="text-xs opacity-90">Venue</p>
              <p className="font-bold">{formatCurrency(wedding.totalBudget?.breakdown?.venue || 0)}</p>
            </div>
            <div className="bg-white/20 rounded p-2 text-center">
              <p className="text-xs opacity-90">Food</p>
              <p className="font-bold">{formatCurrency(wedding.totalBudget?.breakdown?.food || 0)}</p>
            </div>
            <div className="bg-white/20 rounded p-2 text-center">
              <p className="text-xs opacity-90">Decor</p>
              <p className="font-bold">{formatCurrency(wedding.totalBudget?.breakdown?.decor || 0)}</p>
            </div>
            <div className="bg-white/20 rounded p-2 text-center">
              <p className="text-xs opacity-90">Artists</p>
              <p className="font-bold">{formatCurrency(wedding.totalBudget?.breakdown?.artists || 0)}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
          {['overview', 'budget', 'functions', 'guests', 'decor', 'artists', 'food', 'logistics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium capitalize whitespace-nowrap transition
                ${activeTab === tab
                  ? 'text-saffron-600 border-b-2 border-saffron-500'
                  : 'text-gray-500 hover:text-saffron-600'}`}
            >
              {tab === 'decor' && '🎨 '}
              {tab === 'artists' && '🎤 '}
              {tab === 'food' && '🍽️ '}
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="md:col-span-2 space-y-6">
            {activeTab === 'overview' && (
              <>
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-6 shadow">
                    <span className="text-3xl block mb-2">👥</span>
                    <p className="text-sm text-gray-500">Total Guests</p>
                    <p className="text-3xl font-bold text-saffron-600">{wedding.guestCount}</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow">
                    <span className="text-3xl block mb-2">🚗</span>
                    <p className="text-sm text-gray-500">Outstation</p>
                    <p className="text-3xl font-bold text-saffron-600">{wedding.outstationPercentage}%</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow">
                    <span className="text-3xl block mb-2">🏨</span>
                    <p className="text-sm text-gray-500">Room Blocks</p>
                    <p className="text-3xl font-bold text-saffron-600">{wedding.roomBlocks}</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow">
                    <span className="text-3xl block mb-2">📊</span>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-3xl font-bold capitalize text-saffron-600">{wedding.status}</p>
                  </div>
                </div>

                {/* Functions List */}
                <div className="bg-white rounded-xl p-6 shadow">
                  <h3 className="font-heading text-xl text-saffron-600 mb-4">Selected Functions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {wedding.functions?.map((f, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-3 bg-saffron-50 rounded-lg">
                        <span className="text-2xl">
                          {f.type === 'mehendi' && '🌿'}
                          {f.type === 'sangeet' && '🎵'}
                          {f.type === 'wedding' && '💒'}
                          {f.type === 'reception' && '🥂'}
                          {f.type === 'haldi' && '🟡'}
                          {f.type === 'cocktail' && '🍸'}
                        </span>
                        <span className="capitalize font-medium">{f.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'budget' && (
              <div className="bg-white rounded-xl p-6 shadow">
                <h3 className="font-heading text-xl text-saffron-600 mb-4">Budget Breakdown</h3>

                {/* Budget Range */}
                <div className="bg-gradient-to-r from-saffron-100 to-emerald-100 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-1">Estimated Budget Range</p>
                  <div className="flex items-baseline justify-between">
                    <span className="text-emerald-600 font-bold">{formatCurrency(wedding.budgetRanges?.low || 0)}</span>
                    <span className="text-gray-400">—</span>
                    <span className="text-saffron-600 font-bold">{formatCurrency(wedding.budgetRanges?.medium || 0)}</span>
                    <span className="text-gray-400">—</span>
                    <span className="text-purple-600 font-bold">{formatCurrency(wedding.budgetRanges?.high || 0)}</span>
                  </div>
                </div>

                {/* Per Person Cost */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Cost Per Guest</span>
                    <span className="text-xl font-bold text-saffron-600">
                      {formatCurrency((wedding.budgetRanges?.medium || 0) / wedding.guestCount)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => navigate(`/dashboard/budget-wizard/${id}`)}
                    className="btn-primary flex-1"
                  >
                    Edit Budget
                  </button>
                  <div className="mt-4">
                    <ReportButtons weddingId={id} />
                  </div>
                  <button className="btn-outline flex-1">
                    Export Report
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'functions' && (
              <div className="bg-white rounded-xl p-6 shadow">
                <h3 className="font-heading text-xl text-saffron-600 mb-4">Function Details</h3>
                {wedding.functions?.map((f, idx) => (
                  <div key={idx} className="border-b last:border-0 py-4 first:pt-0">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">
                        {f.type === 'mehendi' && '🌿'}
                        {f.type === 'sangeet' && '🎵'}
                        {f.type === 'wedding' && '💒'}
                        {f.type === 'reception' && '🥂'}
                        {f.type === 'haldi' && '🟡'}
                        {f.type === 'cocktail' && '🍸'}
                      </span>
                      <div>
                        <h4 className="font-heading text-lg capitalize text-gray-800">{f.type}</h4>
                        <p className="text-sm text-gray-500">Date: TBD • Guests: {wedding.guestCount}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'guests' && (
              <div className="bg-white rounded-xl p-6 shadow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-heading text-xl text-saffron-600">Guest List</h3>
                  <Link
                    to={`/dashboard/guests?wedding=${id}`}
                    className="text-saffron-600 hover:text-saffron-700"
                  >
                    Manage Guests →
                  </Link>
                </div>
                <p className="text-gray-500 text-center py-8">
                  Guest management for this wedding coming soon
                </p>
              </div>
            )}

            {activeTab === 'decor' && (
              <div className="bg-white rounded-xl p-6 shadow">
                <h3 className="font-heading text-xl text-saffron-600 mb-4">Selected Decor</h3>
                {wedding.selectedDecor?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {wedding.selectedDecor.map((decor, idx) => (
                      <div key={idx} className="flex items-center gap-3 border rounded-lg p-3">
                        <img
                          src={decor.image || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=100&auto=format'}
                          className="w-16 h-16 object-cover rounded"
                          alt={decor.name}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=100&auto=format';
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-medium">{decor.name}</p>
                          <p className="text-sm text-gray-500 capitalize">{decor.category}</p>
                          <p className="text-sm text-emerald-600 font-bold">
                            {formatCurrency(decor.estimatedCost)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No decor items selected yet</p>
                )}
                <div className="mt-4">
                  <Link
                    to="/dashboard/decor"
                    className="text-saffron-600 hover:text-saffron-700 font-medium"
                  >
                    Browse Decor Library →
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'artists' && (
              <div className="bg-white rounded-xl p-6 shadow">
                <h3 className="font-heading text-xl text-saffron-600 mb-4">Selected Artists</h3>
                {wedding.selectedArtists?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {wedding.selectedArtists.map((artist, idx) => (
                      <div key={idx} className="flex items-center gap-3 border rounded-lg p-3">
                        <img
                          src={artist.image || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=100&auto=format'}
                          className="w-16 h-16 object-cover rounded"
                          alt={artist.name}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=100&auto=format';
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-medium">{artist.name}</p>
                          <p className="text-sm text-gray-500 capitalize">{artist.category}</p>
                          <p className="text-sm text-emerald-600 font-bold">
                            {formatCurrency(artist.estimatedCost)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No artists selected yet</p>
                )}
                <div className="mt-4">
                  <Link
                    to="/dashboard/artists"
                    className="text-saffron-600 hover:text-saffron-700 font-medium"
                  >
                    Browse Artist Database →
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'food' && (
              <div className="bg-white rounded-xl p-6 shadow">
                <h3 className="font-heading text-xl text-saffron-600 mb-4">Food & Beverage</h3>

                {!wedding.fnbSelection && !wedding.totalFnBCost ? (
                  <div className="text-center py-8">
                    <span className="text-6xl mb-4 block">🍽️</span>
                    <p className="text-gray-500 text-lg mb-2">No food & beverage packages selected yet</p>
                    <p className="text-gray-400 mb-4">Plan your wedding menu</p>
                    <Link
                      to="/dashboard/fnb"
                      className="btn-primary inline-block"
                    >
                      Plan F&B
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Meal Packages */}
                    {wedding.fnbSelection?.mealPackages?.length > 0 && (
                      <div>
                        <h4 className="font-heading text-lg text-emerald-600 mb-3">Meal Packages</h4>
                        <div className="grid grid-cols-1 gap-4">
                          {wedding.fnbSelection.mealPackages.map((meal, idx) => (
                            <div key={idx} className="flex items-center gap-3 border rounded-lg p-3">
                              <span className="text-3xl">🍽️</span>
                              <div className="flex-1">
                                <p className="font-medium">{meal.name}</p>
                                <p className="text-sm text-emerald-600 font-bold">
                                  {formatCurrency(meal.pricePerPerson)}/person
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bar Package */}
                    {wedding.fnbSelection?.barPackage && (
                      <div>
                        <h4 className="font-heading text-lg text-purple-600 mb-3">Bar Package</h4>
                        <div className="flex items-center gap-3 border rounded-lg p-3">
                          <span className="text-3xl">🍸</span>
                          <div className="flex-1">
                            <p className="font-medium">{wedding.fnbSelection.barPackage.name}</p>
                            <p className="text-sm text-purple-600 font-bold">
                              {formatCurrency(wedding.fnbSelection.barPackage.pricePerPerson)}/person
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Specialty Counters */}
                    {wedding.fnbSelection?.specialtyCounters?.length > 0 && (
                      <div>
                        <h4 className="font-heading text-lg text-blue-600 mb-3">Specialty Counters</h4>
                        <div className="grid grid-cols-1 gap-4">
                          {wedding.fnbSelection.specialtyCounters.map((counter, idx) => (
                            <div key={idx} className="flex items-center gap-3 border rounded-lg p-3">
                              <span className="text-3xl">🍛</span>
                              <div className="flex-1">
                                <p className="font-medium">{counter.name}</p>
                                <p className="text-sm text-blue-600 font-bold">
                                  {formatCurrency(counter.pricePerPerson)}/person
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Total F&B Cost */}
                    {wedding.totalFnBCost && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-saffron-500 to-emerald-500 text-white rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Total F&B Cost</span>
                          <span className="text-2xl font-bold">{formatCurrency(wedding.totalFnBCost)}</span>
                        </div>
                        <p className="text-sm opacity-90 mt-2">
                          Cost per person: {formatCurrency(wedding.totalFnBCost / wedding.guestCount)}
                        </p>
                      </div>
                    )}

                    <div className="mt-4">
                      <Link
                        to="/dashboard/fnb"
                        className="text-saffron-600 hover:text-saffron-700 font-medium"
                      >
                        Edit F&B Selection →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'logistics' && (
              <div className="bg-white rounded-xl p-6 shadow">
                <h3 className="font-heading text-xl text-saffron-600 mb-4">🚚 Logistics</h3>

                {!wedding.logistics ? (
                  <div className="text-center py-8">
                    <span className="text-6xl mb-4 block">🚚</span>
                    <p className="text-gray-500 text-lg mb-2">No logistics plan yet</p>
                    <p className="text-gray-400 mb-4">Plan transportation, accommodation, and staffing</p>
                    <Link
                      to={`/dashboard/logistics/${id}`}
                      className="btn-primary inline-block"
                    >
                      Plan Logistics
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Transportation */}
                    {wedding.logistics.transportation?.guestTransfer && (
                      <div className="border rounded-lg p-4">
                        <h4 className="font-heading text-lg text-blue-600 mb-3">🚗 Transportation</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-500">Vehicle Type</p>
                            <p className="font-medium capitalize">{wedding.logistics.transportation.guestTransfer.vehicleType}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Vehicles</p>
                            <p className="font-medium">{wedding.logistics.transportation.guestTransfer.vehicleCount}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Distance</p>
                            <p className="font-medium">{wedding.logistics.transportation.guestTransfer.totalKms} km</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Cost</p>
                            <p className="font-medium text-emerald-600">{formatCurrency(wedding.logistics.transportation.guestTransfer.cost)}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Baraat */}
                    {wedding.logistics.baraat && (
                      <div className="border rounded-lg p-4">
                        <h4 className="font-heading text-lg text-purple-600 mb-3">🐎 Baraat</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {wedding.logistics.baraat.hasGhodi && (
                            <>
                              <div>
                                <p className="text-gray-500">Ghodi Type</p>
                                <p className="font-medium capitalize">{wedding.logistics.baraat.ghodiType}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Ghodi Cost</p>
                                <p className="font-medium text-emerald-600">{formatCurrency(wedding.logistics.baraat.ghodiCost)}</p>
                              </div>
                            </>
                          )}
                          {wedding.logistics.baraat.hasDholi && (
                            <>
                              <div>
                                <p className="text-gray-500">Dholis</p>
                                <p className="font-medium">{wedding.logistics.baraat.dholiCount} × {wedding.logistics.baraat.dholiHours}h</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Dholi Cost</p>
                                <p className="font-medium text-emerald-600">{formatCurrency(wedding.logistics.baraat.dholiCost)}</p>
                              </div>
                            </>
                          )}
                          {wedding.logistics.baraat.hasSFX && (
                            <>
                              <div>
                                <p className="text-gray-500">SFX Type</p>
                                <p className="font-medium capitalize">{wedding.logistics.baraat.sfxType}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">SFX Cost</p>
                                <p className="font-medium text-emerald-600">{formatCurrency(wedding.logistics.baraat.sfxCost)}</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Accommodation */}
                    {wedding.logistics.accommodation?.roomBlocks?.length > 0 && (
                      <div className="border rounded-lg p-4">
                        <h4 className="font-heading text-lg text-emerald-600 mb-3">🏨 Accommodation</h4>
                        {wedding.logistics.accommodation.roomBlocks.map((room, idx) => (
                          <div key={idx} className="grid grid-cols-2 gap-3 text-sm mb-2">
                            <div>
                              <p className="text-gray-500">Room Type</p>
                              <p className="font-medium capitalize">{room.roomType}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Rooms</p>
                              <p className="font-medium">{room.roomCount}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Nights</p>
                              <p className="font-medium">{room.nights}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Cost</p>
                              <p className="font-medium text-emerald-600">{formatCurrency(room.totalCost)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Staffing */}
                    {wedding.logistics.staffing && (
                      <div className="border rounded-lg p-4">
                        <h4 className="font-heading text-lg text-amber-600 mb-3">👥 Staff</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {wedding.logistics.staffing.coordinators?.count > 0 && (
                            <div>
                              <p className="text-gray-500">Coordinators</p>
                              <p className="font-medium">{wedding.logistics.staffing.coordinators.count}</p>
                            </div>
                          )}
                          {wedding.logistics.staffing.volunteers?.count > 0 && (
                            <div>
                              <p className="text-gray-500">Volunteers</p>
                              <p className="font-medium">{wedding.logistics.staffing.volunteers.count}</p>
                            </div>
                          )}
                          {wedding.logistics.staffing.security?.count > 0 && (
                            <div>
                              <p className="text-gray-500">Security</p>
                              <p className="font-medium">{wedding.logistics.staffing.security.count}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Total Logistics Cost */}
                    {wedding.logistics.totalCost > 0 && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Total Logistics Cost</span>
                          <span className="text-2xl font-bold">{formatCurrency(wedding.logistics.totalCost)}</span>
                        </div>
                      </div>
                    )}

                    <div className="mt-4">
                      <Link
                        to={`/dashboard/logistics/${id}`}
                        className="text-saffron-600 hover:text-saffron-700 font-medium"
                      >
                        Edit Logistics Plan →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Timeline Card */}
            <div className="bg-white rounded-xl p-6 shadow">
              <h3 className="font-heading text-lg text-saffron-600 mb-3">Timeline</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Created</span>
                  <span className="text-gray-800">{formatDate(wedding.createdAt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="text-gray-800">{formatDate(wedding.updatedAt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Wedding Date</span>
                  <span className="text-gray-800">{formatDate(wedding.weddingDate)}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-xl p-6 shadow">
              <h3 className="font-heading text-lg text-saffron-600 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate(`/dashboard/budget-wizard/${id}`)}
                  className="w-full text-left p-2 hover:bg-saffron-50 rounded-lg transition"
                >
                  ✏️ Edit Wedding Plan
                </button>
                <button
                  onClick={() => navigate(`/dashboard/guests?wedding=${id}`)}
                  className="w-full text-left p-2 hover:bg-saffron-50 rounded-lg transition"
                >
                  👥 Manage Guests
                </button>
                <Link
                  to="/dashboard/decor"
                  className="block w-full text-left p-2 hover:bg-saffron-50 rounded-lg transition"
                >
                  🎨 Browse Decor
                </Link>
                <Link
                  to="/dashboard/artists"
                  className="block w-full text-left p-2 hover:bg-saffron-50 rounded-lg transition"
                >
                  🎤 Browse Artists
                </Link>
                <Link
                  to="/dashboard/fnb"
                  className="block w-full text-left p-2 hover:bg-saffron-50 rounded-lg transition"
                >
                  🍽️ Plan F&B
                </Link>
              </div>
            </div>

            {/* Venue Info Card */}
            <div className="bg-white rounded-xl p-6 shadow">
              <h3 className="font-heading text-lg text-saffron-600 mb-3">Venue Information</h3>
              <p className="text-gray-800 font-medium capitalize">{wedding.city}</p>
              <p className="text-sm text-gray-500 capitalize mt-1">{wedding.venueTier.replace(/-/g, ' ')}</p>
              <p className="text-xs text-gray-400 mt-3">More venue details coming soon</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WeddingDetails;