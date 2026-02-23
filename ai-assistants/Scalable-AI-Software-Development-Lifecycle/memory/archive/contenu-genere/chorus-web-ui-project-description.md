# CHORUS Web UI Project Description

## Overview

CHORUS Web UI is a Next.js-based web interface for interacting with the CHORUS platform. The project follows Clean Architecture principles and uses TypeScript as its primary language.

## Technical Stack

- **Frontend Framework**: Next.js with TypeScript
- **Package Manager**: pnpm (v9.11.0)
- **Node.js**: Version ≥ 20.16.0
- **UI/UX**:
  - Tailwind CSS for styling
  - shadcn/ui as design system
  - Radix UI components for accessibility
- **Data Visualization**:
  - Recharts
  - Nivo for charts
- **Testing**: Jest with Testing Library
- **Code Quality**:
  - ESLint
  - Prettier
  - Husky for pre-commit hooks

## Architecture

The project follows Clean Architecture principles with a clear separation of concerns:

### Folder Structure
- src/domain
  - src/domain/use-cases
    - Application-specific business rules, representing the actions the system can perform.
  - src/domain/repository
    - Interfaces for data access, defining the methods for interacting with data sources.
  - src/domain/model
    - Core business entities and value objects, encapsulating the business logic and attributes.
- src/data
  - src/data/repository
    - Implementations of the domain repository interfaces, handling data operations.
  - src/data/data-source
    - src/data/data-source/chorus-api
      - Data source implementation for interacting with the Chorus API.
    - src/data/data-source/local-storage
      - Data source implementation for interacting with local storage.


## Core Domain Models

- **Workspace**: Project container with members and resources
- **Workbench**: Remote Desktop environment for AppInstances
- **App**: Application template that can be instantiated
- **AppInstance**: Running instance of an app in a workbench
- **User**: System user with roles and permissions

## Component Architecture

The project follows atomic design principles:
- Atoms: Basic UI components
- Molecules: Component combinations
- Organisms: Complex UI sections
- Templates: Page layouts
- Pages: Full views


## API Integration

- REST API communication via OpenAPI-generated clients
- Endpoints prefixed with `/api/rest/v1/`
- Session-based authentication
- Repository pattern implementation for data access

## Quality Assurance

The project maintains high quality standards through:
- Comprehensive testing (Unit, Integration, E2E)
- Strict TypeScript typing
- Accessibility compliance
- Responsive design
- Continuous documentation updates

## Requirements

1. **Clean Architecture**
   - Clear separation of concerns
   - External dependency isolation
   - Maximum testability

2. **Strong Typing**
   - Systematic use of TypeScript
   - Well-defined interfaces
   - Documented props

3. **Performance**
   - Render optimization
   - Efficient state management
   - Optimal resource loading

4. **Accessibility**
   - WCAG 2.1 compliance
   - Screen reader support
   - Keyboard navigation

5. **Maintainability**
   - Self-documented code
   - Unit tests
   - Reusable patterns

## Specifications

### Component Structure

### Component Best Practices

1. **State Management**
   - Use React Query for server state
   - Implement local state with useState/useReducer
   - Consider Zustand for complex global state
   - Avoid prop drilling through context usage

2. **Error Handling**
   - Implement error boundaries
   - Provide meaningful error messages
   - Handle loading and error states gracefully
   - Use try/catch blocks for async operations

3. **Performance Optimization**
   - Implement React.memo when needed
   - Use useMemo and useCallback judiciously
   - Optimize re-renders with proper key usage
   - Implement virtualization for long lists

4. **Accessibility Implementation**
   - Use semantic HTML elements
   - Implement proper ARIA attributes
   - Ensure proper focus management
   - Test with screen readers
   - Support keyboard navigation

### Testing Guidelines

1. **Unit Tests**
   - Test component rendering
   - Test user interactions
   - Test error states
   - Test accessibility features

2. **Integration Tests**
   - Test component integration
   - Test data flow
   - Test side effects

3. **Test Structure**
   - Group tests by functionality (describe blocks)
   - Follow Arrange-Act-Assert pattern
   - Separate rendering tests
   - Separate interaction tests
   - Separate state management tests
   - Separate accessibility tests
   - Mock external dependencies
   - Use meaningful test descriptions
   - Implement proper cleanup
   - Follow isolation principles

### Deployment Considerations

1. **Build Process**
   - Ensure component is tree-shakeable
   - Verify bundle size impact
   - Check for unused exports
   - Validate CSS optimization

2. **Environment Support**
   - Test in development mode
   - Verify production build
   - Check SSR compatibility
   - Validate ISR functionality

3. **Monitoring**
   - Implement performance metrics
   - Add error tracking
   - Set up usage analytics
   - Monitor accessibility violations

### Maintenance Guidelines

1. **Version Control**
   - Follow semantic versioning
   - Document breaking changes
   - Maintain changelog
   - Tag releases appropriately

2. **Updates**
   - Regular dependency updates
   - Security patches
   - Performance improvements
   - Accessibility enhancements

3. **Deprecation Process**
   - Announce deprecations early
   - Provide migration guides
   - Support legacy versions
   - Set end-of-life dates

### Additional Resources

1. **Internal Documentation**
   - Component library documentation
   - Architecture guidelines
   - Best practices guide
   - Style guide

2. **External References**
   - React documentation
   - Next.js guides
   - TypeScript handbook
   - WCAG guidelines

3. **Tools and Utilities**
   - Component development tools
   - Testing utilities
   - Performance monitoring
   - Accessibility checkers
