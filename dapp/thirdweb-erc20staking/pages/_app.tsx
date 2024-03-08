import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { KlaytnCypress} from "@thirdweb-dev/chains";
import "../styles/globals.css";
import NavBar from "../components/NavBar/NavBar";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      activeChain={KlaytnCypress}
    >
      <NavBar />
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
