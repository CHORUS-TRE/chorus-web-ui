// Component Explorer Page - Showcase all research components
import { ComponentExplorer } from '@/components/explorer/component-explorer'

export default function ComponentExplorerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto py-8">
        <ComponentExplorer />
      </div>
    </div>
  )
}
