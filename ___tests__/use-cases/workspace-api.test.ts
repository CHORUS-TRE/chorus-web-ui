/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { WorkspaceRepositoryImpl } from '~/data/repository'
import { WorkspaceGet } from '~/domain/use-cases/workspace/workspace-get'
import { WorkspacesList } from '~/domain/use-cases/workspace/workspaces-list'
import { Workspace, WorkspaceCreateModel } from '~/domain/model/'
import { ChorusWorkspace as ChorusWorkspaceApi } from '~/internal/client'
import { WorkspaceDataSourceImpl } from '~/data/data-source/chorus-api'
import { WorkspaceCreate } from '~/domain/use-cases'

const MOCK_API_RESPONSE = {
  id: '1',
  tenantId: '1',
  userId: '2',
  name: 'Study 101, a workspace for learning',
  shortName: '101',
  description: 'Study 101 is a test workspace to improve learning',
  status: 'active',
  createdAt: new Date('2024-07-17T12:30:54Z'),
  updatedAt: new Date('2024-07-17T12:30:54Z')
} as ChorusWorkspaceApi

const MOCK_WORKSPACE_RESULT = {
  id: '1',
  name: MOCK_API_RESPONSE.name,
  shortName: '101',
  description: 'Study 101 is a test workspace to improve learning',
  image: '',
  ownerId: '2',
  memberIds: ['2'],
  tags: [],
  status: 'active',
  workbenchIds: [],
  serviceIds: [],
  createdAt: new Date('2024-07-17T12:30:54Z'),
  updatedAt: new Date('2024-07-17T12:30:54Z'),
  archivedAt: undefined
} as Workspace

const MOCK_API_CREATE = {
  tenantId: '1',
  ownerId: '2',
  name: 'Study 101, a workspace for learning',
  shortName: '101',
  description: 'Study 101 is a test workspace to improve learning'
} as WorkspaceCreateModel

// Test case to get a workspace from the API and transform it to a domain model.
describe('WorkspaceUseCases', () => {
  it('should create a workspace', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            result: { id: '1' }
          }),
        status: 201,
        ok: true
      })
    ) as jest.Mock

    const session = 'empty'
    const dataSource = new WorkspaceDataSourceImpl(session)
    const repository = new WorkspaceRepositoryImpl(dataSource)
    const useCase = new WorkspaceCreate(repository)

    const response = await useCase.execute(MOCK_API_CREATE)

    // TODO: as the repository perform an extra get request to get the created workspace, we need to mock the get request
    expect(response.error).toEqual('Error fetching workspace')
    expect(response.data).toBeNull()
  })

  it('should get a workspace', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            result: {
              workspace: MOCK_API_RESPONSE
            }
          }),
        status: 200,
        ok: true
      })
    ) as jest.Mock

    const session = 'empty'
    const dataSource = new WorkspaceDataSourceImpl(session)
    const repository = new WorkspaceRepositoryImpl(dataSource)
    const useCase = new WorkspaceGet(repository)

    const response = await useCase.execute(MOCK_API_RESPONSE.id!)
    expect(response.error).toBeNull()

    const workspace = response.data
    expect(workspace).toBeDefined()
    expect(workspace).toMatchObject(MOCK_WORKSPACE_RESULT)
  })

  it('should get a list of workspaces', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            result: [MOCK_API_RESPONSE]
          }),
        status: 200,
        ok: true
      })
    ) as jest.Mock

    const session = 'empty'
    const dataSource = new WorkspaceDataSourceImpl(session)
    const repository = new WorkspaceRepositoryImpl(dataSource)
    const useCase = new WorkspacesList(repository)

    const response = await useCase.execute()
    expect(response.error).toBeNull()

    const workspaces = response.data
    expect(workspaces).toBeDefined()
    expect(workspaces).toMatchObject([MOCK_WORKSPACE_RESULT])
  })
})
