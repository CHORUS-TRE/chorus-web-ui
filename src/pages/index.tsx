import Head from "next/head";
import Header from "../components/Header";
import apiClientIndex from '../../api/apiClientIndex';
import { useState } from "react";
import { TemplatebackendCreateHelloReply } from "~/internal/client";

export default function Home() {
  const [response, setResponse] = useState<TemplatebackendCreateHelloReply>();

  const fetchHello = async () => {
    try {
      const response = await apiClientIndex.indexServiceGetHello();
      console.log(response);
      setResponse(response);
    } catch (error) {
      console.error("Error fetching hello:", error);
    }
  };
  return (
    <div className=' bg-gradient-to-b from-[#19126c] to-[#15162c] '>

      <Head>
        <title>Frontend template</title>
        <meta name="description" content="A frontend template based on the T3 app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
            <a
              href="https://create.t3.gg/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-white bg-opacity-20 py-2 px-6 text-lg font-medium hover:bg-opacity-30 cursor-pointer"
            >
              What is T3
            </a>

          </div>
          <button onClick={fetchHello}
            className="rounded-lg bg-white bg-opacity-20 py-2 mt-4 px-6 text-lg font-medium hover:bg-opacity-30 cursor-pointer"
          >
            Say hello !
          </button>
          <p>{response?.content}</p>
        </div>
      </main>
    </div>
  );
}
