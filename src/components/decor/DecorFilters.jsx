import React from 'react';
import { DECOR_CATEGORIES, DECOR_FUNCTIONS, DECOR_STYLES, PRICE_RANGES } from '../../utils/constants/decorConstants';

const DecorFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <input
          type="text"
          placeholder="Search decor..."
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
          {DECOR_CATEGORIES.map(cat => (
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

      {/* Function Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Function
        </label>
        <select
          value={filters.function || 'all'}
          onChange={(e) => onFilterChange('function', e.target.value)}
          className="input-field text-sm"
        >
          <option value="all">All Functions</option>
          {DECOR_FUNCTIONS.map(func => (
            <option key={func.id} value={func.id}>
              {func.icon} {func.name}
            </option>
          ))}
        </select>
      </div>

      {/* Style Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Style
        </label>
        <select
          value={filters.style || 'all'}
          onChange={(e) => onFilterChange('style', e.target.value)}
          className="input-field text-sm"
        >
          <option value="all">All Styles</option>
          {DECOR_STYLES.map(style => (
            <option key={style.id} value={style.id}>
              {style.icon} {style.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Budget Range
        </label>
        <div className="space-y-2">
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
          <div className="grid grid-cols-2 gap-1">
            {PRICE_RANGES.map(range => (
              <button
                key={range.id}
                onClick={() => {
                  onFilterChange('minPrice', range.min);
                  onFilterChange('maxPrice', range.max);
                }}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
              >
                {range.icon} {range.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          onFilterChange('category', 'all');
          onFilterChange('function', 'all');
          onFilterChange('style', 'all');
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

export default DecorFilters;