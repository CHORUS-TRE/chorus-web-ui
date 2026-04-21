import path from 'node:path'

import Database from 'better-sqlite3'

export type FTSSearchResult = {
  body: string
  displayPath: string
  title: string
  collectionName: string
  score: number
}

export type FTSSearchOptions = {
  limit?: number
  collection?: string
}

let cached: Database.Database | null = null

function getDb(): Database.Database {
  if (cached) return cached
  const dbPath = path.join(process.cwd(), 'src/app/api/.ai', 'index.sqlite')
  cached = new Database(dbPath, { readonly: true, fileMustExist: true })
  return cached
}

function sanitizeTerm(term: string): string {
  return term.replace(/[^\p{L}\p{N}']/gu, '').toLowerCase()
}

function buildFTS5Query(query: string): string | null {
  const positive: string[] = []
  const negative: string[] = []
  let i = 0
  const s = query.trim()

  while (i < s.length) {
    while (i < s.length && /\s/.test(s[i])) i++
    if (i >= s.length) break

    const negated = s[i] === '-'
    if (negated) i++

    if (s[i] === '"') {
      const start = ++i
      while (i < s.length && s[i] !== '"') i++
      const phrase = s.slice(start, i).trim()
      i++
      if (!phrase) continue
      const sanitized = phrase
        .split(/\s+/)
        .map(sanitizeTerm)
        .filter(Boolean)
        .join(' ')
      if (!sanitized) continue
      const ftsPhrase = `"${sanitized}"`
      ;(negated ? negative : positive).push(ftsPhrase)
    } else {
      const start = i
      while (i < s.length && !/[\s"]/.test(s[i])) i++
      const sanitized = sanitizeTerm(s.slice(start, i))
      if (!sanitized) continue
      const ftsTerm = `"${sanitized}"*`
      ;(negated ? negative : positive).push(ftsTerm)
    }
  }

  if (positive.length === 0) return null

  let result = positive.join(' AND ')
  for (const neg of negative) result += ` NOT ${neg}`
  return result
}

type Row = {
  display_path: string
  title: string
  body: string
  collection: string
  bm25_score: number
}

export function searchFTS(
  query: string,
  options: FTSSearchOptions = {}
): FTSSearchResult[] {
  const fts = buildFTS5Query(query)
  if (!fts) return []

  const db = getDb()
  const { limit = 20, collection } = options

  let sql = `
    SELECT
      d.collection || '/' || d.path as display_path,
      d.title,
      content.doc as body,
      d.collection as collection,
      bm25(documents_fts, 10.0, 1.0) as bm25_score
    FROM documents_fts f
    JOIN documents d ON d.id = f.rowid
    JOIN content ON content.hash = d.hash
    WHERE documents_fts MATCH ? AND d.active = 1
  `
  const params: (string | number)[] = [fts]
  if (collection) {
    sql += ` AND d.collection = ?`
    params.push(collection)
  }
  sql += ` ORDER BY bm25_score ASC LIMIT ?`
  params.push(limit)

  const rows = db.prepare(sql).all(...params) as Row[]

  return rows.map((row) => {
    const abs = Math.abs(row.bm25_score)
    return {
      body: row.body,
      displayPath: row.display_path,
      title: row.title,
      collectionName: row.collection,
      score: abs / (1 + abs)
    }
  })
}
