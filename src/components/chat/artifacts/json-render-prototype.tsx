'use client'

import { type Spec } from '@json-render/core'
import { JSONUIProvider, Renderer } from '@json-render/react'

import { chorusRegistry } from '@/lib/json-render/registry'

// ---------------------------------------------------------------------------
// Spec builder — converts workflow data into a json-render Spec
// ---------------------------------------------------------------------------

interface WorkflowStepData {
  title: string
  description: string
  responsible?: string
  system?: string
  docRef?: string
}

export function buildWorkflowSpec(
  title: string,
  steps: WorkflowStepData[],
  currentStep: number
): Spec {
  const elements: Spec['elements'] = {}

  elements['header'] = {
    type: 'WorkflowHeader',
    props: { title, totalSteps: steps.length, currentStep }
  }

  const stepKeys = steps.map((step, i) => {
    const key = `step-${i}`
    elements[key] = {
      type: 'WorkflowStep',
      props: {
        title: step.title,
        description: step.description,
        responsible: step.responsible ?? null,
        system: step.system ?? null,
        docRef: step.docRef ?? null,
        status:
          i < currentStep
            ? 'completed'
            : i === currentStep
              ? 'current'
              : 'upcoming'
      }
    }
    return key
  })

  elements['root'] = {
    type: 'Card',
    props: {},
    children: ['header', 'steps']
  }

  elements['steps'] = {
    type: 'Stack',
    props: { direction: 'vertical', gap: 'sm' },
    children: stepKeys
  }

  return { root: 'root', elements }
}

// ---------------------------------------------------------------------------
// Public component — drop-in replacement for WorkflowWidget
// ---------------------------------------------------------------------------

interface JsonRenderWorkflowProps {
  title: string
  steps: WorkflowStepData[]
  currentStep: number
}

export function JsonRenderWorkflow({
  title,
  steps,
  currentStep
}: JsonRenderWorkflowProps) {
  const spec = buildWorkflowSpec(title, steps, currentStep)
  return (
    <JSONUIProvider registry={chorusRegistry}>
      <Renderer spec={spec} registry={chorusRegistry} />
    </JSONUIProvider>
  )
}
