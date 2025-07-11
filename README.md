# CHORUS Web User Interface

Welcome to the CHORUS Web User Interface! This part of the platform provides a web-based interface to interact with CHORUS, leveraging the power of Next.js to deliver a responsive and dynamic user experience.

## Description

The CHORUS Web UI is built with Next.js, a React framework that supports both client-side and server-side rendering. This approach ensures optimal performance and responsiveness across all devices.

## Technology Stack

- **Frameworks**: Next.js
- **Programming Language**: TypeScript
- **Engines**: Node, pnpm
- **Code Quality Tools**: ESLint, Prettier, husky
- **CSS Framework**: Tailwind CSS,
- **Design System**: shadcdn/ui
- **Testing Framework**: Jest
-
-  **Clean Architecture Principles**: This project adheres to the principles of clean architecture, including separation of concerns, dependency inversion, and the use of interfaces and abstractions to promote modularity and maintainability.

## FOLDER STRUCTURE
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


## Getting Started

### Tutorial

See [docs/development-tutorial/index.md](docs/development-tutorial/index.md)

### Prerequisites

To set up your development environment for CHORUS Web UI, you will need:

- **Docker**: A platform for developing, shipping, and running applications inside containers.
- **Dev Containers Extension for Visual Studio Code**: Enhances your development experience by enabling you to code inside a Docker container.

### Installation

Start by cloning this repository to your local machine:

```bash
git clone https://github.com/CHORUS-TRE/chorus-web-ui.git
cd chorus-web-ui
```

### Development

1. **Open the project in a dev container**

   The project includes a .devcontainer folder at the root. Dev Containers allow for seamless development inside a Docker container, ensuring a consistent and fully-prepared development environment. Learn more about Dev Containers [here](https://code.visualstudio.com/docs/devcontainers/containers).

   To open the project in a Dev Container:

   - Ensure the Dev Containers extension is installed in Visual Studio Code.
   - Click on the green arrows in the lower left corner of VS Code (as shown below).
   - Select "Reopen in Container" from the menu.

   ![alt text](https://code.visualstudio.com/assets/docs/devcontainers/tutorial/remote-status-bar.png)

   Once opened in the container, you'll have access to a terminal for interaction.

2. **Install Dependencies and Run the Development Server**

   Install the necessary packages:

   ```bash
   pnpm install
   ```

   Start the development server:

   ```bash
   pnpm dev
   ```

   Your application will now be running on the specified localhost port. The development server will automatically refresh upon any changes to the code.

3. **Testing**

   -  No E2E tests for now, as we use ViewModels which renders dummy data.
     - Good to know: Since async Server Components are new to the React ecosystem, Jest currently does not support them.
     - https://nextjs.org/docs/pages/building-your-application/testing/jest
   - Integration tests
     - `pnpm test`
   - **Testing Your Application**
     - Add or update tests in `__tests__/`.
     - Example tests for components and pages are provided, such as for the Home component.

4. **Developing Your Application**

   - Main Page: Edit src/app/index.tsx to modify the homepage.
   - New Pages: Create additional pages and routes in the src/app directory.
   - Shared Components: Develop reusable components like headers or footers in the src/components folder.

5. **Styling, Design System**

	- We use [shadcdn/ui](https://ui.shadcn.com/) as a design system.
	- Use `pnpm dlx shadcn-ui@latest add <compnent>` to add [components](https://ui.shadcn.com/docs/components/accordion)

6. **Code versionning**

   - Use Conventional Commits [https://www.conventionalcommits.org/en/v1.0.0/](https://www.conventionalcommits.org/en/v1.0.0/) for your message (so later we can use it to make automatic semantic versionning)
     - Format: `<type>(<scope>): <subject> ` (`<scope>` is optional)


		```
			feat: add cat greetings
			^--^  ^---------------^
			|     |
			|     +-> Summary in present tense.
			|
			+-------> Type: chore, docs, feat, fix, refactor, style, or test.
		```
   - git runs a pre-commit hook before pushing, with eslint, prettier and test

### Production

**Environment variables**

Server side variables:
- `NEXT_PUBLIC_DATA_SOURCE_API_URL` is the API backend. Note that the generated files are prefixed with /api/rest/v1/ so generally you want to have something like
NEXT_PUBLIC_DATA_SOURCE_API_URL=https://api.chorus-tre.com/

Client side variable:
- `NEXT_PUBLIC_DATA_SOURCE_API_URL` is exposed to the web-ui and should contains the prefix to the API, like https://api.chorus-tre.com/api/rest/v1/ Used for the iframe streams

**Local Production Testing**

Build and run the production application locally:

```bash
docker build -t chorus/web-ui .
```

```bash
docker run -e NEXT_PUBLIC_DATA_SOURCE_API_URL=https://backend.dev.chorus-tre.ch \
          -e REACT_EDITOR=cursor \
          -e NODE_ENV=development \
          -e NEXT_PUBLIC_APP_URL=http://localhost:3000 \
          -e NEXT_PUBLIC_DATA_SOURCE_API_URL=https://backend.dev.chorus-tre.ch/api/rest/v1 \
          -e NEXT_PUBLIC_MATOMO_URL=https://matomo.dev.chorus-tre.ch \
          -e NEXT_PUBLIC_MATOMO_CONTAINER_ID=XHnjFrGP \
          -p 3000:3000 \
          chorus/web-ui:latest
```

or

`docker run --rm  --env-file .env  -p3000:3000 chorus/web-ui:latest`

Access your application at `localhost:3000`.

For further assistance or inquiries, feel free to open an issue in the repository.

## License and Usage Restrictions

Any use of the software for purposes other than academic research, including for commercial purposes, shall be requested in advance from [CHUV](mailto:pactt.legal@chuv.ch).

## Testing Strategy

### Test Directory Structure

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

### Testing Layers

1. **Unit Tests**: Test individual components, functions, and classes in isolation.
2. **Integration Tests**: Test interactions between different parts of the application.
3. **Component Tests**: Test UI components in isolation.
4. **End-to-End Tests**: Test complete user flows.
5. **Visual Regression Tests**: Ensure UI appearance remains consistent.
6. **Accessibility Tests**: Validate WCAG compliance.
7. **Performance Tests**: Measure and ensure application performance.

### Running Tests

The project includes several npm scripts for running different types of tests:

```bash
# Run tests in watch mode (development)
pnpm test

# Run all tests once (CI/CD)
pnpm test:run

# Run only unit tests
pnpm test:unit

# Run only integration tests
pnpm test:integration

# Run only end-to-end tests
pnpm test:e2e

# Run only visual regression tests
pnpm test:visual

# Run only accessibility tests
pnpm test:a11y

# Generate test coverage report
pnpm test:coverage

# Run tests in CI mode
pnpm test:ci
```

### Code Coverage Requirements

We maintain the following code coverage thresholds:

- **Global**: 70% statements, branches, functions, and lines
- **Domain Layer**: 90% statements, 85% branches, 90% functions and lines

### Test Utilities

The project provides utility functions for testing in `src/utils/test-utils.tsx`, including:

- A custom render function that includes common providers
- Mock implementations for hooks and contexts
- Helper functions for creating mock repositories and API responses

### Testing Documentation

For more detailed information about our testing strategy, including best practices and examples, see the [Testing Strategy Documentation](./docs/testing-strategy.md).

## License and Usage Restrictions

Any use of the software for purposes other than academic research, including for commercial purposes, shall be requested in advance from [CHUV](mailto:pactt.legal@chuv.ch).

## Acknowledgments

This project has received funding from the Swiss State Secretariat for Education, Research and Innovation (SERI) under contract number 23.00638, as part of the Horizon Europe project “EBRAINS 2.0”.
