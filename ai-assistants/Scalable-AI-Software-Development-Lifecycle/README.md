# AI-Driven Software Development Lifecycle (AI-SDLC)

This directory implements a structured, 5-stage software development lifecycle managed optimally by specialized AI agents.

## 📂 Structure

The process is divided into 5 sequential stages, each with its own workspace and specialized context.

### The 5 Stages

1.  **[1-requirements-and-planning](./1-requirements-and-planning)**
    *   **Goal**: Define *what* to build.
    *   **Output**: User Stories in `memory/requirements.md` and tasks in `memory/backlog.md`.
2.  **[2-ux-ui-design](./2-ux-ui-design)**
    *   **Goal**: Define *how* it looks and feels.
    *   **Output**: Wireframes, component selection (shadcn/ui), and design specs.
3.  **[3-implementation-and-code](./3-implementation-and-code)**
    *   **Goal**: Build it.
    *   **Output**: Production-ready Next.js/React code, adhering to Clean Architecture.
4.  **[4-quality-and-debugging](./4-quality-and-debugging)**
    *   **Goal**: Verify it works.
    *   **Output**: Jest tests, bug fixes, and performance audits.
5.  **[5-deployment-and-releases](./5-deployment-and-releases)**
    *   **Goal**: Ship it.
    *   **Output**: Changelogs, git tags, and version bumps.

### Shared Brain (`context/` & `memory/`)

To ensure seamless collaboration between stages, all agents share a common "brain":

*   **`context/`**: Static project knowledge (Architecture guides, Product Vision, etc.). Read-only.
*   **`memory/`**: Living project state (Backlog, Requirements, Bugs, Decisions). Read-write.

## 🔄 Workflow

To implement a new feature (e.g., "Add Dark Mode"):

1.  Start with **Stage 1**: "I want Dark Mode." -> *Agent 1 creates the User Story.*
2.  Move to **Stage 2**: "Design the Dark Mode toggles." -> *Agent 2 proposes the UI.*
3.  Move to **Stage 3**: "Implement the Dark Mode provider." -> *Agent 3 writes the code.*
4.  Move to **Stage 4**: "Test the theme switching." -> *Agent 4 writes tests.*
5.  Move to **Stage 5**: "Release version 1.1 with Dark Mode." -> *Agent 5 updates package.json.*

## 🤖 The Pipeline Manager

You can use the **Root Agent** (in this folder) to oversee this process.
*   **Usage**: Ask the root agent to "Manage the implementation of Feature X".
*   **Role**: It will guide you through the stages, ensuring artifacts are passed correctly.
