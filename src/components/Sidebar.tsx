import { useState } from 'react'
import { HiArrowSmRight, HiChartPie, HiUser, HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight } from 'react-icons/hi'

export default function Component() {
  const [showSidebar, setShowSidebar] = useState(true)

  return (
    <div
      className={`absolute flex items-center 
      transform transition-transform ${showSidebar ? "translate-x-0" : "-translate-x-[calc(100%-2rem)]"}
      border-yellow-400 border-solid border-0`}
    >
      <div className={`flex-auto 
        border-cyan-700 border-solid border-0 rounded-md p-3
        bg-white bg-opacity-30 backdrop-blur-lg backdrop-filter shadow-md
        `} aria-label="Horus Analytics">
        <ul className="space-y-1">
  <li>
    <a href="" className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700">
      <HiChartPie />
      <span className="text-sm font-medium"> Dashboard </span>
    </a>
  </li>
  <li>
    <a href="" className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700">
      <HiUser />
      <span className="text-sm font-medium"> Share </span>
    </a>
  </li>
  <li>
    <a href="" className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700">
      <HiArrowSmRight />
      <span className="text-sm font-medium"> Logout </span>
    </a>
  </li>
</ul>
</div>
      <div className="flex-wrap">
        <button className="p-1 ml-1 bg-neutral-900 text-white
          bg-opacity-60 backdrop-blur-lg backdrop-filter
          rounded" onClick={() => setShowSidebar(!showSidebar)}>
          {showSidebar ? <HiOutlineChevronDoubleLeft /> : <HiOutlineChevronDoubleRight />}
        </button>
      </div>
    </div>
  )
}
