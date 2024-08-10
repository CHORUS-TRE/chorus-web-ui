'use server'

import WorkbenchTable from '@/components/workbench-table.server'

import DashboardWidgets from '~/components/dashboard-widgets'
// mport { Bar, BarChart, Rectangle, XAxis } from 'recharts'
import WorkspaceTable from '~/components/workspace-table.server'
// import { ChartContainer } from '~/components/ui/chart'

export default async function Portal() {
  return (
    <>
      <h2 className="mb-4 mt-5 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Dashboard
      </h2>
      {/* {error && <p className="mt-4 text-red-500">{error}</p>} */}
      <div className="flex flex-1 flex-row content-start justify-between">
        <main>
          <WorkbenchTable />
          <WorkspaceTable />
        </main>
        <aside className="flex flex-col flex-wrap items-start gap-6">
          <DashboardWidgets />
        </aside>
      </div>
    </>
  )
  // return (
  //   {/* <ErrorBoundary> */ }
  // {/* </ErrorBoundary> *}
}
