'use client'

import React from 'react'

import { MainLayout } from '@/components/layouts/main-layout'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <MainLayout>{children}</MainLayout>
}
