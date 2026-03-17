import React, { useState, useEffect } from 'react';
import { STAFF_TYPES } from '../../utils/constants/logisticsConstants';

const StaffingCalculator = ({ onUpdate }) => {
  const [staffing, setStaffing] = useState({
    coordinators: 0,
    volunteers: 0,
    security: 0
  });
  const [total, setTotal] = useState(0);

  const handleChange = (type, value) => {
    const newValue = parseInt(value) || 0;
    const newStaffing = { ...staffing, [type]: newValue };
    setStaffing(newStaffing);
  };

  // Calculate total whenever staffing changes
  useEffect(() => {
    const rates = { coordinators: 2000, volunteers: 1000, security: 2500 };
    const newTotal = 
      staffing.coordinators * rates.coordinators +
      staffing.volunteers * rates.volunteers +
      staffing.security * rates.security;
    
    setTotal(newTotal);
    
    // Call the onUpdate prop to send data to parent
    if (onUpdate) {
      onUpdate({
        ...staffing,
        total: newTotal
      });
    }
  }, [staffing, onUpdate]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="font-heading text-xl text-saffron-600 mb-4">👥 Staff & Volunteers</h3>
      
      <div className="space-y-4">
        {STAFF_TYPES.map(staff => (
          <div key={staff.id}>
            <label className="block text-sm text-gray-600 mb-1">
              {staff.icon} {staff.name} (₹{staff.rate}/day)
            </label>
            <input
              type="number"
              value={staffing[staff.id]}
              onChange={(e) => handleChange(staff.id, e.target.value)}
              className="input-field"
              min="0"
            />
          </div>
        ))}

        {/* Total */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Staff Cost:</span>
            <span className="text-2xl font-bold text-saffron-600">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffingCalculator;