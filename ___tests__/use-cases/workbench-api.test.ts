/**
 * @jest-environment jsdom
 */

import { WorkbenchDataSourceImpl } from '~/data/data-source/chorus-api/workbench-api-data-source-impl'
import { WorkbenchRepositoryImpl } from '~/data/repository'
import {
  Workbench,
  WorkbenchCreate as WorkbenchCreateModel
} from '~/domain/model'
import { WorkbenchCreate } from '~/domain/use-cases/workbench/workbench-create'
import { WorkbenchDelete } from '~/domain/use-cases/workbench/workbench-delete'
import { WorkbenchGet } from '~/domain/use-cases/workbench/workbench-get'
import { WorkbenchList } from '~/domain/use-cases/workbench/workbench-list'
import { ChorusAppInstance as ChorusAppInstanceApi } from '~/internal/client'

import '@testing-library/jest-dom'

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
  ownerId: '2',
  appId: '3',
  workspaceId: '4',
  name: 'not yet implemented',
  description: 'not yet implemented',
  memberIds: ['2'],
  tags: ['not', 'yet', 'implemented']
} as WorkbenchCreateModel

const { userId, ...other } = MOCK_API_RESPONSE
const MOCK_WORKBENCH_RESULT = {
  ...other,
  ownerId: '2',
  name: 'toto',
  description: 'descriptiojn',
  memberIds: ['2'],
  tags: ['not', 'yet', 'implemented'],
  archivedAt: undefined
} as Workbench

describe('WorkbenchUseCases', () => {
  it('should create a workbench', async () => {
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
    const dataSource = new WorkbenchDataSourceImpl(session)
    const repository = new WorkbenchRepositoryImpl(dataSource)
    const useCase = new WorkbenchCreate(repository)

    const response = await useCase.execute(MOCK_API_CREATE)

    // TODO: as the repository perform an extra get request to get the created workbench, we need to mock the get request
    expect(response.error).toEqual('Error fetching workbench')
    expect(response.data).toBeUndefined()
  })

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
