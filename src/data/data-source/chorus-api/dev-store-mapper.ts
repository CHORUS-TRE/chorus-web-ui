import { DevStoreEntry } from '~/domain/model/dev-store'
import {
  ChorusPutEntryRequest,
  DevstoreServicePutWorkspaceEntryBody
} from '~/internal/client'

export const toChorusPutEntryRequest = (
  entry: DevStoreEntry
): ChorusPutEntryRequest => {
  return {
    key: entry.key,
    value: entry.value
  }
}

export const toDevstoreServicePutWorkspaceEntryBody = (
  entry: DevStoreEntry
): DevstoreServicePutWorkspaceEntryBody => {
  return {
    key: entry.key,
    value: entry.value
  }
}
