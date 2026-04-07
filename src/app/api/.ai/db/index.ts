import path from 'node:path'

import { createStore, type QMDStore } from '@tobilu/qmd'

let qmdStore: QMDStore | null = null

export async function getQmdStore(): Promise<QMDStore> {
  if (!qmdStore) {
    const dbPath = path.join(process.cwd(), 'src/app/api/.ai', 'index.sqlite')
    qmdStore = await createStore({ dbPath })
  }
  return qmdStore
}
