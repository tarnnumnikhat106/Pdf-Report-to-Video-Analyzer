import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

const productLinks = [
  { to: '/upload', label: 'Upload a report' },
  { to: '/analysis/MR-001', label: 'Sample report' },
  { to: '/video/MR-001', label: 'Sample video' },
  { to: '/ml-diagnostic', label: 'Diagnostic lab' },
  { to: '/history', label: 'History' },
];

const safetyLinks = [
  { to: '/about', label: 'How it works' },
  { to: '/privacy', label: 'Privacy and safety' },
  { to: '/ai-settings', label: 'AI provider settings' },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-paper-deep">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-md bg-accent font-display text-lg leading-none text-surface">
                m
              </span>
              <span className="font-display text-xl tracking-tight text-ink">
                MedVision
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
              A reader for lab reports. It explains measured values and reference
              ranges in plain language. It does not diagnose or treat.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2 text-xs text-muted">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              Built for education, not clinical decisions
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              Product
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {productLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-ink-soft transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              Safety
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {safetyLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-ink-soft transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Runs locally with a Python backend when available, and falls back to
              sample data when it is not.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-6">
          <div className="rounded-md border border-line bg-surface p-4 text-xs leading-relaxed text-muted">
            <span className="font-semibold text-ink-soft">Not medical advice.</span>{' '}
            MedVision is an educational demonstration. It does not diagnose conditions,
            recommend medication, or replace a clinician&apos;s interpretation of your
            results. Discuss any changes with a licensed healthcare professional.
          </div>

          <div className="mt-6 flex flex-col gap-2 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>© {CURRENT_YEAR} MedVision</p>
            <p>React · FastAPI · scikit-learn</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
