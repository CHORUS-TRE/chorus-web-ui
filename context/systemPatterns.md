# System Patterns

## 1. System Architecture

The application aims to follow a Clean Architecture pattern, separating concerns into distinct layers.

```mermaid
graph TD
    A["Presentation (React Components/Pages)"] --> B["View-Model (Server Actions)"];
    B --> C["Application (Use Cases)"];
    C --> D["Domain (Entities/Interfaces)"];
    C --> E["Repository Interfaces"];
    F["Infrastructure (Data Layer)"] --> E;
    F --> D;
    G["Data Sources"] --> F
    H["API Client"] --> G

    subgraph "Presentation Layer"
        A
        B
    end

    subgraph "Domain Layer"
        D
        E
    end

    subgraph "Application Layer"
        C
    end

    subgraph "Infrastructure Layer"
        F
        G
        H
    end

```

- **Presentation Layer (`src/app`, `src/components`, `src/providers`):** Contains UI components, pages and client-side state providers. The View-Model layer (`src/view-model`) is called to handle user interactions.
- **Application Layer (`src/domain/use-cases`):** Orchestrates the flow of data and triggers business logic.
- **Domain Layer (`src/domain/model`, `src/domain/repository`):** Contains core business entities, validation schemas (Zod), and repository interfaces.
- **Infrastructure Layer (`src/data`):** Contains repository implementations and data sources that communicate with external services like the Chorus API.

## 2. Key Technical Decisions

- **Authentication Architecture Shift:** Moving from server-side authentication middleware to client-side state management approach:
  - Layout components split into authenticated/unauthenticated states
  - Background iframe integration for application hosting
  - Client-side context providers (`src/providers`) for auth state
- **View-Model and Data Fetching Strategy:** The primary approach is using the **client-side view-model**, which are defined in the `src/view-model` directory. Usage of server-side data fetching (Server Actions/Components) should be motivated by specific needs (SEO, initial load performance, security), but the default is client-side logic to maintain a clear separation and utilizing the established client-side Architecture.
- **Repository Pattern:** This is the core of our data handling strategy.
  - **Interface (`domain/repository`):** Defines the contract for data operations, using domain models (e.g., `App`, `AppCreateType`).
  - **Implementation (`data/repository`):** Implements the interface. It calls the data source, and its primary responsibility is to catch errors and map the raw data source response into the standard `Result<T>` object (`{ data?, error?, issues? }`).
- **Data Source Pattern:**
  - **Interface (`data/data-source`):** Defines the contract for interacting with the backend, using raw API client types (e.g., `ChorusApp`, `ChorusCreateAppReply`).
  - **Implementation (`data/data-source/chorus-api`):** Implements the interface, making direct calls to the generated API client. It is responsible for mapping domain types (e.g., `AppCreateType`) to API types (`ChorusApp`) before sending the request.
- **Zod for Validation:** Zod schemas in `domain/model` are the single source of truth for validation. They are used in server actions and repository implementations to ensure data integrity.
- **Generated API Client:** Using OpenAPI generator to create a strongly-typed API client, ensuring type safety when communicating with the backend.
- **API Response Structure Evolution:** The API has evolved from flat responses to nested structures. Current pattern expects responses like `{ result: { users: [...] }, pagination: {...} }` instead of `{ result: [...] }`. Data sources handle potential mismatches between OpenAPI spec and actual backend responses.
- **Sidebar Navigation Pattern (2025-11):** `SidebarGroup` remains responsible for structure, but navigation links now sit inside the label while disclosure is handled exclusively by `SidebarGroupToggle`. This keeps clicks deterministic (label navigates, chevron toggles) and supports contextual badges (e.g., workspace counts) without interfering with routing.

## 3. Proven Patterns

### Role Management Implementation
The role management feature demonstrates the effectiveness of our architectural patterns:
- **Recursive Domain Models:** Role entity supports inheritance with `z.lazy()` for recursive Zod schemas
- **Complex UI Components:** RoleMatrix component handles complex permission/role relationships
- **Mock Data Sources:** Effective pattern for development before backend integration

### Authentication State Management
- **Client-Side Context Providers:** Moving authentication state to React Context in `src/providers` for better client-side control
- **Layout Composition:** Authenticated/unauthenticated layout components for clear separation of concerns
- **Background Integration:** Iframe components for hosting user applications within the main interface
- **OAuth Deep Link Preservation:** Client-side sessionStorage pattern for preserving user's intended destination during OAuth flow
  - Utility-based approach with `src/utils/redirect-storage.ts`
  - Comprehensive URL validation for security
  - Automatic cleanup on completion or errors

## 4. Initial Data Loading for Client Providers

A common requirement is to provide initial state (e.g., authentication status) to client-side providers. To avoid server/client boundary errors, the following pattern is used:

1.  **Fetch in Root Server Component:** The initial data is fetched in the root `layout.tsx`, which is a Server Component. This is the only place where server-side functions like `cookies()` or `userMe()` should be called for initial state.
2.  **Pass as Props:** The fetched data is passed as props to the client-side `Providers` component.
3.  **Accept in Client Component:** The `Providers` component (`'use client'`) is a standard (non-async) component that accepts the initial state via props and passes it to the React Context providers.

This pattern ensures that no server functions are called during the initial client-side render, preventing fetch waterfalls and errors.
