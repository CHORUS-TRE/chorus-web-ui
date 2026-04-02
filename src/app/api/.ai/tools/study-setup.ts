import { tool } from 'ai'
import { z } from 'zod'

export const showStudySetupWizardTool = tool({
  description:
    'Launch an interactive study setup wizard that guides the user through creating a research workspace. Includes regulatory checklist, data needs assessment, and study-appropriate configuration. Use when the user wants to start a new study or create a workspace.',
  inputSchema: z.object({
    studyType: z
      .enum([
        'clinical-trial',
        'observational',
        'data-analysis',
        'ml-ai',
        'general'
      ])
      .optional()
      .describe('Type of research study, if already known'),
    suggestedName: z
      .string()
      .optional()
      .describe('Pre-filled study/workspace name if mentioned by user'),
    regulatoryStatus: z
      .enum(['pending', 'approved', 'not-required'])
      .optional()
      .describe(
        'Whether CER-VD approval is pending, obtained, or not required'
      ),
    dataNeedsHint: z
      .enum(['cdw', 'external', 'imaging', 'biobank', 'none'])
      .optional()
      .describe('Primary data source if known'),
    context: z
      .string()
      .optional()
      .describe('Additional context to pre-populate wizard fields')
  }),
  execute: async (input) => ({
    type: 'study-setup-wizard' as const,
    studyType: input.studyType ?? null,
    suggestedName: input.suggestedName ?? null,
    regulatoryStatus: input.regulatoryStatus ?? null,
    dataNeedsHint: input.dataNeedsHint ?? null,
    context: input.context ?? null
  })
})
