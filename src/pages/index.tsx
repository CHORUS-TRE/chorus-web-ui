import Head from "next/head"
import React, { useState } from "react"
import Dashboard from "./dashboard";

export default function Home() {


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

      <Dashboard />
       
    </div>
  )
}
