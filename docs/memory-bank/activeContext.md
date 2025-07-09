# Active Context

## 1. Current Work Focus

**Primary Task: Implement Workbench k8sStatus Loading State**

The current priority is to implement proper loading states for workbench creation based on the k8sStatus field from the API. This will ensure that the background iframe only displays when the workbench is actually running ("Running" status), providing better user experience and preventing users from seeing non-functional sessions.

**Key Requirements:**
- Monitor k8sStatus field from workbench API responses
- Only show background iframe when k8sStatus is "Running"
- Display loading states during workbench initialization
- Handle polling, timeouts, and error states gracefully

## 2. Recent Changes

- **Role Management Feature Complete (Phase 1):** The platform-level user and role management features are complete. Further work on workspace-level roles is on hold.
- **Platform-Level Role Management UI Implemented:** A new section for managing roles and permissions (the "permission matrix") has been built at `/admin/roles`.
- **Role Assignment Integrated:** The user management UI (`/admin/users`) now supports assigning one or more roles to users during creation and editing.
- **Data Layers for Roles Created:** The necessary data models, repositories, and use cases for the `Role` entity have been implemented.
- **Authentication Refactor Progress:** The authentication flow has been successfully moved to client-side with background iframe integration.

## 3. Next Steps

**Immediate Implementation Plan:**

### Phase 1: Domain Model Updates
1. Add `K8sWorkbenchStatus` enum (RUNNING, STOPPED, KILLED, etc.)
2. Add `k8sStatus` field to WorkbenchSchema
3. Update workbench types and mappers

### Phase 2: Polling Mechanism
1. Create `useWorkbenchStatus` hook for status polling
2. Implement polling logic (2-3 second intervals)
3. Handle timeout scenarios (5 minute max)
4. Add exponential backoff for errors

### Phase 3: UI Loading States
1. Update BackgroundIframe to check k8sStatus before displaying
2. Add loading overlay with appropriate messaging
3. Update workbench creation flow to poll until "Running"
4. Update workbench table to show k8sStatus

### Phase 4: Error Handling & Polish
1. Handle polling errors gracefully
2. Add retry mechanisms
3. Update session page loading states
4. Add timeout error messages

**Files to Modify:**
- `src/domain/model/workbench.ts`
- `src/data/data-source/chorus-api/workbench-mapper.ts`
- `src/components/background-iframe.tsx`
- `src/components/hooks/use-workbench-status.ts` (new)
- `src/components/forms/workbench-create-form.tsx`
- `src/components/workbench-table.tsx`
- `src/app/(workspaces)/workspaces/[workspaceId]/sessions/[sessionId]/page.tsx`

## 4. Active Decisions & Considerations

- **Polling Strategy:** Use 2-3 second intervals with 5-minute timeout to balance responsiveness with server load
- **Loading State Design:** Show loading overlay instead of broken iframe to improve user experience
- **Error Handling:** Provide clear error messages and retry options when workbench fails to start
- **Backwards Compatibility:** Ensure k8sStatus field is optional to maintain compatibility with existing workbenches
- **Performance:** Implement proper cleanup of polling intervals to prevent memory leaks

## 5. Technical Approach

Following the established Clean Architecture patterns:
- Domain models define k8sStatus enums and validation
- Data mappers handle API to domain model translation
- Custom hooks manage polling and state management
- UI components react to status changes with appropriate loading states
- Error boundaries handle failure scenarios gracefully
