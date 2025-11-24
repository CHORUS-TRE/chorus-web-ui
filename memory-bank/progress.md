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
- **✅ WASM Authorization Integration:** Successfully integrated the chorus-gatekeeper WASM module for real-time authorization checks.
  - **WASM Loading:** Proper WASM module initialization with error handling and loading states
  - **Authorization Functions:** Exposed `isUserAllowed` and `getUserPermissions` functions from WASM
  - **TypeScript Integration:** Complete type safety with proper interfaces for WASM service
  - **Context Provider:** Authorization context provides real WASM-based authorization throughout the app
- **✅ Sidebar Navigation UX (2025-11-19):** Left sidebar now uses independent chevron toggles so group labels always navigate while disclosure controls solely expand/collapse. Workspace counts are surfaced via shadcn `Badge`, improving information scent without extra clicks.
- **✅ Client-Side Authentication:** Authentication flow successfully refactored to client-side with background iframe integration.
  - **OAuth Redirect Handler:** The `/oauthredirect` route is now a fully client-side component (`page.tsx`). It directly calls the `handleOAuthRedirect` action, consolidating logic and removing the need for a separate server-side API handler for the callback. This pattern was chosen to simplify the flow.
  - **✅ Deep Link Preservation:** Implemented client-side mechanism to preserve redirect URLs during OAuth flow
    - Users visiting protected URLs (e.g., `/workspaces/143/sessions`) are now properly redirected back after Keycloak authentication
    - Uses secure sessionStorage-based solution with comprehensive URL validation
    - Handles edge cases including authentication errors and invalid URLs
- **✅ OpenAPI API Update Complete:** All data sources and repositories updated to handle new nested API response structure.
  - **Data Source Updates:** All data sources (`authentication`, `user`, `app`, `workbench`, `app-instance`, `workspace`) updated to handle new API method names and request body formats
  - **Repository Updates:** All repositories updated to parse nested response objects (e.g., `response.result.users` instead of `response.result`)
  - **Authorization Provider:** Mock implementations added to resolve TypeScript compilation errors while WASM integration is pending
  - **Form Validation:** Workspace form validation issues resolved with proper default values for `shortName` field (minimum 3 characters required)

## 2. Current Work

### Active Development

- **Authorization UI Integration:**
  - **Goal:** Connect the working WASM authorization system to UI components for dynamic permission-based rendering.
  - **User Experience:** UI elements will become visible or disabled based on real-time user permissions from the WASM gatekeeper.

### Technical Implementation Status

- **✅ Authorization WASM Integration:** Complete - WASM module loads and exposes authorization functions
- **✅ Authorization Provider:** Complete - Context provider with `isUserAllowed` and `getUserPermissions` functions
- **✅ TypeScript Integration:** Complete - Full type safety for WASM interfaces
- **UI Integration:** IN PROGRESS - Connect authorization context to UI components

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
- **UI Authorization Integration:** While the WASM authorization system is working, UI components are not yet connected to use real permission checks for dynamic rendering.

## 5. Recent Fixes

- **Test Suite Infrastructure (2025-01-13):** Comprehensive fix of failing test suite due to phantom dependencies and API structure mismatches.
  - **Canvas Dependency Issue:** Removed phantom `@llamaindex/pdf-viewer` dependency that was causing canvas loading errors in test environment
  - **API Response Structure:** Updated all test mocks to match the correct nested API response structure (`{ result: { workspace: {...} } }` instead of `{ result: { id: '1' } }`)
  - **Complete Mock Objects:** Fixed test failures by providing complete mock objects that pass schema validation instead of minimal objects
  - **Test Expectations:** Updated test expectations to match current repository behavior (single API call instead of create + get pattern)
  - **TypeScript Configuration:** Added `ts-node` dependency for proper Jest TypeScript configuration parsing
  - **Result:** All tests now pass consistently (61 tests pass, 10 skipped, 11 test suites)
- **WASM Authorization Integration (2025-01-13):** Successfully integrated the chorus-gatekeeper WASM module for real authorization.
  - **WASM Loading:** Implemented proper WASM module loading with error handling and initialization states
  - **Function Exposure:** Successfully exposed `isUserAllowed` and `getUserPermissions` functions from WASM
  - **TypeScript Safety:** Added complete TypeScript interfaces for WASM service and global functions
  - **Authorization Context:** Updated authorization provider to use real WASM functions instead of mocks
  - **React Hook Fix:** Resolved React Hook dependency warnings in authorization view model
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
- **OAuth Deep Link Enhancement (2025-01-30):** Implemented comprehensive client-side redirect mechanism for preserving user's intended destination during OAuth authentication flow.
  - **Redirect Storage Utility:** Created `src/utils/redirect-storage.ts` with secure sessionStorage management
  - **URL Validation:** Added comprehensive validation to prevent open redirect attacks
  - **Login Form Enhancement:** Modified `handleOAuthLogin` to capture current page URL before OAuth redirect
  - **Redirect Handler Update:** Enhanced `/oauthredirect/page.tsx` to retrieve and use stored URLs
  - **Error Handling:** Added automatic cleanup of stored URLs on authentication failures
  - **User Experience:** Users can now visit any protected URL and be redirected back after successful OAuth authentication
- **Sidebar Navigation Improvements (2025-11-19):** Refined `AppSidebar` with collapsible groups controlled by `SidebarGroupToggle`, ensured labels remain pure links, added workspace count badge, and standardized nav header spacing/logo sizing for clarity.

## 6. Upcoming Implementation

**Authorization UI Integration:**

- **Timeline:** Next priority.
- **Impact:** Will provide dynamic UI rendering based on real user permissions from the WASM gatekeeper.
- **Technical Approach:** Connect the working authorization context to UI components to dynamically show/hide elements based on user permissions.
- **Current Status:** WASM integration complete, UI integration in progress.
