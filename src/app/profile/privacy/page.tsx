'use client'

import {
  CheckCircle2,
  Cookie,
  HelpCircle,
  Sparkles,
  XCircle
} from 'lucide-react'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { USER_CONFIG_KEYS } from '@/domain/model/user-config'
import { useAuthentication } from '@/providers/authentication-provider'
import { useDevStoreCache } from '@/stores/dev-store-cache'
import { getCurrentTermsOfUseVersion } from '@/view-model/terms-of-use-view-model'

export default function PrivacySettingsPage() {
  const {} = useAuthentication()
  const { getUser, setCookieConsentOpen } = useDevStoreCache()
  const [touContent, setTouContent] = useState<string | null>(null)

  useEffect(() => {
    getCurrentTermsOfUseVersion().then((result) => {
      if (result.data?.content) setTouContent(result.data.content)
    })
  }, [])

  const handleManageCookies = () => {
    setCookieConsentOpen(true)
  }

  const consent = getUser(USER_CONFIG_KEYS.COOKIE_CONSENT)

  const getStatusDisplay = () => {
    if (consent === 'true') {
      return (
        <Badge
          variant="outline"
          className="gap-1.5 border-green-500/20 bg-green-500/10 px-3 py-1 text-green-500"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Accepted
        </Badge>
      )
    }
    if (consent === 'false') {
      return (
        <Badge
          variant="outline"
          className="gap-1.5 border-red-500/20 bg-red-500/10 px-3 py-1 text-red-500"
        >
          <XCircle className="h-3.5 w-3.5" />
          Declined
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="gap-1.5 px-3 py-1">
        <HelpCircle className="h-3.5 w-3.5" />
        Not Configured
      </Badge>
    )
  }

  return (
    <div className="">
      <Card className="border-bg mb-4 overflow-hidden border bg-card shadow-md">
        <CardHeader className="pb-6">
          <div className="mb-1 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Data Collection
            </span>
          </div>
          <CardTitle>Usage Analytics</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            We use anonymized analytics to improve our services and understand
            how you use the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <Label
                  htmlFor="tracking-toggle"
                  className="text-base font-semibold"
                >
                  Cookies Consent
                </Label>
                {getStatusDisplay()}
              </div>
              <p className="text-sm text-muted-foreground">
                We use cookies to analyze our traffic and improve your
                experience, by collecting anonymized data about your navigation
                and feature usage. This helps us prioritize improvements and fix
                bugs faster. When enabled, you consent to our use of cookies.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleManageCookies}
              className="flex items-center gap-2"
            >
              <Cookie className="h-4 w-4" />
              Manage Consent
            </Button>
          </div>
        </CardContent>
      </Card>

      {touContent && (
        <Card className="border-bg overflow-hidden border bg-card shadow-md">
          <CardHeader className="mb-4 pb-6">
            <div className="mb-1 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                Privacy Policy
              </span>
            </div>
            <CardTitle>Terms of Use</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Below is the current version of our Terms of Use you agreed to
              when you accepted the terms.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80 rounded border p-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{touContent}</ReactMarkdown>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
