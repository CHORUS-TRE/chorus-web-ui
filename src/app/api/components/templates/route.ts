// API endpoint for getting available component templates
import { NextResponse } from 'next/server'

import { enhancedTemplateRegistry } from '@/services/component-generation/enhanced-template-registry'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const context = searchParams.get('context')

    let templates = enhancedTemplateRegistry.getAllTemplates()

    // Filter by category if specified
    if (category) {
      templates = enhancedTemplateRegistry.getTemplatesByCategory(
        category as string
      )
    }

    // Get context-based suggestions if specified
    if (context) {
      try {
        const contextObj = JSON.parse(context)
        templates = enhancedTemplateRegistry.getSuggestions(contextObj)
      } catch (e) {
        console.warn('Invalid context parameter:', e)
      }
    }

    // Return template information (without the generate function)
    const templateInfo = templates.map((template) => ({
      id: template.id,
      name: template.name,
      description: template.description,
      category: template.category,
      promptPatterns: template.promptPatterns.slice(0, 5), // Limit patterns for API response
      requiredProps: template.requiredProps,
      apiBinding: template.apiBinding
        ? {
            endpoint: template.apiBinding.endpoint,
            method: template.apiBinding.method,
            permissions: template.apiBinding.permissions,
            cache: template.apiBinding.cache
          }
        : undefined
    }))

    return NextResponse.json({
      success: true,
      templates: templateInfo,
      count: templateInfo.length,
      categories: [
        'data-visualization',
        'research-workflow',
        'lab-management',
        'collaboration',
        'forms-collection',
        'analytics-metrics',
        'protocol-management',
        'sample-tracking'
      ]
    })
  } catch (error) {
    console.error('Error fetching templates:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch component templates',
        templates: [],
        count: 0
      },
      { status: 500 }
    )
  }
}
