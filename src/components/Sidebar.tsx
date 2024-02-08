import React from "react"
import ProjectList from "./ProjectList"

export default function Sidebar() {

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

  return <>
    <div className="flex flex-col  gap-3">
      <div className="p-5 rounded-xl shadow-sm bg-slate-900 bg-opacity-50 backdrop-blur-sm border-slate-700 border-solid border">
        <h1 className="text-2xl" suppressHydrationWarning>{getCurrentTime()}</h1>
        <p className="text-[12px] suppressHydrationWarning">{getCurrentDate()}</p>
      </div>
      <div className="gap-3 p-5 rounded-xl text-white  border-slate-700 border-solid border bg-slate-900 bg-opacity-50 backdrop-blur-sm h-full">
        <h3 className="text-xl text-white mb-2">My Projects</h3>
        <ProjectList />

      </div>
      <div className="gap-3 p-5 rounded-xl text-white  border-slate-700 border-solid border bg-slate-900 bg-opacity-50 backdrop-blur-sm h-full">
        <h3 className="text-xl text-white mb-2">Services</h3>
        <div className="text-white">GitLab</div>
        <div className="text-white">Sarus</div>
        <div className="text-white">Data Catalog</div>
        <div className="text-white">Kedro</div>
        <div className="text-white">Query</div>
        <div className="text-white">I2B2</div>
      </div>

      <div className="gap-3 p-5 rounded-xl text-white  border-slate-700 border-solid border bg-slate-900 bg-opacity-50 backdrop-blur-sm h-full">

        <h3 className="text-xl text-white mb-2"></h3>
        <div className="text-white">Project Management</div>
        <div className="text-white">Take Tour</div>
        <div className="text-white">Tutorials</div>
      </div>
    </div>
  </>
}