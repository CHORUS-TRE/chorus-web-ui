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
  { label: 'Your profile' },
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
    <div className="fixed inset-0 z-50 flex h-screen w-screen bg-[#0c0c0c] font-sans text-[#FAFAFA]">
      {/* Left hero panel */}
      <div className="relative flex w-[404px] flex-none flex-col overflow-hidden p-9">
        <Image
          src="/cover-sm.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,10,16,0.55)] via-[rgba(10,10,16,0.78)] to-[rgba(8,8,12,0.96)]" />
        <div className="relative flex h-full flex-col">
          <Image
            src="/logo-chorus-primaire-white@2x.svg"
            alt="CHORUS"
            width={90}
            height={18}
            className="h-[18px] w-auto self-start"
          />
          <div className="mt-auto">
            <div className="mb-[18px] text-[11px] font-semibold uppercase tracking-[0.1em] text-[#B6FF12]">
              {subtitleOverride ?? 'Trusted Research Environment'}
            </div>
            <StepRail currentStep={currentStep} />
          </div>
        </div>
      </div>

      {/* Right content panel */}
      <div className="relative flex flex-1 flex-col justify-end overflow-y-auto bg-[#101010] p-14">
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
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[rgba(182,255,18,0.16)] text-[#B6FF12]">
                <Check className="h-[13px] w-[13px]" strokeWidth={3} />
              </span>
            )}
            {isCurrent && (
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#477AFF] text-[11px] font-semibold shadow-[0_0_0_4px_rgba(71,122,255,0.22)]">
                {index + 1}
              </span>
            )}
            {isUpcoming && (
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full border-[1.5px] border-[#4a4a4a] text-[11px] text-[#8a8a8a]">
                {index + 1}
              </span>
            )}
            <span
              className={`text-[13.5px] ${
                isCurrent
                  ? 'font-medium text-[#FAFAFA]'
                  : isCompleted
                    ? 'text-[#bdbdbd]'
                    : 'text-[#8a8a8a]'
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
