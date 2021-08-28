import type { AppProps } from 'next/app'
import 'lib/tailwind.css'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
export default MyApp
