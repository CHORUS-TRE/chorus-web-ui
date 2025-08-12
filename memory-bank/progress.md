# Progress

## 1. What Works

- **Workbench k8sStatus Loading State:** The feature is functionally complete. The UI correctly displays loading states, polls the backend, and only shows the session iframe when the workbench is "Running".
- **Complete Role Management System (Mock):** Full platform-level role and permission management is implemented with mock data.
  - Role matrix UI at `/admin/roles` with permission assignment
  - Recursive role inheritance support in domain models
  - Complete data layer implementation (repositories, data sources, mappers)
  - Integration with user management for role assignment
  - RoleMatrix component for visual permission management
- **Platform-Level User Management:** Full-featured UI for administrators to manage users (create, read, update, delete) with role assignment capabilities.
- **Complete End-to-End Data Flow:** The clean architecture data flow pattern is fully implemented across all entities: `App`, `User`, `AppInstance`, `Workspace`, `Workbench`, and `Role`.
- **Robust UI Components:** Comprehensive UI components for resource management with validation, error handling, and notifications.
- **Public-Facing Registration:** The `UserRegisterForm` is aligned with architectural patterns.
- **Server-Side Data Loading:** Initial server-side data fetching follows Next.js best practices.
- **Effective Core Architecture:** The Clean Architecture structure proves effective across all implemented features.
- **Integrated Notification System:** The notification system is successfully integrated throughout the data flow.
- **Authentication Type System:** All authentication-related TypeScript type errors have been resolved with proper type safety maintained throughout the login flow.
- **✅ Consistent Repository Pattern:** All repository create methods now follow the same pattern - returning the full entity object instead of just an ID.
- **✅ Stable Test Suite:** All tests are passing (61 tests pass, 10 skipped, 11 test suites).
- **✅ Client-Side Authentication:** Authentication flow successfully refactored to client-side with background iframe integration.
  - **OAuth Redirect Handler:** The `/oauthredirect` route is now a fully client-side component (`page.tsx`). It directly calls the `handleOAuthRedirect` action, consolidating logic and removing the need for a separate server-side API handler for the callback. This pattern was chosen to simplify the flow.
- **✅ OpenAPI API Update Complete:** All data sources and repositories updated to handle new nested API response structure.
  - **Data Source Updates:** All data sources (`authentication`, `user`, `app`, `workbench`, `app-instance`, `workspace`) updated to handle new API method names and request body formats
  - **Repository Updates:** All repositories updated to parse nested response objects (e.g., `response.result.users` instead of `response.result`)
  - **Authorization Provider:** Mock implementations added to resolve TypeScript compilation errors while WASM integration is pending
  - **Form Validation:** Workspace form validation issues resolved with proper default values for `shortName` field (minimum 3 characters required)

## 2. Current Work

### Active Development

- **Gatekeeper Authorization Integration:**
  - **Goal:** Replace the mock role management system with a real implementation by integrating the `chorus-gatekeeper` service.
  - **User Experience:** UI elements will become visible or disabled based on real-time user permissions.

### Technical Implementation Status

- **Authorization Domain Models:** TODO
- **Gatekeeper Data Source:** TODO
- **Gatekeeper Repository:** TODO
- **UI Integration:** TODO

### Next Concrete Features

- **Dynamic UI based on permissions.**

### Future Work / On Hold

- **Workspace-Level Role Management:** Team member and role management within specific workspaces is on hold.
- **Workbench k8sStatus Polish:** Final error handling and polish for this feature is de-prioritized.

### Ongoing Tasks

- **Test Coverage Expansion:** Continue adding tests, especially for the new workbench status polling and loading state features.

## 3. Current Status

- **New Feature In Progress:** The focus has shifted from workbench status to implementing authorization.
- **Major Architecture Milestone:** Role management and client-side authentication demonstrate the maturity and effectiveness of the established architectural patterns.
- **Branch Status:** Working on `feat/authz` branch for Gatekeeper integration.
- **Architecture Proven:** The core data and UI patterns have been successfully applied across all major entities and are ready for the new feature.
- **✅ Test Suite Stability:** All tests are passing consistently.
- **✅ Authentication Complete:** Client-side authentication refactor is complete and stable.
- **Background Iframe Premature Display:** Resolved. The iframe now waits for the "Running" status.

## 4. Known Issues

- **API Client Desynchronization:** The `k8sStatus` field was manually added to the generated `ChorusWorkbench.ts` client model. The OpenAPI client should be regenerated to ensure consistency.
- **Backend API Response Structure Mismatch:** There may be a mismatch between the OpenAPI specification and actual backend API responses. The generated client expects nested structures (e.g., `{result: {apps: [...]}}`) but the backend may be returning direct arrays (e.g., `{result: [...]}`). This was temporarily resolved through error handling in the data source layer.
- **Mock Role Data:** Role management currently uses placeholder/mock data pending integration with `chorus-gatekeeper` service.

## 5. Recent Fixes

- **OpenAPI API Update Implementation (2025-01-28):** Comprehensive update to align frontend with new OpenAPI specification structure.
  - **Data Source Layer:** Updated all data sources to handle new API method names (`List` instead of `Get` for list operations) and request body formats (direct entity objects instead of wrapped objects)
  - **Repository Layer:** Updated all repositories to parse nested API responses (`response.result.users` instead of `response.result`)
  - **Authorization Provider:** Added mock implementations for `isUserAllowed` and `getUserPermissions` to resolve compilation errors
  - **Form Validation:** Fixed workspace form submission issues by providing proper default values for `shortName` field validation
  - **Test Suite:** Updated all API-related tests to match new nested response structure
  - **App Listing Error:** Resolved `json.result.map is not a function` error through proper response structure handling
- **Workbench k8sStatus UI (2025-01-28):** Completed Phase 3 of the workbench status feature, integrating the polling hook and loading states into all relevant UI components.
- **Workbench k8sStatus Backend (2025-01-28):** Completed Phase 1 & 2 of the workbench status feature, including domain model updates and the creation of the `useWorkbenchStatus` polling hook.
- **OAuth Redirect Flow:** Refactored the OAuth redirect handler to be fully client-side. The logic from the `/api/auth/callback` route was moved directly into the `/oauthredirect/page.tsx` component, and the server-side route was deleted.

## 6. Upcoming Implementation

**Gatekeeper Authorization Integration:**

- **Timeline:** Starting now.
- **Impact:** Will provide real, fine-grained access control across the application, replacing the current mock data system.
- **Technical Approach:** Implement a new data layer for `gatekeeper` and integrate it with UI components to dynamically show/hide elements based on user permissions.
- **Testing Strategy:** End-to-end testing of the authorization flow.
