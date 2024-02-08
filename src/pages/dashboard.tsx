'use client'

import Link from "next/link"
import React, { useState, useEffect } from "react"
import { HiDatabase, HiOutlineGlobe, HiOutlineTrendingDown, HiOutlineTrendingUp, HiOutlineWifi, HiUserGroup, HiViewGridAdd } from 'react-icons/hi'
import AppStore from "../components/AppStore"
import ProjectCard from "../components/ProjectCard"
import Layout from "~/components/Layout"

export interface Project {
  name: string
  owner: string
  institution: string
  country: string
  logo?: string
  apps: {
    name: string
    icon?: string
    status?: string
    mod: number
  }[]
  type?: "personal" | "project"
}

const myProject: Project = {
  name: 'Biomedical Data Science Center',
  owner: 'Manuel Spuhler',
  institution: 'Centre Hospitalier Universitaire de Lausanne (CHUV)',
  country: 'Lausanne, Switzerland',
  logo: '/chuv.png',
  type: 'personal',
  apps: [
    {
      name: 'Jupyter',
      icon: '/jupyter.png',
      status: 'running',
      mod: 777
    },
    {
      name: 'RStudio',
      icon: '/rstudio.png',
      status: 'running',
      mod: 760
    }
  ]
}

const projects: Project[] = [
  {
    name: 'Integrated analysis of tumor vessels and immune cells in glioblastoma',
    owner: 'Pr. Jean-François Tliuageqwf',
    institution: 'Centre Hospitalier Universitaire de Lausanne (CHUV)',
    country: 'Lausanne, Switzerland',
    logo: '/chuv.png',
    apps: [
      {
        name: 'Jupyter',
        icon: '/jupyter.png',
        status: 'running',
        mod: 777
      },
      {
        name: 'RStudio',
        icon: '/rstudio.png',
        status: 'running',
        mod: 760
      }
    ]
  }, {
    name: 'Hypnosis-aided awake craniotomy versus monitored anesthesia care for brain tumors (HAMAC Study)',
    owner: 'Pr. Jean-François Dufour',
    institution: 'Centre Hospitalier Universitaire de Lausanne (CHUV)',
    country: 'Lausanne, Switzerland',
    logo: '/chuv.png',
    apps: [
      {
        name: 'Jupyter',
        icon: '/jupyter.png',
        status: 'running',
        mod: 777
      },
      {
        name: 'RStudio',
        icon: '/rstudio.png',
        status: 'running',
        mod: 760
      }
    ]
  }, {
    name: 'Hypnosis-aided awake craniotomy versus monitored anesthesia care for brain tumors (HAMAC Study)',
    owner: 'Pr. Jean-François Dufour',
    institution: 'Centre Hospitalier Universitaire de Lausanne (CHUV)',
    country: 'Lausanne, Switzerland',
    logo: '/chuv.png',
    apps: [
      {
        name: 'Jupyter',
        icon: '/jupyter.png',
        status: 'running',
        mod: 777
      },
      {
        name: 'RStudio',
        icon: '/rstudio.png',
        status: 'running',
        mod: 760
      }
    ]
  }
]

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    document.body.classList.add('body-fixed')
    return () => {
      document.body.classList.remove('body-fixed')
    }
  }, [])

  const getCurrentTime = () => new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const getCurrentDate = () => new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <Layout>
      {showModal && <div className="p-5 h-full w-fit rounded-xl mx-auto absolute bg-white z-50 "><AppStore setShowModal={setShowModal} /></div>}
      <div className="container flex gap-4">
        <div className="text-white basis-1/4 flex flex-col gap-4">
          <div className="p-5 rounded-xl shadow-sm bg-slate-900 bg-opacity-50 backdrop-blur-sm border-slate-700 border-solid border">
            <h1 className="text-2xl" suppressHydrationWarning>{getCurrentTime()}</h1>
            <p className="text-[12px] suppressHydrationWarning">{getCurrentDate()}</p>
          </div>
          <div className="p-5 rounded-xl shadow-sm bg-slate-900 bg-opacity-50 backdrop-blur-sm border-slate-700 border-solid border">
            <h2 className="text-md mb-3">Eco Tracker</h2>
            <div className="flex flex-row gap-4 items-center">
              <HiOutlineGlobe className="h-20 w-20" />
              <div className="flex flex-col">
                <p className="text-[12px]">Carbon Emissions: 0.5kg</p>
                <p className="text-[12px]">Energy Consumption: 0.5kg</p>
                <p className="text-[12px]">Emissions Over Time: +10%</p>
                <p className="text-[12px]">Comparison to Average: -25%</p>
              </div>
            </div>
          </div>
          <div className="p-5 rounded-xl shadow-sm bg-slate-900 bg-opacity-50 backdrop-blur-sm border-slate-700 border-solid border">
            <h2 className="text-md  mb-3">System Status</h2>
            <div className="flex flex-row gap-16">
              <div className="flex flex-col">
                <HiOutlineTrendingUp className="h-20 w-20" />
                <p className="text-[12px] text-center">RAM: 32Mo</p>
              </div>
              <div className="flex flex-col">
                <HiOutlineTrendingDown className="h-20 w-20" />
                <p className="text-[12px] text-center">GPU: 58%</p>
              </div>
            </div>
          </div>
          <div className="p-5 rounded-xl shadow-sm bg-slate-900 bg-opacity-50 backdrop-blur-sm border-slate-700 border-solid border">
            <h2 className="text-md mb-3">Storage</h2>
            <div className="flex flex-row gap-4 items-center">
              <HiDatabase className="h-20 w-20" />
              <div className="flex flex-col">
                <p className="text-[12px]">Used: 17Mo</p>
                <p className="text-[12px]">Total: 10Go</p>
              </div>
            </div>
          </div>
          <div className="p-5 rounded-xl shadow-sm bg-slate-900 bg-opacity-50 backdrop-blur-sm border-slate-700 border-solid border">
            <h2 className="text-md mb-3">Network</h2>
            <HiOutlineWifi className="h-20 w-20" />
          </div>
        </div>
        <div className="flex flex-col gap-4 basis-3/4 overflow-y-scroll h-screen">
          {/* <div className="flex flex-row gap-4">
                <div className="basis-1/2 p-5 rounded-xl text-white bg-slate-900 bg-opacity-50 backdrop-blur-sm border-slate-700 border-solid border">
                  <h2 className="mb-3">Important Announcement</h2>
                  <p className="text-[12px]">The first draft of anything is shit.
                    Good design is not a function of talent, but number of iterations.
                    What most companies with well-designed products have in common is that they experiment continuously.</p>
                  <button className="bg-sky-500 hover:bg-sky-700 rounded px-2 py-1 text-[12px] float-right">
                    More...
                  </button>
                </div>
                <div className="basis-1/2 p-5 rounded-xl text-white bg-slate-900 bg-opacity-50 backdrop-blur-sm border-slate-700 border-solid border">
                  <h2 className="mb-3">CHUV Research Days 2024</h2>
                  <p className="text-[12px]">And I will strike down upon thee with great vengeance and furious anger those who attempt to poison and destroy my brothers. And you will know my name is the Lord when I lay my vengeance upon thee.</p>
                  <button className="bg-sky-500 hover:bg-sky-700 rounded px-2 py-1 text-[12px] float-right">
                    More...
                  </button>
                </div>
              </div> */}
          <div className="gap-4 p-5 rounded-xl text-white  border-slate-700 border-solid border bg-slate-900 bg-opacity-50 backdrop-blur-sm">
            <h3 className="text-xl text-white mb-2">Personal Workspace</h3>
            <ProjectCard key={'personal'} setShowModal={setShowModal} project={myProject} />
          </div>
          <div className="gap-8 p-5 rounded-xl text-white  border-slate-700 border-solid border bg-slate-900 bg-opacity-50 backdrop-blur-sm">
            <h3 className="text-xl text-white mb-2">Projects</h3>
            <div className="mb-8"><ProjectCard key={'project-0'} setShowModal={setShowModal} project={projects[0]!} /></div>
            <div className="overflow-y-auto flex flex-col gap-8 mb-32">
              {projects.map((project, index) => (
                <div className="text-white" key={project.name}><ProjectCard setShowModal={setShowModal} project={project} /></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}