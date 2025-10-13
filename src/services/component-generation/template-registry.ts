// Template registry for MVP component generation
import {
  ComponentSpec,
  ComponentTemplate,
  GenerationContext
} from '@/types/component-system'

export class ComponentTemplateRegistry {
  private templates = new Map<string, ComponentTemplate>()

  constructor() {
    this.registerDefaultTemplates()
  }

  private registerDefaultTemplates() {
    // Data Table Template
    this.registerTemplate({
      id: 'data-table',
      name: 'Data Table',
      description: 'Display data in a sortable, searchable table',
      category: 'data',
      promptPatterns: [
        'table',
        'list',
        'data',
        'rows',
        'grid',
        'show',
        'display'
      ],
      generate: (context: GenerationContext) => this.generateDataTable(context),
      apiBinding: {
        endpoint: '/api/workspaces/{workspaceId}/data',
        method: 'GET',
        permissions: ['workspace.read'],
        cache: true,
        transform: 'formatTableData'
      },
      requiredProps: [
        {
          name: 'data',
          type: 'array',
          required: true,
          description: 'Array of objects to display'
        },
        {
          name: 'columns',
          type: 'array',
          required: true,
          description: 'Column definitions'
        }
      ]
    })

    // Metric Card Template
    this.registerTemplate({
      id: 'metric-card',
      name: 'Metric Card',
      description: 'Display a key metric or statistic',
      category: 'data',
      promptPatterns: [
        'metric',
        'count',
        'total',
        'number',
        'stat',
        'analytics'
      ],
      generate: (context: GenerationContext) =>
        this.generateMetricCard(context),
      apiBinding: {
        endpoint: '/api/workspaces/{workspaceId}/analytics',
        method: 'GET',
        permissions: ['workspace.analytics'],
        cache: true,
        transform: 'formatMetricData'
      },
      requiredProps: [
        { name: 'title', type: 'string', required: true },
        { name: 'value', type: 'number', required: true },
        { name: 'description', type: 'string', required: false }
      ]
    })

    // Progress Bar Template
    this.registerTemplate({
      id: 'progress-bar',
      name: 'Progress Bar',
      description: 'Show completion progress or status',
      category: 'data',
      promptPatterns: ['progress', 'completion', 'status', 'bar', 'percentage'],
      generate: (context: GenerationContext) =>
        this.generateProgressBar(context),
      apiBinding: {
        endpoint: '/api/workspaces/{workspaceId}/progress',
        method: 'GET',
        permissions: ['workspace.read'],
        cache: true,
        transform: 'formatProgressData'
      },
      requiredProps: [
        { name: 'current', type: 'number', required: true },
        { name: 'total', type: 'number', required: true },
        { name: 'label', type: 'string', required: false }
      ]
    })

    // Search Filter Template
    this.registerTemplate({
      id: 'search-filter',
      name: 'Search Filter',
      description: 'Search and filter interface for data',
      category: 'form',
      promptPatterns: ['search', 'filter', 'find', 'lookup', 'query'],
      generate: (context: GenerationContext) =>
        this.generateSearchFilter(context),
      apiBinding: {
        endpoint: '/api/workspaces/{workspaceId}/search',
        method: 'GET',
        permissions: ['workspace.read'],
        cache: false,
        transform: 'formatSearchResults'
      },
      requiredProps: [
        { name: 'placeholder', type: 'string', required: false },
        { name: 'onSearch', type: 'string', required: true }
      ]
    })
  }

  registerTemplate(template: ComponentTemplate): void {
    this.templates.set(template.id, template)
  }

  getTemplatesByCategory(category: string): ComponentTemplate[] {
    return Array.from(this.templates.values()).filter(
      (t) => t.category === category
    )
  }

  findTemplateByPattern(prompt: string): ComponentTemplate | null {
    const normalizedPrompt = prompt.toLowerCase()

    let bestMatch: ComponentTemplate | null = null
    let bestScore = 0

    this.templates.forEach((template) => {
      const score = template.promptPatterns.reduce((acc, pattern) => {
        return normalizedPrompt.includes(pattern.toLowerCase()) ? acc + 1 : acc
      }, 0)

      if (score > bestScore) {
        bestScore = score
        bestMatch = template
      }
    })

    return bestScore > 0 ? bestMatch : null
  }

  getAllTemplates(): ComponentTemplate[] {
    return Array.from(this.templates.values())
  }

  getTemplate(id: string): ComponentTemplate | null {
    return this.templates.get(id) || null
  }

  // Template generation methods
  private generateDataTable(context: GenerationContext): ComponentSpec {
    const apiEndpoint = context.workspaceId
      ? `/api/workspaces/${context.workspaceId}/data`
      : '/api/workspaces/data'

    return {
      id: `data-table-${Date.now()}`,
      component: 'GeneratedDataTable',
      props: {
        title: context.workspaceId ? 'Workspace Data' : 'Data Table',
        description: 'Displaying your research data',
        data: `{{API_DATA}}`, // Placeholder for API data
        columns: [
          { key: 'id', label: 'ID', type: 'text' },
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'status', label: 'Status', type: 'status' },
          { key: 'created', label: 'Created', type: 'date' }
        ],
        searchable: true,
        exportable: true,
        sortable: true
      },
      imports: ['GeneratedDataTable'],
      styling: 'w-full',
      apiBinding: {
        endpoint: apiEndpoint,
        method: 'GET',
        permissions: ['workspace.read'],
        cache: true,
        transform: 'formatTableData'
      }
    }
  }

  private generateMetricCard(context: GenerationContext): ComponentSpec {
    return {
      id: `metric-card-${Date.now()}`,
      component: 'GeneratedMetricCard',
      props: {
        title: 'Key Metric',
        value: `{{API_DATA.value}}`,
        description: 'Research metric description',
        trend: 'up',
        color: 'primary'
      },
      imports: ['GeneratedMetricCard'],
      styling: 'min-w-64',
      apiBinding: {
        endpoint: `/api/workspaces/${context.workspaceId || 'default'}/analytics`,
        method: 'GET',
        permissions: ['workspace.analytics'],
        cache: true,
        transform: 'formatMetricData'
      }
    }
  }

  private generateProgressBar(context: GenerationContext): ComponentSpec {
    return {
      id: `progress-bar-${Date.now()}`,
      component: 'GeneratedProgressBar',
      props: {
        current: `{{API_DATA.current}}`,
        total: `{{API_DATA.total}}`,
        label: context.workspaceId ? 'Workspace Progress' : 'Progress',
        showPercentage: true,
        color: 'primary'
      },
      imports: ['GeneratedProgressBar'],
      styling: 'w-full',
      apiBinding: {
        endpoint: `/api/workspaces/${context.workspaceId || 'default'}/progress`,
        method: 'GET',
        permissions: ['workspace.read'],
        cache: true,
        transform: 'formatProgressData'
      }
    }
  }

  private generateSearchFilter(_context: GenerationContext): ComponentSpec {
    return {
      id: `search-filter-${Date.now()}`,
      component: 'GeneratedSearchFilter',
      props: {
        placeholder: 'Search workspaces...',
        filters: [
          { key: 'status', label: 'Status', options: ['active', 'inactive'] },
          { key: 'type', label: 'Type', options: ['research', 'collaboration'] }
        ],
        onSearch: 'handleSearch',
        onFilter: 'handleFilter'
      },
      imports: ['GeneratedSearchFilter'],
      styling: 'w-full max-w-md',
      apiBinding: {
        endpoint: `/api/workspaces/search`,
        method: 'GET',
        permissions: ['workspace.read'],
        cache: false,
        transform: 'formatSearchResults'
      }
    }
  }
}

// Singleton instance
export const templateRegistry = new ComponentTemplateRegistry()
