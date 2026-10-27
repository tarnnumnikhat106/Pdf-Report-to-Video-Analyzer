import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  History,
  Search,
  Calendar,
  FileText,
  Video,
  BarChart2,
  ArrowUpDown,
  PlusCircle,
  Building2
} from 'lucide-react';
import Card from '../components/common/Card';
import SeverityBadge from '../components/common/SeverityBadge';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import LoadingState from '../components/common/LoadingState';
import Disclaimer from '../components/common/Disclaimer';
import { getReports } from '../services/api';
import { formatReportName } from '../utils/format';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'attention' | 'normal'
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc' | 'date-asc' | 'findings-desc'

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getReports()
      .then((data) => {
        if (isMounted) {
          setReports(data || []);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter & Sort
  const query = searchQuery.toLowerCase().trim();

  const filteredReports = reports.filter((item) => {
    const matchesSearch = 
      formatReportName(item.reportName, '').toLowerCase().includes(query) ||
      (item.reportType && item.reportType.toLowerCase().includes(query)) ||
      (item.laboratory && item.laboratory.toLowerCase().includes(query));

    const matchesStatus = 
      statusFilter === 'all'
        ? true
        : statusFilter === 'attention'
        ? (item.status === 'ATTENTION' || item.status === 'IMPORTANT')
        : item.status === 'NORMAL';

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'date-desc') {
      return new Date(b.date) - new Date(a.date);
    }
    if (sortBy === 'date-asc') {
      return new Date(a.date) - new Date(b.date);
    }
    if (sortBy === 'findings-desc') {
      return (b.findingsCount || 0) - (a.findingsCount || 0);
    }
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
            <History className="h-3.5 w-3.5" />
            Your reports
          </p>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-ink sm:text-4xl">
            Report history
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Revisit earlier readings, compare panels, and replay the video walkthroughs.
          </p>
        </div>

        <Link to="/upload">
          <Button variant="primary" size="md" icon={PlusCircle}>
            Upload new report
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <Card padding="p-4 sm:p-5" className="border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports by filename or panel type..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('attention')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  statusFilter === 'attention'
                    ? 'bg-amber-100 text-amber-900 shadow-xs'
                    : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                Attention
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('normal')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  statusFilter === 'normal'
                    ? 'bg-emerald-100 text-emerald-900 shadow-xs'
                    : 'text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                Normal
              </button>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 text-xs">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date-desc">Newest first</option>
                <option value="date-asc">Oldest first</option>
                <option value="findings-desc">Most findings</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Reports List / Cards */}
      {isLoading ? (
        <LoadingState title="Loading report history..." />
      ) : filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredReports.map((item) => (
            <Card
              key={item.reportId}
              padding="p-5 sm:p-6"
              className="border-slate-200 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Left Info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">
                        {formatReportName(item.reportName, item.reportType || 'Medical report')}
                      </h3>
                      <SeverityBadge status={item.status} size="sm" />
                      <span className="text-xs font-mono text-slate-400">
                        ({item.reportId})
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="font-semibold text-slate-700">
                        {item.reportType || "Standard Panel"}
                      </span>
                      <span>â€¢</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {item.date}
                      </span>
                      {item.laboratory && (
                        <>
                          <span>â€¢</span>
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" /> {item.laboratory}
                          </span>
                        </>
                      )}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-xs text-slate-600">
                      <span><strong>{item.findingsCount}</strong> findings evaluated</span>
                      <span>â€¢</span>
                      <span className={item.attentionCount > 0 ? 'text-amber-700 font-semibold' : 'text-emerald-700'}>
                        {item.attentionCount > 0 ? `${item.attentionCount} require doctor review` : 'All parameters standard'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <Link to={`/analysis/${item.reportId}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={BarChart2}
                    >
                      View analysis
                    </Button>
                  </Link>

                  <Link to={`/video/${item.reportId}`}>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Video}
                      className="shadow-xs"
                    >
                      View video
                    </Button>
                  </Link>
                </div>

              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No previous reports found"
          description="You don't have any medical reports matching the selected filters. Upload a document or reset search."
          actionText="Upload Report"
          onAction={() => navigate('/upload')}
        />
      )}

      {/* Safety Notice */}
      <Disclaimer variant="compact" />

    </div>
  );
}
