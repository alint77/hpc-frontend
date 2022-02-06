import {AuthProvider} from '../context/authContext'
import Layout from '../components/layout'
import LoadingModal from "../components/loadingModal";
import '../styles/globals.css'


function MyApp({ Component, pageProps }) {
  return (
  <AuthProvider>
    
    <LoadingModal>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </LoadingModal>
  </AuthProvider>
  )
}

export default MyApp
