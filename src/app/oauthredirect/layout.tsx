'use client'

import React from 'react'

import { LoadingOverlay } from '~/components/loading-overlay'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <LoadingOverlay isLoading={true} />
      {children}
    </>
  )
}
