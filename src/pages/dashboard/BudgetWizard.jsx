import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import StepIndicator from '../../components/wizard/StepIndicator';
import CityVenueStep from '../../components/wizard/CityVenueStep';
import GuestDetailsStep from '../../components/wizard/GuestDetailsStep';
import FunctionsStep from '../../components/wizard/FunctionsStep';
import BudgetResultsStep from '../../components/wizard/BudgetResultsStep';
import { weddingService } from '../../services/weddingService';

const steps = [
  { id: 1, name: 'City & Venue', description: 'Choose your wedding location' },
  { id: 2, name: 'Guest Details', description: 'Tell us about your guests' },
  { id: 3, name: 'Functions', description: 'Select wedding events' },
  { id: 4, name: 'Budget Results', description: 'View your estimated budget' }
];

const BudgetWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
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
  const [loading, setLoading] = useState(false);

  const handleNext = (stepData) => {
    setWeddingData(prev => ({ ...prev, ...stepData }));

    if (currentStep < steps.length) {
      // If moving to results step, calculate budget
      if (currentStep === 3) {
        calculateBudget({ ...weddingData, ...stepData });
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const calculateBudget = async (data) => {
    try {
      setLoading(true);
      const results = await weddingService.calculateBudget({
        city: data.city,
        venueTier: data.venueTier,
        guestCount: parseInt(data.guestCount),
        outstationPercentage: parseInt(data.outstationPercentage),
        roomBlocks: parseInt(data.roomBlocks) || 1
      });
      setBudgetResults(results);
      setCurrentStep(4);
    } catch (error) {
      toast.error('Failed to calculate budget');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWedding = async () => {
    try {
      setLoading(true);
      const coupleNames = `${weddingData.brideName} & ${weddingData.groomName}`;

      await weddingService.createWedding({
        coupleNames,
        weddingDate: weddingData.weddingDate,
        city: weddingData.city,
        venueTier: weddingData.venueTier,
        guestCount: parseInt(weddingData.guestCount),
        outstationPercentage: parseInt(weddingData.outstationPercentage),
        roomBlocks: parseInt(weddingData.roomBlocks) || 1,
        functions: weddingData.functions.map(f => ({ type: f }))
      });

      toast.success('Wedding plan saved successfully! 🎉');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to save wedding plan');
    } finally {
      setLoading(false);
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
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-cream-500 p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 animate-fade-in-up">
          <h1 className="font-heading text-3xl text-saffron-600 mb-1">✨ Wedding Budget Wizard</h1>
          <p className="text-gray-500 text-sm">Answer a few questions to get your estimated budget</p>
        </div>

        {/* Main Card */}
        <div className="card p-6 md:p-8">
          {/* Step Indicator */}
          <StepIndicator currentStep={currentStep} steps={steps} />

          {/* Step Content */}
          {loading && currentStep !== 4 ? (
            <div className="text-center py-16">
              <div className="diya-spinner mx-auto mb-5"></div>
              <p className="text-saffron-700 font-heading text-lg">Calculating your perfect budget...</p>
              <p className="text-gray-400 text-sm mt-1">Working the numbers for your dream day</p>
            </div>
          ) : (
            renderStep()
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-400">
          <p>All estimates are based on average costs in your selected city</p>
          <p>Final prices may vary based on season and vendor availability</p>
        </div>
      </div>
    </div>
  );
};

export default BudgetWizard;