'use client'

import { useEffect, useRef, useState } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import { env } from '~/env'

import { useNavigation } from './navigation-context'

export default function BackgroundIframe() {
  const [iframeURLIsOK, setIframeURLIsOK] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { background } = useNavigation()
  const intervalRef = useRef<NodeJS.Timeout>()
  const iFrameRef = useRef<HTMLIFrameElement>(null)

  const currentUrl = window.location
  const baseUrl = `${currentUrl.protocol}//${currentUrl.hostname}${currentUrl.port ? `:${currentUrl.port}` : ''}`
  const url = `${env.NEXT_PUBLIC_DATA_SOURCE_API_URL ? env.NEXT_PUBLIC_DATA_SOURCE_API_URL : baseUrl}/workbenchs/${background?.workbenchId}/stream/`

  const focusOnIframe = (t: number) => {
    setTimeout(() => {
      iFrameRef.current?.focus()
    }, t * 1000)
  }

  const checkIframeURL = () => {
    fetch(url, { method: 'HEAD' })
      .then((result) => {
        if (result.status === 200) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = undefined
          }

          setIframeURLIsOK(true)
          focusOnIframe(3)
        } else {
          setError(`Error loading app: ${result.statusText}`)
        }
      })
      .catch((e) => {
        console.error(e)
        setError(`Error loading app: ${e.message}`)
      })
  }

  // we check if the iframe URL is OK
  useEffect(() => {
    if (!background?.workbenchId) return

    checkIframeURL()
    intervalRef.current = setInterval(() => {
      checkIframeURL()
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = undefined
    }
  }, [url, background])

  return (
    <>
      {error && (
        <Alert
          variant="destructive"
          className="absolute bottom-2 right-2 z-10 w-96 bg-background text-white"
        >
          <AlertTitle>Error !</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {background && (
        <iframe
          title="Background Iframe"
          src={iframeURLIsOK ? url : ''}
          allow="autoplay; fullscreen; clipboard-write;"
          style={{ width: '100vw', height: '100vh' }}
          className="fixed left-0 top-11 z-10 h-full w-full"
          id="iframe"
          ref={iFrameRef}
        />
      )}
    </>
  )
}
