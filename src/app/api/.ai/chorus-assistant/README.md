# Chorus Research Assistant — Architecture

## Overview

The Chorus Research Assistant is an AI agent embedded in the CHORUS TRE web UI that helps Principal Investigators and research teams conduct clinical studies at CHUV. It combines three knowledge domains with platform awareness to provide guided, contextual assistance.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  CHORUS Web UI (Next.js)                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Chat Interface (ai-elements)                         │  │
│  │  ┌─────────┐ ┌──────────┐ ┌────────────────────────┐ │  │
│  │  │ Message  │ │ Plan +   │ │ Study Setup Wizard     │ │  │
│  │  │ Sources  │ │ Task     │ │ (Artifact)             │ │  │
│  │  │ Suggest. │ │ widgets  │ │                        │ │  │
│  │  └─────────┘ └──────────┘ └────────────────────────┘ │  │
│  └───────────────────┬───────────────────────────────────┘  │
│                      │ /api/chat                             │
│  ┌───────────────────▼───────────────────────────────────┐  │
│  │  Chat API Route (AI SDK)                              │  │
│  │  • System prompt (from AGENT.md)                      │  │
│  │  • Tools: getWorkspaceStatus, showWorkflow,           │  │
│  │           showStudySetupWizard                        │  │
│  │  • View-models: workspace, workbench, approval, user  │  │
│  └──────┬────────────────────────────┬───────────────────┘  │
│         │                            │                       │
└─────────┼────────────────────────────┼───────────────────────┘
          │                            │
          ▼                            ▼
┌──────────────────┐     ┌──────────────────────────┐
│  Needle MCP      │     │  CHORUS Backend (gRPC)   │
│  (RAG)           │     │  via REST gateway        │
│                  │     │                          │
│  Collections:    │     │  • Workspaces            │
│  • BPR (QMS)     │     │  • Workbenches           │
│  • DSI (Extract) │     │  • Apps / Instances      │
│  • Chorus (Docs) │     │  • Approval Requests     │
└──────────────────┘     │  • Users / Roles         │
                         └──────────────────────────┘
```

## Components

### Agent Definition (`chorus-ai/.ai/chorus-assistant/`)

The agent's "brain" — knowledge, playbooks, and skills that define how it behaves. This is the source of truth for:
- System prompt and behavior rules
- Routing logic (user intent → playbook)
- Domain knowledge (BPR, DSI, regulatory)
- Tool specifications

### Chat API (`chorus-web-ui/src/app/api/chat/route.ts`)

The runtime that connects the agent definition to the web UI:
- Imports system prompt from agent definition
- Registers AI SDK tools (getWorkspaceStatus, showWorkflow, showStudySetupWizard)
- Connects to Needle MCP for documentation search
- Streams responses to the chat interface

### Chat UI (`chorus-web-ui/src/components/chat/`)

The user-facing interface built with ai-elements:
- `Conversation` + `Message` for chat messages
- `Sources` for RAG citation display
- `Plan` + `Task` for workflow visualization
- `Artifact` for the study setup wizard
- `Suggestion` for quick action prompts
- `Tool` for showing tool invocation states

### RAG Layer (Needle MCP)

Semantic search over three document collections:
- **BPR** — 128 QMS documents (SOPs, policies, work instructions, templates)
- **DSI** — Data extraction procedures (feasibility, authorized studies, specific requests)
- **Chorus** — Platform documentation (tutorials, service catalog, technical docs)

## Knowledge Domains

### 1. BPR — Quality Management System
The complete QMS of the CHUV Sponsor Research Office. Covers the study lifecycle from planning through close-out. See `skills/bpr-knowledge_v1.md`.

### 2. DSI — Data Extraction Procedures
Three-track process for extracting clinical data from the CDW:
- **Track 1**: Feasibility studies (5 steps, no patient data)
- **Track 2**: Authorized studies (7 steps, de-identified data)
- **Track 3**: Specific requests (genomic biobank, imaging)
See `skills/dsi-knowledge_v1.md`.

### 3. CHORUS Platform
The TRE platform concepts: workspaces, workbenches, apps, approval requests, data transfers.
See `skills/chorus-platform_v1.md`.

### 4. Swiss Regulatory Framework
HRA, ClinO, HRO, ICH GCP, CER-VD, Swissmedic, BASEC.
See `skills/regulatory-framework_v1.md`.

## Tool Rendering

Each tool renders as a specific ai-elements widget in the chat:

| Tool | Widget | Components Used |
|------|--------|----------------|
| `getWorkspaceStatus` | Status card | `Artifact`, `ArtifactHeader`, `ArtifactContent` |
| `showWorkflow` | Interactive plan | `Plan`, `PlanHeader`, `Task`, `TaskItem` |
| `showStudySetupWizard` | Multi-step wizard | Custom `Artifact` with step navigation |

## File Structure

```
chorus-ai/.ai/chorus-assistant/
├── AGENT.md                          # Orchestrator — system prompt, routing, tools
├── README.md                         # This file
├── playbooks/
│   ├── study-setup_v1.md             # New study → workspace creation
│   ├── data-extraction_v1.md         # DSI 3-track data extraction
│   ├── regulatory-guidance_v1.md     # BASEC, CER-VD, Swissmedic
│   ├── workspace-status_v1.md        # Show study progress
│   └── onboarding_v1.md              # First interaction
├── skills/
│   ├── bpr-knowledge_v1.md           # BPR QMS domain knowledge
│   ├── dsi-knowledge_v1.md           # DSI extraction procedures
│   ├── chorus-platform_v1.md         # CHORUS platform concepts
│   ├── regulatory-framework_v1.md    # Swiss regulations
│   └── ai-elements_v1.md             # Widget rendering conventions
├── knowledge/
│   ├── study-lifecycle.md            # Quick reference
│   └── glossary.md                   # Key terms
└── tools/
    └── README.md                     # AI SDK tool specifications
```
