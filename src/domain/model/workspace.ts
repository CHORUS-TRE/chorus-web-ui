export interface Workspace {
  id: string
  name: string
  shortName: string
  description: string
  image: string
  ownerId: string[]
  memberIds: string[]
  tags: string[]

  workbenchIds: string[]
  serviceIds: string[]

  createdAt: Date
  updatedAt: Date
  archivedAt: Date
}

export interface WorkspaceResponse {
  data: Workspace | null
  error: Error | null
}

export interface WorkspacesResponse {
  data: Workspace[] | null
  error: Error | null
}
export interface WorkspaceCreate {
  name: string
  shortName: string
  description: string
  image: string
  ownerId: string
  memberIds: string[]
  tags: string[]
}
