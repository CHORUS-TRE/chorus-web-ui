'use client'

import { useEffect, useRef, useState } from 'react'
import { env } from 'next-runtime-env'

import { useAppState } from '@/components/store/app-state-context'

import { useToast } from '~/hooks/use-toast'

export default function BackgroundIframe() {
  const [iframeURLIsOK, setIframeURLIsOK] = useState(false)
  const [url, setUrl] = useState<string>()
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const { background } = useAppState()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
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
            intervalRef.current = null
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
    if (!background?.workbenchId) {
      return
    }

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
      intervalRef.current = null
    }
  }, [url, background])

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error!',
        description: error,
        variant: 'destructive',
        className: 'bg-background text-white',
        duration: 1000
      })
    }
  }, [error])

  return (
    <>
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
