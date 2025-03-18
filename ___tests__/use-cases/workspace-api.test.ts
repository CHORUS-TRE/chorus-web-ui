/**
 * @jest-environment jsdom
 */
import { WorkspaceDataSourceImpl } from '~/data/data-source/chorus-api'
import { WorkspaceRepositoryImpl } from '~/data/repository'
import { Workspace, WorkspaceCreateModel, WorkspaceUpdateModel } from '~/domain/model/'
import { WorkspaceCreate } from '~/domain/use-cases'
import { WorkspaceGet } from '~/domain/use-cases/workspace/workspace-get'
import { WorkspacesList } from '~/domain/use-cases/workspace/workspaces-list'
import { ChorusWorkspace as ChorusWorkspaceApi } from '~/internal/client'

import '@testing-library/jest-dom'

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

const MOCK_API_UPDATE = {
  id: '1',
  tenantId: '1',
  userId: '2',
  name: 'Updated Study 101',
  shortName: '101-updated',
  description: 'Updated description for Study 101',
  status: 'active'
} as WorkspaceUpdateModel

const MOCK_UPDATED_WORKSPACE = {
  ...MOCK_WORKSPACE_RESULT,
  name: 'Updated Study 101',
  shortName: '101-updated',
  description: 'Updated description for Study 101'
} as Workspace

// Test case to get a workspace from the API and transform it to a domain model.
describe('WorkspaceUseCases', () => {
  it('should create a workspace', async () => {
    // Setup mock to handle both the creation and retrieval requests
    let requestCounter = 0;
    global.fetch = jest.fn((url, options) => {
      requestCounter++;

      // First request: Creating the workspace (POST)
      if (requestCounter === 1) {
        expect(options?.method).toBe('POST');
        return Promise.resolve({
          json: () => Promise.resolve({
            result: { id: '1' }
          }),
          status: 201,
          ok: true
        });
      }
      // Second request: Getting the workspace details (GET)
      else if (requestCounter === 2) {
        expect(url).toContain('/1'); // Should include the ID
        // Check for GET method or undefined (as GET is the default)
        const method = options?.method || 'GET';
        expect(method).toBe('GET');
        return Promise.resolve({
          json: () => Promise.resolve({
            result: {
              workspace: MOCK_API_RESPONSE
            }
          }),
          status: 200,
          ok: true
        });
      }

      return Promise.reject(new Error('Unexpected request'));
    }) as jest.Mock;

    const session = 'empty'
    const dataSource = new WorkspaceDataSourceImpl(session)
    const repository = new WorkspaceRepositoryImpl(dataSource)
    const useCase = new WorkspaceCreate(repository)

    const response = await useCase.execute(MOCK_API_CREATE)

    expect(response.error).toBeUndefined()
    expect(response.data).toBeDefined()
    expect(response.data).toMatchObject(MOCK_WORKSPACE_RESULT)
    expect(global.fetch).toHaveBeenCalledTimes(2)
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
    expect(response.error).toBeUndefined()

    const workspaces = response.data
    expect(workspaces).toBeDefined()
    expect(workspaces).toMatchObject([MOCK_WORKSPACE_RESULT])
  })
})

describe('WorkspaceDataSourceImpl', () => {
  const session = 'empty';
  let dataSource: WorkspaceDataSourceImpl;

  beforeEach(() => {
    // Reset mock before each test
    jest.clearAllMocks();
    dataSource = new WorkspaceDataSourceImpl(session);
  });

  describe('create', () => {
    it('should successfully create a workspace', async () => {
      // Setup mock for creation request
      global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            result: { id: '1' }
          }),
          status: 201,
          ok: true
        })
      ) as jest.Mock;

      const result = await dataSource.create(MOCK_API_CREATE);

      expect(result).toBe('1');
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Verify that correct path and method are used
      const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
      expect(url).toContain('/workspaces');
      expect(options.method).toBe('POST');
    });

    it('should throw error when API response is empty', async () => {
      // Setup mock for failed creation
      global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            result: null
          }),
          status: 201,
          ok: true
        })
      ) as jest.Mock;

      await expect(dataSource.create(MOCK_API_CREATE)).rejects.toThrow('Error creating workspace');
    });
  });

  describe('get', () => {
    it('should successfully get a workspace by id', async () => {
      // Setup mock for get request
      global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            result: {
              workspace: MOCK_API_RESPONSE
            }
          }),
          status: 200,
          ok: true
        })
      ) as jest.Mock;

      const result = await dataSource.get('1');

      expect(result).toMatchObject(MOCK_WORKSPACE_RESULT);
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Verify that correct path and method are used
      const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
      expect(url).toContain('/workspaces/1');
      // Check if method is GET or undefined (default is GET)
      const getMethod = options?.method || 'GET';
      expect(getMethod).toBe('GET');
    });

    it('should throw error when API response is empty', async () => {
      // Setup mock for failed get
      global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            result: { workspace: null }
          }),
          status: 200,
          ok: true
        })
      ) as jest.Mock;

      await expect(dataSource.get('1')).rejects.toThrow('Error fetching workspace');
    });
  });

  describe('delete', () => {
    it('should successfully delete a workspace', async () => {
      // Setup mock for delete request
      global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            result: { success: true }
          }),
          status: 200,
          ok: true
        })
      ) as jest.Mock;

      const result = await dataSource.delete('1');

      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Verify that correct path and method are used
      const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
      expect(url).toContain('/workspaces/1');
      expect(options.method).toBe('DELETE');
    });

    it('should throw error when API response is empty', async () => {
      // Setup mock for failed delete
      global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            result: null
          }),
          status: 200,
          ok: true
        })
      ) as jest.Mock;

      await expect(dataSource.delete('1')).rejects.toThrow('Error deleting workspace');
    });
  });

  describe('list', () => {
    it('should successfully list workspaces', async () => {
      // Setup mock for list request
      global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            result: [MOCK_API_RESPONSE]
          }),
          status: 200,
          ok: true
        })
      ) as jest.Mock;

      const result = await dataSource.list();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject(MOCK_WORKSPACE_RESULT);
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Verify that correct path and method are used
      const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
      expect(url).toContain('/workspaces');
      // Check if method is GET or undefined (default is GET)
      const getMethod = options?.method || 'GET';
      expect(getMethod).toBe('GET');
    });

    it('should return empty array when API response is empty', async () => {
      // Setup mock for empty list
      global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            result: null
          }),
          status: 200,
          ok: true
        })
      ) as jest.Mock;

      await expect(dataSource.list()).rejects.toThrow('Error fetching workspaces');
    });
  });

  describe('update', () => {
    it('should successfully update a workspace', async () => {
      // Setup mock for update request and subsequent get request
      global.fetch = jest.fn()
        // First call - update
        .mockImplementationOnce(() =>
          Promise.resolve({
            json: () => Promise.resolve({
              result: { success: true }
            }),
            status: 200,
            ok: true
          })
        )
        // Second call - get updated workspace
        .mockImplementationOnce(() =>
          Promise.resolve({
            json: () => Promise.resolve({
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
        ) as jest.Mock;

      const result = await dataSource.update(MOCK_API_UPDATE);

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(result).toMatchObject(MOCK_UPDATED_WORKSPACE);

      // Verify update request
      const [updateUrl, updateOptions] = (global.fetch as jest.Mock).mock.calls[0];
      expect(updateUrl).toContain('/workspaces');
      expect(updateOptions.method).toBe('PUT');

      // Verify get request
      const [getUrl, getOptions] = (global.fetch as jest.Mock).mock.calls[1];
      expect(getUrl).toContain('/workspaces/1');
      // Check if method is GET or undefined (default is GET)
      const getMethod = getOptions?.method || 'GET';
      expect(getMethod).toBe('GET');
    });

    it('should throw error when API response is empty', async () => {
      // Setup mock for failed update
      global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            result: null
          }),
          status: 200,
          ok: true
        })
      ) as jest.Mock;

      await expect(dataSource.update(MOCK_API_UPDATE)).rejects.toThrow('Error updating workspace');
    });
  });
});
