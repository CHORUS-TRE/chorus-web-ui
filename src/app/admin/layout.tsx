'use client'

import React from 'react'

import { MainLayout } from '@/components/layouts/main-layout'
import { AdminSidebar } from '@/components/ui/admin-sidebar'
import { DynamicBreadcrumb } from '@/components/ui/dynamic-breadcrumb'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <MainLayout>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <DynamicBreadcrumb />
          {children}
        </main>
      </div>
    </MainLayout>
  )
}
