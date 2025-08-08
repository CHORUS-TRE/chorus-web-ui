'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'

import { Header } from '@/components/header'
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

  return (
    <>
      <div className={`absolute left-0 top-0 z-40 h-11 min-w-full`}>
        <Header />
      </div>
    </>
  )
}
