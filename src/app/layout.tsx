import React from 'react'
import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Script from 'next/script'

import { AuthProvider } from '~/components/auth-context'
import HUD from '~/components/HUD'
import { NavigationProvider } from '~/components/navigation-context'
import RightSidebar from '~/components/right-sidebar'
import Workbench from '~/components/workbench'

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
      <Script id="hud-mouse-events">
        {`
        const hud = document.getElementById('hud')

        hud?.addEventListener('mouseleave', function () {
          hud?.classList.remove('left-0')
          hud?.classList.add('-left-16')

          hud?.addEventListener('mouseenter', function () {
            hud?.classList.add('left-0')
            hud?.classList.remove('-left-16')
          })
        })
        `}
      </Script>
      <body className={`${rubik.variable} antialiased`}>
        <AuthProvider authenticated={authenticated}>
          <NavigationProvider>
            {children}

            <RightSidebar show={true} />

            {/* z-10 */}
            <Workbench />

            <div
              className="fixed left-0 top-1/2 z-30 -translate-y-1/2 pl-2 transition-[left] duration-500 ease-in-out"
              id="hud"
            >
              <HUD />
            </div>

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
