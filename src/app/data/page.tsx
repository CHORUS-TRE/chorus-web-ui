'use client'

import { Database, Package } from 'lucide-react'

import { Link } from '@/components/link'
import { useAppState } from '@/stores/app-state-store'
import { StatCard } from '~/components/dashboard/stat-card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '~/components/ui/accordion'
import { useAuthentication } from '~/providers/authentication-provider'

export default function DataPage() {
  const { workspaces } = useAppState()
  const { user } = useAuthentication()

  const publicChuvData = [
    {
      id: 'clinical-trials',
      name: 'CHUV Clinical Trials (public)',
      href: '/public-data/clinical-trials'
    },
    {
      id: 'publications',
      name: 'CHUV Publications (open access)',
      href: '/public-data/publications'
    },
    {
      id: 'biostats',
      name: 'Aggregated Biostatistics (de-identified)',
      href: '/public-data/biostats'
    }
  ]

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between gap-3">
          <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start">
            <Database className="h-9 w-9" />
            Data
          </h2>
        </div>
      </div>

      <Accordion
        type="multiple"
        defaultValue={['my-workspaces-data', 'public-chuv-data']}
        className="w-full"
      >
        <AccordionItem value="my-workspaces-data" className="border-b-0">
          <AccordionTrigger className="text-muted hover:text-accent hover:no-underline [&>svg]:text-muted [&>svg]:opacity-100">
            <div className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <Package className="h-6 w-6" />
                <div>My Workspaces Data</div>
              </div>
              <p className="text-sm font-normal text-muted">
                Access data from your workspaces
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="border-b-0">
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
              {workspaces
                ?.filter((workspace) =>
                  user?.rolesWithContext?.some(
                    (role) => role.context.workspace === workspace.id
                  )
                )
                .map((w) => (
                  <StatCard
                    key={`workspace-data-${w.id}`}
                    href={`/workspaces/${w.id}/data`}
                    title={w.name}
                    description="View data for this workspace"
                  />
                ))}
              {!workspaces?.filter((workspace) =>
                user?.rolesWithContext?.some(
                  (role) => role.context.workspace === workspace.id
                )
              ).length && (
                  <div className="text-muted">No workspaces found.</div>
                )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="all-workspaces-data" className="border-b-0">
          <AccordionTrigger className="text-muted hover:text-accent hover:no-underline [&>svg]:text-muted [&>svg]:opacity-100">
            <div className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <Package className="h-6 w-6" />
                <div>All Workspaces Data</div>
              </div>
              <p className="text-sm font-normal text-muted">
                See data used in all workspaces
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="border-b-0">
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
              {workspaces
                ?.filter((workspace) => workspace.userId !== user?.id)
                .map((w) => (
                  <StatCard
                    key={`workspace-data-${w.id}`}
                    href={`/workspaces/${w.id}/data`}
                    title={w.name}
                    description="View data for this workspace"
                  />
                ))}
              {!workspaces?.filter((workspace) =>
                user?.rolesWithContext?.some(
                  (role) => role.context.workspace === workspace.id
                )
              ).length && (
                  <div className="text-muted">No workspaces found.</div>
                )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="public-chuv-data" className="border-b-0">
          <AccordionTrigger className="text-muted hover:text-accent hover:no-underline [&>svg]:text-muted [&>svg]:opacity-100">
            <div className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <Database className="h-6 w-6" />
                <div>Public CHUV Data</div>
              </div>
              <p className="text-sm font-normal text-muted">
                Explore publicly available CHUV datasets
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="border-b-0">
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
              {publicChuvData.map((d) => (
                <StatCard
                  key={`public-data-${d.id}`}
                  href={d.href}
                  title={d.name}
                  description="Explore"
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}
