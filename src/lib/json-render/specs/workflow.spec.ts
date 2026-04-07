import { type Spec } from '@json-render/core'

interface WorkflowStepData {
  title: string
  description: string
  responsible?: string | null
  system?: string | null
  docRef?: string | null
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

  elements['steps'] = {
    type: 'Stack',
    props: { direction: 'vertical', gap: 'sm', align: null, justify: null },
    children: stepKeys
  }

  elements['root'] = {
    type: 'Card',
    props: { title: null, description: null, maxWidth: null, centered: null },
    children: ['header', 'steps']
  }

  return { root: 'root', elements }
}
