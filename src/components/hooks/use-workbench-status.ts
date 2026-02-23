import { useEffect, useState } from 'react'

import { WorkbenchServerPodStatus } from '@/domain/model'
import { getWorkbench } from '@/view-model/workbench-view-model'

const POLLING_INTERVAL = 500
const TIMEOUT = 30 * 1000

export function useWorkbenchStatus(workbenchId?: string) {
  const [response, setResponse] = useState<{
    data?: {
      status?: WorkbenchServerPodStatus
      message?: string
    }
    error?: string
  }>({})

  useEffect(() => {
    if (!workbenchId) {
      return
    }

    const poll = async () => {
      const result = await getWorkbench(workbenchId)

      if (result.error) {
        setResponse({ error: result.error })
        clearInterval(intervalId)
        clearTimeout(timeoutId)
        return
      }

      if (result.data) {
        setResponse({
          data: {
            status:
              result.data.serverPodStatus || WorkbenchServerPodStatus.UNKNOWN,
            message: result.data.serverPodMessage
          }
        })

        if (result.data.serverPodStatus === WorkbenchServerPodStatus.READY) {
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

  return { ...response }
}
