import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { logisticsService } from '../../services/logisticsService';
import TransportCalculator from '../../components/logistics/TransportCalculator';
import BaraatCalculator from '../../components/logistics/BaraatCalculator';
import AccommodationCalculator from '../../components/logistics/AccommodationCalculator';
import StaffingCalculator from '../../components/logistics/StaffingCalculator';

const LogisticsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wedding, setWedding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logistics, setLogistics] = useState(null);
  const [activeTab, setActiveTab] = useState('transport');
  const [calculations, setCalculations] = useState({
    transport: null,
    baraat: null,
    accommodation: null,
    staffing: { coordinators: 0, volunteers: 0, security: 0, total: 0 }
  });

  useEffect(() => {
    if (id) {
      fetchWeddingData();
    } else {
      toast.error('No wedding ID provided');
      navigate('/dashboard');
    }
  }, [id]);

  const fetchWeddingData = async () => {
    try {
      setLoading(true);

      // Fetch wedding details
      const weddingRes = await api.get(`/weddings/${id}`);
      setWedding(weddingRes.data);

      // Fetch logistics
      try {
        const logisticsRes = await logisticsService.getLogistics(id);
        console.log('Loaded logistics:', logisticsRes);
        setLogistics(logisticsRes);

        // Pre-fill calculations if logistics data exists
        if (logisticsRes && logisticsRes.transportation) {
          // You can pre-fill calculator states here if needed
        }
      } catch (logisticsError) {
        console.log('No existing logistics found');
      }

    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load logistics data');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleTransportCalculate = (data) => {
    console.log('Transport calculated:', data);
    setCalculations(prev => ({
      ...prev,
      transport: data
    }));
  };

  const handleBaraatCalculate = (data) => {
    console.log('Baraat calculated:', data);
    setCalculations(prev => ({
      ...prev,
      baraat: data
    }));
  };

  const handleAccommodationCalculate = (data) => {
    console.log('Accommodation calculated:', data);
    setCalculations(prev => ({
      ...prev,
      accommodation: data
    }));
  };

  const handleStaffingUpdate = (data) => {
    console.log('Staffing updated:', data);
    setCalculations(prev => ({
      ...prev,
      staffing: data
    }));
  };

  const calculateTotalCost = () => {
    let total = 0;

    if (calculations.transport?.total) {
      total += calculations.transport.total;
    }

    if (calculations.baraat?.total) {
      total += calculations.baraat.total;
    }

    if (calculations.accommodation?.totalCost) {
      total += calculations.accommodation.totalCost;
    }

    if (calculations.staffing?.total) {
      total += calculations.staffing.total;
    }

    return total;
  };

  const handleSaveLogistics = async () => {
    try {
      const totalCost = calculateTotalCost();

      const logisticsData = {
        weddingId: id,
        transportation: calculations.transport ? {
          guestTransfer: {
            required: true,
            vehicleType: calculations.transport.vehicleType,
            vehicleCount: calculations.transport.vehiclesNeeded,
            totalKms: calculations.transport.distance,
            cost: calculations.transport.total
          }
        } : null,
        baraat: calculations.baraat ? {
          hasGhodi: true,
          ghodiType: calculations.baraat.ghodiType,
          ghodiCost: calculations.baraat.ghodi?.cost || 0,
          hasDholi: calculations.baraat.dholi?.count > 0,
          dholiCount: calculations.baraat.dholi?.count || 0,
          dholiHours: calculations.baraat.dholi?.hours || 0,
          dholiCost: calculations.baraat.dholi?.cost || 0,
          hasSFX: calculations.baraat.sfx?.cost > 0,
          sfxType: calculations.baraat.sfx?.type,
          sfxCost: calculations.baraat.sfx?.cost || 0
        } : null,
        accommodation: calculations.accommodation ? {
          roomBlocks: [{
            roomType: calculations.accommodation.roomType,
            roomCount: calculations.accommodation.roomsNeeded,
            nights: calculations.accommodation.nights,
            pricePerRoom: calculations.accommodation.rate,
            totalCost: calculations.accommodation.totalCost
          }],
          totalRooms: calculations.accommodation.roomsNeeded,
          totalCost: calculations.accommodation.totalCost
        } : null,
        staffing: {
          coordinators: {
            count: calculations.staffing.coordinators || 0,
            totalCost: (calculations.staffing.coordinators || 0) * 2000
          },
          volunteers: {
            count: calculations.staffing.volunteers || 0,
            totalCost: (calculations.staffing.volunteers || 0) * 1000
          },
          security: {
            count: calculations.staffing.security || 0,
            totalCost: (calculations.staffing.security || 0) * 2500
          }
        },
        totalCost: totalCost
      };

      await logisticsService.updateLogistics(id, logisticsData);
      toast.success('Logistics plan saved successfully!');

      // Refresh data
      fetchWeddingData();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save logistics plan');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const tabs = [
    { id: 'transport', name: 'Transport', icon: '🚗' },
    { id: 'baraat', name: 'Baraat', icon: '🐎' },
    { id: 'accommodation', name: 'Accommodation', icon: '🏨' },
    { id: 'staffing', name: 'Staff', icon: '👥' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-saffron-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading logistics data...</p>
        </div>
      </div>
    );
  }

  const totalCost = calculateTotalCost();

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-cream-500 p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/dashboard/wedding/${id}`)}
              className="p-2 hover:bg-saffron-100 rounded-lg transition"
            >
              ← Back
            </button>
            <div>
              <h1 className="font-heading text-3xl text-saffron-600">Logistics Planning</h1>
              <p className="text-gray-600">{wedding?.coupleNames}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium flex items-center gap-2 transition whitespace-nowrap
                ${activeTab === tab.id
                  ? 'text-saffron-600 border-b-2 border-saffron-500'
                  : 'text-gray-500 hover:text-saffron-600'}`}
            >
              <span>{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Calculators */}
          <div className="space-y-6">
            {activeTab === 'transport' && (
              <TransportCalculator
                wedding={wedding}
                onCalculate={handleTransportCalculate}
              />
            )}
            {activeTab === 'baraat' && (
              <BaraatCalculator
                onCalculate={handleBaraatCalculate}
              />
            )}
            {activeTab === 'accommodation' && (
              <AccommodationCalculator
                wedding={wedding}
                onCalculate={handleAccommodationCalculate}
              />
            )}
            {activeTab === 'staffing' && (
              <StaffingCalculator
                onUpdate={handleStaffingUpdate}
              />
            )}
          </div>

          {/* Right Column - Summary & Save */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow sticky top-4">
              <h3 className="font-heading text-xl text-saffron-600 mb-4">Logistics Summary</h3>

              {/* Transport Summary */}
              {calculations.transport && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-blue-600">🚗 Transportation</p>
                    <span className="text-blue-600 font-bold">{formatCurrency(calculations.transport.total)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {calculations.transport.vehiclesNeeded} vehicles • {calculations.transport.distance}km
                  </p>
                </div>
              )}

              {/* Baraat Summary */}
              {calculations.baraat && (
                <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-purple-600">🐎 Baraat</p>
                    <span className="text-purple-600 font-bold">{formatCurrency(calculations.baraat.total)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {calculations.baraat.ghodi && 'Ghodi • '}
                    {calculations.baraat.dholi?.count > 0 && `${calculations.baraat.dholi.count} Dholis • `}
                    {calculations.baraat.sfx?.cost > 0 && 'SFX'}
                  </p>
                </div>
              )}

              {/* Accommodation Summary */}
              {calculations.accommodation && (
                <div className="mb-4 p-3 bg-emerald-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-emerald-600">🏨 Accommodation</p>
                    <span className="text-emerald-600 font-bold">{formatCurrency(calculations.accommodation.totalCost)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {calculations.accommodation.roomsNeeded} rooms • {calculations.accommodation.nights} nights
                  </p>
                </div>
              )}

              {/* Staff Summary */}
              {(calculations.staffing?.coordinators > 0 ||
                calculations.staffing?.volunteers > 0 ||
                calculations.staffing?.security > 0) && (
                  <div className="mb-4 p-3 bg-amber-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-amber-600">👥 Staff</p>
                      <span className="text-amber-600 font-bold">{formatCurrency(calculations.staffing.total)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {calculations.staffing.coordinators > 0 && `${calculations.staffing.coordinators} Coordinators `}
                      {calculations.staffing.volunteers > 0 && `${calculations.staffing.volunteers} Volunteers `}
                      {calculations.staffing.security > 0 && `${calculations.staffing.security} Security`}
                    </p>
                  </div>
                )}

              {/* No calculations yet */}
              {!calculations.transport && !calculations.baraat && !calculations.accommodation &&
                calculations.staffing?.coordinators === 0 &&
                calculations.staffing?.volunteers === 0 &&
                calculations.staffing?.security === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <p>No calculations yet</p>
                    <p className="text-sm">Use the calculators to estimate costs</p>
                  </div>
                )}

              {/* Total */}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Total Logistics Cost</span>
                  <span className="text-2xl font-bold text-saffron-600">
                    {formatCurrency(totalCost)}
                  </span>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveLogistics}
                className="w-full btn-primary mt-4 py-3"
                disabled={totalCost === 0}
              >
                Save Logistics Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsPage;