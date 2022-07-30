import '../styles/index.css'
import "@material-tailwind/react/tailwind.css";
import { AuthProvider } from '../context/authContext'
import DefaultLayout from '../components/layout'
import LoadingModal from "../components/loadingModal";
import Head from 'next/head';
import { useEffect } from 'react';




function MyApp({ Component, pageProps }) {
  const Layout = Component.Layout || DefaultLayout
  useEffect(()=>{document.title="ابر نوشیروانی"})
  return (
    <AuthProvider>
      <Head>
        {/* <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css"
          integrity="sha512-HK5fgLBL+xu6dm/Ii3z4xhlSUyZgTT9tuc/hSrtw6uzJOvgRr2a9jyxxT1ely+B+xFAmJKVSTbpM/CuL7qxO8w=="
          crossOrigin="anonymous"
        /> */}
        
      </Head>

      <LoadingModal>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </LoadingModal>
    </AuthProvider>
  )
}
export default MyApp

