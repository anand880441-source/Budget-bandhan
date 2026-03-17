import React from 'react';

const StatCard = ({ title, value, icon, color }) => (
  <div
    className="card flex flex-col items-center text-center animate-fade-in-up"
    style={{ borderLeft: `4px solid ${color}` }}
  >
    <div className={`jharokha-icon w-12 h-14 mb-3 flex items-center justify-center shadow-sm`} style={{ background: `${color}15` }}>
      <span className="text-2xl">{icon}</span>
    </div>
    <span className="bandhani-badge text-[10px] mb-1" style={{ background: color, color: '#fff' }}>
      {title.toUpperCase()}
    </span>
    <p className="text-3xl font-bold font-heading" style={{ color }}>{value}</p>
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
      <div className="card">
        <div className="flex justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">Response Rate</span>
          <span className="text-sm font-bold text-emerald-600">{responseRate}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full transition-all duration-700"
            style={{
              width: `${responseRate}%`,
              background: 'linear-gradient(90deg, #046A38, #339F53)'
            }}
          ></div>
        </div>
      </div>

      {/* Dietary Preferences */}
      <div className="card">
        <h3 className="font-heading text-lg text-saffron-600 mb-2">Dietary Preferences</h3>
        <div className="kantha-line mb-4 opacity-40"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bandhani-bg text-center p-3 rounded-xl border border-emerald-100 hover:shadow-sm transition saree-border-left" style={{ borderLeftColor: '#046A38' }}>
            <span className="block text-2xl mb-1">🌱</span>
            <span className="bandhani-badge bandhani-badge-emerald text-[10px] mb-1">VEG</span>
            <span className="block text-xl font-bold text-emerald-600 font-heading">{stats.veg || 0}</span>
          </div>
          <div className="bandhani-bg text-center p-3 rounded-xl border border-red-100 hover:shadow-sm transition saree-border-left" style={{ borderLeftColor: '#E44C4C' }}>
            <span className="block text-2xl mb-1">🍗</span>
            <span className="bandhani-badge text-[10px] mb-1" style={{ background: '#E44C4C', color: '#fff' }}>NON-VEG</span>
            <span className="block text-xl font-bold text-red-600 font-heading">{stats.nonVeg || 0}</span>
          </div>
          <div className="bandhani-bg text-center p-3 rounded-xl border border-saffron-100 hover:shadow-sm transition saree-border-left" style={{ borderLeftColor: '#FF9933' }}>
            <span className="block text-2xl mb-1">🕉️</span>
            <span className="bandhani-badge text-[10px] mb-1" style={{ background: '#FF9933', color: '#fff' }}>JAIN</span>
            <span className="block text-xl font-bold text-saffron-600 font-heading">{stats.jain || 0}</span>
          </div>
          <div className="bandhani-bg text-center p-3 rounded-xl border border-purple-100 hover:shadow-sm transition saree-border-left" style={{ borderLeftColor: '#A855F7' }}>
            <span className="block text-2xl mb-1">⭐</span>
            <span className="bandhani-badge text-[10px] mb-1" style={{ background: '#A855F7', color: '#fff' }}>SPECIAL</span>
            <span className="block text-xl font-bold text-purple-600 font-heading">{stats.special || 0}</span>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card saree-border-left" style={{ borderLeftColor: '#3B82F6' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="bandhani-badge text-[10px]" style={{ background: '#3B82F6', color: '#fff' }}>OUTSTATION</span>
            <div className="jharokha-icon w-10 h-10 bg-blue-50">
              <span className="text-xl">🚗</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-600 font-heading">{stats.outstation || 0}</p>
          <p className="text-[10px] text-gray-400 mt-1 italic">Need stay/transport</p>
        </div>
        <div className="card saree-border-left" style={{ borderLeftColor: '#F59E0B' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="bandhani-badge text-[10px]" style={{ background: '#F59E0B', color: '#fff' }}>MAYBE</span>
            <div className="jharokha-icon w-10 h-10 bg-yellow-50">
              <span className="text-xl">🤔</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-yellow-600 font-heading">{stats.maybe || 0}</p>
          <p className="text-[10px] text-gray-400 mt-1 italic">Awaiting clarity</p>
        </div>
      </div>
    </div>
  );
};

export default RSVPStats;