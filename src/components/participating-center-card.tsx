'use client'

import {
  Building2,
  Facebook,
  GraduationCap,
  Instagram,
  Link as LinkIcon,
  Linkedin,
  Twitter,
  Youtube
} from 'lucide-react'
import { useState } from 'react'

import { Card, CardTitle } from '@/components/ui/card'
import { ParticipatingCenter } from '@/data/participating-centers'
import { cn } from '@/lib/utils'

interface ParticipatingCenterCardProps {
  center: ParticipatingCenter
}

const SOCIAL_ICONS: Record<string, typeof Youtube> = {
  youtube: Youtube,
  twitter: Twitter,
  facebook: Facebook,
  linkedin: Linkedin,
  instagram: Instagram,
  researchgate: GraduationCap
}

export function ParticipatingCenterCard({
  center
}: ParticipatingCenterCardProps) {
  const [logoFailed, setLogoFailed] = useState(false)

  const socialLinks = Object.entries(center.socialnetwork ?? {}).filter(
    ([, url]) => !!url
  )

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden border-muted/40 bg-contrast-background/70 shadow-none backdrop-blur-sm">
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted/30">
            {center.logo && !logoFailed ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={center.logo}
                alt={`${center.label} logo`}
                className="h-full w-full object-contain p-1.5"
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <Building2 className="h-7 w-7 text-muted-foreground" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <CardTitle className="text-foreground">
              <span className="block truncate text-base font-semibold leading-tight">
                {center.label}
              </span>
            </CardTitle>
            <span className="mt-0.5 block truncate text-xs font-medium text-muted-foreground">
              {center.pi}
            </span>
            <span className="mt-0.5 block truncate text-xs text-muted-foreground">
              {center.city}, {center.country}
            </span>
          </div>
        </div>

        {center.description && (
          <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">
            {center.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-muted-foreground">
          <div className="flex min-w-0 items-center gap-2 text-xs font-semibold">
            <a
              href={center.website}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-accent hover:underline"
            >
              Website
            </a>
          </div>

          {socialLinks.length > 0 && (
            <div className="flex shrink-0 items-center gap-2">
              {socialLinks.map(([platform, url]) => {
                const Icon = SOCIAL_ICONS[platform] ?? LinkIcon
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${center.label} on ${platform}`}
                    className={cn('transition-colors hover:text-accent')}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
