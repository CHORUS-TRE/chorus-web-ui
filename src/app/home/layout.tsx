import Breadcrumb from '~/components/breadcrumb'
import { Header } from '~/components/header'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <Breadcrumb />
      {children}
    </>
  )
}
