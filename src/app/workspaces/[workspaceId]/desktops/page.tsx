'use server'

import WorkbenchTable from '~/components/workbench-table'

export default async function Page({
  params
}: {
  params: { desktopId: string; workspaceId: string }
}) {
  const workspaceId = params?.workspaceId

  return (
    <div className="flex flex-col">
      {workspaceId && (
        <WorkbenchTable workspaceId={workspaceId} title="Desktops" />
      )}
    </div>
  )
}
