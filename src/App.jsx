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
import ArtistDatabase from './pages/dashboard/ArtistDatabase';
import FnBPlanning from './pages/dashboard/FnBPlanning';
import LogisticsPage from './pages/dashboard/LogisticsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import VenueCosts from './pages/admin/VenueCosts';
import TimelineBuilder from './pages/dashboard/TimelineBuilder';
import ContentManagement from './pages/admin/ContentManagement';


// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-saffron-50 to-cream-500">
        <div className="text-center animate-fade-in-up">
          <div className="diya-spinner mx-auto mb-6"></div>
          <p className="text-saffron-700 font-heading text-lg">Loading BudgetBandhan...</p>
          <p className="text-gray-400 text-sm mt-1">Preparing your wedding planner</p>
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

  // Fetch user's weddings on component mount
  useEffect(() => {
    fetchWeddings();
  }, []);

  const fetchWeddings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/weddings');
      setWeddings(response.data);
    } catch (error) {
      console.error('Failed to fetch weddings:', error);
      toast.error('Failed to load wedding plans');
    } finally {
      setLoading(false);
    }
  };

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
      <nav className="bg-saffron-500 text-white shadow-xl">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="font-heading text-2xl tracking-wide flex items-center gap-2">
              <span className="animate-float inline-block">🪔</span>
              <span className="text-gradient-saffron" style={{WebkitTextFillColor:'#fff', background:'none'}}>BudgetBandhan</span>
            </h1>
            <div className="flex items-center space-x-1">
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/dashboard/guests" className="nav-link">Guests</Link>
              <Link to="/dashboard/budget-wizard" className="nav-link">Budget Wizard</Link>
              <Link to="/dashboard/decor" className="nav-link">Decor</Link>
              <Link to="/dashboard/artists" className="nav-link">Artists</Link>
              <Link to="/dashboard/fnb" className="nav-link">F&B</Link>
              {getLatestWeddingId() && (
                <Link to={`/dashboard/logistics/${getLatestWeddingId()}`} className="nav-link">Logistics</Link>
              )}
              <span className="text-white/80 text-sm px-2">Hi, {user?.name?.split(' ')[0]}!</span>
              <button
                onClick={logout}
                className="ml-2 bg-white/15 hover:bg-white/25 text-white text-sm px-3 py-1.5 rounded-lg border border-white/30 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className="card mb-8 animate-fade-in-up">
          <h2 className="font-heading text-2xl mb-0.5">
            <span className="text-gold-foil">Welcome to Your Dashboard</span>
          </h2>
          <p className="text-gray-400 mb-5 text-sm">Your dream Indian wedding, beautifully planned</p>
          <div className="kantha-line mb-5 opacity-60"></div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bandhani-bg rounded-2xl p-4 text-center border border-saffron-100 hover:shadow-md transition-all saree-border-left">
              <span className="text-2xl block mb-1">🎯</span>
              <span className="bandhani-badge text-xs mb-2">PLANS</span>
              <p className="text-3xl font-bold text-saffron-600 mt-1">{weddings.length}</p>
            </div>
            <div className="bandhani-bg rounded-2xl p-4 text-center border border-emerald-100 hover:shadow-md transition-all" style={{borderLeft:'4px solid #046A38'}}>
              <span className="text-2xl block mb-1">💰</span>
              <span className="bandhani-badge bandhani-badge-emerald text-xs mb-2">BUDGET</span>
              <p className="text-lg font-bold text-emerald-600 mt-1">
                {weddings.length > 0
                  ? formatCurrency(weddings.reduce((acc, w) => acc + (w.budgetRanges?.medium || 0), 0) / weddings.length)
                  : '₹0'}
              </p>
            </div>
            <div className="bandhani-bg rounded-2xl p-4 text-center border border-turmeric-100 hover:shadow-md transition-all" style={{borderLeft:'4px solid #FFD700'}}>
              <span className="text-2xl block mb-1">👥</span>
              <span className="bandhani-badge text-xs mb-2" style={{background:'linear-gradient(135deg,#FFD700,#FF9933)',color:'#663D14'}}>GUESTS</span>
              <p className="text-3xl font-bold text-turmeric-600 mt-1">
                {weddings.reduce((acc, w) => acc + (w.guestCount || 0), 0)}
              </p>
            </div>
            <div className="bandhani-bg rounded-2xl p-4 text-center border border-red-100 hover:shadow-md transition-all" style={{borderLeft:'4px solid #E44C4C'}}>
              <span className="text-2xl block mb-1">🏨</span>
              <span className="bandhani-badge text-xs mb-2" style={{background:'linear-gradient(135deg,#E44C4C,#B83B3B)',color:'#fff'}}>ACTIVE</span>
              <p className="text-3xl font-bold text-indian-red-600 mt-1">
                {weddings.filter(w => w.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-4 mb-5">
          <h3 className="font-heading text-xl text-saffron-700 whitespace-nowrap">Quick Actions</h3>
          <div className="kantha-line flex-1"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          {/* Budget Wizard Card */}
          <Link to="/dashboard/budget-wizard" className="block group animate-fade-in-up" style={{animationDelay:'0.05s'}}>
            <div className="card p-5 hover:border-saffron-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center">
              <div className="jharokha-icon w-14 h-16 bg-gradient-to-b from-saffron-100 to-saffron-200 mx-auto mb-3 group-hover:from-saffron-400 group-hover:to-saffron-600 transition-all duration-300 shadow-sm">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-heading text-base text-saffron-600 mb-1">Budget Wizard</h3>
              <p className="text-xs text-gray-400">Create a new wedding budget plan</p>
              <div className="mt-3">
                <span className="bandhani-badge text-xs px-2 py-0.5">Start Now →</span>
              </div>
            </div>
          </Link>

          {/* Guest Manager Card */}
          <Link to="/dashboard/guests" className="block group animate-fade-in-up" style={{animationDelay:'0.10s'}}>
            <div className="card p-5 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center">
              <div className="jharokha-icon w-14 h-16 bg-gradient-to-b from-emerald-100 to-emerald-200 mx-auto mb-3 group-hover:from-emerald-400 group-hover:to-emerald-600 transition-all duration-300 shadow-sm">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="font-heading text-base text-emerald-600 mb-1">Guest Manager</h3>
              <p className="text-xs text-gray-400">Manage your guest list & RSVPs</p>
              <div className="mt-3">
                <span className="bandhani-badge bandhani-badge-emerald text-xs px-2 py-0.5">Manage →</span>
              </div>
            </div>
          </Link>

          {/* Decor Library Card */}
          <Link to="/dashboard/decor" className="block group animate-fade-in-up" style={{animationDelay:'0.15s'}}>
            <div className="card p-5 hover:border-purple-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center">
              <div className="jharokha-icon w-14 h-16 bg-gradient-to-b from-purple-100 to-purple-200 mx-auto mb-3 group-hover:from-purple-400 group-hover:to-purple-600 transition-all duration-300 shadow-sm">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="font-heading text-base text-purple-600 mb-1">Decor Library</h3>
              <p className="text-xs text-gray-400">Browse decor with cost insights</p>
              <div className="mt-3">
                <span className="bandhani-badge text-xs px-2 py-0.5" style={{background:'linear-gradient(135deg,#7e22ce,#a855f7)',color:'#fff'}}>Explore →</span>
              </div>
            </div>
          </Link>

          {/* Logistics Card */}
          {getLatestWeddingId() ? (
            <Link to={`/dashboard/logistics/${getLatestWeddingId()}`} className="block group animate-fade-in-up" style={{animationDelay:'0.20s'}}>
              <div className="card p-5 hover:border-blue-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center">
                <div className="jharokha-icon w-14 h-16 bg-gradient-to-b from-blue-100 to-blue-200 mx-auto mb-3 group-hover:from-blue-400 group-hover:to-blue-600 transition-all duration-300 shadow-sm">
                  <span className="text-2xl">🚚</span>
                </div>
                <h3 className="font-heading text-base text-blue-600 mb-1">Logistics</h3>
                <p className="text-xs text-gray-400">Transport, accommodation & staff</p>
                <div className="mt-3">
                  <span className="bandhani-badge text-xs px-2 py-0.5" style={{background:'linear-gradient(135deg,#1d4ed8,#3b82f6)',color:'#fff'}}>Plan Now →</span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="card p-5 opacity-40 cursor-not-allowed text-center">
              <div className="jharokha-icon w-14 h-16 bg-gradient-to-b from-gray-100 to-gray-200 mx-auto mb-3">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="font-heading text-base text-gray-500 mb-1">Logistics</h3>
              <p className="text-xs text-gray-400">Create a wedding plan first</p>
            </div>
          )}
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
      <nav className="bg-saffron-600 text-white shadow-2xl border-b border-saffron-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="font-heading text-2xl flex items-center gap-2">
              <div className="jharokha-icon w-8 h-10 bg-white/20 flex items-center justify-center !rounded-none">
                <span className="animate-diya-flame inline-block">🪔</span>
              </div>
              <span className="text-gold-foil !text-white tracking-widest">BudgetBandhan</span>
            </h1>
            <div className="flex items-center gap-6">
              <Link to="/login" className="nav-link text-sm font-bold uppercase tracking-widest hover:text-turmeric-300">Login</Link>
              <Link to="/register" className="btn-primary !px-6 !py-2 text-[10px] shadow-lg">JOIN THE BANDHAN</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
          <div className="jharokha-icon w-24 h-28 bg-gradient-to-b from-saffron-400 to-saffron-600 mx-auto mb-8 shadow-2xl flex items-center justify-center">
             <span className="text-6xl">💒</span>
          </div>
          <h2 className="font-decorative text-6xl text-saffron-600 mb-6 leading-tight">
             Create Your Perfect <br/>
             <span className="text-gold-foil">Wedding Bandhan</span>
          </h2>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto font-medium">
            The premium AI-powered planning companion for the modern Indian wedding. 
            Experience traditions reimagined.
          </p>
          <Link
            to="/register"
            className="btn-primary text-base px-12 py-4 shadow-2xl inline-block"
          >
            ✨ BEGIN YOUR JOURNEY
          </Link>
        </div>

        <div className="rangoli-divider !my-20"></div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center animate-fade-in-up group" style={{animationDelay:'0.1s'}}>
            <div className="jharokha-icon w-20 h-24 bg-gradient-to-br from-saffron-100 to-saffron-200 flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-4xl">💰</span>
            </div>
            <h3 className="font-heading text-2xl text-saffron-600 mb-3">AI Budgeting</h3>
            <p className="text-gray-500 text-sm leading-relaxed px-4">Local intelligence providing accurate price estimates for venues, food, and traditions.</p>
          </div>

          <div className="card text-center animate-fade-in-up group" style={{animationDelay:'0.2s'}}>
            <div className="jharokha-icon w-20 h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-4xl">🎨</span>
            </div>
            <h3 className="font-heading text-2xl text-emerald-600 mb-3">Decor Curations</h3>
            <p className="text-gray-500 text-sm leading-relaxed px-4">From Mandaps to Mehndi alcoves, browse themed decor with real-world budget insights.</p>
          </div>

          <div className="card text-center animate-fade-in-up group" style={{animationDelay:'0.3s'}}>
            <div className="jharokha-icon w-20 h-24 bg-gradient-to-br from-turmeric-100 to-turmeric-200 flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-4xl">👥</span>
            </div>
            <h3 className="font-heading text-2xl text-turmeric-600 mb-3">Guest Bliss</h3>
            <p className="text-gray-500 text-sm leading-relaxed px-4">Sophisticated RSVP management with automatic food cost integration for zero stress.</p>
          </div>
        </div>
      </main>

      <footer className="bg-saffron-800 text-white mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-2xl mb-2 animate-float">🪔</div>
          <p className="font-heading">© 2026 BudgetBandhan. All rights reserved.</p>
          <p className="text-sm mt-1 text-saffron-200">
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
      <Route path="/dashboard/artists" element={
        <ProtectedRoute>
          <ArtistDatabase />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/fnb" element={
        <ProtectedRoute>
          <FnBPlanning />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/logistics/:id" element={
        <ProtectedRoute>
          <LogisticsPage />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute>
          <UserManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/venue-costs" element={
        <ProtectedRoute>
          <VenueCosts />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/timeline/:id" element={
        <ProtectedRoute>
          <TimelineBuilder />
        </ProtectedRoute>
      } />
      <Route path="/admin/content" element={
        <ProtectedRoute>
          <ContentManagement />
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