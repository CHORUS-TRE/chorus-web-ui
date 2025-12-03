'use client'

import { Database, Package } from 'lucide-react'

import { Link } from '@/components/link'
import { useAppState } from '@/providers/app-state-provider'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/card'
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
                  <Card
                    key={`workspace-data-${w.id}`}
                    className="card-glass rounded-2xl"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="">{w.name}</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {/* {users?.find((user) => user.id === w.userId)?.firstName}{' '}
                        {users?.find((user) => user.id === w.userId)?.lastName} */}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href={`/workspaces/${w.id}/data`} variant="nav">
                        View data for this workspace
                      </Link>
                    </CardContent>
                  </Card>
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
                  <Card
                    key={`workspace-data-${w.id}`}
                    className="card-glass rounded-2xl"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="">{w.name}</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {/* {users?.find((user) => user.id === w.userId)?.firstName}{' '}
                        {users?.find((user) => user.id === w.userId)?.lastName} */}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href={`/workspaces/${w.id}/data`} variant="nav">
                        View data for this workspace
                      </Link>
                    </CardContent>
                  </Card>
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
                <Card
                  key={`public-data-${d.id}`}
                  className="card-glass rounded-2xl"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="">{d.name}</CardTitle>
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
