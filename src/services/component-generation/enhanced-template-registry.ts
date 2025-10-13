// Enhanced Template Registry inspired by AgenticGenUI
// MIT License attribution: Inspired by AgenticGenUI by Vivek Shukla
// https://github.com/vivek100/AgenticGenUI

import { ComponentTemplate } from '@/types/component-system'

/**
 * Research-specific component categories
 */
export type ResearchComponentCategory =
  | 'data-visualization'
  | 'research-workflow'
  | 'lab-management'
  | 'collaboration'
  | 'forms-collection'
  | 'analytics-metrics'
  | 'protocol-management'
  | 'sample-tracking'

/**
 * Enhanced template registry with research-focused components
 */
export class EnhancedTemplateRegistry {
  private templates = new Map<string, ComponentTemplate>()
  private categoryIndex = new Map<ResearchComponentCategory, string[]>()
  private promptPatternIndex = new Map<string, string[]>()

  constructor() {
    this.initializeResearchTemplates()
    this.buildIndices()
  }

  /**
   * Initialize research-specific component templates
   */
  private initializeResearchTemplates() {
    // Data Visualization Components
    this.registerTemplate({
      id: 'research-data-table',
      name: 'Research Data Table',
      description:
        'Advanced data table with filtering, sorting, and export for research data',
      category: 'data-visualization',
      promptPatterns: [
        'table',
        'data table',
        'research data',
        'dataset',
        'tabular data',
        'show data',
        'list data',
        'display results',
        'data grid'
      ],
      requiredProps: [
        {
          name: 'title',
          type: 'string',
          required: true,
          description: 'Table title'
        },
        {
          name: 'data',
          type: 'array',
          required: true,
          description: 'Array of data objects'
        },
        {
          name: 'searchable',
          type: 'boolean',
          required: false,
          defaultValue: true
        },
        {
          name: 'exportable',
          type: 'boolean',
          required: false,
          defaultValue: true
        },
        {
          name: 'sortable',
          type: 'boolean',
          required: false,
          defaultValue: true
        }
      ],
      generate: (context) => ({
        id: `research-table-${Date.now()}`,
        component: 'GeneratedDataTable',
        props: {
          title: 'Research Data',
          searchable: true,
          exportable: true,
          sortable: true,
          columns: [
            { key: 'id', label: 'ID', type: 'text' },
            { key: 'name', label: 'Name', type: 'text' },
            { key: 'status', label: 'Status', type: 'status' },
            { key: 'created', label: 'Created', type: 'date' }
          ]
        },
        imports: ['GeneratedDataTable'],
        apiBinding: {
          endpoint: `/api/workspaces/${context.workspaceId || 'default'}/data`,
          method: 'GET',
          permissions: ['read:workspace'],
          cache: true
        }
      })
    })

    this.registerTemplate({
      id: 'research-metrics-dashboard',
      name: 'Research Metrics Dashboard',
      description:
        'Comprehensive dashboard showing key research metrics and KPIs',
      category: 'analytics-metrics',
      promptPatterns: [
        'metrics',
        'dashboard',
        'kpi',
        'statistics',
        'analytics',
        'overview',
        'summary',
        'progress',
        'performance'
      ],
      requiredProps: [
        {
          name: 'title',
          type: 'string',
          required: true,
          description: 'Dashboard title'
        },
        {
          name: 'metrics',
          type: 'array',
          required: false,
          description: 'Array of metric objects'
        }
      ],
      generate: (context) => ({
        id: `metrics-dashboard-${Date.now()}`,
        component: 'GeneratedMetricsDashboard',
        props: {
          title: 'Research Metrics',
          metrics: [
            { name: 'Active Projects', value: 12, trend: 'up', change: 8.3 },
            { name: 'Completed Studies', value: 45, trend: 'up', change: 12.1 },
            { name: 'Participants', value: 1247, trend: 'stable', change: 0.2 },
            { name: 'Data Points', value: 28560, trend: 'up', change: 15.7 }
          ]
        },
        imports: ['GeneratedMetricsDashboard'],
        apiBinding: {
          endpoint: `/api/workspaces/${context.workspaceId || 'default'}/metrics`,
          method: 'GET',
          permissions: ['read:metrics'],
          cache: true
        }
      })
    })

    this.registerTemplate({
      id: 'lab-equipment-tracker',
      name: 'Lab Equipment Tracker',
      description: 'Track and manage laboratory equipment status and usage',
      category: 'lab-management',
      promptPatterns: [
        'equipment',
        'lab equipment',
        'instruments',
        'devices',
        'tracking',
        'inventory',
        'lab management',
        'apparatus'
      ],
      requiredProps: [
        {
          name: 'title',
          type: 'string',
          required: false,
          defaultValue: 'Lab Equipment'
        },
        {
          name: 'showStatus',
          type: 'boolean',
          required: false,
          defaultValue: true
        }
      ],
      generate: (context) => ({
        id: `equipment-tracker-${Date.now()}`,
        component: 'GeneratedEquipmentTracker',
        props: {
          title: 'Lab Equipment Status',
          equipment: [
            {
              id: 'EQ001',
              name: 'Microscope A',
              status: 'available',
              location: 'Lab 1'
            },
            {
              id: 'EQ002',
              name: 'Centrifuge B',
              status: 'in-use',
              location: 'Lab 2'
            },
            {
              id: 'EQ003',
              name: 'Spectrometer C',
              status: 'maintenance',
              location: 'Lab 3'
            }
          ]
        },
        imports: ['GeneratedEquipmentTracker'],
        apiBinding: {
          endpoint: `/api/workspaces/${context.workspaceId || 'default'}/equipment`,
          method: 'GET',
          permissions: ['read:equipment'],
          cache: false
        }
      })
    })

    this.registerTemplate({
      id: 'protocol-builder',
      name: 'Research Protocol Builder',
      description:
        'Interactive form for creating and managing research protocols',
      category: 'protocol-management',
      promptPatterns: [
        'protocol',
        'procedure',
        'method',
        'workflow',
        'steps',
        'process',
        'methodology',
        'sop'
      ],
      requiredProps: [
        {
          name: 'title',
          type: 'string',
          required: false,
          defaultValue: 'New Protocol'
        },
        {
          name: 'collaborative',
          type: 'boolean',
          required: false,
          defaultValue: true
        }
      ],
      generate: (context) => ({
        id: `protocol-builder-${Date.now()}`,
        component: 'GeneratedProtocolBuilder',
        props: {
          title: 'Protocol Builder',
          sections: [
            'Overview',
            'Materials',
            'Procedure',
            'Safety',
            'Analysis'
          ],
          collaborative: true
        },
        imports: ['GeneratedProtocolBuilder'],
        apiBinding: {
          endpoint: `/api/workspaces/${context.workspaceId || 'default'}/protocols`,
          method: 'POST',
          permissions: ['write:protocols'],
          cache: false
        }
      })
    })

    this.registerTemplate({
      id: 'sample-tracker',
      name: 'Sample Tracking System',
      description: 'Track research samples, their status, and chain of custody',
      category: 'sample-tracking',
      promptPatterns: [
        'sample',
        'specimen',
        'tracking',
        'custody',
        'biobank',
        'storage',
        'location',
        'sample management'
      ],
      requiredProps: [
        {
          name: 'title',
          type: 'string',
          required: false,
          defaultValue: 'Sample Tracker'
        },
        {
          name: 'showLocation',
          type: 'boolean',
          required: false,
          defaultValue: true
        }
      ],
      generate: (context) => ({
        id: `sample-tracker-${Date.now()}`,
        component: 'GeneratedSampleTracker',
        props: {
          title: 'Sample Tracking',
          samples: [
            {
              id: 'S001',
              type: 'blood',
              status: 'stored',
              location: 'Freezer A1'
            },
            {
              id: 'S002',
              type: 'tissue',
              status: 'processing',
              location: 'Lab B'
            },
            { id: 'S003', type: 'dna', status: 'analyzed', location: 'Archive' }
          ]
        },
        imports: ['GeneratedSampleTracker'],
        apiBinding: {
          endpoint: `/api/workspaces/${context.workspaceId || 'default'}/samples`,
          method: 'GET',
          permissions: ['read:samples'],
          cache: false
        }
      })
    })

    this.registerTemplate({
      id: 'collaboration-board',
      name: 'Research Collaboration Board',
      description:
        'Kanban-style board for managing research collaboration tasks',
      category: 'collaboration',
      promptPatterns: [
        'collaboration',
        'team',
        'kanban',
        'board',
        'tasks',
        'workflow',
        'project management',
        'teamwork'
      ],
      requiredProps: [
        {
          name: 'title',
          type: 'string',
          required: false,
          defaultValue: 'Collaboration Board'
        }
      ],
      generate: (context) => ({
        id: `collaboration-board-${Date.now()}`,
        component: 'GeneratedKanbanBoard',
        props: {
          title: 'Research Collaboration',
          columns: [
            { id: 'todo', title: 'To Do', tasks: [] },
            { id: 'progress', title: 'In Progress', tasks: [] },
            { id: 'review', title: 'Under Review', tasks: [] },
            { id: 'done', title: 'Completed', tasks: [] }
          ]
        },
        imports: ['GeneratedKanbanBoard'],
        apiBinding: {
          endpoint: `/api/workspaces/${context.workspaceId || 'default'}/tasks`,
          method: 'GET',
          permissions: ['read:tasks'],
          cache: true
        }
      })
    })

    this.registerTemplate({
      id: 'data-collection-form',
      name: 'Research Data Collection Form',
      description:
        'Customizable form for collecting research data with validation',
      category: 'forms-collection',
      promptPatterns: [
        'form',
        'data collection',
        'survey',
        'questionnaire',
        'input',
        'collect data',
        'entry form',
        'submission'
      ],
      requiredProps: [
        {
          name: 'title',
          type: 'string',
          required: false,
          defaultValue: 'Data Collection'
        },
        {
          name: 'fields',
          type: 'array',
          required: false,
          description: 'Form field definitions'
        }
      ],
      generate: (context) => ({
        id: `data-form-${Date.now()}`,
        component: 'GeneratedDataForm',
        props: {
          title: 'Research Data Collection',
          fields: [
            {
              name: 'participant_id',
              type: 'text',
              required: true,
              label: 'Participant ID'
            },
            { name: 'age', type: 'number', required: true, label: 'Age' },
            {
              name: 'gender',
              type: 'select',
              required: true,
              label: 'Gender',
              options: ['Male', 'Female', 'Other']
            },
            {
              name: 'notes',
              type: 'textarea',
              required: false,
              label: 'Additional Notes'
            }
          ]
        },
        imports: ['GeneratedDataForm'],
        apiBinding: {
          endpoint: `/api/workspaces/${context.workspaceId || 'default'}/data-collection`,
          method: 'POST',
          permissions: ['write:data'],
          cache: false
        }
      })
    })

    this.registerTemplate({
      id: 'research-timeline',
      name: 'Research Project Timeline',
      description:
        'Visual timeline showing research project milestones and progress',
      category: 'research-workflow',
      promptPatterns: [
        'timeline',
        'schedule',
        'milestones',
        'project timeline',
        'progress',
        'roadmap',
        'phases',
        'planning'
      ],
      requiredProps: [
        {
          name: 'title',
          type: 'string',
          required: false,
          defaultValue: 'Research Timeline'
        }
      ],
      generate: (context) => ({
        id: `timeline-${Date.now()}`,
        component: 'GeneratedTimeline',
        props: {
          title: 'Research Project Timeline',
          events: [
            {
              date: '2024-01-15',
              title: 'Project Initiation',
              status: 'completed'
            },
            {
              date: '2024-02-20',
              title: 'Data Collection Start',
              status: 'in-progress'
            },
            {
              date: '2024-04-10',
              title: 'Interim Analysis',
              status: 'pending'
            },
            { date: '2024-06-30', title: 'Final Report', status: 'pending' }
          ]
        },
        imports: ['GeneratedTimeline'],
        apiBinding: {
          endpoint: `/api/workspaces/${context.workspaceId || 'default'}/timeline`,
          method: 'GET',
          permissions: ['read:timeline'],
          cache: true
        }
      })
    })
  }

  /**
   * Register a new component template
   */
  registerTemplate(template: ComponentTemplate) {
    this.templates.set(template.id, template)
  }

  /**
   * Build search indices for efficient lookup
   */
  private buildIndices() {
    this.categoryIndex.clear()
    this.promptPatternIndex.clear()

    this.templates.forEach((template, id) => {
      // Category index
      const categoryTemplates =
        this.categoryIndex.get(
          template.category as ResearchComponentCategory
        ) || []
      categoryTemplates.push(id)
      this.categoryIndex.set(
        template.category as ResearchComponentCategory,
        categoryTemplates
      )

      // Prompt pattern index
      template.promptPatterns.forEach((pattern) => {
        const patternTemplates =
          this.promptPatternIndex.get(pattern.toLowerCase()) || []
        patternTemplates.push(id)
        this.promptPatternIndex.set(pattern.toLowerCase(), patternTemplates)
      })
    })
  }

  /**
   * Get all templates
   */
  getAllTemplates(): ComponentTemplate[] {
    return Array.from(this.templates.values())
  }

  /**
   * Get templates by category
   */
  getTemplatesByCategory(
    category: ResearchComponentCategory
  ): ComponentTemplate[] {
    const templateIds = this.categoryIndex.get(category) || []
    return templateIds.map((id) => this.templates.get(id)!).filter(Boolean)
  }

  /**
   * Find template by ID
   */
  getTemplate(id: string): ComponentTemplate | null {
    return this.templates.get(id) || null
  }

  /**
   * Enhanced prompt matching with fuzzy search and scoring
   * Inspired by AgenticGenUI's pattern matching approach
   */
  findTemplateByPrompt(prompt: string): ComponentTemplate | null {
    const normalizedPrompt = prompt.toLowerCase().trim()
    const scores = new Map<string, number>()

    // Direct pattern matching
    this.promptPatternIndex.forEach((templateIds, pattern) => {
      if (normalizedPrompt.includes(pattern)) {
        templateIds.forEach((id) => {
          const currentScore = scores.get(id) || 0
          scores.set(id, currentScore + 10) // High score for direct matches
        })
      }
    })

    // Fuzzy matching for partial matches
    this.templates.forEach((template, id) => {
      template.promptPatterns.forEach((pattern) => {
        const similarity = this.calculateSimilarity(
          normalizedPrompt,
          pattern.toLowerCase()
        )
        if (similarity > 0.3) {
          // Minimum similarity threshold
          const currentScore = scores.get(id) || 0
          scores.set(id, currentScore + similarity * 5)
        }
      })
    })

    // Find template with highest score
    let bestTemplateId = ''
    let bestScore = 0

    scores.forEach((score, templateId) => {
      if (score > bestScore) {
        bestScore = score
        bestTemplateId = templateId
      }
    })

    return bestScore > 0 ? this.templates.get(bestTemplateId) || null : null
  }

  /**
   * Calculate similarity between two strings using Levenshtein distance
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1)
      .fill(null)
      .map(() => Array(str1.length + 1).fill(null))

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // insertion
          matrix[j - 1][i] + 1, // deletion
          matrix[j - 1][i - 1] + substitutionCost // substitution
        )
      }
    }

    const maxLength = Math.max(str1.length, str2.length)
    return maxLength === 0
      ? 1
      : (maxLength - matrix[str2.length][str1.length]) / maxLength
  }

  /**
   * Get template suggestions based on context
   */
  getSuggestions(context: {
    workspaceId?: string
    userRole: string
    pageContext: string
  }): ComponentTemplate[] {
    const suggestions: ComponentTemplate[] = []

    // Context-based suggestions
    switch (context.pageContext) {
      case 'dashboard':
        suggestions.push(...this.getTemplatesByCategory('analytics-metrics'))
        suggestions.push(...this.getTemplatesByCategory('data-visualization'))
        break
      case 'workspace':
        suggestions.push(...this.getTemplatesByCategory('collaboration'))
        suggestions.push(...this.getTemplatesByCategory('research-workflow'))
        break
      case 'session':
        suggestions.push(...this.getTemplatesByCategory('forms-collection'))
        suggestions.push(...this.getTemplatesByCategory('protocol-management'))
        break
    }

    // Role-based suggestions
    if (context.userRole === 'researcher') {
      suggestions.push(...this.getTemplatesByCategory('lab-management'))
      suggestions.push(...this.getTemplatesByCategory('sample-tracking'))
    }

    // Remove duplicates and return top 6
    const unique = Array.from(new Set(suggestions.map((t) => t.id)))
      .map((id) => suggestions.find((t) => t.id === id)!)
      .slice(0, 6)

    return unique
  }
}

// Create singleton instance
export const enhancedTemplateRegistry = new EnhancedTemplateRegistry()
