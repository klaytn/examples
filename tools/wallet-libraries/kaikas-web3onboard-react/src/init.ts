import type { Chain } from "@web3-onboard/common";
import injectedModule from "@web3-onboard/injected-wallets";
import type {
  InjectedNameSpace,
  InjectedWalletModule,
} from "@web3-onboard/injected-wallets/dist/types";
import { init } from "@web3-onboard/react";

import kaikas_png from "../public/kaikas.png";
import klaytn_png from "../public/klaytn.png";

const kaikas: InjectedWalletModule = {
  label: "Kaikas",
  injectedNamespace: "klaytn" as InjectedNameSpace,
  checkProviderIdentity: ({ provider }) => Boolean(provider) && Boolean(provider.isKaikas),
  getIcon: async () => kaikas_png.src,
  getInterface: async () => ({ provider: window.klaytn }),
  platforms: ["desktop", "mobile"],
  externalUrl: "https://chromewebstore.google.com/detail/kaikas/jblndlipeogpafnldhgmapagcccfchpi",
};
const injected = injectedModule({ custom: [kaikas] });

const chain: Chain = {
  token: "KLAY",
  icon: klaytn_png.src,
  id: process.env.NEXT_PUBLIC_CHAIN_ID!,
  label: process.env.NEXT_PUBLIC_CHAIN_LABEL,
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
};

init({
  chains: [chain],
  connect: {
    autoConnectLastWallet: true,
  },
  wallets: [injected],
});
