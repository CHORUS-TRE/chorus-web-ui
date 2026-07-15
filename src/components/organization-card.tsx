'use client'

import { Building2 } from 'lucide-react'

import { Card, CardTitle } from '@/components/ui/card'
import { Organization } from '@/domain/model'
import { countryName } from '@/lib/countries'

interface OrganizationCardProps {
  organization: Organization
  logo?: string
}

export function OrganizationCard({
  organization,
  logo
}: OrganizationCardProps) {
  const location = [
    organization.city,
    organization.country ? countryName(organization.country) : undefined
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden border-muted/40 bg-contrast-background/70 shadow-none backdrop-blur-sm">
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted/30">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt={`${organization.name} logo`}
                className="h-full w-full object-contain p-1.5"
              />
            ) : (
              <Building2 className="h-7 w-7 text-muted-foreground" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <CardTitle className="text-foreground">
              <span className="block truncate text-base font-semibold leading-tight">
                {organization.name}
              </span>
            </CardTitle>
            {location && (
              <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                {location}
              </span>
            )}
          </div>
        </div>

        {organization.description && (
          <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">
            {organization.description}
          </p>
        )}

        {organization.websiteUrl && (
          <div className="mt-auto flex items-center gap-2 pt-4 text-xs font-semibold text-muted-foreground">
            <a
              href={organization.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-accent hover:underline"
            >
              Website
            </a>
          </div>
        )}
      </div>
    </Card>
  )
}
