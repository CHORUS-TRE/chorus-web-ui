// Importing necessary modules and components.
import Head from "next/head"
import Header from "../components/Header"
import { cn } from "@/lib/utils"
import { Inter as FontSans } from "next/font/google"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

/**
 * Home component that represents the main page of the application.
 */
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {

  return (
    <>
      <Head>
        <title>Frontend template</title>
        <meta name="description" content="A frontend template based on the T3 app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <div
          className={cn(
            "bg-cover min-h-screen bg-background font-sans antialiased color-red-500",
            fontSans.variable
          )}
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
    </>
  )
}
