'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'

import { Header } from '@/components/header'
import { useAppState } from '@/components/store/app-state-context'
import { useAuth } from '~/components/store/auth-context'
import { toast } from '~/hooks/use-toast'

export default function WorkbenchPage() {
  const params = useParams<{ workspaceId: string; sessionId: string }>()
  const { setBackground, notification } = useAppState()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      setBackground(undefined)
      return
    }

    setBackground({
      sessionId: params.sessionId,
      workspaceId: params.workspaceId
    })
  }, [isAuthenticated, params.sessionId, params.workspaceId, setBackground])

  useEffect(() => {
    if (notification) {
      toast({
        title: notification.title,
        description: notification.description || '',
        variant: notification.variant,
        className: 'bg-background text-white'
      })
    }
  }, [notification])

  return (
    <>
      <div
        className={`absolute left-0 top-0 z-40 h-11 min-w-full transition-[top] duration-500 ease-in-out`}
        id="header"
      >
        <Header />
      </div>
    </>
  )
}
