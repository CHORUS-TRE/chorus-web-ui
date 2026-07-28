'use client'

import { useEffect } from 'react'

import { useInstanceWireframeMode } from '@/hooks/use-instance-config'

/**
 * Mirrors the instance-wide wireframe mode flag onto the <html> element as
 * data-wireframe-enabled. This gates the [data-fidelity="wireframe"] CSS
 * rules in globals.css — elements manually marked data-fidelity="wireframe"
 * in code only render as wireframe while this attribute is present.
 */
export const WireframeModeApplicator = () => {
  const wireframeModeEnabled = useInstanceWireframeMode()

  useEffect(() => {
    document.documentElement.toggleAttribute(
      'data-wireframe-enabled',
      wireframeModeEnabled
    )
  }, [wireframeModeEnabled])

  return null
}
