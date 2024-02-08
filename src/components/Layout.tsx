// Importing necessary modules and components.
import Head from "next/head"
import Header from "../components/Header"

/**
 * Home component that represents the main page of the application.
 */
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {

  return (
    <div
      className="bg-cover"
      style={{
        height: "100vh",
        backgroundImage:
          "url(" + "https://images.unsplash.com/photo-1519681393784-d120267933ba" + ")",
      }}
    >
      <div className={`overflow-hidden fixed inset-x-0 container h-full mx-auto px-16 py-4 flex flex-col gap-3`}>
        <Header />
        <main className="container mx-auto h-full">
          {children}
        </main>
        <footer className="text-center text-white"></footer>
      </div>
    </div>
  )
}
