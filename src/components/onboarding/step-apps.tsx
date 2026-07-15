'use client'

import {
  ArrowRight,
  Check,
  Code2,
  Database,
  Globe,
  Layers,
  LineChart,
  Plus,
  Search,
  Terminal
} from 'lucide-react'
import { type LucideIcon } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useAppState } from '@/stores/app-state-store'

interface StepAppsProps {
  onNext: () => void
  onBack: () => void
  selectedAppIds: string[]
  onSelectionChange: (ids: string[]) => void
}

interface AppCard {
  id: string
  name: string
  description: string
  version: string
  icon: LucideIcon
  color: string
}

// Presentation-only presets cycled across the real apps (no fake/fallback apps)
const ICON_PRESETS: LucideIcon[] = [
  LineChart,
  Code2,
  Globe,
  Layers,
  Terminal,
  Database
]
const COLOR_PRESETS: string[] = [
  'bg-cyan-500/10 text-cyan-700 dark:bg-[rgba(102,239,255,0.13)] dark:text-[#66EFFF]',
  'bg-amber-500/10 text-amber-700 dark:bg-[rgba(245,158,11,0.13)] dark:text-[#FBBF24]',
  'bg-violet-500/10 text-violet-700 dark:bg-[rgba(171,165,245,0.16)] dark:text-[#ABA5F5]',
  'bg-lime-500/10 text-lime-700 dark:bg-[rgba(182,255,18,0.14)] dark:text-[#B6FF12]',
  'bg-blue-500/10 text-blue-600 dark:bg-[rgba(110,151,255,0.16)] dark:text-[#6E97FF]',
  'bg-muted/30 text-muted-foreground dark:bg-[rgba(255,255,255,0.06)] dark:text-[#c8c8c8]'
]

export function StepApps({
  onNext,
  onBack,
  selectedAppIds,
  onSelectionChange
}: StepAppsProps) {
  const selectedApps = new Set(selectedAppIds)
  const [searchQuery, setSearchQuery] = useState('')

  const storeApps = useAppState((s) => s.apps)

  const appCards: AppCard[] = useMemo(() => {
    return (storeApps ?? []).map((app, i) => ({
      id: app.id,
      name: app.name,
      description: app.description ?? '',
      version: app.dockerImageTag ?? '',
      icon: ICON_PRESETS[i % ICON_PRESETS.length],
      color: COLOR_PRESETS[i % COLOR_PRESETS.length]
    }))
  }, [storeApps])

  const filtered = appCards.filter(
    (app) =>
      !searchQuery || app.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleApp = (id: string) => {
    if (selectedApps.has(id)) {
      onSelectionChange(selectedAppIds.filter((x) => x !== id))
    } else {
      onSelectionChange([...selectedAppIds, id])
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        Step 4 of 5
      </div>
      <h2 className="mb-3 text-[34px] font-medium tracking-[-0.02em]">
        Pick your apps for this session
      </h2>
      <p className="mb-[22px] max-w-[580px] text-[14.5px] leading-[1.6] text-muted-foreground">
        Choose the tools you want available when your first session starts. You
        can always add more later.
      </p>

      {/* Search */}
      <div className="mb-4 flex items-center gap-2.5">
        <div className="relative max-w-[300px] flex-1">
          <div className="flex h-[34px] items-center rounded-lg border border-border bg-muted pl-8 pr-3 text-[12.5px] text-muted-foreground">
            <input
              type="text"
              placeholder="Search the App Store…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-[12.5px] text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <Search className="absolute left-[11px] top-[11px] h-[13px] w-[13px] text-muted-foreground" />
        </div>
      </div>

      {/* App grid (scrolls; footer below stays fixed) */}
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-3 content-start gap-3 pb-2">
            {filtered.map((app) => {
              const isAdded = selectedApps.has(app.id)
              return (
                <div
                  key={app.id}
                  onClick={() => toggleApp(app.id)}
                  className={`flex cursor-pointer flex-col rounded-xl p-[15px] transition-all ${
                    isAdded
                      ? 'border-[1.5px] border-accent/40 bg-accent/5'
                      : 'border border-muted/40 bg-muted/10 hover:border-muted-foreground/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-[9px] ${app.color}`}
                    >
                      <app.icon className="h-[19px] w-[19px]" />
                    </div>
                  </div>
                  <div className="mt-3 text-[13.5px] font-medium">
                    {app.name}
                  </div>
                  <div className="mt-[3px] flex-1 text-[11.5px] leading-[1.45] text-muted-foreground">
                    {app.description}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-mono text-[10.5px] text-muted-foreground/70">
                      {app.version}
                    </span>
                    {isAdded ? (
                      <span className="inline-flex items-center gap-[5px] text-xs font-medium text-accent">
                        <Check
                          className="h-[13px] w-[13px]"
                          strokeWidth={2.6}
                        />
                        Added
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-muted-foreground/30 px-[11px] py-1 text-[11.5px] text-muted-foreground">
                        <Plus className="h-3 w-3" strokeWidth={2.2} />
                        Add
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-[13px] text-muted-foreground">
            {appCards.length === 0
              ? 'No apps are available yet.'
              : 'No apps match your search.'}
          </div>
        )}
      </div>

      {/* Fixed footer */}
      <div className="mt-4 flex flex-none items-center gap-3.5 border-t border-border pt-4">
        <button
          onClick={onBack}
          className="px-2 py-[11px] text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="inline-flex items-center gap-1.5 rounded-full border border-accent px-[22px] py-[11px] text-sm font-medium text-accent transition-all hover:gap-2.5"
        >
          Continue
          <ArrowRight className="h-[15px] w-[15px]" />
        </button>
        <span className="ml-1 text-xs text-muted-foreground/70">
          {selectedAppIds.length} apps added · Step 4 of 5
        </span>
      </div>
    </div>
  )
}
