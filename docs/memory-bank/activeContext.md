# Active Context

## 1. Current Work Focus

The data flow refactoring for all major entities (`App`, `User`, `AppInstance`, `Workspace`, `Workbench`) is now complete. The current focus is on final documentation updates and preparing for the next major task.

## 2. Recent Changes

- **Refactoring Complete:** The `Workspace` and `Workbench` entities have been refactored, completing the architectural overhaul for all major entities.
- **Architectural Rules Clarified:** The usage of Server Actions vs. client-side fetching has been clarified in `.cursorrules` and `systemPatterns.md`.
- **Mermaid Diagrams Fixed:** All Mermaid diagrams in the project documentation have been corrected.

## 3. Next Steps

- Awaiting direction on the next task.
- A potential future task that was mentioned is to create all the data flows in `apis.swagger.yaml`.

## 4. Active Decisions & Considerations

- The core architectural patterns (Clean Architecture, Repository/Data Source, Mappers) are now stable and must be followed for any new feature development.
- The distinction between client-side fetching (default) and Server Actions (for forms) is a key pattern to maintain.
