import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react';
import { appTheme } from '../styles/theme'

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={appTheme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
