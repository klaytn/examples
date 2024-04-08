import { useConnectWallet } from "@web3-onboard/react";
import { HTMLProps, useCallback } from "react";

import logger from "../logger";

export default function ConnectWalletBtn({
  className,
  ...props
}: Omit<HTMLProps<HTMLButtonElement>, "disabled" | "onClick" | "type">) {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  const safeConnect = useCallback(async () => {
    if (wallet) return;
    try {
      await connect();
    } catch (e) {
      logger.error(e);
    }
  }, [connect, wallet]);

  const safeDisconnect = useCallback(async () => {
    if (!wallet) return;
    try {
      await disconnect(wallet);
    } catch (e) {
      logger.error(e);
    }
  }, [disconnect, wallet]);

  return (
    <button
      className={`btn-kaikas ${className}`}
      disabled={connecting}
      onClick={() => (wallet ? safeDisconnect() : safeConnect())}
      {...props}
    >
      {connecting ? "Connecting..." : wallet ? "Disconnect" : "Connect Wallet"}
    </button>
  );
}
