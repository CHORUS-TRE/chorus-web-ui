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

      <main className="w-screen h-screen">
        <nav className="absolute top-1/2"><Sidebar /></nav>

        <iframe width="100%" className="w-screen h-screen" src="http://10.241.147.130:10000/" title="Workbench" allow="clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
      </main>
    </div>
  )
}
