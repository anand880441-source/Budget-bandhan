import React from 'react';
import { FNB_CATEGORIES, MEAL_TYPES, CUISINE_TYPES, DIETARY_OPTIONS } from '../../utils/constants/fnbConstants';

const FnBFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <input
          type="text"
          placeholder="Search packages..."
          value={filters.search || ''}
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="input-field text-sm"
        />
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <div className="space-y-1">
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value="all"
              checked={filters.category === 'all' || !filters.category}
              onChange={() => onFilterChange('category', 'all')}
              className="mr-2"
            />
            <span className="text-sm">All Categories</span>
          </label>
          {FNB_CATEGORIES.map(cat => (
            <label key={cat.id} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={cat.id}
                checked={filters.category === cat.id}
                onChange={() => onFilterChange('category', cat.id)}
                className="mr-2"
              />
              <span className="text-sm">{cat.icon} {cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Meal Type Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meal Type
        </label>
        <select
          value={filters.mealType || 'all'}
          onChange={(e) => onFilterChange('mealType', e.target.value)}
          className="input-field text-sm"
        >
          <option value="all">All Meal Types</option>
          {MEAL_TYPES.map(type => (
            <option key={type.id} value={type.id}>
              {type.icon} {type.name}
            </option>
          ))}
        </select>
      </div>

      {/* Cuisine Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cuisine
        </label>
        <select
          value={filters.cuisine || 'all'}
          onChange={(e) => onFilterChange('cuisine', e.target.value)}
          className="input-field text-sm"
        >
          <option value="all">All Cuisines</option>
          {CUISINE_TYPES.map(cuisine => (
            <option key={cuisine} value={cuisine}>{cuisine}</option>
          ))}
        </select>
      </div>

      {/* Dietary Preference */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dietary Preference
        </label>
        <div className="space-y-1">
          {DIETARY_OPTIONS.map(option => (
            <label key={option.id} className="flex items-center">
              <input
                type="radio"
                name="dietary"
                value={option.id}
                checked={filters.dietary === option.id}
                onChange={() => onFilterChange('dietary', option.id)}
                className="mr-2"
              />
              <span className="text-sm">{option.icon} {option.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Budget Per Person
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min ₹"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange('minPrice', e.target.value)}
            className="input-field text-sm w-1/2"
          />
          <input
            type="number"
            placeholder="Max ₹"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            className="input-field text-sm w-1/2"
          />
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          onFilterChange('category', 'all');
          onFilterChange('mealType', 'all');
          onFilterChange('cuisine', 'all');
          onFilterChange('dietary', 'all');
          onFilterChange('minPrice', '');
          onFilterChange('maxPrice', '');
          onFilterChange('search', '');
        }}
        className="w-full text-sm text-saffron-600 hover:text-saffron-700 mt-2"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default FnBFilters;