# Active Context

## 1. Current Work Focus

The current priority is to refactor the authentication flow to be primarily client-side. The goal is to move data fetching for authentication state out of server components and into client components to simplify state management and improve responsiveness.

## 2. Recent Changes

- **Role Management Feature Complete (Phase 1):** The platform-level user and role management features are complete. Further work on workspace-level roles is on hold.
- **Platform-Level Role Management UI Implemented:** A new section for managing roles and permissions (the "permission matrix") has been built at `/admin/roles`.
- **Role Assignment Integrated:** The user management UI (`/admin/users`) now supports assigning one or more roles to users during creation and editing.
- **Data Layers for Roles Created:** The necessary data models, repositories, and use cases for the `Role` entity have been implemented.

## 3. Next Steps

- Refactor authentication logic to use client-side data fetching.
- Implement a background iframe component to host running user applications.
- Re-evaluate and prioritize workspace-level role management after the current tasks are complete.

## 4. Active Decisions & Considerations

- The authentication refactor will shift logic from server components and server actions towards client-side hooks and view-models.
- The core architectural patterns (Clean Architecture, Repository/Data Source, Mappers) must be followed for the new feature development.
- The distinction between client-side fetching (default) and Server Actions (for forms) is a key pattern to maintain.
