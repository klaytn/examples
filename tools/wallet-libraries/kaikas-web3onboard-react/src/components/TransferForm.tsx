import { useConnectWallet } from "@web3-onboard/react";
import { BrowserProvider, JsonRpcSigner, TransactionResponse, parseEther } from "ethers";
import { FormEventHandler, useCallback, useState } from "react";

import logger from "../logger";
import { formatError } from "../utils/web3";
import TxHash from "./TxHash";

export default function TransferForm() {
  const [{ wallet }] = useConnectWallet();

  const [amount, setAmount] = useState<number>(0);
  const [to, setTo] = useState<string>("");
  const [tx_hash, setTxHash] = useState<string>("");

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (ev) => {
      ev.preventDefault();

      if (!wallet) {
        alert("Connect Wallet first");
        return;
      }

      const value = parseEther(amount.toString());
      const from = wallet.accounts[0].address;

      const provider = new BrowserProvider(wallet.provider);
      let signer: JsonRpcSigner;
      try {
        signer = await provider.getSigner();
      } catch (e) {
        logger.error(e);
        alert("Failed to get signer");
        return;
      }

      let response: TransactionResponse;
      try {
        response = await signer.sendTransaction({ from, to, value });
      } catch (e) {
        alert(formatError(e, { ACTION_REJECTED: (e) => "sendTransaction was rejected" }));
        return;
      }

      const receipt = await response.wait();
      if (receipt) {
        setTxHash(receipt.hash);
      } else {
        logger.error("Transaction failed");
      }
    },
    [wallet, to, amount]
  );

  return (
    <form className="flex flex-col gap-0.5" onSubmit={onSubmit}>
      <button className="text-start" type="submit">
        <h2 className="text-lg underline font-mono">transfer</h2>
      </button>
      <label>
        {"To: "}
        <input
          onChange={(ev) => setTo(ev.target.value)}
          value={to}
          pattern="(0x)?[0-9A-Fa-f]{40}"
          required
          type="text"
        />
      </label>
      <label>
        {"Amount: "}
        <input
          onChange={(ev) => setAmount(ev.target.valueAsNumber)}
          value={amount}
          required
          type="number"
        />
        {" KLAY"}
      </label>

      <hr />
      <article>
        <header>Transaction Hash:</header>
        <TxHash>{tx_hash}</TxHash>
      </article>
    </form>
  );
}
