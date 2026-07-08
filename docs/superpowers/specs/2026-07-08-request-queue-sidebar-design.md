# Request queue sidebar — design

**Date:** 2026-07-08
**Author:** Manuel Spuhler (with Claude)
**Status:** Approved, pending implementation

## Context

The workspace data page (`app/workspaces/[workspaceId]/data/file-manager-client.tsx`) lets a user select files and add them to a "basket," then request either a download or a transfer for the whole basket via a modal dialog. Today:

- The basket is a single flat list (`state.basketItems: string[]`) — no per-item distinction between "wants to download this" and "wants to transfer this."
- Opening the basket (`showBasket = true`) **replaces the entire content panel** — the file browser disappears while the basket is shown.
- The basket component (`components/file-manager/selection-basket.tsx`) is titled "Selected Files."
- Download/Transfer are chosen at request time (two mutually exclusive dialogs: "Request Download Approval" / "Request Transfer Approval"), each firing one backend call (`createDataExtractionRequest` or `createDataTransferRequest`).
- File rows (`components/file-manager/file-grid.tsx`) only have a Download icon action (adds to the flat basket); there's no per-row Transfer trigger.

The goal is a "Request queue" sidebar (reference mockups provided) that sits alongside the file browser instead of replacing it, groups queued files by intended action (Download vs. Transfer), and submits both in one action.

## Scope decisions (confirmed with user)

- **Sidebar visibility:** stays toggleable via the existing "Basket" pill — clicking it now slides in a side panel next to the file browser instead of swapping out the whole view. Not always-on.
- **Copy:** adopt the screenshot's copy verbatim (title, empty state).
- **Grouping:** new behavior — items are tagged per-action (download and/or transfer), shown in separate sections, submitted together. This is more than a layout change; it implements REQ-2 (transfer action) and REQ-13 (cart-style checkout UX) from `projects/chorus-tre/chorus-web-ui/data/ux-improvements/requirements/requirements.md` in the knowledge hub.
- **Row actions:** full redesign — list-view rows get text-labeled "Download"/"Transfer" buttons plus a "..." overflow menu (Rename, Delete). Grid view keeps icon-only overlays (adds a Transfer icon next to Download). Bulk toolbar gets a Transfer-all icon next to Download-all/Delete-all.
- **Target workspace timing:** chosen in the submit dialog, not inline in the queue rows. The screenshot's inline "to Workspaces / project-alpha" annotation is dropped — showing it earlier would require picking a workspace before opening the request dialog, which is out of scope.

## Data model

`hooks/use-file-system.ts`:

- Replace `state.basketItems: string[]` with `state.downloadBasketItems: string[]` and `state.transferBasketItems: string[]`. An item's id can appear in either, both, or neither.
- Replace `selectBasketItem(itemId, force?)` with `toggleDownloadItem(itemId, force?)` and `toggleTransferItem(itemId, force?)`, same force/toggle semantics as today.
- `clearBasket()` empties both arrays.

## Component changes

### `file-grid.tsx`

- **List view row actions** (`col-span-3`): replace the icon-only Rename/Download/Delete cluster with labeled "Download" and "Transfer" ghost buttons (hidden for folders, same rule as today's Download-only visibility) plus a `DropdownMenu` (shadcn, already in the repo) containing Rename and Delete.
- **Bulk toolbar** (shown when rows are checkbox-selected): add a Transfer-all icon button next to the existing Download-all/Delete-all icons.
- **Grid view** tiles: too small for labels — keep the icon-overlay pattern, add a second Transfer icon next to the existing Download icon overlay. Rename/Delete remain context-menu-only there, unchanged.
- New props: `onTransfer: (itemId: string) => void`, `transferBasketItems?: string[]` (mirroring `onDownload`/`basketItems`).

### `selection-basket.tsx` (the sidebar; filename unchanged — internal detail)

- Title: "Request queue." Badge: `downloadItems.length + transferItems.length`.
- Description: "Files appear here after you choose Download or Transfer. Review the queue, then submit the request."
- Empty state (both groups empty): centered "+" icon, "No files added yet," "Select files, then choose **Download** or **Transfer**."
- Populated state: a "DOWNLOAD" section and/or "TRANSFER" section (each rendered only if non-empty), each item row showing name/size and a remove (X) control.
- Footer: "Submit request" (primary, disabled when both groups are empty) and "Clear queue" (subtle link), unchanged in spirit from today's Download/Transfer buttons but now a single combined action.
- Props become: `downloadItems: FileSystemItem[]`, `transferItems: FileSystemItem[]`, `onRemoveDownloadItem`, `onRemoveTransferItem`, `onClearSelection`, `onSubmit(downloadItems, transferItems, targetWorkspaceId, justification)`.

### Submit dialog

One dialog replaces today's two mode-specific dialogs:

- Title reflects contents: "Request Download & Transfer Approval" if both groups non-empty, "Request Download Approval" / "Request Transfer Approval" if only one.
- Shows count/size summary per non-empty group.
- Target-workspace picker, shown only if the transfer group is non-empty.
- One shared justification textarea (required), same copy as today.
- On confirm: fires `createDataExtractionRequest` (if download items exist) and `createDataTransferRequest` (if transfer items exist), in parallel, then handles results per Error handling below.

### `file-manager-client.tsx` (layout)

- Content container becomes a flex row. When `showBasket` is true, the sidebar (fixed width, ~320px, `shrink-0`, left border) renders alongside the file browser/welcome state instead of replacing it.
- Store chip "active" state (`isActive`) no longer depends on `!showBasket` — both the sidebar and a selected store can be visible at once.
- Selecting a store no longer force-closes the sidebar (`setShowBasket(false)` on store click is removed) since the two are no longer mutually exclusive.
- `handleDownloadRequest`/`handleTransferRequest` are merged into a single `handleSubmitRequest(downloadItems, transferItems, targetWorkspaceId, justification)` that conditionally fires each backend call.

## Error handling

Same per-call error handling as today (toast with `errorToast(result.error)`, `variant: 'destructive'`), just evaluated once per fired call, each independently clearing its own group on success:

- Both calls succeed → one "Request submitted" success toast, clear both lists.
- Exactly one call was fired (only one group was non-empty) and it fails → one error toast, nothing cleared.
- Both calls were fired and one fails → one error toast naming which group failed; that group's items stay in the queue so the user can retry, the succeeded group is cleared.
- Both calls were fired and both fail → one error toast summarizing both failures, nothing cleared.

## Testing

No existing automated tests cover `file-grid.tsx`, `selection-basket.tsx`, `file-manager-client.tsx`, or `use-file-system.ts`. Verification is manual: run the dev server, exercise the golden path (add files to download queue, add files to transfer queue, add a file to both, submit combined request, verify toast and queue clears) and edge cases (empty queue submit disabled, remove individual items, clear queue, toggle sidebar open/closed while browsing different stores), plus `tsc`/lint.

## Addendum (2026-07-08, post-implementation feedback)

After the initial implementation, direct UI feedback changed three things:

1. **Download/Transfer row buttons are bordered**, not plain ghost buttons — `variant="outline"` with a visible border, active/queued state highlighted with `border-accent bg-accent/20`.
2. **Adding an item now auto-opens the sidebar** (`setShowBasket(true)` inside `handleAddToBasket`/`handleAddToTransferBasket` in `file-manager-client.tsx`), instead of requiring a manual click on the "Basket" pill.
3. **Submission is per-queue, not combined**, reversing the "Submit flow" section above. Each queue section (`DownloadQueueSection`, `TransferQueueSection` in `selection-basket.tsx`) has its own two-step inline flow instead of a shared modal dialog:
   - **List step:** file rows + a `Cancel` / `Submit request` button pair. `Cancel` clears that queue (`onClearDownload`/`onClearTransfer`); `Submit request` switches to the form step.
   - **Form step:** justification textarea (+ target-workspace picker for Transfer), replacing the file list in place; its own `Cancel` (discards input, returns to list step) / `Submit request` (fires the request, disabled until required fields are filled) pair.
   - `SelectionBasketProps` are now `onClearDownload`, `onClearTransfer`, `onSubmitDownload`, `onSubmitTransfer` instead of the single `onClearSelection`/`onSubmit`.
   - `file-manager-client.tsx` correspondingly has separate `handleSubmitDownloadRequest`/`handleSubmitTransferRequest` (each firing one backend call and clearing only its own queue on success) instead of the combined `handleSubmitRequest`, plus `handleClearDownloadQueue`/`handleClearTransferQueue`.
   - The Submit request buttons get `border border-accent` (bordered per feedback), and Cancel uses the existing bordered `outline` variant.

This means a download-only submission and a transfer-only submission are independent actions again (each with its own justification), rather than one combined submission covering both queues.

## Out of scope

- Always-on (non-toggleable) sidebar.
- Inline target-workspace selection in queue rows before submit.
- Per-item independent justification (one shared justification for the whole submission).
- Any backend/API changes — both use cases (`CreateDataExtractionRequestUseCase`, `CreateDataTransferRequestUseCase`) already exist and are called as today, just orchestrated together.
