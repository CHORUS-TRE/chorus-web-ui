# Requirements: Header and Sidebar Refactor

## Status
- **Date**: 2026-01-26
- **Stage**: Released
- **Priority**: High

## Summary
Refactor the navigation and user management interface to improve clarity and usability.

## Detailed Requirements

### 1. User Profile Management
- [x] Move `UserProfileSection` from the left sidebar to the top-right of the header.
- [x] Implement a dropdown menu for the user profile.
- [x] Include user info (initials/avatar, name, username).
- [x] Include navigation to Profile and Settings (renamed "Admin").
- [x] Include "Sign out" action with a visual separator below it.

### 2. Header Actions
- [x] Integrate "Theme Mode" toggle (Light/Dark) into the profile menu.
- [x] Integrate "Help" button (toggles right sidebar) into the profile menu.
- [x] Ensure the header remains clean and focused on navigation breadcrumbs and user actions.

### 3. Sidebar Refactor
- [x] Restore the left sidebar as the main navigation hub.
- [x] Add a "Help" link under the Services section.
- [x] Rename "Settings" to "Admin" and move its primary access point to the profile menu.
- [x] Remove the redundant user section from the bottom of the sidebar.

### 4. Navigation Reordering
- [x] Move the "Lab" navigation item to appear just before the "Roles" section in the profile dropdown.

## Verification
- Manual verification of dropdown functionality.
- Verification of theme switching across all pages.
- Verification of sidebar navigation paths.
