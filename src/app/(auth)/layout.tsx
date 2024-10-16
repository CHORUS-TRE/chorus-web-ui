'use client'

import React from 'react'

import { Header } from '~/components/header'
import { useNavigation } from '~/components/store/navigation-context'

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

      <div
        className="absolute left-1/2 top-24 z-30 w-full max-w-xl -translate-x-1/2 rounded-2xl bg-black bg-opacity-85 p-8 empty:hidden"
        id="content"
      >
        {children}
      </div>
    </>
  )
}
