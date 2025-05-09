'use client'

import { env } from 'next-runtime-env'
import { useEffect, useRef, useState } from 'react'

import { useAppState } from '@/components/store/app-state-context'
import { useUrlValidation } from '@/hooks/use-url-validation'

import { ErrorOverlay } from './error-overlay'
import { LoadingOverlay } from './loading-overlay'

export default function BackgroundIframe() {
  const { background, setBackground } = useAppState()
  const iFrameRef = useRef<HTMLIFrameElement>(null)

  const [url, setUrl] = useState<string | null>(null)
  const { isValid, error, isLoading } = useUrlValidation(url)

  // URL initialization effect
  useEffect(() => {
    if (!background?.workbenchId) {
      setUrl(null)
      return
    }

    const currentLocation = window.location
    const currentURL = `${currentLocation.protocol}//${currentLocation.hostname}${currentLocation.port ? `:${currentLocation.port}` : ''}`
    const baseAPIURL = env('NEXT_PUBLIC_DATA_SOURCE_API_URL')
    const newUrl = `${baseAPIURL ? baseAPIURL : currentURL}/workbenchs/${background.workbenchId}/stream/`

    setUrl(newUrl)
  }, [background])

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setBackground(undefined)
      }, 3 * 1000)
    }
  }, [error, setBackground])

  useEffect(() => {
    if (!isValid) return
    if (iFrameRef.current) {
      setTimeout(() => {
        iFrameRef.current?.focus()
      }, 1000)
    }

    // VM102753:1 Uncaught SecurityError: Failed to read a named property 'document' from 'Window': Blocked a frame with origin "http://localhost:3000" from accessing a cross-origin frame.
    // iFrameRef.current?.contentWindow?.document?.addEventListener("click", (e) => {
    // })
    // FIX: onMouseleave in header.tsx and main-layout.tsx
  }, [isValid])

  if (!background) return null

  return (
    <>
      <LoadingOverlay
        isLoading={isLoading}
        message="Loading workspace..."
        delay={2000}
        dismiss={error ? true : false}
      />
      {error && <ErrorOverlay error={error} />}
      <iframe
        title="Application Workspace"
        src={isValid && url ? url : 'about:blank'}
        allow="autoplay; fullscreen; clipboard-write;"
        style={{ width: '100vw', height: '100vh' }}
        className="fixed left-0 top-11 z-20 h-full w-full"
        id="workspace-iframe"
        ref={iFrameRef}
        aria-label="Application Workspace"
        tabIndex={0}
      />
    </>
  )
}
