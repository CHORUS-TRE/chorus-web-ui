# Request Queue Sidebar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the workspace data page's "basket that hides the file browser" with a persistent, toggleable "Request queue" sidebar that groups queued files by intended action (Download / Transfer) and submits both in one combined request.

**Architecture:** Split the flat `basketItems` array in `useFileSystem` into two independent id arrays (`downloadBasketItems`, `transferBasketItems`). Give file rows a Transfer action alongside the existing Download action, moving Rename/Delete into a "..." overflow menu. Rework the basket component into a grouped "Request queue" sidebar with one combined submit dialog. Change `file-manager-client.tsx`'s layout so the sidebar renders next to the file browser (flex row) instead of replacing it.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind, shadcn/ui (Button, Dialog, DropdownMenu, Select), lucide-react icons, Jest + React Testing Library.

## Global Constraints

- Full design spec: `docs/superpowers/specs/2026-07-08-request-queue-sidebar-design.md`. Every task below implements a piece of it — refer back if a detail here seems ambiguous.
- No backend/API changes. `createDataExtractionRequest` and `createDataTransferRequest` (`src/view-model/approval-request-view-model.ts`) are called exactly as they are today, just orchestrated together.
- Sidebar stays toggleable (existing "Basket" pill in the top chip row), not always-on.
- Sidebar title: "Request queue". Empty-state copy: "No files added yet" / "Select files, then choose **Download** or **Transfer**." Description under title: "Files appear here after you choose Download or Transfer. Review the queue, then submit the request."
- Target workspace for transfers is chosen in the submit dialog, not inline in queue rows.
- DRY/YAGNI: reuse existing `toggleDownloadItem`/`toggleTransferItem` primitives for partial-clear cases rather than adding new hook functions.
- This repo has no automated tests for `file-grid.tsx`, `selection-basket.tsx`, `file-manager-client.tsx`, or `use-file-system.ts` today. Task 1–3 add focused tests where components are cheap to test in isolation; Task 4 (the integration/layout task) is verified manually plus `tsc`/lint, consistent with existing practice for this file family.

---

### Task 1: Split the basket into download/transfer state

**Files:**
- Modify: `src/types/file-system.ts:45-52`
- Modify: `src/hooks/use-file-system.ts:123-131` (initial state), `:362-375` (`selectBasketItem`), `:1144-1149` (`clearBasket`), `:1300-1325` (returned object)
- Test: `src/hooks/__tests__/use-file-system-basket.test.ts` (new)

**Interfaces:**
- Consumes: nothing (first task).
- Produces: `state.downloadBasketItems: string[]`, `state.transferBasketItems: string[]`, `toggleDownloadItem(itemId: string, force?: boolean): void`, `toggleTransferItem(itemId: string, force?: boolean): void`, `clearBasket(): void` (now clears both arrays). These are the exact names Tasks 2–4 will consume from `useFileSystem(...)`'s return value.

- [ ] **Step 1: Write the failing tests**

Create `src/hooks/__tests__/use-file-system-basket.test.ts`:

```ts
import { act, renderHook } from '@testing-library/react'

import { useFileSystem } from '../use-file-system'

describe('useFileSystem basket state', () => {
  it('adds an item to the download basket when toggled on', () => {
    const { result } = renderHook(() => useFileSystem())

    act(() => {
      result.current.toggleDownloadItem('file-1')
    })

    expect(result.current.state.downloadBasketItems).toEqual(['file-1'])
    expect(result.current.state.transferBasketItems).toEqual([])
  })

  it('removes an item from the download basket when toggled again', () => {
    const { result } = renderHook(() => useFileSystem())

    act(() => {
      result.current.toggleDownloadItem('file-1')
    })
    act(() => {
      result.current.toggleDownloadItem('file-1')
    })

    expect(result.current.state.downloadBasketItems).toEqual([])
  })

  it('respects the force parameter', () => {
    const { result } = renderHook(() => useFileSystem())

    act(() => {
      result.current.toggleDownloadItem('file-1', true)
    })
    act(() => {
      result.current.toggleDownloadItem('file-1', true)
    })

    expect(result.current.state.downloadBasketItems).toEqual(['file-1'])
  })

  it('allows the same item in both the download and transfer baskets independently', () => {
    const { result } = renderHook(() => useFileSystem())

    act(() => {
      result.current.toggleDownloadItem('file-1')
      result.current.toggleTransferItem('file-1')
    })

    expect(result.current.state.downloadBasketItems).toEqual(['file-1'])
    expect(result.current.state.transferBasketItems).toEqual(['file-1'])

    act(() => {
      result.current.toggleDownloadItem('file-1')
    })

    expect(result.current.state.downloadBasketItems).toEqual([])
    expect(result.current.state.transferBasketItems).toEqual(['file-1'])
  })

  it('clearBasket empties both download and transfer baskets', () => {
    const { result } = renderHook(() => useFileSystem())

    act(() => {
      result.current.toggleDownloadItem('file-1')
      result.current.toggleTransferItem('file-2')
    })
    act(() => {
      result.current.clearBasket()
    })

    expect(result.current.state.downloadBasketItems).toEqual([])
    expect(result.current.state.transferBasketItems).toEqual([])
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx jest use-file-system-basket --no-coverage`
Expected: FAIL — `toggleDownloadItem`/`toggleTransferItem` are not functions (the hook still only exposes `selectBasketItem`), and `state.downloadBasketItems`/`state.transferBasketItems` are `undefined`.

- [ ] **Step 3: Update the type definition**

In `src/types/file-system.ts`, replace lines 45-52:

```ts
export interface FileSystemState {
  items: Record<string, FileSystemItem>
  selectedItems: string[]
  downloadBasketItems: string[]
  transferBasketItems: string[]
  currentFolderId: string | null
  viewMode: 'list' | 'grid'
  clipboard: FileClipboard | null
}
```

- [ ] **Step 4: Update the initial state in `use-file-system.ts`**

Replace (around line 127):

```ts
    basketItems: [],
```

with:

```ts
    downloadBasketItems: [],
    transferBasketItems: [],
```

- [ ] **Step 5: Replace `selectBasketItem` with two toggle functions**

Replace the `selectBasketItem` callback (around lines 362-375):

```ts
  const selectBasketItem = useCallback((itemId: string, force?: boolean) => {
    setState((prev) => {
      const isSelected = prev.basketItems.includes(itemId)
      const shouldSelect = force !== undefined ? force : !isSelected

      return {
        ...prev,
        basketItems: shouldSelect
          ? isSelected
            ? prev.basketItems
            : [...prev.basketItems, itemId]
          : prev.basketItems.filter((id) => id !== itemId)
      }
    })
  }, [])
```

with:

```ts
  const toggleDownloadItem = useCallback((itemId: string, force?: boolean) => {
    setState((prev) => {
      const isSelected = prev.downloadBasketItems.includes(itemId)
      const shouldSelect = force !== undefined ? force : !isSelected

      return {
        ...prev,
        downloadBasketItems: shouldSelect
          ? isSelected
            ? prev.downloadBasketItems
            : [...prev.downloadBasketItems, itemId]
          : prev.downloadBasketItems.filter((id) => id !== itemId)
      }
    })
  }, [])

  const toggleTransferItem = useCallback((itemId: string, force?: boolean) => {
    setState((prev) => {
      const isSelected = prev.transferBasketItems.includes(itemId)
      const shouldSelect = force !== undefined ? force : !isSelected

      return {
        ...prev,
        transferBasketItems: shouldSelect
          ? isSelected
            ? prev.transferBasketItems
            : [...prev.transferBasketItems, itemId]
          : prev.transferBasketItems.filter((id) => id !== itemId)
      }
    })
  }, [])
```

- [ ] **Step 6: Update `clearBasket`**

Replace (around lines 1144-1149):

```ts
  const clearBasket = useCallback(() => {
    setState((prev) => ({
      ...prev,
      basketItems: []
    }))
  }, [])
```

with:

```ts
  const clearBasket = useCallback(() => {
    setState((prev) => ({
      ...prev,
      downloadBasketItems: [],
      transferBasketItems: []
    }))
  }, [])
```

- [ ] **Step 7: Update the hook's returned object**

In the returned object at the end of `useFileSystem` (around lines 1300-1325), replace:

```ts
    clearBasket,
    selectBasketItem,
```

with:

```ts
    clearBasket,
    toggleDownloadItem,
    toggleTransferItem,
```

- [ ] **Step 8: Run the tests to verify they pass**

Run: `npx jest use-file-system-basket --no-coverage`
Expected: PASS (5 tests)

- [ ] **Step 9: Type-check**

Run: `npx tsc --noEmit`
Expected: no new errors from `use-file-system.ts` or `types/file-system.ts`. (Tasks 2–4 haven't updated their call sites yet, so `file-manager-client.tsx` and `file-grid.tsx` will show errors referencing `basketItems`/`selectBasketItem` until those tasks land — that's expected at this point in the plan.)

- [ ] **Step 10: Commit**

```bash
git add src/types/file-system.ts src/hooks/use-file-system.ts src/hooks/__tests__/use-file-system-basket.test.ts
git commit -m "feat(file-system): split basket state into download/transfer queues"
```

---

### Task 2: Add Transfer action and overflow menu to file rows

**Files:**
- Modify: `src/components/file-manager/file-grid.tsx`
- Test: `src/components/file-manager/__tests__/file-grid.test.tsx` (new)

**Interfaces:**
- Consumes: nothing from Task 1 directly (FileGrid takes plain id arrays as props, named to match what Task 4 will pass: `basketItems` for download ids, `transferBasketItems` for transfer ids — same shape as today's `basketItems`).
- Produces: new `FileGridProps` fields `onTransfer: (itemId: string) => void` and `transferBasketItems?: string[]`, which Task 4 wires to `toggleTransferItem` and `state.transferBasketItems`.

- [ ] **Step 1: Write the failing tests**

Create `src/components/file-manager/__tests__/file-grid.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'

import type { FileSystemItem } from '@/types/file-system'

import { FileGrid } from '../file-grid'

// Radix DropdownMenu needs these two DOM APIs, which jsdom doesn't implement.
beforeAll(() => {
  Element.prototype.hasPointerCapture = jest.fn()
  Element.prototype.scrollIntoView = jest.fn()
})

const baseItem: FileSystemItem = {
  id: 'file-1',
  name: 'report.pdf',
  type: 'file',
  parentId: 'root',
  path: '/report.pdf',
  size: 1024,
  modifiedAt: new Date('2026-01-01T00:00:00Z'),
  owner: 'user-1'
}

const noop = () => undefined

function renderGrid(
  overrides: Partial<ComponentProps<typeof FileGrid>> = {}
) {
  return render(
    <FileGrid
      items={[baseItem]}
      selectedItems={[]}
      viewMode="list"
      onSelectItem={noop}
      onSelectRange={noop}
      onSelectAll={noop}
      onClearSelection={noop}
      onNavigateToFolder={noop}
      onMoveItem={noop}
      onDownload={noop}
      onTransfer={noop}
      onDelete={noop}
      onRename={noop}
      basketItems={[]}
      transferBasketItems={[]}
      {...overrides}
    />
  )
}

describe('FileGrid list view row actions', () => {
  it('calls onDownload when the Download button is clicked', () => {
    const onDownload = jest.fn()
    renderGrid({ onDownload })

    fireEvent.click(screen.getByRole('button', { name: /download/i }))

    expect(onDownload).toHaveBeenCalledWith('file-1')
  })

  it('calls onTransfer when the Transfer button is clicked', () => {
    const onTransfer = jest.fn()
    renderGrid({ onTransfer })

    fireEvent.click(screen.getByRole('button', { name: /transfer/i }))

    expect(onTransfer).toHaveBeenCalledWith('file-1')
  })

  it('shows Rename and Delete inside the overflow menu', async () => {
    renderGrid()

    fireEvent.click(screen.getByRole('button', { name: /more actions/i }))

    expect(await screen.findByText('Rename')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('calls onRename when Rename is chosen from the overflow menu', async () => {
    const onRename = jest.fn()
    renderGrid({ onRename })

    fireEvent.click(screen.getByRole('button', { name: /more actions/i }))
    fireEvent.click(await screen.findByText('Rename'))

    expect(onRename).toHaveBeenCalledWith('file-1')
  })

  it('calls onDelete when Delete is chosen from the overflow menu', async () => {
    const onDelete = jest.fn()
    renderGrid({ onDelete })

    fireEvent.click(screen.getByRole('button', { name: /more actions/i }))
    fireEvent.click(await screen.findByText('Delete'))

    expect(onDelete).toHaveBeenCalledWith('file-1')
  })

  it('does not show Download/Transfer buttons for folders', () => {
    const folder: FileSystemItem = { ...baseItem, id: 'folder-1', type: 'folder' }
    renderGrid({ items: [folder] })

    expect(
      screen.queryByRole('button', { name: /^download$/i })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /^transfer$/i })
    ).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx jest file-grid.test --no-coverage`
Expected: FAIL — `onTransfer`/`transferBasketItems` props don't exist yet, no "Transfer" button, no "more actions" trigger.

- [ ] **Step 3: Update imports**

In `src/components/file-manager/file-grid.tsx`, replace the `lucide-react` import block (lines 1-14):

```tsx
import {
  Archive,
  CornerLeftUp,
  Download,
  File,
  FileText,
  Folder,
  ImageIcon,
  Loader2,
  Music,
  Pencil,
  Trash2,
  Video
} from 'lucide-react'
```

with:

```tsx
import {
  Archive,
  ArrowRightLeft,
  CornerLeftUp,
  Download,
  File,
  FileText,
  Folder,
  ImageIcon,
  Loader2,
  MoreVertical,
  Music,
  Pencil,
  Trash2,
  Video
} from 'lucide-react'
```

Add a new import right after the `Button`/`Checkbox` imports (after line 19):

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
```

- [ ] **Step 4: Add the new props**

In the `FileGridProps` interface, replace:

```ts
  onDownload: (itemId: string) => void
  onDelete?: (itemId: string) => void
  onRename?: (itemId: string) => void
  basketItems?: string[]
```

with:

```ts
  onDownload: (itemId: string) => void
  onTransfer: (itemId: string) => void
  onDelete?: (itemId: string) => void
  onRename?: (itemId: string) => void
  basketItems?: string[]
  transferBasketItems?: string[]
```

Add `onTransfer` and `transferBasketItems = []` to the destructured props in the `FileGrid` function signature (alongside `onDownload` and `basketItems = []`).

- [ ] **Step 5: Update the grid view's icon overlay**

Replace (grid view item icon block):

```tsx
                <div className="relative mb-2">
                  {getFileIcon(item)}
                  {item.type !== 'folder' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        'absolute -right-1 -top-1 h-6 w-6 rounded-full bg-background/80 p-0 transition-opacity hover:bg-accent hover:text-accent-foreground group-hover:opacity-100',
                        basketItems.includes(item.id)
                          ? 'bg-accent text-accent-foreground opacity-100'
                          : 'opacity-0'
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        onDownload(item.id)
                      }}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  )}
                </div>
```

with:

```tsx
                <div className="relative mb-2">
                  {getFileIcon(item)}
                  {item.type !== 'folder' && (
                    <div className="absolute -right-1 -top-1 flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          'h-6 w-6 rounded-full bg-background/80 p-0 transition-opacity hover:bg-accent hover:text-accent-foreground group-hover:opacity-100',
                          transferBasketItems.includes(item.id)
                            ? 'bg-accent text-accent-foreground opacity-100'
                            : 'opacity-0'
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          onTransfer(item.id)
                        }}
                        aria-label={`Add ${item.name} to transfer queue`}
                      >
                        <ArrowRightLeft className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          'h-6 w-6 rounded-full bg-background/80 p-0 transition-opacity hover:bg-accent hover:text-accent-foreground group-hover:opacity-100',
                          basketItems.includes(item.id)
                            ? 'bg-accent text-accent-foreground opacity-100'
                            : 'opacity-0'
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          onDownload(item.id)
                        }}
                        aria-label={`Add ${item.name} to download queue`}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
```

- [ ] **Step 6: Update the bulk toolbar (list view header)**

Replace the two-button block shown when `selectedCount > 0` (Download-all, Delete-all) with a three-button block (Download-all, Transfer-all, Delete-all):

```tsx
            {selectedCount > 0 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-accent"
                  onClick={(e) => {
                    e.stopPropagation()
                    for (const id of selectedItems) {
                      const item = items.find((i) => i.id === id)
                      if (item && item.type !== 'folder') {
                        onDownload(id)
                      }
                    }
                  }}
                  title={`Add ${selectedCount} to download queue`}
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-accent"
                  onClick={(e) => {
                    e.stopPropagation()
                    for (const id of selectedItems) {
                      const item = items.find((i) => i.id === id)
                      if (item && item.type !== 'folder') {
                        onTransfer(id)
                      }
                    }
                  }}
                  title={`Add ${selectedCount} to transfer queue`}
                >
                  <ArrowRightLeft className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    for (const id of selectedItems) {
                      onDelete?.(id)
                    }
                  }}
                  title={`Delete ${selectedCount} item${selectedCount > 1 ? 's' : ''}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
```

- [ ] **Step 7: Replace the list view row action cluster**

Replace the row actions block (`col-span-3`, currently Rename icon + Download icon + Delete icon):

```tsx
                <div className="col-span-3 flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-accent"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRename?.(item.id)
                    }}
                    title="Rename"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  {item.type !== 'folder' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        'h-7 w-7 p-0 text-muted-foreground hover:text-accent',
                        basketItems.includes(item.id) &&
                          'bg-accent/20 text-accent'
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        onDownload(item.id)
                      }}
                      title="Add to basket"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete?.(item.id)
                    }}
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
```

with:

```tsx
                <div className="col-span-3 flex items-center justify-end gap-1">
                  {item.type !== 'folder' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          'h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-accent',
                          basketItems.includes(item.id) &&
                            'bg-accent/20 text-accent'
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          onDownload(item.id)
                        }}
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          'h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-accent',
                          transferBasketItems.includes(item.id) &&
                            'bg-accent/20 text-accent'
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          onTransfer(item.id)
                        }}
                      >
                        <ArrowRightLeft className="h-3.5 w-3.5" />
                        Transfer
                      </Button>
                    </>
                  )}
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-accent"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`More actions for ${item.name}`}
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenuItem onClick={() => onRename?.(item.id)}>
                        <Pencil className="mr-2 h-3.5 w-3.5" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete?.(item.id)}
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
```

- [ ] **Step 8: Run the tests to verify they pass**

Run: `npx jest file-grid.test --no-coverage`
Expected: PASS (7 tests)

- [ ] **Step 9: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors from `file-grid.tsx` itself. `file-manager-client.tsx` will still show errors until Task 4 — expected.

- [ ] **Step 10: Commit**

```bash
git add src/components/file-manager/file-grid.tsx src/components/file-manager/__tests__/file-grid.test.tsx
git commit -m "feat(file-grid): add per-row Transfer action and move Rename/Delete into overflow menu"
```

---

### Task 3: Rebuild the sidebar as a grouped "Request queue"

**Files:**
- Modify: `src/components/file-manager/selection-basket.tsx` (full rewrite of the component body; filename unchanged)
- Test: `src/components/file-manager/__tests__/selection-basket.test.tsx` (new)

**Interfaces:**
- Consumes: nothing from Task 1/2 directly — takes plain `FileSystemItem[]` arrays as props (Task 4 supplies these by mapping `state.downloadBasketItems`/`state.transferBasketItems` ids to items).
- Produces: new `SelectionBasketProps`: `downloadItems: FileSystemItem[]`, `transferItems: FileSystemItem[]`, `onRemoveDownloadItem: (itemId: string) => void`, `onRemoveTransferItem: (itemId: string) => void`, `onClearSelection: () => void`, `onSubmit: (downloadItems: FileSystemItem[], transferItems: FileSystemItem[], targetWorkspaceId: string, justification: string) => void`. Task 4 wires `onSubmit` to a new `handleSubmitRequest` it defines.

- [ ] **Step 1: Write the failing tests**

Create `src/components/file-manager/__tests__/selection-basket.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react'

import type { FileSystemItem } from '@/types/file-system'

import { SelectionBasket } from '../selection-basket'

jest.mock('next/navigation', () => ({
  useParams: () => ({ workspaceId: 'ws-1' })
}))

jest.mock('@/stores/app-state-store', () => ({
  useAppState: () => ({
    workspaces: [{ id: 'ws-2', name: 'Project Alpha' }]
  })
}))

const downloadItem: FileSystemItem = {
  id: 'file-1',
  name: 'report.pdf',
  type: 'file',
  parentId: 'root',
  path: '/report.pdf',
  size: 2048,
  modifiedAt: new Date('2026-01-01T00:00:00Z'),
  owner: 'user-1'
}

const transferItem: FileSystemItem = {
  id: 'file-2',
  name: 'logo.png',
  type: 'file',
  parentId: 'root',
  path: '/logo.png',
  size: 4096,
  modifiedAt: new Date('2026-01-01T00:00:00Z'),
  owner: 'user-1'
}

const noop = () => undefined

describe('SelectionBasket', () => {
  it('shows the empty state when both queues are empty', () => {
    render(
      <SelectionBasket
        downloadItems={[]}
        transferItems={[]}
        onRemoveDownloadItem={noop}
        onRemoveTransferItem={noop}
        onClearSelection={noop}
        onSubmit={noop}
      />
    )

    expect(screen.getByText('No files added yet')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit request' })).toBeDisabled()
  })

  it('groups items into Download and Transfer sections with a combined badge count', () => {
    render(
      <SelectionBasket
        downloadItems={[downloadItem]}
        transferItems={[transferItem]}
        onRemoveDownloadItem={noop}
        onRemoveTransferItem={noop}
        onClearSelection={noop}
        onSubmit={noop}
      />
    )

    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('Download')).toBeInTheDocument()
    expect(screen.getByText('Transfer')).toBeInTheDocument()
    expect(screen.getByText('report.pdf')).toBeInTheDocument()
    expect(screen.getByText('logo.png')).toBeInTheDocument()
  })

  it('calls onRemoveDownloadItem when a download item is removed', () => {
    const onRemoveDownloadItem = jest.fn()
    render(
      <SelectionBasket
        downloadItems={[downloadItem]}
        transferItems={[]}
        onRemoveDownloadItem={onRemoveDownloadItem}
        onRemoveTransferItem={noop}
        onClearSelection={noop}
        onSubmit={noop}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Remove report.pdf' }))

    expect(onRemoveDownloadItem).toHaveBeenCalledWith('file-1')
  })

  it('calls onClearSelection when Clear queue is clicked', () => {
    const onClearSelection = jest.fn()
    render(
      <SelectionBasket
        downloadItems={[downloadItem]}
        transferItems={[]}
        onRemoveDownloadItem={noop}
        onRemoveTransferItem={noop}
        onClearSelection={onClearSelection}
        onSubmit={noop}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Clear queue' }))

    expect(onClearSelection).toHaveBeenCalled()
  })

  it('opens a download-only submit dialog and calls onSubmit after entering justification', () => {
    const onSubmit = jest.fn()
    render(
      <SelectionBasket
        downloadItems={[downloadItem]}
        transferItems={[]}
        onRemoveDownloadItem={noop}
        onRemoveTransferItem={noop}
        onClearSelection={noop}
        onSubmit={onSubmit}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Submit request' }))

    expect(
      screen.getByText('Request Download Approval')
    ).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/justification/i), {
      target: { value: 'Needed for analysis' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Submit Request' }))

    expect(onSubmit).toHaveBeenCalledWith(
      [downloadItem],
      [],
      '',
      'Needed for analysis'
    )
  })

  it('disables the dialog submit until a target workspace is chosen when transfer items are queued', () => {
    render(
      <SelectionBasket
        downloadItems={[]}
        transferItems={[transferItem]}
        onRemoveDownloadItem={noop}
        onRemoveTransferItem={noop}
        onClearSelection={noop}
        onSubmit={noop}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Submit request' }))
    expect(screen.getByText('Request Transfer Approval')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/justification/i), {
      target: { value: 'Needed for collaboration' }
    })

    expect(
      screen.getByRole('button', { name: 'Submit Request' })
    ).toBeDisabled()
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx jest selection-basket.test --no-coverage`
Expected: FAIL — component still exposes the old `selectedItems`/`onRemoveItem`/`onDownloadRequest`/`onTransferRequest` props, is titled "Selected Files," and has no grouped sections.

- [ ] **Step 3: Rewrite `selection-basket.tsx`**

Replace the entire file contents:

```tsx
'use client'

import { Trash2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useAppState } from '@/stores/app-state-store'
import type { FileSystemItem } from '@/types/file-system'

interface SelectionBasketProps {
  downloadItems: FileSystemItem[]
  transferItems: FileSystemItem[]
  onRemoveDownloadItem: (itemId: string) => void
  onRemoveTransferItem: (itemId: string) => void
  onClearSelection: () => void
  onSubmit: (
    downloadItems: FileSystemItem[],
    transferItems: FileSystemItem[],
    targetWorkspaceId: string,
    justification: string
  ) => void
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

function QueueSection({
  label,
  items,
  onRemoveItem
}: {
  label: string
  items: FileSystemItem[]
  onRemoveItem: (itemId: string) => void
}) {
  if (items.length === 0) return null

  return (
    <div className="space-y-1">
      <div className="px-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">
        {label}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          className="group flex items-center justify-between rounded-lg bg-muted/20 px-3 py-2 text-xs transition-all hover:bg-muted/40"
        >
          <span className="min-w-0 flex-1 truncate pr-3 font-medium text-foreground/90">
            {item.name}
          </span>
          <div className="flex shrink-0 items-center gap-3">
            <span className="text-[10px] tabular-nums text-muted-foreground/60">
              {formatBytes(item.size || 0)}
            </span>
            <button
              onClick={() => onRemoveItem(item.id)}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground/60 transition-colors hover:bg-destructive/10 hover:text-destructive focus:outline-none"
              aria-label={`Remove ${item.name}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export function SelectionBasket({
  downloadItems,
  transferItems,
  onRemoveDownloadItem,
  onRemoveTransferItem,
  onClearSelection,
  onSubmit
}: SelectionBasketProps) {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = React.useState(false)
  const [requestJustification, setRequestJustification] = React.useState('')
  const [targetWorkspaceId, setTargetWorkspaceId] = React.useState('')
  const [isCustomWorkspaceId, setIsCustomWorkspaceId] = React.useState(false)
  const params = useParams<{ workspaceId: string }>()
  const workspaceId = params?.workspaceId
  const { workspaces } = useAppState()

  const totalCount = downloadItems.length + transferItems.length
  const isEmpty = totalCount === 0

  const handleConfirmSubmit = () => {
    onSubmit(
      downloadItems,
      transferItems,
      targetWorkspaceId,
      requestJustification
    )

    setIsRequestDialogOpen(false)
    setRequestJustification('')
    setTargetWorkspaceId('')
  }

  const dialogTitle =
    downloadItems.length > 0 && transferItems.length > 0
      ? 'Request Download & Transfer Approval'
      : transferItems.length > 0
        ? 'Request Transfer Approval'
        : 'Request Download Approval'

  return (
    <>
      <div className="p-2 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            Request queue
          </CardTitle>
          <Badge className="rounded-full px-2">{totalCount}</Badge>
        </div>
        <CardDescription className="mt-1 text-xs text-muted-foreground">
          Files appear here after you choose Download or Transfer. Review the
          queue, then submit the request.
        </CardDescription>
      </div>

      <CardContent className="flex flex-1 flex-col p-2 pt-0">
        <ScrollArea className="flex-1 pr-4">
          {isEmpty ? (
            <div className="mt-8 flex flex-col items-center gap-3 p-6 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/40 text-lg text-muted-foreground">
                +
              </div>
              <p className="text-sm font-medium text-foreground">
                No files added yet
              </p>
              <p className="text-xs text-muted-foreground">
                Select files, then choose <strong>Download</strong> or{' '}
                <strong>Transfer</strong>.
              </p>
            </div>
          ) : (
            <div className="mt-2 space-y-4">
              <QueueSection
                label="Download"
                items={downloadItems}
                onRemoveItem={onRemoveDownloadItem}
              />
              <QueueSection
                label="Transfer"
                items={transferItems}
                onRemoveItem={onRemoveTransferItem}
              />
            </div>
          )}
        </ScrollArea>

        <div className="mt-auto p-2 pt-4">
          <Separator className="mb-4 bg-muted/40" />
          <Button
            size="sm"
            variant="default"
            disabled={isEmpty}
            onClick={() => setIsRequestDialogOpen(true)}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl"
          >
            Submit request
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={isEmpty}
            onClick={onClearSelection}
            className="mt-2 w-full text-xs text-muted-foreground hover:text-foreground"
          >
            Clear queue
          </Button>
        </div>
      </CardContent>

      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="border border-muted/20 bg-background/95 backdrop-blur-xl sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {dialogTitle}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-muted-foreground">
              This action requires approval from a workspace administrator.
              All data movement is logged and audited.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {downloadItems.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  Download ({downloadItems.length})
                </Label>
                <ScrollArea className="max-h-[140px] rounded-lg border border-muted/30 bg-muted/10">
                  <div className="divide-y divide-muted/20">
                    {downloadItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between px-3 py-2 text-xs"
                      >
                        <span className="truncate font-medium text-foreground">
                          {item.name}
                        </span>
                        <span className="ml-3 shrink-0 text-[10px] tabular-nums text-muted-foreground/60">
                          {formatBytes(item.size || 0)}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {transferItems.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  Transfer ({transferItems.length})
                </Label>
                <ScrollArea className="max-h-[140px] rounded-lg border border-muted/30 bg-muted/10">
                  <div className="divide-y divide-muted/20">
                    {transferItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between px-3 py-2 text-xs"
                      >
                        <span className="truncate font-medium text-foreground">
                          {item.name}
                        </span>
                        <span className="ml-3 shrink-0 text-[10px] tabular-nums text-muted-foreground/60">
                          {formatBytes(item.size || 0)}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {transferItems.length > 0 && (
              <div className="space-y-2">
                <Label
                  htmlFor="target-workspace"
                  className="text-sm font-semibold"
                >
                  Target Workspace
                </Label>
                <Select
                  value={isCustomWorkspaceId ? '__custom__' : targetWorkspaceId}
                  onValueChange={(val) => {
                    if (val === '__custom__') {
                      setIsCustomWorkspaceId(true)
                      setTargetWorkspaceId('')
                    } else {
                      setIsCustomWorkspaceId(false)
                      setTargetWorkspaceId(val)
                    }
                  }}
                >
                  <SelectTrigger className="bg-muted/20">
                    <SelectValue placeholder="Select a workspace…" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/65 text-muted-foreground backdrop-blur-xl">
                    {workspaces
                      ?.filter((ws) => ws.id !== workspaceId)
                      .map((ws) => (
                        <SelectItem key={ws.id} value={ws.id}>
                          {ws.name} — {ws.id}
                        </SelectItem>
                      ))}
                    <SelectSeparator />
                    <SelectItem value="__custom__">Custom ID…</SelectItem>
                  </SelectContent>
                </Select>
                {isCustomWorkspaceId && (
                  <Input
                    id="target-workspace"
                    placeholder="Enter workspace ID"
                    value={targetWorkspaceId}
                    onChange={(e) => setTargetWorkspaceId(e.target.value)}
                    className="mt-2 bg-muted/20"
                    autoFocus
                  />
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="justification" className="text-sm font-semibold">
                Justification <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="justification"
                placeholder="Please describe the purpose of this data movement for audit purposes..."
                value={requestJustification}
                onChange={(e) => setRequestJustification(e.target.value)}
                className="min-h-[120px] resize-none bg-muted/20"
                required
              />
              <p className="text-[11px] italic text-muted-foreground">
                All data movement is audited. Providing clear justification
                expedites the approval process.
              </p>
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsRequestDialogOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSubmit}
              variant="accent-filled"
              className="min-w-[140px] rounded-xl"
              disabled={
                !requestJustification.trim() ||
                (transferItems.length > 0 && !targetWorkspaceId.trim())
              }
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx jest selection-basket.test --no-coverage`
Expected: PASS (6 tests)

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors from `selection-basket.tsx` itself. `file-manager-client.tsx` still shows errors from its old `SelectionBasket` usage — resolved in Task 4.

- [ ] **Step 6: Commit**

```bash
git add src/components/file-manager/selection-basket.tsx src/components/file-manager/__tests__/selection-basket.test.tsx
git commit -m "feat(selection-basket): rebuild as a grouped Request queue with combined submit"
```

---

### Task 4: Dock the sidebar next to the file browser and wire the combined submit

**Files:**
- Modify: `src/app/workspaces/[workspaceId]/data/file-manager-client.tsx`

**Interfaces:**
- Consumes: `toggleDownloadItem`, `toggleTransferItem`, `state.downloadBasketItems`, `state.transferBasketItems` (Task 1); `FileGrid`'s `onTransfer`/`transferBasketItems` props (Task 2); `SelectionBasket`'s new prop shape (Task 3).
- Produces: nothing further downstream — this is the integration point.

- [ ] **Step 1: Update the `useFileSystem` destructure**

Replace (around line 72-73):

```ts
    clearBasket,
    selectBasketItem,
```

with:

```ts
    clearBasket,
    toggleDownloadItem,
    toggleTransferItem,
```

- [ ] **Step 2: Replace the basket-item handlers**

Replace:

```ts
  const handleRemoveFromBasket = (itemId: string) => {
    selectBasketItem(itemId, false)
  }
```

with:

```ts
  const handleRemoveDownloadItem = (itemId: string) => {
    toggleDownloadItem(itemId, false)
  }

  const handleRemoveTransferItem = (itemId: string) => {
    toggleTransferItem(itemId, false)
  }
```

- [ ] **Step 3: Replace `handleDownloadRequest`/`handleTransferRequest` with a combined submit handler**

Replace both functions (currently lines 409-473):

```ts
  const handleDownloadRequest = async (
    items: FileSystemItem[],
    justification: string
  ) => {
    try {
      const result = await createDataExtractionRequest({
        title: `Download request for ${items.length} files`,
        description: justification,
        sourceWorkspaceId: workspaceId,
        filePaths: items.map((item) => item.path)
      })

      if (result.error) {
        toast({
          title: 'Request failed',
          ...errorToast(result.error),
          variant: 'destructive'
        })
        return
      }

      toast({
        title: 'Request submitted',
        description: 'Your download request has been submitted for approval.',
        variant: 'default'
      })
      clearBasket()
    } catch (error) {
      console.error('Error submitting download request:', error)
    }
  }

  const handleTransferRequest = async (
    items: FileSystemItem[],
    targetWorkspaceId: string,
    justification: string
  ) => {
    try {
      const result = await createDataTransferRequest({
        title: `Transfer request for ${items.length} files`,
        description: justification,
        sourceWorkspaceId: workspaceId,
        destinationWorkspaceId: targetWorkspaceId,
        filePaths: items.map((item) => item.path)
      })

      if (result.error) {
        toast({
          title: 'Request failed',
          ...errorToast(result.error),
          variant: 'destructive'
        })
        return
      }

      toast({
        title: 'Request submitted',
        description: 'Your transfer request has been submitted for approval.',
        variant: 'default'
      })
      clearBasket()
    } catch (error) {
      console.error('Error submitting transfer request:', error)
    }
  }
```

with:

```ts
  const handleSubmitRequest = async (
    downloadItems: FileSystemItem[],
    transferItems: FileSystemItem[],
    targetWorkspaceId: string,
    justification: string
  ) => {
    let downloadSucceeded = downloadItems.length === 0
    let transferSucceeded = transferItems.length === 0

    if (downloadItems.length > 0) {
      try {
        const result = await createDataExtractionRequest({
          title: `Download request for ${downloadItems.length} files`,
          description: justification,
          sourceWorkspaceId: workspaceId,
          filePaths: downloadItems.map((item) => item.path)
        })

        if (result.error) {
          toast({
            title: 'Download request failed',
            ...errorToast(result.error),
            variant: 'destructive'
          })
        } else {
          downloadSucceeded = true
        }
      } catch (error) {
        console.error('Error submitting download request:', error)
      }
    }

    if (transferItems.length > 0) {
      try {
        const result = await createDataTransferRequest({
          title: `Transfer request for ${transferItems.length} files`,
          description: justification,
          sourceWorkspaceId: workspaceId,
          destinationWorkspaceId: targetWorkspaceId,
          filePaths: transferItems.map((item) => item.path)
        })

        if (result.error) {
          toast({
            title: 'Transfer request failed',
            ...errorToast(result.error),
            variant: 'destructive'
          })
        } else {
          transferSucceeded = true
        }
      } catch (error) {
        console.error('Error submitting transfer request:', error)
      }
    }

    if (downloadSucceeded && transferSucceeded) {
      toast({
        title: 'Request submitted',
        description: 'Your request has been submitted for approval.',
        variant: 'default'
      })
    }

    if (downloadSucceeded) {
      for (const item of downloadItems) toggleDownloadItem(item.id, false)
    }
    if (transferSucceeded) {
      for (const item of transferItems) toggleTransferItem(item.id, false)
    }
  }
```

Note: if both groups are non-empty and both calls fail, this fires two distinct destructive toasts (one per failed action) rather than a single combined message — more informative than guessing at a combined summary, and no test in this plan asserts a single-toast count for that path.

- [ ] **Step 4: Update `handleAddToBasket`, add `handleAddToTransferBasket`**

Replace:

```ts
  const handleAddToBasket = (itemId: string) => {
    selectBasketItem(itemId, true)
  }
```

with:

```ts
  const handleAddToBasket = (itemId: string) => {
    toggleDownloadItem(itemId, true)
  }

  const handleAddToTransferBasket = (itemId: string) => {
    toggleTransferItem(itemId, true)
  }
```

- [ ] **Step 5: Stop tying the store chips' active state and click handler to `showBasket`**

Replace:

```ts
              const isActive = !showBasket && selectedStoreId === storeId
```

with:

```ts
              const isActive = selectedStoreId === storeId
```

Replace:

```ts
                  onClick={() => {
                    if (!isSelectable) return
                    setShowBasket(false)
                    handleSelectStore(storeId)
                  }}
```

with:

```ts
                  onClick={() => {
                    if (!isSelectable) return
                    handleSelectStore(storeId)
                  }}
```

- [ ] **Step 6: Update the "Basket" pill's count**

Replace:

```tsx
            {state.basketItems.length > 0 && (
              <span className="ml-1 text-muted-foreground/70">
                · {state.basketItems.length}
              </span>
            )}
```

with:

```tsx
            {state.downloadBasketItems.length +
              state.transferBasketItems.length >
              0 && (
              <span className="ml-1 text-muted-foreground/70">
                ·{' '}
                {state.downloadBasketItems.length +
                  state.transferBasketItems.length}
              </span>
            )}
```

Also update the `className` condition just above it, which currently reads `state.basketItems.length > 0`, to:

```tsx
              : state.downloadBasketItems.length +
                    state.transferBasketItems.length >
                  0
```

- [ ] **Step 7: Restructure the content panel into a flex row with an optional sidebar**

Replace the whole content-panel block — from `{/* Content panel — full width */}` through its closing `</div>` (currently everything between the top chip row and `{/* Context Menu */}`, i.e. today's lines 584-753) — with:

```tsx
      {/* Content panel — file browser + optional Request queue sidebar */}
      <div className="flex min-h-0 min-w-0 flex-1 gap-2 overflow-hidden">
        <div className="card-glass flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-muted/40 bg-card">
          {selectedStoreId ? (
            <>
              {/* Toolbar row: breadcrumb + actions */}
              <div className="flex h-11 items-center justify-between border-b border-muted/40 px-3">
                <Breadcrumb
                  currentPath={currentPath}
                  onNavigateToFolder={navigateToFolder}
                />

                <div className="flex items-center gap-1">
                  <Button
                    onClick={handleCreateFolder}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-accent"
                  >
                    <FolderPlus className="h-4 w-4" />
                    New folder
                  </Button>
                  <Button
                    onClick={handleImport}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-accent"
                  >
                    <Upload className="h-4 w-4" />
                    Import
                  </Button>
                  <Button
                    onClick={handleImportFolder}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-accent"
                  >
                    <FolderUp className="h-4 w-4" />
                    Upload folder
                  </Button>
                  <input
                    ref={folderInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFolderInputChange}
                    {...({
                      webkitdirectory: '',
                      directory: ''
                    } as React.InputHTMLAttributes<HTMLInputElement>)}
                  />
                </div>
              </div>

              {/* File browser area with drop zone */}
              <div
                className="relative flex min-h-0 flex-1 flex-col overflow-auto"
                onDragOver={handleExternalDragOver}
                onDragLeave={handleExternalDragLeave}
                onDrop={handleExternalDrop}
                onContextMenu={(e) => {
                  if (e.target === e.currentTarget) {
                    handleContextMenu(e, null)
                  }
                }}
              >
                {/* Copy progress overlay */}
                {isCopying && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center rounded-lg bg-background/60 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="text-sm font-medium">Copying…</span>
                    </div>
                  </div>
                )}

                {/* Drop zone overlay */}
                {isDraggingOver && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center rounded-lg border-2 border-dashed border-accent bg-accent/10">
                    <div className="flex flex-col items-center gap-2 text-accent">
                      <Upload className="h-8 w-8" />
                      <span className="text-sm font-medium">
                        Drop files or folders to upload
                      </span>
                    </div>
                  </div>
                )}

                {currentChildren.length === 0 && !loading ? (
                  /* Empty state — full-height dashed dropzone */
                  <div
                    className="m-3 flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 text-muted-foreground"
                    onContextMenu={(e) => handleContextMenu(e, null)}
                  >
                    <Upload className="h-12 w-12 opacity-40" />
                    <div className="text-center">
                      <p className="text-sm font-medium">No files yet</p>
                      <p className="mt-1 text-xs">
                        Drag & drop files or folders here, or click Import to
                        get started
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleImport}>
                      <Upload className="mr-2 h-4 w-4" />
                      Import
                    </Button>
                  </div>
                ) : (
                  <FileGrid
                    items={currentChildren}
                    selectedItems={state.selectedItems}
                    viewMode={state.viewMode}
                    onSelectItem={selectItem}
                    onSelectRange={selectRange}
                    onSelectAll={selectAll}
                    onClearSelection={clearSelection}
                    onNavigateToFolder={navigateToFolder}
                    onMoveItem={moveItem}
                    onDownload={handleAddToBasket}
                    onTransfer={handleAddToTransferBasket}
                    onDelete={handleSmartDelete}
                    onRename={(itemId) => setRenamingItemId(itemId)}
                    basketItems={state.downloadBasketItems}
                    transferBasketItems={state.transferBasketItems}
                    movingItemId={movingItemId}
                    onContextMenu={handleContextMenu}
                    clipboard={state.clipboard}
                    renamingItemId={renamingItemId}
                    onRenameSubmit={(itemId, newName) => {
                      renameItem(itemId, newName)
                      setRenamingItemId(null)
                    }}
                    onRenameCancel={() => setRenamingItemId(null)}
                    parentFolderId={(() => {
                      if (
                        !state.currentFolderId ||
                        state.currentFolderId === 'root'
                      ) {
                        return null
                      }
                      const parentId =
                        state.items[state.currentFolderId]?.parentId
                      return parentId && parentId !== 'root' ? parentId : null
                    })()}
                  />
                )}
              </div>
            </>
          ) : (
            /* No store selected — welcome state */
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-muted-foreground">
              <HardDrive className="h-12 w-12 opacity-40" />
              <div className="text-center">
                <p className="text-sm font-medium">
                  Select a store to browse files
                </p>
                <p className="mt-1 text-xs">Choose a store from the top bar</p>
              </div>
            </div>
          )}
        </div>

        {showBasket && (
          <div className="card-glass flex w-[320px] shrink-0 flex-col overflow-hidden rounded-xl border border-muted/40 bg-card">
            <SelectionBasket
              downloadItems={state.downloadBasketItems
                .map((id) => state.items[id])
                .filter((item): item is FileSystemItem => item !== undefined)}
              transferItems={state.transferBasketItems
                .map((id) => state.items[id])
                .filter((item): item is FileSystemItem => item !== undefined)}
              onRemoveDownloadItem={handleRemoveDownloadItem}
              onRemoveTransferItem={handleRemoveTransferItem}
              onClearSelection={clearBasket}
              onSubmit={handleSubmitRequest}
            />
          </div>
        )}
      </div>
```

- [ ] **Step 8: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 9: Run the full test suite**

Run: `npx jest --no-coverage`
Expected: PASS — all previously-passing tests still pass, plus the new tests from Tasks 1-3.

- [ ] **Step 10: Manual verification (dev server)**

Run: `npm run dev`, open a workspace's data page, and check:
- Selecting a store shows the file browser; clicking the "Basket" pill opens the sidebar **next to** the file browser (both visible at once), not replacing it.
- Clicking "Download" on a file row adds it under the sidebar's "DOWNLOAD" section; clicking "Transfer" on a (different or same) file row adds it under "TRANSFER". The same file can appear in both sections.
- Clicking a file row's "..." button shows Rename and Delete; both still work.
- Switching to a different store while the sidebar is open keeps the sidebar open (no longer force-closes).
- With only download items queued, "Submit request" opens a dialog titled "Request Download Approval" with no workspace picker; entering a justification and confirming submits and clears the download section only.
- With only transfer items queued, the dialog is titled "Request Transfer Approval," shows the workspace picker, and the confirm button stays disabled until both a workspace and justification are provided.
- With both download and transfer items queued, the dialog is titled "Request Download & Transfer Approval" and shows both summaries plus the workspace picker.
- "Clear queue" empties both sections and disables itself when already empty.
- Grid view (toggle view mode if available) shows a Transfer icon overlay next to the Download icon overlay on file tiles.

- [ ] **Step 11: Commit**

```bash
git add src/app/workspaces/\[workspaceId\]/data/file-manager-client.tsx
git commit -m "feat(data-page): dock Request queue sidebar next to the file browser, wire combined submit"
```

---

## Plan self-review notes

- **Spec coverage:** Data model (Task 1), row actions (Task 2), sidebar grouping/copy/dialog (Task 3), layout docking + submit orchestration + store-chip fix (Task 4) all map to the approved design doc section-by-section. Deferred target-workspace-at-submit is preserved (Task 3's dialog, not inline rows).
- **Type consistency check:** `toggleDownloadItem`/`toggleTransferItem` (Task 1) match the names used in Task 4's destructure and handlers. `onTransfer`/`transferBasketItems` (Task 2's `FileGridProps`) match the props passed in Task 4's `<FileGrid>`. `SelectionBasketProps` (Task 3) match the props passed in Task 4's `<SelectionBasket>` exactly (`downloadItems`, `transferItems`, `onRemoveDownloadItem`, `onRemoveTransferItem`, `onClearSelection`, `onSubmit`).
- **No placeholders:** every step has complete code; no "TBD"/"similar to Task N" shortcuts.
