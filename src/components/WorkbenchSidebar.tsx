import Link from 'next/link'
import { useState } from 'react'
import { HiFilm, HiArrowsExpand, HiChartPie, HiLogout, HiOutlineUsers, HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight } from 'react-icons/hi'

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
        bg-white bg-opacity-70 backdrop-blur-lg backdrop-filter shadow-md
        `} aria-label="Horus Analytics">
        <h1 className='text-md  mb-2 text-gray-800'>Jupyter</h1>
        <p className='text-xs mb-2 text-gray-800'>CHUV - Manuel Spuhler</p>
        <hr />
        <ul className="space-y-1 mt-2">
          <li>
            <Link href="/" className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700">
              <HiChartPie />
              <span className="text-sm font-medium"> Return to Dashboard </span>
            </Link>
            <hr />
          </li>
          <li>
            <a href="" className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700">
              <HiOutlineUsers />
              <span className="text-sm font-medium"> Collaborate </span>
            </a>
          </li>
          <li>
            <a href="" className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700">
              <HiArrowsExpand />
              <span className="text-sm font-medium"> Fullscreen </span>
            </a>
          </li>
          <li>
            <a href="" className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700">
              <HiFilm />
              <span className="text-sm font-medium"> Screenshot </span>
            </a>
          </li>
          <li>
            <a href="" className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700">
              <HiLogout />
              <span className="text-sm font-medium"> Logout </span>
            </a>
          </li>
        </ul>
      </div>
      <div className="flex-wrap">
        <button className="p-1 ml-1 bg-green-400 text-white
          bg-opacity-60 backdrop-blur-lg backdrop-filter
          rounded" onClick={() => setShowSidebar(!showSidebar)}>
          {showSidebar ? <HiOutlineChevronDoubleLeft /> : <HiOutlineChevronDoubleRight />}
        </button>
      </div>
    </div>
  )
}
