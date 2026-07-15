'use client'

import { Building2, Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { errorToast } from '@/components/error-toast'
import { toast } from '@/components/hooks/use-toast'
import { OrganizationCard } from '@/components/organization-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Organization } from '@/domain/model'
import { countryName } from '@/lib/countries'
import {
  organizationList,
  organizationLogoDataUrl,
  organizationLogoGet
} from '@/view-model/organization-view-model'

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [logos, setLogos] = useState<Record<string, string | undefined>>({})
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    organizationList().then((result) => {
      if (result.error) {
        toast({ ...errorToast(result.error), variant: 'destructive' })
        return
      }

      const orgs = result.data ?? []
      setOrganizations(orgs)

      Promise.all(
        orgs.map(async (organization) => {
          const logoResult = await organizationLogoGet(organization.id)
          return [
            organization.id,
            organizationLogoDataUrl(logoResult.data)
          ] as const
        })
      ).then((entries) => setLogos(Object.fromEntries(entries)))
    })
  }, [])

  const stats = useMemo(() => {
    const countries = new Set(
      organizations.map((o) => o.country).filter(Boolean)
    )
    const cities = new Set(organizations.map((o) => o.city).filter(Boolean))
    return {
      total: organizations.length,
      countries: countries.size,
      cities: cities.size
    }
  }, [organizations])

  const filteredOrganizations = useMemo(() => {
    if (!searchQuery.trim()) return organizations

    const query = searchQuery.toLowerCase()
    return organizations.filter(
      (o) =>
        o.name.toLowerCase().includes(query) ||
        (o.city ?? '').toLowerCase().includes(query) ||
        (o.country ? countryName(o.country) : '').toLowerCase().includes(query)
    )
  }, [organizations, searchQuery])

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between gap-3">
          <h2 className="mb-5 mt-5 flex w-full flex-row items-center gap-3 text-start">
            <Building2 className="h-9 w-9" />
            Organizations
          </h2>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: 'Institutions', value: stats.total },
          { label: 'Countries', value: stats.countries },
          { label: 'Cities', value: stats.cities }
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-muted/40 bg-contrast-background/70 p-4 text-center backdrop-blur-sm"
          >
            <div className="text-2xl font-bold text-accent">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="w-full space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, country, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {filteredOrganizations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            {searchQuery ? (
              <>
                <Search className="mb-4 h-12 w-12 opacity-50" />
                <p className="text-lg font-medium">
                  No organizations match &quot;{searchQuery}&quot;
                </p>
                <Button
                  onClick={() => setSearchQuery('')}
                  variant="outline"
                  className="mt-4"
                >
                  Clear search
                </Button>
              </>
            ) : (
              <>
                <Building2 className="mb-4 h-12 w-12 opacity-50" />
                <p className="text-lg font-medium">No organizations yet</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filteredOrganizations.map((organization) => (
              <OrganizationCard
                key={organization.id}
                organization={organization}
                logo={logos[organization.id]}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
