import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import StepIndicator from '../../components/wizard/StepIndicator';
import CityVenueStep from '../../components/wizard/CityVenueStep';
import GuestDetailsStep from '../../components/wizard/GuestDetailsStep';
import FunctionsStep from '../../components/wizard/FunctionsStep';
import BudgetResultsStep from '../../components/wizard/BudgetResultsStep';

const steps = [
  { id: 1, name: 'City & Venue', description: 'Choose your wedding location' },
  { id: 2, name: 'Guest Details', description: 'Tell us about your guests' },
  { id: 3, name: 'Functions', description: 'Select wedding events' },
  { id: 4, name: 'Budget Results', description: 'View your estimated budget' }
];

const EditBudgetWizard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [weddingData, setWeddingData] = useState({
    city: '',
    venueTier: '',
    brideName: '',
    groomName: '',
    weddingDate: '',
    guestCount: '',
    outstationPercentage: 20,
    roomBlocks: 1,
    functions: ['wedding']
  });
  const [budgetResults, setBudgetResults] = useState(null);

  // Fetch existing wedding data
  useEffect(() => {
    fetchWeddingData();
  }, [id]);

  const fetchWeddingData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/weddings/${id}`);
      const wedding = response.data;

      // Split couple names into bride and groom
      const names = wedding.coupleNames.split(' & ');
      
      setWeddingData({
        city: wedding.city,
        venueTier: wedding.venueTier,
        brideName: names[0] || '',
        groomName: names[1] || '',
        weddingDate: wedding.weddingDate.split('T')[0],
        guestCount: wedding.guestCount,
        outstationPercentage: wedding.outstationPercentage || 20,
        roomBlocks: wedding.roomBlocks || 1,
        functions: wedding.functions?.map(f => f.type) || ['wedding']
      });

      // Calculate budget if we have all data
      if (wedding.city && wedding.venueTier && wedding.guestCount) {
        calculateBudget({
          city: wedding.city,
          venueTier: wedding.venueTier,
          guestCount: wedding.guestCount,
          outstationPercentage: wedding.outstationPercentage || 20,
          roomBlocks: wedding.roomBlocks || 1
        });
      }
    } catch (error) {
      console.error('Failed to fetch wedding data:', error);
      toast.error('Failed to load wedding data');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const calculateBudget = async (data) => {
    try {
      const results = await api.post('/weddings/calculate', {
        city: data.city,
        venueTier: data.venueTier,
        guestCount: parseInt(data.guestCount),
        outstationPercentage: parseInt(data.outstationPercentage),
        roomBlocks: parseInt(data.roomBlocks) || 1
      });
      setBudgetResults(results.data);
    } catch (error) {
      console.error('Failed to calculate budget:', error);
      toast.error('Failed to calculate budget');
    }
  };

  const handleNext = (stepData) => {
    const updatedData = { ...weddingData, ...stepData };
    setWeddingData(updatedData);
    
    if (currentStep < steps.length) {
      if (currentStep === 3) {
        calculateBudget(updatedData);
        setCurrentStep(4);
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSaveWedding = async () => {
    try {
      setSaving(true);
      const coupleNames = `${weddingData.brideName} & ${weddingData.groomName}`;
      
      await api.put(`/weddings/${id}`, {
        coupleNames,
        weddingDate: weddingData.weddingDate,
        city: weddingData.city,
        venueTier: weddingData.venueTier,
        guestCount: parseInt(weddingData.guestCount),
        outstationPercentage: parseInt(weddingData.outstationPercentage),
        roomBlocks: parseInt(weddingData.roomBlocks) || 1,
        functions: weddingData.functions.map(f => ({ type: f }))
      });

      toast.success('Wedding plan updated successfully! 🎉');
      navigate(`/dashboard/wedding/${id}`);
    } catch (error) {
      toast.error('Failed to update wedding plan');
    } finally {
      setSaving(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CityVenueStep
            data={weddingData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <GuestDetailsStep
            data={weddingData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <FunctionsStep
            data={weddingData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <BudgetResultsStep
            data={weddingData}
            budgetResults={budgetResults}
            onSave={handleSaveWedding}
            onBack={handleBack}
            isEditing={true}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-cream-500 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-saffron-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading wedding data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-cream-500 p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => navigate(`/dashboard/wedding/${id}`)}
              className="p-2 hover:bg-saffron-100 rounded-lg transition"
            >
              ← Back
            </button>
            <h1 className="font-heading text-3xl text-saffron-600">Edit Wedding Plan</h1>
          </div>
          <p className="text-gray-600 ml-12">Update your wedding details and budget</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Step Indicator */}
          <StepIndicator currentStep={currentStep} steps={steps} />

          {/* Step Content */}
          {saving ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-saffron-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Saving changes...</p>
            </div>
          ) : (
            renderStep()
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>All estimates are based on average costs in your selected city</p>
          <p>Final prices may vary based on season and vendor availability</p>
        </div>
      </div>
    </div>
  );
};

export default EditBudgetWizard;