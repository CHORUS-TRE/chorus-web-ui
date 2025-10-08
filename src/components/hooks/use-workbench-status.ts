import { useEffect, useState } from 'react'

import { K8sWorkbenchStatus } from '@/domain/model'
import { getWorkbench } from '@/view-model/workbench-view-model'

const POLLING_INTERVAL = 1000 // 3 seconds
const TIMEOUT = 10 * 1000 // 10 seconds

export function useWorkbenchStatus(workbenchId?: string) {
  const [status, setStatus] = useState<WorkbenchStatus | null>(null)

  useEffect(() => {
    if (!workbenchId) {
      return
    }

    const poll = async () => {
      const result = await getWorkbench(workbenchId)

      if (result.error) {
        setStatus(result.error)
        clearInterval(intervalId)
        clearTimeout(timeoutId)
        return
      }

      if (result.data) {
        setStatus(result.data.k8sStatus)

        if (result.data.k8sStatus === K8sWorkbenchStatus.RUNNING) {
          clearInterval(intervalId)
          clearTimeout(timeoutId)
        }
      }
    }

    // Initial poll
    poll()

    const intervalId:NodeJS.Timeout = setInterval(poll, POLLING_INTERVAL)
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId)
    }, TIMEOUT)

    return () => {
      clearInterval(intervalId)
      clearTimeout(timeoutId)
    }
  }, [workbenchId])

  return { status }
}
