import { useEffect, useState } from 'react'

import { K8sWorkbenchStatus, WorkbenchServerPodStatus } from '@/domain/model'
import { getWorkbench } from '@/view-model/workbench-view-model'

const POLLING_INTERVAL = 3000
const TIMEOUT = 30 * 1000

export function useWorkbenchStatus(workbenchId?: string) {
  const [status, setStatus] = useState<
    WorkbenchServerPodStatus | string | null
  >(null)

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
        setStatus(result.data.serverPodStatus || null)

        if (result.data.serverPodStatus === WorkbenchServerPodStatus.RUNNING) {
          clearInterval(intervalId)
          clearTimeout(timeoutId)
        }
      }
    }

    // Initial poll
    poll()

    const intervalId: NodeJS.Timeout = setInterval(poll, POLLING_INTERVAL)
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
