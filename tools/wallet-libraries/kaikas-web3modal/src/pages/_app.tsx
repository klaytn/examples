import "@/styles/globals.css";
import type { AppProps } from "next/app";

import Web3ModalProvider from "@/contexts/Web3ModalProvider";
import NoSsr from "@/components/NoSsr";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NoSsr>
      <Web3ModalProvider>
        <Component {...pageProps} />
      </Web3ModalProvider>
    </NoSsr>
  );
}
