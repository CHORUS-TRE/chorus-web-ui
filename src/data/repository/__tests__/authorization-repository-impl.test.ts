import { AuthorizationApiDataSourceImpl } from '@/data/data-source'
import { AuthorizationRepositoryImpl } from '@/data/repository'

const makeDataSource = (
  roles: unknown[] | null,
  throws = false
): AuthorizationApiDataSourceImpl => {
  const ds = Object.create(AuthorizationApiDataSourceImpl.prototype)
  ds.listRoles = throws
    ? () => Promise.reject(new Error('network error'))
    : () =>
        Promise.resolve({
          result: { roles }
        })
  return ds
}

describe('AuthorizationRepositoryImpl.listRoles', () => {
  it('returns parsed roles on success', async () => {
    const ds = makeDataSource([
      {
        name: 'WorkspaceMember',
        description: 'Can create sessions',
        scope: 'workspace',
        permissions: ['createWorkbench'],
        context: ['workspace'],
        dynamic: false
      }
    ])
    const repo = new AuthorizationRepositoryImpl(ds)
    const result = await repo.listRoles()
    expect(result.error).toBeUndefined()
    expect(result.data).toHaveLength(1)
    expect(result.data![0].name).toBe('WorkspaceMember')
    expect(result.data![0].permissions).toEqual(['createWorkbench'])
  })

  it('applies schema defaults for missing fields', async () => {
    const ds = makeDataSource([{ name: 'MinimalRole' }])
    const repo = new AuthorizationRepositoryImpl(ds)
    const result = await repo.listRoles()
    expect(result.data![0]).toEqual({
      name: 'MinimalRole',
      description: '',
      scope: 'platform',
      permissions: [],
      context: [],
      dynamic: false
    })
  })

  it('returns error on network failure', async () => {
    const ds = makeDataSource(null, true)
    const repo = new AuthorizationRepositoryImpl(ds)
    const result = await repo.listRoles()
    expect(result.error?.message).toBe('network error')
    expect(result.data).toBeUndefined()
  })

  it('returns error when API returns null roles', async () => {
    const ds = makeDataSource(null)
    const repo = new AuthorizationRepositoryImpl(ds)
    const result = await repo.listRoles()
    expect(result.error).toBeDefined()
  })
})
