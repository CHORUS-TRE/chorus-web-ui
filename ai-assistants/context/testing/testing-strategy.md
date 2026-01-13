# CHORUS Web UI Testing Strategy

This document outlines the comprehensive testing strategy for the CHORUS Web UI project. It provides guidance on how we approach testing across different layers of the application, from unit tests to end-to-end tests.

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Test Types](#test-types)
- [Testing Structure](#testing-structure)
- [Test Utilities](#test-utilities)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Coverage Requirements](#coverage-requirements)
- [Continuous Integration](#continuous-integration)
- [Best Practices](#best-practices)

## Testing Philosophy

The CHORUS Web UI testing strategy follows these key principles:

1. **Clean Architecture Testing**: Tests are structured to respect and validate our Clean Architecture approach with clear separation between domain, data, and UI layers.

2. **Test Pyramid**: We follow the test pyramid approach, with more unit tests than integration tests, and more integration tests than E2E tests.

3. **Component-Based Testing**: UI components are tested in isolation to ensure they function correctly regardless of the context they are used in.

4. **Accessibility by Default**: All UI components must pass accessibility tests to ensure the application is usable by everyone.

5. **Performance Awareness**: Critical paths of the application are tested for performance to maintain a responsive user experience.

## Test Types

### Unit Tests

Unit tests verify the behavior of individual functions, classes, or components in isolation. They should:

- Focus on a single unit of code
- Mock all dependencies
- Be fast and deterministic
- Follow the Arrange-Act-Assert pattern

### Integration Tests

Integration tests verify that different parts of the application work together correctly. They:

- Test interactions between multiple units
- May use real implementations of some dependencies
- Focus on boundaries between different layers

### Component Tests

Component tests verify that UI components render and behave correctly. They:

- Test components in isolation
- Mock external dependencies
- Test rendering, user interactions, and state changes
- Validate accessibility requirements

### End-to-End Tests

E2E tests verify complete user flows through the application. They:

- Simulate real user behavior
- Test the application as a whole
- Cover critical user journeys
- Validate that all pieces work together correctly

### Visual Regression Tests

Visual regression tests ensure that UI components maintain their expected appearance. They:

- Capture screenshots of components
- Compare against baseline images
- Detect unwanted visual changes

### Accessibility Tests

Accessibility tests ensure that the application is usable by people with disabilities. They:

- Check for WCAG compliance
- Test keyboard navigation
- Test screen reader compatibility
- Validate color contrast

### Performance Tests

Performance tests measure and ensure the application's responsiveness and efficiency. They:

- Measure load times
- Test with large datasets
- Monitor memory usage
- Identify bottlenecks

## Testing Structure

The project follows a comprehensive testing approach with the following test organization:

```
/
├── src/
│   ├── components/
│   │   ├── __tests__/           # Component unit tests
│   │   │   └── [ComponentName].test.tsx
│   │   └── __snapshots__/        # Component snapshot tests
│   │       └── [ComponentName].snap.tsx
│   ├── domain/
│   │   ├── use-cases/
│   │   │   └── __tests__/        # Domain use case unit tests
│   │   │       └── [UseCaseName].test.ts
│   │   └── model/
│   │       └── __tests__/        # Domain model unit tests
│   │           └── [ModelName].test.ts
│   └── data/
│       ├── repository/
│       │   └── __tests__/        # Repository implementation tests
│       │       └── [RepositoryName].test.ts
│       └── data-source/
│           └── __tests__/        # Data source tests
│               └── [DataSourceName].test.ts
├── __tests__/
│   ├── integration/              # Integration tests
│   ├── e2e/                      # End-to-end tests
│   ├── visual/                   # Visual regression tests
│   └── accessibility/            # Accessibility tests
└── performance/                  # Performance tests
```

## Test Utilities

The project provides helper utilities for testing in `src/utils/test-utils.tsx`, including:

1. **Custom Render Function**: A wrapper around React Testing Library's render function that includes common providers and user-event setup.

2. **Mock Utilities**: Helpers for creating mock repositories and API responses.

3. **Navigation Mocks**: Pre-configured mocks for Next.js navigation utilities.

4. **Utility Functions**: Common testing helpers like waitFor functions.

## Running Tests

### Unit Tests

```bash
pnpm test:unit
```

### Integration Tests

```bash
pnpm test:integration
```

### E2E Tests

```bash
pnpm test:e2e
```

### Visual Regression Tests

```bash
pnpm test:visual
```

### Accessibility Tests

```bash
pnpm test:a11y
```

### Coverage Report

```bash
pnpm test:coverage
```

### All Tests

```bash
pnpm test:run
```

### Watch Mode

```bash
pnpm test
```

## Writing Tests

### Unit Test Example

```typescript
/**
 * @jest-environment jsdom
 */
import { AppRepository } from '@/domain/repository'
import { AppGet } from '@/domain/use-cases/app/app-get'
import { createMockRepository } from '@/utils/test-utils'

describe('AppGet UseCase', () => {
  // Mock data
  const mockApp = {
    id: '1',
    name: 'Test App',
    // ...other properties
  }

  const mockResponse = {
    data: mockApp
  }

  let repository: AppRepository
  let useCase: AppGet

  beforeEach(() => {
    // Create a mock repository
    repository = createMockRepository<AppRepository>({
      get: jest.fn().mockResolvedValue(mockResponse)
    })

    // Initialize the use case with the mock repository
    useCase = new AppGet(repository)
  })

  test('should return app data when repository returns data', async () => {
    // Act
    const result = await useCase.execute('1')

    // Assert
    expect(result).toEqual(mockResponse)
    expect(repository.get).toHaveBeenCalledWith('1')
  })
})
```

### Component Test Example

```tsx
/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@/utils/test-utils'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Click Me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click Me')
  })

  it('calls the onClick handler when clicked', async () => {
    const handleClick = jest.fn()
    const { user } = render(<Button onClick={handleClick}>Click Me</Button>)

    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Integration Test Example

```tsx
/**
 * @jest-environment jsdom
 */
import React from 'react'
import { AppRepository } from '@/domain/repository'
import { AppGet } from '@/domain/use-cases/app/app-get'
import { createMockRepository } from '@/utils/test-utils'

describe('App Integration', () => {
  it('can retrieve an app and transform it correctly', async () => {
    // Setup repository and use case
    const repository = createMockRepository<AppRepository>({
      get: jest.fn().mockResolvedValue({
        data: {
          id: '1',
          name: 'Test App',
          // ...other properties
        }
      })
    })

    const useCase = new AppGet(repository)

    // Execute use case
    const result = await useCase.execute('1')

    // Verify result
    expect(result.data?.name).toBe('Test App')
    expect(repository.get).toHaveBeenCalledWith('1')
  })
})
```

## Coverage Requirements

We maintain the following code coverage requirements:

- **Global**: 70% statements, branches, functions, and lines
- **Domain Layer**: 90% statements, 85% branches, 90% functions and lines

Coverage reports can be generated using:

```bash
pnpm test:coverage
```

## Continuous Integration

All tests are run in our CI pipeline on each pull request and merge to the main branch. PRs cannot be merged if:

1. Tests fail
2. Coverage drops below the required thresholds
3. Accessibility tests fail

## Best Practices

### General Testing Best Practices

1. **Test Behavior, Not Implementation**: Focus on testing what the code does, not how it does it.
2. **Arrange-Act-Assert**: Structure tests with clear setup, execution, and verification phases.
3. **One Assertion per Test**: Prefer focused tests with a single assertion or closely related assertions.
4. **Descriptive Test Names**: Use descriptive names that explain what is being tested and expected behavior.
5. **Isolate Tests**: Tests should not depend on each other or on external state.

### Clean Architecture Testing Best Practices

1. **Domain First**: Test domain logic thoroughly as it contains the core business rules.
2. **Mock at Boundaries**: Use mocks at architectural boundaries to isolate layers.
3. **Repository Tests**: Ensure repository implementations correctly translate between domain and data sources.
4. **Use Case Tests**: Validate that use cases orchestrate repositories correctly.

### UI Component Testing Best Practices

1. **Test User Interactions**: Ensure components respond correctly to user interactions.
2. **Test Accessibility**: Verify components are accessible via keyboard and screen readers.
3. **Test Edge Cases**: Test components with empty states, loading states, error states, and boundary values.
4. **Test Responsiveness**: Ensure components render correctly at different screen sizes.

### Performance Testing Best Practices

1. **Establish Baselines**: Set baseline metrics for performance tests.
2. **Test with Realistic Data**: Use realistic data volumes for performance tests.
3. **Test Critical Paths**: Focus on testing the most performance-sensitive parts of the application.
4. **Monitor Trends**: Track performance metrics over time to identify regressions.
