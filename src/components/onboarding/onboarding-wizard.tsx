'use client'

import { useCallback, useState } from 'react'

import { useUserPreferences } from '@/stores/user-preferences-store'

import { StepApps } from './step-apps'
import { StepLaunch } from './step-launch'
// StepProfile is intentionally kept but skipped in the wizard flow for now.
import { StepTerms } from './step-terms'
import { StepWelcome } from './step-welcome'
import { StepWorkspace } from './step-workspace'
import { WizardLayout } from './wizard-layout'

export function OnboardingWizard() {
  const [step, setStep] = useState(0)
  const [createdWorkspace, setCreatedWorkspace] = useState<{
    id: string
    name: string
  } | null>(null)
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([])
  const { setHasCompletedOnboarding } = useUserPreferences()

  const next = useCallback(() => setStep((s) => Math.min(s + 1, 4)), [])
  const back = useCallback(() => setStep((s) => Math.max(s - 1, 0)), [])

  const complete = useCallback(() => {
    setHasCompletedOnboarding(true)
  }, [setHasCompletedOnboarding])

  const handleWorkspaceCreated = useCallback(
    (workspace: { id: string; name: string }) => {
      setCreatedWorkspace({ id: workspace.id, name: workspace.name })
      next()
    },
    [next]
  )

  const subtitleOverride = step === 4 ? 'Almost there' : undefined

  return (
    <WizardLayout currentStep={step} subtitleOverride={subtitleOverride}>
      {step === 0 && <StepWelcome onNext={next} onSkip={complete} />}
      {step === 1 && <StepTerms onNext={next} onBack={back} />}
      {step === 2 && (
        <StepWorkspace onCreated={handleWorkspaceCreated} onBack={back} />
      )}
      {step === 3 && (
        <StepApps
          onNext={next}
          onBack={back}
          selectedAppIds={selectedAppIds}
          onSelectionChange={setSelectedAppIds}
        />
      )}
      {step === 4 && (
        <StepLaunch
          workspace={createdWorkspace}
          selectedAppIds={selectedAppIds}
          onComplete={complete}
          onBack={back}
          onSkip={complete}
        />
      )}
    </WizardLayout>
  )
}
