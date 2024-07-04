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
