import { ChevronRight } from 'lucide-react'
import { useParams } from 'next/navigation'

import { useAppState } from '@/stores/app-state-store'
import { Button } from '~/components/button'

interface BreadcrumbProps {
  currentPath: { id: string; name: string }[]
  onNavigateToFolder: (folderId: string) => void
}

export function Breadcrumb({
  currentPath,
  onNavigateToFolder
}: BreadcrumbProps) {
  const params = useParams<{ sessionId?: string }>()
  const { workbenches } = useAppState()

  const sessionName = workbenches?.find((w) => w.id === params.sessionId)?.name

  // Filter out the session name from the breadcrumb as it is already shown in the header pill
  const filteredPath = currentPath.filter((item) => item.name !== sessionName)

  return (
    <div className="flex items-center gap-1 border-b border-muted/40 p-4 text-muted-foreground">
      {filteredPath.map((item, index) => (
        <div key={item.id} className="flex items-center gap-1">
          <Button
            variant="link"
            onClick={() => onNavigateToFolder(item.id)}
            className="h-8 px-2 text-sm text-muted-foreground"
          >
            {item.name}
          </Button>
          {index < filteredPath.length - 1 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      ))}
    </div>
  )
}
