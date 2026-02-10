'use client'

import { useEffect, useState } from 'react'

import { K8sAppInstanceStatus } from '@/domain/model'
import { getAppInstance } from '@/view-model/app-instance-view-model'

const POLLING_INTERVAL = 500
const TIMEOUT = 30 * 1000

export function useAppInstanceStatus(appInstanceId?: string) {
  const [response, setResponse] = useState<{
    data?: {
      status?: K8sAppInstanceStatus
      message?: string
    }
    error?: string
  }>({})

  useEffect(() => {
    if (!appInstanceId) {
      return
    }

    const poll = async () => {
      const result = await getAppInstance(appInstanceId)

      if (result.error) {
        setResponse({ error: result.error })
        clearInterval(intervalId)
        clearTimeout(timeoutId)
        return
      }

      if (result.data) {
        setResponse({
          data: {
            status: result.data.k8sStatus || K8sAppInstanceStatus.UNKNOWN,
            message: result.data.k8sMessage
          }
        })

        if (result.data.k8sStatus === K8sAppInstanceStatus.RUNNING) {
          clearInterval(intervalId)
          clearTimeout(timeoutId)
        }

        if (result.data.k8sStatus === K8sAppInstanceStatus.FAILED) {
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
  }, [appInstanceId])

  return { ...response }
}
