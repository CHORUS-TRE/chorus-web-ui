# Brainstorming Session: User Rights & Management Interfaces
**Date**: 2026-01-28
**Topic**: Refactoring User Rights and Permissions & Admin Dashboard Structure

## 1. Global vs Local Management Interfaces
**Question**: Should management interfaces (Workspace, User, App Store) be centralized in `/admin/*` or contextual (e.g., `/workspaces/:id/settings`)?

**Analysis (Six Thinking Hats / Pros & Cons):**

### Option A: Centralized (`/admin/*`)
*   **Concept**: All management happens in a dedicated Admin Portal.
*   **Pros**: 
    *   Technical simplicity (one layout).
    *   Clear separation of "using" vs "managing".
    *   Great for Super Admins.
*   **Cons**:
    *   Confusing for a "Workspace Manager" who is just a user with extra rights on *one* workspace. They shouldn't feel like a "System Admin".
    *   Context switching: To change a workspace setting, you leave the workspace context.

### Option B: Contextual (`/workspaces/:id/settings`)
*   **Concept**: Management is embedded where the resource lives.
*   **Pros**: 
    *   Better UX for Workspace Managers. "I am here, I change settings here."
*   **Cons**:
    *   Harder for Super Admins to audit *all* workspaces quickly (unless they have a separate list).

### Option C: Hybrid / Harmonized (Recommended)
*   **Concept**: 
    *   **Platform Levels**: `/admin/users`, `/admin/workspaces`, `/admin/app-store`. Only for `SuperAdmin`, `PlatformUserManager`.
    *   **Workspace Levels**: `/workspaces/:id/settings` (General, Members). For `WorkspaceAdmin`, `WorkspaceMaintainer`.
*   **Implementation**: 
    *   Reuse components! `UserList` component can be used in `/admin/users` (all users) and `/workspaces/:id/settings/members` (filtered).
    *   *Redirection*: If a user tries to access `/admin/workspaces/:id` but only has access to that specific workspace, redirect them to `/workspaces/:id/settings`.

## 2. Technical Refactoring
**Goal**: Remove WASM and use pure TS for authorization.
*   **Action**: Migrate `default_schema.yaml` logic into a TypeSafe TypeScript definition (`src/config/permissions.ts`).
*   **Benefit**: Easier to debug, no build step for WASM, faster load.

## 3. Interfaces to Create
*   **/admin/users**: Table of all platform users. Actions: Block, Reset Password, Assign Platform Roles.
*   **/admin/workspaces**: List of all workspaces. Actions: Delete, View Details.
*   **/admin/app-store**: Global App Store settings.
*   **/workspaces/:id/settings**:
    *   **General**: Rename, Description.
    *   **Members**: Add/Remove members, Change Workspace Roles (Guest -> Maintainer).

## Decision Required
*   Do we agree with **Option C** (Hybrid)?
*   Confirm removal of WASM in favor of `PermissionService.ts`.
