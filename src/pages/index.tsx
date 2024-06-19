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
            {/* <div className="text-[12px]6 mx-auto">
              <div>
                  <img src="https://www.chuv.ch/typo3conf/ext/site_package/Resources/Public/Patternlab/images/chuv.png" alt="CHUV" />
              </div>
            </div> */}
            <div className="text-center">
              <h2 className="mb-3 text-4xl font-extrabold">
                Welcome to <span className="text-[#009933]">CHORUS TRE</span>
              </h2>
              <p className="mb-8 text-lg">
                The Trusted Research Environment of CHUV-UNIL
              </p>
              <h2 className="mb-3">Plots</h2>
              <div className="mb-3 flex gap-3 justify-center ">
                <div className="p-3 w-48 rounded-xl bg-slate-900 bg-opacity-50 backdrop-blur-sm">
                  <h3 className="text-md mb-3">Projects</h3>
                  <p className="text-[12px]">1 collaboration nationale</p>
                  <p className="text-[12px]">7 projets</p>
                </div>
                <div className="p-3 w-48 rounded-xl bg-slate-900 bg-opacity-50 backdrop-blur-sm">
                  <h3 className="text-md mb-3">Data</h3>
                  <p className="text-[12px]">7TB data</p>
                  <p className="text-[12px]">179 data sources</p>
                  <p className="text-[12px]">3700 patients</p>
                  <p className="text-[12px]">7500 features</p>
                </div>

              </div>
              <div className="mb-8 flex gap-3 justify-center ">
                <div className="p-3 w-48 rounded-xl bg-slate-900 bg-opacity-50 backdrop-blur-sm">
                  <h3 className="text-md mb-3">Users</h3>
                  <p className="text-[12px]">100 active users</p>
                  <p className="text-[12px]">150 registered users</p>
                  <p className="text-[12px]">20 administrators</p>
                  <p className="text-[12px]">10 moderators</p>
                </div>
                <div className="p-3 w-48 rounded-xl bg-slate-900 bg-opacity-50 backdrop-blur-sm">
                  <h3 className="text-md mb-3">Compute</h3>
                  <p className="text-[12px]">10 servers</p>
                  <p className="text-[12px]">120 GPUS</p>
                  <p className="text-[12px]">100 GB RAM</p>
                  <p className="text-[12px]">500 GB storage</p>
                </div>
              </div>
              <div className="flex gap-8 mt-16 mb-8 justify-center">
                <div className="">
                  <h2 className="">Why, How and What</h2>
                  <h2 className="">Take the tour</h2>
                  <h2 className="">Tutorials</h2>
                  <h2 className="">Eco Tracker</h2>
                </div>
                <div>
                  <h2 className="">Troubleshooting</h2>
                  <h2 className="">Privacy Policy</h2>
                  <h2 className="">Security</h2>
                  <h2 className="">Instagram, Twitter, FB, LinkedIn, etc.</h2>
                </div>
              </div>
              {/* Button to trigger the fetchHello function */}
              {/* <button onClick={fetchHello}
                className="rounded-lg bg-white bg-opacity-20 py-2 mt-4 px-6 text-lg font-medium hover:bg-opacity-30 cursor-pointer"
              >
                Say hello !
              </button>
              {/* Display the response content from the API */}
              {/* <p className="text-[12px]">{response?.content}</p> */}
            </div>
            <div>
              <h3 className="mb-2 text-md ">
                Live Activity
              </h3>
              <div className="grid grid-cols-8 gap-1">
                <div className=" col-span-1 text-[12px]">Datetime</div>
                <div className=" col-span-1 text-[12px]">User</div>
                <div className=" col-span-1 text-[12px]">Datasource</div>
                <div className=" col-span-1 text-[12px]">Process</div>
                <div className=" col-span-1 text-[12px]">Duration</div>
                <div className=" col-span-1 text-[12px]">CPU</div>
                <div className=" col-span-1 text-[12px]">GPU</div>
                <div className=" col-span-1 text-[12px]">Project</div>

                <div className=" col-span-1 text-[12px]">2024-02-01 13:45:42</div>
                <div className=" col-span-1 text-[12px]">user2</div>
                <div className=" col-span-1 text-[12px]">DB2</div>
                <div className=" col-span-1 text-[12px]">Cleanup</div>
                <div className=" col-span-1 text-[12px]">1:27:08</div>
                <div className=" col-span-1 text-[12px]">87%</div>
                <div className=" col-span-1 text-[12px]">33%</div>
                <div className=" col-span-1 text-[12px]">Project X</div>

                <div className=" col-span-1 text-[12px]">2024-02-08 20:39:42</div>
                <div className=" col-span-1 text-[12px]">user4</div>
                <div className=" col-span-1 text-[12px]">API</div>
                <div className=" col-span-1 text-[12px]">Data Import</div>
                <div className=" col-span-1 text-[12px]">0:36:20</div>
                <div className=" col-span-1 text-[12px]">41%</div>
                <div className=" col-span-1 text-[12px]">82%</div>
                <div className=" col-span-1 text-[12px]">Project Z</div>

                <div className=" col-span-1 text-[12px]">2024-01-17 10:20:42</div>
                <div className=" col-span-1 text-[12px]">user1</div>
                <div className=" col-span-1 text-[12px]">DB2</div>
                <div className=" col-span-1 text-[12px]">Export</div>
                <div className=" col-span-1 text-[12px]">3:15:09</div>
                <div className=" col-span-1 text-[12px]">52%</div>
                <div className=" col-span-1 text-[12px]">67%</div>
                <div className=" col-span-1 text-[12px]">Project Y</div>
              </div>
            </div>
          </div>
        </div>

      </Layout>
    </>
  )
}
