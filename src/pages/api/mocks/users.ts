import { UserDBEntity } from '../users/user-db-entity'

export const users: UserDBEntity[] = [
  {
    id: '1',
    name: 'John Doe',
    username: 'johndoe',
    email: 'johndoe@test.com',
    workspaceIds: ['1', '2']
  },
  {
    id: '2',
    name: 'Jane Smith',
    username: 'janesmith',
    email: 'janesmith@test.com',
    workspaceIds: ['3']
  },
  {
    id: '3',
    name: 'Bob Johnson',
    username: 'bobjohnson',
    email: 'bobjohnson@test.com',
    workspaceIds: ['1']
  }
]
