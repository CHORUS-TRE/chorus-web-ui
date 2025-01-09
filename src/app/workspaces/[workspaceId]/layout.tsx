'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import {
  ALBERT_WORKSPACE_ID,
  useAppState
} from '~/components/store/app-state-context'

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
          <Link
            href={`/workspaces/${workspace?.id}`}
            className="text-white hover:bg-inherit hover:text-accent"
          >
            {workspace ? (
              params?.workspaceId === ALBERT_WORKSPACE_ID ? (
                'Home'
              ) : (
                workspace.shortName
              )
            ) : (
              <span className="animate-pulse">Loading workspace...</span>
            )}
          </Link>
        </h2>
      </div>
      {children}
    </>
  )
}
