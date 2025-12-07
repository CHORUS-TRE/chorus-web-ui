import { z } from 'zod'

// Network policy options
export const NetworkPolicyEnum = z.enum(['closed', 'whitelist', 'open'])
export type NetworkPolicy = z.infer<typeof NetworkPolicyEnum>

// Resource preset options (matching app presets)
export const ResourcePresetEnum = z.enum([
  'nano',
  'micro',
  'small',
  'medium',
  'large',
  'xlarge',
  '2xlarge',
  'custom'
])
export type ResourcePreset = z.infer<typeof ResourcePresetEnum>

// Storage configuration
export const StorageConfigSchema = z.object({
  enabled: z.boolean().default(false),
  size: z.string().default('10Gi') // e.g., "10Gi", "100Gi"
})
export type StorageConfig = z.infer<typeof StorageConfigSchema>

// Security configuration
export const SecurityConfigSchema = z.object({
  network: NetworkPolicyEnum.default('closed'),
  allowCopyPaste: z.boolean().default(false)
})
export type SecurityConfig = z.infer<typeof SecurityConfigSchema>

// Resources configuration
export const ResourcesConfigSchema = z.object({
  preset: ResourcePresetEnum.default('small'),
  gpu: z.number().int().min(0).default(0),
  cpu: z.string().default('2'), // e.g., "2", "4", "8"
  memory: z.string().default('4Gi'), // e.g., "4Gi", "8Gi"
  coldStorage: StorageConfigSchema.default({ enabled: false, size: '100Gi' }),
  hotStorage: StorageConfigSchema.default({ enabled: true, size: '10Gi' })
})
export type ResourcesConfig = z.infer<typeof ResourcesConfigSchema>

// Services configuration
export const ServicesConfigSchema = z.object({
  gitlab: z.boolean().default(false),
  k8s: z.boolean().default(false),
  hpc: z.boolean().default(false)
})
export type ServicesConfig = z.infer<typeof ServicesConfigSchema>

// Team member with role
export const TeamMemberSchema = z.object({
  userId: z.string(),
  role: z.string() // e.g., "owner", "admin", "member", "viewer"
})
export type TeamMember = z.infer<typeof TeamMemberSchema>

// Complete workspace configuration
export const WorkspaceConfigSchema = z.object({
  // Description in Markdown format
  descriptionMarkdown: z.string().optional(),

  // Security settings
  security: SecurityConfigSchema.default({
    network: 'closed',
    allowCopyPaste: false
  }),

  // Resource allocation
  resources: ResourcesConfigSchema.default({
    preset: 'small',
    gpu: 0,
    cpu: '2',
    memory: '4Gi',
    coldStorage: { enabled: false, size: '100Gi' },
    hotStorage: { enabled: true, size: '10Gi' }
  }),

  // Enabled services
  services: ServicesConfigSchema.default({
    gitlab: false,
    k8s: false,
    hpc: false
  })
})

export type WorkspaceConfig = z.infer<typeof WorkspaceConfigSchema>

// Default configuration
export const DEFAULT_WORKSPACE_CONFIG: WorkspaceConfig = {
  descriptionMarkdown: '',
  security: {
    network: 'closed',
    allowCopyPaste: false
  },
  resources: {
    preset: 'small',
    gpu: 0,
    cpu: '2',
    memory: '4Gi',
    coldStorage: { enabled: false, size: '100Gi' },
    hotStorage: { enabled: true, size: '10Gi' }
  },
  services: {
    gitlab: false,
    k8s: false,
    hpc: false
  }
}

// Resource presets mapping (simplified, without ranges)
export const WORKSPACE_RESOURCE_PRESETS: Record<
  Exclude<ResourcePreset, 'custom'>,
  { cpu: string; memory: string; description: string }
> = {
  nano: { cpu: '0.1', memory: '128Mi', description: 'Minimal resources' },
  micro: { cpu: '0.25', memory: '256Mi', description: 'Very light workloads' },
  small: { cpu: '0.5', memory: '512Mi', description: 'Light workloads' },
  medium: { cpu: '1', memory: '1Gi', description: 'Standard workloads' },
  large: { cpu: '2', memory: '2Gi', description: 'Heavy workloads' },
  xlarge: { cpu: '4', memory: '4Gi', description: 'Very heavy workloads' },
  '2xlarge': { cpu: '8', memory: '8Gi', description: 'Maximum resources' }
}

// DevStore key for workspace config
export const WORKSPACE_CONFIG_KEY: string = 'config'
