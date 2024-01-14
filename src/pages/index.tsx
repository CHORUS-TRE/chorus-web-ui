import Sidebar from "~/components/Sidebar"
import Head from "next/head"
import React, { useState } from "react"

export default function Home() {


  return (
    <div>
      <Head>
        <title>Frontend template</title>
        <meta
          name="description"
          content="A frontend template based on the T3 app"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-screen h-screen flex items-center border-yellow-400 border-solid border-0 overflow-hidden">
        <Sidebar />

        <img src="/workbench-placeholder-1024-1024.jpg" alt="workbench" className="w-full  h-full" />
        
        {/* <iframe width="100%" className="w-screen h-screen" src="http://10.241.147.130:10000/" title="Workbench" allow="clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe> */}
      </main>
    </div>
  )
}
