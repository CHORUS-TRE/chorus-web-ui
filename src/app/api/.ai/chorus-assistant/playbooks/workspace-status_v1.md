# Workspace Status Playbook

Show the user the current state of their study workspace on CHORUS. This is loaded when users ask about their study progress, workspace details, or want to check status.

## When to Use

- User asks "where am I?" or "what's the status of my study?"
- User asks about their workspace, workbenches, members, or approvals
- User returns after a break and wants to orient themselves

## Flow

### 1. Identify the workspace

If the user has multiple workspaces, ask which one:

> "Which workspace would you like to check? I can show you all your workspaces, or you can tell me the study name."

If they only have one, or the context makes it clear, proceed directly.

### 2. Trigger getWorkspaceStatus

Call `getWorkspaceStatus` with the workspace ID. This renders as a status card showing:

- **Workspace info** — name, description, status (active/inactive), creation date
- **Members** — list of team members and their roles
- **Workbenches** — running sessions, their status (Running/Progressing/Failed)
- **Data** — pending approval requests (extractions, transfers)
- **Configuration** — network policy, resource preset, storage

### 3. Interpret the status

Based on what the status card shows, provide contextual guidance:

**If workspace is new (no workbenches, no data):**
> "Your workspace was just created. Next steps: launch a session (workbench) and request your data from DSI if needed."

**If workbenches are running:**
> "You have active sessions running. You can access them from the Sessions page."

**If there are pending approval requests:**
> "You have pending data requests awaiting approval. These need to be approved by an authorized reviewer before the data is transferred."

**If workspace has members but no recent activity:**
> "Your workspace has [N] members but no active sessions. Need help getting started?"

### 4. Offer next actions

Based on the status, suggest relevant next steps:
- No data yet → "Want me to walk you through requesting data from DSI?"
- No sessions → "Want to launch a workbench with RStudio or JupyterLab?"
- Pending approvals → "I can explain the approval process if you'd like."
- Active work → "Everything looks good. Need anything specific?"

## Checkpoints

- After showing status → ask if anything needs attention
- If workspace not found → help them find the right one or create a new one
