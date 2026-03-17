import React from 'react';

const StepIndicator = ({ currentStep, steps }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle */}
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={`jharokha-icon w-10 h-12 flex items-center justify-center font-bold text-sm transition-all duration-500
                    ${isActive ? 'text-white shadow-md' :
                      isCompleted ? 'text-white' :
                      'bg-gray-100 text-gray-400'}`}
                  style={isActive ? {
                    background: 'linear-gradient(135deg, #FF9933, #FFD700)',
                  } : isCompleted ? {
                    background: 'linear-gradient(135deg, #046A38, #339F53)',
                  } : {}}
                >
                  {isCompleted ? '✓' : stepNumber}
                </div>
                <span className={`text-[10px] mt-2 font-bold uppercase tracking-wider ${
                  isActive ? 'text-saffron-600' :
                  isCompleted ? 'text-emerald-600' : 'text-gray-400'
                }`}>
                  {step.name}
                </span>
              </div>

              {/* Connector Line (except after last step) */}
              {index < steps.length - 1 && (
                <div className="flex-1 -mx-2 mb-6 self-center relative z-0">
                   <div 
                    className={`h-[2px] w-full transition-all duration-700 ${isCompleted ? 'opacity-100' : 'opacity-30'}`}
                    style={{
                      background: isCompleted 
                        ? 'repeating-linear-gradient(90deg, #046A38 0px, #046A38 6px, transparent 6px, transparent 10px)'
                        : 'repeating-linear-gradient(90deg, #d1d5db 0px, #d1d5db 6px, transparent 6px, transparent 10px)'
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Current Step Description */}
      <div className="text-center mt-6 animate-fade-in-up">
        <h2 className="font-heading text-xl mb-1">
          <span className="text-gold-foil">{steps[currentStep - 1]?.name}</span>
        </h2>
        <p className="text-sm text-gray-400 mt-0.5 italic">"{steps[currentStep - 1]?.description}"</p>
      </div>
    </div>
  );
};

export default StepIndicator;