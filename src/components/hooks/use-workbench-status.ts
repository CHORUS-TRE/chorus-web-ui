import { useCallback, useEffect, useState } from 'react'

import { K8sWorkbenchStatus, Workbench } from '@/domain/model'
import { getWorkbench } from '@/view-model/workbench-view-model'

const POLLING_INTERVAL = 3000 // 3 seconds
const TIMEOUT = 10 * 1000 // 10 seconds

interface UseWorkbenchStatusProps {
  workbenchId?: string
  onSuccess?: (workbench: Workbench) => void
  onError?: (error: string) => void
  onTimeout?: () => void
}

export function useWorkbenchStatus({
  workbenchId,
  onSuccess,
  onError,
  onTimeout
}: UseWorkbenchStatusProps) {
  const [isPolling, setIsPolling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeoutError, setTimeoutError] = useState<string | null>(null)

  const stopPolling = useCallback(() => {
    setIsPolling(false)
  }, [])

  useEffect(() => {
    if (!workbenchId || !isPolling) {
      return
    }

    const poll = async () => {
      const result = await getWorkbench(workbenchId)
      if (result.error) {
        setError(result.error)
        if (onError) onError(result.error)
        stopPolling()
        return
      }

      if (result.data) {
        // if (result.data.k8sStatus === K8sWorkbenchStatus.RUNNING) {
          if (onSuccess) onSuccess(result.data)
          stopPolling()
        // }
      }
    }

    const intervalId = setInterval(poll, POLLING_INTERVAL)
    const timeoutId = setTimeout(() => {
      const timeoutMessage = `Session loading timed out after ${Math.floor(TIMEOUT / 1000)} seconds.`
      setTimeoutError(timeoutMessage)
      if (onTimeout) onTimeout()
      stopPolling()
    }, TIMEOUT)

    // Initial poll
    poll()

    return () => {
      clearInterval(intervalId)
      clearTimeout(timeoutId)
    }
  }, [workbenchId, isPolling, stopPolling, onSuccess, onError, onTimeout])

  const startPolling = useCallback(() => {
    setIsPolling(true)
    setError(null)
    setTimeoutError(null)
  }, [])

  // Combine error and timeoutError for the main error state
  const pollingError = error || timeoutError

  return { isPolling, error: pollingError, startPolling, stopPolling }
}
