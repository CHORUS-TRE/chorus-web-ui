// Core types for Dynamic Component System MVP
import { z } from 'zod'

// Component generation context
export interface GenerationContext {
  workspaceId?: string
  userRole: string
  pageContext: 'dashboard' | 'workspace' | 'session'
  userId: string
}

// Component intent from prompt parsing
export interface ComponentIntent {
  type: 'table' | 'metric' | 'progress' | 'form' | 'search' | 'generic'
  confidence: number
  prompt: string
  extractedEntities?: Record<string, string>
}

// Component specification
export interface ComponentSpec {
  id: string
  component: string
  props: Record<string, unknown>
  imports: string[]
  styling?: string
  apiBinding?: APIBinding
}

// API binding configuration
export interface APIBinding {
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  permissions: string[]
  cache?: boolean
  transform?: string // Function name for data transformation
}

// Component template definition
export interface ComponentTemplate {
  id: string
  name: string
  description: string
  category:
    | 'data'
    | 'form'
    | 'layout'
    | 'action'
    | 'data-visualization'
    | 'research-workflow'
    | 'lab-management'
    | 'collaboration'
    | 'forms-collection'
    | 'analytics-metrics'
    | 'protocol-management'
    | 'sample-tracking'
  promptPatterns: string[]
  generate: (context: GenerationContext) => ComponentSpec
  apiBinding?: APIBinding
  requiredProps: PropDefinition[]
}

// Property definition for templates
export interface PropDefinition {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  required: boolean
  description?: string
  defaultValue?: unknown
}

// Generation request/response types
export const GenerationRequestSchema = z.object({
  prompt: z.string().min(1),
  context: z.object({
    workspaceId: z.string().optional(),
    userRole: z.string(),
    pageContext: z.enum(['dashboard', 'workspace', 'session']),
    userId: z.string()
  })
})

export const GenerationResponseSchema = z.object({
  success: z.boolean(),
  componentSpec: z
    .object({
      id: z.string(),
      component: z.string(),
      props: z.record(z.unknown()),
      imports: z.array(z.string()),
      styling: z.string().optional(),
      apiBinding: z
        .object({
          endpoint: z.string(),
          method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
          permissions: z.array(z.string()),
          cache: z.boolean().optional()
        })
        .optional()
    })
    .optional(),
  preview: z.string().optional(),
  error: z.string().optional()
})

export type GenerationRequest = z.infer<typeof GenerationRequestSchema>
export type GenerationResponse = z.infer<typeof GenerationResponseSchema>

// Template registry
export interface TemplateRegistry {
  templates: Map<string, ComponentTemplate>
  getTemplatesByCategory(category: string): ComponentTemplate[]
  findTemplateByPattern(prompt: string): ComponentTemplate | null
  registerTemplate(template: ComponentTemplate): void
}

// Component deployment
export interface ComponentDeployment {
  componentSpec: ComponentSpec
  targetPage: string
  position: {
    section: string
    order: number
  }
}

export const DeploymentRequestSchema = z.object({
  componentSpec: z.object({
    id: z.string(),
    component: z.string(),
    props: z.record(z.unknown()),
    imports: z.array(z.string())
  }),
  targetPage: z.string(),
  position: z.object({
    section: z.string(),
    order: z.number()
  })
})

export type DeploymentRequest = z.infer<typeof DeploymentRequestSchema>
