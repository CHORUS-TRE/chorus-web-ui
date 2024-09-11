'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { Header } from '~/components/header'
import { useNavigation } from '~/components/navigation-context'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const { background } = useNavigation()

  return (
    <>
      <div className="fixed left-0 top-0 z-40 h-11 min-w-full" id="header">
        <Header />
      </div>

      {background && (
        <Link
          href={`/workspaces/${background.workspaceId}/${background?.workbenchId}`}
          passHref
          className="hover:bg-accent"
        >
          <div
            className="fixed left-0 top-0 z-20 h-full w-full cursor-pointer bg-slate-900 bg-opacity-60 "
            id="iframe-overlay"
          ></div>
        </Link>
      )}

      <div
        className="absolute left-1/2 top-24 z-30 w-full max-w-6xl -translate-x-1/2 rounded-lg border-2 border-slate-600 bg-slate-900 bg-opacity-85 p-8"
        id="content"
      >
        {children}
      </div>
    </>
  )
}
