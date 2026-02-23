# CHORUS Web UI Testing Best Practices

## Import Paths in Tests

When writing tests, it's important to use the correct import paths to ensure proper module resolution. Here are the recommended approaches:

### Use Relative Paths in Test Files

Test files should use relative imports rather than absolute imports to avoid module resolution issues. This is especially important for:

- Unit tests
- Integration tests
- Visual regression tests
- Accessibility tests

**Good:**
```typescript
// In a file at src/components/__tests__/button.test.tsx
import { Button } from '../../components/button'
```

**Avoid:**
```typescript
// May cause resolution issues in test environments
import { Button } from '@/components/button'
```

### Path Resolution Script

If you need to convert multiple files from absolute to relative imports, you can use the provided utility script:

```bash
./scripts/fix-test-paths.sh
```

This script will find all test files with absolute imports and convert them to relative imports based on their location in the directory structure.

## TypeScript Type Assertions in Tests

To ensure compatibility with Babel and Jest, use the following approaches for type assertions in test files:

### Object Constants (Instead of `as const`)

**Good:**
```typescript
const AppType = Object.freeze({
  APP: 'app',
  SERVICE: 'service'
})
```

**Avoid:**
```typescript
const AppType = {
  APP: 'app',
  SERVICE: 'service'
} as const
```

### Mock Objects (Instead of `as any`)

**Good:**
```typescript
const mockApp = Object.assign({
  id: '1',
  name: 'Test App',
  // other properties
})
```

**Avoid:**
```typescript
const mockApp = {
  id: '1',
  name: 'Test App',
  // other properties
} as any
```

## Babel and Jest Configuration

For tests to work properly with TypeScript and JSX, the following configurations are recommended:

### Babel Configuration

Create a `.babelrc` file with the following configuration:

```json
{
  "presets": [
    ["@babel/preset-env", { "targets": { "node": "current" } }],
    "@babel/preset-typescript",
    ["@babel/preset-react", { "runtime": "automatic" }]
  ]
}
```

This will ensure that:
- TypeScript syntax is properly transformed
- JSX syntax is properly transformed
- ES modules are handled correctly

### Jest Configuration

Ensure your Jest configuration handles TypeScript and JSX files properly:

```typescript
// jest.config.ts
const config = {
  // Other configurations...
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js|jsx)$": ["babel-jest", { presets: ["next/babel"] }]
  },
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/src/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
    // Mock out CSS imports
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  // Other configurations...
};

export default config;
```

## Test Organization

- Keep test files close to the implementation files they test
- Use descriptive test names that explain the expected behavior
- Group related tests using `describe` blocks
- Isolate tests with proper setup and teardown using `beforeEach` and `afterEach`

## Testing Libraries and Utilities

CHORUS Web UI uses several testing libraries:

- **Jest**: The main testing framework
- **React Testing Library**: For testing React components
- **jest-axe**: For accessibility testing
- **MSW**: For mocking API requests

Import testing utilities from the provided test-utils file using a relative path:

```typescript
import { render, screen, waitFor } from '../../utils/test-utils'
```

## Running Tests

Different types of tests can be run using the following npm scripts:

```bash
# Run unit tests
pnpm test:unit

# Run integration tests
pnpm test:integration

# Run accessibility tests
pnpm test:a11y

# Run visual regression tests
pnpm test:visual

# Run all tests
pnpm test:run
```

## Troubleshooting Common Test Issues

### Module Resolution Issues

If you encounter module resolution issues:
- Check that import paths are relative in test files
- Verify that the moduleNameMapper in Jest config matches your import patterns

### TypeScript Syntax Errors

If you encounter TypeScript syntax errors:
- Ensure you have the proper TypeScript transformations in your Babel and Jest config
- Check for TypeScript-specific syntax that might not be transformed properly

### JSX Syntax Errors

If you encounter JSX syntax errors:
- Verify that @babel/preset-react is included in your Babel configuration
- Ensure that the transform configuration for .tsx files is properly set

For more detailed information on writing and running tests, refer to the [Jest documentation](https://jestjs.io/docs/getting-started) and [React Testing Library documentation](https://testing-library.com/docs/react-testing-library/intro).
