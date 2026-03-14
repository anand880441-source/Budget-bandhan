import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

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

// Temporary Dashboard Component (we'll build this later)
const Dashboard = () => {
  const { user, logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-cream-500">
      <nav className="bg-saffron-500 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="font-heading text-2xl">BudgetBandhan</h1>
            <div className="flex items-center space-x-4">
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
        <div className="card">
          <h2 className="font-heading text-2xl text-saffron-600 mb-4">Dashboard</h2>
          <p className="text-gray-600 mb-4">
            Welcome to BudgetBandhan! Your wedding planning journey begins here.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-saffron-50 p-4 rounded-lg">
              <h3 className="font-heading text-lg text-saffron-600 mb-2">Budget Wizard</h3>
              <p className="text-sm text-gray-600">Start planning your wedding budget</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg">
              <h3 className="font-heading text-lg text-emerald-600 mb-2">Guest List</h3>
              <p className="text-sm text-gray-600">Manage your guests and RSVPs</p>
            </div>
            <div className="bg-turmeric-50 p-4 rounded-lg">
              <h3 className="font-heading text-lg text-turmeric-600 mb-2">Decor Library</h3>
              <p className="text-sm text-gray-600">Explore Indian wedding decor</p>
            </div>
          </div>
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
              <a href="/login" className="hover:text-saffron-200 transition">Login</a>
              <a href="/register" className="bg-white text-saffron-500 px-4 py-2 rounded-lg hover:bg-saffron-100 transition">Register</a>
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
          <a 
            href="/register" 
            className="btn-primary text-lg px-8 py-3 inline-block"
          >
            Start Planning
          </a>
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