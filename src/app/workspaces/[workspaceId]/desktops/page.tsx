'use server'

type Params = Promise<{ workspaceId: string }>

import { use } from 'react'

import WorkbenchTable from '~/components/workbench-table'

export default async function Page(props: { params: Params }) {
  const params = use(props.params)
  const workspaceId = params.workspaceId

  return (
    <div className="flex flex-col">
      {workspaceId && (
        <WorkbenchTable workspaceId={workspaceId} title="Desktops" />
      )}
    </div>
  )
}
