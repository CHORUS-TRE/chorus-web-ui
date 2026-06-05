# API-Driven Roles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace hardcoded `ROLE_DEFINITIONS` in `permissions.ts` with live data from `GET /api/rest/v1/authorization/roles`, making role descriptions and permission grants API-driven throughout the UI.

**Architecture:** Add the standard data layer (`DataSource → Repository → ViewModel`) for the authorization roles endpoint, wrap it in a `RolesProvider` that sits between `AuthenticationProvider` and `AuthorizationProvider` in the tree, and update all 15 consumer files to read from `useRoles()` instead of local constants.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Zod, Jest, React Testing Library, `next-runtime-env`

---

## File Map

### New files
| Path | Responsibility |
|---|---|
| `src/domain/model/authorization.ts` | `AuthorizationRole` type + Zod schema |
| `src/domain/model/__tests__/authorization.test.ts` | Schema parsing tests |
| `src/data/data-source/chorus-api/authorization-data-source.ts` | Wraps `AuthorizationServiceApi.authorizationServiceListRoles()` |
| `src/data/repository/authorization-repository-impl.ts` | Maps API response → `AuthorizationRole[]`, validates |
| `src/data/repository/__tests__/authorization-repository-impl.test.ts` | Repository unit tests |
| `src/view-model/authorization-view-model.ts` | `listRoles()` — wires data source + repository, called by provider |
| `src/providers/roles-provider.tsx` | Fetches once per session, exposes `useRoles()` |

### Modified files
| Path | Change |
|---|---|
| `src/domain/repository/authorization-repository.ts` | Add `listRoles()` to interface |
| `src/data/data-source/index.ts` | Export `authorization-data-source` |
| `src/data/repository/index.ts` | Export `authorization-repository-impl` |
| `src/app/layout.tsx` | Add `<RolesProvider>` between `<AuthenticationProvider>` and `<AuthorizationProvider>` |
| `src/config/permissions.ts` | Delete `ROLE_DEFINITIONS` and related; add `ROLE_DISPLAY_NAMES` |
| `src/providers/authorization-provider.tsx` | Replace `getRolePermissions()` with `useRoles()` lookup |
| `src/components/role-badge.tsx` | Use `useRoles()` for scope + description; update exported `getRoleScope` |
| `src/components/permission-matrix.tsx` | Replace `getRolePermissions()` + `ROLE_DEFINITIONS` with `useRoles()` |
| `src/components/effective-permission-tags.tsx` | Replace `getRolePermissions()` with `useRoles()` |
| `src/components/workspace-user-table.tsx` | Replace `ROLE_DEFINITIONS[role]?.description` with `useRoles()` |
| `src/components/session-members-sheet.tsx` | Replace `ROLE_DEFINITIONS` with `useRoles()` + `ROLE_DISPLAY_NAMES` |
| `src/components/forms/create-user-role-dialog.tsx` | Replace `getAllRoles()` + `ROLE_DEFINITIONS` with `useRoles()` |
| `src/components/forms/add-user-to-workspace-dialog.tsx` | Replace `getWorkspaceRoles()` with filtered `useRoles()` |
| `src/components/forms/manage-user-workspace-dialog.tsx` | Same |
| `src/components/forms/manage-user-workbench-dialog.tsx` | Replace `getWorkbenchRoles()` with filtered `useRoles()` |
| `src/app/admin/page.tsx` | Replace `Object.keys(ROLE_DEFINITIONS).length` with `roles.length` |
| `src/app/admin/authorization/roles/page.tsx` | Replace `ROLE_DEFINITIONS` + local `getRoleScope` with `useRoles()` |
| `src/app/admin/users/user-roles-matrix.tsx` | Same |
| `src/app/settings/page.tsx` | Replace `getRoleScope(r.name)` import with `useRoles()` lookup |
| `src/app/settings/profile/page.tsx` | Same |

---

## Task 1: Domain model

**Files:**
- Create: `src/domain/model/authorization.ts`
- Create: `src/domain/model/__tests__/authorization.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/domain/model/__tests__/authorization.test.ts
import {
  AuthorizationRoleSchema,
  type AuthorizationRole
} from '@/domain/model/authorization'

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

  it('rejects an unknown scope value', () => {
    const result = AuthorizationRoleSchema.safeParse({
      name: 'X',
      scope: 'banana'
    })
    expect(result.success).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/guspuhle/workdir/projects/chorus/chorus-web-ui
pnpm test:run -- --testPathPattern="domain/model/__tests__/authorization"
```

Expected: error — module not found.

- [ ] **Step 3: Create the domain model**

```typescript
// src/domain/model/authorization.ts
import { z } from 'zod'

export const AuthorizationRoleSchema = z.object({
  name: z.string(),
  description: z.string().default(''),
  scope: z.enum(['platform', 'workspace', 'session']).default('platform'),
  permissions: z.array(z.string()).default([]),
  context: z.array(z.string()).default([]),
  dynamic: z.boolean().default(false)
})

export type AuthorizationRole = z.infer<typeof AuthorizationRoleSchema>
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm test:run -- --testPathPattern="domain/model/__tests__/authorization"
```

Expected: 3 passing.

- [ ] **Step 5: Commit**

```bash
git add src/domain/model/authorization.ts src/domain/model/__tests__/authorization.test.ts
git commit -m "feat: add AuthorizationRole domain model with Zod schema"
```

---

## Task 2: Data source

**Files:**
- Create: `src/data/data-source/chorus-api/authorization-data-source.ts`
- Modify: `src/data/data-source/index.ts`

- [ ] **Step 1: Create the data source**

```typescript
// src/data/data-source/chorus-api/authorization-data-source.ts
import {
  AuthorizationServiceApi,
  ChorusListRolesReply,
  Configuration
} from '@/internal/client'

interface AuthorizationDataSource {
  listRoles(): Promise<ChorusListRolesReply>
}

export type { AuthorizationDataSource }

class AuthorizationApiDataSourceImpl implements AuthorizationDataSource {
  private service: AuthorizationServiceApi

  constructor(basePath: string) {
    const configuration = new Configuration({
      basePath,
      credentials: 'include'
    })
    this.service = new AuthorizationServiceApi(configuration)
  }

  listRoles(): Promise<ChorusListRolesReply> {
    return this.service.authorizationServiceListRoles()
  }
}

export { AuthorizationApiDataSourceImpl }
```

- [ ] **Step 2: Export from the data-source index**

Add these two lines to `src/data/data-source/index.ts` (append to the end):

```typescript
export type * from './chorus-api/authorization-data-source'
export * from './chorus-api/authorization-data-source'
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
pnpm typecheck 2>&1 | head -20
```

Expected: no new errors (existing errors, if any, are pre-existing).

- [ ] **Step 4: Commit**

```bash
git add src/data/data-source/chorus-api/authorization-data-source.ts src/data/data-source/index.ts
git commit -m "feat: add AuthorizationApiDataSourceImpl wrapping listRoles endpoint"
```

---

## Task 3: Repository interface + implementation

**Files:**
- Modify: `src/domain/repository/authorization-repository.ts`
- Create: `src/data/repository/authorization-repository-impl.ts`
- Create: `src/data/repository/__tests__/authorization-repository-impl.test.ts`
- Modify: `src/data/repository/index.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// src/data/repository/__tests__/authorization-repository-impl.test.ts
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
    expect(result.error).toBe('network error')
    expect(result.data).toBeUndefined()
  })

  it('returns error when API returns null roles', async () => {
    const ds = makeDataSource(null)
    const repo = new AuthorizationRepositoryImpl(ds)
    const result = await repo.listRoles()
    expect(result.error).toBeDefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test:run -- --testPathPattern="repository/__tests__/authorization-repository-impl"
```

Expected: error — module not found.

- [ ] **Step 3: Extend the repository interface**

Replace the entire content of `src/domain/repository/authorization-repository.ts`:

```typescript
import { Result } from '@/domain/model'
import { AuthorizationRole } from '@/domain/model/authorization'
import { User } from '@/domain/model/user'

export interface AuthorizationRepository {
  isUserAllowed(user: User, permission: string): Result<boolean>
  getUserPermissions(user: User): Result<string[]>
  listRoles(): Promise<Result<AuthorizationRole[]>>
}
```

- [ ] **Step 4: Create the repository implementation**

```typescript
// src/data/repository/authorization-repository-impl.ts
import { z } from 'zod'

import { Result } from '@/domain/model'
import {
  AuthorizationRole,
  AuthorizationRoleSchema
} from '@/domain/model/authorization'
import { User } from '@/domain/model/user'
import { AuthorizationRepository } from '@/domain/repository'

import { AuthorizationDataSource } from '../data-source'

export class AuthorizationRepositoryImpl implements AuthorizationRepository {
  private dataSource: AuthorizationDataSource

  constructor(dataSource: AuthorizationDataSource) {
    this.dataSource = dataSource
  }

  // Not used — permission checks happen in AuthorizationProvider via useRoles()
  isUserAllowed(_user: User, _permission: string): Result<boolean> {
    return { data: false }
  }

  getUserPermissions(_user: User): Result<string[]> {
    return { data: [] }
  }

  async listRoles(): Promise<Result<AuthorizationRole[]>> {
    try {
      const response = await this.dataSource.listRoles()
      const result = z
        .array(AuthorizationRoleSchema)
        .safeParse(response.result?.roles)
      if (!result.success) {
        return {
          error: 'API response validation failed',
          issues: result.error.issues
        }
      }
      return { data: result.data }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }
}
```

- [ ] **Step 5: Export from repository index**

Append to `src/data/repository/index.ts`:

```typescript
export * from './authorization-repository-impl'
```

- [ ] **Step 6: Run tests to verify they pass**

```bash
pnpm test:run -- --testPathPattern="repository/__tests__/authorization-repository-impl"
```

Expected: 4 passing.

- [ ] **Step 7: Commit**

```bash
git add \
  src/domain/repository/authorization-repository.ts \
  src/data/repository/authorization-repository-impl.ts \
  src/data/repository/__tests__/authorization-repository-impl.test.ts \
  src/data/repository/index.ts
git commit -m "feat: implement AuthorizationRepositoryImpl with listRoles"
```

---

## Task 4: View model

**Files:**
- Create: `src/view-model/authorization-view-model.ts`

- [ ] **Step 1: Create the view model**

```typescript
// src/view-model/authorization-view-model.ts
'use client'

import { env } from 'next-runtime-env'

import { AuthorizationApiDataSourceImpl } from '@/data/data-source'
import { AuthorizationRepositoryImpl } from '@/data/repository'
import { Result } from '@/domain/model'
import { AuthorizationRole } from '@/domain/model/authorization'

const getRepository = () => {
  const dataSource = new AuthorizationApiDataSourceImpl(
    env('NEXT_PUBLIC_API_URL') || ''
  )
  return new AuthorizationRepositoryImpl(dataSource)
}

export async function listRoles(): Promise<Result<AuthorizationRole[]>> {
  return getRepository().listRoles()
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm typecheck 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add src/view-model/authorization-view-model.ts
git commit -m "feat: add authorization view model with listRoles"
```

---

## Task 5: RolesProvider

**Files:**
- Create: `src/providers/roles-provider.tsx`

- [ ] **Step 1: Create the provider**

```typescript
// src/providers/roles-provider.tsx
'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

import { LoadingOverlay } from '@/components/loading-overlay'
import { AuthorizationRole } from '@/domain/model/authorization'
import { useAuthentication } from '@/providers/authentication-provider'
import { listRoles } from '@/view-model/authorization-view-model'

interface RolesContextType {
  roles: AuthorizationRole[]
  rolesByName: Map<string, AuthorizationRole>
}

const RolesContext = createContext<RolesContextType>({
  roles: [],
  rolesByName: new Map()
})

export const useRoles = (): RolesContextType => {
  const ctx = useContext(RolesContext)
  if (!ctx) {
    throw new Error('useRoles must be used within a RolesProvider')
  }
  return ctx
}

export const RolesProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const { user } = useAuthentication()
  const [roles, setRoles] = useState<AuthorizationRole[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      // Unauthenticated — do not block; login page renders without roles
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    listRoles().then((result) => {
      if (result.error) {
        setError(result.error)
      } else {
        setRoles(result.data ?? [])
      }
      setLoading(false)
    })
  }, [user])

  const rolesByName = useMemo(
    () => new Map(roles.map((r) => [r.name, r])),
    [roles]
  )

  if (loading) {
    return <LoadingOverlay />
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Failed to load roles: {error}</p>
          <button
            className="mt-4 text-sm underline"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <RolesContext.Provider value={{ roles, rolesByName }}>
      {children}
    </RolesContext.Provider>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm typecheck 2>&1 | head -20
```

- [ ] **Step 3: Add RolesProvider to layout.tsx**

In `src/app/layout.tsx`:

1. Add import at the top with the other provider imports:
```typescript
import { RolesProvider } from '@/providers/roles-provider'
```

2. Wrap `<AuthorizationProvider>` with `<RolesProvider>`:
```tsx
<AuthenticationProvider>
  <RolesProvider>
    <AuthorizationProvider>
      <AppStateInitializer />
      ...
    </AuthorizationProvider>
  </RolesProvider>
</AuthenticationProvider>
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
pnpm typecheck 2>&1 | head -20
```

- [ ] **Step 5: Commit**

```bash
git add src/providers/roles-provider.tsx src/app/layout.tsx
git commit -m "feat: add RolesProvider — fetches listRoles on auth, exposes useRoles()"
```

---

## Task 6: Clean up permissions.ts + update AuthorizationProvider

**Files:**
- Modify: `src/config/permissions.ts`
- Modify: `src/providers/authorization-provider.tsx`

- [ ] **Step 1: Add ROLE_DISPLAY_NAMES and delete ROLE_DEFINITIONS from permissions.ts**

In `src/config/permissions.ts`, make the following changes:

**Add** after `WORKSPACE_PERMISSIONS_DISPLAY` (around line 100):
```typescript
export const ROLE_DISPLAY_NAMES: Record<string, string> = {
  WorkbenchViewer: 'Session Viewer',
  WorkbenchMember: 'Session Member',
  WorkbenchAdmin: 'Session Admin'
}
```

**Delete** the following exports entirely:
- The `RoleDefinition` interface
- The `ROLE_DEFINITIONS` object (the large Record<string, RoleDefinition>)
- `EnhancedRole` type alias
- `getEnhancedRole()` function
- `getRolePermissions()` function
- `getRoleDescription()` function
- `getAllRoles()` function
- `getWorkspaceRoles()` function
- `getWorkbenchRoles()` function

**Keep:** `PERMISSIONS`, `Permission` type, `WORKSPACE_PERMISSIONS_DISPLAY`, `PERMISSION_DESCRIPTIONS`, `ROLE_DISPLAY_NAMES` (just added).

Note: This step will cause TypeScript errors in all 15 consumer files — that is expected. Tasks 7–11 fix them.

- [ ] **Step 2: Update AuthorizationProvider to use useRoles()**

Replace the entire content of `src/providers/authorization-provider.tsx`:

```typescript
'use client'

import React, { createContext, useCallback, useContext, useMemo } from 'react'

import { PERMISSIONS } from '@/config/permissions'
import { User } from '@/domain/model/user'
import { useAuthentication } from '@/providers/authentication-provider'
import { useRoles } from '@/providers/roles-provider'

interface AuthorizationContextType {
  PERMISSIONS: typeof PERMISSIONS
  can: (permission: string, context?: Record<string, string>) => boolean
  getPermissionsForUser: (
    user: User,
    context?: Record<string, string>
  ) => Set<string>
  isAdmin: boolean
}

const AuthorizationContext = createContext<AuthorizationContextType>({
  PERMISSIONS,
  can: () => false,
  getPermissionsForUser: () => new Set<string>(),
  isAdmin: false
})

export const useAuthorization = () => {
  const context = useContext(AuthorizationContext)
  if (!context) {
    throw new Error(
      'useAuthorization must be used within an AuthorizationProvider'
    )
  }
  return context
}

export const AuthorizationProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const { user } = useAuthentication()
  const { rolesByName } = useRoles()

  const permissionsWithContextMap = useMemo(() => {
    if (!user || !user.rolesWithContext)
      return new Map<string, Record<string, string[]>>()

    const newPermissionsMap: Record<string, Record<string, string[]>> = {}

    user.rolesWithContext.forEach((role) => {
      const permissions = rolesByName.get(role.name)?.permissions ?? []

      permissions.forEach((permission) => {
        if (!newPermissionsMap[permission]) {
          newPermissionsMap[permission] = {}
        }

        const permContext = newPermissionsMap[permission]

        Object.entries(role.context).forEach(([key, value]) => {
          if (!permContext[key]) {
            permContext[key] = []
          }
          if (!permContext[key].includes(value)) {
            permContext[key].push(value)
          }
        })
      })
    })

    return new Map(Object.entries(newPermissionsMap))
  }, [user, rolesByName])

  const can = useCallback(
    (permission: string, context: Record<string, string> = {}) => {
      if (!permissionsWithContextMap.has(permission)) return false

      const allowedContexts = permissionsWithContextMap.get(permission)!

      if (Object.keys(context).length === 0) return true

      return Object.entries(context).every(([key, value]) => {
        const allowedValues = allowedContexts[key]
        if (!allowedValues || allowedValues.length === 0) return false
        return allowedValues.includes('*') || allowedValues.includes(value)
      })
    },
    [permissionsWithContextMap]
  )

  const getPermissionsForUser = useCallback(
    (user: User, context: Record<string, string> = {}) => {
      const permissions = new Set<string>()
      if (!user || !user.rolesWithContext) return permissions

      user.rolesWithContext.forEach((role) => {
        const contextMatches = Object.entries(context).every(
          ([key, value]) => role.context?.[key] === value
        )

        if (contextMatches) {
          const rolePermissions = rolesByName.get(role.name)?.permissions ?? []
          rolePermissions.forEach((p) => permissions.add(p))
        }
      })

      return permissions
    },
    [rolesByName]
  )

  const isAdmin = useMemo(() => {
    if (!user || !user.rolesWithContext) return false
    return (
      can(PERMISSIONS.listWorkspaces, { workspace: '*' }) ||
      can(PERMISSIONS.listUsers, { workspace: '*' }) ||
      can(PERMISSIONS.listWorkbenches, { workspace: '*' }) ||
      can(PERMISSIONS.createApp, {}) ||
      can(PERMISSIONS.setPlatformSettings, {})
    )
  }, [user, can])

  const value = {
    PERMISSIONS,
    can,
    getPermissionsForUser,
    isAdmin
  }

  return (
    <AuthorizationContext.Provider value={value}>
      {children}
    </AuthorizationContext.Provider>
  )
}
```

- [ ] **Step 3: Verify these two files compile (ignore consumer errors)**

```bash
pnpm typecheck 2>&1 | grep -v "ROLE_DEFINITIONS\|getRolePermissions\|getWorkspaceRoles\|getWorkbenchRoles\|getAllRoles\|getRoleScope\|getRoleDescription" | head -30
```

- [ ] **Step 4: Commit**

```bash
git add src/config/permissions.ts src/providers/authorization-provider.tsx
git commit -m "feat: remove ROLE_DEFINITIONS; AuthorizationProvider uses useRoles() for permission computation"
```

---

## Task 7: Update role-badge + settings pages

**Files:**
- Modify: `src/components/role-badge.tsx`
- Modify: `src/app/settings/page.tsx`
- Modify: `src/app/settings/profile/page.tsx`

The key change: `getRoleScope(roleName)` currently derives scope from `ROLE_DEFINITIONS[name].attributes`. It is now `rolesByName.get(roleName)?.scope ?? 'platform'`. It is exported and used by the two settings pages.

- [ ] **Step 1: Update role-badge.tsx**

Replace the `ROLE_DEFINITIONS` import and `getRoleScope` function. The new file should:

1. Remove `import { ROLE_DEFINITIONS } from '@/config/permissions'`
2. Add `import { useRoles } from '@/providers/roles-provider'`
3. Replace the local `getRoleScope(roleName: string)` function with one that reads from the map. Because `getRoleScope` is exported and used outside this component, keep it as a standalone exported function that accepts the `rolesByName` map as a parameter:

```typescript
export type RoleScope = 'platform' | 'workspace' | 'session'

export function getRoleScope(
  roleName: string,
  rolesByName: Map<string, { scope?: string }>
): RoleScope {
  const scope = rolesByName.get(roleName)?.scope
  if (scope === 'workspace' || scope === 'session') return scope
  return 'platform'
}
```

4. Inside the `RoleBadge` component, call `useRoles()` and pass `rolesByName` to `getRoleScope`:

```typescript
export function RoleBadge({ role, ... }) {
  const { rolesByName } = useRoles()
  const scope = getRoleScope(role.name, rolesByName)
  const def = rolesByName.get(role.name)
  const description = def?.description ?? ''
  const displayName = ROLE_DISPLAY_NAMES[role.name] ?? role.name
  // rest of component unchanged
}
```

- [ ] **Step 2: Update settings/page.tsx**

Change the `getRoleScope` call from `getRoleScope(r.name)` to `getRoleScope(r.name, rolesByName)`:

1. Add `import { useRoles } from '@/providers/roles-provider'`
2. Inside the component: `const { rolesByName } = useRoles()`
3. Update all `getRoleScope(r.name)` calls to `getRoleScope(r.name, rolesByName)`

- [ ] **Step 3: Update settings/profile/page.tsx**

Same as Step 2 — add `useRoles()`, pass `rolesByName` to `getRoleScope`.

- [ ] **Step 4: Verify**

```bash
pnpm typecheck 2>&1 | grep "role-badge\|settings/page\|settings/profile" | head -10
```

Expected: no errors in these files.

- [ ] **Step 5: Commit**

```bash
git add src/components/role-badge.tsx src/app/settings/page.tsx src/app/settings/profile/page.tsx
git commit -m "feat: role-badge and settings pages use useRoles() for scope and description"
```

---

## Task 8: Update permission-matrix + effective-permission-tags

**Files:**
- Modify: `src/components/permission-matrix.tsx`
- Modify: `src/components/effective-permission-tags.tsx`

- [ ] **Step 1: Update permission-matrix.tsx**

1. Remove `import { getRolePermissions, ROLE_DEFINITIONS } from '@/config/permissions'`
2. Add `import { useRoles } from '@/providers/roles-provider'`
3. Inside the component, add: `const { rolesByName } = useRoles()`
4. Replace every `getRolePermissions(roleName)` call with `rolesByName.get(roleName)?.permissions ?? []`
5. Replace `ROLE_DEFINITIONS[roleName]` lookups with `rolesByName.get(roleName)`

- [ ] **Step 2: Update effective-permission-tags.tsx**

1. Remove `import { getRolePermissions } from '@/config/permissions'`
2. Add `import { useRoles } from '@/providers/roles-provider'`
3. Inside the component: `const { rolesByName } = useRoles()`
4. Replace `getRolePermissions(roleName)` with `rolesByName.get(roleName)?.permissions ?? []`

- [ ] **Step 3: Verify**

```bash
pnpm typecheck 2>&1 | grep "permission-matrix\|effective-permission-tags" | head -10
```

- [ ] **Step 4: Commit**

```bash
git add src/components/permission-matrix.tsx src/components/effective-permission-tags.tsx
git commit -m "feat: permission-matrix and effective-permission-tags use useRoles()"
```

---

## Task 9: Update workspace/session member components

**Files:**
- Modify: `src/components/workspace-user-table.tsx`
- Modify: `src/components/session-members-sheet.tsx`
- Modify: `src/components/forms/create-user-role-dialog.tsx`
- Modify: `src/components/forms/add-user-to-workspace-dialog.tsx`
- Modify: `src/components/forms/manage-user-workspace-dialog.tsx`
- Modify: `src/components/forms/manage-user-workbench-dialog.tsx`

- [ ] **Step 1: Update workspace-user-table.tsx**

1. Remove `import { ROLE_DEFINITIONS } from '@/config/permissions'`
2. Add `import { useRoles } from '@/providers/roles-provider'`
3. Inside the component: `const { rolesByName } = useRoles()`
4. Replace `ROLE_DEFINITIONS[role]?.description` with `rolesByName.get(role)?.description ?? ''`

- [ ] **Step 2: Update session-members-sheet.tsx**

1. Remove `import { ROLE_DEFINITIONS } from '@/config/permissions'`
2. Add:
```typescript
import { ROLE_DISPLAY_NAMES } from '@/config/permissions'
import { useRoles } from '@/providers/roles-provider'
```
3. Inside the component: `const { rolesByName } = useRoles()`
4. Replace `ROLE_DEFINITIONS[role]?.displayName ?? role` with `ROLE_DISPLAY_NAMES[role] ?? role`
5. Replace `ROLE_DEFINITIONS[role]?.description` with `rolesByName.get(role)?.description ?? ''`

- [ ] **Step 3: Update create-user-role-dialog.tsx**

1. Remove `import { getAllRoles, ROLE_DEFINITIONS } from '@/config/permissions'`
2. Add:
```typescript
import { ROLE_DISPLAY_NAMES } from '@/config/permissions'
import { useRoles } from '@/providers/roles-provider'
```
3. Inside the component: `const { roles } = useRoles()`
4. Replace `getAllRoles()` with `roles.map(r => ({ ...r, id: r.name, context: {} }))`
5. Replace `ROLE_DEFINITIONS[r.name]?.displayName ?? r.name` with `ROLE_DISPLAY_NAMES[r.name] ?? r.name`

- [ ] **Step 4: Update add-user-to-workspace-dialog.tsx**

1. Remove `import { getWorkspaceRoles } from '@/config/permissions'`
2. Add `import { useRoles } from '@/providers/roles-provider'`
3. Inside the component: `const { roles } = useRoles()`
4. Replace `getWorkspaceRoles()` with `roles.filter(r => r.scope === 'workspace')`

- [ ] **Step 5: Update manage-user-workspace-dialog.tsx**

Same as Step 4.

- [ ] **Step 6: Update manage-user-workbench-dialog.tsx**

1. Remove `import { getWorkbenchRoles } from '@/config/permissions'`
2. Add `import { useRoles } from '@/providers/roles-provider'`
3. Inside the component: `const { roles } = useRoles()`
4. Replace `getWorkbenchRoles()` with `roles.filter(r => r.scope === 'session')`

- [ ] **Step 7: Verify**

```bash
pnpm typecheck 2>&1 | grep "workspace-user-table\|session-members\|create-user-role\|add-user-to-workspace\|manage-user-workspace\|manage-user-workbench" | head -15
```

- [ ] **Step 8: Commit**

```bash
git add \
  src/components/workspace-user-table.tsx \
  src/components/session-members-sheet.tsx \
  src/components/forms/create-user-role-dialog.tsx \
  src/components/forms/add-user-to-workspace-dialog.tsx \
  src/components/forms/manage-user-workspace-dialog.tsx \
  src/components/forms/manage-user-workbench-dialog.tsx
git commit -m "feat: workspace/session role assignment components use useRoles()"
```

---

## Task 10: Update admin pages

**Files:**
- Modify: `src/app/admin/page.tsx`
- Modify: `src/app/admin/authorization/roles/page.tsx`
- Modify: `src/app/admin/users/user-roles-matrix.tsx`

- [ ] **Step 1: Update admin/page.tsx**

1. Remove `import { ROLE_DEFINITIONS } from '@/config/permissions'`
2. Add `import { useRoles } from '@/providers/roles-provider'`
3. Inside the component: `const { roles } = useRoles()`
4. Replace `Object.keys(ROLE_DEFINITIONS).length` with `roles.length`

- [ ] **Step 2: Update admin/authorization/roles/page.tsx**

This page currently has a local `getRoleScope(def: RoleDefinition)` that derives scope from attributes. With the API, `scope` is a direct field.

Replace the entire file content:

```typescript
'use client'

import { useMemo, useState } from 'react'

import { PermissionMatrix } from '@/components/permission-matrix'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { ROLE_DISPLAY_NAMES } from '@/config/permissions'
import { AuthorizationRole } from '@/domain/model/authorization'
import { cn } from '@/lib/utils'
import { useRoles } from '@/providers/roles-provider'

type Scope = 'platform' | 'workspace' | 'session'

const scopeLabels: Record<Scope, string> = {
  platform: 'Platform',
  workspace: 'Workspace',
  session: 'Session'
}

export default function RolesPage() {
  const { roles, rolesByName } = useRoles()
  const [selectedRole, setSelectedRole] = useState<string>('WorkspaceMember')
  const [scopeFilter, setScopeFilter] = useState<Scope>('platform')

  const groupedRoles = useMemo(() => {
    const groups: Record<Scope, AuthorizationRole[]> = {
      platform: [],
      workspace: [],
      session: []
    }
    for (const role of roles) {
      groups[role.scope].push(role)
    }
    return groups
  }, [roles])

  const visibleRoles = groupedRoles[scopeFilter] ?? []
  const selectedDef = rolesByName.get(selectedRole)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Role Matrix</h1>
        <p className="text-sm text-muted-foreground">
          View role definitions and their permission grants
        </p>
      </div>

      <div className="flex gap-2">
        {(Object.keys(scopeLabels) as Scope[]).map((scope) => (
          <button
            key={scope}
            onClick={() => setScopeFilter(scope)}
            className={cn(
              'rounded-full border border-accent px-4 py-1.5 text-sm font-medium capitalize transition-colors',
              scopeFilter === scope
                ? 'bg-accent text-accent-foreground'
                : 'text-accent hover:bg-accent/10'
            )}
          >
            {scopeLabels[scope]}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        <div className="w-64 flex-shrink-0 overflow-y-auto rounded-lg border bg-card p-2 shadow-sm">
          <p className="mb-1 mt-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            {scopeFilter} roles
          </p>
          {visibleRoles.map((role) => (
            <TooltipProvider key={role.name} delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setSelectedRole(role.name)}
                    className={cn(
                      'flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
                      selectedRole === role.name
                        ? 'bg-accent/20 text-accent'
                        : 'text-foreground hover:bg-accent/10'
                    )}
                  >
                    {ROLE_DISPLAY_NAMES[role.name] ?? role.name}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs text-xs">
                  {role.description}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        {selectedDef && (
          <div className="min-w-0 flex-1 rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 space-y-1">
              <div className="flex items-start gap-4">
                <h2 className="text-lg font-semibold">
                  {ROLE_DISPLAY_NAMES[selectedRole] ?? selectedRole}
                </h2>
                <Badge
                  variant="outline"
                  className="mt-1 border-accent text-accent"
                >
                  {scopeLabels[selectedDef.scope]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedDef.description}
              </p>
            </div>

            <PermissionMatrix
              roleNames={[selectedRole]}
              scopeFilter={scopeFilter}
              highlightInherited={false}
              readOnly={true}
            />
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Update admin/users/user-roles-matrix.tsx**

1. Remove `import { ROLE_DEFINITIONS, type RoleDefinition } from '@/config/permissions'`
2. Remove the local `getRoleScope(def: RoleDefinition)` function
3. Add:
```typescript
import { ROLE_DISPLAY_NAMES } from '@/config/permissions'
import { useRoles } from '@/providers/roles-provider'
```
4. Inside the component: `const { roles, rolesByName } = useRoles()`
5. Replace `Object.entries(ROLE_DEFINITIONS).filter(([name, def]) => getRoleScope(def) === scope && name !== 'Public')` with:
```typescript
roles.filter(r => r.scope === scope && r.name !== 'Public')
```
6. Replace `ROLE_DEFINITIONS[name]?.displayName ?? name` with `ROLE_DISPLAY_NAMES[name] ?? name`

- [ ] **Step 4: Verify**

```bash
pnpm typecheck 2>&1 | grep "admin/page\|authorization/roles\|user-roles-matrix" | head -10
```

- [ ] **Step 5: Commit**

```bash
git add \
  src/app/admin/page.tsx \
  src/app/admin/authorization/roles/page.tsx \
  src/app/admin/users/user-roles-matrix.tsx
git commit -m "feat: admin pages use useRoles() for role lists, scopes, and descriptions"
```

---

## Task 11: Final type-check and cleanup

- [ ] **Step 1: Run full type-check**

```bash
pnpm typecheck 2>&1
```

Expected: zero errors. If there are errors, fix them before proceeding.

- [ ] **Step 2: Run all tests**

```bash
pnpm test:run
```

Expected: all existing tests still pass, plus the 7 new tests from Tasks 1 and 3.

- [ ] **Step 3: Run the dev server and verify the app loads**

```bash
pnpm dev
```

Open the browser. Verify:
- Login page loads (unauthenticated — `RolesProvider` does not block)
- After login, the workspace list and dashboard appear (roles loaded successfully)
- Open `/admin/authorization/roles` — role list populated from API, descriptions visible
- Open a workspace → Members tab — role descriptions visible in column header tooltips
- Open `/settings` or `/settings/profile` — roles grouped by scope correctly

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete API-driven roles — all consumers migrated from ROLE_DEFINITIONS to useRoles()"
```
