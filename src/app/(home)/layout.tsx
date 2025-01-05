'use client'

import React from 'react'
import { useParams } from 'next/navigation'

import { MainLayout } from '@/components/layouts/main-layout'

import { ALBERT_WORKSPACE_ID } from '~/components/store/app-state-context'

import WorkspaceMenu from './menu'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const params = useParams<{ workspaceId: string }>()

  return (
    <MainLayout>
      <div className="">
        <h2 className="mb-8 mt-5 text-white">Home</h2>
      </div>
      <WorkspaceMenu id={ALBERT_WORKSPACE_ID} />
      {children}
    </MainLayout>
  )
}
