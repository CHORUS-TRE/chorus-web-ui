'use server'

import WorkbenchTable from '~/components/workbench-table'

export default async function Page() {
  return (
    <div className="flex flex-col">
      <WorkbenchTable />
    </div>
  )
}
