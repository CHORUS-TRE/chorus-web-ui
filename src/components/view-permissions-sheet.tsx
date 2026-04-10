'use client'

import { Eye } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/button'
import { PermissionMatrix } from '@/components/permission-matrix'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'

interface ViewPermissionsSheetProps {
  userName: string
  roleNames: string[]
  scopeFilter?: 'platform' | 'workspace' | 'session' | 'all'
}

export function ViewPermissionsSheet({
  userName,
  roleNames,
  scopeFilter = 'workspace'
}: ViewPermissionsSheetProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-xs text-muted-foreground hover:text-primary"
        >
          <Eye className="h-3 w-3" />
          View permissions
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[500px] overflow-y-auto sm:max-w-lg"
      >
        <SheetHeader>
          <SheetTitle>Permissions for {userName}</SheetTitle>
          <SheetDescription>
            Resolved permission matrix based on assigned roles:{' '}
            {roleNames.join(', ')}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <PermissionMatrix
            roleNames={roleNames}
            scopeFilter={scopeFilter}
            readOnly={true}
            highlightInherited={true}
            compact={true}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
