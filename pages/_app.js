import '../styles/index.css'
import {AuthProvider} from '../context/authContext'
import Layout from '../components/layout'
import LoadingModal from "../components/loadingModal";


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
