import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import GuestManagement from './pages/dashboard/GuestManagement';
import BudgetWizard from './pages/dashboard/BudgetWizard';
import api from './services/api';
import WeddingDetails from './pages/dashboard/WeddingDetails';
import EditBudgetWizard from './pages/dashboard/EditBudgetWizard';
import DecorLibrary from './pages/dashboard/DecorLibrary';

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

  // IMPORTANT: Add fetchWeddings function
  const fetchWeddings = async () => {
    try {
      setLoading(true);
      // Make sure you have api imported at the top
      const response = await api.get('/weddings');
      setWeddings(response.data);
    } catch (error) {
      console.error('Failed to fetch weddings:', error);
      toast.error('Failed to load wedding plans');
    } finally {
      setLoading(false);
    }
  };

  // Add useEffect to fetch weddings on component mount
  useEffect(() => {
    fetchWeddings();
  }, []);

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
        fetchWeddings(); // Refresh the list
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
              <Link to="/dashboard/budget-wizard" className="hover:text-saffron-200 transition">Budget Wizard</Link>
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
        <div className="grid md:grid-cols-3 gap-6 mb-8">
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

        {/* Saved Wedding Plans Section */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading text-xl text-saffron-600">Your Wedding Plans</h3>
            <Link
              to="/dashboard/budget-wizard"
              className="btn-primary text-sm px-4 py-2"
            >
              + New Plan
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-saffron-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Loading your wedding plans...</p>
            </div>
          ) : weddings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💒</div>
              <p className="text-gray-500 text-lg mb-2">No wedding plans yet</p>
              <p className="text-gray-400 mb-4">Start by creating your first wedding budget</p>
              <Link
                to="/dashboard/budget-wizard"
                className="btn-primary inline-block"
              >
                Create Your First Plan
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {weddings.map((wedding) => (
                <div
                  key={wedding._id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-saffron-300 hover:shadow-md transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Wedding Info */}
                    <div className="flex-1 min-w-[200px]">
                      <h4 className="font-heading text-lg text-saffron-600 mb-1">
                        {wedding.coupleNames}
                      </h4>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <span>📅 {formatDate(wedding.weddingDate)}</span>
                        <span>📍 {wedding.city}</span>
                        <span>👥 {wedding.guestCount} guests</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {wedding.functions?.map((f, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-saffron-100 text-saffron-700 px-2 py-1 rounded"
                          >
                            {f.type}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Budget Info */}
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Estimated Budget</p>
                      <div className="text-lg font-bold text-saffron-600">
                        {formatCurrency(wedding.budgetRanges?.medium || 0)}
                      </div>
                      <p className="text-xs text-gray-400">
                        Range: {formatCurrency(wedding.budgetRanges?.low || 0)} - {formatCurrency(wedding.budgetRanges?.high || 0)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewWedding(wedding._id)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleEditWedding(wedding._id)}
                        className="p-2 text-saffron-600 hover:bg-saffron-50 rounded-lg transition"
                        title="Edit Plan"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteWedding(wedding._id)}
                        className="p-2 text-indian-red-600 hover:bg-indian-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Planning Progress</span>
                      <span>{wedding.status === 'completed' ? '100%' : '30%'}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-saffron-500 h-1.5 rounded-full"
                        style={{ width: wedding.status === 'completed' ? '100%' : '30%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
      <Route path="/dashboard/budget-wizard" element={
        <ProtectedRoute>
          <BudgetWizard />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/wedding/:id" element={
        <ProtectedRoute>
          <WeddingDetails />
        </ProtectedRoute>
      } />

      <Route path="/dashboard/budget-wizard/:id" element={
        <ProtectedRoute>
          <EditBudgetWizard />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/decor" element={
        <ProtectedRoute>
          <DecorLibrary />
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