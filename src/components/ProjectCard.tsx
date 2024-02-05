import Link from "next/link"
import React from "react"

import { Dispatch, SetStateAction, useState } from "react"
import { HiArrowSmRight, HiChartPie, HiDotsVertical, HiOutlineFolderOpen, HiUser, HiUserGroup, HiViewGridAdd, HiChatAlt2 } from 'react-icons/hi'
import { Project } from "~/pages/dashboard"

export default function ProjectCard({ project, setShowModal }: { project: Project, setShowModal: Dispatch<SetStateAction<boolean>> }) {
  const [showAppMenu, setShowAppMenu] = useState(false)

  return (
    <div className="flex flex-row gap-8 ">
      <div className="basis-1/3 flex flex-col py-3">
        <div className="flex flex-row gap-4 mb-4">
          <img src={project.logo} />
          <p className="text-md">{project.name}</p>
        </div>

        <div className="mb-4">
          <p className="text-md">{project.institution}</p>
          <p className="text-sm">{project.country}</p>
          <p className="text-sm">{project.owner}</p>
          {/* <p className="text-sm">https://www.chuv.ch/</p> */}
        </div>
        {/* https://www.chuv.ch/
        https://twitter.com/CHUVLausanne
        https://www.instagram.com/chuvlausanne/
        https://www.linkedin.com/company/chuv/ */}
        <div className="flex flex-row gap-4 w-full">
          <div className="flex-grow">
            <p className="text-sm font-bold mb-1">Timeline</p>
            <p className="text-sm">Started: 11.2003</p>
            <p className="text-sm">Ends: 12.2024</p>
          </div>
          <div className="flex-grow">
            <p className="text-sm font-bold mb-1">Data</p>
            <p className="text-sm">Used: 16 Mo</p>
            <p className="text-sm">Total: 32 Go</p>
          </div>
          <div className="flex-grow">
            <p className="text-sm font-bold mb-1">Timeline</p>
            <p className="text-sm">Started: 11.2003</p>
            <p className="text-sm">Ends: 12.2024</p>
          </div>
        </div>
      </div>
      <div className="basis-2/3 flex flex-row gap-4 flex-wrap">
        <div className="w-32 h-32 flex justify-center items-center rounded-xl bg-slate-900 bg-opacity-50 backdrop-blur-sm">
          <Link href="/workbench/files" passHref className="text-center  hover:text-slate-500">
            <HiOutlineFolderOpen className="w-12 h-12" />
            <p className="text-[12px]">Files</p>
          </Link>
        </div>
        <div className="w-32 h-32 flex justify-center items-center rounded-xl bg-slate-900 bg-opacity-50 backdrop-blur-sm">
          <Link legacyBehavior href="#" className="text-center  hover:text-slate-500">
            <a onClick={() => setShowModal(true)} className=" hover:text-slate-500">
              <HiViewGridAdd className="w-12 h-12" />
              <p className="text-[12px]">App Store</p>
            </a>
          </Link>

        </div>
        {/* <div className="w-32 h-32 flex justify-center items-center rounded-xl bg-slate-900 bg-opacity-50 backdrop-blur-sm">
    <Link href="/" passHref className="text-center  hover:text-slate-500">
      <HiFolderAdd className="w-12 h-12" />
      <p className="text-[12px]">Services</p>
    </Link>
  </div> */}
        {project.type !== 'personal' &&
          <div className="w-32 h-32 flex justify-center items-center rounded-xl bg-slate-900 bg-opacity-50 backdrop-blur-sm">
            <Link href="/" passHref className="text-center  hover:text-slate-500">
              <HiUserGroup className="w-12 h-12" />
              <p className="text-[12px]">Members</p>
            </Link>
          </div>
        }
        {/* <div className="w-32 h-32 flex justify-center items-center rounded-xl bg-slate-900 bg-opacity-50 backdrop-blur-sm">
          <Link href="/" passHref className="text-center  hover:text-slate-500">
            <HiChatAlt2 className="w-12 h-12" />
            <p className="text-[12px]">Collaborate</p>
          </Link>
        </div> */}
        <div className="flex flex-row gap-4">
          {project.apps.map((app) =>
            <div className="relative w-32 h-32 flex flex-col justify-center items-center rounded-xl bg-slate-900 bg-opacity-50 backdrop-blur-sm">
              <button onClick={() => (setShowAppMenu(!showAppMenu))}
                className="hover:text-white text-slate-500 absolute top-1 right-1 ">
                <HiDotsVertical />
              </button>
              {showAppMenu &&
                <div className={`absolute left-32 flex-auto
              border-cyan-700 border-solid border-0 rounded-md p-3
              bg-white bg-opacity-30 backdrop-blur-lg backdrop-filter shadow-md
              `} aria-label="Horus Analytics">
                  <ul className="space-y-1">
                    <li>
                      <Link href="/workbench/apps" className="flex items-center gap-2 rounded-lg px-4 py-2  hover:text-slate-400">
                        <HiChartPie />
                        <span className="text-sm font-medium"> Open</span>
                      </Link>
                    </li>
                    <li>
                      <a href="" className="flex items-center gap-2 rounded-lg px-4 py-2 hover:text-slate-400">
                        <HiUser />
                        <span className="text-sm font-medium"> Uninstall </span>
                      </a>
                    </li>
                    <li>
                      <a href="" className="flex items-center gap-2 rounded-lg px-4 py-2 hover:text-slate-400">
                        <HiArrowSmRight />
                        <span className="text-sm font-medium"> Pause </span>
                      </a>
                    </li>
                    <li>
                      <a href="" className="flex items-center gap-2 rounded-lg px-4 py-2 hover:text-slate-400">
                        <HiArrowSmRight />
                        <span className="text-sm font-medium"> Settings </span>
                      </a>
                    </li>

                  </ul>
                </div>}
              <Link href="/workbench/apps" passHref className="text-center  hover:opacity-40">
                <img src={app.icon} className="w-12 h-12 rounded-xl mb-1" />
                <p className="text-[12px]">{app.name}</p>
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>)
}