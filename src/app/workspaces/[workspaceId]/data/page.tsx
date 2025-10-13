import FileManagerClient from './file-manager-client'

interface FileManagerProps {
  params: Promise<{
    workspaceId: string
  }>
}

export default async function FileManager({ params }: FileManagerProps) {
  const { workspaceId } = await params

  return <FileManagerClient workspaceId={workspaceId} />
}
