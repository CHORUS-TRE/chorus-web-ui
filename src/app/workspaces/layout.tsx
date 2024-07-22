import type { Metadata } from 'next'
import '@/app/build.css'
import '@/styles/globals.css'
import { Sidebar } from '@/components/sidebar'
import Breadcrumb from '~/components/breadcrumb'
import RightSidebar from '~/components/right-sidebar'
import { Header } from '~/components/header'
import App from '~/components/app'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <div className="absolute left-0 top-0 z-0 h-full w-full ">
        <App />
      </div>

      <div className="bg-white-900 absolute left-0 top-0 h-full w-full bg-opacity-50">
        <Header />
        <Breadcrumb />
        {children}
        <RightSidebar />
      </div>
      <Sidebar />
    </>
  )
}
