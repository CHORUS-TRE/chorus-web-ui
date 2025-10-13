import '@/app/build.css'
import '@/styles/globals.css'

import { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import Script from 'next/script'
import { PublicEnvScript } from 'next-runtime-env'
import { env } from 'next-runtime-env'
import React from 'react'

import { AIChatProvider } from '@/providers/ai-chat-provider'
import { AppStateProvider } from '@/providers/app-state-provider'
import { AuthProvider } from '@/providers/authentication-provider'
import { AIChatWidget } from '~/components/ai-chat/ai-chat-widget'
import BackgroundIframe from '~/components/background-iframe'
import { Toaster } from '~/components/ui/toaster'
import { AuthorizationProvider } from '~/providers/authorization-provider'

const rubik = Rubik({
  subsets: ['latin'],
  variable: '--font-rubik'
})

export const metadata: Metadata = {
  title: 'CHORUS - Trusted Research Platform',
  description: 'A secure anayltics platform for your data'
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const matomoUrl = env('NEXT_PUBLIC_MATOMO_URL')
  const containerId = env('NEXT_PUBLIC_MATOMO_CONTAINER_ID')

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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${rubik.variable} antialiased`}>
        <AuthProvider>
          <AuthorizationProvider>
            <AppStateProvider>
              {/* <AIChatProvider> */}
              {children}
              <BackgroundIframe />
              <Toaster />
              {/* <AIChatWidget /> */}
              {/* </AIChatProvider> */}
            </AppStateProvider>
          </AuthorizationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
