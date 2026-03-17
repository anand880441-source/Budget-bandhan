import api from './api';

export const artistService = {
  // Get all artists with filters
  async getArtists(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 12,
        ...(params.category && params.category !== 'all' && { category: params.category }),
        ...(params.city && params.city !== 'all' && { city: params.city }),
        ...(params.language && params.language !== 'all' && { language: params.language }),
        ...(params.minPrice && { minPrice: params.minPrice }),
        ...(params.maxPrice && { maxPrice: params.maxPrice }),
        ...(params.sort && { sort: params.sort }),
        ...(params.search && { search: params.search })
      }).toString();

      const response = await api.get(`/artists?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single artist
  async getArtistById(id) {
    try {
      const response = await api.get(`/artists/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get featured artists
  async getFeaturedArtists() {
    try {
      const response = await api.get('/artists/featured');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search artists
  async searchArtists(query) {
    try {
      const response = await api.get(`/artists/search?q=${query}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};