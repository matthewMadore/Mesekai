import '../styles/globals.css'
import 'antd/dist/antd.css';
import { SessionProvider } from "next-auth/react"

function MyApp({
    Component,
    pageProps: { session, ...pageProps },
  }) {
    return (
        <SessionProvider session={pageProps.session}>
            <Component {...pageProps} />
        </SessionProvider>
     )
}

export default MyApp
