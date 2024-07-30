import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/build.css'
import '@/styles/globals.css'
import { cookies } from 'next/headers'
import { AuthProvider } from '~/components/auth-context'

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
      <body className={inter.className}>
        <AuthProvider authenticated={authenticated}>{children}</AuthProvider>
      </body>
    </html>
  )
}
