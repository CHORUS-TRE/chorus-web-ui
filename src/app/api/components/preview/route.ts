// API endpoint for previewing generated components
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const PreviewRequestSchema = z.object({
  componentSpec: z.object({
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
  }),
  props: z.record(z.unknown()).optional(),
  sampleData: z.unknown().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      componentSpec,
      props = {},
      sampleData
    } = PreviewRequestSchema.parse(body)

    // Merge component props with provided props
    const mergedProps = { ...componentSpec.props, ...props }

    // Replace API data placeholders with sample data if provided
    if (sampleData) {
      Object.keys(mergedProps).forEach((key) => {
        if (
          typeof mergedProps[key] === 'string' &&
          (mergedProps[key] as string).includes('{{API_DATA}}')
        ) {
          mergedProps[key] = sampleData
        } else if (
          typeof mergedProps[key] === 'string' &&
          (mergedProps[key] as string).includes('{{API_DATA.')
        ) {
          // Extract nested property path
          const match = (mergedProps[key] as string).match(
            /\{\{API_DATA\.(.+?)\}\}/
          )
          if (match) {
            const path = match[1]
            mergedProps[key] = getNestedProperty(sampleData, path)
          }
        }
      })
    }

    // Generate enhanced preview HTML with actual data
    const html = generateEnhancedPreview(componentSpec.component, mergedProps)

    return NextResponse.json({
      success: true,
      html,
      componentSpec: {
        ...componentSpec,
        props: mergedProps
      }
    })
  } catch (error) {
    console.error('Preview generation error:', error)

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to generate preview',
        html: '<div class="error">Preview generation failed</div>'
      },
      { status: 400 }
    )
  }
}

// Helper function to get nested properties
function getNestedProperty(obj: unknown, path: string): unknown {
  return path.split('.').reduce((current, prop) => {
    if (current && typeof current === 'object' && current !== null) {
      return (current as Record<string, unknown>)[prop]
    }
    return undefined
  }, obj)
}

// Generate enhanced preview HTML with styling
function generateEnhancedPreview(
  componentName: string,
  props: Record<string, unknown>
): string {
  const baseStyles = `
    <style>
      .preview-component {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        max-width: 100%;
        margin: 0 auto;
      }
      .preview-component table {
        border-collapse: collapse;
        width: 100%;
      }
      .preview-component th, .preview-component td {
        border: 1px solid #e2e8f0;
        padding: 8px 12px;
        text-align: left;
      }
      .preview-component th {
        background-color: #f8fafc;
        font-weight: 600;
      }
      .preview-component .metric-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 16px;
        min-width: 200px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      .preview-component .progress-container {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 16px;
        width: 100%;
      }
      .preview-component .progress-bar {
        width: 100%;
        height: 8px;
        background-color: #e2e8f0;
        border-radius: 4px;
        overflow: hidden;
      }
      .preview-component .progress-fill {
        height: 100%;
        background-color: #3b82f6;
        transition: width 0.3s ease;
      }
      .preview-component .search-container {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 16px;
        max-width: 320px;
      }
      .preview-component input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 14px;
      }
      .preview-component select {
        width: 100%;
        padding: 4px 8px;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        font-size: 12px;
        margin-top: 4px;
      }
    </style>
  `

  switch (componentName) {
    case 'GeneratedDataTable': {
      const columns = props.columns || [
        { key: 'id', label: 'ID', type: 'text' },
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'status', label: 'Status', type: 'status' }
      ]

      const sampleRows =
        Array.isArray(props.data) && props.data.length > 0
          ? props.data.slice(0, 3)
          : [
              { id: '1', name: 'Research Project A', status: 'active' },
              { id: '2', name: 'Data Analysis B', status: 'completed' },
              { id: '3', name: 'Collaboration C', status: 'pending' }
            ]

      return (
        baseStyles +
        `
        <div class="preview-component">
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
            <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">${props.title || 'Data Table'}</h3>
            ${props.description ? `<p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px;">${props.description}</p>` : ''}
            
            ${
              props.searchable
                ? `
              <div style="margin-bottom: 16px; position: relative;">
                <input type="text" placeholder="Search..." style="padding-left: 32px;" />
                <svg style="position: absolute; left: 8px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: #9ca3af;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            `
                : ''
            }
            
            <table>
              <thead>
                <tr>
                  ${(columns as Array<{ label: string; key: string; type?: string }>).map((col) => `<th>${col.label}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${(sampleRows as Array<Record<string, unknown>>)
                  .map(
                    (row) => `
                  <tr>
                    ${(
                      columns as Array<{
                        label: string
                        key: string
                        type?: string
                      }>
                    )
                      .map(
                        (col) => `
                      <td>
                        ${
                          col.type === 'status'
                            ? `<span style="background: ${row[col.key] === 'active' ? '#10b981' : '#6b7280'}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">${row[col.key] || 'N/A'}</span>`
                            : row[col.key] || 'N/A'
                        }
                      </td>
                    `
                      )
                      .join('')}
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
            
            <div style="margin-top: 12px; font-size: 12px; color: #6b7280;">
              Showing ${sampleRows.length} items
              ${props.exportable ? ' • Export available' : ''}
              ${props.sortable ? ' • Sortable columns' : ''}
            </div>
          </div>
        </div>
      `
      )
    }

    case 'GeneratedMetricCard': {
      const value = props.value || '1,234'
      const title = props.title || 'Key Metric'
      const description = props.description || 'Important research metric'

      return (
        baseStyles +
        `
        <div class="preview-component">
          <div class="metric-card">
            <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280; font-weight: 500;">${title}</h4>
            <div style="font-size: 28px; font-weight: 700; margin: 4px 0;">${value}</div>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #9ca3af;">${description}</p>
          </div>
        </div>
      `
      )
    }

    case 'GeneratedProgressBar': {
      const current = Number(props.current) || 75
      const total = Number(props.total) || 100
      const percentage = Math.round((current / total) * 100)
      const label = props.label || 'Progress'

      return (
        baseStyles +
        `
        <div class="preview-component">
          <div class="progress-container">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 14px; font-weight: 500;">${label}</span>
              ${props.showPercentage !== false ? `<span style="font-size: 14px; color: #6b7280;">${percentage}%</span>` : ''}
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${percentage}%"></div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 12px; color: #6b7280;">
              <span>${current.toLocaleString()}</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      `
      )
    }

    case 'GeneratedSearchFilter': {
      const placeholder = props.placeholder || 'Search...'
      const filters = Array.isArray(props.filters) ? props.filters : []

      return (
        baseStyles +
        `
        <div class="preview-component">
          <div class="search-container">
            <div style="position: relative; margin-bottom: ${filters.length > 0 ? '16px' : '0'};">
              <input type="text" placeholder="${placeholder}" style="padding-left: 32px;" />
              <svg style="position: absolute; left: 8px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: #9ca3af;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            
            ${
              filters.length > 0
                ? `
              <div>
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                  <svg style="width: 16px; height: 16px; color: #6b7280; margin-right: 8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"></path>
                  </svg>
                  <span style="font-size: 14px; font-weight: 500;">Filters</span>
                </div>
                ${(filters as Array<{ label: string; options: string[] }>)
                  .map(
                    (filter) => `
                  <div style="margin-bottom: 8px;">
                    <label style="font-size: 12px; color: #6b7280; display: block;">${filter.label}</label>
                    <select>
                      <option>All</option>
                      ${filter.options.map((option) => `<option>${option.charAt(0).toUpperCase() + option.slice(1)}</option>`).join('')}
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
      )
    }

    default: {
      return (
        baseStyles +
        `
        <div class="preview-component">
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; text-align: center;">
            <h3 style="margin: 0 0 8px 0; font-size: 18px;">Component Preview</h3>
            <p style="margin: 0; color: #6b7280;">Component type: ${componentName}</p>
          </div>
        </div>
      `
      )
    }
  }
}
