import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home, Upload, History } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
        <FileQuestion className="w-10 h-10" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 uppercase">
          Error 404
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          The requested page or medical report route does not exist. Please return to the homepage or explore available analyses.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link to="/">
          <Button variant="primary" size="md" icon={Home}>
            Back to Home
          </Button>
        </Link>
        <Link to="/upload">
          <Button variant="outline" size="md" icon={Upload}>
            Upload Report
          </Button>
        </Link>
        <Link to="/history">
          <Button variant="ghost" size="md" icon={History}>
            View History
          </Button>
        </Link>
      </div>
    </div>
  );
}
