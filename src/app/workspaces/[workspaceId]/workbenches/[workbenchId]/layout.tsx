import { Sidebar } from '~/components/sidebar'
import WorkbenchZHandler from '~/components/workbench-z-handler'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Sidebar />
      <WorkbenchZHandler />
      {children}
    </>
  )
}
