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
}

interface AppCard {
  id: string
  name: string
  description: string
  version: string
  icon: LucideIcon
  color: string
}

const FALLBACK_APPS: AppCard[] = [
  {
    id: 'rstudio',
    name: 'RStudio Server',
    description: 'Statistical computing & R IDE.',
    version: 'v2024.04',
    icon: LineChart,
    color: 'bg-[rgba(102,239,255,0.13)] text-[#66EFFF]'
  },
  {
    id: 'jupyter',
    name: 'Jupyter Lab',
    description: 'Python notebooks & data science.',
    version: 'v4.1',
    icon: Code2,
    color: 'bg-[rgba(245,158,11,0.13)] text-[#FBBF24]'
  },
  {
    id: 'fsleyes',
    name: 'FSLeyes',
    description: 'MRI & neuroimaging viewer.',
    version: 'v1.10',
    icon: Globe,
    color: 'bg-[rgba(171,165,245,0.16)] text-[#ABA5F5]'
  },
  {
    id: 'matlab',
    name: 'MATLAB',
    description: 'Numerical computing suite.',
    version: 'R2024a',
    icon: Layers,
    color: 'bg-[rgba(255,255,255,0.06)] text-[#c8c8c8]'
  },
  {
    id: 'vscode',
    name: 'VS Code',
    description: 'Code editor with extensions.',
    version: 'v1.89',
    icon: Terminal,
    color: 'bg-[rgba(255,255,255,0.06)] text-[#c8c8c8]'
  },
  {
    id: 'dbeaver',
    name: 'DBeaver',
    description: 'SQL & database client.',
    version: 'v24.0',
    icon: Database,
    color: 'bg-[rgba(255,255,255,0.06)] text-[#c8c8c8]'
  }
]

const CATEGORIES = ['All', 'Statistics', 'Imaging', 'Notebooks']

export function StepApps({ onNext, onBack }: StepAppsProps) {
  const [selectedApps, setSelectedApps] = useState<Set<string>>(
    new Set(['rstudio', 'jupyter', 'fsleyes'])
  )
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const storeApps = useAppState((s) => s.apps)

  const appCards: AppCard[] = useMemo(() => {
    if (storeApps && storeApps.length > 0) {
      return storeApps.map((app, i) => ({
        id: app.id,
        name: app.name,
        description: app.description ?? '',
        version: app.version ?? '',
        icon: FALLBACK_APPS[i % FALLBACK_APPS.length].icon,
        color: FALLBACK_APPS[i % FALLBACK_APPS.length].color
      }))
    }
    return FALLBACK_APPS
  }, [storeApps])

  const filtered = appCards.filter(
    (app) =>
      !searchQuery || app.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleApp = (id: string) => {
    setSelectedApps((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <>
      <div className="mb-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8a8a8a]">
        Step 5 of 6
      </div>
      <h2 className="mb-3 text-[34px] font-medium tracking-[-0.02em]">
        Pick your apps for this session
      </h2>
      <p className="mb-[22px] max-w-[580px] text-[14.5px] leading-[1.6] text-[#B8B8B8]">
        Choose the tools you want available when your first session starts. You
        can always add more later.
      </p>

      {/* Search + categories */}
      <div className="mb-4 flex items-center gap-2.5">
        <div className="relative max-w-[300px] flex-1">
          <div className="flex h-[34px] items-center rounded-lg border border-[#333] bg-[#1a1a1a] pl-8 pr-3 text-[12.5px] text-[#6a6a6a]">
            <input
              type="text"
              placeholder="Search the App Store…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-[12.5px] text-[#FAFAFA] placeholder:text-[#6a6a6a] focus:outline-none"
            />
          </div>
          <Search className="absolute left-[11px] top-[11px] h-[13px] w-[13px] text-[#8a8a8a]" />
        </div>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full border px-[13px] py-1.5 text-xs transition-colors ${
              activeCategory === cat
                ? 'border-[rgba(71,122,255,0.4)] bg-[rgba(71,122,255,0.2)] text-[#8FB0FF]'
                : 'border-[#3a3a3a] text-[#9a9a9a]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* App grid */}
      <div className="grid min-h-0 flex-1 grid-cols-3 content-start gap-3">
        {filtered.map((app) => {
          const isAdded = selectedApps.has(app.id)
          return (
            <div
              key={app.id}
              onClick={() => toggleApp(app.id)}
              className={`flex cursor-pointer flex-col rounded-xl p-[15px] transition-all ${
                isAdded
                  ? 'border-[1.5px] border-[rgba(182,255,18,0.4)] bg-[rgba(182,255,18,0.06)]'
                  : 'border border-[rgba(255,255,255,0.09)] bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.2)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-[9px] ${app.color}`}
                >
                  <app.icon className="h-[19px] w-[19px]" />
                </div>
              </div>
              <div className="mt-3 text-[13.5px] font-medium">{app.name}</div>
              <div className="mt-[3px] flex-1 text-[11.5px] leading-[1.45] text-[#9a9a9a]">
                {app.description}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-mono text-[10.5px] text-[#7a7a7a]">
                  {app.version}
                </span>
                {isAdded ? (
                  <span className="inline-flex items-center gap-[5px] text-xs font-medium text-[#B6FF12]">
                    <Check className="h-[13px] w-[13px]" strokeWidth={2.6} />
                    Added
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#3a3a3a] px-[11px] py-1 text-[11.5px] text-[#c8c8c8]">
                    <Plus className="h-3 w-3" strokeWidth={2.2} />
                    Add
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-5 flex items-center gap-3.5">
        <button
          onClick={onBack}
          className="rounded-[7px] border border-[#3a3a3a] bg-transparent px-[18px] py-2.5 text-[13.5px] text-[#9a9a9a] transition-colors hover:border-[#5a5a5a] hover:text-[#c8c8c8]"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="inline-flex items-center gap-1.5 rounded-[7px] bg-[#477AFF] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:bg-[#5A8AFF]"
        >
          Continue
          <ArrowRight className="h-[15px] w-[15px]" />
        </button>
        <span className="ml-1 text-xs text-[#7a7a7a]">
          {selectedApps.size} apps added · Step 5 of 6
        </span>
      </div>
    </>
  )
}
