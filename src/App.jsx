import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import GuestManagement from './pages/dashboard/GuestManagement';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-saffron-600">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

// Dashboard Component
const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [weddings, setWeddings] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // View wedding details
  const handleViewWedding = (id) => {
    navigate(`/dashboard/wedding/${id}`);
  };

  // Edit wedding
  const handleEditWedding = (id) => {
    navigate(`/dashboard/budget-wizard/${id}`);
  };

  // Delete wedding
  const handleDeleteWedding = async (id) => {
    if (window.confirm('Are you sure you want to delete this wedding plan?')) {
      try {
        await api.delete(`/weddings/${id}`);
        toast.success('Wedding plan deleted successfully');
        // Refresh the list
        fetchWeddings();
      } catch (error) {
        toast.error('Failed to delete wedding plan');
      }
    }
  };

  // Get the most recent wedding ID for logistics link
  const getLatestWeddingId = () => {
    return weddings.length > 0 ? weddings[0]._id : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-cream-500">
      <nav className="bg-saffron-500 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="font-heading text-2xl">BudgetBandhan</h1>
            <div className="flex items-center space-x-6">
              <Link to="/dashboard" className="hover:text-saffron-200 transition">Dashboard</Link>
              <Link to="/dashboard/guests" className="hover:text-saffron-200 transition">Guest Management</Link>
              <span>Welcome, {user?.name}!</span>
              <button
                onClick={logout}
                className="bg-white text-saffron-500 px-4 py-2 rounded-lg hover:bg-saffron-100 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className="card mb-8">
          <h2 className="font-heading text-2xl text-saffron-600 mb-4">Welcome to Your Dashboard</h2>
          <p className="text-gray-600 mb-6">
            Start planning your dream wedding with BudgetBandhan
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-saffron-50 p-4 rounded-lg text-center">
              <span className="text-3xl block mb-2">🎯</span>
              <h3 className="font-heading text-lg text-saffron-600 mb-1">Total Plans</h3>
              <p className="text-2xl font-bold text-saffron-500">{weddings.length}</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg text-center">
              <span className="text-3xl block mb-2">💰</span>
              <h3 className="font-heading text-lg text-emerald-600 mb-1">Avg. Budget</h3>
              <p className="text-2xl font-bold text-emerald-500">
                {weddings.length > 0
                  ? formatCurrency(weddings.reduce((acc, w) => acc + (w.budgetRanges?.medium || 0), 0) / weddings.length)
                  : '₹0'}
              </p>
            </div>
            <div className="bg-turmeric-50 p-4 rounded-lg text-center">
              <span className="text-3xl block mb-2">👥</span>
              <h3 className="font-heading text-lg text-turmeric-600 mb-1">Total Guests</h3>
              <p className="text-2xl font-bold text-turmeric-500">
                {weddings.reduce((acc, w) => acc + (w.guestCount || 0), 0)}
              </p>
            </div>
            <div className="bg-indian-red-50 p-4 rounded-lg text-center">
              <span className="text-3xl block mb-2">🏨</span>
              <h3 className="font-heading text-lg text-indian-red-600 mb-1">Active Plans</h3>
              <p className="text-2xl font-bold text-indian-red-500">
                {weddings.filter(w => w.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h3 className="font-heading text-xl text-saffron-600 mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-4 gap-6 mb-8">

          {/* Guest Manager Card */}
          <Link
            to="/dashboard/guests"
            className="block group"
          >
            <div className="bg-white border-2 border-emerald-100 rounded-xl p-6 hover:border-emerald-500 hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500 group-hover:text-white transition">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="font-heading text-xl text-emerald-600 mb-2 text-center">Guest Manager</h3>
              <p className="text-sm text-gray-600 text-center">Manage your guest list and RSVPs</p>
              <div className="mt-4 text-center">
                <span className="text-emerald-500 group-hover:text-emerald-600 font-medium">Manage Guests →</span>
              </div>
            </div>
          </Link>

          {/* Budget Wizard Card */}
          <Link
            to="/dashboard/budget-wizard"
            className="block group"
          >
            <div className="bg-white border-2 border-saffron-100 rounded-xl p-6 hover:border-saffron-500 hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-saffron-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-saffron-500 group-hover:text-white transition">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-heading text-xl text-saffron-600 mb-2 text-center">Budget Wizard</h3>
              <p className="text-sm text-gray-600 text-center">Create a new wedding budget plan</p>
              <div className="mt-4 text-center">
                <span className="text-saffron-500 group-hover:text-saffron-600 font-medium">Start Now →</span>
              </div>
            </div>
          </Link>

          {/* Decor Library Card */}
          <Link
            to="/dashboard/decor"
            className="block group"
          >
            <div className="bg-white border-2 border-purple-100 rounded-xl p-6 hover:border-purple-500 hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500 group-hover:text-white transition">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="font-heading text-xl text-purple-600 mb-2 text-center">Decor Library</h3>
              <p className="text-sm text-gray-600 text-center">Browse Indian wedding decor with cost insights</p>
              <div className="mt-4 text-center">
                <span className="text-purple-500 group-hover:text-purple-600 font-medium">Explore Now →</span>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

// Home Page Component
const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-cream-500">
      <nav className="bg-saffron-500 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="font-heading text-2xl">BudgetBandhan</h1>
            <div className="space-x-4">
              <Link to="/login" className="hover:text-saffron-200 transition">Login</Link>
              <Link to="/register" className="bg-white text-saffron-500 px-4 py-2 rounded-lg hover:bg-saffron-100 transition">Register</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="font-decorative text-5xl text-saffron-600 mb-4">
            AI-Powered Wedding Budget Estimator
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Plan your dream Indian wedding with data-driven insights
          </p>
          <Link
            to="/register"
            className="btn-primary text-lg px-8 py-3 inline-block"
          >
            Start Planning
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="card text-center">
            <div className="w-16 h-16 bg-saffron-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="font-heading text-xl text-saffron-600 mb-2">Smart Budget</h3>
            <p className="text-gray-600">Data-driven estimates based on city, venue & guest count</p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="font-heading text-xl text-emerald-600 mb-2">Decor Library</h3>
            <p className="text-gray-600">Browse Indian wedding decor with real cost insights</p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-turmeric-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="font-heading text-xl text-turmeric-600 mb-2">Guest Manager</h3>
            <p className="text-gray-600">RSVP tracking with automatic food cost updates</p>
          </div>
        </div>
      </main>

      <footer className="bg-saffron-800 text-white mt-12 py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© 2026 BudgetBandhan. All rights reserved.</p>
          <p className="text-sm mt-2 text-saffron-200">
            Made with ❤️ for Indian Weddings
          </p>
        </div>
      </footer>
    </div>
  );
};

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/guests" element={
        <ProtectedRoute>
          <GuestManagement />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#FFF8E7',
              color: '#333',
              border: '1px solid #FF9933',
            },
            success: {
              icon: '🎉',
              style: {
                border: '1px solid #046A38',
              },
            },
            error: {
              icon: '❌',
              style: {
                border: '1px solid #E44C4C',
              },
            },
          }}
        />
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;