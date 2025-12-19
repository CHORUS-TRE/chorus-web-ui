import '@/app/build.css'
import '@/styles/globals.css'

import { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import Script from 'next/script'
import { PublicEnvScript } from 'next-runtime-env'
import { env } from 'next-runtime-env'
import React from 'react'

import { AppStateInitializer } from '@/components/app-state-initializer'
import { AuthenticationProvider } from '@/providers/authentication-provider'
import { InstanceConfigInitializer } from '@/providers/global-config-provider'
import { IframeCacheProvider } from '@/providers/iframe-cache-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import { DynamicThemeApplicator } from '~/components/dynamic-theme-applicator'
import IframeCacheRenderer from '~/components/iframe-cache-renderer'
import { IframeCleanupDialog } from '~/components/iframe-cleanup-dialog'
import { IframeDebugPanel } from '~/components/iframe-debug-panel'
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
    <html lang="en" suppressHydrationWarning>
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
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          <InstanceConfigInitializer>
            <DynamicThemeApplicator />
            <AuthenticationProvider>
              <AuthorizationProvider>
                <AppStateInitializer />
                <IframeCacheProvider>
                  {children}
                  <IframeCacheRenderer />
                  <IframeCleanupDialog />
                  <IframeDebugPanel />
                </IframeCacheProvider>
              </AuthorizationProvider>
            </AuthenticationProvider>
          </InstanceConfigInitializer>
        </ThemeProvider>
      </body>
    </html>
  )
}
