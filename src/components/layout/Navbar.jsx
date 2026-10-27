import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Upload } from 'lucide-react';
import Button from '../common/Button';
import Disclaimer from '../common/Disclaimer';

const navLinks = [
  { to: '/upload', label: 'Upload' },
  { to: '/analysis/MR-001', label: 'Sample report' },
  { to: '/ml-diagnostic', label: 'Diagnostic lab' },
  { to: '/video/MR-001', label: 'Video' },
  { to: '/history', label: 'History' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-md">
      <Disclaimer variant="banner" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="group flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            aria-label="MedVision home"
          >
            <span className="grid h-8 w-8 place-items-center rounded-md bg-accent font-display text-lg leading-none text-surface transition-colors group-hover:bg-accent-deep">
              m
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-[19px] tracking-tight text-ink">
                MedVision
              </span>
              <span className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted">
                Lab report reader
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `group relative py-2 text-[13px] font-medium transition-colors ${
                    isActive ? 'text-ink' : 'text-muted hover:text-ink'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.label}</span>
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 -bottom-px h-px origin-left bg-accent transition-transform duration-300 ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden sm:flex lg:flex">
            <Link to="/upload">
              <Button variant="primary" size="sm" icon={Upload}>
                Upload report
              </Button>
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="p-2 text-ink-soft transition-colors hover:text-ink lg:hidden"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="animate-in fade-in slide-in-from-top-1 border-t border-line/80 bg-surface px-4 pb-6 pt-2 duration-200 lg:hidden">
          <nav className="divide-y divide-line-soft" aria-label="Mobile">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `block py-3 font-display text-xl tracking-tight transition-colors ${
                    isActive ? 'text-accent' : 'text-ink hover:text-accent'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="pt-5">
            <Link to="/upload" onClick={closeMobileMenu}>
              <Button variant="primary" className="w-full justify-center" icon={Upload}>
                Upload report
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
