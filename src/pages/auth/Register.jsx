import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password
      });
      toast.success('Registration successful! 🎉 Welcome to BudgetBandhan!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cream-500 to-saffron-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-turmeric-200 rounded-full opacity-25 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-200 rounded-full opacity-25 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-saffron-100 rounded-full opacity-15 blur-2xl"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative animate-fade-in-up">
        {/* Header with Indian Motif */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="jharokha-icon w-20 h-24 bg-gradient-to-b from-emerald-400 to-emerald-600 shadow-xl mx-auto">
              <span className="text-4xl animate-float inline-block">🌸</span>
            </div>
          </div>
          <h2 className="font-heading text-3xl text-emerald-600 mt-2">
            Begin Your Journey with <span className="text-gold-foil">BudgetBandhan</span>
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Plan your dream wedding with peace of mind
          </p>
        </div>

        {/* Register Form */}
        <div className="card mt-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-emerald-500">👤</span>
                <input
                  id="name"
                  type="text"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
                  className="input-field pl-10"
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-indian-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-emerald-500">📧</span>
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
                <span className="absolute left-3 top-3 text-emerald-500">🔒</span>
                <input
                  id="password"
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className="input-field pl-10"
                  placeholder="Create a password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-indian-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-emerald-500">🔒</span>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  className="input-field pl-10"
                  placeholder="Confirm your password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-indian-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                {...register('terms', {
                  required: 'You must accept the terms and conditions'
                })}
                className="h-4 w-4 text-emerald-500 focus:ring-emerald-400 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I accept the{' '}
                <a href="#" className="text-emerald-600 hover:text-emerald-500">
                  Terms and Conditions
                </a>
              </label>
            </div>
            {errors.terms && (
              <p className="mt-1 text-sm text-indian-red-500">{errors.terms.message}</p>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-secondary relative"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          {/* Divider — Rangoli style */}
          <div className="mt-6">
            <div className="rangoli-divider"></div>
            {/* Login Link */}
            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-saffron-600 hover:text-saffron-500 font-medium"
              >
                <span className="mr-2">←</span>
                Sign in here
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

export default Register;