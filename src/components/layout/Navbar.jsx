import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Upload, 
  BarChart2, 
  Video, 
  History, 
  BookOpen, 
  ShieldCheck, 
  Menu, 
  X, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Button from '../common/Button';
import Disclaimer from '../common/Disclaimer';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/upload', label: 'Upload Report', icon: Upload },
    { to: '/analysis/MR-001', label: 'Dashboard', icon: BarChart2 },
    { to: '/video/MR-001', label: 'Video Demo', icon: Video },
    { to: '/history', label: 'History', icon: History },
    { to: '/about', label: 'How It Works', icon: BookOpen },
    { to: '/privacy', label: 'Privacy & Safety', icon: ShieldCheck },
  ];

  const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top micro disclaimer banner */}
      <Disclaimer variant="banner" />

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
            aria-label="MedVision AI Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">MedVision</span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700 tracking-wide">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase -mt-0.5">
                Report & Video Analyzer
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'text-blue-700 bg-blue-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <Link to="/upload">
              <Button 
                variant="primary" 
                size="sm" 
                icon={Sparkles}
                className="shadow-sm shadow-blue-500/10"
              >
                Analyze My Report
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 shadow-xl">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={handleMobileNavClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`
                  }
                >
                  {Icon && <Icon className="w-4 h-4 text-slate-400" />}
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <Button
              variant="primary"
              className="w-full justify-center"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/upload');
              }}
            >
              Analyze My Report
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
