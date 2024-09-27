'use client'

// import { WorkbenchCreateForm } from './forms/workbench-forms'
import { Button } from './ui/button'
import { useNavigation } from './navigation-context'

export default function RightSidebar({ show }: { show?: boolean }) {
  const { showRightSidebar, toggleRightSidebar } = useNavigation()

  return (
    <div
      className={`fixed right-0 top-0 z-50 h-full w-[35vw] bg-slate-100 p-10 pl-20 text-white duration-300 ease-in-out ${
        showRightSidebar ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <Button onClick={toggleRightSidebar} className="absolute right-5 top-16">
        {showRightSidebar ? 'Close' : 'Open'}
      </Button>
    </div>
  )
}
