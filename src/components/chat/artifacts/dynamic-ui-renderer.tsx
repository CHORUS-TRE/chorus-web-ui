'use client'

import { createStateStore, type Spec } from '@json-render/core'
import { JSONUIProvider, Renderer } from '@json-render/react'
import { useMemo } from 'react'

import { chorusRegistry } from '@/lib/json-render/registry'

export type StateAwareHandler = (
  params: Record<string, unknown>,
  setState: (path: string, value: unknown) => void
) => Promise<unknown> | unknown

interface DynamicUIRendererProps {
  spec: Spec
  handlers?: Record<string, StateAwareHandler>
}

export function DynamicUIRenderer({ spec, handlers }: DynamicUIRendererProps) {
  const store = useMemo(
    () => createStateStore(spec.state ?? {}),
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
    <JSONUIProvider registry={chorusRegistry} store={store} handlers={jrHandlers}>
      <Renderer spec={spec} registry={chorusRegistry} />
    </JSONUIProvider>
  )
}
