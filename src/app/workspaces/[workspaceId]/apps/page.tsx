'use server'

import WorkbenchTable from '~/components/workbench-table'

import WorkspaceHeader from '../../header'

export default async function Page({
  params,
  searchParams
}: {
  params: { appId: string; workspaceId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const workspaceId = params?.workspaceId

  return (
    <div className="flex flex-col">
      <WorkspaceHeader />
      {workspaceId && <WorkbenchTable workspaceId={workspaceId} />}
    </div>
  )
}
