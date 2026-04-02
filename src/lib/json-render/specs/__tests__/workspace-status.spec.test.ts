import { buildWorkspaceStatusSpec } from '../workspace-status.spec'

describe('buildWorkspaceStatusSpec', () => {
  test('root element exists', () => {
    const spec = buildWorkspaceStatusSpec('ws-1')
    expect(spec.elements[spec.root]).toBeDefined()
  })

  test('initial state has correct shape', () => {
    const spec = buildWorkspaceStatusSpec('ws-1')
    expect(spec.state).toMatchObject({
      selectedId: 'ws-1',
      loading: true,
      workspace: null,
      workspaces: null,
      approvals: [],
      appInstances: [],
      error: null
    })
  })

  test('initial state selectedId is null when workspaceId is null', () => {
    const spec = buildWorkspaceStatusSpec(null)
    expect((spec.state as Record<string, unknown>).selectedId).toBeNull()
  })

  test('DataLoader element exists with on.load bound to fetchWorkspaceStatus', () => {
    const spec = buildWorkspaceStatusSpec('ws-1')
    const loader = Object.values(spec.elements).find(
      (el) => el.type === 'DataLoader'
    )
    expect(loader).toBeDefined()
    expect(
      (loader!.on as unknown as Record<string, Record<string, string>>)?.load
        ?.action
    ).toBe('fetchWorkspaceStatus')
  })

  test('DataLoader has watch on /selectedId bound to fetchWorkspaceStatus', () => {
    const spec = buildWorkspaceStatusSpec('ws-1')
    const loader = Object.values(spec.elements).find(
      (el) => el.type === 'DataLoader'
    )
    expect(
      (loader!.watch as unknown as Record<string, Record<string, string>>)?.[
        '/selectedId'
      ]?.action
    ).toBe('fetchWorkspaceStatus')
  })

  test('loading-view is visible when state.loading is true', () => {
    const spec = buildWorkspaceStatusSpec('ws-1')
    const loadingEl = spec.elements['loading-view']
    expect(loadingEl).toBeDefined()
    expect(
      (loadingEl.visible as unknown as Record<string, string>)?.$state
    ).toBe('/loading')
  })

  test('error-view is visible when state.error is set', () => {
    const spec = buildWorkspaceStatusSpec('ws-1')
    const errorEl = spec.elements['error-view']
    expect(errorEl).toBeDefined()
    expect((errorEl.visible as unknown as Record<string, string>)?.$state).toBe(
      '/error'
    )
  })

  test('workspace-card is visible when state.workspace is set', () => {
    const spec = buildWorkspaceStatusSpec('ws-1')
    const card = spec.elements['workspace-card']
    expect(card).toBeDefined()
    expect((card.visible as unknown as Record<string, string>)?.$state).toBe(
      '/workspace'
    )
  })

  test('workspace-picker is visible when state.workspaces is set', () => {
    const spec = buildWorkspaceStatusSpec('ws-1')
    const picker = spec.elements['workspace-picker']
    expect(picker).toBeDefined()
    expect((picker.visible as unknown as Record<string, string>)?.$state).toBe(
      '/workspaces'
    )
  })

  test('picker-list uses repeat over /workspaces', () => {
    const spec = buildWorkspaceStatusSpec(null)
    const list = spec.elements['picker-list']
    expect(list).toBeDefined()
    expect(list.repeat?.statePath).toBe('/workspaces')
  })

  test('picker-item on.click fires selectWorkspace', () => {
    const spec = buildWorkspaceStatusSpec(null)
    const item = spec.elements['picker-item']
    expect(
      (item.on as unknown as Record<string, Record<string, string>>)?.click
        ?.action
    ).toBe('selectWorkspace')
  })
})
