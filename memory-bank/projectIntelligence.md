### Learned Patterns from Role Management Implementation

**Complex Domain Models with Zod:**

- Recursive relationships can be handled with `z.lazy()` for self-referencing schemas
- Role inheritance patterns work well with TypeScript and Zod validation
- Mock data sources are effective for UI development before backend integration

**UI Component Patterns:**

- Matrix-style components (like RoleMatrix) benefit from table-based layouts
- Permission/role relationships require careful state management
- Checkbox interactions in tables need clear visual feedback

**Data Flow Success:**

- The established Clean Architecture patterns scale well to complex features
- Repository/Data Source separation proves valuable for mock implementations
- Use case layer effectively orchestrates complex business logic

### Authentication Architecture Evolution

**Client-Side State Management:**

- Moving from server-side middleware to client-side contexts improves flexibility
- Layout composition (authenticated/unauthenticated) provides clear separation
- Background iframe integration requires careful state coordination

**Implementation Approach:**

- Major architectural changes benefit from incremental implementation
- Branch management becomes critical when mixing completed and in-progress work
- Authentication changes impact multiple layers of the application

**OAuth Redirect Flow:**

-**Pattern**: Implemented a fully client-side OAuth 2.0 redirect handler using a Next.js `page.tsx` component with the `'use client'` directive.

-**Logic Consolidation**: The user prefers to consolidate logic directly within the client-side component rather than using a separate server-side API route for the callback.

-**Implementation**: The page component uses `useSearchParams` to extract parameters from the URL and directly calls the `handleOAuthRedirect` action to complete the flow.

-**Security Insight**: This pattern is effective but relies on the underlying action (`handleOAuthRedirect`) being safe for client-side execution (i.e., not exposing secrets). This is a key architectural preference to remember.

**Deep Link Preservation During OAuth:**

-**Challenge**: OAuth providers like Keycloak redirect to fixed URLs, losing the user's intended destination during authentication flow.

-**Solution Pattern**: Client-side sessionStorage-based solution that preserves redirect URLs across OAuth flow:
  - Capture current page URL before initiating OAuth
  - Store securely in sessionStorage with validation
  - Retrieve and use after OAuth completion
  - Clean up automatically on errors or completion

-**Security Considerations**:
  - Validate redirect URLs to prevent open redirect attacks
  - Ensure URLs are relative and don't contain external domains
  - Handle edge cases like storage unavailability gracefully

-**Implementation Details**:
  - Created dedicated utility (`src/utils/redirect-storage.ts`) for URL management
  - Modified login form to capture `window.location.pathname + window.location.search`
  - Enhanced OAuth redirect handler to use stored URLs with fallback to home page
  - Added comprehensive error handling and cleanup mechanisms

### Development Workflow Insights

**Branch Strategy:**

- Feature branches can contain multiple related changes
- Role management and authentication work naturally intersect
- Consider branch separation for major architectural changes

**Testing Strategy:**

- Mock data sources enable UI development without backend dependencies
- Complex UI components (like role matrices) need comprehensive testing
- Authentication changes require end-to-end validation

**Project Intelligence Patterns:**

- Clean Architecture patterns prove robust across different feature types
- UI component libraries (shadcn/ui) integrate well with custom business logic
- Zod schemas serve as effective contracts between layers

### OpenAPI Specification Updates and API Evolution

**API Response Structure Evolution:**

- **Pattern Recognition:** When OpenAPI specifications are updated, expect changes in both response structure and method naming conventions
- **Nested Response Handling:** Modern API patterns favor nested responses (e.g., `{result: {users: [...]}, pagination: {}}`) over flat structures
- **Backward Compatibility:** Data sources should handle both old and new response formats during transition periods
- **Method Naming:** API methods evolve from generic names (`Get`) to specific ones (`List` for collections)

**Implementation Strategy for API Updates:**

- **Layer-by-Layer Approach:** Update data sources first, then repositories, working from infrastructure up to presentation
- **Request Body Changes:** API updates often change from wrapped objects (`{user: {...}}`) to direct objects (`{...}`)
- **Generated Client Limitations:** Generated clients may fail to parse responses that don't match the spec exactly
- **Error Handling:** Use try-catch patterns in data sources to handle response parsing failures gracefully

**Form Validation Insights:**

- **Silent Failures:** Forms may fail silently if Zod validation requirements aren't met in default values
- **Minimum Length Requirements:** Fields like `shortName` with minimum length constraints need appropriate defaults
- **Debugging Strategy:** Add `console.log` statements in `onSubmit` handlers to identify validation failures
- **Reset Behavior:** `form.reset()` calls should include proper default values, not just empty objects

**TypeScript Compilation Patterns:**

- **Mock Implementations:** When integrating with external services (like WASM), provide mock implementations to maintain compilation
- **Interface Compliance:** Ensure all interface implementations provide all required methods, even if temporarily mocked
- **Global Type Issues:** Avoid direct `global` object access in TypeScript; prefer explicit implementations within providers
