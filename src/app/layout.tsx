import React from 'react'
import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Script from 'next/script'
import { PublicEnvScript } from 'next-runtime-env'

import { AppStateProvider } from '@/components/store/app-state-context'

import BackgroundIframe from '~/components/background-iframe'
import RightSidebar from '~/components/right-sidebar'
import { AuthProvider } from '~/components/store/auth-context'
import { Toaster } from '~/components/ui/toaster'
import { env } from '~/env'

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
  const matomoUrl = env.NEXT_PUBLIC_MATOMO_URL
  const containerId = env.NEXT_PUBLIC_MATOMO_CONTAINER_ID

  return (
    <html lang="en">
      <head>
        <PublicEnvScript />
        <Script id="matomo-tag-manager" strategy="afterInteractive">
          {`
            var _mtm = window._mtm = window._mtm || [];
            _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
            g.async=true; g.src='${matomoUrl}/js/container_${containerId}.js'; s.parentNode.insertBefore(g,s);
          `}
        </Script>
      </head>
      <body className={`${rubik.variable} antialiased`}>
        <AuthProvider authenticated={authenticated}>
          <AppStateProvider>
            {children}
            <RightSidebar show={true} />
            <BackgroundIframe />
            <Image
              alt="Background"
              src={cover}
              placeholder="blur"
              quality={75}
              priority={false}
              sizes="100vw"
              id="background"
              className="fixed left-0 top-0 h-full w-full"
            />
          </AppStateProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
