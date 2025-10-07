import { useCallback, useEffect, useState } from 'react'

import { K8sWorkbenchStatus, Workbench } from '@/domain/model'
import { getWorkbench } from '@/view-model/workbench-view-model'

const POLLING_INTERVAL = 1000 // 3 seconds
const TIMEOUT = 10 * 1000 // 10 seconds

export function useWorkbenchStatus(workbenchId?: string) {
  const [isPolling, setIsPolling] = useState(false)
  const [status, setStatus] = useState<WorkbenchStatus | null>(null)
  const stopPolling = useCallback(() => {
    setIsPolling(false)
  }, [])
  const startPolling = useCallback(() => {
    setIsPolling(true)
  }, [])

  useEffect(() => {
    if (!workbenchId || isPolling) {
      return
    }

    const poll = async () => {
      const result = await getWorkbench(workbenchId)
      if (result.error) {
        setStatus(result.error)
        stopPolling()
        return
      }

      if (result.data) {
        if (result.data.k8sStatus === K8sWorkbenchStatus.RUNNING) {
          stopPolling()
        }

        setStatus(result.data.k8sStatus)
      }
    }

    const intervalId = setInterval(poll, POLLING_INTERVAL)
    const timeoutId = setTimeout(() => {
      stopPolling()
    }, TIMEOUT)

    // Initial poll
    poll()

    return () => {
      clearInterval(intervalId)
      clearTimeout(timeoutId)
    }
  }, [workbenchId, startPolling, stopPolling, isPolling])

  return { status }
}
