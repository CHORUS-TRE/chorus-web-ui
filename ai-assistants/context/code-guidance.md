# This file provides guidance when working with code in this repository.

## Project Overview

CHORUS Web UI is a Next.js 16 application for managing research workspaces, applications, and sessions. It follows Clean Architecture principles with strict layer separation and uses TypeScript, Tailwind CSS, and shadcn/ui components.

## Development Commands

**Package Manager**: Use `pnpm` (version 10.x required, Node >=22.14.0)

```bash
# Install dependencies
pnpm install

# Development server (with Node debugger)
pnpm dev

# Development with Turbo mode
pnpm dev:turbo

# Build for production
pnpm build

# Start production server
pnpm start

# Linting and formatting
pnpm lint              # Auto-fix linting issues
pnpm format:all        # Format all files with Prettier
pnpm fix               # Run ESLint, Prettier, and lint together

# Testing
pnpm test              # Watch mode
pnpm test:run          # Run all tests once
pnpm test:unit         # Unit tests only
pnpm test:integration  # Integration tests only
pnpm test:e2e          # End-to-end tests
pnpm test:visual       # Visual regression tests
pnpm test:a11y         # Accessibility tests
pnpm test:coverage     # Generate coverage report
pnpm test:ci           # CI mode

# Add shadcn/ui components
pnpm dlx shadcn@latest add <component>
```

## Architecture

### Clean Architecture Layers

The codebase follows a strict 4-layer architecture where dependencies flow **inward only**:

```
UI Layer (src/app, src/components)
    ↓
View-Model Layer (src/view-model)
    ↓
Domain Layer (src/domain)
    ↓
Infrastructure Layer (src/data)
```

**Key principle**: Outer layers depend on inner layers, never the reverse.

### Layer Responsibilities

1. **Domain Layer** (`src/domain/`)

   - **`model/`**: Core business entities with Zod validation schemas
   - **`repository/`**: Repository interfaces (no implementations)
   - **`use-cases/`**: Business logic organized by entity (app, workspace, user, etc.)
   - **Rules**: No external dependencies, only pure TypeScript and Zod
2. **Infrastructure Layer** (`src/data/`)

   - **`data-source/chorus-api/`**: API clients and response mappers
   - **`repository/`**: Concrete implementations of domain repository interfaces
   - **Rules**: Implements domain interfaces, handles API communication
3. **View-Model Layer** (`src/view-model/`)

   - Server actions that coordinate use cases and repositories
   - Marked with `'use client'` directive
   - Handle form data validation and error transformation
   - **Pattern**: Each function creates repository → instantiates use case → executes
   - Example flow: `appGet()` → creates `AppRepositoryImpl` → creates `AppGet` use case → executes
4. **UI Layer** (`src/app/`, `src/components/`)

   - Next.js App Router pages and React components
   - Call view-model functions (server actions) for data operations
   - Use shadcn/ui components for consistent design

### Data Flow Pattern

**Complete flow** for any CRUD operation:

```
User Interaction (Component)
    ↓ calls view-model function
View-Model (e.g., appGet)
    ↓ creates repository instance
Repository Implementation (AppRepositoryImpl)
    ↓ uses data source
Data Source (AppDataSourceImpl)
    ↓ makes HTTP request
Chorus API
```

**Return flow** with validation:

```
API Response
    ↓ mapped by data source
Raw Data
    ↓ validated by repository using Zod schema
Domain Model (validated)
    ↓ wrapped in Result<T>
View-Model
    ↓ returns Result
Component (handles success/error)
```

### Result Type Pattern

All data operations return `Result<T>`:

```typescript
interface Result<T> {
  data?: T
  error?: string
  issues?: ZodIssue[]  // Validation errors
}
```

Handle in components:

```typescript
const result = await appGet(id)
if (result.error) { /* handle error */ }
if (result.data) { /* use data */ }
```

### File Organization Conventions

- Use cases: `src/domain/use-cases/{entity}/{entity}-{action}.ts`
  - Example: `src/domain/use-cases/app/app-get.ts`
- Repositories: `src/data/repository/{entity}-repository-impl.ts`
- Data sources: `src/data/data-source/chorus-api/{entity}-data-source.ts`
- View models: `src/view-model/{entity}-view-model.ts`
- Models: `src/domain/model/{entity}.ts`

### Import Aliases

- `@/*` or `~/*` → `src/*` (both aliases work identically)
- Example: `import { App } from '@/domain/model'`

## Testing Strategy

- Unit tests: Co-located with code in `__tests__/` directories
- Integration tests: `__tests__/integration/`
- Domain layer: 90% coverage required
- Global coverage: 70% minimum
- Test utilities: `src/utils/test-utils.tsx`

## Git Workflow

**Commit Convention**: Use Conventional Commits

```
feat(scope): add feature
fix(scope): fix bug
chore(scope): maintenance task
```

**Pre-commit Hook**: Configured via `simple-git-hooks`, automatically runs on commit:

1. `pnpm fix` (ESLint + Prettier)
2. `pnpm test:run` (all tests must pass)

Main branch: `main`

**Semantic Release**: Automated versioning using semantic-release with:

- Changelog generation
- Git tagging
- GitHub releases
- Helm chart updates

## Environment Variables

**Configuration**: Uses `.env.template` as reference

**NEXT_PUBLIC_API_URL**: This variable serves dual purposes depending on context:

- **Server-side**: Backend API base URL without suffix (e.g., `https://backend.dev.chorus-tre.ch`)
- **Client-side**: Exposed to browser, includes API prefix using `NEXT_PUBLIC_API_SUFFIX` (e.g., `https://backend.dev.chorus-tre.ch/api/rest/v1`)

Example `.env`:

```
NEXT_PUBLIC_APP_URL=https://dev.chorus-tre.ch
NEXT_PUBLIC_API_URL=https://backend.dev.chorus-tre.ch
NEXT_PUBLIC_API_SUFFIX=/api/rest/v1
NEXT_PUBLIC_MATOMO_URL=https://matomo.dev.chorus-tre.ch
NEXT_PUBLIC_MATOMO_CONTAINER_ID=XHnjFrGP
```

## Important Notes

- **WebAssembly Support**: webpack configured for async WebAssembly (Go WASM modules)
- **React Strict Mode**: Disabled (`reactStrictMode: false`)
- **Output Mode**: Standalone build for containerization
- **Console Logs**: Removed in production (except errors)
- **No E2E Tests**: ViewModels render dummy data; Jest doesn't support async Server Components yet
- **Docker**: Dev containers configured (`.devcontainer/`), run via VS Code Remote Containers extension
- **Code Style**: EditorConfig enforces 2-space indentation, LF line endings, UTF-8 encoding

## Design System

- Use shadcn/ui components exclusively
- Tailwind CSS for styling
- Add new components: `pnpm dlx shadcn@latest add <component>`
- Component documentation: https://ui.shadcn.com/docs/components

## License

Academic research use only. Commercial use requires approval from CHUV (pactt.legal@chuv.ch).
