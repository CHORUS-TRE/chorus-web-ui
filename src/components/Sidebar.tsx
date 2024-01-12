import { Sidebar } from 'flowbite-react'
import { useState } from 'react'
import { HiArrowSmRight, HiChartPie, HiShoppingBag, HiUser, HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight } from 'react-icons/hi'

export default function Component() {
  const [showSidebar, setShowSidebar] = useState(false)

  return (
    <div className="flex items-center">
      <div className={`flex-auto w-[35vw] bg-blue-600 text-white  ease-in-out duration-300 ${showSidebar ? "translate-x-0 " : "translate-x-full"
        }`} aria-label="Horus Analytics">
            <h3 className="mt-20 text-4xl font-semibold text-white">sidebar</h3>

        {/* <Sidebar.Logo href="#" img="/favicon.ico" imgAlt="Horus">
          Workbench
        </Sidebar.Logo>
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item href="#" icon={HiChartPie}>
              return to Dashboard
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiUser}>
              Share Workbench
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiShoppingBag}>
              Full Screen
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiArrowSmRight}>
              Sign out
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items> */}
      </div>
      <div className="flex-wrap">
        <button className="p-2 rounded bg-white" onClick={() => setShowSidebar(!showSidebar)}>
          {showSidebar ? <HiOutlineChevronDoubleLeft /> : <HiOutlineChevronDoubleRight />}
        </button>
      </div>
    </div>
  )
}
