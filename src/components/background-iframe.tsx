'use client'

import { env } from 'next-runtime-env'
import { useEffect, useRef, useState } from 'react'

import { useUrlValidation } from '@/components/hooks/use-url-validation'
import { useAppState } from '@/components/store/app-state-context'

import { LoadingOverlay } from './loading-overlay'

export default function BackgroundIframe() {
  const { background, setBackground } = useAppState()
  const iFrameRef = useRef<HTMLIFrameElement>(null)

  const [url, setUrl] = useState<string | null>(null)
  const { error, isLoading } = useUrlValidation(url)

  // URL initialization effect
  useEffect(() => {
    if (!background?.sessionId) {
      setUrl(null)
      return
    }

    const currentLocation = window.location
    const currentURL = `${currentLocation.protocol}//${currentLocation.hostname}${currentLocation.port ? `:${currentLocation.port}` : ''}`
    const baseAPIURL = `${env('NEXT_PUBLIC_DATA_SOURCE_API_URL')}/api/rest/v1`
    const newUrl = `${baseAPIURL ? baseAPIURL : currentURL}/workbenchs/${background.sessionId}/stream/`

    setUrl(newUrl)
  }, [background])

  // Focus management effect
  useEffect(() => {
    const iframe = iFrameRef.current

    if (!iframe) return

    iframe.focus()
    const focusTimeout = setTimeout(() => {
      iframe.focus()
    }, 1 * 1000)

    return () => focusTimeout && clearTimeout(focusTimeout)
  }, [])

  useEffect(() => {
    const { pathname } = window.location

    // check for http://localhost:3000/workspaces/56/sessions/423 404
    // Use window.addEventListener since pathname is just a string
    window.addEventListener('popstate', () => {
      if (
        pathname !==
        `/workspaces/${background?.workspaceId}/sessions/${background?.sessionId}`
      ) {
        setBackground(undefined)
      }
    })

    // Clean up event listener
    return () => {
      window.removeEventListener('popstate', () => {
        if (
          pathname !==
          `/workspaces/${background?.workspaceId}/sessions/${background?.sessionId}`
        ) {
          setBackground(undefined)
        }
      })
    }
  }, [error, setBackground, background])

  const handleLoad = () => {
    const handleMouseOver = (e: MouseEvent) => {
      iFrameRef.current?.focus()
      e.preventDefault()
      e.stopPropagation()
    }

    setTimeout(() => handleMouseOver, 1000)
    iFrameRef.current?.addEventListener('mouseover', handleMouseOver)
  }

  if (!background?.sessionId) return null

  return (
    <>
      <LoadingOverlay
        isLoading={isLoading}
        message="Loading session..."
        dismiss={error ? true : false}
      />
      {/* {error && (
        <div className="fixed inset-0 top-11 z-30 flex items-center justify-center bg-background/80">
          <Alert variant="default" className="w-[400px] text-white">
            <AlertCircle className="mt-1 h-4 w-4 text-white" />
            <AlertTitle>Session did not load correctly</AlertTitle>
            <AlertDescription className="text-white">
              {error.message}
            </AlertDescription>
          </Alert>
        </div>
      )} */}
      {!isLoading && !error && (
        <iframe
          title="Application Workspace"
          src={url ? url : 'about:blank'}
          allow="autoplay; fullscreen; clipboard-write;"
          style={{ width: '100vw', height: '100vh' }}
          className="fixed left-0 top-11 z-20 h-full w-full"
          id="workspace-iframe"
          ref={iFrameRef}
          aria-label="Application Workspace"
          onLoad={handleLoad}
          tabIndex={0}
        />
      )}
    </>
  )
}
