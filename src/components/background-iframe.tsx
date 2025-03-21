'use client'

import { env } from 'next-runtime-env'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useAppState } from '@/components/store/app-state-context'

const MAX_ATTEMPTS = 10
const RETRY_INTERVAL = 1000

export default function BackgroundIframe() {
  const { background, appInstances, setNotification } = useAppState()
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const iFrameRef = useRef<HTMLIFrameElement>(null)

  const [url, setUrl] = useState<string | null>(null)
  const [isUrlValid, setIsUrlValid] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)

  const resetState = useCallback(() => {
    setUrl(null)
    setIsUrlValid(false)
    setNotification(undefined)
    setAttemptCount(0)
  }, [setNotification])

  const workbenchAppInstances = appInstances?.filter(
    (ai) => ai.workbenchId === background?.workbenchId
  )

  const pingIframeURL = useCallback(
    async (urlToCheck: string): Promise<boolean> => {
      if (!urlToCheck || isUrlValid) return false

      try {
        const result = await fetch(urlToCheck, { method: 'HEAD' })
        return result.status === 200
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : 'Unknown error occurred'
        setNotification({
          title: 'Error loading app',
          description: errorMessage,
          variant: 'destructive'
        })
        return false
      }
    },
    [isUrlValid, setNotification]
  )

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
    setNotification(undefined)
    setAttemptCount(0)
  }, [background, setNotification, resetState])

  // URL validation effect
  useEffect(() => {
    if (!url) return

    const validateURL = async () => {
      if (attemptCount >= MAX_ATTEMPTS) {
        setNotification({
          title: 'Max attempts reached. Please check the URL and try again.',
          variant: 'destructive'
        })

        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
        return
      }

      try {
        const isValid = await pingIframeURL(url)
        setIsUrlValid(Boolean(isValid))

        if (isValid) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
        } else {
          setAttemptCount((prev) => prev + 1)
        }
      } catch (err) {
        setNotification({
          title: 'Error loading app',
          description: err.message,
          variant: 'destructive'
        })
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }

    validateURL()
    intervalRef.current = setInterval(validateURL, RETRY_INTERVAL)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [url, isUrlValid, attemptCount, pingIframeURL, setNotification])

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
            setNotification({
              title: 'Workspace Ready',
              description: 'Your workspace has been loaded successfully'
            })
          }
        }}
      />
    </>
  )
}
