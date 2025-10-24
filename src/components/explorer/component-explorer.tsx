'use client'

import {
  Activity,
  BarChart3,
  Beaker,
  Copy,
  Database,
  ExternalLink,
  Eye,
  FileText,
  Grid3X3,
  Layers,
  List,
  Search,
  Settings,
  Sparkles,
  Users
} from 'lucide-react'
import React, { useState } from 'react'

import { GeneratedDataTable } from '@/components/templates/data-table-template'
// Import our enhanced components
import {
  GeneratedDataForm,
  GeneratedEquipmentTracker,
  GeneratedKanbanBoard,
  GeneratedMetricsDashboard,
  GeneratedProtocolBuilder,
  GeneratedSampleTracker,
  GeneratedTimeline
} from '@/components/templates/enhanced-components'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface ComponentInfo {
  id: string
  name: string
  description: string
  category: string
  component: React.ComponentType<Record<string, unknown>>
  props: Record<string, unknown>
  code: string
  tags: string[]
}

const categoryIcons = {
  'data-visualization': BarChart3,
  'research-workflow': Activity,
  'lab-management': Beaker,
  collaboration: Users,
  'forms-collection': FileText,
  'analytics-metrics': Activity,
  'protocol-management': Settings,
  'sample-tracking': Database
}

const categoryColors = {
  'data-visualization': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'research-workflow': 'bg-green-500/10 text-green-600 border-green-500/20',
  'lab-management': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  collaboration: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  'forms-collection': 'bg-red-500/10 text-red-600 border-red-500/20',
  'analytics-metrics': 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  'protocol-management': 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
  'sample-tracking': 'bg-orange-500/10 text-orange-600 border-orange-500/20'
}

export function ComponentExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedComponent, setSelectedComponent] =
    useState<ComponentInfo | null>(null)

  // Component registry inspired by AgenticGenUI
  const components: ComponentInfo[] = [
    {
      id: 'research-data-table',
      name: 'Research Data Table',
      description:
        'Advanced data table with filtering, sorting, and export capabilities designed for research data visualization.',
      category: 'data-visualization',
      component: GeneratedDataTable as unknown as React.ComponentType<
        Record<string, unknown>
      >,
      props: {
        title: 'Research Dataset',
        data: [
          {
            id: 'R001',
            name: 'Protein Analysis Study',
            status: 'active',
            created: '2024-01-15',
            participants: 45
          },
          {
            id: 'R002',
            name: 'Genomic Sequencing Project',
            status: 'completed',
            created: '2024-02-20',
            participants: 78
          },
          {
            id: 'R003',
            name: 'Drug Interaction Research',
            status: 'pending',
            created: '2024-03-10',
            participants: 23
          }
        ],
        searchable: true,
        exportable: true,
        sortable: true
      },
      code: `<GeneratedDataTable
  title="Research Dataset"
  data={researchData}
  searchable={true}
  exportable={true}
  sortable={true}
/>`,
      tags: ['table', 'data', 'research', 'export', 'search']
    },
    {
      id: 'metrics-dashboard',
      name: 'Research Metrics Dashboard',
      description:
        'Comprehensive dashboard displaying key research performance indicators with trend analysis.',
      category: 'analytics-metrics',
      component: GeneratedMetricsDashboard,
      props: {
        title: 'Research KPIs',
        metrics: [
          { name: 'Active Studies', value: 24, trend: 'up', change: 12.5 },
          { name: 'Completed Projects', value: 156, trend: 'up', change: 8.2 },
          {
            name: 'Research Hours',
            value: '2,847',
            trend: 'stable',
            change: 0.8
          },
          { name: 'Publications', value: 43, trend: 'up', change: 18.6 }
        ]
      },
      code: `<GeneratedMetricsDashboard
  title="Research KPIs"
  metrics={metricsData}
/>`,
      tags: ['metrics', 'dashboard', 'kpi', 'analytics', 'trends']
    },
    {
      id: 'equipment-tracker',
      name: 'Lab Equipment Tracker',
      description:
        'Monitor and manage laboratory equipment status, location, and availability in real-time.',
      category: 'lab-management',
      component: GeneratedEquipmentTracker,
      props: {
        title: 'Laboratory Equipment',
        equipment: [
          {
            id: 'EQ001',
            name: 'Confocal Microscope',
            status: 'available',
            location: 'Lab Room A'
          },
          {
            id: 'EQ002',
            name: 'PCR Machine',
            status: 'in-use',
            location: 'Lab Room B'
          },
          {
            id: 'EQ003',
            name: 'Centrifuge Unit',
            status: 'maintenance',
            location: 'Lab Room C'
          },
          {
            id: 'EQ004',
            name: 'Spectrophotometer',
            status: 'available',
            location: 'Lab Room A'
          }
        ]
      },
      code: `<GeneratedEquipmentTracker
  title="Laboratory Equipment"
  equipment={equipmentData}
/>`,
      tags: ['equipment', 'lab', 'tracking', 'inventory', 'status']
    },
    {
      id: 'protocol-builder',
      name: 'Protocol Builder',
      description:
        'Interactive tool for creating, editing, and managing research protocols with collaborative features.',
      category: 'protocol-management',
      component: GeneratedProtocolBuilder,
      props: {
        title: 'New Research Protocol',
        sections: [
          'Overview',
          'Materials',
          'Methodology',
          'Safety Procedures',
          'Data Analysis',
          'Quality Control'
        ],
        collaborative: true
      },
      code: `<GeneratedProtocolBuilder
  title="New Research Protocol"
  sections={protocolSections}
  collaborative={true}
/>`,
      tags: ['protocol', 'procedure', 'methodology', 'collaboration', 'sop']
    },
    {
      id: 'sample-tracker',
      name: 'Sample Tracking System',
      description:
        'Comprehensive sample management with chain of custody, storage location, and processing status.',
      category: 'sample-tracking',
      component: GeneratedSampleTracker,
      props: {
        title: 'Biological Samples',
        samples: [
          {
            id: 'BS001',
            type: 'blood serum',
            status: 'stored',
            location: 'Freezer Unit A1'
          },
          {
            id: 'BS002',
            type: 'tissue biopsy',
            status: 'processing',
            location: 'Processing Lab'
          },
          {
            id: 'BS003',
            type: 'dna extract',
            status: 'analyzed',
            location: 'Archive Storage'
          },
          {
            id: 'BS004',
            type: 'cell culture',
            status: 'incubating',
            location: 'Incubator Room'
          }
        ]
      },
      code: `<GeneratedSampleTracker
  title="Biological Samples"
  samples={sampleData}
/>`,
      tags: ['samples', 'tracking', 'biobank', 'storage', 'custody']
    },
    {
      id: 'collaboration-board',
      name: 'Research Collaboration Board',
      description:
        'Kanban-style task management board designed for research team collaboration and project tracking.',
      category: 'collaboration',
      component: GeneratedKanbanBoard,
      props: {
        title: 'Research Team Board',
        columns: [
          {
            id: 'planning',
            title: 'Planning',
            tasks: [
              {
                id: '1',
                title: 'Define research objectives',
                assignee: 'Dr. Smith'
              },
              { id: '2', title: 'Literature review', assignee: 'Research Team' }
            ]
          },
          {
            id: 'active',
            title: 'In Progress',
            tasks: [
              {
                id: '3',
                title: 'Data collection phase 1',
                assignee: 'Lab Technicians'
              },
              { id: '4', title: 'Sample preparation', assignee: 'Dr. Johnson' }
            ]
          },
          {
            id: 'review',
            title: 'Under Review',
            tasks: [
              {
                id: '5',
                title: 'Statistical analysis',
                assignee: 'Data Analyst'
              }
            ]
          },
          {
            id: 'completed',
            title: 'Completed',
            tasks: [
              {
                id: '6',
                title: 'Ethics approval',
                assignee: 'Ethics Committee'
              },
              {
                id: '7',
                title: 'Equipment calibration',
                assignee: 'Technical Staff'
              }
            ]
          }
        ]
      },
      code: `<GeneratedKanbanBoard
  title="Research Team Board"
  columns={boardColumns}
/>`,
      tags: ['kanban', 'collaboration', 'tasks', 'team', 'project']
    },
    {
      id: 'data-form',
      name: 'Data Collection Form',
      description:
        'Structured form builder for research data collection with validation and customizable field types.',
      category: 'forms-collection',
      component: GeneratedDataForm,
      props: {
        title: 'Patient Data Collection',
        fields: [
          {
            name: 'patient_id',
            type: 'text',
            required: true,
            label: 'Patient ID'
          },
          { name: 'age', type: 'number', required: true, label: 'Age (years)' },
          {
            name: 'gender',
            type: 'select',
            required: true,
            label: 'Gender',
            options: ['Male', 'Female', 'Other']
          },
          {
            name: 'medical_history',
            type: 'textarea',
            required: false,
            label: 'Medical History'
          },
          {
            name: 'consent_date',
            type: 'date',
            required: true,
            label: 'Consent Date'
          }
        ]
      },
      code: `<GeneratedDataForm
  title="Patient Data Collection"
  fields={formFields}
/>`,
      tags: ['form', 'data', 'collection', 'validation', 'input']
    },
    {
      id: 'research-timeline',
      name: 'Project Timeline',
      description:
        'Visual timeline component for tracking research project milestones, deadlines, and progress.',
      category: 'research-workflow',
      component: GeneratedTimeline,
      props: {
        title: 'Clinical Trial Timeline',
        events: [
          {
            date: '2024-01-15',
            title: 'Protocol Submission',
            status: 'completed'
          },
          { date: '2024-02-20', title: 'Ethics Review', status: 'completed' },
          {
            date: '2024-03-10',
            title: 'Patient Recruitment',
            status: 'in-progress'
          },
          {
            date: '2024-05-15',
            title: 'Data Collection Phase',
            status: 'pending'
          },
          {
            date: '2024-08-30',
            title: 'Statistical Analysis',
            status: 'pending'
          },
          { date: '2024-10-15', title: 'Final Report', status: 'pending' }
        ]
      },
      code: `<GeneratedTimeline
  title="Clinical Trial Timeline"
  events={timelineEvents}
/>`,
      tags: ['timeline', 'milestones', 'project', 'schedule', 'progress']
    }
  ]

  // Filter components based on category and search
  const filteredComponents = components.filter((component) => {
    const matchesCategory =
      selectedCategory === 'all' || component.category === selectedCategory
    const matchesSearch =
      searchQuery === '' ||
      component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )

    return matchesCategory && matchesSearch
  })

  // Get unique categories
  const categories = [
    'all',
    ...Array.from(new Set(components.map((c) => c.category)))
  ]

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    // TODO: Add toast notification
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-6">
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="mb-4 flex items-center justify-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Layers className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">Component Explorer</h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Discover and explore our comprehensive library of research-specific UI
          components. Each component is designed for scientific workflows and
          research data management.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
        <div className="max-w-md flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg border p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Badge variant="secondary">
            {filteredComponents.length} component
            {filteredComponents.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 border-muted/40 bg-background/60">
        {categories.map((category) => {
          const Icon =
            category === 'all'
              ? Sparkles
              : categoryIcons[category as keyof typeof categoryIcons] ||
                Settings
          return (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="flex items-center gap-2"
            >
              <Icon className="h-3 w-3" />
              {category === 'all'
                ? 'All Components'
                : category
                    .replace('-', ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
              <Badge variant="secondary" className="ml-1">
                {category === 'all'
                  ? components.length
                  : components.filter((c) => c.category === category).length}
              </Badge>
            </Button>
          )
        })}
      </div>

      {/* Component Grid/List */}
      <div
        className={cn(
          'grid gap-6',
          viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
        )}
      >
        {filteredComponents.map((component) => {
          const CategoryIcon =
            categoryIcons[component.category as keyof typeof categoryIcons] ||
            Settings
          return (
            <Card
              key={component.id}
              className="group overflow-hidden transition-all duration-200 hover:shadow-lg"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-lg">
                        {component.name}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-sm">
                      {component.description}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs',
                      categoryColors[
                        component.category as keyof typeof categoryColors
                      ]
                    )}
                  >
                    {component.category.replace('-', ' ')}
                  </Badge>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {component.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {component.tags.length > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{component.tags.length - 4}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Component Preview */}
                <div className="flex min-h-[200px] items-center justify-center rounded-lg border bg-muted/30 p-4">
                  <div className="w-full max-w-md origin-center scale-75">
                    <component.component {...component.props} />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 border-muted/40 bg-background/60">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedComponent(component)}
                    className="flex-1"
                  >
                    <Eye className="mr-2 h-3 w-3" />
                    View Demo
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyCode(component.code)}
                    className="border-white/20 hover:bg-white/10 hover:text-white"
                  >
                    <Copy className="mr-2 h-3 w-3" />
                    Copy Code
                  </Button>
                  <Button size="sm" variant="ghost">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* No Results */}
      {filteredComponents.length === 0 && (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-medium">No components found</h3>
          <p className="mb-4 text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
          <Button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
            }}
          >
            Clear filters
          </Button>
        </div>
      )}

      {/* Component Detail Modal */}
      {selectedComponent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="max-h-[90vh] w-full max-w-4xl overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">
                    {selectedComponent.name}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {selectedComponent.description}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedComponent(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="demo" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="demo">Live Demo</TabsTrigger>
                  <TabsTrigger value="code">Source Code</TabsTrigger>
                </TabsList>
                <TabsContent value="demo" className="space-y-4">
                  <div className="rounded-lg border bg-background p-6">
                    <selectedComponent.component {...selectedComponent.props} />
                  </div>
                </TabsContent>
                <TabsContent value="code" className="space-y-4">
                  <div className="relative">
                    <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
                      <code>{selectedComponent.code}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute right-2 top-2"
                      onClick={() => handleCopyCode(selectedComponent.code)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
