import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, HeartPulse, FileText, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">MedVision AI</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Intelligent Medical Report Analysis & Video Explanation System. Empowering patients with transparent, simplified health insights and educational multimedia summaries.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 p-3 rounded-lg border border-slate-800 max-w-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Designed with strict patient privacy guardrails and educational decision-support principles.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-100 uppercase tracking-wider">
              Application
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home / Overview
                </Link>
              </li>
              <li>
                <Link to="/upload" className="text-slate-400 hover:text-white transition-colors">
                  Upload Report
                </Link>
              </li>
              <li>
                <Link to="/analysis/MR-001" className="text-slate-400 hover:text-white transition-colors">
                  Sample Dashboard (CBC)
                </Link>
              </li>
              <li>
                <Link to="/video/MR-001" className="text-slate-400 hover:text-white transition-colors">
                  AI Video Explanation
                </Link>
              </li>
              <li>
                <Link to="/history" className="text-slate-400 hover:text-white transition-colors">
                  Previous Reports History
                </Link>
              </li>
            </ul>
          </div>

          {/* Science & Safety */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-100 uppercase tracking-wider">
              Methodology & Safety
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors">
                  How the AI Pipeline Works
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors">
                  Privacy & Safety Guidelines
                </Link>
              </li>
              <li>
                <span className="text-slate-500 text-xs flex items-center gap-1">
                  Python Backend Ready <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Medical Disclaimer Callout */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-400 space-y-3">
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 leading-relaxed">
            <p className="font-semibold text-slate-200 mb-1">
              EDUCATIONAL & DECISION SUPPORT DISCLAIMER:
            </p>
            <p>
              MedVision AI is an educational technology demonstration. It does <strong>not</strong> make clinical diagnoses, decide whether medication will cure an ailment, evaluate whether surgery is required, or prescribe pharmaceutical treatments. All laboratory findings and visual summaries are meant solely to facilitate informed discussions between you and your qualified healthcare professional.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 pt-2">
            <p>© {new Date().getFullYear()} MedVision AI System. Built for patient literacy and clinical collaboration.</p>
            <p className="text-[11px]">
              Engineered with React, Vite, Tailwind CSS & Python FastAPI Architecture.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
