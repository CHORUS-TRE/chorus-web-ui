export interface Workspace {
  id: string
  name: string
  shortName: string
  description: string
  memberIds: string[]
  ownerId: string
  tags: string[]

  createdAt: Date
  updatedAt: Date
  archivedAt: Date

  workbenchIds: string[]
  serviceIds: string[]
}

export interface WorkspaceResponse extends Workspace {}
export interface WorkspaceCreateParams {
  name: string
  shortName: string
  description: string
  ownerId: string
  tags: string[]
}
