import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await login(data.email, data.password);
      toast.success('Login successful! 🎉');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-cream-500 to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-saffron-200 rounded-full opacity-25 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-200 rounded-full opacity-25 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-turmeric-100 rounded-full opacity-15 blur-2xl"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative animate-fade-in-up">
        {/* Header with Indian Motif */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="jharokha-icon w-20 h-24 bg-gradient-to-b from-saffron-400 to-saffron-600 shadow-xl mx-auto">
              <span className="text-4xl animate-diya-flame inline-block">🪔</span>
            </div>
          </div>
          <h2 className="font-heading text-3xl mt-2">
            Welcome Back to <span className="text-gold-foil">BudgetBandhan</span>
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Bandhan budget ka, sukoon dil ka
          </p>
        </div>

        {/* Login Form */}
        <div className="card mt-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-saffron-500">📧</span>
                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="input-field pl-10"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-indian-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-saffron-500">🔒</span>
                <input
                  id="password"
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  className="input-field pl-10"
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-indian-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-saffron-500 focus:ring-saffron-400 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="text-saffron-600 hover:text-saffron-500">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary relative"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          {/* Divider — Rangoli style */}
          <div className="mt-6">
            <div className="rangoli-divider"></div>
            {/* Register Link */}
            <div className="text-center">
              <Link
                to="/register"
                className="inline-flex items-center text-emerald-600 hover:text-emerald-500 font-medium"
              >
                Create your account
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer with Mehndi Pattern */}
        <div className="text-center text-xs text-gray-500 mt-4">
          <p>© 2026 BudgetBandhan. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;