# API-Driven Roles Design

**Date:** 2026-06-02
**Status:** Approved
**Author:** Manuel Spuhler

## Context

Role definitions (`name`, `description`, `scope`, `permissions[]`, `context[]`) are currently hardcoded in `src/config/permissions.ts` as `ROLE_DEFINITIONS`. The backend already exposes `GET /api/rest/v1/authorization/roles` returning `chorusAuthorizationRole` with all these fields (including a flat, server-resolved `permissions[]`). The frontend has never called this endpoint. This design replaces the hardcoded local schema with API-driven data. **API wins**: the list of roles shown and permissions computed come exclusively from the API response.

## Decision

Approach C — full data layer: `DataSource → Repository → RolesProvider → consumers`.

Rationale: consistent with the rest of the codebase pattern; the `dynamic` field on `ChorusAuthorizationRole` signals custom roles are coming, so the plumbing should be in place.

---

## Architecture

### New files

| File | Purpose |
|---|---|
| `src/domain/model/authorization.ts` | `AuthorizationRole` domain model + Zod schema |
| `src/data/data-source/chorus-api/authorization-data-source.ts` | Wraps `AuthorizationServiceApi.authorizationServiceListRoles()` |
| `src/data/repository/authorization-repository-impl.ts` | Maps `ChorusAuthorizationRole → AuthorizationRole`, validates, returns `Result<AuthorizationRole[]>` |
| `src/providers/roles-provider.tsx` | Fetches once on mount, exposes `useRoles()` |

### Modified files

| File | Change |
|---|---|
| `src/domain/repository/authorization-repository.ts` | Add `listRoles(): Promise<Result<AuthorizationRole[]>>` |
| `src/data/repository/index.ts` | Export `AuthorizationRepositoryImpl` |
| `src/app/layout.tsx` | Add `<RolesProvider>` between `<AuthenticationProvider>` and `<AuthorizationProvider>` |
| `src/providers/authorization-provider.tsx` | Replace `getRolePermissions()` with `rolesByName.get(name)?.permissions ?? []` |
| `src/config/permissions.ts` | Delete `ROLE_DEFINITIONS`, `RoleDefinition`, `getRolePermissions()`, `getRoleScope()`, `getAllRoles()`; keep `PERMISSIONS`, `WORKSPACE_PERMISSIONS_DISPLAY`; add `ROLE_DISPLAY_NAMES` |
| 12 consumer files (see below) | Replace `ROLE_DEFINITIONS` / `getRolePermissions()` / `getRoleScope()` with `useRoles()` |

---

## Domain Model

```typescript
// src/domain/model/authorization.ts
import { z } from 'zod'

export const AuthorizationRoleSchema = z.object({
  name: z.string(),
  description: z.string().default(''),
  scope: z.enum(['platform', 'workspace', 'session']).default('platform'),
  permissions: z.array(z.string()).default([]),
  context: z.array(z.string()).default([]),
  dynamic: z.boolean().default(false),
})

export type AuthorizationRole = z.infer<typeof AuthorizationRoleSchema>
```

---

## Data Source

```typescript
// src/data/data-source/chorus-api/authorization-data-source.ts
interface AuthorizationDataSource {
  listRoles(): Promise<ChorusListRolesReply>
}

class AuthorizationApiDataSourceImpl implements AuthorizationDataSource {
  private service: AuthorizationServiceApi
  constructor(basePath: string) { … }
  listRoles() { return this.service.authorizationServiceListRoles() }
}
```

---

## Repository

Extend `AuthorizationRepository` interface:
```typescript
listRoles(): Promise<Result<AuthorizationRole[]>>
```

`AuthorizationRepositoryImpl.listRoles()`:
- Calls `dataSource.listRoles()`
- Parses each item with `z.array(AuthorizationRoleSchema).safeParse(response.result?.roles)`
- Returns `Result<AuthorizationRole[]>` (error string on failure)

---

## RolesProvider

```typescript
// src/providers/roles-provider.tsx
interface RolesContextType {
  roles: AuthorizationRole[]
  rolesByName: Map<string, AuthorizationRole>
}

export const useRoles = (): RolesContextType => useContext(RolesContext)
```

Behaviour:
- Reads `user` from `useAuthentication()`
- If `user` is null (unauthenticated): renders children immediately with empty `roles` / `rolesByName` — does not block; the login page must not be gated behind a roles fetch
- If `user` is present: fetches `authorizationRepository.listRoles()`; while loading, renders a full-page loading spinner; on error, renders an error screen with retry
- Refetches when `user` identity changes (login / session change) via `useEffect([user])`
- No refetch on every render (roles are stable per session)

---

## AuthorizationProvider Update

`permissionsWithContextMap` computation changes from:
```typescript
const permissions = getRolePermissions(role.name)  // local chain traversal
```
to:
```typescript
const permissions = rolesByName.get(role.name)?.permissions ?? []
```

`getPermissionsForUser` similarly uses `rolesByName.get(role.name)?.permissions ?? []`.

If `rolesByName` doesn't have an entry for a role name, that role grants no permissions (API wins — no local fallback).

---

## `permissions.ts` Cleanup

**Keep:**
- `PERMISSIONS` — action name constants used throughout `can()` calls
- `WORKSPACE_PERMISSIONS_DISPLAY` — UI config for permissions breakdown widget

**Add:**
```typescript
export const ROLE_DISPLAY_NAMES: Record<string, string> = {
  WorkbenchViewer: 'Session Viewer',
  WorkbenchMember: 'Session Member',
  WorkbenchAdmin: 'Session Admin',
}
```

**Delete:**
- `RoleDefinition` interface
- `ROLE_DEFINITIONS` object
- `getRolePermissions()`
- `getRoleScope()`
- `getRoleDescription()`
- `getAllRoles()`

---

## Provider Tree Change (`layout.tsx`)

```tsx
<AuthenticationProvider>
  <RolesProvider>              {/* new — fetches listRoles(), gates until loaded */}
    <AuthorizationProvider>    {/* unchanged — consumes useRoles() */}
      …
    </AuthorizationProvider>
  </RolesProvider>
</AuthenticationProvider>
```

---

## Consumer Updates (12 files)

All 12 files replace local `ROLE_DEFINITIONS` / `getRolePermissions()` / `getRoleScope()` with `useRoles()`:

| File | Specific change |
|---|---|
| `providers/authorization-provider.tsx` | `getRolePermissions(name)` → `rolesByName.get(name)?.permissions ?? []` |
| `components/role-badge.tsx` | `ROLE_DEFINITIONS[name]` → `rolesByName.get(name)`; exported `getRoleScope(name)` → reads `role.scope` from map |
| `components/permission-matrix.tsx` | `getRolePermissions(name)` → `rolesByName.get(name)?.permissions ?? []`; `ROLE_DEFINITIONS[name]` → map lookup |
| `components/effective-permission-tags.tsx` | `getRolePermissions(name)` → map lookup |
| `components/workspace-user-table.tsx` | `ROLE_DEFINITIONS[role]?.description` → map lookup |
| `components/session-members-sheet.tsx` | `ROLE_DEFINITIONS[role]?.displayName` → `ROLE_DISPLAY_NAMES[role] ?? role`; `.description` → map lookup |
| `components/forms/create-user-role-dialog.tsx` | `getAllRoles()` → `roles` from `useRoles()`; `ROLE_DEFINITIONS[r.name]?.displayName` → `ROLE_DISPLAY_NAMES` |
| `app/admin/authorization/roles/page.tsx` | `Object.entries(ROLE_DEFINITIONS)` → `roles` from `useRoles()`; local `getRoleScope(def)` → `role.scope` |
| `app/admin/users/user-roles-matrix.tsx` | Same pattern; `ROLE_DEFINITIONS[name]?.displayName` → `ROLE_DISPLAY_NAMES` |
| `app/admin/page.tsx` | `Object.keys(ROLE_DEFINITIONS).length` → `roles.length` |
| `app/settings/page.tsx` | `getRoleScope(r.name)` (imported from role-badge) → `rolesByName.get(r.name)?.scope` |
| `app/settings/profile/page.tsx` | Same |

---

## What Does Not Change

- `PERMISSIONS` constants and all `can()` call sites — unchanged
- `AuthorizationRepository.isUserAllowed()` and `getUserPermissions()` — unchanged
- Permission computation logic in `AuthorizationProvider` — same algorithm, different data source
- `WORKSPACE_PERMISSIONS_DISPLAY` — unchanged

---

## Open Questions

None.
