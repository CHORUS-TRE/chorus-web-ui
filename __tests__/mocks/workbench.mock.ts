import {
  Workbench,
  WorkbenchCreateType,
  WorkbenchUpdateType
} from '~/domain/model'
import { WorkbenchState } from '~/domain/model/workbench'

export const MOCK_API_CREATE: WorkbenchCreateType = {
  name: 'Test Workbench',
  description: 'Test Description',
  status: WorkbenchState.ACTIVE,
  tenantId: '1', // uint64 string
  userId: '1', // uint64 string
  workspaceId: '1', // uint64 string
  appInstanceIds: ['1', '2'] // uint64 strings
}

export const MOCK_API_RESPONSE = {
  id: '1',
  name: 'Test Workbench',
  shortName: 'test-workbench',
  description: 'Test Description',
  status: WorkbenchState.ACTIVE,
  tenantId: '1',
  userId: '1',
  workspaceId: '1',
  appInsanceIds: ['1', '2'],
  appInstances: ['1', '2'],
  createdAt: '2024-03-20T00:00:00Z',
  updatedAt: '2024-03-20T00:00:00Z'
}

export const MOCK_WORKBENCH_RESULT: Workbench = {
  id: '1',
  name: 'Test Workbench',
  shortName: 'test-workbench',
  description: 'Test Description',
  status: WorkbenchState.ACTIVE,
  tenantId: '1',
  userId: '1',
  workspaceId: '1',
  appInstanceIds: ['1', '2'],
  appInstances: ['1', '2'],
  tags: ['test'], // preserved for backward compatibility
  createdAt: new Date('2024-03-20T00:00:00Z'),
  updatedAt: new Date('2024-03-20T00:00:00Z'),
  archivedAt: undefined
}

export const MOCK_API_UPDATE: WorkbenchUpdateType = {
  id: '1',
  name: 'Updated Test Workbench',
  description: 'Updated Test Description',
  status: WorkbenchState.ACTIVE,
  tenantId: '1',
  userId: '1',
  workspaceId: '1',
  appInstanceIds: ['1', '2', '3'],
  tags: ['test', 'updated'] // preserved for backward compatibility
}

export const MOCK_UPDATED_WORKBENCH: Workbench = {
  ...MOCK_WORKBENCH_RESULT,
  name: 'Updated Test Workbench',
  description: 'Updated Test Description',
  appInstanceIds: ['1', '2', '3'],
  appInstances: ['1', '2', '3'],
  tags: ['test', 'updated']
}
