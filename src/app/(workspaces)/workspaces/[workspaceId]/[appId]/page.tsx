'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import { useNavigation } from '~/components/navigation-context'

import { Header } from './header'

export default function WorkbenchPage() {
  const { setBackground } = useNavigation()
  const [show, setShow] = useState(true)
  const params = useParams<{ workspaceId: string; appId: string }>()
  const workbenchId = params?.appId
  const workspaceId = params?.workspaceId

  useEffect(() => {
    if (!workbenchId || !workspaceId) return
    setBackground({ workspaceId, workbenchId })
  }, [workbenchId])

  return (
    <>
      <div
        className={`absolute left-0 top-0 z-40 h-11 min-w-full transition-[top] duration-500 ease-in-out ${show ? 'top-0' : '-top-11'}`}
        id="header"
      >
        <Header />
      </div>
    </>
  )
}
