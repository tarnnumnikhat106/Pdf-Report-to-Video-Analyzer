import axios from 'axios';
import { MOCK_REPORTS, MOCK_HISTORY } from './mockData';

// API Base URL from environment variables, never hardcoded secrets
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
  },
});

// Dynamic session storage cache for simulated uploads during session
let runtimeReports = [...MOCK_REPORTS];
let runtimeHistory = [...MOCK_HISTORY];

/**
 * Upload a medical report document (PDF, JPG, JPEG, PNG) using FormData
 * @param {File} file 
 * @param {Function} onProgress 
 * @returns {Promise<{ reportId: string, status: string, message: string }>}
 */
export async function uploadReport(file, onProgress = () => {}) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('uploaded_at', new Date().toISOString());

  try {
    const response = await apiClient.post('/reports/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
    return response.data;
  } catch (err) {
    console.warn('[MedVision API] Real backend endpoint unavailable. Operating in high-fidelity mock mode.', err.message);
    
    // Simulate realistic upload progress in mock mode
    for (let p = 15; p <= 100; p += 25) {
      await new Promise(r => setTimeout(r, 90));
      onProgress(p);
    }

    // Generate a new mock report based on uploaded file name
    const newReportId = `MR-${String(runtimeReports.length + 1).padStart(3, '0')}`;
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    // Determine template based on file name or default to CBC
    let baseTemplate = MOCK_REPORTS[0];
    if (file.name.toLowerCase().includes('lipid') || file.name.toLowerCase().includes('cholesterol')) {
      baseTemplate = MOCK_REPORTS[1];
    } else if (file.name.toLowerCase().includes('metabolic') || file.name.toLowerCase().includes('glucose') || file.name.toLowerCase().includes('cmp')) {
      baseTemplate = MOCK_REPORTS[2];
    }

    const createdReport = {
      ...baseTemplate,
      reportId: newReportId,
      reportName: file.name,
      date: new Date().toISOString().split('T')[0],
      isUserUploaded: true,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      fileType: fileExtension.toUpperCase(),
    };

    runtimeReports.unshift(createdReport);
    runtimeHistory.unshift({
      reportId: newReportId,
      reportName: file.name,
      date: createdReport.date,
      laboratory: createdReport.laboratory,
      reportType: createdReport.reportType,
      findingsCount: createdReport.findings.length,
      attentionCount: createdReport.attentionCount,
      status: createdReport.attentionCount > 2 ? 'ATTENTION' : 'NORMAL',
      hasVideo: false,
    });

    return {
      success: true,
      reportId: newReportId,
      reportName: file.name,
      message: 'Report uploaded and scheduled for AI analysis.',
      mode: 'mock_fallback'
    };
  }
}

/**
 * Trigger or check AI pipeline analysis for a specific report
 * @param {string} reportId 
 * @returns {Promise<object>}
 */
export async function analyzeReport(reportId) {
  try {
    const response = await apiClient.post(`/reports/${reportId}/analyze`);
    return response.data;
  } catch (err) {
    console.info(`[MedVision API] Mock analyzing report: ${reportId}`);
    // Simulate small computational delay
    await new Promise(r => setTimeout(r, 600));
    const found = runtimeReports.find(r => r.reportId === reportId) || runtimeReports[0];
    return found;
  }
}

/**
 * Fetch a single detailed report analysis by ID
 * @param {string} reportId 
 * @returns {Promise<object>}
 */
export async function getReport(reportId) {
  try {
    const response = await apiClient.get(`/reports/${reportId}`);
    return response.data;
  } catch (err) {
    console.info(`[MedVision API] Mock fetching report ${reportId}`);
    const found = runtimeReports.find(r => r.reportId === reportId);
    if (!found) {
      // Fallback to first report if ID not found
      return runtimeReports[0];
    }
    return found;
  }
}

/**
 * Fetch list of all historical analyzed reports
 * @returns {Promise<Array>}
 */
export async function getReports() {
  try {
    const response = await apiClient.get('/reports');
    return response.data;
  } catch (err) {
    console.info('[MedVision API] Mock fetching report history');
    return runtimeHistory;
  }
}

/**
 * Request AI educational video generation for a report
 * @param {string} reportId 
 * @param {object} options 
 * @returns {Promise<object>}
 */
export async function generateVideo(reportId, options = { language: 'English', detailLevel: 'standard' }) {
  try {
    const response = await apiClient.post(`/reports/${reportId}/video`, options);
    return response.data;
  } catch (err) {
    console.info(`[MedVision API] Mock triggering video generation for report: ${reportId}`);
    const report = runtimeReports.find(r => r.reportId === reportId) || runtimeReports[0];
    
    // Update runtime history to show video exists
    const histItem = runtimeHistory.find(h => h.reportId === reportId);
    if (histItem) {
      histItem.hasVideo = true;
    }

    return {
      status: 'completed',
      reportId: reportId,
      video: report.videoData || MOCK_REPORTS[0].videoData
    };
  }
}

/**
 * Poll or check video generation status
 * @param {string} reportId 
 * @returns {Promise<object>}
 */
export async function getVideoStatus(reportId) {
  try {
    const response = await apiClient.get(`/reports/${reportId}/video/status`);
    return response.data;
  } catch (err) {
    const report = runtimeReports.find(r => r.reportId === reportId) || runtimeReports[0];
    return {
      status: 'completed',
      progress: 100,
      video_url: report.videoData?.videoUrl,
      duration: report.videoData?.duration,
      title: report.videoData?.title,
    };
  }
}

export default {
  uploadReport,
  analyzeReport,
  getReport,
  getReports,
  generateVideo,
  getVideoStatus,
};
