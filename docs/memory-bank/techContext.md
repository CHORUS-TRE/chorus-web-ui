# Tech Context

## 1. Core Technologies

- **Framework:** Next.js (with App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS with shadcn/ui components.
- **State Management:** React Context API for global state (`AuthContext`, `AppStateContext`).
- **Forms:** Using native form handling with Server Actions.
- **API Client:** OpenAPI generator is used to create a typed client from a specification, located in `src/internal/client`.

## 2. Development Setup

- **Package Manager:** pnpm
- **Testing:** Jest and React Testing Library (setup exists, but more tests are needed).
- **Linting & Formatting:** ESLint and Prettier.

## 3. Dependencies

- `next`: Core framework
- `react`: UI library
- `tailwindcss`: CSS framework
- `zod`: Schema validation
- `next-runtime-env`: Environment variable management

## 4. Technical Constraints

- The application must interact with a pre-existing Chorus API, for which an OpenAPI specification is available.
- All data fetching and mutations should ideally go through the defined architectural layers (Actions -> Use Cases -> Repositories -> Data Sources).
