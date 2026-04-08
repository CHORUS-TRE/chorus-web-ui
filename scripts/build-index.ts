/**
 * Build-time script: indexes three documentation collections into a SQLite
 * database using qmd. The resulting index is used at runtime by the
 * searchDocumentation tool.
 *
 * Usage:  npx tsx scripts/build-index.ts
 *    or:  pnpm build:index
 */

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { createStore } from '@tobilu/qmd'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..', '..')

const COLLECTIONS = [
  {
    id: 'bpr',
    name: 'BPR QMS Documentation',
    path: path.join(ROOT, 'chorus-ai/bpr/documentation'),
    pattern: '**/*.md',
    context:
      'BPR Quality Management System: ICH GCP, Swiss HRA/ClinO, SOPs, policies, and procedures for clinical research at CHUV.'
  },
  {
    id: 'dsi',
    name: 'DSI Data Extraction',
    path: path.join(ROOT, 'chorus-ai/dsi'),
    pattern: '**/*.md',
    context:
      'DSI data extraction procedures, workflows, and forms for requesting and processing clinical data from the CHUV data warehouse.'
  },
  {
    id: 'chorus',
    name: 'Chorus Platform Docs',
    path: path.join(ROOT, 'chorus-tre.github.io/docs'),
    pattern: '**/*.md',
    context:
      'Chorus platform documentation: workspaces, workbenches, applications, data management, user guides, and tutorials.'
  }
]

const DB_PATH = path.join(__dirname, '..', 'src/app/api/.ai', 'index.sqlite')

async function main() {
  console.log('Building qmd index...')
  console.log(`  Database: ${DB_PATH}`)

  const fs = await import('node:fs')

  // Ensure output directory exists
  const dbDir = path.dirname(DB_PATH)
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }

  // Create store with available collections only (skip missing paths)
  const collectionsConfig: Record<string, { path: string; pattern: string }> =
    {}
  const availableCollections = COLLECTIONS.filter((col) => {
    if (!fs.existsSync(col.path)) {
      console.log(`  Skipping ${col.id}: path not found (${col.path})`)
      return false
    }
    return true
  })
  for (const col of availableCollections) {
    collectionsConfig[col.id] = { path: col.path, pattern: col.pattern }
  }

  const store = await createStore({
    dbPath: DB_PATH,
    config: { collections: collectionsConfig }
  })

  // Add context for each available collection
  for (const col of availableCollections) {
    console.log(`  Adding context for ${col.id}: ${col.name}`)
    await store.addContext(col.id, '', col.context)
  }

  // Update index (scan filesystem and index documents)
  console.log('  Indexing documents...')
  await store.update()

  // Print summary
  const collections = await store.listCollections()
  console.log('\nIndex built successfully:')
  for (const col of collections) {
    console.log(`  ${col.name}: ${JSON.stringify(col)}`)
  }
  console.log(`\nDatabase: ${DB_PATH}`)
}

main().catch((err) => {
  console.error('Failed to build index:', err)
  process.exit(1)
})
