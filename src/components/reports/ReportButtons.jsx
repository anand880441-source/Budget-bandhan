import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { reportService } from '../../services/reportService';

const ReportButtons = ({ weddingId }) => {
  const [loading, setLoading] = useState({ pdf: false, excel: false });

  const handleDownloadPDF = async () => {
    try {
      setLoading({ ...loading, pdf: true });
      await reportService.downloadPDF(weddingId);
      toast.success('PDF report downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download PDF report');
    } finally {
      setLoading({ ...loading, pdf: false });
    }
  };

  const handleDownloadExcel = async () => {
    try {
      setLoading({ ...loading, excel: true });
      await reportService.downloadExcel(weddingId);
      toast.success('Excel report downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download Excel report');
    } finally {
      setLoading({ ...loading, excel: false });
    }
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleDownloadPDF}
        disabled={loading.pdf}
        className="btn-primary flex items-center gap-2"
      >
        {loading.pdf ? (
          <span className="animate-spin">⏳</span>
        ) : (
          <span>📄</span>
        )}
        PDF Report
      </button>
      <button
        onClick={handleDownloadExcel}
        disabled={loading.excel}
        className="btn-outline flex items-center gap-2"
      >
        {loading.excel ? (
          <span className="animate-spin">⏳</span>
        ) : (
          <span>📊</span>
        )}
        Excel Report
      </button>
    </div>
  );
};

export default ReportButtons;