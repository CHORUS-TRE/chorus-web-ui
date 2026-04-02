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

// ---------------------------------------------------------------------------
// Full catalog — shadcn base + Chorus custom components
// ---------------------------------------------------------------------------

export const chorusCatalog = defineCatalog(schema, {
  actions: {},
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
    InfoCard
  }
})

/**
 * Generate the system prompt fragment that teaches the LLM
 * which components are available and how to compose them.
 */
export function getCatalogPrompt(): string {
  return chorusCatalog.prompt()
}
