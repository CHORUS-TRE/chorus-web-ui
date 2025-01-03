'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import { Workspace as WorkspaceType } from '@/domain/model'

import { workspaceGet } from '~/components/actions/workspace-view-model'

import WorkspaceHeader from './header'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const params = useParams<{ workspaceId: string; desktopId: string }>()

  const [workspace, setWorkspace] = useState<WorkspaceType>()
  const [error, setError] = useState<string>()

  const workspaceId = params?.workspaceId

  useEffect(() => {
    if (!workspaceId) return

    workspaceGet(workspaceId)
      .then((response) => {
        if (response?.error) setError(response.error)
        if (response?.data) setWorkspace(response.data)
      })
      .catch((error) => {
        setError(error.message)
      })
  }, [])

  return (
    <>
      <WorkspaceHeader workspace={workspace} />
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {children}
    </>
  )
}
