'use client'

import { Activity, ArrowRight, CheckCircle, Layers, Shield } from 'lucide-react'

interface StepWelcomeProps {
  onNext: () => void
  onSkip: () => void
}

const features = [
  {
    icon: Shield,
    title: 'Your data stays here',
    description: 'Nothing can be downloaded or shared outside CHORUS.',
    color: 'bg-[rgba(71,122,255,0.16)] text-[#6E97FF]'
  },
  {
    icon: Layers,
    title: 'Private sessions',
    description:
      'Each session is a private workspace. Close it and everything inside is gone.',
    color: 'bg-[rgba(182,255,18,0.14)] text-[#B6FF12]'
  },
  {
    icon: CheckCircle,
    title: 'Curated apps',
    description:
      "All apps are reviewed and approved before they're available to use.",
    color: 'bg-[rgba(102,239,255,0.13)] text-[#66EFFF]'
  },
  {
    icon: Activity,
    title: 'All activity is recorded',
    description: 'Logs are kept for compliance and traceability.',
    color: 'bg-[rgba(171,165,245,0.16)] text-[#ABA5F5]'
  }
]

export function StepWelcome({ onNext, onSkip }: StepWelcomeProps) {
  return (
    <>
      <div
        className="pointer-events-none absolute -top-20 right-[-60px] h-[340px] w-[340px] rounded-full"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(71,122,255,0.14), transparent 70%)'
        }}
      />
      <div className="relative">
        <div className="mb-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8a8a8a]">
          Getting started · 2 min
        </div>
        <h2 className="mb-4 text-[38px] font-medium leading-[1.08] tracking-[-0.02em]">
          Welcome to CHORUS
        </h2>
        <p className="mb-9 max-w-[560px] text-[15px] leading-[1.65] text-[#B8B8B8]">
          CHORUS is a trusted research environment — a secure room where you
          analyse sensitive health data without the data ever leaving. You bring
          the tools; the data stays put. Here&apos;s how it keeps your work
          safe.
        </p>

        <div className="grid max-w-[600px] grid-cols-2 gap-3.5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-[rgba(255,255,255,0.09)] bg-[rgba(255,255,255,0.035)] p-[18px]"
            >
              <div
                className={`mb-3 inline-flex h-[34px] w-[34px] items-center justify-center rounded-[9px] ${feature.color}`}
              >
                <feature.icon className="h-[18px] w-[18px]" />
              </div>
              <div className="mb-1 text-sm font-medium">{feature.title}</div>
              <div className="text-[12.5px] leading-[1.5] text-[#9a9a9a]">
                {feature.description}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-[38px] flex items-center gap-3.5">
          <button
            onClick={onNext}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#B6FF12] px-[22px] py-[11px] text-sm font-medium text-[#0c0c0c] transition-all hover:gap-2.5"
          >
            Get started
            <ArrowRight className="h-[15px] w-[15px]" />
          </button>
          <button
            onClick={onSkip}
            className="px-2 py-[11px] text-[13.5px] text-[#9a9a9a] transition-colors hover:text-[#c8c8c8]"
          >
            Skip the tour
          </button>
        </div>
      </div>
    </>
  )
}
