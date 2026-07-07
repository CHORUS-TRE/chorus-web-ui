'use client'

import { Building2, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { ParticipatingCenterCard } from '@/components/participating-center-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { participatingCenters } from '@/data/participating-centers'

export default function ParticipatingCentersPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const stats = useMemo(() => {
    const countries = new Set(participatingCenters.map((c) => c.country))
    const cities = new Set(participatingCenters.map((c) => c.city))
    const activeCommunities = participatingCenters.filter(
      (c) => c.community?.url
    ).length
    return {
      total: participatingCenters.length,
      countries: countries.size,
      cities: cities.size,
      activeCommunities
    }
  }, [])

  const filteredCenters = useMemo(() => {
    if (!searchQuery.trim()) return participatingCenters

    const query = searchQuery.toLowerCase()
    return participatingCenters.filter(
      (c) =>
        c.label.toLowerCase().includes(query) ||
        c.pi.toLowerCase().includes(query) ||
        c.country.toLowerCase().includes(query) ||
        c.city.toLowerCase().includes(query)
    )
  }, [searchQuery])

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between gap-3">
          <h2 className="mb-5 mt-5 flex w-full flex-row items-center gap-3 text-start">
            <Building2 className="h-9 w-9" />
            Participating Centers
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
              placeholder="Search by name, PI, country, or city..."
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

        {filteredCenters.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Search className="mb-4 h-12 w-12 opacity-50" />
            <p className="text-lg font-medium">
              No centers match &quot;{searchQuery}&quot;
            </p>
            <Button
              onClick={() => setSearchQuery('')}
              variant="outline"
              className="mt-4"
            >
              Clear search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filteredCenters.map((center) => (
              <ParticipatingCenterCard key={center.id} center={center} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
