import React, { useState } from 'react';
import { formatRSVPStatus, formatDietary, formatCategory } from "../../utils/helpers/guestHelpers";

const GuestTable = ({ guests, onEdit, onDelete, onSelect, selectedGuests, onBulkAction }) => {
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    if (selectAll) {
      onSelect([]);
    } else {
      onSelect(guests.map(g => g._id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectGuest = (id) => {
    if (selectedGuests.includes(id)) {
      onSelect(selectedGuests.filter(gId => gId !== id));
    } else {
      onSelect([...selectedGuests, id]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-saffron-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-saffron-500 focus:ring-saffron-400"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guest Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                RSVP Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dietary
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plus One
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {guests.map((guest) => {
              const rsvpStyle = formatRSVPStatus(guest.rsvpStatus);
              const dietaryStyle = formatDietary(guest.dietaryPreference);
              const categoryStyle = formatCategory(guest.category);

              return (
                <tr key={guest._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedGuests.includes(guest._id)}
                      onChange={() => handleSelectGuest(guest._id)}
                      className="rounded border-gray-300 text-saffron-500 focus:ring-saffron-400"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{guest.name}</div>
                        {guest.group && (
                          <div className="text-xs text-gray-500">{guest.group}</div>
                        )}
                        {guest.isOutstation && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                            🚗 Outstation {guest.outstationCity && `- ${guest.outstationCity}`}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {guest.phone && (
                      <div className="text-sm text-gray-900">{guest.phone}</div>
                    )}
                    {guest.email && (
                      <div className="text-xs text-gray-500">{guest.email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">
                      {categoryStyle.icon} {categoryStyle.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${rsvpStyle.color}`}>
                      {rsvpStyle.icon} {rsvpStyle.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${dietaryStyle.color}`}>
                      {dietaryStyle.icon} {dietaryStyle.label}
                    </span>
                    {guest.dietaryNotes && (
                      <div className="text-xs text-gray-500 mt-1">{guest.dietaryNotes}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {guest.plusOne ? (
                      <div>
                        <span className="text-sm text-gray-900">+1</span>
                        <div className="text-xs text-gray-500">{guest.plusOneName || 'Guest'}</div>
                        {guest.plusOneDietary && guest.plusOneDietary !== 'none' && (
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${formatDietary(guest.plusOneDietary).color}`}>
                            {formatDietary(guest.plusOneDietary).icon}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button
                      onClick={() => onEdit(guest)}
                      className="text-emerald-600 hover:text-emerald-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(guest._id)}
                      className="text-indian-red-500 hover:text-indian-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {guests.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <p className="text-gray-500 text-lg">No guests found</p>
          <p className="text-gray-400">Add your first guest to get started</p>
        </div>
      )}
    </div>
  );
};

export default GuestTable;