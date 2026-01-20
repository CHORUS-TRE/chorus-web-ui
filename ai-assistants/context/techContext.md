# Tech Context

## 1. Core Technologies

- **Framework:** Next.js (with App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS with shadcn/ui components.
- **State Management:** React Context API for global state (`src/providers`).
- **Forms:** Using Next.js Server Actions via a view-model layer.
- **API Client:** OpenAPI generator is used to create a typed client from a specification, located in `src/internal/client`.

## 2. Development Setup

- **Package Manager:** pnpm
- **Testing:** Jest and React Testing Library. The initial setup and some tests exist, but several are currently failing. A priority is to get the test suite to a stable, passing state.
- **Linting & Formatting:** ESLint and Prettier.

## 3. Dependencies

- `next`: Core framework
- `react`: UI library
- `tailwindcss`: CSS framework
- `zod`: Schema validation
- `next-runtime-env`: Environment variable management

## 4. Browser APIs Used

- **SessionStorage:** Used for client-side OAuth redirect URL preservation
  - Temporary storage during authentication flow
  - Automatic cleanup on completion or errors
  - Graceful fallback when unavailable

## 5. Technical Constraints

- The application must interact with a pre-existing Chorus API, for which an OpenAPI specification is available.
- All data fetching and mutations should ideally go through the defined architectural layers (Actions -> Use Cases -> Repositories -> Data Sources).
