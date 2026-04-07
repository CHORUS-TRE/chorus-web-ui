'use client'

import { createStateStore, type Spec, type UIElement } from '@json-render/core'
import { JSONUIProvider, Renderer } from '@json-render/react'
import { useMemo } from 'react'

import { chorusRegistry } from '@/lib/json-render/registry'

export type StateAwareHandler = (
  params: Record<string, unknown>,
  setState: (path: string, value: unknown) => void
) => Promise<unknown> | unknown

interface DynamicUIRendererProps {
  spec: Spec
  /**
   * Action handlers for this spec. Must be referentially stable (wrap in useMemo
   * at the call site) to avoid unnecessary re-registration on every render.
   */
  handlers?: Record<string, StateAwareHandler>
}

/**
 * Guard against stale localStorage specs that may have null element.props.
 * @json-render/react calls Object.entries(element.props) internally, which
 * throws on null.
 */
function sanitizeSpec(spec: Spec): Spec {
  const sanitized: Record<string, UIElement> = {}
  for (const [id, el] of Object.entries(spec.elements)) {
    sanitized[id] = el.props == null ? { ...el, props: {} } : el
  }
  return { ...spec, elements: sanitized }
}

function DynamicUIRendererInner({ spec, handlers }: DynamicUIRendererProps) {
  const safeSpec = useMemo(() => sanitizeSpec(spec), [spec])
  const store = useMemo(
    () => createStateStore(spec.state ?? {}),
    // Store is intentionally created once on mount — spec.state seeds initial state only.
    // Use a `key` prop on the parent to force remount when a completely new spec is needed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const jrHandlers = useMemo(() => {
    if (!handlers) return undefined
    return Object.fromEntries(
      Object.entries(handlers).map(([name, fn]) => [
        name,
        (params: Record<string, unknown>) =>
          fn(params, (path, value) => store.set(path, value))
      ])
    )
  }, [handlers, store])

  return (
    <JSONUIProvider
      registry={chorusRegistry}
      store={store}
      handlers={jrHandlers}
    >
      <Renderer spec={safeSpec} registry={chorusRegistry} />
    </JSONUIProvider>
  )
}

export function DynamicUIRenderer({ spec, handlers }: DynamicUIRendererProps) {
  if (!spec?.elements) return null
  return <DynamicUIRendererInner spec={spec} handlers={handlers} />
}
