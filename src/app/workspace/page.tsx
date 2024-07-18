import React from 'react'
import { Workspace } from '@/components/workspace'

const WorkspacePage = () => {
  return (
    <div className="workspace-page">
      <main>
        <Workspace />
      </main>
      <footer>{/* Footer content */}</footer>
    </div>
  )
}

export default WorkspacePage
