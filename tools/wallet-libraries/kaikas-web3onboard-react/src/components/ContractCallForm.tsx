import logger from "@/logger";
import { formatError } from "@/utils/web3";
import { useConnectWallet } from "@web3-onboard/react";
import { TransactionResponse } from "ethers";
import { JsonRpcSigner, parseEther } from "ethers";
import { BrowserProvider } from "ethers";
import { Contract } from "ethers";
import { FormEventHandler, useCallback, useState } from "react";
import TxHash from "./TxHash";

/**
 * @see https://baobab.klaytnfinder.io/account/0x043c471bee060e00a56ccd02c0ca286808a5a436
 *
 * Source code: https://github.com/klaytn/canonical-wklay
 */
const contract = new Contract("0x043c471bee060e00a56ccd02c0ca286808a5a436", [
  {
    constant: false,
    inputs: [],
    name: "deposit",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
]);

export default function ContractCallForm() {
  const [{ wallet }] = useConnectWallet();

  const [amount, setAmount] = useState<number>(0);
  const [tx_hash, setTxHash] = useState<string>("");

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (ev) => {
      ev.preventDefault();

      if (!wallet) {
        alert("Connect Wallet first");
        return;
      }

      const value = parseEther(amount.toString());

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
        const connected_contract = contract.connect(signer);
        response = await connected_contract.getFunction("deposit")({
          value,
        });
      } catch (e) {
        alert(formatError(e, { ACTION_REJECTED: (e) => "WKLAY.deposit was rejected" }));
        return;
      }

      const receipt = await response.wait();
      if (receipt) {
        setTxHash(receipt.hash);
      } else {
        logger.error("Transaction failed");
      }
    },
    [wallet, amount]
  );

  return (
    <form className="flex flex-col gap-0.5" onSubmit={onSubmit}>
      <button className="text-start" type="submit">
        <h2 className="text-lg underline">
          Contract Call (<span className="font-mono">WKLAY.deposit</span>)
        </h2>
      </button>
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
      <section>
        <header>Transaction Hash:</header>
        <TxHash>{tx_hash}</TxHash>
      </section>
    </form>
  );
}
