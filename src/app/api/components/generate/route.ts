// API endpoint for component generation
import { NextRequest, NextResponse } from 'next/server'

import { enhancedTemplateRegistry } from '@/services/component-generation/enhanced-template-registry'
import { SimplePromptParser } from '@/services/component-generation/prompt-parser'
import {
  GenerationRequestSchema,
  GenerationResponse
} from '@/types/component-system'

const promptParser = new SimplePromptParser()

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedRequest = GenerationRequestSchema.parse(body)

    // Parse the prompt to understand user intent
    const intent = promptParser.parsePrompt(validatedRequest.prompt)

    // Find matching template using enhanced registry
    const template = enhancedTemplateRegistry.findTemplateByPrompt(
      validatedRequest.prompt
    )

    if (!template) {
      return NextResponse.json(
        {
          success: false,
          error: `No template found for prompt: "${validatedRequest.prompt}". Try prompts like "create a table", "show metrics", or "add progress bar".`
        } as GenerationResponse,
        { status: 400 }
      )
    }

    // Generate component specification
    const componentSpec = template.generate(validatedRequest.context)

    // Generate preview HTML (simplified for MVP)
    const preview = generatePreviewHTML(componentSpec, template)

    // Return successful response
    const response: GenerationResponse = {
      success: true,
      componentSpec,
      preview
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Component generation error:', error)

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message
        } as GenerationResponse,
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error during component generation'
      } as GenerationResponse,
      { status: 500 }
    )
  }
}

// Generate simple preview HTML for the component
function generatePreviewHTML(
  componentSpec: { component: string; props: Record<string, unknown> },
  template: { name: string; description: string }
): string {
  const componentName = componentSpec.component
  const props = componentSpec.props

  switch (componentName) {
    case 'GeneratedDataTable':
      return `
        <div class="preview-component">
          <div class="border rounded-lg p-4">
            <h3 class="text-lg font-semibold mb-2">${props.title || 'Data Table'}</h3>
            <p class="text-sm text-gray-600 mb-4">${props.description || 'A sortable and searchable data table'}</p>
            <div class="border rounded">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    ${Array.isArray(props.columns) ? (props.columns as Array<{ label: string }>).map((col) => `<th class="p-2 text-left">${col.label}</th>`).join('') : '<th class="p-2">Column</th>'}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    ${Array.isArray(props.columns) ? (props.columns as Array<unknown>).map(() => '<td class="p-2 border-t">Sample data</td>').join('') : '<td class="p-2">Data</td>'}
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="mt-2 text-sm text-gray-500">
              Features: ${props.searchable ? 'Search, ' : ''}${props.sortable ? 'Sort, ' : ''}${props.exportable ? 'Export' : ''}
            </div>
          </div>
        </div>
      `

    case 'GeneratedMetricCard':
      return `
        <div class="preview-component">
          <div class="border rounded-lg p-4 min-w-64">
            <h4 class="text-sm font-medium text-gray-600">${props.title || 'Metric'}</h4>
            <div class="text-2xl font-bold mt-1">${props.value || '123'}</div>
            <p class="text-xs text-gray-500 mt-1">${props.description || 'Metric description'}</p>
          </div>
        </div>
      `

    case 'GeneratedProgressBar':
      return `
        <div class="preview-component">
          <div class="border rounded-lg p-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium">${props.label || 'Progress'}</span>
              <span class="text-sm text-gray-500">75%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-blue-600 h-2 rounded-full" style="width: 75%"></div>
            </div>
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>75</span>
              <span>100</span>
            </div>
          </div>
        </div>
      `

    case 'GeneratedSearchFilter':
      return `
        <div class="preview-component">
          <div class="border rounded-lg p-4 max-w-md">
            <div class="relative mb-4">
              <input
                type="text"
                placeholder="${props.placeholder || 'Search...'}"
                class="w-full pl-8 pr-4 py-2 border rounded-md"
              />
              <svg class="absolute left-2 top-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            ${
              Array.isArray(props.filters) && props.filters.length > 0
                ? `
              <div class="space-y-2">
                <div class="text-sm font-medium">Filters</div>
                ${(props.filters as Array<{ label: string; options: string[] }>)
                  .map(
                    (filter) => `
                  <div>
                    <label class="text-xs text-gray-500">${filter.label}</label>
                    <select class="w-full mt-1 p-1 border rounded text-sm">
                      <option>All</option>
                      ${filter.options.map((option) => `<option>${option}</option>`).join('')}
                    </select>
                  </div>
                `
                  )
                  .join('')}
              </div>
            `
                : ''
            }
          </div>
        </div>
      `

    case 'GeneratedProtocolBuilder':
      return `
        <div class="preview-component">
          <div class="border rounded-lg p-4">
            <h3 class="text-lg font-semibold mb-2">${props.title || 'Protocol Builder'}</h3>
            <p class="text-sm text-gray-600 mb-4">Interactive form for creating and managing research protocols</p>
            <div class="space-y-4">
              ${
                Array.isArray(props.sections)
                  ? (props.sections as string[])
                      .map(
                        (section, index) => `
                <div class="border rounded p-3 bg-gray-50">
                  <div class="flex items-center justify-between">
                    <span class="font-medium text-gray-600">${index + 1}. ${section}</span>
                    <button class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Edit</button>
                  </div>
                </div>
              `
                      )
                      .join('')
                  : `
                <div class="border rounded p-3 bg-gray-50">
                  <div class="flex items-center justify-between">
                    <span class="font-medium text-gray-600">1. Protocol Section</span>
                    <button class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Edit</button>
                  </div>
                </div>
              `
              }
              <button class="w-full mt-4 p-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-gray-400">
                + Add Section
              </button>
            </div>
            <div class="mt-4 text-xs text-gray-500">
              Features: ${props.collaborative ? 'Collaborative editing, ' : ''}Version control, Templates
            </div>
          </div>
        </div>
      `

    case 'GeneratedMetricsDashboard':
      return `
        <div class="preview-component">
          <div class="border rounded-lg p-4">
            <h3 class="text-lg font-semibold mb-4">${props.title || 'Research Metrics'}</h3>
            <div class="grid grid-cols-2 gap-4">
              ${
                Array.isArray(props.metrics)
                  ? (
                      props.metrics as Array<{
                        name: string
                        value: number
                        trend: string
                        change: number
                      }>
                    )
                      .slice(0, 4)
                      .map(
                        (metric) => `
                <div class="border rounded p-3 bg-gray-50">
                  <div class="text-xs text-gray-600">${metric.name}</div>
                  <div class="text-xl font-bold">${metric.value}</div>
                  <div class="text-xs ${metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'}">
                    ${metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'} ${metric.change}%
                  </div>
                </div>
              `
                      )
                      .join('')
                  : `
                <div class="border rounded p-3 bg-gray-50">
                  <div class="text-xs text-gray-600">Sample Metric</div>
                  <div class="text-xl font-bold">123</div>
                  <div class="text-xs text-green-600">↗ 5.2%</div>
                </div>
              `
              }
            </div>
          </div>
        </div>
      `

    case 'GeneratedEquipmentTracker':
      return `
        <div class="preview-component">
          <div class="border rounded-lg p-4">
            <h3 class="text-lg font-semibold mb-2">${props.title || 'Lab Equipment'}</h3>
            <div class="space-y-2">
              ${
                Array.isArray(props.equipment)
                  ? (
                      props.equipment as Array<{
                        id: string
                        name: string
                        status: string
                        location: string
                      }>
                    )
                      .map(
                        (item) => `
                <div class="flex items-center justify-between p-2 border rounded">
                  <div>
                    <span class="font-medium">${item.name}</span>
                    <span class="text-xs text-gray-500 ml-2">${item.id}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs bg-${item.status === 'available' ? 'green' : item.status === 'in-use' ? 'yellow' : 'red'}-100 text-${item.status === 'available' ? 'green' : item.status === 'in-use' ? 'yellow' : 'red'}-700 px-2 py-1 rounded">${item.status}</span>
                    <span class="text-xs text-gray-500">${item.location}</span>
                  </div>
                </div>
              `
                      )
                      .join('')
                  : `
                <div class="flex items-center justify-between p-2 border rounded">
                  <div>
                    <span class="font-medium">Sample Equipment</span>
                    <span class="text-xs text-gray-500 ml-2">EQ001</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">available</span>
                    <span class="text-xs text-gray-500">Lab 1</span>
                  </div>
                </div>
              `
              }
            </div>
          </div>
        </div>
      `

    case 'GeneratedSampleTracker':
      return `
        <div class="preview-component">
          <div class="border rounded-lg p-4">
            <h3 class="text-lg font-semibold mb-2">${props.title || 'Sample Tracker'}</h3>
            <div class="space-y-2">
              ${
                Array.isArray(props.samples)
                  ? (
                      props.samples as Array<{
                        id: string
                        type: string
                        status: string
                        location: string
                      }>
                    )
                      .map(
                        (sample) => `
                <div class="flex items-center justify-between p-2 border rounded">
                  <div>
                    <span class="font-medium">${sample.id}</span>
                    <span class="text-xs text-gray-500 ml-2">${sample.type}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">${sample.status}</span>
                    <span class="text-xs text-gray-500">${sample.location}</span>
                  </div>
                </div>
              `
                      )
                      .join('')
                  : `
                <div class="flex items-center justify-between p-2 border rounded">
                  <div>
                    <span class="font-medium">S001</span>
                    <span class="text-xs text-gray-500 ml-2">blood</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">stored</span>
                    <span class="text-xs text-gray-500">Freezer A1</span>
                  </div>
                </div>
              `
              }
            </div>
          </div>
        </div>
      `

    default:
      return `
        <div class="preview-component">
          <div class="border rounded-lg p-4">
            <h3 class="text-lg font-semibold">${template.name}</h3>
            <p class="text-sm text-gray-600">${template.description}</p>
            <div class="mt-4 p-4 bg-gray-50 rounded">
              Component preview will be rendered here
            </div>
          </div>
        </div>
      `
  }
}
