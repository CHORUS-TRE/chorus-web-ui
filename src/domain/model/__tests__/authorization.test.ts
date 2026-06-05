import { AuthorizationRoleSchema } from '@/domain/model/authorization'

describe('AuthorizationRoleSchema', () => {
  it('parses a complete role from the API', () => {
    const input = {
      name: 'WorkspaceMember',
      description: 'Can create sessions',
      scope: 'workspace',
      permissions: ['listWorkspaces', 'createWorkbench'],
      context: ['workspace'],
      dynamic: false
    }
    const result = AuthorizationRoleSchema.safeParse(input)
    expect(result.success).toBe(true)
    expect(result.data).toEqual(input)
  })

  it('applies defaults for missing optional fields', () => {
    const result = AuthorizationRoleSchema.safeParse({ name: 'SomeRole' })
    expect(result.success).toBe(true)
    expect(result.data).toEqual({
      name: 'SomeRole',
      description: '',
      scope: 'platform',
      permissions: [],
      context: [],
      dynamic: false
    })
  })

  it('passes through unknown scope values as-is', () => {
    const result = AuthorizationRoleSchema.safeParse({
      name: 'X',
      scope: 'banana'
    })
    expect(result.success).toBe(true)
    expect(result.data?.scope).toBe('banana')
  })
})
