import { buildWorkflowSpec } from '../workflow.spec'

const steps = [
  {
    title: 'Step A',
    description: 'Do A',
    responsible: 'PI',
    system: 'Portal',
    docRef: 'SOP-01'
  },
  {
    title: 'Step B',
    description: 'Do B',
    responsible: null,
    system: null,
    docRef: null
  }
]

describe('buildWorkflowSpec', () => {
  test('root element is a Card with header and steps children', () => {
    const spec = buildWorkflowSpec('My Workflow', steps, 0)
    expect(spec.root).toBe('root')
    expect(spec.elements['root'].type).toBe('Card')
    expect(spec.elements['root'].children).toEqual(['header', 'steps'])
  })

  test('header element has correct props', () => {
    const spec = buildWorkflowSpec('My Workflow', steps, 1)
    const header = spec.elements['header']
    expect(header.type).toBe('WorkflowHeader')
    expect(header.props).toEqual({
      title: 'My Workflow',
      totalSteps: 2,
      currentStep: 1
    })
  })

  test('steps element uses correct step keys', () => {
    const spec = buildWorkflowSpec('My Workflow', steps, 0)
    expect(spec.elements['steps'].children).toEqual(['step-0', 'step-1'])
  })

  test('step status: completed, current, upcoming', () => {
    const spec = buildWorkflowSpec('My Workflow', steps, 1)
    expect(spec.elements['step-0'].props.status).toBe('completed')
    expect(spec.elements['step-1'].props.status).toBe('current')
  })

  test('step props are mapped correctly', () => {
    const spec = buildWorkflowSpec('My Workflow', steps, 0)
    expect(spec.elements['step-0'].props).toEqual({
      title: 'Step A',
      description: 'Do A',
      responsible: 'PI',
      system: 'Portal',
      docRef: 'SOP-01',
      status: 'current'
    })
  })

  test('null step fields are passed as null', () => {
    const spec = buildWorkflowSpec('My Workflow', steps, 0)
    expect(spec.elements['step-1'].props.responsible).toBeNull()
    expect(spec.elements['step-1'].props.system).toBeNull()
    expect(spec.elements['step-1'].props.docRef).toBeNull()
  })
})
