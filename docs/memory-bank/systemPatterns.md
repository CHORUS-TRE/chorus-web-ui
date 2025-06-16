# System Patterns

## 1. System Architecture

The application aims to follow a Clean Architecture pattern, separating concerns into distinct layers.

```mermaid
graph TD
    A[Presentation (React Components/Pages)] --> B[View-Model (Server Actions)];
    B --> C[Application (Use Cases)];
    C --> D[Domain (Entities/Interfaces)];
    C --> E[Repository Interfaces];
    F[Infrastructure (Data Layer)] --> E;
    F --> D;
    G[Data Sources] --> F
    H[API Client] --> G

    subgraph Presentation Layer
        A
        B
    end

    subgraph Domain Layer
        D
        E
    end

    subgraph Application Layer
        C
    end

    subgraph Infrastructure Layer
        F
        G
        H
    end

```

- **Presentation Layer (`src/app`, `src/components`):** Contains UI components, pages, and server actions that act as a View-Model.
- **Application Layer (`src/domain/use-cases`):** Orchestrates the flow of data and triggers business logic.
- **Domain Layer (`src/domain/model`, `src/domain/repository`):** Contains core business entities, validation schemas (Zod), and repository interfaces.
- **Infrastructure Layer (`src/data`):** Contains repository implementations and data sources that communicate with external services like the Chorus API.

## 2. Key Technical Decisions

- **Server Actions as View-Models:** Using Next.js Server Actions (`src/components/actions`) to handle form submissions and orchestrate calls to the application layer. This keeps client components lean.
- **Repository Pattern:** Abstracting data access through repository interfaces, with implementations in the `data` layer.
- **Zod for Validation:** Using Zod for robust schema definition and validation at the domain and API boundaries.
- **Generated API Client:** Using OpenAPI generator to create a strongly-typed API client, ensuring type safety when communicating with the backend.
