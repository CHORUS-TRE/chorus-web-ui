# CHORUS Web User Interface

Welcome to the CHORUS Web User Interface! This part of the platform provides a web-based interface to interact with CHORUS, leveraging the power of Next.js to deliver a responsive and dynamic user experience.

## Description

The CHORUS Web UI is built with Next.js, a React framework that supports both client-side and server-side rendering. This approach ensures optimal performance and responsiveness across all devices.

## Technology Stack

- **Frameworks**: Next.js
- **Programming Language**: TypeScript
- **Engines**: Node, pnpm
- **Code Quality Tools**: ESLint, Prettier, husky
- **CSS Framework**: Tailwind CSS, shadcdn/ui
- **Testing Framework**: Jest

## Getting Started

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

3. **Developing Your Application**

   - Main Page: Edit src/app/index.tsx to modify the homepage.
   - New Pages: Create additional pages and routes in the src/app directory.
   - Shared Components: Develop reusable components like headers or footers in the src/components folder.

4. **Styling, Design System**

	- We use [shadcdn/ui](https://ui.shadcn.com/) as a design system.
	- Use `npx shadcn-ui@latest add <compnent>` to add [components](https://ui.shadcn.com/docs/components/accordion)

4. **Code versionning**

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

1. **Testing Your Application**

   - Add or update tests in `__tests__/`.
   - Example tests for components and pages are provided, such as for the Home component.

2. **Local Production Testing**

   Build and run the production application locally:

   ```bash
   docker build -t chorus-web-ui .
   docker run --rm -p <some port>:3000 chorus-web-ui
   ```

   Access your application at `localhost:<the port you put>`.

For further assistance or inquiries, feel free to open an issue in the repository.

Any use of the software for purposes other than academic research, including for commercial purposes, shall be requested in advance from [CHUV](mailto:pactt.legal@chuv.ch).

