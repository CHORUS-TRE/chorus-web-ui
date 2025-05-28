'use client'

import { env } from 'next-runtime-env'
import { useEffect, useRef, useState } from 'react'

import { useAppState } from '@/components/store/app-state-context'
import { useUrlValidation } from '@/hooks/use-url-validation'

// import { ErrorOverlay } from './error-overlay'
import { LoadingOverlay } from './loading-overlay'

export default function BackgroundIframe() {
  const { background } = useAppState()
  const iFrameRef = useRef<HTMLIFrameElement>(null)

  const [url, setUrl] = useState<string | null>(null)
  const { isValid, error, isLoading } = useUrlValidation(url)

  // URL initialization effect
  useEffect(() => {
    if (!background?.sessionId) {
      setUrl(null)
      return
    }

    const currentLocation = window.location
    const currentURL = `${currentLocation.protocol}//${currentLocation.hostname}${currentLocation.port ? `:${currentLocation.port}` : ''}`
    const baseAPIURL = env('NEXT_PUBLIC_DATA_SOURCE_API_URL')
    const newUrl = `${baseAPIURL ? baseAPIURL : currentURL}/workbenchs/${background.sessionId}/stream/`

    setUrl(newUrl)
  }, [background])

  // Focus management effect
  useEffect(() => {
    const iframe = iFrameRef.current
    if (!iframe || !isValid) return

    iframe.focus()
    const focusTimeout = setTimeout(() => {
      iframe.focus()
    }, 1000)

    return () => clearTimeout(focusTimeout)
  }, [isValid])

  const handleLoad = () => {
    const handleMouseOver = (e: MouseEvent) => {
      {
        iFrameRef.current?.focus()
        e.preventDefault()
        e.stopPropagation()
      }
    }

    setTimeout(() => handleMouseOver, 1000)
    iFrameRef.current?.addEventListener('mouseover', handleMouseOver)
  }

  if (!background) return null

  return (
    <>
      <LoadingOverlay
        isLoading={isLoading}
        message="Loading session..."
        delay={2000}
        dismiss={error ? true : false}
      />
      {/* {error && <ErrorOverlay error={error} />} */}
      <iframe
        title="Application Workspace"
        src={isValid && url ? url : 'about:blank'}
        allow="autoplay; fullscreen; clipboard-write;"
        style={{ width: '100vw', height: '100vh' }}
        className="fixed left-0 top-11 z-20 h-full w-full"
        id="workspace-iframe"
        ref={iFrameRef}
        aria-label="Application Workspace"
        onLoad={handleLoad}
        tabIndex={0}
      />
    </>
  )
}
