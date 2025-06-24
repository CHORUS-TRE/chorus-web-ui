# Active Context

## 1. Current Work Focus

The current priority is finalizing and testing the new platform-level user and role management interface. This involves ensuring the UI is robust and the underlying data flows are correct before moving on to the workspace-level implementation.

## 2. Recent Changes

- **Platform-Level Role Management UI Implemented:** A new section for managing roles and permissions (the "permission matrix") has been built at `/admin/roles`.
- **Role Assignment Integrated:** The user management UI (`/admin/users`) now supports assigning one or more roles to users during creation and editing.
- **Data Layers for Roles Created:** The necessary data models, repositories, and use cases for the `Role` entity have been implemented, following the established Clean Architecture pattern.
- **User Management UI Implemented:** A complete UI for administrators to create, view, update, and delete users has been added.

## 3. Next Steps

- Build the workspace-level user and role management view.
- Integrate with the live `chorus-gatekeeper` service to replace mock role and permission data.
- Increase test coverage for the new roles management feature.

## 4. Active Decisions & Considerations

- The implementation will proceed with placeholder roles and permissions, as the definitive list from the `chorus-gatekeeper` service is not yet integrated.
- The core architectural patterns (Clean Architecture, Repository/Data Source, Mappers) are stable and must be followed for any new feature development.
- The distinction between client-side fetching (default) and Server Actions (for forms) is a key pattern to maintain.
