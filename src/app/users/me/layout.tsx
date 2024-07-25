import { Sidebar } from '@/components/sidebar'
import { Header } from '~/components/header'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Sidebar />
      <Header />
      {/* <Breadcrumb /> */}
      {children}
      {/* <RightSidebar /> */}
    </>
  )
}
