---
description: Manage the 5-stage AI Software Development Lifecycle (SDLC) for a feature or bug fix.
---

1. **Assessment & Routing**
   - Review the user's request.
   - Determine the maturity of the request:
     - **Vague idea**: Start at **Stage 1 (Requirements)**.
     - **Clear spec/wireframe**: Start at **Stage 3 (Implementation)**.
     - **Bug report**: Start at **Stage 4 (Quality)**.

2. **Memory Initialization**
   - Check if the item exists in `ai-assistants/memory/backlog.md`. If not, add it.
   - Check status in `ai-assistants/memory/features.md`.

3. **Stage Execution**
   - **Stage 1: Requirements**
     - Goal: Define *What*.
     - Action: Clarify scope, user stories, and acceptance criteria.
     - Definition of Done: User Story added to `ai-assistants/memory/requirements.md`.
   
   - **Stage 2: Design**
     - Goal: Define *Look & Feel*.
     - Action: Create design specs or component choices.
     - Definition of Done: Design specs documented.
   
   - **Stage 3: Implementation**
     - Goal: Build *How*.
     - Action: Write code and implement the feature.
     - Definition of Done: Code is implemented.
   
   - **Stage 4: Quality**
     - Goal: Verify *Correctness*.
     - Action: Run tests, debug, and verify against requirements.
     - Definition of Done: Tests passed, bugs resolved.
   
   - **Stage 5: Deployment**
     - Goal: Ship *Value*.
     - Action: Prepare for release/merge.
     - Definition of Done: Feature marked as Released in `ai-assistants/memory/features.md`.

4. **Governance & Documentation**
   - Update `ai-assistants/memory/decisions.md` with any key technical or product decisions made.
   - Update the status of the item in `ai-assistants/memory/backlog.md` and `ai-assistants/memory/features.md`.
