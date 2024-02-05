// Importing necessary modules and components.
import Head from "next/head";
import Header from "../components/Header";
import apiClientIndex from '../utils/apiClientIndex';
import { useState } from "react";
import { TemplatebackendCreateHelloReply } from "~/internal/client";

/**
 * Home component that represents the main page of the application.
 */
export default function Home() {
  // State variables to store API response and authentication token.
  const [response, setResponse] = useState<TemplatebackendCreateHelloReply>();
  const [token, setToken] = useState<string | null>(null);

  /**
   * Function to fetch data from the API and handle responses.
   */
  const fetchHello = async () => {
    try {
      // Get the authentication token if available.
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
      }
      // Check if a token exists and perform actions accordingly.
      if (token) {
        // Handle authenticated user actions here.
      } else {
        // Handle actions for unauthenticated users.
      }
      // Make an API call to retrieve data and update the response state.
      const response = await apiClientIndex.indexServiceGetHello();
      setResponse(response);
    } catch (error) {
      console.error("Error fetching hello: ", error);
    }
  };

  // JSX rendering of the component.
  return (
    <div className=' bg-gradient-to-b from-[#19126c] to-[#15162c] '>
      {/* Head section for metadata and title */}
      <Head>
        <title>Horus Analytics</title>
        <meta
          name="description"
          content="A web application for Horus Analytics"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Header component */}
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center text-white">
        <div className="text-center">
          <h2 className="mb-4 text-4xl font-extrabold">
            Welcome to <span className="text-green-300">The Frontend App</span>
          </h2>
          <p className="mb-8 text-lg">
            A modern template using T3: Tailwind CSS, Next.js, and TypeScript.
          </p>
          <div className="flex flex-wrap justify-center">
            {/* Button to link to T3 information */}
            <a
              href="https://create.t3.gg/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-white bg-opacity-20 py-2 px-6 text-lg font-medium hover:bg-opacity-30 cursor-pointer"
            >
              What is T3
            </a>
          </div>
          {/* Button to trigger the fetchHello function */}
          <button onClick={fetchHello}
            className="rounded-lg bg-white bg-opacity-20 py-2 mt-4 px-6 text-lg font-medium hover:bg-opacity-30 cursor-pointer"
          >
            Say hello !
          </button>
          {/* Display the response content from the API */}
          <p className="mt-4">{response?.content}</p>
        </div>
      </main>
    </div>
  )
}
