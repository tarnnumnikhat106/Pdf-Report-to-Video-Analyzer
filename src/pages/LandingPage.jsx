import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  UploadCloud,
  FileSearch,
  BookOpen,
  Video,
  Minus,
  Play,
} from 'lucide-react';
import Button from '../components/common/Button';
import Reveal from '../components/common/Reveal';

const steps = [
  {
    n: '01',
    title: 'Upload the report',
    body: 'A digital PDF or a clear photo. JPG and PNG are fine.',
    icon: UploadCloud,
  },
  {
    n: '02',
    title: 'Values are read',
    body: 'Each test, result, unit, and reference range is pulled from the document.',
    icon: FileSearch,
  },
  {
    n: '03',
    title: 'Findings are explained',
    body: 'Out-of-range values get a plain-language note and the context behind them.',
    icon: BookOpen,
  },
  {
    n: '04',
    title: 'A video is optional',
    body: 'Turn the same report into a short, chaptered walkthrough you can replay.',
    icon: Video,
  },
];

const does = [
  {
    title: 'Reads the numbers',
    body: 'Test names, measured values, units, and the reference range printed beside them.',
  },
  {
    title: 'Flags what is outside the range',
    body: 'Anything below or above the printed interval is marked for review, not called a diagnosis.',
  },
  {
    title: 'Explains in everyday terms',
    body: 'What the test measures, why it matters, and how it fits with the rest of the panel.',
  },
  {
    title: 'Gives you questions to ask',
    body: 'Short prompts you can bring to an appointment, based on the findings in front of you.',
  },
];

const doesNot = [
  'Diagnose a condition or name a disease.',
  'Recommend, start, or stop medication.',
  'Replace your clinician’s reading of the report.',
  'Replace an in-person appointment or emergency care.',
];

export default function LandingPage() {
  return (
    <div className="pb-20">
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(15,90,74,0.09),transparent_58%)]"
        />
        <div className="relative mx-auto grid max-w-6xl gap-14 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-8">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                <span aria-hidden="true" className="h-px w-8 bg-accent" />
                Lab report explainer
              </p>
            </Reveal>

            <Reveal delay={70}>
              <h1 className="mt-6 font-display text-[2.7rem] leading-[1.03] tracking-tight text-ink sm:text-6xl lg:text-[4.2rem]">
                Your lab results,
                <br className="hidden sm:block" /> in plain language.
              </h1>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
                Upload a blood test. MedVision reads the measured values, flags
                anything outside the printed reference range, and explains what each
                result means — so you can ask better questions at your next
                appointment.
              </p>
            </Reveal>

            <Reveal delay={210}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link to="/upload" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    icon={ArrowRight}
                    iconPosition="right"
                    className="w-full sm:w-auto"
                  >
                    Upload a report
                  </Button>
                </Link>
                <Link to="/analysis/MR-001" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    View a sample report
                  </Button>
                </Link>
              </div>
            </Reveal>

            <Reveal delay={280}>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                  Educational use, not a diagnosis
                </span>
                <span>PDF, JPG, or PNG</span>
                <span>No account required</span>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={180}>
              <ReportPreview />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <h2 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
                What it does
              </h2>
            </Reveal>
            <Reveal delay={60}>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
                Four things, done carefully and within clear limits.
              </p>
            </Reveal>
          </div>

          <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:col-span-8">
            {does.map((item, index) => (
              <Reveal key={item.title} delay={index * 70}>
                <div className="border-t border-line pt-4">
                  <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-10 border-t border-line pt-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <h2 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
                What it doesn’t do
              </h2>
            </Reveal>
            <Reveal delay={60}>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
                The boundary matters more than the feature list.
              </p>
            </Reveal>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {doesNot.map((item, index) => (
              <Reveal key={item} delay={index * 60}>
                <div className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-soft">
                  <Minus className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" />
                  <span>{item}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper-deep/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <Reveal>
            <div className="max-w-xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                How it works
              </p>
              <h2 className="mt-4 font-display text-3xl tracking-tight text-ink sm:text-4xl">
                From a PDF to a conversation.
              </h2>
            </div>
          </Reveal>

          <ol className="mt-10 grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.n} delay={index * 80}>
                  <li className="border-t border-line py-5 sm:pr-6">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] text-muted">{step.n}</span>
                      <Icon className="h-4 w-4 text-accent" />
                    </div>
                    <h3 className="mt-4 font-display text-xl tracking-tight text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {step.body}
                    </p>
                  </li>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <div className="grid gap-8 rounded-lg border border-line bg-surface p-6 sm:p-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                If you want a walkthrough
              </p>
              <h2 className="mt-3 font-display text-3xl tracking-tight text-ink">
                The same report, as a short video.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                Each chapter follows the report: the finding, what the test measures,
                and a question you can take to your clinician. Captions stay on by
                default.
              </p>
              <div className="mt-6">
                <Link to="/video/MR-001">
                  <Button variant="outline" icon={ArrowRight} iconPosition="right">
                    Watch the sample
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-md border border-line bg-ink p-5 text-paper">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-paper/45">
                  <span>Sample walkthrough</span>
                  <span className="font-mono">2:45</span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-paper/25">
                    <Play className="ml-0.5 h-4 w-4 fill-paper/90 text-paper/90" />
                  </span>
                  <div>
                    <p className="font-display text-lg leading-tight">
                      Hemoglobin, explained
                    </p>
                    <p className="text-xs text-paper/50">Chapter 2 of 4</p>
                  </div>
                </div>

                <div className="mt-5 space-y-2 text-xs text-paper/55">
                  <div className="flex justify-between border-b border-paper/10 pb-2">
                    <span>Introduction</span>
                    <span className="font-mono">0:00</span>
                  </div>
                  <div className="flex justify-between border-b border-paper/10 pb-2 text-paper/85">
                    <span>What hemoglobin does</span>
                    <span className="font-mono">0:35</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Questions to ask</span>
                    <span className="font-mono">2:10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="rounded-lg bg-accent px-6 py-12 text-center text-surface sm:px-12">
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
              Start with a sample.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-surface/75">
              Open a completed example, or upload your own report. No account needed.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/upload">
                <Button variant="contrast" size="lg" className="w-full sm:w-auto">
                  Upload a report
                </Button>
              </Link>
              <Link to="/analysis/MR-001">
                <Button variant="inverse" size="lg" className="w-full sm:w-auto">
                  View the sample
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function ReportPreview() {
  return (
    <div className="relative mx-auto max-w-md">
      <div
        aria-hidden="true"
        className="absolute -inset-x-3 -bottom-3 top-3 rounded-md border border-line bg-paper-deep/70"
      />

      <div className="relative rounded-md border border-line bg-surface p-5 shadow-[0_28px_70px_-50px_rgba(28,27,24,0.6)]">
        <div className="flex items-start justify-between border-b border-line pb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted">
              Complete blood count
            </p>
            <p className="mt-1 font-display text-lg tracking-tight text-ink">
              Sample report
            </p>
          </div>
          <span className="font-mono text-[11px] text-muted">MR-001</span>
        </div>

        <div className="mt-4 space-y-4">
          <PreviewRow
            name="Hemoglobin"
            value="9.2"
            unit="g/dL"
            range="12.0–15.5"
            position={34}
            status="low"
            note="Below the printed range. Hemoglobin carries oxygen through the blood."
          />
          <PreviewRow
            name="White blood cells"
            value="6.8"
            unit="×10³/µL"
            range="4.0–11.0"
            position={62}
            status="normal"
            note="Inside the reference range. Part of the immune response."
          />
          <PreviewRow
            name="Platelets"
            value="248"
            unit="×10³/µL"
            range="150–400"
            position={54}
            status="normal"
          />
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-line pt-3 text-[11px] text-muted">
          <span>2 of 3 values in range</span>
          <Link
            to="/analysis/MR-001"
            className="inline-flex items-center gap-1 font-medium text-accent transition-colors hover:text-accent-deep"
          >
            Open this report
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function PreviewRow({ name, value, unit, range, position, status, note }) {
  const isLow = status === 'low';

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="flex items-center gap-2 text-[13px] font-medium text-ink">
          {name}
          {isLow && (
            <span className="rounded-sm bg-attention-soft px-1.5 py-0.5 text-[10px] font-medium text-attention">
              Low
            </span>
          )}
        </span>
        <span className="font-mono text-[13px] text-ink">
          <span className="text-base">{value}</span>{' '}
          <span className="text-muted">{unit}</span>
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-line-soft">
          <div className="absolute inset-y-0 left-[30%] right-[30%] bg-accent/15" />
          <div
            className={`absolute top-1/2 h-2.5 w-1 -translate-y-1/2 rounded-full ${
              isLow ? 'bg-attention' : 'bg-accent'
            }`}
            style={{ left: `${position}%` }}
          />
        </div>
        <span className="font-mono text-[10px] text-muted">{range}</span>
      </div>

      {note && <p className="mt-1.5 text-[11px] leading-relaxed text-muted">{note}</p>}
    </div>
  );
}
