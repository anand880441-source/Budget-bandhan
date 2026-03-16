// Format RSVP status for display
export const formatRSVPStatus = (status) => {
  const statusMap = {
    'pending': { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
    'confirmed': { label: 'Confirmed', color: 'bg-emerald-100 text-emerald-800', icon: '✅' },
    'declined': { label: 'Declined', color: 'bg-red-100 text-red-800', icon: '❌' },
    'maybe': { label: 'Maybe', color: 'bg-blue-100 text-blue-800', icon: '🤔' }
  };
  return statusMap[status] || statusMap.pending;
};

// Format dietary preference for display
export const formatDietary = (pref) => {
  const dietaryMap = {
    'veg': { label: 'Vegetarian', color: 'bg-emerald-100 text-emerald-800', icon: '🌱' },
    'non-veg': { label: 'Non-Vegetarian', color: 'bg-red-100 text-red-800', icon: '🍗' },
    'jain': { label: 'Jain', color: 'bg-saffron-100 text-saffron-800', icon: '🕉️' },
    'special': { label: 'Special', color: 'bg-purple-100 text-purple-800', icon: '⭐' },
    'none': { label: 'No Preference', color: 'bg-gray-100 text-gray-800', icon: '➖' }
  };
  return dietaryMap[pref] || dietaryMap.none;
};

// Format category for display
export const formatCategory = (category) => {
  const categoryMap = {
    'family': { label: 'Family', icon: '👨‍👩‍👧‍👦' },
    'friend': { label: 'Friend', icon: '👥' },
    'colleague': { label: 'Colleague', icon: '💼' },
    'other': { label: 'Other', icon: '📌' }
  };
  return categoryMap[category] || categoryMap.other;
};

// Calculate total guests including plus ones
export const calculateTotalGuests = (guests) => {
  return guests.reduce((total, guest) => {
    return total + 1 + (guest.plusOne ? 1 : 0);
  }, 0);
};

// Filter guests by multiple criteria
export const filterGuests = (guests, filters) => {
  return guests.filter(guest => {
    // Search by name
    if (filters.search && !guest.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Filter by RSVP status
    if (filters.rsvpStatus && filters.rsvpStatus !== 'all' && guest.rsvpStatus !== filters.rsvpStatus) {
      return false;
    }
    
    // Filter by category
    if (filters.category && filters.category !== 'all' && guest.category !== filters.category) {
      return false;
    }
    
    // Filter by dietary preference
    if (filters.dietary && filters.dietary !== 'all' && guest.dietaryPreference !== filters.dietary) {
      return false;
    }
    
    // Filter by outstation
    if (filters.outstation && guest.isOutstation !== (filters.outstation === 'true')) {
      return false;
    }
    
    return true;
  });
};

// Generate sample CSV template for bulk import
export const generateCSVTemplate = () => {
  const headers = [
    'name',
    'phone',
    'email',
    'category',
    'group',
    'rsvpStatus',
    'dietaryPreference',
    'isOutstation',
    'outstationCity',
    'plusOne',
    'plusOneName',
    'plusOneDietary',
    'invitedToFunctions',
    'notes'
  ].join(',');

  const sample = [
    'Rahul Sharma,9876543210,rahul@email.com,family,Sharma Family,confirmed,veg,false,,true,Priya Sharma,veg,"mehendi,sangeet,wedding",Close family friend',
    'Priya Patel,9876543211,priya@email.com,friend,College Group,pending,non-veg,true,Delhi,false,,,,'
  ].join('\n');

  return `${headers}\n${sample}`;
};

// Parse CSV to guest objects
export const parseCSVToGuests = (csvText) => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1)
    .filter(line => line.trim())
    .map(line => {
      const values = line.split(',').map(v => v.trim());
      const guest = {};
      
      headers.forEach((header, index) => {
        let value = values[index];
        
        // Parse boolean fields
        if (header === 'isOutstation' || header === 'plusOne') {
          value = value?.toLowerCase() === 'true';
        }
        
        // Parse invitedToFunctions as array
        if (header === 'invitedToFunctions' && value) {
          value = value.split(';').map(f => f.trim());
        }
        
        guest[header] = value || undefined;
      });
      
      return guest;
    });
};