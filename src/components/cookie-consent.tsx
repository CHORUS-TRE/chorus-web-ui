'use client'

import { CookieIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { USER_CONFIG_KEYS } from '@/domain/model/user-config'
import { cn } from '@/lib/utils'
import { useDevStoreCache } from '@/stores/dev-store-cache'

export const CookieConsent = () => {
  const {
    getUser,
    setUser,
    isUserLoaded,
    isCookieConsentOpen,
    setCookieConsentOpen
  } = useDevStoreCache()

  const consent = getUser(USER_CONFIG_KEYS.COOKIE_CONSENT)

  useEffect(() => {
    if (isUserLoaded && !consent) {
      setCookieConsentOpen(true)
    }
  }, [isUserLoaded, consent, setCookieConsentOpen])

  const onAccept = async () => {
    await setUser(USER_CONFIG_KEYS.COOKIE_CONSENT, 'true')
    setCookieConsentOpen(false)

    // Trigger Matomo
    if (window._paq) {
      window._paq.push(['rememberConsentGiven'])
    }
  }

  const onDecline = async () => {
    await setUser(USER_CONFIG_KEYS.COOKIE_CONSENT, 'false')
    setCookieConsentOpen(false)

    // Matomo decline logic (if we want to be explicit)
    if (window._paq) {
      window._paq.push(['forgetConsentGiven'])
    }
  }

  if (!isCookieConsentOpen) {
    return null
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-[100] p-4 transition-all duration-700 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md',
        isCookieConsentOpen
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-8 opacity-0'
      )}
    >
      <div className="rounded-xl border border-border bg-background p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="hidden rounded-full bg-primary/10 p-2 sm:block">
            <CookieIcon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 space-y-3">
            <h3 className="text-lg font-semibold tracking-tight">
              We use cookies
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              We use cookies to analyze our traffic and improve your experience.
              By clicking &quot;Accept&quot;, you consent to our use of cookies.
              See our{' '}
              <Link
                href="/privacy-policy"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4 transition-colors hover:text-primary"
              >
                Privacy Policy
              </Link>{' '}
              for more information.
            </p>
            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={onDecline}
                className="w-full sm:w-auto"
              >
                Decline
              </Button>
              <Button onClick={onAccept} className="w-full sm:w-auto">
                Accept
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
