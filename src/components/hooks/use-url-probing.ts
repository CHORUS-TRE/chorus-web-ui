import { useCallback, useEffect, useRef, useState } from 'react'

import { workbenchStreamProbe } from '~/view-model/workbench-view-model'

const MAX_ATTEMPTS = 10
const RETRY_INTERVAL = 1000

export const useUrlProbing = (id: string | undefined) => {
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const attemptCountRef = useRef(0)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const lastUrlRef = useRef<string | null>(null)

  const probeURL = useCallback(async (id: string): Promise<boolean> => {
    try {
      const result = await workbenchStreamProbe(id)

      if (result.error) {
        console.error('result.error', result.error)
        throw new Error(result.error)
      }

      return result.data ? true : false
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : 'Unknown error occurred')
    }
  }, [])

  // Reset attempt count when URL changes
  useEffect(() => {
    if (id && id !== lastUrlRef.current) {
      attemptCountRef.current = 0
      lastUrlRef.current = id
    }
  }, [id])

  useEffect(() => {
    if (!id) {
      setIsLoading(false)
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    const checkUrl = async () => {
      if (attemptCountRef.current >= MAX_ATTEMPTS) {
        setError(
          new Error(`Max attempts reached. The session is not available.`)
        )
        setIsLoading(false)
        return
      }

      try {
        const isValid = await probeURL(id)

        if (isValid) {
          setError(null)
          setIsLoading(false)
          // Clear any pending timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = undefined
          }
          return
        }
      } catch (err) {
        console.error('Probe error:', err)
      }

      // Continue retrying
      attemptCountRef.current += 1
      timeoutRef.current = setTimeout(checkUrl, RETRY_INTERVAL)
    }

    checkUrl()

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = undefined
      }
    }
  }, [id, probeURL])

  return { error, isLoading }
}
