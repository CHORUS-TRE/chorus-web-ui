import { type AppType } from "next/app"
import "../styles/globals.css"
import { AuthProvider } from '../components/AuthContext'
import Layout from "../components/Layout"
import { Head } from "next/document"


// MyApp component acts as the root component for all pages in the Next.js application
const MyApp: AppType = ({ Component, pageProps }) => {
  // Wraps all page components with the AuthProvider context to provide authentication state
  return (
    <AuthProvider>
      {/* Layout for the whole app */}
      <Layout>
        {/* Component represents the active page, and pageProps contains its props */}
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  )
}

export default MyApp
