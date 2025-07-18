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
