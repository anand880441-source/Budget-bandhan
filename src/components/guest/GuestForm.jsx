import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const GuestForm = ({ guest, onSubmit, onClose }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: guest || {
      rsvpStatus: 'pending',
      dietaryPreference: 'none',
      category: 'friend',
      isOutstation: false,
      plusOne: false,
      invitedToFunctions: ['wedding']
    }
  });

  const isOutstation = watch('isOutstation');
  const plusOne = watch('plusOne');

  const [selectedFunctions, setSelectedFunctions] = useState(
    guest?.invitedToFunctions || ['wedding']
  );

  const functions = [
    { id: 'mehendi', label: 'Mehendi', icon: '🌿' },
    { id: 'sangeet', label: 'Sangeet', icon: '🎵' },
    { id: 'wedding', label: 'Wedding', icon: '💒' },
    { id: 'reception', label: 'Reception', icon: '🥂' }
  ];

  const handleFunctionToggle = (functionId) => {
    setSelectedFunctions(prev => {
      if (prev.includes(functionId)) {
        return prev.filter(f => f !== functionId);
      } else {
        return [...prev, functionId];
      }
    });
  };

  useEffect(() => {
    setValue('invitedToFunctions', selectedFunctions);
  }, [selectedFunctions, setValue]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-heading text-2xl text-saffron-600">
              {guest ? 'Edit Guest' : 'Add New Guest'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="input-field"
                  placeholder="Enter guest name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-indian-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="input-field"
                  placeholder="Phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="input-field"
                  placeholder="Email address"
                />
              </div>
            </div>

            {/* Category and Group */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select {...register('category')} className="input-field">
                  <option value="family">Family</option>
                  <option value="friend">Friend</option>
                  <option value="colleague">Colleague</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group/Family Name
                </label>
                <input
                  type="text"
                  {...register('group')}
                  className="input-field"
                  placeholder="e.g., Sharma Family"
                />
              </div>
            </div>

            {/* RSVP and Dietary */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RSVP Status
                </label>
                <select {...register('rsvpStatus')} className="input-field">
                  <option value="pending">⏳ Pending</option>
                  <option value="confirmed">✅ Confirmed</option>
                  <option value="declined">❌ Declined</option>
                  <option value="maybe">🤔 Maybe</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dietary Preference
                </label>
                <select {...register('dietaryPreference')} className="input-field">
                  <option value="none">No Preference</option>
                  <option value="veg">🌱 Vegetarian</option>
                  <option value="non-veg">🍗 Non-Vegetarian</option>
                  <option value="jain">🕉️ Jain</option>
                  <option value="special">⭐ Special</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dietary Notes
                </label>
                <input
                  type="text"
                  {...register('dietaryNotes')}
                  className="input-field"
                  placeholder="Any specific dietary requirements"
                />
              </div>
            </div>

            {/* Outstation */}
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('isOutstation')}
                  className="h-4 w-4 text-saffron-500 focus:ring-saffron-400 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  This guest is coming from outstation
                </label>
              </div>

              {isOutstation && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City of Origin
                  </label>
                  <input
                    type="text"
                    {...register('outstationCity')}
                    className="input-field"
                    placeholder="e.g., Mumbai, Delhi, etc."
                  />
                </div>
              )}
            </div>

            {/* Plus One */}
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('plusOne')}
                  className="h-4 w-4 text-saffron-500 focus:ring-saffron-400 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Guest is bringing a plus one
                </label>
              </div>

              {plusOne && (
                <div className="grid grid-cols-2 gap-4 ml-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plus One Name
                    </label>
                    <input
                      type="text"
                      {...register('plusOneName')}
                      className="input-field"
                      placeholder="Name of companion"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dietary Preference
                    </label>
                    <select {...register('plusOneDietary')} className="input-field">
                      <option value="none">No Preference</option>
                      <option value="veg">🌱 Vegetarian</option>
                      <option value="non-veg">🍗 Non-Vegetarian</option>
                      <option value="jain">🕉️ Jain</option>
                      <option value="special">⭐ Special</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Invited Functions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invited to Functions
              </label>
              <div className="grid grid-cols-2 gap-2">
                {functions.map(func => (
                  <label key={func.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedFunctions.includes(func.id)}
                      onChange={() => handleFunctionToggle(func.id)}
                      className="h-4 w-4 text-saffron-500 focus:ring-saffron-400 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      {func.icon} {func.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                {...register('notes')}
                rows="3"
                className="input-field"
                placeholder="Any special requirements or notes..."
              ></textarea>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {guest ? 'Update Guest' : 'Add Guest'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GuestForm;