import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/build.css'
import '@/styles/globals.css'
import { Sidebar } from '@/components/sidebar'
import Breadcrumb from '~/components/breadcrumb'
import RightSidebar from '~/components/right-sidebar'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
