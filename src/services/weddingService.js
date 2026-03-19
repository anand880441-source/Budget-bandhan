import api from './api';

export const weddingService = {
  // Get all weddings
  async getWeddings() {
    try {
      const response = await api.get('/weddings');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single wedding
  async getWeddingById(id) {
    try {
      const response = await api.get(`/weddings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create wedding
  async createWedding(weddingData) {
    try {
      const response = await api.post('/weddings', weddingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update wedding
  async updateWedding(id, weddingData) {
    try {
      const response = await api.put(`/weddings/${id}`, weddingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete wedding
  async deleteWedding(id) {
    try {
      const response = await api.delete(`/weddings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Calculate budget
  async calculateBudget(params) {
    try {
      const response = await api.post('/calculate', params);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};