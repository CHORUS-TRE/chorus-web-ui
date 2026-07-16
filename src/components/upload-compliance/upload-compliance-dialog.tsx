'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  UPLOAD_COMPLIANCE_STATEMENT,
  type UploadComplianceStatement
} from '@/domain/model/upload-compliance'

const VISIBLE_FILE_LIMIT = 20

interface UploadComplianceDialogProps {
  open: boolean
  fileNames: string[]
  onCancel: () => void
  onConfirm: () => void
  statement?: UploadComplianceStatement
}

export function UploadComplianceDialog({
  open,
  fileNames,
  onCancel,
  onConfirm,
  statement = UPLOAD_COMPLIANCE_STATEMENT
}: UploadComplianceDialogProps) {
  const [checkedItems, setCheckedItems] = useState<boolean[]>([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    if (open) {
      setCheckedItems(statement.items.map(() => false))
      setShowAll(false)
    }
  }, [open, statement])

  const allChecked =
    checkedItems.length === statement.items.length &&
    checkedItems.every(Boolean)
  const visibleNames = showAll
    ? fileNames
    : fileNames.slice(0, VISIBLE_FILE_LIMIT)
  const hiddenCount = fileNames.length - visibleNames.length

  return (
    <Dialog open={open} onOpenChange={() => undefined}>
      <DialogContent
        hideClose
        className="max-h-[85vh] max-w-2xl overflow-y-auto"
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Confirm data upload</DialogTitle>
          <DialogDescription>
            Review the files and acknowledge each statement before uploading.
          </DialogDescription>
        </DialogHeader>

        <section aria-labelledby="upload-file-summary">
          <h3 id="upload-file-summary" className="text-sm font-medium">
            {fileNames.length} {fileNames.length === 1 ? 'file' : 'files'} to
            upload
          </h3>
          <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto rounded-md border bg-muted/20 p-3 text-sm">
            {visibleNames.map((name, index) => (
              <li key={`${name}-${index}`} className="break-all">
                {name}
              </li>
            ))}
            {hiddenCount > 0 && (
              <li className="text-muted-foreground">
                … and {hiddenCount} more
              </li>
            )}
          </ul>
          {fileNames.length > VISIBLE_FILE_LIMIT && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-1 px-1"
              aria-expanded={showAll}
              onClick={() => setShowAll((value) => !value)}
            >
              {showAll ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              {showAll ? 'Show less' : 'Show all'}
            </Button>
          )}
        </section>

        <section aria-labelledby="upload-compliance-statement">
          <h3 id="upload-compliance-statement" className="text-sm font-medium">
            {statement.intro}
          </h3>
          <div className="mt-3 space-y-3">
            {statement.items.map((item, index) => (
              <label
                key={item}
                className="flex cursor-pointer items-start gap-3 text-sm leading-5"
              >
                <Checkbox
                  checked={checkedItems[index] ?? false}
                  aria-label={item}
                  onCheckedChange={(checked) =>
                    setCheckedItems((current) => {
                      const next = [...current]
                      next[index] = checked === true
                      return next
                    })
                  }
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </section>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!allChecked}
            aria-disabled={!allChecked}
            onClick={onConfirm}
          >
            Confirm upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
