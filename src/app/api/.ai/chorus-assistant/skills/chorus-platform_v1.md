# CHORUS Platform Knowledge

Domain knowledge about the CHORUS Trusted Research Environment platform.

## What is CHORUS?

CHORUS (Clinical Hospital Research Unified System) is a **Trusted Research Environment (TRE)** for medical researchers at CHUV. It provides secure, isolated compute environments for research projects with controlled data access and full audit trails.

## Core Concepts

### Workspaces

A **workspace** is an isolated research environment for a study or project.

| Property | Description |
|----------|-------------|
| `name` | Human-readable workspace name |
| `shortName` | URL-safe identifier (lowercase, hyphens) |
| `description` | Study description |
| `status` | `active` / `inactive` / `deleted` |
| `members` | Users with assigned roles |
| `workbenches` | Compute sessions running inside |
| `appInstances` | Applications deployed |

**Key properties (via DevStore config):**
- **Network policy**: `none` / `limited` / `full` — controls internet access
- **Copy/paste**: enabled or disabled (security control)
- **Resource preset**: `small` / `medium` / `large` / `custom`
- **Storage**: cold storage (persistent) + hot storage (fast SSD)
- **Services**: GitLab, Kubernetes, HPC access

### Workbenches (Sessions)

A **workbench** is a running compute session inside a workspace.

| Property | Description |
|----------|-------------|
| `name` | Session name |
| `workspaceId` | Parent workspace |
| `status` | `active` / `inactive` / `deleted` |
| `serverPodStatus` | K8s pod state: `Running` / `Progressing` / `Failed` / etc. |

Workbenches run applications (RStudio, JupyterLab, VS Code, etc.) in Kubernetes pods with configured resources.

### Apps (App Store)

**Apps** are containerized tools researchers can launch:
- RStudio, JupyterLab, VS Code Server
- Custom Docker images (ML frameworks, bioinformatics pipelines)
- Each app has CPU/memory/GPU resource limits

### Approval Requests

Data governance is enforced through **approval workflows**:

| Type | Purpose |
|------|---------|
| `DATA_EXTRACTION` | Extract data out of a workspace |
| `DATA_TRANSFER` | Transfer data between workspaces |

Each request has:
- `status`: `PENDING` / `APPROVED` / `REJECTED` / `CANCELLED`
- `requesterId`: who made the request
- `approverIds`: who can approve
- `files`: list of files with source/destination paths

### Users & Roles

Users have roles at the workspace level:
- **Owner** — full control, can manage members
- **Member** — access to workspace resources
- **Viewer** — read-only access

### Audit Trail

All actions are logged for compliance:
- Who did what, when, from where
- Data access, file operations, session launches
- Approval decisions and justifications

## Platform Architecture

```
┌─ CHORUS Platform ──────────────────────────────────┐
│                                                     │
│  Web UI (Next.js) ──► REST API ──► gRPC Backend    │
│                                                     │
│  ┌─ Workspace ─────────────────────────────────┐   │
│  │                                              │   │
│  │  ┌─ Workbench (K8s Pod) ─────────────────┐  │   │
│  │  │  App (Docker container)                │  │   │
│  │  │  • RStudio / JupyterLab / VS Code     │  │   │
│  │  │  • GPU, CPU, memory allocation         │  │   │
│  │  └───────────────────────────────────────┘  │   │
│  │                                              │   │
│  │  ┌─ Storage ─────────────────────────────┐  │   │
│  │  │  Hot (SSD) + Cold (persistent)        │  │   │
│  │  └───────────────────────────────────────┘  │   │
│  │                                              │   │
│  │  ┌─ Data Governance ─────────────────────┐  │   │
│  │  │  Approval requests, audit trail        │  │   │
│  │  └───────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ┌─ Kubernetes (Workbench Operator) ────────────┐  │
│  │  Manages pod lifecycle, scaling, GPU          │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌─ Gatekeeper ─────────────────────────────────┐  │
│  │  Authentication, authorization, RBAC          │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## View-Model Functions Available

The chat API can access platform data through these functions:

| Function | What it returns |
|----------|----------------|
| `workspaceList()` | All user's workspaces |
| `workspaceGetWithDev(id)` | Workspace + members + config |
| `workbenchList()` | All user's workbenches |
| `getWorkbench(id)` | Single workbench details |
| `listUsers(filter)` | Users, filterable by workspace |

## How to Use This Knowledge

When a user asks about CHORUS:
1. Explain concepts in plain terms (workspace = your study's home, workbench = your computer)
2. When showing status, use `getWorkspaceStatus` tool
3. For "how do I create a workspace?" → use `showStudySetupWizard`
4. For app questions → explain the App Store and available tools
5. For data governance → explain the approval workflow
