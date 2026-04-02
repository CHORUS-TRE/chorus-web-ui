'use client'

import { buildSearchResultsSpec } from '@/lib/json-render/specs/search-results.spec'
import { buildWorkflowSpec } from '@/lib/json-render/specs/workflow.spec'
import {
  buildWorkspaceStatusSpec,
  workspaceStatusHandlers
} from '@/lib/json-render/specs/workspace-status.spec'
import { ChatArtifact } from '@/stores/chat-store'

import { DynamicUIRenderer } from './dynamic-ui-renderer'
import { StudySetupWizard } from './study-setup-wizard'
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

    case 'study-setup-wizard':
      return (
        <StudySetupWizard
          studyType={
            (artifact.data as { studyType?: string | null }).studyType
          }
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
        <DynamicUIRenderer
          spec={buildWorkflowSpec(data.title, data.steps, data.currentStep)}
        />
      )
    }

    case 'workspace-status': {
      const { workspaceId } = artifact.data as { workspaceId: string | null }
      return (
        <DynamicUIRenderer
          spec={buildWorkspaceStatusSpec(workspaceId)}
          handlers={workspaceStatusHandlers}
        />
      )
    }

    case 'dynamic-ui':
      return (
        <DynamicUIRenderer
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          spec={(artifact.data as { spec: any }).spec}
        />
      )

    case 'search-results': {
      const data = artifact.data as {
        query: string
        collection: string
        results: {
          passage: string
          document: string
          title: string
          collection: 'bpr' | 'dsi' | 'chorus' | 'all'
          score: number
        }[]
        error?: string
      }
      return <DynamicUIRenderer spec={buildSearchResultsSpec(data)} />
    }

    default:
      return null
  }
}
