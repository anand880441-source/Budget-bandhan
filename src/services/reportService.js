import api from './api';

export const reportService = {
  // Download PDF Report
  async downloadPDF(weddingId) {
    try {
      const response = await api.get(`/reports/pdf/${weddingId}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `wedding-budget-${weddingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Download Excel Report
  async downloadExcel(weddingId) {
    try {
      const response = await api.get(`/reports/excel/${weddingId}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `wedding-budget-${weddingId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};