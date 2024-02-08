// Importing necessary modules and components.
import Head from "next/head"
import apiClientIndex from '../utils/apiClientIndex'
import { useState } from "react"
import { TemplatebackendCreateHelloReply } from "~/internal/client"
import Layout from "../components/Layout"

export default function Home() {
  // State variables to store API response and authentication token.
  const [response, setResponse] = useState<TemplatebackendCreateHelloReply>()

  const fetchHello = async () => {
    try {
      // Make an API call to retrieve data and update the response state.
      const response = await apiClientIndex.indexServiceGetHello()
      setResponse(response)
    } catch (error) {
      console.error("Error fetching hello: ", error)
    }
  }

  return (
    <>
      {/* Head section for metadata and title */}
      <Head>
        <title>Frontend template</title>
        <meta name="description" content="A frontend template based on the T3 app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="flex justify-center  p-2 w-full h-full rounded-xl shadow-sm bg-slate-900 bg-opacity-50 backdrop-blur-sm border-slate-700 border-solid border">
          <div className=" flex p-5 flex-col justify-center text-white ">
            <div className="text-center">
              <h2 className="mb-4 text-4xl font-extrabold">
                Welcome to <span className="text-green-300">HORUS Analytics</span>
              </h2>
              <p className="mb-8 text-lg">
                The Trusted Research Environment of CHUV-UNIL
              </p>
              {/* Button to trigger the fetchHello function */}
              <button onClick={fetchHello}
                className="rounded-lg bg-white bg-opacity-20 py-2 mt-4 px-6 text-lg font-medium hover:bg-opacity-30 cursor-pointer"
              >
                Say hello !
              </button>
              {/* Display the response content from the API */}
              <p className="mt-4">{response?.content}</p>
            </div>
          </div>
        </div>

      </Layout>
    </>
  )
}
