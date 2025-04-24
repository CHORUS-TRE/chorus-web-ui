import { useCallback, useEffect, useRef, useState } from 'react'

const MAX_ATTEMPTS = 5
const RETRY_INTERVAL = 1000

export const useUrlValidation = (url: string | null) => {
  const [isValid, setIsValid] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const attemptCountRef = useRef(0)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const lastUrlRef = useRef<string | null>(null)

  const validateUrl = useCallback(
    async (urlToCheck: string): Promise<boolean> => {
      try {
        const result = await fetch(urlToCheck, { method: 'HEAD' })
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
      setIsValid(false)
      setIsLoading(false)
      return
    }

    const checkUrl = async () => {
      if (attemptCountRef.current >= MAX_ATTEMPTS) {
        setError(
          new Error(`Max attempts reached. Please check the URL and try again.`)
        )
        setIsLoading(false)
        return
      }

      try {
        const isValid = await validateUrl(url)
        setIsValid(isValid)
        setError(null)
        setIsLoading(false)
      } catch (err) {
        console.log('err', err)
        // const errorMessage = err instanceof Error ? err.message : String(err)
        // setError(new Error(`Attempt ${attemptCountRef.current + 1}/${MAX_ATTEMPTS}: ${errorMessage}`))
        attemptCountRef.current += 1
        timeoutRef.current = setTimeout(checkUrl, RETRY_INTERVAL)
      }
    }

    setIsLoading(true)
    checkUrl()

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [url, validateUrl])

  return { isValid, error, isLoading }
}
