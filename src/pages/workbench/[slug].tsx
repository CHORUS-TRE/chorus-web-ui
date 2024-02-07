import Sidebar from "~/components/WorkbenchSidebar"
import { useRouter } from 'next/router'

enum WorkbenchType {
  files = "files",
  apps = "apps",
}

export default function Workbench() {
  const router = useRouter()
  const type = router.query.slug
  console.log(router.query.slug)
  return (
    <main className="w-screen h-screen flex items-center border-yellow-400 border-solid border-0 overflow-hidden">
      <Sidebar />
      {type === WorkbenchType.files && <img src="/workbench-filemanager-placeholder.jpg" alt="workbench" className="w-full  h-full" />}
      {type === WorkbenchType.apps && <img src="/workbench-placeholder-1383-837.png" alt="workbench" className="w-full h-full" />}

      {/* <iframe width="100%" className="w-screen h-screen" src="http://10.241.147.130:10000/" title="Workbench" allow="clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe> */}a
    </main>
  )
}
