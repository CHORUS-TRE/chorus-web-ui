import { tool } from 'ai'
import { z } from 'zod'

import { WORKFLOWS } from '@/app/api/chat/workflows'

export const showWorkflowTool = tool({
  description:
    'Display a clinical research workflow as an interactive step-by-step plan widget. Use when the user asks about a process, procedure, or how to do something. ALWAYS prefer this over listing steps in text.',
  inputSchema: z.object({
    workflowId: z
      .enum([
        'study-lifecycle',
        'feasibility-study',
        'data-extraction',
        'regulatory-submission',
        'workspace-setup',
        'informed-consent',
        'safety-reporting',
        'monitoring'
      ])
      .describe('The workflow to display'),
    currentStep: z
      .number()
      .optional()
      .describe(
        'Current step index (0-based). Steps before this are marked completed.'
      ),
    context: z
      .string()
      .optional()
      .describe('Additional context to tailor the workflow display')
  }),
  execute: async ({ workflowId, currentStep, context }) => {
    const workflow = WORKFLOWS[workflowId]
    return {
      type: 'workflow' as const,
      workflowId,
      title: workflow?.title ?? workflowId,
      steps: workflow?.steps ?? [],
      currentStep: currentStep ?? 0,
      context: context ?? null
    }
  }
})
