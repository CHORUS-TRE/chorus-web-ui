'use client'

import { type Spec } from '@json-render/core'

import { ChatArtifact } from '@/stores/chat-store'

import { DynamicUIRenderer } from './dynamic-ui-renderer'
import { JsonRenderWorkflow } from './json-render-prototype'
import { SearchResultsRenderer } from './search-results-renderer'
import { StudySetupWizard } from './study-setup-wizard'
import { WizardArtifact } from './wizard-artifact'
import { WorkspaceStatusWidget } from './workspace-status-widget'

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

    case 'study-setup-wizard':
      return (
        <StudySetupWizard
          studyType={(artifact.data as { studyType?: string | null }).studyType}
          suggestedName={
            (artifact.data as { suggestedName?: string | null }).suggestedName
          }
          regulatoryStatus={
            (artifact.data as { regulatoryStatus?: string | null })
              .regulatoryStatus
          }
          dataNeedsHint={
            (artifact.data as { dataNeedsHint?: string | null }).dataNeedsHint
          }
          context={(artifact.data as { context?: string | null }).context}
        />
      )

    case 'workflow': {
      const data = artifact.data as {
        title: string
        steps: {
          title: string
          description: string
          responsible?: string
          system?: string
          docRef?: string
        }[]
        currentStep: number
      }
      return (
        <JsonRenderWorkflow
          title={data.title}
          steps={data.steps}
          currentStep={data.currentStep}
        />
      )
    }

    case 'workspace-status':
      return (
        <WorkspaceStatusWidget
          workspaceId={
            (artifact.data as { workspaceId: string | null }).workspaceId
          }
        />
      )

    case 'dynamic-ui':
      return <DynamicUIRenderer spec={(artifact.data as { spec: Spec }).spec} />

    case 'search-results': {
      const data = artifact.data as {
        query: string
        collection: string
        results: {
          passage: string
          document: string
          title: string
          collection: string
          score: number
        }[]
        error?: string
      }
      return <SearchResultsRenderer {...data} />
    }

    default:
      return null
  }
}
