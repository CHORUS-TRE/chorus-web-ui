'use client'

import { useCallback, useState } from 'react'

import { useUserPreferences } from '@/stores/user-preferences-store'
import { acceptTermsOfUse } from '@/view-model/terms-of-use-view-model'

import { StepApps } from './step-apps'
import { StepLaunch } from './step-launch'
import { StepProfile } from './step-profile'
import { StepTerms } from './step-terms'
import { StepWelcome } from './step-welcome'
import { StepWorkspace } from './step-workspace'
import { WizardLayout } from './wizard-layout'

export function OnboardingWizard() {
  const [step, setStep] = useState(0)
  const { setHasCompletedOnboarding } = useUserPreferences()

  const next = useCallback(() => setStep((s) => Math.min(s + 1, 5)), [])
  const back = useCallback(() => setStep((s) => Math.max(s - 1, 0)), [])

  const complete = useCallback(() => {
    setHasCompletedOnboarding(true)
  }, [setHasCompletedOnboarding])

  const handleTermsNext = useCallback(async () => {
    try {
      await acceptTermsOfUse()
    } catch {
      // Terms may have already been accepted
    }
    next()
  }, [next])

  const subtitleOverride = step === 5 ? 'Almost there' : undefined

  return (
    <WizardLayout currentStep={step} subtitleOverride={subtitleOverride}>
      {step === 0 && <StepWelcome onNext={next} onSkip={complete} />}
      {step === 1 && <StepTerms onNext={handleTermsNext} onBack={back} />}
      {step === 2 && <StepProfile onNext={next} onBack={back} />}
      {step === 3 && <StepWorkspace onNext={next} onBack={back} />}
      {step === 4 && <StepApps onNext={next} onBack={back} />}
      {step === 5 && <StepLaunch onLaunch={complete} onSkip={complete} />}
    </WizardLayout>
  )
}
