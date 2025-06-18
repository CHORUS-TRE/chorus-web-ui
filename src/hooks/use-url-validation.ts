import { useCallback, useEffect, useRef, useState } from 'react'

const MAX_ATTEMPTS = 3
const RETRY_INTERVAL = 1.5 * 1000

export const useUrlValidation = (url: string | null) => {
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const attemptCountRef = useRef(0)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const lastUrlRef = useRef<string | null>(null)
  const [status, setStatus] = useState<number | undefined>(undefined)

  const validateUrl = useCallback(
    async (urlToCheck: string): Promise<boolean> => {
      try {
        const result = await fetch(urlToCheck, { method: 'HEAD' })
        setStatus(result.status)
        return result.status === 200
      } catch (e) {
        throw new Error(
          e instanceof Error ? e.message : 'Unknown error occurred'
        )
      }
    },
    []
  )

  // Reset attempt count when URL changes
  useEffect(() => {
    if (url !== lastUrlRef.current) {
      attemptCountRef.current = 0
      lastUrlRef.current = url
    }
  }, [url])

  useEffect(() => {
    if (!url) {
      setIsLoading(false)
      return
    }

    const checkUrl = async () => {
      if (attemptCountRef.current >= MAX_ATTEMPTS) {
        setError(
          new Error(
            `${status ? status : ''} Please check the URL and try again.`
          )
        )
        setIsLoading(false)
        return
      }

      try {
        const isValid = await validateUrl(url)

        if (isValid) {
          setStatus(undefined)
          setError(null)
          setIsLoading(false)
          return
        }

        setIsLoading(true)
      } catch (err) {
        console.error('err', err)
        setError(err as Error)
        setIsLoading(false)
      }

      attemptCountRef.current += 1
      timeoutRef.current = setTimeout(checkUrl, RETRY_INTERVAL)
    }

    setIsLoading(true)
    checkUrl()

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [url, validateUrl, status])

  return { error, isLoading }
}
