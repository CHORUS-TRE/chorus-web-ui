'use client'

import { useEffect, useRef, useState } from 'react'
import { env } from 'next-runtime-env'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import { useNavigation } from './navigation-context'

export default function BackgroundIframe() {
  const [iframeURLIsOK, setIframeURLIsOK] = useState(false)
  const [url, setUrl] = useState<string>()
  const [error, setError] = useState<string | null>(null)

  const { background } = useNavigation()
  const intervalRef = useRef<NodeJS.Timeout>()
  const iFrameRef = useRef<HTMLIFrameElement>(null)

  const focusOnIframe = (t: number) => {
    setTimeout(() => {
      iFrameRef.current?.focus()
    }, t * 1000)
  }

  const checkIframeURL = () => {
    if (!url) return

    fetch(url, { method: 'HEAD' })
      .then((result) => {
        if (result.status === 200) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = undefined
          }

          setIframeURLIsOK(true)
          focusOnIframe(3)
        }
      })
      .catch((e) => {
        console.error(e)
        setError(`Error loading app: ${e.message}`)
      })
  }

  useEffect(() => {
    const currentLocation = window.location
    const currentURL = `${currentLocation.protocol}//${currentLocation.hostname}${currentLocation.port ? `:${currentLocation.port}` : ''}`
    const baseAPIURL = env('NEXT_PUBLIC_DATA_SOURCE_API_URL')
    const url = `${baseAPIURL ? baseAPIURL : currentURL}/workbenchs/${background?.workbenchId}/stream/`

    setUrl(url)
  }, [setUrl, background])

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
          src={iframeURLIsOK ? url : 'about:blank'}
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
