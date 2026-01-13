# Methodology: Scalable AI Software Development Lifecycle (AI-SDLC)

This document describes a reusable methodology for structuring software projects to maximize the effectiveness of AI Assistants (LLMs).

## Core Philosophy

AI Agents perform best when they have a **Specified Role** and a **Narrow Context**. Instead of one generic "Coder AI", we split the lifecycle into 5 distinct stages, mimicking a specialized human team.

## The Directory Structure Pattern

To apply this to a new project, create an `ai-assistants/` directory with the following structure:

```text
ai-assistants/
├── context/                      # READ-ONLY: Static Project Knowledge
│   ├── architecture.md           # System design & patterns
│   ├── tech-stack.md             # Libraries, versions, tools
│   └── coding-standards.md       # Linters, formatting, naming conventions
│
├── memory/                       # READ-WRITE: Living Project State
│   ├── backlog.md                # Features & Ideas
│   ├── requirements.md           # User Stories & Specs
│   ├── bugs.md                   # Known issues
│   ├── decisions.md              # ADRs (Architecture Decision Records)
│   └── active_sprint.md          # Current focus (TODOs)
│
├── 1-requirements-and-planning/  # Stage 1 Agent
│   └── INSTRUCTIONS.md           # "You are a Product Owner..."
│
├── 2-ux-ui-design/               # Stage 2 Agent
│   └── INSTRUCTIONS.md           # "You are a UI Designer..."
│
├── 3-implementation-and-code/    # Stage 3 Agent
│   └── INSTRUCTIONS.md           # "You are a Senior Engineer..."
│
├── 4-quality-and-debugging/      # Stage 4 Agent
│   └── INSTRUCTIONS.md           # "You are a QA Engineer/Tester..."
│
└── 5-deployment-and-releases/    # Stage 5 Agent
    └── INSTRUCTIONS.md           # "You are a Release Manager..."
```

## Implementation Guide for New Projects

### Step 1: Initialize Context
Write the "Bible" of your project in `context/`.
*   **Why?** AIs need to know the rules before they play.
*   **Content**: Explain *what* the project is, the tech stack (language, frameworks), and the *rules* (no direct DB access, use specific patterns, etc.).

### Step 2: Initialize Memory
Create empty markdown files in `memory/` for the AIs to interact with.
*   **Why?** This simulates "Short-term Organization Memory". It persists context between sessions.

### Step 3: Create Agent Personas
Copy the folder structure (1-5). Customize the `INSTRUCTIONS.md` for each:
*   **Stage 1**: Focus on questioning the user and updating `requirements.md`.
*   **Stage 2**: Focus on your specific UI library (Material, Tailwind, etc.).
*   **Stage 3**: Point heavily to `context/coding-standards.md`.
*   **Stage 4**: Define your testing framework (Jest, PyTest, etc.).
*   **Stage 5**: Define your versioning strategy (SemVer, CalVer).

### Step 4: The Workflow
1.  **Define**: Use Stage 1 to write to `memory/requirements.md`.
2.  **Design**: Use Stage 2 to read `requirements.md` and check `context/ui-kit.md`.
3.  **Build**: Use Stage 3 to read `requirements.md` and write code.
4.  **Test**: Use Stage 4 to read code and write tests.
5.  **Ship**: Use Stage 5 to package it.

## Benefits

*   **Context Window Optimization**: Each agent only loads what it needs.
*   **Role Clarity**: "Designer" agents won't try to write SQL queries. "Coder" agents won't argue about color theory.
*   **Continuity**: The `memory/` folder acts as a persistent state machine for the project.
