import Sidebar from "~/components/Sidebar"
import Head from "next/head"
import React, { useState } from "react"
import Link from "next/link"

export default function Dashboard() {


  return (
    <div>
      <Head>
        <title>Horus Analytics</title>
        <meta
          name="description"
          content="A web application for Horus Analytics"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div
          className="flex min-h-screen w-full bg-cover
          border-cyan-700 border-solid border-2"
          style={{
            backgroundImage:
              "url(" +
              "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1124&q=100" +
              ")",
          }}
        >
          
          <div className="container mx-auto px-16 flex border-purple-600 border-solid border-2">
            <div className="w-full grid grid-cols-1 gap-4 border-y-lime-700 border-solid border-2">
              <div className="h-32 rounded-lg border">
                <div className="rounded-xl bg-white bg-opacity-10 p-5 backdrop-blur-lg backdrop-filter">Hello </div>

              </div>
              <div className="h-32 rounded-lg border lg:col-span-2">
                <Link href="/workbench" passHref>
                  <span className="px-3 py-1 hover:bg-white hover:bg-opacity-20 rounded cursor-pointer">Workbench</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
