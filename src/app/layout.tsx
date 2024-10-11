import React from 'react'
import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import { cookies } from 'next/headers'
import Image from 'next/image'

import { AuthProvider } from '~/components/auth-context'
import BackgroundIframe from '~/components/background-iframe'
import HUD from '~/components/HUD'
import { NavigationProvider } from '~/components/navigation-context'
import RightSidebar from '~/components/right-sidebar'

import '@/app/build.css'
import '@/styles/globals.css'

import cover from '/public/cover.jpeg'

const rubik = Rubik({
  subsets: ['latin'],
  variable: '--font-rubik'
})

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
      <body className={`${rubik.variable} antialiased`}>
        <AuthProvider authenticated={authenticated}>
          <NavigationProvider>
            {children}
            <RightSidebar show={true} />
            <BackgroundIframe /> {/* z-10 */}
            <HUD />
            <Image
              alt="Background"
              src={cover}
              placeholder="blur"
              quality={75}
              priority={true}
              sizes="100vw"
              id="background"
              className="fixed left-0 top-0 h-full w-full"
            />
          </NavigationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
