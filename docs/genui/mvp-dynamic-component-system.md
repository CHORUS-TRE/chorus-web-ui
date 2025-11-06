# CHORUS Dynamic Component System - MVP Plan

**Document Version:** 1.0  
**Date:** October 11, 2025  
**Status:** MVP Planning Phase  
**Timeline:** 6 Weeks  
**Team:** Development Team, UX/UI Designers  

---

## Executive Summary

This document outlines the **Minimum Viable Product (MVP)** for the CHORUS Dynamic Component Generation System. The MVP focuses on proving the core concept of generating research-specific UI components through natural language prompts with automatic CHORUS API integration, while keeping complexity manageable for a 6-week development cycle.

### MVP Core Value Proposition
**"Generate research-specific UI components through natural language prompts with automatic CHORUS API integration"**

---

## MVP Scope Definition

### What We're Building (MVP Features)

#### 1. Basic Component Generation
```typescript
interface MVPComponentGeneration {
  input: "Natural language prompt (text only)"
  output: "Functional React component with shadcn/ui styling"
  integration: "Basic CHORUS API data binding"
  preview: "Live component preview in browser"
}
```

#### 2. Core Component Templates
```typescript
const mvpTemplates = {
  dataDisplay: [
    'data-table',      // Research data in table format
    'metric-card',     // Key metric display
    'progress-bar',    // Progress tracking
    'status-badge'     // Status indicators
  ],
  
  forms: [
    'data-entry-form', // Simple research data entry
    'search-filter',   // Filter/search interface
    'export-button'    // Data export functionality
  ],
  
  layout: [
    'dashboard-panel', // Basic dashboard section
    'info-card',       // Information display card
    'action-toolbar'   // Toolbar with actions
  ]
}
```

#### 3. Simple AI Generation
- **Text-only prompts** (no voice, sketches, etc.)
- **Template-based generation** (faster, more reliable)
- **Basic context awareness** (current workspace, user permissions)
- **shadcn/ui component integration**

#### 4. Basic API Integration
- **Read-only CHORUS API bindings** (no complex CRUD operations)
- **Simple permission checks** (show/hide based on user role)
- **Basic data fetching** with loading states

---

## Simplified MVP Architecture

### MVP Component Stack

```typescript
// Simplified 3-layer architecture for MVP
interface MVPArchitecture {
  frontend: {
    componentGenerator: SimpleComponentGenerator    // Basic AI prompt interface
    componentRenderer: DynamicComponentRenderer    // Render generated components
    componentLibrary: BasicTemplateLibrary         // Pre-built templates
  }
  
  api: {
    generateEndpoint: '/api/components/generate'    // Single generation endpoint
    templatesEndpoint: '/api/components/templates'  // Template library
    previewEndpoint: '/api/components/preview'      // Component preview
  }
  
  storage: {
    templates: TemplateDatabase                     // Pre-built component templates
    generated: GeneratedComponentCache             // Cache generated components
  }
}
```

### MVP Data Flow

```
User Prompt → Simple AI Parser → Template Selector → Component Generator → API Binder → Live Preview → Deploy to Page
```

---

## MVP Features Deep Dive

### 1. Component Generation Interface

```typescript
// Simple generation form
interface MVPGenerationInterface {
  prompt: string                    // "Create a table showing workspace data"
  context: {
    workspaceId?: string           // Current workspace context
    userRole: UserRole             // For permissions
    pageContext: 'dashboard' | 'workspace' | 'session'
  }
  preview: boolean                 // Show preview before deploy
}
```

### 2. Template-Based Generation

```typescript
// MVP templates with simple patterns
const mvpComponentTemplates = {
  'data-table': {
    prompt_patterns: ['table', 'list', 'data', 'rows'],
    template: DataTableTemplate,
    api_binding: 'workspace.data',
    required_props: ['columns', 'data']
  },
  
  'metric-card': {
    prompt_patterns: ['metric', 'count', 'total', 'number'],
    template: MetricCardTemplate,
    api_binding: 'workspace.analytics',
    required_props: ['title', 'value', 'description']
  },
  
  'progress-bar': {
    prompt_patterns: ['progress', 'completion', 'status'],
    template: ProgressBarTemplate,
    api_binding: 'workspace.progress',
    required_props: ['current', 'total', 'label']
  }
}
```

### 3. Basic API Integration

```typescript
// Simplified API binding for MVP
interface MVPAPIBinding {
  endpoint: CHORUSEndpoint
  method: 'GET'                    // MVP: Read-only operations
  permissions: PermissionCheck[]   // Basic permission validation
  cache: boolean                   // Simple caching
  transform?: DataTransformer      // Basic data transformation
}

// Example binding for workspace data
const workspaceDataBinding: MVPAPIBinding = {
  endpoint: '/api/workspaces/{workspaceId}/data',
  method: 'GET',
  permissions: ['workspace.read'],
  cache: true,
  transform: (data) => formatForTable(data)
}
```

---

## MVP Implementation Plan

### Week 1-2: Foundation
```typescript
const week1_2 = {
  backend: [
    'Create basic component template storage',
    'Implement simple prompt parsing (keyword matching)',
    'Build template selector logic',
    'Create component generation API endpoint'
  ],
  
  frontend: [
    'Build component generation form',
    'Create dynamic component renderer',
    'Implement live preview system',
    'Add basic error handling'
  ]
}
```

### Week 3-4: Core Templates
```typescript
const week3_4 = {
  templates: [
    'Build DataTable template with CHORUS API binding',
    'Create MetricCard template with analytics data',
    'Implement ProgressBar with status tracking',
    'Add SearchFilter with workspace data'
  ],
  
  integration: [
    'Connect templates to CHORUS API endpoints',
    'Add basic permission checking',
    'Implement simple caching',
    'Create data transformation utilities'
  ]
}
```

### Week 5-6: User Experience
```typescript
const week5_6 = {
  ux: [
    'Add component customization options',
    'Implement component deployment to pages',
    'Create component library browser',
    'Add success/error feedback'
  ],
  
  polish: [
    'Improve prompt parsing accuracy',
    'Add loading states and animations',
    'Create example prompts and tutorials',
    'Add basic analytics tracking'
  ]
}
```

---

## MVP Technical Implementation

### 1. Simple AI Component Generator

```typescript
// MVP: Rule-based prompt parsing (no complex AI initially)
class SimpleComponentGenerator {
  private templates = new Map<string, ComponentTemplate>()
  
  async generateComponent(prompt: string, context: GenerationContext): Promise<ComponentSpec> {
    // 1. Simple keyword matching
    const intent = this.parseIntent(prompt)
    
    // 2. Select best template
    const template = this.selectTemplate(intent)
    
    // 3. Generate component spec
    const spec = this.buildComponentSpec(template, context)
    
    // 4. Add API bindings
    const withAPI = this.addAPIBindings(spec, context)
    
    return withAPI
  }
  
  private parseIntent(prompt: string): ComponentIntent {
    const keywords = {
      table: ['table', 'list', 'data', 'rows', 'grid'],
      metric: ['metric', 'count', 'total', 'number', 'stat'],
      progress: ['progress', 'completion', 'status', 'bar'],
      form: ['form', 'input', 'create', 'add', 'entry']
    }
    
    // Simple keyword matching
    for (const [type, words] of Object.entries(keywords)) {
      if (words.some(word => prompt.toLowerCase().includes(word))) {
        return { type, confidence: 0.8, prompt }
      }
    }
    
    return { type: 'generic', confidence: 0.5, prompt }
  }
}
```

### 2. Basic Template System

```typescript
// MVP: Pre-built component templates
interface ComponentTemplate {
  id: string
  name: string
  description: string
  category: 'data' | 'form' | 'layout'
  
  // Simplified generation
  generate: (context: GenerationContext) => ComponentSpec
  
  // Basic API integration
  apiBinding?: {
    endpoint: string
    method: 'GET'
    transform?: (data: any) => any
  }
  
  // Required props for the component
  requiredProps: PropDefinition[]
}

// Example: Data Table Template
const dataTableTemplate: ComponentTemplate = {
  id: 'data-table',
  name: 'Data Table',
  description: 'Display data in a sortable table',
  category: 'data',
  
  generate: (context) => ({
    component: 'DataTable',
    props: {
      data: `useWorkspaceData('${context.workspaceId}')`,
      columns: inferColumnsFromContext(context),
      sortable: true,
      filterable: true
    },
    imports: ['DataTable', 'useWorkspaceData'],
    styling: 'default-table-styles'
  }),
  
  apiBinding: {
    endpoint: '/api/workspaces/{workspaceId}/data',
    method: 'GET',
    transform: (data) => formatTableData(data)
  },
  
  requiredProps: [
    { name: 'data', type: 'array', required: true },
    { name: 'columns', type: 'array', required: true }
  ]
}
```

### 3. Dynamic Component Renderer

```typescript
// MVP: Simple component renderer for generated components
class DynamicComponentRenderer {
  async renderComponent(spec: ComponentSpec, props: any): Promise<ReactElement> {
    const componentMap = {
      'DataTable': (props) => <DataTable {...props} />,
      'MetricCard': (props) => <MetricCard {...props} />,
      'ProgressBar': (props) => <ProgressBar {...props} />,
      'SearchFilter': (props) => <SearchFilter {...props} />
    }
    
    const Component = componentMap[spec.component]
    if (!Component) {
      throw new Error(`Unknown component: ${spec.component}`)
    }
    
    // Resolve any data bindings
    const resolvedProps = await this.resolveProps(spec.props, props)
    
    return <Component {...resolvedProps} />
  }
  
  private async resolveProps(specProps: any, userProps: any): Promise<any> {
    const resolved = { ...userProps }
    
    for (const [key, value] of Object.entries(specProps)) {
      if (typeof value === 'string' && value.startsWith('useWorkspaceData(')) {
        // Simple data binding resolution
        const workspaceId = this.extractWorkspaceId(value)
        resolved[key] = await this.fetchWorkspaceData(workspaceId)
      } else {
        resolved[key] = value
      }
    }
    
    return resolved
  }
}
```

### 4. MVP API Endpoints

```typescript
// MVP: Simple API endpoints for component generation
interface MVPComponentAPI {
  // Generate component from prompt
  'POST /api/components/generate': {
    body: {
      prompt: string
      context: {
        workspaceId?: string
        userRole: string
        pageContext: string
      }
    }
    response: {
      componentSpec: ComponentSpec
      preview: string
      success: boolean
    }
  }
  
  // Get available templates
  'GET /api/components/templates': {
    response: ComponentTemplate[]
  }
  
  // Preview component
  'POST /api/components/preview': {
    body: {
      componentSpec: ComponentSpec
      props: any
    }
    response: {
      html: string
      errors?: string[]
    }
  }
  
  // Deploy component to page
  'POST /api/components/deploy': {
    body: {
      componentSpec: ComponentSpec
      targetPage: string
      position: { section: string; order: number }
    }
    response: {
      deploymentId: string
      success: boolean
    }
  }
}
```

---

## MVP User Experience Flow

### 1. Component Generation Flow
```typescript
const mvpUserFlow = {
  step1: {
    action: "User types prompt",
    example: "Create a table showing my workspace data",
    ui: "Simple text input with example prompts"
  },
  
  step2: {
    action: "System processes prompt",
    processing: "Keyword matching → Template selection → API binding",
    ui: "Loading spinner with progress messages"
  },
  
  step3: {
    action: "Live preview generated",
    preview: "Fully functional component with real data",
    ui: "Split view: configuration panel + live preview"
  },
  
  step4: {
    action: "User customizes (optional)",
    options: ["Column selection", "Styling options", "Filter settings"],
    ui: "Simple form controls for customization"
  },
  
  step5: {
    action: "Deploy to page",
    deployment: "Component added to current page/dashboard",
    ui: "Success message + link to deployed component"
  }
}
```

### 2. Example MVP Interactions

```typescript
const mvpExamples = [
  {
    prompt: "Show my workspace progress",
    generates: "ProgressBar with workspace completion percentage",
    apiBinding: "workspace.analytics.completion",
    customization: ["Color scheme", "Show percentage", "Animation speed"]
  },
  
  {
    prompt: "List all my sessions",
    generates: "DataTable with sessions from current workspace",
    apiBinding: "workspace.sessions",
    customization: ["Column visibility", "Sort order", "Row actions"]
  },
  
  {
    prompt: "Add search for workspaces",
    generates: "SearchFilter connected to workspaces endpoint",
    apiBinding: "workspaces.search",
    customization: ["Search fields", "Filter options", "Result display"]
  }
]
```

---

## MVP Success Metrics

### Key Success Indicators
```typescript
const mvpMetrics = {
  usability: {
    generationSuccessRate: "> 70%",    // Prompts that generate usable components
    timeToComponent: "< 30 seconds",   // From prompt to deployed component
    userSatisfaction: "> 4/5",         // Rating of generated components
  },
  
  technical: {
    componentLoadTime: "< 2 seconds",  // Generated component render time
    apiIntegrationSuccess: "> 90%",    // Components with working API bindings
    errorRate: "< 5%",                 // Generation failures
  },
  
  adoption: {
    weeklyActiveUsers: "> 10",         // Researchers using the feature
    componentsGenerated: "> 50",       // Total components generated
    deploymentRate: "> 60%",           // Generated components actually deployed
  }
}
```

### Validation Criteria

**MVP Success Criteria:**
1. ✅ **Researchers can generate useful components** with simple prompts
2. ✅ **Components integrate seamlessly** with CHORUS data
3. ✅ **Generated components are actually used** in daily research workflows
4. ✅ **Foundation is solid** for advanced AI features later

---

## MVP Constraints & Trade-offs

### What We're NOT Building (Yet)
```typescript
const mvpLimitations = {
  aiCapabilities: [
    "No complex AI models (GPT-4, Claude, etc.)",
    "No voice input or sketch recognition", 
    "No contextual conversation",
    "No self-improving components"
  ],
  
  componentFeatures: [
    "No real-time collaboration",
    "No version control",
    "No advanced customization",
    "No cross-platform generation"
  ],
  
  apiIntegration: [
    "Read-only operations only",
    "No complex data transformations",
    "No real-time updates",
    "No advanced permission logic"
  ],
  
  userExperience: [
    "No visual component composer",
    "No natural language modification",
    "No predictive suggestions",
    "No community marketplace"
  ]
}
```

### MVP Technology Choices
```typescript
const mvpTechStack = {
  frontend: {
    generation: "Simple React form with keyword parsing",
    preview: "iframe or shadow DOM for isolation",
    deployment: "Direct DOM injection or page refresh"
  },
  
  backend: {
    ai: "Rule-based keyword matching (no LLM costs)",
    storage: "JSON files or simple database",
    api: "Express.js endpoints with CHORUS integration"
  },
  
  integration: {
    chorus: "Existing API endpoints only",
    auth: "Existing CHORUS authentication",
    permissions: "Basic role-based checks"
  }
}
```

---

## Implementation Files Structure

### Core Files to Create

```
src/
├── components/
│   ├── dynamic-components/
│   │   ├── ComponentGenerator.tsx          // Main generation interface
│   │   ├── ComponentPreview.tsx           // Live preview component
│   │   ├── DynamicRenderer.tsx            // Render generated components
│   │   └── TemplateLibrary.tsx            // Browse available templates
│   └── templates/
│       ├── DataTableTemplate.tsx          // Data table component template
│       ├── MetricCardTemplate.tsx         // Metric display template
│       ├── ProgressBarTemplate.tsx        // Progress tracking template
│       └── SearchFilterTemplate.tsx       // Search/filter template
├── services/
│   ├── ComponentGenerationService.ts      // AI generation logic
│   ├── TemplateService.ts                 // Template management
│   └── ComponentDeploymentService.ts      // Deploy components to pages
├── api/
│   ├── components/
│   │   ├── generate.ts                    // POST /api/components/generate
│   │   ├── templates.ts                   // GET /api/components/templates
│   │   ├── preview.ts                     // POST /api/components/preview
│   │   └── deploy.ts                      // POST /api/components/deploy
└── types/
    ├── ComponentSpec.ts                    // Component specification types
    ├── TemplateTypes.ts                    // Template definition types
    └── GenerationTypes.ts                  // Generation context types
```

### Integration Points with CHORUS

```typescript
// Integration with existing CHORUS architecture
const chorusIntegration = {
  authentication: "Use existing useAuthentication() hook",
  permissions: "Leverage existing authorization provider",
  apiCalls: "Extend existing data fetching patterns",
  routing: "Add routes to existing Next.js structure",
  styling: "Use existing shadcn/ui components and design tokens"
}
```

---

## Risk Assessment

### Technical Risks
- **Prompt parsing accuracy**: Simple keyword matching may not understand complex prompts
  - *Mitigation*: Start with clear example prompts, improve parsing iteratively
- **Component complexity**: Generated components may be too simplistic
  - *Mitigation*: Focus on common use cases, add complexity gradually
- **API integration**: CHORUS API changes could break component bindings
  - *Mitigation*: Use stable API endpoints, implement graceful error handling

### User Experience Risks
- **User expectations**: Researchers may expect advanced AI capabilities
  - *Mitigation*: Clear communication about MVP limitations, show roadmap
- **Learning curve**: Natural language prompts may be unfamiliar
  - *Mitigation*: Provide guided tutorials and example prompts
- **Adoption**: Researchers may prefer traditional UI development
  - *Mitigation*: Start with power users, demonstrate clear time savings

### Operational Risks
- **Performance**: Component generation may be slow
  - *Mitigation*: Optimize template matching, implement caching
- **Scalability**: System may not handle multiple concurrent users
  - *Mitigation*: Monitor usage, implement rate limiting if needed
- **Maintenance**: Generated components may need ongoing updates
  - *Mitigation*: Version component templates, provide migration tools

---

## Future Evolution Path

### From MVP to Full Vision

**If MVP Succeeds:**

#### Phase 2: Advanced AI (Months 7-9)
- Upgrade to GPT-4/Claude for better prompt understanding
- Add conversational component modification
- Implement context-aware suggestions
- Add voice input capabilities

#### Phase 3: Collaboration (Months 10-12)
- Real-time collaborative component editing
- Component version control and history
- Community component marketplace
- Peer review and approval workflows

#### Phase 4: Intelligence (Months 13-15)
- Self-improving components based on usage
- Predictive component suggestions
- Cross-platform component generation
- Integration with external research tools

#### Phase 5: Ecosystem (Months 16-18)
- Advanced research workflow automation
- Publication integration features
- Cross-institutional component sharing
- AI research assistants for domain expertise

---

## MVP Summary

### Core Value Delivered
- ✅ **Natural language to UI component generation**
- ✅ **Automatic CHORUS API integration** 
- ✅ **Live preview and deployment**
- ✅ **Research-specific component templates**

### 6-Week Development Timeline
- **Weeks 1-2**: Foundation (basic generation system)
- **Weeks 3-4**: Core templates (data table, metrics, progress)
- **Weeks 5-6**: UX polish and deployment

### Success = Path to Full Vision
This MVP provides a **functioning system in 6 weeks** that delivers real value while proving the feasibility of the transformative research platform vision. It establishes the foundation for securing additional resources and building toward AI-powered research acceleration.

The MVP focuses on **proving the core concept** with minimal complexity while maintaining a clear path to the advanced features outlined in the full system design.

---

**Document Status:** Active MVP Specification  
**Implementation Start:** Upon stakeholder approval  
**Development Timeline:** 6 weeks  
**Success Review:** Week 8 (2 weeks post-deployment)