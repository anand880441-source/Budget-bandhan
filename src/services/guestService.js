import api from './api';

export const guestService = {
  // Get all guests with pagination and filters
  async getGuests(weddingId, params = {}) {
    try {
      const queryParams = new URLSearchParams({
        weddingId,
        page: params.page || 1,
        limit: params.limit || 10,
        ...(params.rsvpStatus && { rsvpStatus: params.rsvpStatus }),
        ...(params.category && { category: params.category }),
        ...(params.search && { search: params.search })
      }).toString();

      const response = await api.get(`/guests?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single guest
  async getGuestById(id) {
    try {
      const response = await api.get(`/guests/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create guest
  async createGuest(guestData) {
    try {
      const response = await api.post('/guests', guestData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update guest
  async updateGuest(id, guestData) {
    try {
      const response = await api.put(`/guests/${id}`, guestData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete guest
  async deleteGuest(id) {
    try {
      const response = await api.delete(`/guests/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Bulk import guests
  async bulkImport(weddingId, guests) {
    try {
      const response = await api.post('/guests/bulk', { weddingId, guests });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Bulk update RSVP
  async bulkUpdateRSVP(guestIds, rsvpStatus) {
    try {
      const response = await api.patch('/guests/bulk/rsvp', { guestIds, rsvpStatus });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get guest statistics
  async getGuestStats(weddingId) {
    try {
      const response = await api.get(`/guests/stats/${weddingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};