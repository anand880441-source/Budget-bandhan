import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load admin stats');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border-l-4" style={{ borderColor: color }}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-saffron-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-cream-500 p-6">
      <div className="container mx-auto">
        <h1 className="font-heading text-3xl text-saffron-600 mb-6">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Users" value={stats?.counts?.users || 0} icon="👥" color="#FF9933" />
          <StatCard title="Total Weddings" value={stats?.counts?.weddings || 0} icon="💒" color="#046A38" />
          <StatCard title="Total Guests" value={stats?.counts?.guests || 0} icon="👤" color="#FFD700" />
          <StatCard title="Decor Items" value={stats?.counts?.decor || 0} icon="🎨" color="#6A1B9A" />
          <StatCard title="Artists" value={stats?.counts?.artists || 0} icon="🎤" color="#E44C4C" />
          <StatCard title="F&B Packages" value={stats?.counts?.fnb || 0} icon="🍽️" color="#004C8C" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/admin/users" className="block">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
              <span className="text-3xl block mb-2">👥</span>
              <h3 className="font-heading text-lg text-saffron-600 mb-1">Manage Users</h3>
              <p className="text-sm text-gray-500">View and manage user accounts</p>
            </div>
          </Link>
          <Link to="/admin/venue-costs" className="block">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
              <span className="text-3xl block mb-2">🏨</span>
              <h3 className="font-heading text-lg text-saffron-600 mb-1">Venue Costs</h3>
              <p className="text-sm text-gray-500">Configure base costs by city</p>
            </div>
          </Link>
          <Link to="/admin/content" className="block">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
              <span className="text-3xl block mb-2">📦</span>
              <h3 className="font-heading text-lg text-saffron-600 mb-1">Manage Content</h3>
              <p className="text-sm text-gray-500">Decor, Artists, F&B packages</p>
            </div>
          </Link>
          <Link to="/admin/content" className="block">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
              <span className="text-3xl block mb-2">📦</span>
              <h3 className="font-heading text-lg text-saffron-600 mb-1">Manage Content</h3>
              <p className="text-sm text-gray-500">Decor, Artists, F&B packages</p>
            </div>
          </Link>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h2 className="font-heading text-xl text-saffron-600 mb-4">Recent Users</h2>
          <div className="space-y-3">
            {stats?.recentUsers?.map(user => (
              <div key={user._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-saffron-100 text-saffron-700' : 'bg-gray-100 text-gray-700'}`}>
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Weddings */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="font-heading text-xl text-saffron-600 mb-4">Recent Weddings</h2>
          <div className="space-y-3">
            {stats?.recentWeddings?.map(wedding => (
              <div key={wedding._id} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{wedding.coupleNames}</p>
                <p className="text-sm text-gray-500">
                  {wedding.city} • {wedding.guestCount} guests • ₹{(wedding.budgetRanges?.medium / 100000).toFixed(1)}L
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;