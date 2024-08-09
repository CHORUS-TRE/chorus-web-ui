import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/build.css'
import '@/styles/globals.css'
import { cookies } from 'next/headers'
import { AuthProvider } from '~/components/auth-context'
import Breadcrumb from '~/components/breadcrumb'
import { Header } from '~/components/header'

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
  const session = cookies().get('session')
  const authenticated = session !== undefined

  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-200`}>
        <AuthProvider authenticated={authenticated}>
          <Header />
          <div className="mx-auto mt-8 max-w-6xl bg-slate-50 bg-opacity-20 p-4">
            <Breadcrumb />
            <div className="">{children}</div>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
