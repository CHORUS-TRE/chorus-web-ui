import { tool } from 'ai'
import { z } from 'zod'

import { getQmdStore } from '../db/index'

export const searchDocumentationTool = tool({
  description:
    'Search the indexed knowledge base (BPR QMS, DSI procedures, Chorus platform docs) for relevant passages. Use when the user asks about regulations, procedures, platform features, or any domain knowledge question. Returns passages with source citations. IMPORTANT: use short keyword queries (2-5 words) for best results — do NOT pass the full user question.',
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        'Short keyword search query (2-5 words). Example: "ethics approval CER-VD" not "What approvals do I need for a clinical study in Switzerland?"'
      ),
    collection: z
      .enum(['bpr', 'dsi', 'chorus'])
      .optional()
      .describe(
        'Limit search to a specific collection. bpr = BPR QMS docs, dsi = DSI data extraction, chorus = Chorus platform docs. If omitted, searches all.'
      )
  }),
  execute: async ({ query, collection }) => {
    try {
      const store = await getQmdStore()
      const results = await store.searchLex(query, { limit: 8, collection })

      return {
        type: 'search-results' as const,
        query,
        collection: collection ?? 'all',
        results: results.map((r) => ({
          passage: r.body ?? '',
          document: r.displayPath,
          title: r.title,
          collection: r.collectionName,
          score: r.score
        }))
      }
    } catch (error) {
      return {
        type: 'search-results' as const,
        query,
        collection: collection ?? 'all',
        results: [],
        error: `Search failed: ${error instanceof Error ? error.message : String(error)}`
      }
    }
  }
})
