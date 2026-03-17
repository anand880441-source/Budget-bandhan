import api from './api';

export const logisticsService = {
  // Get logistics for a wedding
  async getLogistics(weddingId) {
    try {
      const response = await api.get(`/logistics/${weddingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update logistics
  async updateLogistics(weddingId, data) {
    try {
      const response = await api.post(`/logistics/${weddingId}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Calculate transport cost
  async calculateTransport(data) {
    try {
      const response = await api.post('/logistics/calculate/transport', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Calculate baraat cost
  async calculateBaraat(data) {
    try {
      const response = await api.post('/logistics/calculate/baraat', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Calculate accommodation cost
  async calculateAccommodation(data) {
    try {
      const response = await api.post('/logistics/calculate/accommodation', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};