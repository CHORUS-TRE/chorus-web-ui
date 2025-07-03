'use client'

import { env } from 'next-runtime-env'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useAppState } from '@/components/store/app-state-context'

import { useAuth } from './store/auth-context'

export default function BackgroundIframe() {
  const { user } = useAuth()
  const { background } = useAppState()
  const iFrameRef = useRef<HTMLIFrameElement>(null)

  const [url, setUrl] = useState<string | null>(null)
  // const { error, isLoading } = useUrlValidation(url)

  // Memoize URL computation to prevent unnecessary recalculations
  const computedUrl = useMemo(() => {
    if (!background?.sessionId) {
      return null
    }

    const currentLocation = window.location
    const currentURL = `${currentLocation.protocol}//${currentLocation.hostname}${currentLocation.port ? `:${currentLocation.port}` : ''}`
    const baseAPIURL = `${env('NEXT_PUBLIC_DATA_SOURCE_API_URL')}/api/rest/v1`
    return `${baseAPIURL ? baseAPIURL : currentURL}/workbenchs/${background.sessionId}/stream/`
  }, [background?.sessionId])

  // URL initialization effect
  useEffect(() => {
    if (computedUrl !== url) {
      setUrl(computedUrl)
    }
  }, [computedUrl, url])

  // Focus management effect - only run when URL changes
  useEffect(() => {
    if (!url) return

    const iframe = iFrameRef.current
    if (!iframe) return

    iframe.focus()
    const focusTimeout = setTimeout(() => {
      iframe.focus()
    }, 1 * 1000)

    return () => focusTimeout && clearTimeout(focusTimeout)
  }, [url])

  // Memoize handleLoad to prevent iframe re-renders
  const handleLoad = useCallback(() => {
    const handleMouseOver = (e: MouseEvent) => {
      iFrameRef.current?.focus()
      e.preventDefault()
      e.stopPropagation()
    }

    setTimeout(() => handleMouseOver, 1000)
    iFrameRef.current?.addEventListener('mouseover', handleMouseOver)
  }, [])

  // useEffect(() => {
  //   if (!url) return

  //   const xhr = new XMLHttpRequest()

  //   xhr.open('GET', url)
  //   xhr.onreadystatechange = () => {
  //     if (xhr.readyState === xhr.DONE) {
  //       if (xhr.status === 200) {
  //         const data_url = URL.createObjectURL(xhr.response)
  //         document
  //           .querySelector('#workspace-iframe')
  //           ?.setAttribute('src', data_url)
  //       } else {
  //         console.error('no data :(')
  //       }
  //     }
  //   }
  //   xhr.responseType = 'blob'
  //   xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('token'))
  //   // xhr.setRequestHeader('credentials', 'include')
  //   xhr.send()
  // }, [url])

  if (!background?.sessionId || !user) return null

  return (
    <>
      {/* <LoadingOverlay
        isLoading={isLoading}
        message="Loading session..."
        dismiss={error ? true : false}
      /> */}
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
    </>
  )
}
