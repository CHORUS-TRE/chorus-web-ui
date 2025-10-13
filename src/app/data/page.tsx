'use client'

import { Database, Package } from 'lucide-react'
import Link from 'next/link'

import { useAppState } from '@/providers/app-state-provider'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '~/components/ui/breadcrumb'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

export default function DataPage() {
  const { workspaces } = useAppState()

  const publicChuvData = [
    { id: 'clinical-trials', name: 'CHUV Clinical Trials (public)', href: '#' },
    { id: 'publications', name: 'CHUV Publications (open access)', href: '#' },
    {
      id: 'biostats',
      name: 'Aggregated Biostatistics (de-identified)',
      href: '#'
    }
  ]

  return (
    <>
      <div className="w-full">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">CHORUS</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Data</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between gap-3">
          <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start text-white">
            <Database className="h-9 w-9 text-white" />
            Data
          </h2>
        </div>
      </div>

      <div className="w-full space-y-10">
        {/* Workspaces data links */}
        <section>
          <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <Package className="h-6 w-6" />
            <div>My Workspaces Data</div>
          </div>
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
            {workspaces?.map((w) => (
              <Card
                key={`workspace-data-${w.id}`}
                className="rounded-2xl border-muted/40 bg-background/60 text-white"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-white">{w.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link
                    href={`/workspaces/${w.id}/data`}
                    className="text-accent underline-offset-4 hover:underline"
                  >
                    View data for this workspace
                  </Link>
                </CardContent>
              </Card>
            ))}
            {!workspaces?.length && (
              <div className="text-muted">No workspaces found.</div>
            )}
          </div>
        </section>

        {/* Public CHUV data */}
        <section>
          <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <Database className="h-6 w-6" />
            <div>Public CHUV Data</div>
          </div>
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
            {publicChuvData.map((d) => (
              <Card
                key={`public-data-${d.id}`}
                className="rounded-2xl border-muted/40 bg-background/60 text-white"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-white">{d.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={d.href}
                    className="text-accent underline-offset-4 hover:underline"
                  >
                    Explore
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
