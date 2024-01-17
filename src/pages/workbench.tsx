import Sidebar from "~/components/WorkbenchSidebar"

export default function Workbench() {
  return (
    <main className="w-screen h-screen flex items-center border-yellow-400 border-solid border-0 overflow-hidden">
      <Sidebar />
      <img src="/workbench-placeholder-1024-1024.jpg" alt="workbench" className="w-full  h-full" />
      {/* <iframe width="100%" className="w-screen h-screen" src="http://10.241.147.130:10000/" title="Workbench" allow="clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe> */}a
    </main>
  )
}
