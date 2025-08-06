# Copilot Instructions for CHORUS Web UI

## Overview

The CHORUS Web UI is a layered Next.js application adhering to Clean Architecture principles. It provides a user-friendly interface for managing Chorus resources like workspaces, applications, and sessions. The project emphasizes separation of concerns, testability, and maintainability.

## Key Concepts

### Memory Bank

The Memory Bank is a hierarchical documentation system that captures the project's context, progress, and technical details. It is critical for maintaining continuity across sessions. Key files include:

- `projectbrief.md`: Defines core requirements and goals.
- `productContext.md`: Explains the purpose and user experience goals.
- `activeContext.md`: Tracks current work focus, recent changes, and next steps.
- `systemPatterns.md`: Documents system architecture and design patterns.
- `techContext.md`: Lists technologies, constraints, and dependencies.
- `progress.md`: Summarizes the current status and known issues.

### Workflow Modes

1. **Plan Mode**: Gather information and create a plan before making changes. Always start in this mode.
2. **Act Mode**: Execute tasks based on the approved plan. Return to Plan Mode after each task.

### Documentation Updates

- Update the Memory Bank after significant changes or when new patterns are discovered.
- Focus on `activeContext.md` and `progress.md` for tracking the current state.
- Use `projectIntelligence.md` to document key insights and project-specific patterns.

## Project-Specific Conventions

- Always read all Memory Bank files at the start of a task.
- Maintain the hierarchical structure of the Memory Bank.
- Use the provided mermaid diagrams as references for workflows and file relationships.

## Architecture

The application is structured into distinct layers:

1. **Presentation Layer** (`src/app`, `src/components`):

   - Contains UI components and pages.
   - Uses View-Model/Actions (`src/components/actions`) to handle user interactions.
2. **Application Layer** (`src/domain/use-cases`):

   - Orchestrates data flow and triggers business logic.
3. **Domain Layer** (`src/domain/model`, `src/domain/repository`):

   - Defines core business entities, validation schemas (Zod), and repository interfaces.
4. **Infrastructure Layer** (`src/data`):

   - Implements repository interfaces and data sources for external services like the Chorus API.

## Key Patterns and Conventions

- **Clean Architecture:**

  - Data flows through Actions → Use Cases → Repositories → Data Sources.
  - Each layer has a clear responsibility.
- **Zod for Validation:**

  - Zod schemas in `domain/model` ensure data integrity.
  - Use these schemas for validating API responses and form inputs.
- **Repository Pattern:**

  - Interfaces in `domain/repository` define data operations.
  - Implementations in `data/repository` handle data fetching and error mapping.
- **Client-Side State Management:**

  - Authentication and app state are managed via React Contexts (`AuthProvider`, `AppStateProvider`).

## Developer Workflows

### Building and Running

- Use `pnpm install` to install dependencies.
- Run `pnpm dev` to start the development server.

### Testing

- Unit tests are located in `__tests__/`.
- Run `pnpm test` to execute the test suite.

### Debugging

- Use the browser's developer tools for debugging React components.
- Add `console.log` statements in server actions or use-cases for backend debugging.

## Integration Points

- **Chorus API:**

  - All data fetching and mutations interact with the Chorus API.
  - Use the generated API client in `data/data-source/chorus-api`.
- **OAuth Authentication:**

  - Implemented via client-side redirect handlers in `page.tsx` components.

## Notes

- The Memory Bank is the single source of truth for project context. Keep it accurate and up-to-date.
- Adhere to the Plan and Act modes to ensure clarity and alignment with user expectations.
