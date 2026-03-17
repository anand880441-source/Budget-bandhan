import ReportService from '../services/reportService.js';

// @desc    Generate PDF Report
// @route   GET /api/reports/pdf/:weddingId
// @access  Private
export const generatePDFReport = async (req, res) => {
  try {
    const doc = await ReportService.generatePDFReport(req.params.weddingId, req.user._id);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=wedding-budget-${req.params.weddingId}.pdf`);
    
    doc.pipe(res);
    doc.end();
  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ message: 'Failed to generate PDF report' });
  }
};

// @desc    Generate Excel Report
// @route   GET /api/reports/excel/:weddingId
// @access  Private
export const generateExcelReport = async (req, res) => {
  try {
    const workbook = await ReportService.generateExcelReport(req.params.weddingId, req.user._id);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=wedding-budget-${req.params.weddingId}.xlsx`);
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Excel Generation Error:', error);
    res.status(500).json({ message: 'Failed to generate Excel report' });
  }
};