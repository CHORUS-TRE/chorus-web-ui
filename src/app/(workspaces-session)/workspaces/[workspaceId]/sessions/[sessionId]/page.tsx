'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'

import { useAppState } from '@/providers/app-state-provider'
import { useAuthentication } from '@/providers/authentication-provider'

export default function WorkbenchPage() {
  const params = useParams<{ workspaceId: string; sessionId: string }>()
  const { setBackground } = useAppState()
  const { user } = useAuthentication()

  useEffect(() => {
    setBackground({
      sessionId: params.sessionId,
      workspaceId: params.workspaceId
    })
  }, [user, params.sessionId, params.workspaceId, setBackground])

  return null
}
