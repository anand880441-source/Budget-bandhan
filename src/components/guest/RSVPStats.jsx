import React from 'react';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow p-4 border-l-4" style={{ borderColor: color }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
      <span className="text-2xl">{icon}</span>
    </div>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

const RSVPStats = ({ stats }) => {
  if (!stats) return null;

  const totalGuests = stats.totalWithPlusOne || 0;
  const confirmed = stats.confirmed || 0;
  const confirmedWithPlusOne = stats.confirmedWithPlusOne || 0;
  const responseRate = totalGuests ? Math.round((confirmed / totalGuests) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Guests"
          value={totalGuests}
          icon="👥"
          color="#FF9933"
        />
        <StatCard
          title="Confirmed"
          value={confirmed}
          icon="✅"
          color="#046A38"
        />
        <StatCard
          title="Pending"
          value={stats.pending || 0}
          icon="⏳"
          color="#FFD700"
        />
        <StatCard
          title="Declined"
          value={stats.declined || 0}
          icon="❌"
          color="#E44C4C"
        />
      </div>

      {/* Response Rate Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Response Rate</span>
          <span className="text-sm font-medium text-emerald-600">{responseRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${responseRate}%` }}
          ></div>
        </div>
      </div>

      {/* Dietary Preferences */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-heading text-lg text-saffron-600 mb-3">Dietary Preferences</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-2 bg-emerald-50 rounded">
            <span className="block text-2xl mb-1">🌱</span>
            <span className="text-sm font-medium">Veg</span>
            <span className="block text-lg font-bold text-emerald-600">{stats.veg || 0}</span>
          </div>
          <div className="text-center p-2 bg-red-50 rounded">
            <span className="block text-2xl mb-1">🍗</span>
            <span className="text-sm font-medium">Non-Veg</span>
            <span className="block text-lg font-bold text-red-600">{stats.nonVeg || 0}</span>
          </div>
          <div className="text-center p-2 bg-saffron-50 rounded">
            <span className="block text-2xl mb-1">🕉️</span>
            <span className="text-sm font-medium">Jain</span>
            <span className="block text-lg font-bold text-saffron-600">{stats.jain || 0}</span>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded">
            <span className="block text-2xl mb-1">⭐</span>
            <span className="text-sm font-medium">Special</span>
            <span className="block text-lg font-bold text-purple-600">{stats.special || 0}</span>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Outstation Guests</span>
            <span className="text-xl">🚗</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.outstation || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Need accommodation/transport</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Maybe</span>
            <span className="text-xl">🤔</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{stats.maybe || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Waiting for confirmation</p>
        </div>
      </div>
    </div>
  );
};

export default RSVPStats;