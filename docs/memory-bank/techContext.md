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
- **Testing:** Jest and React Testing Library. The test suite is now stable and passing (61 tests passing, 10 skipped, 11 test suites).
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

## 5. Testing Strategy

- **Unit Tests:** Component and use case testing with Jest and React Testing Library
- **Integration Tests:** End-to-end workflow testing
- **Performance Tests:** Workspace list performance validation
- **Accessibility Tests:** Button accessibility compliance
- **Visual Tests:** Card component visual regression testing
