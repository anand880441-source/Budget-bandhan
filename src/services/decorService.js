import api from './api';

export const decorService = {
  // Get all decor items with filters
  async getDecorItems(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 12,
        ...(params.category && params.category !== 'all' && { category: params.category }),
        ...(params.function && params.function !== 'all' && { function: params.function }),
        ...(params.style && params.style !== 'all' && { style: params.style }),
        ...(params.minPrice && { minPrice: params.minPrice }),
        ...(params.maxPrice && { maxPrice: params.maxPrice }),
        ...(params.search && { search: params.search }),
        ...(params.featured && { featured: true })
      }).toString();

      const response = await api.get(`/decor?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single decor item
  async getDecorById(id) {
    try {
      const response = await api.get(`/decor/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get featured decor
  async getFeaturedDecor() {
    try {
      const response = await api.get('/decor/featured');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create decor (Admin)
  async createDecor(decorData) {
    try {
      const response = await api.post('/decor', decorData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update decor (Admin)
  async updateDecor(id, decorData) {
    try {
      const response = await api.put(`/decor/${id}`, decorData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete decor (Admin)
  async deleteDecor(id) {
    try {
      const response = await api.delete(`/decor/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Upload decor images (Admin)
  async uploadImages(files) {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await api.post('/decor/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};