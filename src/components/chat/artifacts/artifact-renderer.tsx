'use client'

import { ChatArtifact } from '@/stores/chat-store'

import { WizardArtifact } from './wizard-artifact'

export function ArtifactRenderer({ artifact }: { artifact: ChatArtifact }) {
  switch (artifact.type) {
    case 'wizard':
      return (
        <WizardArtifact
          projectType={(artifact.data as { projectType?: string }).projectType}
          suggestedName={
            (artifact.data as { suggestedName?: string }).suggestedName
          }
          context={(artifact.data as { context?: string }).context}
        />
      )
    default:
      return null
  }
}
