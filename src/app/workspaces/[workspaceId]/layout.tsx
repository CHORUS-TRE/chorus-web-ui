'use client'

import React from 'react'
import { useParams } from 'next/navigation'

import MyWorkspaceMenu from '@/app/(home)/menu'

import {
  ALBERT_WORKSPACE_ID,
  useAppState
} from '~/components/store/app-state-context'

import WorkspaceMenu from './menu'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const params = useParams<{ workspaceId: string }>()
  const { workspaces } = useAppState()
  const workspace = workspaces?.find((w) => w.id === params?.workspaceId)
  return (
    <>
      <div className="">
        <h2 className="mb-8 mt-5 text-white">
          {workspace ? (
            params?.workspaceId === ALBERT_WORKSPACE_ID ? (
              'Home'
            ) : (
              workspace.shortName
            )
          ) : (
            <span className="animate-pulse">Loading workspace...</span>
          )}
        </h2>
      </div>
      {params?.workspaceId === ALBERT_WORKSPACE_ID ? (
        <MyWorkspaceMenu id={ALBERT_WORKSPACE_ID} />
      ) : (
        <WorkspaceMenu id={params?.workspaceId} />
      )}

      {children}
    </>
  )
}
