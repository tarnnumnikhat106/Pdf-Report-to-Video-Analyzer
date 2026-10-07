import React from 'react';
import { BrowserRouter as Router, Routes, Route, ScrollRestoration } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import AnalysisLoadingPage from './pages/AnalysisLoadingPage';
import AnalysisDashboardPage from './pages/AnalysisDashboardPage';
import FindingDetailsPage from './pages/FindingDetailsPage';
import VideoExplanationPage from './pages/VideoExplanationPage';
import HistoryPage from './pages/HistoryPage';
import AboutPage from './pages/AboutPage';
import PrivacySafetyPage from './pages/PrivacySafetyPage';
import NotFoundPage from './pages/NotFoundPage';

function ScrollToTop() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  });
  return null;
}

export default function App() {
  return (
    <Router>
      <ToastProvider>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/analysis-loading/:reportId" element={<AnalysisLoadingPage />} />
              <Route path="/analysis/:reportId" element={<AnalysisDashboardPage />} />
              <Route path="/finding/:reportId/:findingId" element={<FindingDetailsPage />} />
              <Route path="/video/:reportId" element={<VideoExplanationPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacySafetyPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </Router>
  );
}
