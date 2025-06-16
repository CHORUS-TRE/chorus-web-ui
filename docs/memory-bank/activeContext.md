# Active Context

## 1. Current Focus

The primary focus is to systematically apply the established architectural and data flow patterns to all remaining entities in the application.

## 2. Recent Changes

- **`User` Entity Refactored:** The entire data flow for the `User` entity has been refactored, including its domain model, mapper, data source, repository, use cases, and view-model actions. The public `UserRegisterForm` was also updated.
- **SSR Bug Fixed:** Resolved a critical server-side rendering error by moving initial authentication state fetching from a Client Component (`Providers`) to the root Server Component (`layout.tsx`). This pattern is now documented.
- **Dedicated `userMe` Action:** Created a specific server action for fetching the current user's data, cleaning up the main view model.

## 3. Next Steps

- **Apply Patterns to `Workspace`:** The next entity to refactor is `Workspace`. This involves updating its entire data flow (domain, repository, data source, view-model, and UI) to match the established pattern.

## 4. Active Decisions & Considerations

- **Continue the Pattern:** The successful refactoring of `App` and `User` validates the current architectural approach. The process will be repeated for all remaining models.
