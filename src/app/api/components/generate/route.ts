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
