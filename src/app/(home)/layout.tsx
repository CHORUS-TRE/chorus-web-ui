'use client'

import React from 'react'
import { useParams } from 'next/navigation'

import { MainLayout } from '@/components/layouts/main-layout'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <MainLayout>
      <div className="">
        <h2 className="mb-8 mt-5 text-white">Home</h2>
      </div>
      {children}
    </MainLayout>
  )
}
