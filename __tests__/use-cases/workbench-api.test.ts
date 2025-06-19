/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'

import { WorkbenchDataSourceImpl } from '~/data/data-source/chorus-api/workbench-data-source'
import { WorkbenchRepositoryImpl } from '~/data/repository/workbench-repository-impl'
import {
  Workbench,
  WorkbenchCreateType,
  WorkbenchUpdateType
} from '~/domain/model'
import { WorkbenchCreate } from '~/domain/use-cases/workbench/workbench-create'
import { WorkbenchDelete } from '~/domain/use-cases/workbench/workbench-delete'
import { WorkbenchGet } from '~/domain/use-cases/workbench/workbench-get'
import { WorkbenchList } from '~/domain/use-cases/workbench/workbench-list'
import { ChorusAppInstance as ChorusAppInstanceApi } from '~/internal/client'

const MOCK_API_RESPONSE = {
  id: '1',
  tenantId: '1',
  name: 'toto',
  userId: '2',
  workspaceId: '4',
  description: 'descriptiojn',
  status: 'active',
  createdAt: new Date('2024-07-17T12:30:54Z'),
  updatedAt: new Date('2024-07-17T12:30:54Z')
} as ChorusAppInstanceApi

const MOCK_API_CREATE = {
  tenantId: '1',
  userId: '2',
  appId: '3',
  workspaceId: '4',
  name: 'not yet implemented',
  description: 'not yet implemented'
} as WorkbenchCreateType

const MOCK_API_UPDATE = {
  id: '1',
  tenantId: '1',
  userId: '2',
  workspaceId: '4',
  name: 'updated name',
  description: 'updated description'
} as WorkbenchUpdateType

// Create a version of the API response without userId for test expectations
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { userId, ...apiResponseWithoutUserId } = MOCK_API_RESPONSE

const MOCK_WORKBENCH_RESULT = {
  ...apiResponseWithoutUserId,
  userId: '2',
  name: 'toto',
  description: 'descriptiojn'
} as Workbench

// Updated mock for tests
const MOCK_UPDATED_WORKBENCH = {
  ...MOCK_WORKBENCH_RESULT,
  name: 'updated name',
  description: 'updated description'
} as Workbench

describe('WorkbenchUseCases', () => {
  it('should create a workbench', async () => {
    // Setup mock to handle both the creation and retrieval requests
    let requestCounter = 0
    global.fetch = jest.fn((url, options) => {
      requestCounter++

      // First request: Creating the workbench (POST)
      if (requestCounter === 1) {
        expect(options?.method).toBe('POST')
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              result: { id: '1' }
            }),
          status: 201,
          ok: true
        })
      }
      // Second request: Getting the workbench details (GET)
      else if (requestCounter === 2) {
        expect(url).toContain('/1') // Should include the ID
        // Check for GET method or undefined (as GET is the default)
        const method = options?.method || 'GET'
        expect(method).toBe('GET')
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              result: {
                workbench: MOCK_API_RESPONSE
              }
            }),
          status: 200,
          ok: true
        })
      }

      return Promise.reject(new Error('Unexpected request'))
    }) as jest.Mock

    const session = 'empty'
    const dataSource = new WorkbenchDataSourceImpl(session)
    const repository = new WorkbenchRepositoryImpl(dataSource)
    const useCase = new WorkbenchCreate(repository)

    const response = await useCase.execute(MOCK_API_CREATE)

    // Test should now pass with both requests properly mocked
    expect(response.error).toBeUndefined()
    expect(response.data).toBeDefined()
    expect(response.data).toMatchObject(MOCK_WORKBENCH_RESULT)
    expect(global.fetch).toHaveBeenCalledTimes(2)
  }, 10000)

  it('should get a workbench', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            result: {
              workbench: MOCK_API_RESPONSE
            }
          }),
        status: 200,
        ok: true
      })
    ) as jest.Mock

    const session = 'empty'
    const dataSource = new WorkbenchDataSourceImpl(session)
    const repository = new WorkbenchRepositoryImpl(dataSource)
    const useCase = new WorkbenchGet(repository)

    const response = await useCase.execute(MOCK_API_RESPONSE.id!)

    expect(response.error).toBeUndefined()

    const workbench = response.data
    expect(workbench).toBeDefined()
    expect(workbench).toMatchObject(MOCK_WORKBENCH_RESULT)
  })

  it('should delete a workbench', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            result: {
              data: 'ok'
            }
          }),
        status: 200,
        ok: true
      })
    ) as jest.Mock

    const session = 'empty'
    const dataSource = new WorkbenchDataSourceImpl(session)
    const repository = new WorkbenchRepositoryImpl(dataSource)
    const useCase = new WorkbenchDelete(repository)

    const response = await useCase.execute('1')

    expect(response.error).toBeUndefined()
    const workbench = response.data
    expect(workbench).toBeTruthy()
  })

  it('should get a list of workbenches', async () => {
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
    const dataSource = new WorkbenchDataSourceImpl(session)
    const repository = new WorkbenchRepositoryImpl(dataSource)
    const useCase = new WorkbenchList(repository)

    const response = await useCase.execute()
    expect(response.error).toBeUndefined()

    const workbenchs = response.data
    expect(workbenchs).toBeDefined()
    expect(workbenchs).toMatchObject([MOCK_WORKBENCH_RESULT])
  })
})

describe('WorkbenchDataSourceImpl', () => {
  const session = 'empty'
  let dataSource: WorkbenchDataSourceImpl

  beforeEach(() => {
    // Reset mock before each test
    jest.clearAllMocks()
    dataSource = new WorkbenchDataSourceImpl(session)
  })

  describe('create', () => {
    it('should successfully create a workbench', async () => {
      // Setup mock for creation request
      global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              result: { id: '1' }
            }),
          status: 201,
          ok: true
        })
      ) as jest.Mock

      const result = await dataSource.create(MOCK_API_CREATE)

      expect(result).toEqual({ result: { id: '1' } })
      expect(global.fetch).toHaveBeenCalledTimes(1)

      // Verify that correct path and method are used
      const [url, options] = (global.fetch as jest.Mock).mock.calls[0]
      expect(url).toContain('/workbenchs')
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
    it('should successfully get a workbench by id', async () => {
      // Setup mock for get request
      global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              result: {
                workbench: MOCK_API_RESPONSE
              }
            }),
          status: 200,
          ok: true
        })
      ) as jest.Mock

      const result = await dataSource.get('1')

      expect(result).toEqual({ result: { workbench: MOCK_API_RESPONSE } })
      expect(global.fetch).toHaveBeenCalledTimes(1)

      // Verify that correct path and method are used
      const [url, options] = (global.fetch as jest.Mock).mock.calls[0]
      expect(url).toContain('/workbenchs/1')
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
    it('should successfully delete a workbench', async () => {
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
      expect(url).toContain('/workbenchs/1')
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
    it('should successfully list workbenches', async () => {
      // Setup mock for list request
      global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              result: [MOCK_API_RESPONSE]
            }),
          status: 200,
          ok: true
        })
      ) as jest.Mock

      const result = await dataSource.list()

      expect(result).toEqual({ result: [MOCK_API_RESPONSE] })
      expect(global.fetch).toHaveBeenCalledTimes(1)

      // Verify that correct path and method are used
      const [url, options] = (global.fetch as jest.Mock).mock.calls[0]
      expect(url).toContain('/workbenchs')
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
    it('should successfully update a workbench', async () => {
      // Setup mock for update request and subsequent get request
      global.fetch = jest
        .fn()
        // First call - update
        .mockImplementationOnce(() =>
          Promise.resolve({
            json: () =>
              Promise.resolve({
                result: { success: true }
              }),
            status: 200,
            ok: true
          })
        )
        // Second call - get updated workbench
        .mockImplementationOnce(() =>
          Promise.resolve({
            json: () =>
              Promise.resolve({
                result: {
                  workbench: {
                    ...MOCK_API_RESPONSE,
                    name: 'updated name',
                    description: 'updated description'
                  }
                }
              }),
            status: 200,
            ok: true
          })
        ) as jest.Mock

      const repository = new WorkbenchRepositoryImpl(dataSource)
      const result = await repository.update(MOCK_API_UPDATE)

      expect(global.fetch).toHaveBeenCalledTimes(2)
      expect(result.data).toMatchObject(MOCK_UPDATED_WORKBENCH)

      // Verify update request
      const [updateUrl, updateOptions] = (global.fetch as jest.Mock).mock
        .calls[0]
      expect(updateUrl).toContain('/workbenchs')
      expect(updateOptions.method).toBe('PUT')

      // Verify get request
      const [getUrl, getOptions] = (global.fetch as jest.Mock).mock.calls[1]
      expect(getUrl).toContain('/workbenchs/1')
      // Check if method is GET or undefined (default is GET)
      const getMethod = getOptions?.method || 'GET'
      expect(getMethod).toBe('GET')
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
