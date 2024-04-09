import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { PropsWithChildren } from "react";
import { HttpTransport } from "viem";
import { State, WagmiProvider, cookieStorage, createConfig, createStorage, http } from "wagmi";
import { klaytn, klaytnBaobab } from "wagmi/chains";
import { injected } from "wagmi/connectors";

import kaikas_png from "../../public/kaikas.png";

const kaikas_connector = injected({
  target: {
    id: "kaikas",
    name: "Kaikas",
    icon: kaikas_png.src,
    provider(window) {
      return (window as any)?.klaytn;
    },
  },
  shimDisconnect: true,
});

function WagmiConfig() {
  const chain_id = process.env.NEXT_PUBLIC_CHAIN_ID;
  let chain;
  let transports = {} as Record<1001 | 8217, HttpTransport>;
  if (chain_id === "1001") {
    chain = klaytnBaobab;
    transports[1001] = http();
  } else {
    chain = klaytn;
    transports[8217] = http();
  }
  const wagmi_config = createConfig({
    chains: [chain],
    connectors: [kaikas_connector],
    storage: createStorage({
      storage: cookieStorage,
    }),
    transports,
  });
  return wagmi_config;
}
const wagmi_config = WagmiConfig();

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!;
createWeb3Modal({
  wagmiConfig: wagmi_config,
  projectId,
  allWallets: "HIDE",
});

const query_client = new QueryClient();

export default function Web3ModalProvider({
  children,
  initialState,
}: PropsWithChildren<{
  initialState?: State;
}>) {
  return (
    <WagmiProvider config={wagmi_config} initialState={initialState}>
      <QueryClientProvider client={query_client}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
