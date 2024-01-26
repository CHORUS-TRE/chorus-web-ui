import { type AppType } from "next/app";
import "../styles/globals.css";
import { AuthProvider } from '../components/AuthContext';

const MyApp: AppType = ({ Component, pageProps }) => {
  return <AuthProvider>
    <Component {...pageProps} />
  </AuthProvider>;
};

export default MyApp;
