import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/build.css'
import '@/styles/globals.css'
import { Sidebar } from '@/components/sidebar'
import Breadcrumb from '~/components/breadcrumb'
import RightSidebar from '~/components/right-sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CHORUS - Trusted Research Platform',
  description: 'A secure anayltics platform for your data'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Sidebar />
        <Breadcrumb />
        {children}
        <RightSidebar />
      </body>
    </html>
  )
}
