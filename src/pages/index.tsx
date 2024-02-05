// Importing necessary modules and components.
import Head from "next/head"
import Header from "../components/Header"
import apiClientIndex from '../utils/apiClientIndex'
import { useState } from "react"
import { TemplatebackendCreateHelloReply } from "~/internal/client"
import Dashboard from "./dashboard"

/**
 * Home component that represents the main page of the application.
 */
export default function Home() {
  // State variables to store API response and authentication token.
  const [response, setResponse] = useState<TemplatebackendCreateHelloReply>()
  const [token, setToken] = useState<string | null>(null)

  /**
   * Function to fetch data from the API and handle responses.
   */
  const fetchHello = async () => {
    try {
      // Get the authentication token if available.
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('token')
        setToken(storedToken)
      }
      // Check if a token exists and perform actions accordingly.
      if (token) {
        // Handle authenticated user actions here.
      } else {
        // Handle actions for unauthenticated users.
      }
      // Make an API call to retrieve data and update the response state.
      const response = await apiClientIndex.indexServiceGetHello()
      setResponse(response)
    } catch (error) {
      console.error("Error fetching hello: ", error)
    }
  }

  // JSX rendering of the component.
  return (
    <>
      <Head>
        <title>Horus Analytics</title>
        <meta
          name="description"
          content="A web application for Horus Analytics"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className="bg-cover"
        style={{
          height: "100vh",
          backgroundImage:
            "url(" + "https://images.unsplash.com/photo-1519681393784-d120267933ba" + ")",
        }}
      >
        <div className={`overflow-hidden fixed inset-x-0 container h-fit mx-auto px-16 py-4 flex flex-col gap-4 `}>
          <Header />
          <main className="container mx-auto">
            <Dashboard />
          </main>
        </div>
      </div>
    </>
  )
}
