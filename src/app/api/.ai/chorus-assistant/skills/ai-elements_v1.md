# AI Elements — Widget Rendering Conventions

This skill defines how the Chorus Research Assistant renders visual widgets in the chat interface using ai-elements components.

## Principle

**Show, don't tell.** When a process, status, or wizard can be rendered as an interactive widget, always prefer that over text. Widgets are more scannable, actionable, and engaging for busy researchers.

## Component Mapping

### Workflow Display → Plan + Task

When `showWorkflow` is triggered, render using:

```
Plan (collapsible container)
├── PlanHeader + PlanTitle ("Data Extraction — Authorized Study")
├── PlanDescription ("7 steps • You are at step 3")
├── PlanContent
│   ├── Task (step 1) ✓ completed
│   │   └── TaskItem: "Researcher submits request"
│   ├── Task (step 2) ✓ completed
│   │   └── TaskItem: "DSI validates consent"
│   ├── Task (step 3) ● current
│   │   └── TaskItem: "Data extraction from CDW"
│   ├── Task (step 4) ○ pending
│   │   └── TaskItem: "De-identification"
│   └── ...
└── PlanFooter
    └── Actions: [View details] [View requirements]
```

### Workspace Status → Artifact

When `getWorkspaceStatus` is triggered, render using:

```
Artifact
├── ArtifactHeader
│   ├── ArtifactTitle: workspace name
│   └── ArtifactDescription: status badge + member count
├── ArtifactContent
│   ├── Section: Members (list with roles)
│   ├── Section: Workbenches (status badges)
│   ├── Section: Pending Requests (approval status)
│   └── Section: Configuration (network, storage)
└── ArtifactActions: [Open workspace] [Launch session]
```

### Study Setup Wizard → Custom Artifact

When `showStudySetupWizard` is triggered, render as a multi-step artifact:

```
Artifact (wizard container)
├── Step indicator bar (5 steps)
├── Step content (form for current step)
│   Step 1: Study profile (type selector cards)
│   Step 2: Regulatory checklist (auto-populated checkboxes)
│   Step 3: Data needs (CDW, external, imaging toggles)
│   Step 4: Workspace config (name, resources, network)
│   Step 5: Review summary card
└── Navigation: [Back] [Continue] / [Create workspace]
```

### Documentation Citations → Sources

When Needle search returns results, render using:

```
Sources
├── SourcesTrigger (count badge)
└── SourcesContent
    ├── Source: "SPO-320-WI-001 — BASEC Submission Instructions"
    ├── Source: "SPO-330-SOP-001 — Database Setup"
    └── ...
```

### Quick Actions → Suggestions

For onboarding or post-action prompts:

```
Suggestions (horizontal scrollable row)
├── Suggestion: "Start a new study"
├── Suggestion: "Extract data from CDW"
├── Suggestion: "What approvals do I need?"
└── Suggestion: "Show my workspace"
```

### Tool Invocations → Tool

When any tool is executing, show progress via:

```
Tool
├── ToolHeader (type + state badge: pending/running/completed)
├── ToolContent
│   ├── ToolInput (parameters as formatted JSON — only in expanded view)
│   └── ToolOutput (result rendering)
└── Auto-collapses when completed
```

## Styling Conventions

- Use the existing theme (shadcn/ui with Tailwind)
- Status colors: `emerald` for success, `amber` for pending, `red` for error, `primary` for active
- Keep widgets compact — researchers see them in a chat panel, not fullscreen
- All widgets must work in both expanded and collapsed chat states

## Reference

Full ai-elements documentation: `chorus-web-ui/.agents/skills/ai-elements/`
Component references: `chorus-web-ui/.agents/skills/ai-elements/references/`
Installed components: `chorus-web-ui/src/components/ai-elements/`
