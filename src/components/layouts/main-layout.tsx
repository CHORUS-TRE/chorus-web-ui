'use client'

import React from 'react'
import Link from 'next/link'
import { FolderOpen, LaptopMinimal } from 'lucide-react'

import { useAppState } from '@/components/store/app-state-context'

import { Header } from '~/components/header'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { background, workspaces, workbenches } = useAppState()
  const workspace = workspaces?.find((w) => w.id === background?.workspaceId)
  const workbench = workbenches?.find((w) => w.id === background?.workbenchId)

  return (
    <>
      <div className="fixed left-0 top-0 z-40 h-11 min-w-full" id="header">
        <Header />
      </div>

      {background && (
        <Link
          href={`/workspaces/${background.workspaceId}/desktops/${background?.workbenchId}`}
          passHref
          className="hover:bg-accent"
        >
          <div
            className="fixed left-0 top-0 z-20 h-full w-full cursor-pointer bg-slate-900 bg-opacity-60"
            id="iframe-overlay"
          >
            <div className="pl-4 pt-32 text-white">
              <div className="flex items-center pt-2">
                <FolderOpen className="mr-2 h-4 w-4 opacity-70" />
                <span className="text-sm opacity-50">
                  {workspace?.shortName}
                </span>
              </div>
              <div className="flex items-center">
                <LaptopMinimal className="mr-2 h-4 w-4 opacity-70" />
                <span className="font-semibold opacity-50">
                  {workbench?.name}
                </span>
              </div>
            </div>
          </div>
        </Link>
      )}

      <div
        className="absolute left-1/2 top-24 z-30 min-h-[75vh] w-full max-w-6xl -translate-x-1/2 rounded-2xl border border-secondary bg-black bg-opacity-85 p-8"
        id="content"
      >
        {children}
      </div>
    </>
  )
}
