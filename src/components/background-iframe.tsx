'use client'

import { useEffect, useRef, useState } from 'react'
import { env } from 'next-runtime-env'

import { useAppState } from '@/components/store/app-state-context'

import { useToast } from '~/hooks/use-toast'

const MAX_ATTEMPTS = 10
const RETRY_INTERVAL = 1000

export default function BackgroundIframe() {
  const { toast } = useToast()
  const { background, appInstances } = useAppState()
  const intervalRef = useRef<NodeJS.Timeout>()
  const iFrameRef = useRef<HTMLIFrameElement>(null)

  const [url, setUrl] = useState<string | null>(null)
  const [isUrlValid, setIsUrlValid] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [attemptCount, setAttemptCount] = useState(0)

  const resetState = () => {
    setUrl(null)
    setIsUrlValid(false)
    setError(null)
    setAttemptCount(0)
  }

  const workbenchAppInstances = appInstances?.filter(
    (ai) => ai.workbenchId === background?.workbenchId
  )

  const pingIframeURL = async (urlToCheck: string) => {
    if (!urlToCheck || isUrlValid) return

    try {
      const result = await fetch(urlToCheck, { method: 'HEAD' })
      if (result.status === 200) {
        return true
      }
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : 'Unknown error occurred'
      setError(`Error loading app: ${errorMessage}`)
    }
  }

  // URL initialization effect
  useEffect(() => {
    if (!background?.workbenchId) {
      resetState()
      return
    }

    const currentLocation = window.location
    const currentURL = `${currentLocation.protocol}//${currentLocation.hostname}${currentLocation.port ? `:${currentLocation.port}` : ''}`
    const baseAPIURL = env('NEXT_PUBLIC_DATA_SOURCE_API_URL')
    const newUrl = `${baseAPIURL ? baseAPIURL : currentURL}/workbenchs/${background.workbenchId}/stream/`

    setUrl(newUrl)
    setIsUrlValid(false)
    setError(null)
    setAttemptCount(0)
  }, [background])

  // URL validation effect
  useEffect(() => {
    if (!url || isUrlValid) return

    const validateURL = async () => {
      if (attemptCount >= MAX_ATTEMPTS) {
        clearInterval(intervalRef.current)
        setError('Failed to connect after maximum attempts')
        return
      }

      if (url) {
        const isValid = await pingIframeURL(url)
        if (isValid) {
          clearInterval(intervalRef.current)
          setIsUrlValid(true)
          setError(null)
        }
      }
      setAttemptCount((prev) => prev + 1)
    }

    validateURL()
    intervalRef.current = setInterval(validateURL, RETRY_INTERVAL)

    return () => clearInterval(intervalRef.current)
  }, [url, isUrlValid, attemptCount])

  // Error notification effect
  useEffect(() => {
    if (error) {
      toast({
        title: 'Connection Error',
        description: error,
        variant: 'destructive',
        className: 'bg-background text-white',
        duration: 3000
      })
    }
  }, [error, toast])

  // Focus management effect
  useEffect(() => {
    const iframe = iFrameRef.current
    if (!iframe || !isUrlValid) return

    iframe.focus()
    const focusTimeout = setTimeout(() => {
      iframe.focus()
    }, 1000)

    return () => clearTimeout(focusTimeout)
  }, [isUrlValid, workbenchAppInstances])

  if (!background) return null

  return (
    <>
      <div
        className="absolute left-44 top-44 z-50 h-8 w-8 bg-transparent"
        id="tour-getting-started-step3"
        role="presentation"
      />
      <iframe
        title="Application Workspace"
        src={isUrlValid && url ? url : 'about:blank'}
        allow="autoplay; fullscreen; clipboard-write;"
        style={{ width: '100vw', height: '100vh' }}
        className="fixed left-0 top-11 z-10 h-full w-full"
        id="workspace-iframe"
        ref={iFrameRef}
        aria-label="Application Workspace"
        tabIndex={0}
        onLoad={() => {
          if (isUrlValid) {
            toast({
              title: 'Workspace Ready',
              description: 'Your workspace has been loaded successfully',
              className: 'bg-background text-white',
              duration: 2000
            })
          }
        }}
      />
    </>
  )
}
