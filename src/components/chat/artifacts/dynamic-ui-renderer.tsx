'use client'

import { type Spec } from '@json-render/core'
import { JSONUIProvider, Renderer } from '@json-render/react'

import { chorusRegistry } from '@/lib/json-render/registry'

interface DynamicUIRendererProps {
  spec: Spec
}

export function DynamicUIRenderer({ spec }: DynamicUIRendererProps) {
  return (
    <JSONUIProvider registry={chorusRegistry}>
      <Renderer spec={spec} registry={chorusRegistry} />
    </JSONUIProvider>
  )
}
