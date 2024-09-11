'use server'

import WorkspaceTable from '~/components/workspace-table'

export default async function Page() {
  return (
    <div className="flex flex-col">
      <WorkspaceTable />
    </div>
  )
}
