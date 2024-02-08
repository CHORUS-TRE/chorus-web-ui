import React, { useState, useEffect } from "react"
import { HiDatabase, HiOutlineGlobe, HiOutlineTrendingDown, HiOutlineTrendingUp, HiOutlineWifi, HiUserGroup, HiViewGridAdd } from 'react-icons/hi'

export default function SidebarWidgets() {
  
 
  return (
    <div className="text-white basis-1/4 flex flex-col gap-4">

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
  )
}