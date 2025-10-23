import { ChevronRight } from 'lucide-react'

import { Button } from '~/components/button'

interface BreadcrumbProps {
  currentPath: { id: string; name: string }[]
  onNavigateToFolder: (folderId: string) => void
}

export function Breadcrumb({
  currentPath,
  onNavigateToFolder
}: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-1 border-b border-muted/40 p-4">
      {currentPath.map((item, index) => (
        <div key={item.id} className="flex items-center gap-1">
          <Button
            variant="link"
            onClick={() => onNavigateToFolder(item.id)}
            className="h-8 px-2 text-sm"
          >
            {item.name}
          </Button>
          {index < currentPath.length - 1 && (
            <ChevronRight className="h-4 w-4 text-muted" />
          )}
        </div>
      ))}
    </div>
  )
}
