/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'

import { WorkspaceDataSourceImpl } from '~/data/data-source/chorus-api/workspace-data-source'
import { WorkspaceRepositoryImpl } from '~/data/repository/workspace-repository-impl'
import {
  Workspace,
  WorkspaceCreateType,
  WorkspaceUpdatetype
} from '~/domain/model/'
import { WorkspaceCreate } from '~/domain/use-cases/workspace/workspace-create'
import { WorkspaceGet } from '~/domain/use-cases/workspace/workspace-get'
import { WorkspacesList } from '~/domain/use-cases/workspace/workspaces-list'
import { ChorusWorkspace as ChorusWorkspaceApi } from '~/internal/client'

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
  userId: '2',
  status: 'active',
  createdAt: new Date('2024-07-17T12:30:54Z'),
  updatedAt: new Date('2024-07-17T12:30:54Z')
} as Workspace

const MOCK_API_CREATE = {
  tenantId: '1',
  userId: '2',
  name: 'Study 101, a workspace for learning',
  shortName: '101',
  description: 'Study 101 is a test workspace to improve learning'
} as WorkspaceCreateType

const MOCK_API_UPDATE = {
  id: '1',
  tenantId: '1',
  userId: '2',
  name: 'Updated Study 101',
  shortName: '101-updated',
  description: 'Updated description for Study 101',
  status: 'active'
} as WorkspaceUpdatetype

const MOCK_UPDATED_WORKSPACE = {
  ...MOCK_WORKSPACE_RESULT,
  name: 'Updated Study 101',
  shortName: '101-updated',
  description: 'Updated description for Study 101'
} as Workspace

// Test case to get a workspace from the API and transform it to a domain model.
describe('WorkspaceUseCases', () => {
  it('should create a workspace', async () => {
    // Setup mock to handle both the creation and DevStore requests
    let requestCounter = 0
    global.fetch = jest.fn((url, options) => {
      requestCounter++

      // First request: Creating the workspace (POST)
      if (requestCounter === 1) {
        expect(options?.method).toBe('POST')
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              result: { workspace: MOCK_API_RESPONSE }
            }),
          status: 201,
          ok: true
        })
      }

      // Subsequent requests: DevStore API calls for workspace metadata (tag, image)
      // Return empty results to simulate no metadata stored yet
      if (url.toString().includes('/devstore')) {
        return Promise.resolve({
          json: () => Promise.resolve({ result: { key: '', value: '' } }),
          status: 200,
          ok: true
        })
      }

      return Promise.reject(new Error('Unexpected request'))
    }) as jest.Mock

    const session = 'empty'
    const dataSource = new WorkspaceDataSourceImpl(session)
    const repository = new WorkspaceRepositoryImpl(dataSource)
    const useCase = new WorkspaceCreate(repository)

    const response = await useCase.execute(MOCK_API_CREATE)

    expect(response.error).toBeUndefined()
    expect(response.data).toBeDefined()
    expect(response.data).toMatchObject(MOCK_WORKSPACE_RESULT)
    expect(global.fetch).toHaveBeenCalled()
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
    expect(response.error).toBeUndefined()

    const workspace = response.data
    expect(workspace).toBeDefined()
    expect(workspace).toMatchObject(MOCK_WORKSPACE_RESULT)
  })

  it('should get a list of workspaces', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            result: { workspaces: [MOCK_API_RESPONSE] }
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
    expect(response.error).toBeUndefined()

    const workspaces = response.data
    expect(workspaces).toBeDefined()
    expect(workspaces).toMatchObject([MOCK_WORKSPACE_RESULT])
  })
})

describe('WorkspaceDataSourceImpl', () => {
  const session = 'empty'
  let dataSource: WorkspaceDataSourceImpl

  beforeEach(() => {
    // Reset mock before each test
    jest.clearAllMocks()
    dataSource = new WorkspaceDataSourceImpl(session)
  })

  describe('create', () => {
    it('should successfully create a workspace', async () => {
      // Setup mock for creation request
      global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              result: { workspace: { id: '1' } }
            }),
          status: 201,
          ok: true
        })
      ) as jest.Mock

      const result = await dataSource.create(MOCK_API_CREATE)

      expect(result).toEqual({ result: { workspace: { id: '1' } } })
      expect(global.fetch).toHaveBeenCalledTimes(1)

      // Verify that correct path and method are used
      const [url, options] = (global.fetch as jest.Mock).mock.calls[0]
      expect(url).toContain('/workspaces')
      expect(options.method).toBe('POST')
    })

    it('should throw error when API response is empty', async () => {
      // Setup mock for failed creation
      global.fetch = jest.fn().mockImplementationOnce(() => {
        return Promise.reject(
          new Error(
            'The request failed and the interceptors did not return an alternative response'
          )
        )
      })

      await expect(dataSource.create(MOCK_API_CREATE)).rejects.toThrow(
        'The request failed and the interceptors did not return an alternative response'
      )
    })
  })

  describe('get', () => {
    it('should successfully get a workspace by id', async () => {
      // Setup mock for get request
      global.fetch = jest.fn().mockImplementationOnce(() =>
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

      const result = await dataSource.get('1')

      expect(result).toMatchObject({ result: { workspace: MOCK_API_RESPONSE } })
      expect(global.fetch).toHaveBeenCalledTimes(1)

      // Verify that correct path and method are used
      const [url, options] = (global.fetch as jest.Mock).mock.calls[0]
      expect(url).toContain('/workspaces/1')
      // Check if method is GET or undefined (default is GET)
      const getMethod = options?.method || 'GET'
      expect(getMethod).toBe('GET')
    })

    it('should throw error when API response is empty', async () => {
      // Setup mock for failed get
      global.fetch = jest.fn().mockImplementationOnce(() => {
        return Promise.reject(
          new Error(
            'The request failed and the interceptors did not return an alternative response'
          )
        )
      })

      await expect(dataSource.get('1')).rejects.toThrow(
        'The request failed and the interceptors did not return an alternative response'
      )
    })
  })

  describe('delete', () => {
    it('should successfully delete a workspace', async () => {
      // Setup mock for delete request
      global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              result: { success: true }
            }),
          status: 200,
          ok: true
        })
      ) as jest.Mock

      const result = await dataSource.delete('1')

      expect(result).toEqual({ result: { success: true } })
      expect(global.fetch).toHaveBeenCalledTimes(1)

      // Verify that correct path and method are used
      const [url, options] = (global.fetch as jest.Mock).mock.calls[0]
      expect(url).toContain('/workspaces/1')
      expect(options.method).toBe('DELETE')
    })

    it('should throw error when API response is empty', async () => {
      // Setup mock for failed delete
      global.fetch = jest.fn().mockImplementationOnce(() => {
        return Promise.reject(
          new Error(
            'The request failed and the interceptors did not return an alternative response'
          )
        )
      })

      await expect(dataSource.delete('1')).rejects.toThrow(
        'The request failed and the interceptors did not return an alternative response'
      )
    })
  })

  describe('list', () => {
    it('should successfully list workspaces', async () => {
      // Setup mock for list request
      global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              result: { workspaces: [MOCK_API_RESPONSE] }
            }),
          status: 200,
          ok: true
        })
      ) as jest.Mock

      const result = await dataSource.list()

      expect(result).toEqual({ result: { workspaces: [MOCK_API_RESPONSE] } })
      expect(global.fetch).toHaveBeenCalledTimes(1)

      // Verify that correct path and method are used
      const [url, options] = (global.fetch as jest.Mock).mock.calls[0]
      expect(url).toContain('/workspaces')
      // Check if method is GET or undefined (default is GET)
      const getMethod = options?.method || 'GET'
      expect(getMethod).toBe('GET')
    })

    it('should return empty array when API response is empty', async () => {
      // Setup mock for empty list
      global.fetch = jest.fn().mockImplementationOnce(() => {
        return Promise.reject(
          new Error(
            'The request failed and the interceptors did not return an alternative response'
          )
        )
      })

      await expect(dataSource.list()).rejects.toThrow(
        'The request failed and the interceptors did not return an alternative response'
      )
    })
  })

  describe('update', () => {
    it('should successfully update a workspace', async () => {
      // Setup mock for update request, get request, and DevStore requests
      global.fetch = jest.fn().mockImplementation((url, options) => {
        // Update request
        if (options?.method === 'PUT') {
          return Promise.resolve({
            json: () =>
              Promise.resolve({
                result: { success: true }
              }),
            status: 200,
            ok: true
          })
        }

        // DevStore requests for metadata
        if (url.toString().includes('/devstore')) {
          return Promise.resolve({
            json: () => Promise.resolve({ result: { key: '', value: '' } }),
            status: 200,
            ok: true
          })
        }

        // Get updated workspace request
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              result: {
                workspace: {
                  ...MOCK_API_RESPONSE,
                  name: 'Updated Study 101',
                  shortName: '101-updated',
                  description: 'Updated description for Study 101'
                }
              }
            }),
          status: 200,
          ok: true
        })
      }) as jest.Mock

      const dataSource = new WorkspaceDataSourceImpl(session)
      const repository = new WorkspaceRepositoryImpl(dataSource)
      const result = await repository.update(MOCK_API_UPDATE)

      expect(global.fetch).toHaveBeenCalled()
      expect(result.data).toMatchObject(MOCK_UPDATED_WORKSPACE)

      // Verify update request was made
      const updateCall = (global.fetch as jest.Mock).mock.calls.find(
        ([, options]) => options?.method === 'PUT'
      )
      expect(updateCall).toBeDefined()
      expect(updateCall[0]).toContain('/workspaces')
    })

    it('should throw error when API response is empty', async () => {
      // Setup mock for failed update
      global.fetch = jest.fn().mockImplementationOnce(() => {
        return Promise.reject(
          new Error(
            'The request failed and the interceptors did not return an alternative response'
          )
        )
      })

      await expect(dataSource.update(MOCK_API_UPDATE)).rejects.toThrow(
        'The request failed and the interceptors did not return an alternative response'
      )
    })
  })
})
