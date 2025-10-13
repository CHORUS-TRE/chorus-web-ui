// Simple keyword-based prompt parser for MVP
import { ComponentIntent } from '@/types/component-system'

export class SimplePromptParser {
  private readonly patterns = {
    table: {
      keywords: ['table', 'list', 'data', 'rows', 'grid', 'show', 'display'],
      entities: ['workspace', 'session', 'user', 'app', 'workbench']
    },
    metric: {
      keywords: [
        'metric',
        'count',
        'total',
        'number',
        'stat',
        'analytics',
        'summary'
      ],
      entities: ['progress', 'completion', 'active', 'users', 'sessions']
    },
    progress: {
      keywords: [
        'progress',
        'completion',
        'status',
        'bar',
        'percentage',
        'done'
      ],
      entities: ['workspace', 'session', 'project', 'task']
    },
    form: {
      keywords: ['form', 'input', 'create', 'add', 'entry', 'submit', 'new'],
      entities: ['workspace', 'session', 'user', 'data']
    },
    search: {
      keywords: ['search', 'filter', 'find', 'lookup', 'query'],
      entities: ['workspace', 'session', 'app', 'user', 'data']
    }
  }

  parsePrompt(prompt: string): ComponentIntent {
    const normalizedPrompt = prompt.toLowerCase().trim()

    // Calculate confidence scores for each component type
    const scores = new Map<string, number>()

    for (const [type, pattern] of Object.entries(this.patterns)) {
      const keywordMatches = pattern.keywords.filter((keyword) =>
        normalizedPrompt.includes(keyword)
      ).length

      const entityMatches = pattern.entities.filter((entity) =>
        normalizedPrompt.includes(entity)
      ).length

      // Simple scoring: keyword matches are weighted more heavily
      const score = keywordMatches * 2 + entityMatches
      if (score > 0) {
        scores.set(type, score)
      }
    }

    // Find the best match
    let bestType = 'generic'
    let bestScore = 0

    for (const [type, score] of scores.entries()) {
      if (score > bestScore) {
        bestType = type
        bestScore = score
      }
    }

    // Extract entities mentioned in the prompt
    const extractedEntities = this.extractEntities(normalizedPrompt)

    // Calculate confidence (0-1 scale)
    const confidence = bestScore > 0 ? Math.min(bestScore / 5, 1) : 0.3

    return {
      type: bestType as ComponentIntent['type'],
      confidence,
      prompt,
      extractedEntities
    }
  }

  private extractEntities(prompt: string): Record<string, string> {
    const entities: Record<string, string> = {}

    // Extract common entities
    const entityPatterns = {
      workspace: /workspace|project/,
      session: /session|workbench/,
      user: /user|member|collaborator/,
      data: /data|information|records/,
      metric: /metric|count|number|total|analytics/
    }

    for (const [entity, pattern] of Object.entries(entityPatterns)) {
      if (pattern.test(prompt)) {
        entities[entity] = 'detected'
      }
    }

    return entities
  }

  // Get suggested prompts for testing
  getSuggestedPrompts(): Array<{ prompt: string; expectedType: string }> {
    return [
      {
        prompt: 'Create a table showing workspace data',
        expectedType: 'table'
      },
      { prompt: 'Show my workspace progress', expectedType: 'progress' },
      { prompt: 'Display user count metric', expectedType: 'metric' },
      { prompt: 'Add search for sessions', expectedType: 'search' },
      { prompt: 'Create form to add new workspace', expectedType: 'form' },
      { prompt: 'List all my active sessions', expectedType: 'table' },
      { prompt: 'Show completion percentage', expectedType: 'progress' },
      { prompt: 'Filter workspaces by status', expectedType: 'search' }
    ]
  }
}
