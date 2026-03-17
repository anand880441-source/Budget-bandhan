import api from './api';

export const fnbService = {
  // Get all F&B packages
  async getFnBPackages(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 12,
        ...(params.category && params.category !== 'all' && { category: params.category }),
        ...(params.mealType && params.mealType !== 'all' && { mealType: params.mealType }),
        ...(params.cuisine && params.cuisine !== 'all' && { cuisine: params.cuisine }),
        ...(params.minPrice && { minPrice: params.minPrice }),
        ...(params.maxPrice && { maxPrice: params.maxPrice }),
        ...(params.search && { search: params.search }),
        ...(params.isVeg && { isVeg: params.isVeg })
      }).toString();

      const response = await api.get(`/fnb?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single F&B package
  async getFnBPackageById(id) {
    try {
      const response = await api.get(`/fnb/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Calculate F&B cost
  async calculateFnBCost(data) {
    try {
      const response = await api.post('/fnb/calculate', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};