'use client'

import { useEffect } from 'react'
import { useTransition } from 'react'
import { useParams } from 'next/navigation'

import { Header } from '@/components/header'

import { useAuth } from '~/components/store/auth-context'
import { useNavigation } from '~/components/store/navigation-context'

export default function WorkbenchPage() {
  const params = useParams<{ workspaceId: string; appId: string }>()
  const [isPending, startTransition] = useTransition()
  const { background, setBackground } = useNavigation()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      setBackground(undefined)
      return
    }

    setBackground({
      workbenchId: params.appId,
      workspaceId: params.workspaceId
    })
  }, [])

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
