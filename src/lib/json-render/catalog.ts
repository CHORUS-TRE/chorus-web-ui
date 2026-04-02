'use client'

import { defineCatalog } from '@json-render/core'
import { schema } from '@json-render/react/schema'
import type { ComponentDefinition } from '@json-render/shadcn'
import { shadcnComponentDefinitions } from '@json-render/shadcn'
import { z } from 'zod'

// ---------------------------------------------------------------------------
// Custom component definitions for Chorus
// ---------------------------------------------------------------------------

const WorkflowStep = {
  props: z.object({
    title: z.string().describe('Step name'),
    description: z.string().describe('What happens in this step'),
    responsible: z.string().nullable().describe('Who is responsible'),
    system: z.string().nullable().describe('System/platform used'),
    docRef: z.string().nullable().describe('Reference document ID'),
    status: z.enum(['completed', 'current', 'upcoming']).describe('Step status')
  }),
  description:
    'A step in a clinical research workflow. Shows title, description, responsible party, system, and doc reference with a status icon.'
} satisfies ComponentDefinition

const WorkflowHeader = {
  props: z.object({
    title: z.string().describe('Workflow title'),
    totalSteps: z.number().describe('Total number of steps'),
    currentStep: z.number().describe('Current step index (0-based)')
  }),
  description: 'Header bar showing workflow title and progress indicator.'
} satisfies ComponentDefinition

const StatusField = {
  props: z.object({
    label: z.string().describe('Field label'),
    value: z.string().describe('Field value'),
    variant: z
      .enum(['default', 'success', 'warning', 'danger', 'muted'])
      .nullable()
      .describe('Color variant for the value')
  }),
  description:
    'A labeled key-value field for status displays. Use variant to color-code values.'
} satisfies ComponentDefinition

const InfoCard = {
  props: z.object({
    title: z.string().describe('Card title'),
    icon: z
      .enum([
        'users',
        'database',
        'shield',
        'file-text',
        'settings',
        'activity',
        'clock',
        'check-circle'
      ])
      .nullable()
      .describe('Icon name from lucide-react')
  }),
  slots: ['content'],
  description:
    'A titled section card with an optional icon. Use for grouping related information.'
} satisfies ComponentDefinition

const DataLoader = {
  props: z.object({}),
  description:
    'Headless component — renders nothing. Fires a "load" event on mount. Use with on.load to trigger async data-fetching actions. Also supports watch bindings to re-trigger when state changes.'
} satisfies ComponentDefinition

const StatusBadge = {
  props: z.object({
    status: z.string().describe('Status value: active | inactive | deleted or any string'),
    label: z.string().nullable().describe('Override display label. Defaults to the status value.')
  }),
  description:
    'Colored status pill. active → emerald, inactive → amber, deleted → red. Unknown statuses render in neutral muted style.'
} satisfies ComponentDefinition

const SearchResultItem = {
  props: z.object({
    title: z.string().describe('Document title'),
    collection: z
      .enum(['bpr', 'dsi', 'chorus', 'all'])
      .describe('Source collection identifier'),
    passage: z.string().describe('Matched passage text (truncated to 3 lines)'),
    document: z.string().describe('Source document path or identifier')
  }),
  description:
    'A single documentation search result. Shows title, collection badge, passage excerpt (line-clamped to 3), and document path.'
} satisfies ComponentDefinition

const WorkspacePickerItem = {
  props: z.object({
    id: z.string().describe('Workspace ID — passed to selectWorkspace action on click'),
    name: z.string().describe('Workspace display name'),
    status: z.string().describe('Workspace status'),
    memberCount: z.number().describe('Number of members'),
    workbenchCount: z.number().describe('Number of active sessions')
  }),
  description:
    'Clickable workspace selection button for the workspace picker list. Fires a "click" event when pressed. Wire to selectWorkspace action via on.click.'
} satisfies ComponentDefinition

// ---------------------------------------------------------------------------
// Full catalog — shadcn base + Chorus custom components
// ---------------------------------------------------------------------------

export const chorusCatalog = defineCatalog(schema, {
  actions: {
    fetchWorkspaceStatus: {
      params: z.object({
        workspaceId: z
          .string()
          .nullable()
          .describe('Workspace ID to load, or null to list all workspaces')
      }),
      description:
        'Load workspace status from the platform API. Sets state: loading, workspace, workspaces, approvals, appInstances, error.'
    },
    selectWorkspace: {
      params: z.object({
        workspaceId: z
          .string()
          .describe('The workspace ID the user selected from the picker')
      }),
      description:
        'Set the selected workspace ID. Clears current workspace data. A watch binding on /selectedId then re-fires fetchWorkspaceStatus.'
    }
  },
  components: {
    // shadcn layout & display
    Card: shadcnComponentDefinitions.Card,
    Stack: shadcnComponentDefinitions.Stack,
    Grid: shadcnComponentDefinitions.Grid,
    Text: shadcnComponentDefinitions.Text,
    Badge: shadcnComponentDefinitions.Badge,
    Separator: shadcnComponentDefinitions.Separator,
    Heading: shadcnComponentDefinitions.Heading,
    Alert: shadcnComponentDefinitions.Alert,
    Progress: shadcnComponentDefinitions.Progress,
    Table: shadcnComponentDefinitions.Table,

    // Chorus custom
    WorkflowStep,
    WorkflowHeader,
    StatusField,
    InfoCard,

    // Chorus custom (continued)
    DataLoader,
    StatusBadge,
    SearchResultItem,
    WorkspacePickerItem,
  }
})

/**
 * Generate the system prompt fragment that teaches the LLM
 * which components are available and how to compose them.
 */
export function getCatalogPrompt(): string {
  return chorusCatalog.prompt()
}
