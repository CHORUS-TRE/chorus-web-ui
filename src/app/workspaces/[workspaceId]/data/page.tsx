import FileManagerClient from './file-manager-client'

interface FileManagerProps {
  params: Promise<{
    workspaceId: string
  }>
}

export default async function FileManager({ params }: FileManagerProps) {
  const { workspaceId } = await params

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-muted-foreground">
            Workspace Data
          </h1>
          <p className="mb-8 text-muted-foreground">Manage your data</p>
        </div>
      </div>

      <FileManagerClient workspaceId={workspaceId} />
    </div>
  )
}
