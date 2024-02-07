// Importing necessary modules and components.
import Head from "next/head"
import Header from "../components/Header"

/**
 * Home component that represents the main page of the application.
 */
export default function Layout({ children }: { children: React.ReactNode }) {

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
            {children}
          </main>
          <footer className="text-center text-white"></footer>
        </div>
      </div>
    </>
  )
}
