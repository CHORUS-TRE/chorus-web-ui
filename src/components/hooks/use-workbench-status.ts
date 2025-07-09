import { useCallback, useEffect, useState } from 'react'

import { getWorkbench } from '@/components/actions/workbench-view-model'
import { K8sWorkbenchStatus, Workbench } from '@/domain/model'

const POLLING_INTERVAL = 3000 // 3 seconds
const TIMEOUT = 300000 // 5 minutes

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
        if (result.data.k8sStatus === K8sWorkbenchStatus.RUNNING) {
          if (onSuccess) onSuccess(result.data)
          stopPolling()
        }
      }
    }

    const intervalId = setInterval(poll, POLLING_INTERVAL)
    const timeoutId = setTimeout(() => {
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
  }, [])

  return { isPolling, error, startPolling, stopPolling }
}
