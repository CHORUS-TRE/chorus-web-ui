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

    let cancelled = false
    let pollTimer: ReturnType<typeof setTimeout> | undefined
    const startedAt = Date.now()

    const poll = async () => {
      const result = await getWorkbench(workbenchId)
      if (cancelled) return

      if (result.error) {
        setResponse({ error: result.error?.message })
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
          return
        }
      }

      if (Date.now() - startedAt < TIMEOUT) {
        pollTimer = setTimeout(poll, POLLING_INTERVAL)
      }
    }

    void poll()

    return () => {
      cancelled = true
      if (pollTimer) clearTimeout(pollTimer)
    }
  }, [workbenchId])

  return { ...response }
}
