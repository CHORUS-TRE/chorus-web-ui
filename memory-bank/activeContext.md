# Active Context

## 1. Current Work Focus

**Primary Task: Implement Gatekeeper Authorization Integration**

With the `k8sStatus` feature functionally complete, the project focus is shifting to implementing a robust authorization layer. This involves integrating the `chorus-gatekeeper` service to replace the existing mock role data and enforce permissions throughout the UI.

**Key Requirements:**

- Define and implement domain models for authorization entities (permissions, policies).
- Integrate the `gatekeeper` client/library.
- Update UI components to reflect real-time user permissions.
- Remove mock authorization data and handlers.

## 2. Recent Changes

- **Workbench k8sStatus Feature Complete:**
  - The feature for polling and displaying workbench status is now considered functionally complete. Final polishing will be de-prioritized to focus on authorization.
- **Client-Side OAuth Redirect Complete:**
  - The OAuth redirect flow was refactored to be fully client-side.
  - Logic was consolidated from a server-side API route into the `oauthredirect/page.tsx` component.

## 3. Next Steps

**Immediate Implementation Plan:**

### Phase 1: Models and Gatekeeper Integration

1. **TODO** - Define Zod schemas for Gatekeeper entities (Permissions, Roles, Policies) in the domain layer.
2. **TODO** - Implement data source and repository for fetching authorization data from the Gatekeeper service.
3. **TODO** - Create use cases for managing authorization state.

**Files to Modify:**

- `src/domain/model/` (new files for authorization)
- `src/data/data-source/` (new gatekeeper data source)
- `src/data/repository/` (new authorization repository)
- `src/domain/use-cases/` (new authorization use cases)

## 4. Active Decisions & Considerations

- **Gatekeeper Client Source:** The authorization logic will be based on the library provided in `src/lib/gatekeeper`.
- **API Client Desynchronization:** The `k8sStatus` field was manually added to the `ChorusWorkbench.ts` model. The API client should still be regenerated when possible.
