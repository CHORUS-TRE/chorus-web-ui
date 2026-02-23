# Release: Header and Sidebar UI Refactor

**Date**: 2026-01-26
**Version**: N/A (Project internal)

## Overview
This release refactors the main application layout to optimize navigation space and centralize user-related actions.

## Key Changes
- **Centralized User Menu**: All user actions (Profile, Admin, Privacy, Lab) and global toggles (Theme, Help) are now located in a single, high-visibility dropdown in the top-right header.
- **Improved Sidebar**: The left sidebar is now cleaner, focusing purely on main navigation and services.
- **Aesthetic Refinements**: Added visual separators and consistent icon usage in the new dropdown menu.

## Files Modified
- `src/components/header.tsx`: Implemented `UserProfileSection` and integrated help/theme toggles.
- `src/components/left-sidebar.tsx`: Added Help action and removed redundant user section.

## Verification Result
- **Status**: ✅ PASSED
- **Tests**: Manual UI walkthrough and state persistence checks.
