# Tool Specifications — AI SDK

These are the tool definitions for the `/api/chat/route.ts` in `chorus-web-ui`. Each tool is registered with the AI SDK's `streamText` function and renders as a specific widget in the chat UI.

## Tool: getWorkspaceStatus

**Purpose:** Fetch and display a workspace's current state including members, workbenches, and pending requests.

**When the LLM should call it:** User asks about their study status, workspace state, team members, or active sessions.

**Renders as:** `Artifact` card (see `skills/ai-elements_v1.md`)

```typescript
getWorkspaceStatus: tool({
  description:
    'Show the current status of a research workspace, including members, active sessions, and pending data requests. Use when the user asks about their study progress or workspace state.',
  inputSchema: z.object({
    workspaceId: z
      .string()
      .optional()
      .describe('Workspace ID. If omitted, show a list of user workspaces to pick from.'),
  }),
  execute: async ({ workspaceId }) => {
    if (!workspaceId) {
      // Return list of workspaces for the user to choose
      const result = await workspaceListWithDev()
      return {
        type: 'workspace-list',
        workspaces: result.data?.map(ws => ({
          id: ws.id,
          name: ws.name,
          status: ws.status,
          memberCount: ws.dev?.memberCount ?? 0,
          workbenchCount: ws.dev?.workbenchCount ?? 0,
        })) ?? [],
      }
    }

    const result = await workspaceGetWithDev(workspaceId)
    if (result.error) return { type: 'error', message: result.error }

    const ws = result.data!
    return {
      type: 'workspace-status',
      workspace: {
        id: ws.id,
        name: ws.name,
        shortName: ws.shortName,
        description: ws.description,
        status: ws.status,
        createdAt: ws.createdAt,
      },
      members: ws.dev?.members?.map(u => ({
        name: `${u.firstName} ${u.lastName}`,
        role: u.role,
      })) ?? [],
      owner: ws.dev?.owner,
      workbenchCount: ws.dev?.workbenchCount ?? 0,
      config: ws.dev?.config,
    }
  },
}),
```

## Tool: showWorkflow

**Purpose:** Display an interactive workflow widget showing process steps with status indicators.

**When the LLM should call it:** User asks "how do I...?", asks about a process or procedure, or needs to understand a multi-step workflow.

**Renders as:** `Plan` + `Task` widgets (see `skills/ai-elements_v1.md`)

```typescript
showWorkflow: tool({
  description:
    'Display a clinical research workflow as an interactive step-by-step plan. Use when the user asks about a process, procedure, or how to do something.',
  inputSchema: z.object({
    workflowId: z
      .enum([
        'study-lifecycle',
        'feasibility-study',
        'data-extraction',
        'regulatory-submission',
        'workspace-setup',
        'informed-consent',
        'safety-reporting',
        'monitoring',
      ])
      .describe('The workflow to display'),
    currentStep: z
      .number()
      .optional()
      .describe('Current step index (0-based). Steps before this are marked completed.'),
    context: z
      .string()
      .optional()
      .describe('Additional context about the user situation to tailor the workflow display'),
  }),
  execute: async ({ workflowId, currentStep, context }) => {
    // Workflow definitions are loaded from knowledge files
    // The frontend renders them using Plan + Task components
    return {
      type: 'workflow',
      workflowId,
      currentStep: currentStep ?? 0,
      context: context ?? null,
    }
  },
}),
```

### Workflow Definitions

These are rendered client-side. The workflow data lives in the frontend (or is fetched from a config):

| ID | Title | Steps |
|----|-------|-------|
| `study-lifecycle` | Study Lifecycle | Planning, Regulatory, Site Setup, Conduct, Close-out |
| `feasibility-study` | Feasibility Study (DSI) | Request, Validate, Extract, Review, Deliver |
| `data-extraction` | Data Extraction — Authorized Study | Request, Consent check, Protocol review, Extract, De-identify, QC, Deliver |
| `regulatory-submission` | Regulatory Submission | Strategy, Prepare docs, BASEC submit, CER-VD review, Swissmedic (if needed), Approval |
| `workspace-setup` | CHORUS Workspace Setup | Create workspace, Configure, Add members, Install apps, Request data |
| `informed-consent` | Informed Consent Process | Prepare ICF, Train team, Obtain consent, Document, Monitor |
| `safety-reporting` | Safety & AE Reporting | Detect AE, Assess severity, Report SAE, Notify sponsor, Notify CER-VD, Follow-up |
| `monitoring` | Clinical Monitoring | Prepare, Initiation visit, Routine monitoring, SDV, Close-out visit |

## Tool: showStudySetupWizard

**Purpose:** Launch a multi-step wizard that guides the user through creating a research workspace with study-aware defaults.

**When the LLM should call it:** User wants to create a new study, start a research project, or set up a workspace.

**Renders as:** Multi-step `Artifact` wizard (see `skills/ai-elements_v1.md`)

```typescript
showStudySetupWizard: tool({
  description:
    'Launch an interactive study setup wizard that guides the user through creating a research workspace. Goes beyond basic workspace creation by including regulatory checklist, data needs assessment, and study-appropriate configuration. Use when the user wants to start a new study or create a workspace.',
  inputSchema: z.object({
    studyType: z
      .enum(['clinical-trial', 'observational', 'data-analysis', 'ml-ai', 'general'])
      .optional()
      .describe('Type of research study, if already known from conversation'),
    suggestedName: z
      .string()
      .optional()
      .describe('Pre-filled study/workspace name if mentioned by user'),
    regulatoryStatus: z
      .enum(['pending', 'approved', 'not-required'])
      .optional()
      .describe('Whether CER-VD approval is pending, already obtained, or not required'),
    dataNeedsHint: z
      .enum(['cdw', 'external', 'imaging', 'biobank', 'none'])
      .optional()
      .describe('Primary data source if known from conversation'),
    context: z
      .string()
      .optional()
      .describe('Any additional context from conversation to pre-populate wizard fields'),
  }),
  execute: async (input) => ({
    type: 'study-setup-wizard',
    studyType: input.studyType ?? null,
    suggestedName: input.suggestedName ?? null,
    regulatoryStatus: input.regulatoryStatus ?? null,
    dataNeedsHint: input.dataNeedsHint ?? null,
    context: input.context ?? null,
  }),
}),
```

### Wizard Steps

The wizard renders 5 steps client-side:

#### Step 1: Study Profile
- Study type selector (cards: clinical trial, observational, data analysis, ML/AI, general)
- Study title input
- PI name (pre-filled from auth context)

#### Step 2: Regulatory Checklist
Auto-populated based on study type:

| Study Type | CER-VD | Swissmedic | SNCTP | DMC | Insurance |
|------------|--------|------------|-------|-----|-----------|
| Clinical trial | ✓ Required | ✓ Cat. B/C | ✓ Required | ✓ Risk-dependent | ✓ Required |
| Observational | ✓ Required | — | — | — | — |
| Data analysis | ? Depends | — | — | — | — |
| ML/AI | ✓ Required | — | — | — | — |
| General | ? Depends | — | — | — | — |

User can check items off, mark as "already done", or "not applicable".

#### Step 3: Data Needs
- CDW data needed? (toggle) → shows DSI extraction info
- External data import? (toggle) → shows data transfer info
- Medical imaging? (toggle) → shows HORUS Image info
- Genomic samples? (toggle) → shows biobank info
- Anonymization level: standard HIPAA / enhanced (AI) / custom

#### Step 4: Workspace Configuration
- Workspace name + short name (auto-generated)
- Description (pre-filled from context)
- Network policy: none / limited / full
- Resource preset: small / medium / large / custom
- Apps to install: checkboxes (RStudio, JupyterLab, VS Code, custom)
- Storage: cold + hot sizes

#### Step 5: Review & Create
- Summary card with all selections
- Regulatory status indicators
- [Create Workspace] button → calls `workspaceCreateWithDev`
- Post-creation: shows next steps based on study type

## Needle MCP Integration

The Needle MCP server provides documentation search. It is NOT an AI SDK tool — it runs as a separate MCP server. The LLM calls Needle tools natively via the MCP protocol:

| Needle Tool | When to Use |
|-------------|-------------|
| `needle_search(collection_id, query)` | User asks about a procedure, regulation, or documentation |
| `needle_list_collections()` | Need to find which collection to search |
| `needle_list_files(collection_id)` | Need to list available documents |

### MCP Configuration

```json
{
  "mcpServers": {
    "needle": {
      "command": "uv",
      "args": ["--directory", "/path/to/needle-mcp", "run", "needle-mcp"]
    }
  }
}
```

## Implementation Notes

### Imports needed in route.ts

```typescript
import { workspaceGetWithDev, workspaceListWithDev } from '~/view-model/workspace-view-model'
```

### Frontend rendering

Tool outputs are rendered in `chat-message.tsx` by matching `part.type`:
- `tool-getWorkspaceStatus` → workspace status Artifact
- `tool-showWorkflow` → Plan + Task widget
- `tool-showStudySetupWizard` → study setup wizard Artifact

Each tool result type needs a corresponding renderer component in `components/chat/artifacts/`.
