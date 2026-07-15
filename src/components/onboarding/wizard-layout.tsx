'use client'

import { Check } from 'lucide-react'
import Image from 'next/image'
import { type ReactNode } from 'react'

export interface OnboardingStep {
  label: string
}

const STEPS: OnboardingStep[] = [
  { label: 'Welcome' },
  { label: 'Terms & data policy' },
  { label: 'Create a workspace' },
  { label: 'Pick apps' },
  { label: 'Launch a session' }
]

interface WizardLayoutProps {
  currentStep: number
  children: ReactNode
  subtitleOverride?: string
}

export function WizardLayout({
  currentStep,
  children,
  subtitleOverride
}: WizardLayoutProps) {
  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen bg-background font-sans text-foreground">
      {/* Left hero panel - forced to the dark palette: it's a photo-backed
          brand panel that needs a dark scrim for legibility regardless of
          the active site theme, matching the pattern used for the
          create-workspace form in step-workspace.tsx. */}
      <div className="dark relative flex w-[404px] flex-none flex-col overflow-hidden bg-background p-9 text-foreground">
        <Image
          src="/cover-sm.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/55 via-background/80 to-background/95" />
        <div className="relative flex h-full flex-col">
          <Image
            src="/logo-chorus-primaire-white@2x.svg"
            alt="CHORUS"
            width={90}
            height={18}
            className="h-[18px] w-auto self-start"
          />
          <div className="mt-auto">
            <div className="mb-[18px] text-[11px] font-semibold uppercase tracking-[0.1em] text-accent">
              {subtitleOverride ?? 'Secure Processing Environment'}
            </div>
            <StepRail currentStep={currentStep} />
          </div>
        </div>
      </div>

      {/* Right content panel */}
      <div className="relative flex flex-1 flex-col justify-end overflow-y-auto p-14">
        {children}
      </div>
    </div>
  )
}

function StepRail({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex flex-col gap-0.5">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        const isUpcoming = index > currentStep

        return (
          <div key={step.label} className="flex items-center gap-[13px] py-2">
            {isCompleted && (
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-accent/15 text-accent">
                <Check className="h-[13px] w-[13px]" strokeWidth={3} />
              </span>
            )}
            {isCurrent && (
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground shadow-[0_0_0_4px_hsl(var(--primary)/0.22)]">
                {index + 1}
              </span>
            )}
            {isUpcoming && (
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full border-[1.5px] border-muted-foreground/40 text-[11px] text-muted-foreground">
                {index + 1}
              </span>
            )}
            <span
              className={`text-[13.5px] ${
                isCurrent
                  ? 'font-medium text-foreground'
                  : isCompleted
                    ? 'text-foreground/70'
                    : 'text-muted-foreground'
              }`}
            >
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
