'use client'

import React from 'react'

import { useNavigation } from '~/components/navigation-context'

import { Header } from '../header'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const { background } = useNavigation()

  return (
    <>
      <div
        className={`absolute left-0 top-0 z-40 h-11 min-w-full transition-[top] duration-500 ease-in-out`}
        id="header"
      >
        <Header />
      </div>

      <div
        className="absolute left-1/2 top-24 z-30 w-full max-w-6xl -translate-x-1/2 rounded-lg border-2 border-slate-600 bg-slate-900 bg-opacity-85 p-8"
        id="content"
      >
        {children}
      </div>
    </>
  )
}
