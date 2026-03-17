import api from './api';

export const timelineService = {
  // Get timeline for a wedding
  async getTimeline(weddingId) {
    try {
      const response = await api.get(`/timeline/${weddingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update entire timeline
  async updateTimeline(weddingId, data) {
    try {
      const response = await api.put(`/timeline/${weddingId}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add new timeline item
  async addItem(weddingId, item) {
    try {
      const response = await api.post(`/timeline/${weddingId}/items`, item);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update specific timeline item
  async updateItem(weddingId, itemId, item) {
    try {
      const response = await api.put(`/timeline/${weddingId}/items/${itemId}`, item);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete timeline item
  async deleteItem(weddingId, itemId) {
    try {
      const response = await api.delete(`/timeline/${weddingId}/items/${itemId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update checklist item status
  async updateChecklist(weddingId, itemId, checklistIndex, completed) {
    try {
      const response = await api.patch(`/timeline/${weddingId}/items/${itemId}/checklist/${checklistIndex}`, { completed });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};