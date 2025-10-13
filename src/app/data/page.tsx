'use client'

import { Database, Package } from 'lucide-react'
import Link from 'next/link'

import { useAppState } from '@/providers/app-state-provider'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '~/components/ui/accordion'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '~/components/ui/breadcrumb'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { useAuthentication } from '~/providers/authentication-provider'

export default function DataPage() {
  const { workspaces } = useAppState()
  const { user } = useAuthentication()

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

      <Accordion
        type="multiple"
        defaultValue={['my-workspaces-data', 'public-chuv-data']}
        className="w-full"
      >
        <AccordionItem value="my-workspaces-data" className="border-b-0">
          <AccordionTrigger className="text-white hover:no-underline [&>svg]:text-white [&>svg]:opacity-100">
            <div className="text-lg font-semibold text-white">
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
                ?.filter((workspace) => workspace.userId === user?.id)
                .map((w) => (
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
              {!workspaces?.filter((workspace) => workspace.userId === user?.id)
                .length && (
                <div className="text-muted">No workspaces found.</div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="all-workspaces-data" className="border-b-0">
          <AccordionTrigger className="text-white hover:no-underline [&>svg]:text-white [&>svg]:opacity-100">
            <div className="text-lg font-semibold text-white">
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
              {!workspaces?.filter((workspace) => workspace.userId === user?.id)
                .length && (
                <div className="text-muted">No workspaces found.</div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="public-chuv-data" className="border-b-0">
          <AccordionTrigger className="text-white hover:no-underline [&>svg]:text-white [&>svg]:opacity-100">
            <div className="text-lg font-semibold text-white">
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}
